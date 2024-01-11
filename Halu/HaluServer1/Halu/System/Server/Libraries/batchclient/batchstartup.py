# coding: utf-8

import json

from logger.halulogger          import HaluLogger
from controller.maincontroller  import MainController
from batchclient.batchmainmodel import BatchMainModel
from view.mainview              import MainView

class BatchStartup():
    """
    MainController BatchMainModel MainViewをバッチ起動する
    この実行によって、分散並列バッチが起動される
    """

    def __init__(self, file_path, output_path):
        self.blog     = HaluLogger('batchstartup')
        self.blogname = 'batchstartup'
        self.blog.debug(self.blogname, 'batchstartup init start')

        # MVCをインスタンスする
        mlog                 = HaluLogger('batchmodel')
        mlogname             = 'batchmodel'
        dlog                 = HaluLogger('batchdatabase')
        dlogname             = 'batchdatabase'
        self.main_model      = BatchMainModel(mlog, mlogname, dlog, dlogname)

        vlog                 = HaluLogger('batchview')
        vlogname             = 'batchview'
        self.main_view       = MainView(vlog, vlogname)

        clog                 = HaluLogger('batchcontroller')
        clogname             = 'batchcontroller'
        self.main_controller = MainController(clog, clogname, self.main_model, self.main_view)

        # バッチ用トランザクションのパスと起動結果情報のテキストファイルパス
        self.tran_filepath   = file_path
        self.output_filepath = output_path

        self.blog.debug(self.blogname, 'batchstartup init end')

    def call(self):
        try:
            self.blog.debug(self.blogname, 'batch startup start')
    
            # トランザクションJSONを読み込む
            with open(self.tran_filepath, mode='r') as f:
                trandict = json.load(f)
    
            # リクエストデータを取得する
            requestdict = trandict['request']
    
            # メインコントローラをコールする
            responsedict    = self.main_controller.call(requestdict)
    
            # レスポンスデータを出力する
            with open(self.output_filepath, 'w') as f:
                json.dump(responsedict, f)
                
        except Exception as e:
            self.blog.error(self.blogname, f'batch startup abnormal message : {e}')

        finally:
            self.blog.debug(self.blogname, 'batch startup end')
