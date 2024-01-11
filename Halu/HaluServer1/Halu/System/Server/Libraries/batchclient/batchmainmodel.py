# coding: utf-8

from logger.halulogger      import HaluLogger
from model.mainmodel        import MainModel
from batchclient.batchmodel import BatchModel

class BatchMainModel(MainModel):
    """
    このクラスはMainModelクラスを継承する
    """
    
    def __init__(self, mlog, mlogname, dlog, dlogname):
        
        super().__init__(mlog, mlogname, dlog, dlogname)


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
            self.mlog.debug(self.mlogname, f'MainModel: call start requestdict : {requestdict}')

            # モデルをインスタンスし、callを実行、SQLデータを取得する
            model = BatchModel(self.mlog, self.mlogname, self.dlog, self.dlogname, requestdict)
            sqldict = model.call(self.json_cache, self.app_cache)


            # SQLデータをコントローラへリターン
            self.mlog.debug(self.mlogname, f'MainModel: モデルが処理した sqldict : {sqldict}')

            return sqldict

        except Exception as e:
            self.mlog.error(self.mlogname, f'MainModel call exception message : {e}')

        finally:
            self.mlog.debug(self.mlogname, 'MainModel: call end\n')
