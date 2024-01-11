# coding: utf-8

from logger.halulogger                 import HaluLogger
from printserver.printservercontroller import PrintServerController
from printserver.pdfmaincontroller     import PdfMainController
from model.mainmodel                   import MainModel
from view.mainview                     import MainView


class PrintServerMainController():
    """
    テンプレートクラスの説明
    """


    def __init__(self):
        self.log   = HaluLogger('printserver')  # ログファイル名を設定
        self.log.debug('printserver', 'PrintServerMainController init start')


        self.log.debug('printserver', 'PrintServerMainController init end')


    def call(self, printparam):
        try:
            self.log.debug('printserver', 'PrintServerMainController call start')
    
            # プリントパラメータ内のキーの行数を取得する
            printparamdict = printparam["input"]["record"]
            maxsize        = 0
            for value in printparamdict.values():
                tempsize = len(value['value'])
                if tempsize > maxsize:
                    maxsize = tempsize
    
    
            # キーの行数回 繰り返す
            for row in range(0, maxsize, 1):
                # キー値を設定する
                keyvaluedict = {}
                for key, value in printparamdict.items():
                    if value['value'][row]:
                        keyvaluedict[key] = value['value'][row]
                    else:
                        keyvaluedict[key] = value['value'][0]
    
    
                # コントローラを実行する
                printservercontroller = PrintServerController()
                requestdict = printservercontroller.call(printparam, keyvaluedict)
    
    
                # メインモデルを実行する
                mainmodel = MainModel()
                sqldict   = mainmodel.call(requestdict)
    
    
                # メインビューを実行する
                mainview = MainView()
                responsedict = mainview.call(requestdict, sqldict)
    
    
                # ＰＤＦコントローラを実行する
                if row == 0:
                    pdfmaincontroller = PdfMainController()

                    # ＰＤＦ 作成開始処理（ヘッダー処理）
                    pdfmaincontroller.printstart(responsedict, sqldict, requestdict)
                    pdfmaincontroller.printheader(responsedict, sqldict, requestdict)
                    pdfmaincontroller.pageheaderfirst(responsedict, sqldict, requestdict)
    
    
                pdfmaincontroller.call(responsedict, sqldict, requestdict)
    
    
            # ＰＤＦ 作成終了処理（フッター処理）
            pdfmaincontroller.pagefooterlast(responsedict, sqldict, requestdict)
            pdfmaincontroller.printfooter(responsedict, sqldict, requestdict)

            # ＰＤＦをファイル出力する
            responsedict = pdfmaincontroller.printterminate(responsedict, sqldict, requestdict)
    
    
            self.log.debug('printserver', 'PrintServerMainController call end')
            return responsedict

        except Exception as e:
            self.log.error('printserver', f'PrintServerMainController abnormal message : {e}')

        finally:
            self.log.debug('printserver', f'PrintServerMainController end responsedict : {responsedict}')



# ---------------------------------------------
#    テンプレートクラス 実行開始
# ---------------------------------------------
def main():
    print('***  printserver start  ***\n')


    print('\n***  printserver start end  ***')


if __name__ == '__main__':
    main()
