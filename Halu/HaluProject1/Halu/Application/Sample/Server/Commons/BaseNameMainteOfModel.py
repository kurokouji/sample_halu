# coding: utf-8

from commons.jsonchunk import getjsonchunkbyid

class BaseNameMainte_model():
    """
    基本名称メンテナンス用のメソッドを保持する

    Attributes
    ----------
    requestdict : dict
        リクエストデータ
    sqldict : dict
        SQLデータ
    """
    def __init__(self, requestdict, sqldict):
        # インスタンス変数を設定
        self.requestdict = requestdict
        self.sqldict = sqldict

    def setData(self, requestId, sqlsId, idName):
        """
        SQLのキー項目にデータをセットする（DELETE/ UPDATE/ INSERT）

        Parameters
        ----------
        requestId : str
            セットする値を保持するリクエストデータのデータセットID
        sqlsId : str
            対象とするSQLデータのデータセットID
        idName : str
            対象とする項目名（キー項目）

        Returns
        -------
        result : str
            実行結果（'OK'/ 'PASS'）
        """
        # sqldict から対象のsqlIdのSQLタイプを取得する
        sqlInfo = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId)
        #set_type = sqlInfo['sql']['type']

        result = 'OK'
        # SQLタイプによって処理を分岐
        if sqlsId == 'delete':
            result = self.setDeleteData(requestId, sqlsId, idName)
        if sqlsId == 'update':
            result = self.setUpdateData(requestId, sqlsId, idName)
        if sqlsId == 'insert':
            result = self.setInsertData(requestId, sqlsId, idName)
        if sqlsId == 'insert_natural':
            result = self.setInsertNaturalData(requestId, sqlsId, idName)

        return result


    def setDeleteData(self, requestId, sqlsId, idName):
        """
        削除データを設定する
        """
        # self.mvclog.debug(self.mvclogname, 'BaseNameMainte_model setDeleteData start')

        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'input', 'record')

        deleteCheck = requestRecord['削除']['value']
        idData = requestRecord[idName]['value']
        maxLength = len(deleteCheck) - 1
        j = 0
        emptySW = 'PASS'
        for i in range(maxLength):
            if deleteCheck[i] != '9':
                continue
            if idData[i] == '':
                continue

            for key, value in requestRecord.items():
                if key in sqlRecord:
                    sqlRecord[key]['value'][j] = value['value'][i]
                    emptySW = 'OK'
            j = j + 1

        # self.mvclog.debug(self.mvclogname, f'BaseNameMainte_model setDeleteData end status = {emptySW}')
        return emptySW


    def setUpdateData(self, requestId, sqlsId, idName):
        """
        更新データを設定する
        """
        # self.mvclog.debug(self.mvclogname, 'BaseNameMainte_model setUpdateData start')

        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'input', 'record')

        idData = requestRecord[idName]['value']
        j = 0
        emptySW = 'PASS'
        for i in range(len(idData)):
            if idData[i] == '':
                continue

            for key, value in requestRecord.items():
                if key in sqlRecord:
                    if j == 0:
                        sqlRecord[key]['value'][0] = value['value'][i]
                    else:
                        sqlRecord[key]['value'].append(value['value'][i])
                    emptySW = 'OK'
            j += 1

        # self.mvclog.debug(self.mvclogname, f'BaseNameMainte_model setUpdateData end status = {emptySW}')
        return emptySW


    def setInsertData(self, requestId, sqlsId, idName):
        """
        登録データを設定する
        """
        # self.mvclog.debug(self.mvclogname, 'BaseNameMainte_model setInsertData start')

        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'input', 'record')

        idData = requestRecord[idName]['value']
        maxId = max([a for a in idData if a != ''], key=int)
        if maxId == '':
            maxId = 0
        j = 0
        emptySW = 'PASS'
        for i in range(len(idData)):
            if idData[i] != '':
                continue

            idData[i] = maxId + 1
            maxId += 1
            for key, value in requestRecord.items():
                if key in sqlRecord:
                    if j == 0:
                        sqlRecord[key]['value'][0] = value['value'][i]
                    else:
                        sqlRecord[key]['value'].append(value['value'][i])
                    emptySW = 'OK'
            j += 1

        # self.mvclog.debug(self.mvclogname, f'BaseNameMainte_model setInsertData end status = {emptySW}')
        return emptySW


    def setInsertNaturalData(self, requestId, sqlsId, idName):
        """
        登録データを設定する（自然キー用）
        """
        # self.mvclog.debug(self.mvclogname, 'BaseNameMainte_model setInsertNaturalData start')

        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'input', 'record')

        deleteCheck = requestRecord['削除']['value']
        maxLength = len(deleteCheck) - 1
        j = 0
        emptySW = 'PASS'
        for i in range(maxLength):
            if deleteCheck[i] != '9':
                continue

            for key, value in requestRecord.items():
                if key in sqlRecord:
                    sqlRecord[key]['value'][j] = value['value'][i]
                    emptySW = 'OK'
            j = j + 1

        # self.mvclog.debug(self.mvclogname, f'BaseNameMainte_model setInsertNaturalData end status = {emptySW}')
        return emptySW
