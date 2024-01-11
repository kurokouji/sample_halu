# coding: utf-8

from BaseNameMainteOfModel import BaseNameMainte_model

class CustomerListMainte_model():
    def __init__(self, mvclog, mvclogname, database, sqldict, requestdict):
        try:
            self.mvclog     = mvclog
            self.mvclogname = mvclogname
            self.mvclog.debug(self.mvclogname, 'CustomerListMainte_model init start')

            # インスタンス変数を設定
            self.database = database
            self.sqldict = sqldict
            self.requestdict = requestdict

        except Exception as e:
            self.mvclog.error(self.mvclogname, f'CustomerListMainte_model init exception message : {e}')

        finally:
            self.mvclog.debug(self.mvclogname, 'CustomerListMainte_model init end')


    def setData(self, requestId, sqlsId, idName):
        """
        SQLにデータをセットする（BaseNameMainteOfModelMixin）
        """
        self.mvclog.debug(self.mvclogname, 'CustomerListMainte_model setData start')

        tempObj = BaseNameMainte_model(self.requestdict, self.sqldict)
        status = tempObj.setData(requestId, sqlsId, idName)

        self.mvclog.debug(self.mvclogname, f'CustomerListMainte_model setData end status = {status}')
        return status