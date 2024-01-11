# coding: utf-8

import json
import msgpackrpc

from logger.halulogger                     import HaluLogger
from halumain.haluconf                     import HaluConf
from printserver.printclientmodel          import PrintClientModel
from printserver.printservermaincontroller import PrintServerMainController


class PrintServer():
    """
    起動元：halumain/printserver.pyから起動される常駐型のプリントサーバ

    呼び出し元：PrintClient
    仮引数：printparam
    戻り値：responsedict
    """
    
    def __init__(self):
        self.log   = HaluLogger('printserver')  # ログファイル名を設定

        
    def call(self, printparam):
        try:
            self.log.debug('printserver', f'print server start printparam : {printparam}')


            printservermaincontroller = PrintServerMainController()
            responsedict = printservermaincontroller.call(printparam)

            return responsedict

        except Exception as e:
            self.log.error('printserver', f'print server abnormal message : {e}')

        finally:
            self.log.debug('printserver', f'print server end responsedict : {responsedict}')


class PrintClientOnline():
    """
    オンラインプリント

    呼び出し先：PrintServer
    printparam
    戻り値：responsedict
    """

    def __init__(self, ipaddress=None, port=None):
        hconf          = HaluConf()
        self.ipaddress = hconf.printserver_address
        self.port      = hconf.printserver_port


    def call(self, printparam):
        client       = msgpackrpc.Client(msgpackrpc.Address(self.ipaddress, self.port), unpack_encoding='utf-8')

        # RPC プリントサーバへプリントパラメータを送信し、レスポンスデータを受け取る
        #responsedict = client.call('call', printparam)
        future       = client.call_async('call', printparam)
        responsedict = future.get()
        return responsedict


class PrintClientBatch():
    """
    バッチプリント

    呼び出し先：PrintServer
    printparam
    戻り値：responsedict
    """

    def __init__(self, ipaddress=None, port=None):
        hconf          = HaluConf()
        self.ipaddress = hconf.printserver_address
        self.port      = hconf.printserver_port


    def call(self, printparam, paralleldict):
        client       = msgpackrpc.Client(msgpackrpc.Address(self.ipaddress, self.port), unpack_encoding='utf-8')

        # RPC プリントサーバへプリントパラメータを送信し、レスポンスデータを受け取る
        #responsedict = client.call('call', printparam)
        future       = client.call_async('call', printparam)
        responsedict = future.get()

        # 並列帳票管理テーブルに帳票情報を登録する
        printclientmodel = PrintClientModel()
        printclientmodel.call(responsedict, paralleldict)

        return responsedict
