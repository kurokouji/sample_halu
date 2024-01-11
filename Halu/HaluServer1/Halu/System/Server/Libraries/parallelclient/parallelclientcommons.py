# coding: utf-8

import json

from logger.halulogger      import HaluLogger
from halumain.haluconf      import HaluConf

class ParallelClientCommons():
    """
    
    """


    def __init__(self):
        self.log   = HaluLogger('parallelclient')  # ログファイル名を設定
        self.log.debug('parallelclient', 'ParallelClient Commons init start')

        self.hconf  = HaluConf()

        self.log.debug('parallelclient', 'ParallelClient Commons init end')

    def getjsondata(self, loadpass, mode):
        file_name = self.hconf.apppath + '/' + loadpass + '_' + mode + '_tran.json'

        with open(file_name, mode='rb') as f:
            tran_data = f.read()
            trandict  = json.loads(tran_data)

        return trandict


    def getstartrow_endrow(self, paralleldict, keydict):
        # キーの行数を取得する
        maxsize  = 0
        tempsize = 0
        for value in keydict.values():
            tempsize = len(value['value'])
            if tempsize > maxsize:
                maxsize = tempsize

        w_分割番号  = paralleldict['split_number']
        w_分割数    = paralleldict['division_number']

        w_処理行数 = maxsize // w_分割数
        w_余り行数 = maxsize  % w_分割数
        w_開始行   = (w_分割番号 - 1) * w_処理行数 + 1
        w_終了行   = w_分割番号 * w_処理行数

        if w_分割数 == w_分割番号:
            w_終了行 = w_終了行 + w_余り行数

        return w_開始行, w_終了行, maxsize


    def getjsonchunkbyid(self, jsondict, listname, idname):
        recorddict = {}

        if listname == 'records':
            for recordinfo in jsondict['records']:
                if recordinfo['id'] == idname:
                    return recordinfo

        if listname == 'sqls':
            for recordinfo in jsondict['sqls']:
                if recordinfo['id'] == idname:
                    return recordinfo

        return recorddict



        


        
