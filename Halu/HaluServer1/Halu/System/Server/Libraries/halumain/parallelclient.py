# coding: utf-8

import time

from logger.halulogger                       import HaluLogger
from halurpc.distributedserverrpc            import ParallelDistributedClient
from parallelclient.parallelclientcontroller import ParallelClientController

class ParallelClient():
    """
    常駐型の並列バッチ（複数立ち上げ）
    処理１：分散サーバに接続し、分割情報（ＤＢ名・並列分散管理ＩＤ・分割番号）を取得する
    処理２：並列コントローラを呼び出し、バッチ処理を実行する
    """


    def __init__(self):
        self.pclog     = HaluLogger('parallelclient')
        self.pclogname = 'parallelclient'

        self.pclog.debug(self.pclogname, 'ParallelClient init start')


        self.pclog.debug(self.pclogname, 'ParallelClient init end')
        

    def call(self):
        self.pclog.debug(self.pclogname, 'ParallelClient start')

        try:
            
            while True:
                self.pclog.debug(self.pclogname, 'ParallelClient 分散サーバに接続')
                paralleldistributedclient = ParallelDistributedClient()
                paralleldict = paralleldistributedclient.call()
                if paralleldict['dbname'] == 'empty':
                    self.pclog.debug(self.pclogname, 'ParallelClient 分散サーバ データなし')
                    time.sleep(10)
                    continue


                self.pclog.debug(self.pclogname, f'parallelclient 分散サーバから取得した分割情報 : {paralleldict}')

    
                self.pclog.debug(self.pclogname, 'ParallelClient バッチ処理 実行開始')
                parallelclintcontroller = ParallelClientController()
                parallelclintcontroller.call(paralleldict)
                self.pclog.debug(self.pclogname, 'ParallelClient バッチ処理 実行終了')
    
        except Exception as e:
                self.pclog.debug(self.pclogname, 'ParallelClient 異常終了')
                self.pclog.debug(self.pclogname, f'parallelclient abnormal message : {e}')

        self.pclog.debug(self.pclogname, 'parallelclient end')

# ---------------------------
#    分散並列バッチ 開始
# ---------------------------
def main():
    print('***  parallelclient main start  ***\n')

    parallelclient = ParallelClient()
    parallelclient.call()

    print('\n***  parallelclient main end  ***')


if __name__ == '__main__':
    main()
