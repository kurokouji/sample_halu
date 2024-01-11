# coding: utf-8

from commons.jsonchunk import getjsonchunkbyid

class MasterMainte_model():
    """
    基本名称メンテナンス用のメソッドを保持する

    Attributes
    ----------
    requestdict : dict
        リクエストデータ
    sqldict : dict
        SQLデータ
    """
    def __init__(self, requestdict, sqldict, mvclog, mvclogname):
        # インスタンス変数を設定
        self.requestdict = requestdict
        self.sqldict = sqldict
        self.mvclog     = mvclog
        self.mvclogname = mvclogname


    def isEmptyPassForRequestData(self, requestId, dataName):
        """
        リクエストデータが空か（空の時、パス）
        """
        self.mvclog.debug(self.mvclogname, 'MasterMainte_model isEmptyPassForRequestData start')

        status = 'OK'
        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')

        if requestRecord[dataName]['value'][0] == '':
            status = 'PASS'

        self.mvclog.debug(self.mvclogname, f'MasterMainte_model isEmptyPassForRequestData end status = {status}')
        return status

    def notEmptyPassForRequestData(self, requestId, dataName):
        """
        リクエストデータが設定されているか（NOT 空の時、パス）
        """
        # MvcLogger.mlog.debug('model', 'MasterMainte_model notEmptyPassForRequestData start')

        status = 'OK'
        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')

        if requestRecord[dataName]['value'][0] != '':
            status = 'PASS'

        # MvcLogger.mlog.debug('model', f'MasterMainte_model notEmptyPassForRequestData end status = {status}')
        return status

    def isEmptyPassForSqlsData(self, sqlsId, dataName):
        """
        sqlsの出力データが空か（空の時、パス）
        """
        # MvcLogger.mlog.debug('model', 'MasterMainte_model isEmptyPassForSqlsData start')

        status = 'OK'
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'output', 'record')

        if sqlRecord[dataName]['value'][0] == '':
            status = 'PASS'

        # MvcLogger.mlog.debug('model', f'MasterMainte_model isEmptyPassForSqlsData end status = {status}')
        return status

    def notEmptyPassForSqlsData(self, sqlsId, dataName):
        """
        sqlsの出力データが空でないかか（NOT 空の時、パス）
        """
        # MvcLogger.mlog.debug('model', 'MasterMainte_model notEmptyPassForSqlsData start')

        status = 'OK'
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'output', 'record')

        if sqlRecord[dataName]['value'][0] != '':
            status = 'PASS'

        # MvcLogger.mlog.debug('model', f'MasterMainte_model notEmptyPassForSqlsData end status = {status}')
        return status

    def getOffsetLine(self, idName1, idName2):
        """
        カレントページ数とページ当りの行数を使って、オフセット行数を計算する
        """
        self.mvclog.debug(self.mvclogname, 'MasterMainte_model getOffsetLine start')
        requestRecord   = getjsonchunkbyid(self.requestdict, 'records', idName1)
        page_line       = int(requestRecord['record']['ページライン数']['value'][0])
        cur_page        = int(requestRecord['record']['カレントページ']['value'][0])
        offset_line     = (cur_page - 1) * page_line

        sqlRecord   = getjsonchunkbyid(self.sqldict, 'sqls', idName2, 'input')
        sqlRecord['record']['オフセットライン数']['value'][0] = str(offset_line)

        self.mvclog.debug(self.mvclogname, 'MasterMainte_model getOffsetLine end')
        return 'OK'