# coding: utf-8

from logger.halulogger         import HaluLogger
from printserver.pdfcontroller import PdfController
from printserver.pdfcreate     import PdfCreate


class PdfMainController():
    """
    テンプレートクラスの説明
    """


    def __init__(self):
        self.log   = HaluLogger('pdfcontroller')  # ログファイル名を設定
        self.log.debug('pdfcontroller', 'PdfMainController init start')

        self.pdfcreate     = PdfCreate()
        self.pdfcontroller = PdfController(self.pdfcreate)

        self.log.debug('pdfcontroller', 'PdfMainController init end')


    def printstart(self, responsedict, sqldict, requestdict):
        self.log.debug('pdfcontroller', 'PdfMainController printstart start')

        self.pdfcontroller.printstart(responsedict, sqldict, requestdict)

        self.log.debug('pdfcontroller', 'PdfMainController printstart end')


    def printheader(self, responsedict, sqldict, requestdict):
        self.log.debug('pdfcontroller', 'PdfMainController printheader start')

        self.pdfcontroller.pdfnotdetailcontroll('printheader', 'all_page', responsedict, sqldict, requestdict)

        self.log.debug('pdfcontroller', 'PdfMainController printheader end')


    def pageheaderfirst(self, responsedict, sqldict, requestdict):
        self.log.debug('pdfcontroller', 'PdfMainController pageheaderfirst start')

        self.pdfcontroller.pdfnotdetailcontroll('printheader', 'first_page', responsedict, sqldict, requestdict)

        self.log.debug('pdfcontroller', 'PdfMainController pageheaderfirst end')


    def pagefooterlast(self, responsedict, sqldict, requestdict):
        self.log.debug('pdfcontroller', 'PdfMainController pagefooterlast start')

        self.pdfcontroller.pdfnotdetailcontroll('printfooter', 'last_page', responsedict, sqldict, requestdict)

        self.log.debug('pdfcontroller', 'PdfMainController pagefooterlast end')


    def printfooter(self, responsedict, sqldict, requestdict):
        self.log.debug('pdfcontroller', 'PdfMainController printfooter start')

        self.pdfcontroller.pdfnotdetailcontroll('printfooter', 'all_page', responsedict, sqldict, requestdict)

        self.log.debug('pdfcontroller', 'PdfMainController printfooter end')


    def printterminate(self, responsedict, sqldict, requestdict):
        self.log.debug('pdfcontroller', 'PdfMainController printterminate start')

        responsedict = self.pdfcontroller.printterminate(responsedict, sqldict, requestdict)

        self.log.debug('pdfcontroller', 'PdfMainController printterminate end')
        return responsedict


    def call(self, responsedict, sqldict, requestdict):
        self.log.debug('pdfcontroller', 'PdfMainController call start')

        recordinfo_list = self.pdfcontroller.getrecordinfo_pageoutputcontroll('detail', 'all_page', responsedict)

        # 普通の印刷か、1ページに同じ情報を複数回印刷するかの判定
        # pdfinfo の yposition が配列で定義されているとき、複数回印刷の指示となる
        # pdfinfo の yposition の型（リスト）判定を行う
        if isinstance(recordinfo_list[0]['pdfinfo']['yposition'], list):
            # 1ページに同じ情報を複数回印刷   detai_loopcount：回数
            detai_loopcount = len(recordinfo_list[0]['pdfinfo']['yposition'])
            self.pagemainloop(responsedict, sqldict, requestdict, detai_loopcount)
        else:
            # 普通の印刷処理
            self.pagemain(responsedict, sqldict, requestdict, 999)

        self.log.debug('pdfcontroller', 'PdfMainController call end')


    def pagemain(self, responsedict, sqldict, requestdict, pageloopcounter):
        self.log.debug('pdfcontroller', 'PdfMainController call start')

        # 明細の行数を求める
        recordinfo_list = self.pdfcontroller.getrecordinfo_pageoutputcontroll('detail', 'all_page', responsedict)
        detailsize      = 0
        for recordinfo in recordinfo_list:
            for value in recordinfo['record'].values():
                tempsize = len(value['value'])
                if tempsize > detailsize:
                    detailsize = tempsize


        # ヘッダー処理
        self.pdfcontroller.pdfnotdetailcontroll('pageheader',     'all_page', responsedict, sqldict, requestdict)
        self.pdfcontroller.pdfnotdetailcontroll('controllheader', 'all_page', responsedict, sqldict, requestdict)


        # 明細処理
        for row in range(0, detailsize, 1):
            self.pdfcontroller.pdfdetailcontroll(recordinfo_list, row, detailsize, pageloopcounter, responsedict)


        # フッター処理
        self.pdfcontroller.pdfnotdetailcontroll('controllfooter', 'all_page', responsedict, sqldict, requestdict)
        self.pdfcontroller.pdfnotdetailcontroll('pagefooter',     'all_page', responsedict, sqldict, requestdict)


        self.log.debug('pdfcontroller', 'PdfMainController call end')


    def pagemainloop(self, responsedict, sqldict, requestdict, detail_loopcount):
        self.log.debug('pdfcontroller', 'PdfMainController call start')

        for loopcounter in range(0, detail_loopcount, 1):
            self.pagemain(responsedict, sqldict, requestdict, loopcounter)

        self.log.debug('pdfcontroller', 'PdfMainController call end')


# ---------------------------------------------
#    テンプレートクラス 実行開始
# ---------------------------------------------
def main():
    print('***  pdfcontroller start  ***\n')


    print('\n***  pdfcontroller start end  ***')


if __name__ == '__main__':
    main()
