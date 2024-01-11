# coding: utf-8

from logger.halulogger            import HaluLogger
from batchserver.batchservermodel import BatchServerModel
from halurpc.distributedserverrpc import BatchDistributedClient

class BatchServerController():
    """
    
    """


    def __init__(self, bserverlog, bserverlogname):
        self.bserverlog     = bserverlog
        self.bserverlogname = bserverlogname

        self.bserverlog.debug(self.bserverlogname, 'BatchServerController init start')

        self.bserverlog.debug(self.bserverlogname, 'BatchServerController init end')

    def call(self, sqldict):
        self.bserverlog.debug(self.bserverlogname, 'BatchServerController call start')

        # バッチサーバモデルをインスタンし、callメソッドを実行する
        # 並列分散管理の関連テーブルを登録する
        batchservermodel  = BatchServerModel()
        distributeddict   = batchservermodel.call(sqldict)

        # 分散バッチクライアントをインスタンし、callメソッドを実行する
        # 結果として、分散サーバに接続され、call_putメソッドが実行される
        distributedclient = BatchDistributedClient()
        distributedclient.call(distributeddict['dbname'], distributeddict['controll_id'], distributeddict['division_number'])
        
        self.bserverlog.debug(self.bserverlogname, 'BatchServerController call end')
