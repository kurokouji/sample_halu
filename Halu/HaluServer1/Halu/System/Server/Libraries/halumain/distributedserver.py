# coding: utf-8

import msgpackrpc

from halumain.haluconf            import HaluConf
from halurpc.distributedserverrpc import DistributedServer


"""
常駐型の分散バッチサーバを立ち上げる

分散バッチサーバ：halurpc/distributedserverrpcのHaluDistributedServerクラス
"""

hconf  = HaluConf()
server = msgpackrpc.Server(DistributedServer(), unpack_encoding='utf-8')
server.listen(msgpackrpc.Address(hconf.distributedserver_address, hconf.distributedserver_port))


print("*** halu distributed server start ***")
server.start()
