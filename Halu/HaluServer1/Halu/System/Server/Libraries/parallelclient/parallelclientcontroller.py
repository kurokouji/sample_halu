# coding: utf-8

from logger.halulogger                     import HaluLogger
from database.database                     import Database
from parallelclient.parallelclientmodel    import ParallelClientModel
from parallelclient.parallelbatchmainmodel import ParallelBatchMainModel
from parallelclient.parallelclientcommons  import ParallelClientCommons

class ParallelClientController():
    """
    並列バッチ用コントローラ
    """


    def __init__(self):
        self.pclog   = HaluLogger('parallelclient')
        self.pclogname = 'parallelclient'
        self.pclog.debug(self.pclogname, 'ParallelClientController init start')

        self.pdlog     = HaluLogger('paralleldatabase')
        self.pdlogname = 'paralleldatabase'
        self.database  = Database(self.pdlog, self.pdlogname)

        self.pmlog     = HaluLogger('parallelmodel')
        self.pmlogname = 'parallelmodel'
        self.parallelclientmodel   = ParallelClientModel(self.pmlog, self.pmlogname)
        self.parallelclientcommons = ParallelClientCommons()

        self.pclog.debug(self.pclogname, 'ParallelClientController init end')

    def call(self, paralleldict):
        try:
            # paralleldictのデータ
            #     dbname         : DB名
            #     controll_id    : 並列分散管理ＩＤ
            #     split_number   : 分割番号
            #     division_number: 分割数

            # 並列分散管理・並列分割管理テーブルの開始日時を更新する
            self.parallelclientmodel.call_start_datetime(self.database, paralleldict)
        
            # 並列分散管理テーブルから ロードパス名・処理モード を取得する
            # 並列分散キーテーブルから json_data を取得する
            # 並列分散パラメータテーブルから json_data を取得する
            loadpass, mode, keydict, paramdict = self.parallelclientmodel.call_parallelinfo(self.database, paralleldict)
    
            # tran.jsonを読み込みrequestを取得する
            trandict    = self.parallelclientcommons.getjsondata(loadpass, mode)
            requestdict = trandict['request']
    
            # requestのparallelParamに値をセットする
            paraminfo = self.parallelclientcommons.getjsonchunkbyid(requestdict, 'records', 'parallelParam')
            for key, value in paramdict.items():
                if key in paraminfo['record'].keys():
                    paraminfo['record'][key]['value'][0] = value['value'][0]


            # --------------------------------------------------------------
            #    バッチ処理の開始
            # --------------------------------------------------------------
            # キー値の開始行と終了行を取得する
            startrow, endrow, maxkeynumber = self.parallelclientcommons.getstartrow_endrow(paralleldict, keydict)
            startrow = startrow - 1


            # 分割処理終了数を取得し、最終バッチ処理のフラグを設定する
            end_number = self.parallelclientmodel.parallelcontroll_endnumber(self.database, paralleldict) + 1
            if end_number == paralleldict['division_number']:
                endbatchflg = 'ON'
            else:
                endbatchflg = 'OFF'


            # 並列バッチメインモデルを呼び出す
            parallelbatchmainmodel = ParallelBatchMainModel(keydict, startrow, endrow, endbatchflg)
            sqldict = parallelbatchmainmodel.call(requestdict)


            # --------------------------------------------------------------
            #    バッチ処理の終了
            # --------------------------------------------------------------

            # 並列分散管理・並列分割管理テーブルの終了日時を更新する
            self.parallelclientmodel.call_end_datetime(self.database, paralleldict)

        except:
            raise
        finally:
            pass

        return sqldict
