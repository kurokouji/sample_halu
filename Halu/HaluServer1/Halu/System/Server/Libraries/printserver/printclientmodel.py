# coding: utf-8

import json

from logger.halulogger      import HaluLogger
from database.database      import Database

class PrintClientModel():
    """
    以下のテーブルを登録する
    ・並列帳票管理 テーブル
    """


    def __init__(self):
        self.log   = HaluLogger('printclient')  # ログファイル名を設定
        self.log.debug('printclient', 'PrintClientModel init start')

        # ＤＢクラスのインスタンス
        self.database = Database()

        self.log.debug('printclient', 'PrintClientModel init end')

    def call(self, responsedict, paralleldict):
        # ＤＢ名を設定する
        dbname = paralleldict['dbname']

        try:
            # ＤＢ接続要求
            self.database.create_engine(dbname)
    
            # コネクション取得
            self.database.connection(dbname)
    
            # トランザクション開始
            self.database.begin(dbname)

            # 並列帳票管理 テーブル登録
            self.parallelprintcontroll(responsedict, paralleldict)

            # コミット
            self.database.commit()
        except:
            # ロールバック
            self.database.rollback()
            raise
        finally:
            # コネクションをクローズ
            self.database.close()

                
    # 並列帳票管理 テーブルの登録
    def parallelprintcontroll(self, responsedict, paralleldict):
        # ＤＢ名を設定する
        dbname      = paralleldict['dbname']
        controll_id = paralleldict['controll_id']

        # テーブル名を設定する
        str_sql1        = "INSERT INTO parallel_print_controll"
  
        # 列名を設定する
        str_sql2        = " (parallel_controll_id, print_name, print_file_name, output_times)"
  
        # 値を設定する
        print_name      = responsedict["pdfinfo"]["pdfname"]
        print_file_name = responsedict["pdfinfo"]["pdffile"]
        str_sql3        = f" VALUES ({controll_id}, '{print_name}', '{print_file_name}', '0')"

        # INSERT文を生成する
        str_sql         = str_sql1 + str_sql2 + str_sql3
        self.database.execute(dbname, str_sql)






