# coding: utf-8

import json
import msgpackrpc

from logger.halulogger                 import HaluLogger
from halumain.haluconf                 import HaluConf
from batchserver.batchservercontroller import BatchServerController


class BatchServer():
    """
    起動元：halumain/batchserver.pyから起動される常駐型のバッチサーバ

    呼び出し元：BatchClient
    仮引数：sqldict
    戻り値：result（OK・ERROR）

    sqldictのid=batchkey , batchparam にバッチキー情報とバッチパラメータ情報が設定されている

    """
    
    def __init__(self):
        self.bserverlog     = HaluLogger('batchserver')  # ログファイル名を設定
        self.bserverlogname = 'batchserver'

        self.bserverlog.debug(self.bserverlogname, 'BatchServer init start')

        self.bserverlog.debug(self.bserverlogname, 'BatchServer init end')

    def call(self, sqldict):
        try:
            self.bserverlog.debug(self.bserverlogname, f'BatchServer call start sqldict   : {sqldict}')

            result = 'OK'
            batchservercontroller = BatchServerController(self.bserverlog, self.bserverlogname)
            batchservercontroller.call(sqldict)

            return result

        except Exception as e:
            self.bserverlog.error(self.bserverlogname, f'BatchServer abnormal message : {e}')

        finally:
            self.bserverlog.debug(self.bserverlogname, f'BatchServer call end responsedict : {result}')


class BatchClient():
    """
    バッチ用モデル内でインスタンスされる

    呼び出し先：BatchServer
    実引数：sqldict
    戻り値：result（OK・ERROR）
    """

    def __init__(self):
        hconf          = HaluConf()
        self.ipaddress = hconf.batchserver_address
        self.port      = hconf.batchserver_port


    def call(self, sqldict):
        client       = msgpackrpc.Client(msgpackrpc.Address(self.ipaddress, self.port), unpack_encoding='utf-8')

        # RPC サーバへリクエストデータを送信し、レスポンスデータを受け取る
        #responsedict = client.call('call', sqldict)
        future       = client.call_async('call', sqldict)
        result = future.get()
        return result
