# coding: utf-8

from logger.halulogger import HaluLogger


class PrintServerController():
    """
    テンプレートクラスの説明
    """


    def __init__(self):
        self.log   = HaluLogger('printserver')  # ログファイル名を設定
        self.log.debug('printserver', 'TemplateClass init start')


        self.log.debug('printserver', 'TemplateClass init end')


    def call(self, printparam, keyvaluedict):
        self.log.debug('printserver', 'TemplateClass call start')

        requestdict = {}


        self.log.debug('printserver', 'TemplateClass call end')
        return requestdict



# ---------------------------------------------
#    テンプレートクラス 実行開始
# ---------------------------------------------
def main():
    print('***  printserver start  ***\n')


    print('\n***  printserver start end  ***')


if __name__ == '__main__':
    main()
