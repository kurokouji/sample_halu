# coding: utf-8

import queue
import msgpackrpc

from logger.halulogger      import HaluLogger
from halumain.haluconf      import HaluConf
from distributedserver.distributedservercontroller import DistirbutedServerController


class DistributedServer():
    """
    起動元：halumain/distributedserver.pyから起動される常駐型の分散サーバ（Queue管理）
    """
    
    def __init__(self):
        self.log   = HaluLogger('distributedserver')  # ログファイル名を設定
        self.log.debug('distributedserver', 'DistributedServer init start')

        # FIFOキューの作成
        self.fifo_queue = queue.Queue()

        # 分散サーバコントローラをインスタンスする
        self.distributedservercontroller = DistirbutedServerController(self.fifo_queue)

        self.log.debug('distributedserver', 'DistributedServer init end')


    def call_put(self, dbname, controll_id, division_number):
        """
        呼び出し元：HaluDistributedClientBatch
        仮引数：batchdict（プロジェクト名・コントロールID・分割数）
        戻り値：result（OK・ERROR）
        """

        try:
            self.log.debug('distributedserver', f'distributed server call_put start ＤＢ名           : {dbname}')
            self.log.debug('distributedserver', f'                                  並列分散管理ＩＤ : {controll_id}')
            self.log.debug('distributedserver', f'                                  分割数           : {division_number}')

            self.distributedservercontroller.call_put(dbname, controll_id, division_number)


        except Exception as e:
            self.log.error('distributedserver', f'distributed server call_put abnormal message : {e}')

        finally:
            self.log.debug('distributedserver', f'distributed server call_put end')


    def call_get(self):
        """
        呼び出し元：DistributedClientParallel
        仮引数：なし
        戻り値：paralleldict（ＤＢ名・並列分散管理ＩＤ・分割番号）
        """
        try:
            self.log.debug('distributedserver', 'distributed server call_get start')

            paralleldict = self.distributedservercontroller.call_get()


            return paralleldict
            
        except Exception as e:
            self.log.error('distributedserver', f'distributed server call_get abnormal message : {e}')

        finally:
            self.log.debug('distributedserver', f'distributed server call_get end responsedict : {paralleldict}')


class BatchDistributedClient():
    """
    BatchServer内でインスタンスされる

    呼び出し先：DistributedServerのcall_put
    実引数：batchdict（プロジェクト名・コントロールID・分割数）
    戻り値：result（OK・ERROR）
    """

    def __init__(self):
        hconf          = HaluConf()
        self.ipaddress = hconf.distributedserver_address
        self.port      = hconf.distributedserver_port


    def call(self, dbname, controll_id, division_number):
        client       = msgpackrpc.Client(msgpackrpc.Address(self.ipaddress, self.port), unpack_encoding='utf-8')

        # RPC サーバへリクエストデータを送信し、レスポンスデータを受け取る
        #responsedict = client.call('call', requestdict)
        future = client.call_async('call_put', dbname, controll_id, division_number)
        result = future.get()
        return result


class ParallelDistributedClient():
    """
    ParallelClient内でインスタンスされる

    呼び出し先：DistributedServerのcall_get
    戻り値：paralleldict（ＤＢ名・並列分散管理ＩＤ・分割番号）
    """

    def __init__(self):
        hconf          = HaluConf()
        self.ipaddress = hconf.distributedserver_address
        self.port      = hconf.distributedserver_port


    def call(self):
        client       = msgpackrpc.Client(msgpackrpc.Address(self.ipaddress, self.port), unpack_encoding='utf-8')

        # RPC サーバへリクエストデータを送信し、レスポンスデータを受け取る
        #responsedict = client.call('call')
        future       = client.call_async('call_get')
        paralleldict = future.get()
        return paralleldict

