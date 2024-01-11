# coding: utf-8

from commons.datamapping    import DataMapping
from commons.dynamicapp     import DynamicApp
from model.model            import Model

class ParallelBatchModel(Model):
    """
    このクラスはModelクラスを継承する
    """


    def __init__(self, mlog, mlogname, database, endrowflg, requestdict):
        try:
            self.mlog     = mlog
            self.mlogname = mlogname
            self.mlog.debug(self.mlogname, 'ParallelBatchModel init start')

            # 利用する外部クラスをインスタンス
            self.datamapping = DataMapping()
            self.dynamicapp  = DynamicApp()

            # インスタンス変数を設定
            self.database    = database
            self.endrowflg   = endrowflg
            self.requestdict = requestdict


        except Exception as e:
            self.mlog.error(self.mlogname, f'ParallelBatchModel init exception message : {e}')

        finally:
            self.mlog.debug(self.mlogname, 'ParallelBatchModel init end')


    def fromRequestToSql(self, sqldict, temp_object):
        """
        SQL実行処理１（SQLデータからsql配列を取り出し実行する）

        Parameters
        ----------
        sqldict : dict
            SQLデータ（sql.json）
        temp_object : Class
            サーバプログラム実行用のモデルオブジェクト -> AppCache.getModelObject() の戻り値
        """
        try:
            for sql_info in sqldict['sqls']:
                # NEXTバッチ 処理判定１
                if sql_info['id'] == 'batchKey':
                    if self.endrowflg == 'OFF':
                        continue
                    
                # NEXTバッチ 処理判定２
                if sql_info['id'] == 'batchParam':
                    if self.endrowflg == 'OFF':
                        continue

                # sql入力レコードの編集
                self.editSqlInputData(sql_info, sqldict)

                # beforeメソッド処理
                result = self.dynamicapp.doBeforeAfterMethod('before', sql_info, temp_object)
                if result in('ERROR', 'ALLPASS'):
                    return

                # SQLの実行
                if result == 'OK':
                    self.doSql(sql_info, sqldict)
                    if sqldict['message']['status'] == 'ERROR':
                        return

                # afterメソッド処理
                result = self.dynamicapp.doBeforeAfterMethod('after', sql_info, temp_object)
                if result in('ERROR', 'ALLPASS'):
                    return

        except Exception as e:
            self.mlog.error(self.mlogname, f'ParallelBatchModel fromRequestToSql exception message : {e}')


    def call(self, json_cache, app_cache):
        """
        メイン処理（MainModel から呼び出される）

        Parameters
        ----------
        json_cache : dict
            SQL定義情報のキャッシュ -> JsonCache("sql.json")
        app_cache : dict
            モデルAPPのキャッシュ -> AppCache("model.py")

        Returns
        -------
        sqldict : dict
            SQL実行後のSQLデータ
        """
        try:
            self.mlog.debug(self.mlogname, 'ParallelBatchModel: call start')

            # SQLデータを設定
            self.mlog.debug(self.mlogname, 'ParallelBatchModel: SQLデータを設定 start')

            sqldict = json_cache.getJsonData(self.requestdict)

            self.mlog.debug(self.mlogname, 'ParallelBatchModel: SQLデータを設定 end')


            # サーバプログラム実行用のモデルオブジェクトを動的生成
            self.mlog.debug(self.mlogname, 'ParallelBatchModel: モデルオブジェクトを動的生成 start')

            #temp_object = app_cache.getModelObject(sqldict, self.requestdict) 2021/06/19
            temp_object = app_cache.getModelObject(self.database, sqldict, self.requestdict)

            self.mlog.debug(self.mlogname, 'ParallelBatchModel: モデルオブジェクトを動的生成 end')


            # SQLデータからSQL文を作成して実行
            self.mlog.debug(self.mlogname, 'ParallelBatchModel: SQLデータからSQL文を作成して実行 start')

            self.fromRequestToSql(sqldict, temp_object)

            self.mlog.debug(self.mlogname, 'ParallelBatchModel: SQLデータからSQL文を作成して実行 end')


            self.mlog.debug(self.mlogname, 'ParallelBatchModel: SQL実行エラー判定')
            if sqldict['message']['status'] == 'OK':
                self.mlog.debug(self.mlogname, 'ParallelBatchModel: SQL実行 ＯＫ行')
                #self.database.commit()
            else:
                self.mlog.debug(self.mlogname, 'ParallelBatchModel: SQL実行 エラー')
                raise Exception("ParallelBatchModel: SQL実行 エラー")
                #self.database.rollback()

            # SQLデータをリターン
            return sqldict

        except Exception as e:
            self.mlog.error(self.mlogname, f'ParallelBatchModel call exception message : {e}')
            sqldict['message']['status'] = 'ERROR'
            sqldict['message']['msg'] = e
            return sqldict

        finally:
            self.mlog.debug(self.mlogname, 'ParallelBatchModel: call end')
