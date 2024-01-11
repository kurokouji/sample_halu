(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // バリデーション関数
  App.ValidationMixin = {
    // バリデーションルールを設定する
    validationRule: {
      required: [
         "入力して下さい。"
        ,"入力必須項目です。省略できません。"
        ,function (value) {
           if (value) return true;
           if (value == "0") return true;
           return false;
         }
      ]
     ,nonrequired: [
         "入力して下さい。"
        ,""
        ,function (value) {
          return true;
         }
      ]
     ,integerP: [
         "数字を入力して下さい。"
        ,"数字以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           var stringvalue = String(value);
           if (stringvalue.match(/[^0-9]/g)) return false;
           return true;
         }
      ]
     ,integer: [
         "符号付き（+：省略可）数字を入力して下さい。"
        ,"数字と符号以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           return value.match(/(\+|-)?\d+/g);
         }
      ]
     ,decimals: [
         "少数を入力して下さい。"
        ,"数字と小数点以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;

           var valueArray = value.split(".");
           if (valueArray.length > 2)          return false;
           if (valueArray[0].match(/[^0-9]/g)) return false;
           if (valueArray.length == 1)         return true;
           if (valueArray[1].match(/[^0-9]/g)) return false;
           return true;
         }
      ]
     ,alphabet: [
         "アルファベット（大文字・小文字）を入力して下さい。"
        ,"アルファベット（大文字・小文字）以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^a-zA-Z]/g)) return false;
           return true;
         }
      ]
     ,alphabetS: [
         "アルファベット（小文字）を入力して下さい。"
        ,"アルファベット（小文字）以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^a-z]/g)) return false;
           return true;
         }
      ]
     ,alphabetB: [
         "アルファベット（大文字）を入力して下さい。"
        ,"アルファベット（大文字）以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^A-Z]/g)) return false;
           return true;
         }
      ]
     ,alphanum: [
         "英数字を入力して下さい。"
        ,"英数字以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^a-zA-Z0-9]/g)) return false;
           return true;
         }
      ]
     ,alphanumS: [
         "英数字（0～9と小文字）を入力して下さい。"
        ,"英数字（0～9と小文字）以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^a-z0-9]/g)) return false;
           return true;
         }
      ]
     ,alphanumB: [
         "英数字（0～9と大文字）を入力して下さい。"
        ,"英数字（0～9と大文字）以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^A-Z0-9]/g)) return false;
           return true;
         }
      ]
     ,hiragana: [
         "ひらがなを入力して下さい。"
        ,"ひらがな以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^あ-んが-ぼぁ-ょゎっー]/g)) return false;
           return true;
         }
      ]
     ,katakana: [
         "カタカナを入力して下さい。"
        ,"カタカナ以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^ア-ンァィゥェォャュョッ、。ー]/g)) return false;
           return true;
         }
      ]
     ,kanji: [
         "漢字を入力して下さい。"
        ,"漢字以外の文字が入力されています。"
        ,function (value) {
           if (value == "") return true;
           return true;
         }
      ]
     ,yyyymmdd: [
         "年月日を入力して下さい。"
        ,"年月日の入力が間違っています。"
        ,function (value) {
           if (value == "") return true;

           var yyyy = value.substring(0, 4);
           var mm   = value.substring(4, 6);
           var dd   = value.substring(6, 8);
           var dt   = new Date(yyyy, mm-1, dd);

           if (dt.getFullYear() == yyyy && dt.getMonth() == mm-1 && dt.getDate() == dd) return true;
           return false;
         }
      ]
     ,yyyysmmsdd: [
         "年月日を入力して下さい。"
        ,"年月日の入力が間違っています。"
        ,function (value) {
           if (value == "") return true;

           var yyyy = value.substring(0, 4);
           var s1   = value.substring(4, 5);
           var mm   = value.substring(5, 7);
           var s2   = value.substring(7, 8);
           var dd   = value.substring(8, 10);
           var dt   = new Date(yyyy, mm-1, dd);

           if (dt.getFullYear() == yyyy && dt.getMonth() == mm-1 && dt.getDate() == dd) return true;
           if (s1 == "/" && s2 == "/") return true;
           return false;
         }
      ]
     ,yyyyhmmhdd: [
         "年月日を入力して下さい。"
        ,"年月日の入力が間違っています。"
        ,function (value) {
           if (value == "") return true;

           var yyyy = value.substring(0, 4);
           var s1   = value.substring(4, 5);
           var mm   = value.substring(5, 7);
           var s2   = value.substring(7, 8);
           var dd   = value.substring(8, 10);
           var dt   = new Date(yyyy, mm-1, dd);

           if (dt.getFullYear() == yyyy && dt.getMonth() == mm-1 && dt.getDate() == dd) return true;
           if (s1 == "-" && s2 == "-") return true;
           return false;
         }
      ]
     ,yyyymm: [
         "年月を入力して下さい。"
        ,"年月の入力が間違っています。"
        ,function (value) {
           if (value == "") return true;

           var yyyy = value.substring(0, 4);
           var mm   = value.substring(4, 6);
           var dd   = 1;
           var dt   = new Date(yyyy, mm-1, dd);

           if (dt.getFullYear() == yyyy && dt.getMonth() == mm-1 && dt.getDate() == dd) return true;
           return false;
         }
      ]
     ,mmdd: [
         "月日を入力して下さい。"
        ,"月日の入力が間違っています。"
        ,function (value) {
           if (value == "") return true;

           var cdate = new Date();
           var yyyy  = cdate.getFullYear();
           var mm    = value.substring(0, 2);
           var dd    = value.substring(3, 4);
           var dt    = new Date(yyyy, mm-1, dd);

           if (dt.getFullYear() == yyyy && dt.getMonth() == mm-1 && dt.getDate() == dd) return true;
           return false;
         }
      ]
     ,hhmm: [
         "時刻を入力して下さい。"
        ,"時刻の入力が間違っています。"
        ,function (value) {
           if (value == "") return true;

           var hh    = value.substring(0, 2);
           var mm    = value.substring(2, 4);

           if (hh >= "00" && hh <= "24" && mm >= "00" && mm <= "59") return true;
           return false;
         }
      ]
     ,hhcmm: [
         "時刻を入力して下さい。"
        ,"時刻の入力が間違っています。"
        ,function (value) {
           if (value == "") return true;

           var hh    = value.substring(0, 2);
           var cc    = value.substring(2, 3);
           var mm    = value.substring(3, 5);

           if (hh >= "00" && hh <= "24" && mm >= "00" && mm <= "59") return true;
           if (cc == ":") return true;
           return false;
         }
      ]
     ,free: [
         "入力して下さい。"
        ,""
        ,function (value) {
           if (value == "") return true;
           return true;
         }
      ]
     ,postno: [
         "郵便番号を入力して下さい。"
        ,"郵便番号が間違っています。"
        ,function (value) {
           if (value == "") return true;
           return value.match(/\d{3}-\d{4}$|\d{3}-\d{2}$|\d{3}$/);
         }
      ]
     ,telno: [
         "電話番号を入力して下さい。"
        ,"電話番号が間違っています。"
        ,function (value) {
           if (value == "") return true;
           var ans1 = value.match(/^[0-9-]{6,9}$|^[0-9-]{12}$/);
           var ans2 = value.match(/^\d{1,4}-\d{4}$|^\d{2,5}-\d{1,4}-\d{4}$/);
           if (ans1 && ans2) return true;
           return false;
         }
      ]
     ,keitaino: [
         "携帯番号を入力して下さい。"
        ,"携帯番号が間違っています。"
        ,function (value) {
           if (value == "") return true;
           return value.match(/\d{3}-\d{4}-\d{4}$|\d{11}$/);
         }
      ]
     ,mailaddress: [
         "メールアドレスを入力して下さい。"
        ,"メールアドレスが間違っています。"
        ,function (value) {
           if (value == "") return true;
           return value.match(/\S+@\S+\.\S+$/);
         }
      ]
     ,url: [
         "URLを入力して下さい。"
        ,"URLが間違っています。"
        ,function (value) {
           if (value == "") return true;
           return value.match(/(http|https|ftp):\/\/.+/);
         }
      ]
     ,ipaddress: [
         "IPアドレスを入力して下さい。"
        ,"IPアドレスが間違っています。"
        ,function (value) {
           if (value == "") return true;
           return value.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
         }
      ]
     ,min: [
         ""
        ,"桁数が足りません。"
        ,function (value, size) {
           if (value == "") return true;
           if (value.length < size) return false;
           return true;
         }
      ]
     ,max: [
         ""
        ,"桁数オーバです。"
        ,function (value, size) {
           if (value == "") return true;
           if (value.length > size) return false;
           return true;
         }
      ]
     ,minbyte: [
         ""
        ,"バイト数が足りません。"
        ,function (value, size) {
           if (value == "") return true;
           var count = 0;
           var n;
           for(var i=0; i<value.length; i++) {
             n = escape(value.charAt(i));
             if (n.length < 4) {
               count ++;
             }
             else {
               count += 2;
             }
           }

           if (count < size) return false;
           return true;
         }
      ]
     ,maxbyte: [
         ""
        ,"バイト数オーバです。"
        ,function (value, size) {
           if (value == "") return true;
           var count = 0;
           var n;
           for(var i=0; i<value.length; i++) {
             n = escape(value.charAt(i));
             if (n.length < 4) {
               count ++;
             }
             else {
               count += 2;
             }
           }
           if (count > size) return false;
           return true;
         }
      ]
    }
    // 桁数メッセージを作成する
   ,setKetaMessage: function(targetRule) {
      var minsize     = targetRule["min"];
      var maxsize     = targetRule["max"];
      if (minsize == ""  && maxsize == "") return "";

      if (minsize != ""  && maxsize != "") {
        if (minsize == maxsize) return maxsize + "桁の";
        return minsize + "桁～" + maxsize + "桁の";
      }

      if (minsize != "") return minsize + "桁以上の";
      return maxsize + "桁以内の";
    }
    // バイト数メッセージを作成する
   ,setByteMessage: function(targetRule) {
      var minsize     = targetRule["minbyte"];
      var maxsize     = targetRule["maxbyte"];
      if (minsize == ""  && maxsize == "") return "";

      if (minsize != ""  && maxsize != "") {
        if (minsize == maxsize) return maxsize + "バイトの";
        return minsize + "バイト～" + maxsize + "バイトの";
      }

      if (minsize != "") return minsize + "バイト以上の";
      return maxsize + "バイト以内の";
    }
    // requiredメッセージを作成する
   ,setRequiredMessage: function(targetRule) {
      if (targetRule["validation"][0] == "required")    return "（必須入力です）";
      if (targetRule["validation"][0] == "nonrequired") return "（省略可能です）";
      return "";
    }
    // ルールメッセージを作成する
   ,setRuleMessage: function(targetRule) {
      var rule = targetRule["validation"][1];
      if (!rule) return "";
      return this.validationRule[rule][0];
    }
    // バリデーションJsonから該当項目のmultiline情報を取得する
   ,getTargetMultline: function(targetName) {
      var validData = this.validation.getData();                      // rmenumvc.js Validationクラス
      var records   = validData["records"];
      var reclength = records.length;
      var record;
      for (var i = 0; i < reclength; i++) {
        record = records[i]["record"];
        if (targetName in record) {
          return records[i]["multiline"];
        }
      }
      return "no";
    }
    // データ（バリデーション）チェックを行う
   ,checkData: function(value, targetRule, errorMessage) {
      var validations  = targetRule["validation"];
      var validlength  = validations.length;
      var rule, message;
      for (var i = 0; i < validlength; i++) {
        rule = validations[i];
        if (rule in this.validationRule) {
          if (this.validationRule[rule][2](value)) continue;          // チェック OK
          message = this.validationRule[rule][1] + "\n";              // エラーメッセージ設定
          errorMessage.push(message);
          return;
        }
      }
    }
    // サイズチェックを行う
   ,checkSize: function(value, targetRule, errorMessage) {
      var check = function(self, value, size, rule) {
        if (!size) return;
        if (self.validationRule[rule][2](value, size)) return;        // チェック OK
        var message = self.validationRule[rule][1] + "\n";            // エラーメッセージ設定
        errorMessage.push(message);
      }
      check(this, value, targetRule["min"], "min");
      check(this, value, targetRule["max"], "max");
      check(this, value, targetRule["minbyte"], "minbyte");
      check(this, value, targetRule["maxbyte"], "maxbyte");
    }
    // チェック 処理
   ,validationCheck: function(target, value) {
      $R.log("ValidationMixin validationCheck : start");

      var message    = {};
      var okmessage  = {target: target, status: "OK", message: "", multiline: "no"};
      var targetRule = this.validation.getTargetRule(target.name);
      if (!targetRule) {
         return okmessage;
      }

      var multiline    = this.validation.getTargetMultline(target.name);
      var errorMessage = [];
      this.checkData(value, targetRule, errorMessage);
      this.checkSize(value, targetRule, errorMessage);

      if (errorMessage.length > 0) {
        message = {target: target, status: "ERROR", message: errorMessage, multiline: multiline};
        return message;
      }

      // チェック用カスタムイベント名設定（check + 項目名 を設定する）
      var eventname = "check" + target.name;
      if (this.pubsub.isEvent(eventname)) {
        var arg = {target: target, value: value, row: multiline};
        message = this.pubsub.publish(eventname, arg);
        message["multiline"] = multiline;
        if (message["status"] == "ERROR") {
          return message;
        }
      }

      $R.log("ValidationMixin validationCheck : end");
      return okmessage;
    }
    // リクエストデータの一括チェック
   ,transactionCheck: function(requestdata) {
      $R.log("ValidationMixin transactionCheck : start");

      var status    = true;
      if (!requestdata["records"]) return status;

      var message   = {};
      var records   = requestdata["records"];
      var maxlength = records.length;
      var record, name, value, valuelength, elementvalue, target, i, j;
      for (i = 0; i < maxlength; i++) {
        record = records[i]["record"];
        for (name in record) {
          value       = record[name]["value"];
          valuelength = value.length;
          for (j = 0; j < valuelength; j++) {
            elementvalue = value[j];
            target       = this.dataset.getElementObject(name, j);
            if (target) {
              message      = this.validationCheck(target, elementvalue);
              this.pubsub.publish("removeToolTip", message);
              if (message["status"] == "OK") {
                this.onBlurDerive(target, elementvalue);
              }
              else {
                status = false;
                this.pubsub.publish("errorToolTip", message);
              }
            }
          }
        }
      }

      $R.log("ValidationMixin transactionCheck : end");
      return status;
    }
    // 項目にバリデーション設定が無い時のガイドメッセージを作成する
   ,getNonValidMessage: function(target) {
      var message;
      if (target.type == "button") {
        message = target.name + " ボタンをクリックして下さい。";
      }
      return message;
    }
    // 入力ガイドメッセージ作成処理
   ,onFocusMessage: function(event) {
      $R.log("ValidationMixin onFocusMessage : start");

      var target = event.target;
      var sizemsg, requiredmsg, rulemsg, guidemsg;
      var targetRule = this.validation.getTargetRule(target.name);
      if (!targetRule) {                                              // ルール設定無し
        guidemsg = this.getNonValidMessage(target);
        return guidemsg;
      }
      if (targetRule["max"]) {
        sizemsg = this.setKetaMessage(targetRule);
      }
      if (targetRule["maxbyte"]) {
         sizemsg = this.setByteMessage(targetRule);
      }
      requiredmsg = this.setRequiredMessage(targetRule);
      rulemsg     = this.setRuleMessage(targetRule);
      //guidemsg    = "【" + target.name + "】" + sizemsg + rulemsg + requiredmsg;
      guidemsg    = sizemsg + rulemsg + requiredmsg;

      $R.log("ValidationMixin onFocusMessage : end");
      return guidemsg;
    }
    // onBlur データチェック処理
   ,onBlurDataCheck: function(event) {
      $R.log("ValidationMixin onBlurDataCheck : start");

      var message    = {};
      var okmessage  = {target: target, status: "OK", message: "", multiline: "no"};

      var target = event.target;
      var value;
      switch (target.type) {
        case "button":
          return okmessage;
        case "checkbox":
          if ($(target).is(':checked')) {
            value = 1;
          }
          else {
            value = 0;
          }
          break;
        case "radio":
          var name  = "input[name=" + target.name + "]:checked";
          value = $(name).val();
          break;
        default:
          value = target.value;
          break;
      }
      var message = this.validationCheck(target, value);


      $R.log("ValidationMixin onBlurDataCheck : end");
      return message;
    }
    // onBlurDerive 導出項目編集処理
   ,onBlurDerive: function(target, value) {
      $R.log("ValidationMixin onBlurDerive : start");

      // 導出項目編集用カスタムイベント名設定（derive + 項目名 を設定する）
      var eventname = "derive" + target.name;
      if (this.pubsub.isEvent(eventname)) {
        var multiline = this.validation.getTargetMultline(target.name);
        var arg = {target: target, value: value, row: multiline};
        this.pubsub.publish(eventname, arg);
      }

      $R.log("ValidationMixin onBlurDerive : end");
    }
  };
}(jQuery, Rmenu));