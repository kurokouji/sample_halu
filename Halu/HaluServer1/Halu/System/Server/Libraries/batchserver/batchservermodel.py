# coding: utf-8

import json

from logger.halulogger      import HaluLogger
from model.model            import Model
from database.database      import Database

class BatchServerModel():
    """
    以下のテーブルを登録する
    ・並列分散管理 テーブル
    ・並列分割管理 テーブル
    ・並列分散キー テーブル
    ・並列分散パラメータ テーブル
    """


    def __init__(self):
        self.bserverlog     = HaluLogger('batchservermodel')  # ログファイル名を設定
        self.bserverlogname = 'batchservermodel'

        # ＤＢクラスのインスタンス
        self.database = Database(self.bserverlog, self.bserverlogname)

        self.log.debug('batchserver', 'BatchServer Model init end')


    def call(self, sqldict):
        # ＤＢ名を設定する
        dbname = sqldict['dbname']

        # parallelControllにdbnameの指定が有る時は、そちらを優先する
        for row in sqldict['sqls']:
            if row['id'] == 'parallelControll':
                if 'dbname' in row:
                  dbname = row['dbname']
                break

        try:
            self.database.create_engine(dbname)
            self.database.connection(dbname)
            self.database.begin(dbname)

            # 並列分散管理 テーブル登録
            controll_id = self.parallelcontroll(dbname, row)

            # 並列分割管理 テーブル登録
            division_number = self.paralleldivision(dbname, row, controll_id)


            for row in sqldict['sqls']:
                if row['id'] == 'parallelKey':
                    # 並列分散キー テーブル登録
                    self.parallelkey(dbname, row, controll_id)
                    continue
    
                if row['id'] == 'parallelParam':
                    # 並列分散パラメータ テーブル登録
                    self.parallelparam(dbname, row, controll_id)
                    continue

            # コミット
            self.database.commit()
        except:
            # ロールバック
            self.database.rollback()
            raise
        finally:
            # コネクションをクローズ
            self.database.close()

        distributeddict = {}
        distributeddict['dbname']          = dbname
        distributeddict['controll_id']     = controll_id
        distributeddict['division_number'] = division_number
        
        return distributeddict
        
                
    def parallelcontroll(self, dbname, row):
        """
        並列分散管理 テーブルの登録
        """
        controllrecord = row['input']['record']

        str_sql1 = "INSERT INTO parallel_controll"
        str_sql2 = " (parallel_controll_id"
        str_sql3 = " VALUES (NEXTVAL('parallel_controll_parallel_controll_id_seq')"

        for key, value in controllrecord.items():
            if key == "parallel_controll_id":
                continue
            else:
                str_sql2 += f", {key}"
                if type(value['value'][0]) == int:
                    str_sql3 += f", {value['value'][0]}"
                else:
                    str_sql3 += f", '{value['value'][0]}'"

        str_sql = str_sql1 + str_sql2 + ")" + str_sql3 + ")"
        self.database.execute(dbname, str_sql)


        # 登録した並列分散管理テーブルの並列分散管理IDを取得する
        str_sql9 = "SELECT CURRVAL('parallel_controll_parallel_controll_id_seq')"
        result   = self.database.execute(dbname, str_sql9)
        for row in result:
            for key, value in row.items():
                controll_id = value
                break

        return controll_id


    def paralleldivision(self, dbname, row, controll_id):
        """
        並列分割管理 テーブル登録
        """
        division_number = int(row['input']['record']['division_number']['value'][0])

        str_sql1 = "INSERT INTO parallel_division_controll"
        str_sql2 = " (parallel_controll_id, parallel_division_id)"

        for i in range(division_number):
            str_sql3 = f" VALUES ({controll_id}, {i + 1})"

            str_sql = str_sql1 + str_sql2 + str_sql3
            self.database.execute(dbname, str_sql)
        
        return division_number


    def parallelkey(self, dbname, row, controll_id):
        """
        並列分散キー テーブル登録
        """
        keyrecord = row['input']['record']

        str_sql1 =  "INSERT INTO parallel_keyvalue"
        str_sql2 =  " (parallel_controll_id, json_data)"
        str_sql3 = f" VALUES ({controll_id}, '{json.dumps(keyrecord)}')"

        str_sql  = str_sql1 + str_sql2 + str_sql3
        self.database.execute(dbname, str_sql)


    def parallelparam(self, dbname, row, controll_id):
        """
        並列分散パラメータ テーブル登録
        """
        paramrecord = row['input']['record']

        str_sql1 =  "INSERT INTO parallel_param"
        str_sql2 =  " (parallel_controll_id, json_data)"
        str_sql3 = f" VALUES ({controll_id}, '{json.dumps(paramrecord)}')"

        str_sql  = str_sql1 + str_sql2 + str_sql3
        self.database.execute(dbname, str_sql)






