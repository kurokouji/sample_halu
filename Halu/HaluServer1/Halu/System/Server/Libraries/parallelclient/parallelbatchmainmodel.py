# coding: utf-8

from logger.halulogger                     import HaluLogger
from database.database                     import Database
from parallelclient.parallelclientcommons  import ParallelClientCommons
from parallelclient.parallelbatchmodel     import ParallelBatchModel
from commons.jsoncache                     import JsonCache
from commons.appcache                      import AppCache

class ParallelBatchMainModel():
    """
    keydict
        バッチ処理のキー情報が全件格納されている
    startrow
        keydictの処理開始行
    endrow
        keydictの処理終了行
    maxkeynumber
       バッチキーの最大行数
    endbatchflg
       最終バッチ処理フラグ ON:最終バッチ OFF:途中のバッチ
    """
    
    def __init__(self, keydict, startrow, endrow, endbatchflg):
        self.pblog        = HaluLogger('parallelbatchmodel')
        self.pblogname    = 'parallelbatchmodel'
        self.pblog.debug(self.pblogname, 'ParallelBatchMainModel init start')

        self.pdlog        = HaluLogger('parallelbatchdatabase')
        self.pdlogname    = 'parallelbatchdatabase'
        self.database     = Database(self.pdlog, self.pdlogname)

        self.keydict      = keydict
        self.startrow     = startrow
        self.endrow       = endrow
        self.endbatchflg  = endbatchflg
        
        # 利用する外部クラスをインスタンス
        self.json_cache   = JsonCache(self.mlog, self.mlogname, 'sql.json')
        self.app_cache    = AppCache(self.mlog, self.mlogname, 'model.py')

        self.pblog.debug(self.pblogname, 'ParallelBatchMainModel init end')


    def call(self, requestdict):
        """
        メイン処理（コントローラから呼び出される）

        Parameters
        ----------
        requestdict ： dict
            リクエストデータ

        Returns
        -------
        sqldict ： dict
            SQLデータ -> model.call の戻り値
        """
        try:
            self.pblog.debug(self.pblogname, f'ParallelBatchMainModel: call start requestdict : {requestdict}')

            # 開始行から終了行まで、モデル処理を繰り返す
            for row in range(self.startrow, self.endrow, 1):
                # requestのparallelKeyにキー値をセットする
                keyinfo = self.parallelclientcommons.getjsonchunkbyid(requestdict, 'records', 'parallelKey')
                for key, value in self.keydict.items():
                    if key in keyinfo['record'].keys():
                        keyinfo['record'][key]['value'][0] = value['value'][row]

                # 最終行の処理判定
                endrowflg = 'OFF'
                if self.endbatchflg == 'ON':
                    if row == self.endrow:
                        endrowflg = 'ON'

                model = ParallelBatchModel(self.pblog, self.pblogname, self.database, endrowflg, requestdict)
                sqldict = model.call(self.json_cache, self.app_cache)


            self.mlog.debug(self.mlogname, 'ParallelBatchMainModel: SQL実行 ＯＫ コミットを実行')
            self.database.commit()

            return sqldict

        except Exception as e:
            self.mlog.debug(self.mlogname, 'ParallelBatchMainModel: SQL実行 エラー ロールバックを実行')
            self.database.rollback()
            self.pblog.error(self.pblogname, f'ParallelBatchMainModel call exception message : {e}')

        finally:
            # コネクションをクローズ
            self.pblog.debug(self.pblogname, 'ParallelBatchMainModel: コネクションをクローズ')
            self.database.close()
            self.pblog.debug(self.pblogname, 'ParallelBatchMainModel: call end\n')
