# coding: UTF-8

from MasterMainteOfViewMixin import MasterMainte_view

class OrderList_view():
    def __init__(self, mvclog, mvclogname, responsedict, sqldict, requestdict):
        try:
            self.mvclog     = mvclog
            self.mvclogname = mvclogname
            self.mvclog.debug(self.mvclogname, 'OrderList_view init start')

            self.responsedict = responsedict
            self.sqldict      = sqldict
            self.requestdict  = requestdict

        except Exception as e:
            self.mvclog.debug(self.mvclogname, 'OrderList_view init exception message : {e}')

        finally:
            self.mvclog.debug(self.mvclogname, 'OrderList_view init end')

     # カレントページ数とページ当りの行数を使って、オフセット行数を計算する
    def getMaxPageCountOfOrderList(self, idName):
        """
        MasterMainteOfView を呼び出す
        """
        self.mvclog.debug(self.mvclogname, 'OrderList_view getMaxPageCountOfUserList start')

        tempObj = MasterMainte_view(self.responsedict)
        status  = tempObj.getMaxPageCount(idName)

        self.mvclog.debug(self.mvclogname, 'OrderList_view getMaxPageCountOfUserList end')
        return status

