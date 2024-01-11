# coding: utf-8

from logger.halulogger      import HaluLogger
from model.model            import Model
from halurpc.batchserverrpc import BatchClient

class BatchModel(Model):
    """
    このクラスはModelクラスを継承する
    """


    def __init__(self, mlog, mlogname, dlog, dlogname, requestdict):

        super().__init__(mlog, mlogname, dlog, dlogname, requestdict)


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
                # sql入力レコードの編集
                self.editSqlInputData(sql_info, sqldict)

                # バッチ処理開始
                if sql_info['id'] == 'parallelControll':
                    batchclient = BatchClient()
                    result = batchclient.call(sqldict)
                    if result == 'OK':
                        return

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
            self.mlog.error(self.mlogname, f'Model fromRequestToSql exception message : {e}')

