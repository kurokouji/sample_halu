# coding: utf-8

import json

from logger.halulogger      import HaluLogger
from database.database      import Database

class ParallelClientModel():
    """
    
    """


    def __init__(self, pmlog, pmlogname):
        self.pmlog     = pmlog
        self.pmlogname = pmlogname
        
        self.pmlog.debug(self.pmlogname, 'ParallelClientModel init start')

        self.pmlog.debug(self.pmlogname, 'ParallelClientModel init end')


    def call_start_datetime(self, database, paralleldict):
        try:
            database.create_engine(paralleldict['dbname'])
            database.connection(paralleldict['dbname'])
            database.begin(paralleldict['dbname'])


            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分散管理 テーブル 開始日時の更新 start')
            self.parallelcontroll_start_datetime(database, paralleldict)
            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分散管理 テーブル 開始日時の更新 end')


            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分割管理 テーブル 開始日時の更新 start')
            self.paralleldivision_start_datetime(database, paralleldict)
            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分割管理 テーブル 開始日時の更新 end')

            database.commit()
        except:
            database.rollback()
            raise
        finally:
            database.close()


    def call_end_datetime(self, database, paralleldict):
        try:
            database.create_engine(paralleldict['dbname'])
            database.connection(paralleldict['dbname'])
            database.begin(paralleldict['dbname'])


            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分割管理 テーブル 終了日時の更新 start')
            self.paralleldivision_end_datetime(database, paralleldict)
            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分割管理 テーブル 終了日時の更新 end')


            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分散管理 テーブル 終了日時の更新 start')
            self.parallelcontroll_end_datetime(database, paralleldict)
            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分散管理 テーブル 終了日時の更新 end')


            database.commit()
        except:
            database.rollback()
            raise
        finally:
            database.close()

    def call_parallelinfo(self, database, paralleldict):
        try:
            database.create_engine(paralleldict['dbname'])
            database.connection(paralleldict['dbname'])
            database.begin(paralleldict['dbname'])


            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分散管理テーブル（ロードパス名・処理モード）を読み込み start')
            loadpass, mode = self.parallelcontroll_loadpass(database, paralleldict)
            self.pmlog.debug(self.pmlogname, f'ParallelClientModel 並列分散管理テーブル ロードパス名：{loadpass}')
            self.pmlog.debug(self.pmlogname, f'ParallelClientModel 並列分散管理テーブル   処理モード：{mode}')


            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分散キーテーブル（json_data）を読み込み start')
            key_json = self.parallel_keyvalue(database, paralleldict)
            keydict  = json.loads(key_json)
            self.pmlog.debug(self.pmlogname, f'ParallelClientModel 並列分散キーテーブル json：{keydict}')


            self.pmlog.debug(self.pmlogname, 'ParallelClientModel 並列分散パラメータテーブル（json_data）を読み込み start')
            param_json = self.parallel_param(database, paralleldict)
            paramdict  = json.loads(param_json)
            self.pmlog.debug(self.pmlogname, f'ParallelClientModel 並列分散パラメータテーブル json：{paramdict}')
            

            database.commit()

            return loadpass, mode, keydict, paramdict
        except:
            database.rollback()
            raise
        finally:
            database.close()


    # 並列分散管理 テーブル 開始日時の更新
    def parallelcontroll_start_datetime(self, database, paralleldict):
        if paralleldict['split_number'] == 1:
            str_sql  =  "UPDATE parallel_controll SET start_datetime = current_timestamp"
            str_sql += f" WHERE parallel_controll_id = {paralleldict['controll_id']}"

            database.execute(paralleldict['dbname'], str_sql)


    # 並列分散管理 テーブル 終了日時の更新
    def parallelcontroll_end_datetime(self, database, paralleldict):
        # 分割処理終了数を取得する
        w_分割処理終了数 = self.parallelcontroll_endnumber(database, paralleldict) + 1

        if paralleldict['division_number'] == w_分割処理終了数:
            str_sql  =  "UPDATE parallel_controll SET end_datetime = current_timestamp"
            str_sql += f" WHERE parallel_controll_id = {paralleldict['controll_id']}"
            
            database.execute(paralleldict['dbname'], str_sql)


    # 並列分割管理 テーブル 開始日時の更新
    def paralleldivision_start_datetime(self, database, paralleldict):
        str_sql  =  "UPDATE parallel_division_controll SET start_datetime = current_timestamp"
        str_sql += f" WHERE parallel_controll_id = {paralleldict['controll_id']} AND parallel_division_id = {paralleldict['split_number']}"

        database.execute(paralleldict['dbname'], str_sql)


    # 並列分割管理テーブル 終了日時の更新＆並列分散管理テーブル 分割処理終了数の更新
    def paralleldivision_end_datetime(self, database, paralleldict):
        str_sql  =  "UPDATE parallel_division_controll SET end_datetime = current_timestamp"
        str_sql += f" WHERE parallel_controll_id = {paralleldict['controll_id']} AND parallel_division_id = {paralleldict['split_number']}"

        database.execute(paralleldict['dbname'], str_sql)

        # 分割処理終了数を取得する
        w_分割処理終了数 = self.parallelcontroll_endnumber(database, paralleldict) + 1

        # 分割処理終了数を更新する
        str_sql  = f"UPDATE parallel_controll SET division_end_number = {w_分割処理終了数}"
        str_sql += f" WHERE parallel_controll_id = {paralleldict['controll_id']}"
            
        database.execute(paralleldict['dbname'], str_sql)


    # 並列分散管理テーブル 分割処理終了数を読み込み
    def parallelcontroll_endnumber(self, database, paralleldict):
        str_sql  = "SELECT division_end_number FROM parallel_controll"
        str_sql += f" WHERE parallel_controll_id = {paralleldict['controll_id']}"

        result = database.execute(paralleldict['dbname'], str_sql)
        return result[0]['division_end_number']


    # 並列分散管理テーブル（ロードパス名・処理モード）を読み込み
    def parallelcontroll_loadpass(self, database, paralleldict):
        str_sql  = "SELECT process_html, process_mode FROM parallel_controll"
        str_sql += f" WHERE parallel_controll_id = {paralleldict['controll_id']}"

        result = database.execute(paralleldict['dbname'], str_sql)
        return result[0]['process_html'], result[0]['process_mode']


    # 並列分散キーテーブル（json_data）を読み込み
    def parallel_keyvalue(self, database, paralleldict):
        str_sql  = "SELECT json_data FROM parallel_keyvalue"
        str_sql += f" WHERE parallel_controll_id = {paralleldict['controll_id']}"

        result = database.execute(paralleldict['dbname'], str_sql)
        return result[0]['json_data']


    # 並列分散パラメータテーブル（json_data）を読み込み
    def parallel_param(self, database, paralleldict):
        str_sql  = "SELECT json_data FROM parallel_param"
        str_sql += f" WHERE parallel_controll_id = {paralleldict['controll_id']}"

        result = database.execute(paralleldict['dbname'], str_sql)
        return result[0]['json_data']


