# coding: utf-8

from commons.jsonchunk import getjsonchunkbyid

class MasterMainte_view():
    """
    基本名称メンテナンス用のメソッドを保持する

    Attributes
    ----------
    requestdict : dict
        リクエストデータ
    sqldict : dict
        SQLデータ
    """
    def __init__(self, responsedict):
        # インスタンス変数を設定
        self.responsedict = responsedict


    def getMaxPageCount(self, idName):
        """
        総件数とページ当りの行数を使って、総ページ数を計算する
        """
        responseRecord   = getjsonchunkbyid(self.responsedict, 'records', idName)
        page_line        = int(responseRecord['record']['ページライン数']['value'][0])
        total_count      = int(responseRecord['record']['トータル件数']['value'][0])

        if total_count == 0:
            max_page    = 1
        else:
            max_page    = ((total_count + (page_line - 1)) // page_line)

        responseRecord['record']['最大ページ']['value'][0] = max_page

        return 'OK'