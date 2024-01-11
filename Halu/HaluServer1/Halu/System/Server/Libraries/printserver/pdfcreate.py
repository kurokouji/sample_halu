# coding: utf-8

from logger.halulogger import HaluLogger


class PdfCreate():
    """
    テンプレートクラスの説明
    """


    def __init__(self):
        self.log   = HaluLogger('pdfcontroller')  # ログファイル名を設定
        self.log.debug('pdfcontroller', 'PdfCreate init start')


        self.log.debug('pdfcontroller', 'PdfCreate init end')


    def call(self, printparam):
        self.log.debug('pdfcontroller', 'PdfCreate call start')

        responsedict = {}


        self.log.debug('pdfcontroller', 'PdfCreate call end')
        return responsedict



# ---------------------------------------------
#    テンプレートクラス 実行開始
# ---------------------------------------------
def main():
    print('***  pdfcontroller start  ***\n')


    print('\n***  pdfcontroller start end  ***')


if __name__ == '__main__':
    main()
