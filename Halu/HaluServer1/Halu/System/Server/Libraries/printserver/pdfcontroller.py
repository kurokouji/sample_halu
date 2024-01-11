# coding: utf-8

from logger.halulogger import HaluLogger


class PdfController():
    """
    テンプレートクラスの説明
    """


    def __init__(self, pdfcreate):
        self.log   = HaluLogger('pdfcontroller')  # ログファイル名を設定
        self.log.debug('pdfcontroller', 'PdfController init start')


        self.pdfcreate = pdfcreate


        self.log.debug('pdfcontroller', 'PdfController init end')


    def printstart(self, responsedict, sqldict, requestdict):
        pass


    def printterminate(self, responsedict, sqldict, requestdict):
        responsedict = {}

        return responsedict


    def getrecordinfo_pageoutputcontroll(self, pagecontroll, outputcontroll, responsedict):

        recordinfo_list = []
        for recordinfo in responsedict['records']:
            # ページコントロールの判定
            if recordinfo['pdfinfo']['pagecontrol'] != pagecontroll:
                continue

            # アウトプットコントロールの判定
            if recordinfo['pdfinfo']['outputcontrol'] != outputcontroll:
                if recordinfo['pdfinfo']['outputcontrol'] != 'all_page':
                    continue

            # マッチしたデータをリストに追加
            recordinfo_list.append(recordinfo)

        return recordinfo_list


    def pdfnotdetailcontroll(self, pagecontroll, outputcontroll, responsedict, sqldict, requestdict):

        recordinfo_list = self.getrecordinfo_pageoutputcontroll(pagecontroll, outputcontroll, responsedict)
        self.pdfoutputcontroll(recordinfo_list, 0, 0)


    def pdfdetailcontroll(self, recordinfo_list, row, detailsize, pageloopcounter, responsedict):
        pass



    def pdfoutputcontroll(self, recordinfo_list, row, pageloopcounter):

        if len(recordinfo_list) == 0:
            return False


        for recordinfo in recordinfo_list:
            # before 処理


            # 項目の値をPDFへ出力する
            for value in recordinfo['record'].values():
                self.pdfcreate.dataoutput(recordinfo, value['value'][row], value['pdfinfo'])


            # after 処理


        return True





# ---------------------------------------------
#    テンプレートクラス 実行開始
# ---------------------------------------------
def main():
    print('***  PdfController start  ***\n')


    print('\n***  PdfController start end  ***')


if __name__ == '__main__':
    main()
