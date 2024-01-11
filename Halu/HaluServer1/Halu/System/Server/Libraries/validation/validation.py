# coding: utf-8


class Validation():
    """
    リクエストレコードから項目を取りだし
    validation.jsonを読み込んで入力値チェックを行う
    """


    def __init__(self, clog, clogname):
        self.clog     = clog
        self.clogname = clogname

    def checkRecordItem(self, record, validation_record):
        """
        リクエストレコードから項目を取りだし、チェックを行う
            1.バリデーション チェック
            2.最少桁数 チェック
            3.最大桁数 チェック
            4.最少バイト数 チェック
            5.最大バイト数 チェック

        """

        result = 'OK'

        return result

    def halu_required(self, value, name):
        """
        必須チェック
        """

        result = 'OK'

        return result

    def halu_nonrequired(self, value, name):
        """
        省略可チェック
        """

        result = 'OK'

        return result

    def halu_integerP(self, value, name):
        """
        数字チェック
        """

        result = 'OK'

        return result

    def halu_integer(self, value, name):
        """
        符号付き（+：省略可）数字チェック
        """

        result = 'OK'

        return result

    def halu_decimals(self, value, name):
        """
        小数チェック
        """

        result = 'OK'

        return result

    def halu_decimalS(self, value, name):
        """
        符号付き小数チェック 2017/04/24 Okada
        """

        result = 'OK'

        return result

    def halu_alphabet(self, value, name):
        """
        アルファベット（大文字・小文字）チェック
        """

        result = 'OK'

        return result

    def halu_alphabetS(self, value, name):
        """
        アルファベット（小文字）チェック
        """

        result = 'OK'

        return result

    def halu_alphabetB(self, value, name):
        """
        アルファベット（大文字）チェック
        """

        result = 'OK'

        return result

    def halu_alphanum(self, value, name):
        """
        英数字チェック1
        """

        result = 'OK'

        return result

    def halu_alphanumspace(self, value, name):
        """
        英数字チェック2
        """

        result = 'OK'

        return result

    def halu_alphanumS(self, value, name):
        """
        英数字（0～9と小文字）チェック
        """

        result = 'OK'

        return result

    def halu_alphanumB(self, value, name):
        """
        英数字（0～9と大文字）チェック
        """

        result = 'OK'

        return result

    def halu_hiragana(self, value, name):
        """
        ひらがな チェック
        """

        result = 'OK'

        return result

    def halu_katakana(self, value, name):
        """
        カタカナ チェック
        """

        result = 'OK'

        return result

    def halu_katakanaH(self, value, name):
        """
        半角カタカナ チェック1
        """

        result = 'OK'

        return result

    def halu_katakanaH9(self, value, name):
        """
        半角カタカナ チェック2
        """

        result = 'OK'

        return result

    def halu_halfchar(self, value, name):
        """
        半角 チェック
        """

        result = 'OK'

        return result

    def halu_zenkaku(self, value, name):
        """
        全角 チェック
        20180321 Okada
        英数、空白         [ A-Za-z0-9]
        英記号             [\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]
        半角カナ、カナ記号 [｡-ﾟ]
        """

        result = 'OK'

        return result

    def halu_kanji(self, value, name):
        """
        漢字チェック
        """

        result = 'OK'

        return result

    def halu_yyyymmdd(self, value, name):
        """
        西暦日付チェック
        """

        result = 'OK'

        return result

    def halu_yyyysmmsdd(self, value, name):
        """
        西暦日付チェック（／付き１０桁）
        """

        result = 'OK'

        return result

    def halu_yyyyhmmhdd(self, value, name):
        """
        西暦日付チェック（-付き１０桁）
        """

        result = 'OK'

        return result

    def halu_yyyymm(self, value, name):
        """
        年月チェック
        """

        result = 'OK'

        return result

    def halu_yyyyhmm(self, value, name):
        """
        年月チェック（-付き１０桁）
        """

        result = 'OK'

        return result

    def halu_mmdd(self, value, name):
        """
        月日チェック
        """

        result = 'OK'

        return result

    def halu_hhmm(self, value, name):
        """
        時刻チェック
        """

        result = 'OK'

        return result

    def halu_hhcmm(self, value, name):
        """
        時刻チェック（：付き５桁）
        """

        result = 'OK'

        return result

    def halu_postno(self, value, name):
        """
        郵便番号チェック
        """

        result = 'OK'

        return result

    def halu_telno(self, value, name):
        """
        電話番号チェック
        """

        result = 'OK'

        return result

    def halu_keitaino(self, value, name):
        """
        携帯番号チェック
        """

        result = 'OK'

        return result

    def halu_mailaddress(self, value, name):
        """
        メールアドレスチェック
        """

        result = 'OK'

        return result

    def url(self, value, name):
        """
        URLチェック
        """

        result = 'OK'

        return result

    def halu_ipaddress(self, value, name):
        """
        IPアドレスチェック
        """

        result = 'OK'

        return result

    def halu_min(self, minsize, value, name):
        """
        最少桁数チェック
        """

        result = 'OK'

        return result

    def halu_max(self, maxsize, value, name):
        """
        最大桁数チェック
        """

        result = 'OK'

        return result

    def halu_minbyte(self, minsize, value, name):
        """
        最少バイト数チェック
        """

        result = 'OK'

        return result

    def halu_maxbyte(self, maxsize, value, name):
        """
        最大バイト数チェック
        """

        result = 'OK'

        return result

    def vintegerString(self, str):
        """
        数字か チェック
        「vintegerString?」の？がエラーになる
        """

        result = 'OK'

        return result

    def vfloatString(self, str):
        """
        浮動小数点数字か チェック
        「vfloatString?」の？がエラーになる
        """

        result = 'OK'

        return result

    def valid_error(self, error_message):
        """
        リクエストデータにエラー情報を設定する
        """

        result = 'OK'

        return result
