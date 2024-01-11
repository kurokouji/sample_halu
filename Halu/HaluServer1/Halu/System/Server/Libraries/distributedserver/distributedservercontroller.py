# coding: utf-8

from logger.halulogger            import HaluLogger

class DistirbutedServerController():
    """
    
    """


    def __init__(self, fifo_queue):
        self.log   = HaluLogger('distributedserver')  # ログファイル名を設定
        self.log.debug('distributedserver', 'distributedserver Controller init start')

        self.fifo_queue = fifo_queue

        self.log.debug('distributedserver', 'distributedserver Controller init end')


    # 分割情報（ＤＢ名・並列分散管理ＩＤ・分割番号）をキューに追加する
    def call_put(self, dbname, controll_id, division_number):
        for i in range(division_number):
            paralleldict = {}
            paralleldict['dbname']          = dbname
            paralleldict['controll_id']     = controll_id
            paralleldict['split_number']    = i + 1
            paralleldict['division_number'] = division_number

            self.fifo_queue.put(paralleldict)


    # 分割情報（ＤＢ名・並列分散管理ＩＤ・分割番号）をキューから取り出す
    def call_get(self):
        if self.fifo_queue.empty():
            paralleldict = {}
            paralleldict['dbname']          = 'empty'
            paralleldict['controll_id']     = 0
            paralleldict['split_number']    = 0
            paralleldict['division_number'] = 0
        else:
            paralleldict = self.fifo_queue.get()

        return paralleldict

