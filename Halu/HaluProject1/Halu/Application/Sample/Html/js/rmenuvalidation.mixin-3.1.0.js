(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // バリデーション関数
  App.ValidationMixin = {
    // バリデーションルールを設定する
    validationRule: {
      required: [
         "入力して下さい。"
        ,"必須"
        ,function (value) {
           if (value == "0") return true;
           if (value == "") return false;
           return true;
         }
      ]
     ,required9: [
         "入力して下さい。"
        ,"必須"
        ,function (value) {
           //if (value == "0") return true;
           //if (value == "") return false;
           return true;
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
        ,"数字のみ"
        ,function (value) {
           if (value == "") return true;
           var stringvalue = String(value);
           if (stringvalue.match(/[^0-9]/g)) return false;
           return true;
         }
      ]
     ,integer: [
         "符号付き（+：省略可）数字を入力して下さい。"
        ,"符号数字のみ"
        ,function (value) {
           if (value == "") return true;
           var stringvalue = String(value);
           return stringvalue.match(/(\+|-)?\d+/g);
         }
      ]
     ,decimals: [
         "小数を入力して下さい。"
        ,"符数字と小数点のみ"
        ,function (value) {
           if (value == "") return true;

           var stringvalue = String(value);
           var valueArray = stringvalue.split(".");
           if (valueArray.length > 2)          return false;
           if (valueArray[0].match(/[^0-9]/g)) return false;
           if (valueArray.length == 1)         return true;
           if (valueArray[1].match(/[^0-9]/g)) return false;
           return true;
         }
      ]
     ,decimalS: [
         "数を入力して下さい。"
        ,"符号・数字と小数点のみ"
        ,function (value) {
           if (value == "") return true;

           var stringvalue = String(value);
           return stringvalue.match(/^[+-]?\d+(\.\d+)?$/);
         }
      ]
     ,alphabet: [
         "アルファベット（大文字・小文字）を入力して下さい。"
        ,"アルファベット（大文字・小文字のみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^a-zA-Z]/g)) return false;
           return true;
         }
      ]
     ,alphabetS: [
         "アルファベット（小文字）を入力して下さい。"
        ,"アルファベット（小文字）のみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^a-z]/g)) return false;
           return true;
         }
      ]
     ,alphabetB: [
         "アルファベット（大文字）を入力して下さい。"
        ,"アルファベット（大文字）のみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^A-Z]/g)) return false;
           return true;
         }
      ]
     ,alphanum: [
         "英数字を入力して下さい。"
        ,"英数字のみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^a-zA-Z0-9]/g)) return false;
           return true;
         }
      ]
     ,alphanumspace: [
         "英数字を入力して下さい。"
        ,"英数字、スペースのみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^a-zA-Z0-9 ]/g)) return false;
           return true;
         }
      ]
     ,alphanumS: [
         "英数字（0～9と小文字）を入力して下さい。"
        ,"英数字（0～9と小文字）のみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^a-z0-9]/g)) return false;
           return true;
         }
      ]
     ,alphanumB: [
         "英数字（0～9と大文字）を入力して下さい。"
        ,"英数字（0～9と大文字）のみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^A-Z0-9]/g)) return false;
           return true;
         }
      ]
     ,hiragana: [
         "ひらがなを入力して下さい。"
        ,"ひらがなのみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^あ-んが-ぼぁ-ょゎっー　]/g)) return false;
           return true;
         }
      ]
     ,katakana: [
         "カタカナを入力して下さい。"
        ,"カタカナのみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^ア-ンァィゥェォャュョッ、。ー・　]/g)) return false;
           return true;
         }
      ]
     ,katakanaH: [
         "半角カタカナを入力して下さい。"
        ,"半角カタカナのみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｬｭｮｯｰﾞﾟ･ ]/g)) return false;
           return true;
         }
      ]
     ,halfchar: [
         "半角文字を入力して下さい。"
        ,"半角文字のみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[^ｱｲｳｴｵｧｨｩｪｫｶｷｸｹｺｻｼｽｾｿﾀﾁﾂｯﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖｬｭｮﾗﾘﾙﾚﾛﾜｦﾝﾞﾟｰ･､｡ A-Za-z0-9!"#%&'\(\)=\|;:\+\*_,\.<>\/\?@\[\]\{\}\\\^\-｢｣\$]/g)) return false;
           return true;
         }
      ]
     ,zenkaku: [
         "全角文字を入力して下さい。"
        ,"全角文字のみ"
        ,function (value) {
           if (value == "") return true;
           if (value.match(/[ A-Za-z0-9\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E｡-ﾟ]/)) return false;
           return true;
         }
      ]
     ,kanji: [
         "漢字を入力して下さい。"
        ,"漢字"
        ,function (value) {
           if (value == "") return true;
           return true;
         }
      ]
     ,yyyymmdd: [
         "年月日を入力して下さい。"
        ,"年月日のみ"
        ,function (value) {
           if (value == "") return true;

           value = value + "";
           var yyyy = value.substring(0, 4);
           var mm   = value.substring(4, 6);
           var dd   = value.substring(6, 8);
           var dt   = new Date(yyyy, mm-1, dd);

           if (dt.getFullYear() == yyyy && dt.getMonth() == mm-1 && dt.getDate() == dd) return true;
           return false;
         }
      ]
     ,yyyymm: [
         "年月を入力して下さい。"
        ,"年月のみ"
        ,function (value) {
           if (value == "") return true;

           value = value + "";
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
        ,"月日のみ"
        ,function (value) {
           if (value == "") return true;

           value = value + "";
           var cdate = new Date();
           var yyyy  = cdate.getFullYear();
           var mm    = value.substring(0, 2);
           var dd    = value.substring(3, 4);
           var dt    = new Date(yyyy, mm-1, dd);

           if (dt.getFullYear() == yyyy && dt.getMonth() == mm-1 && dt.getDate() == dd) return true;
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
        ,"郵便番号のみ"
        ,function (value) {
           if (value == "") return true;
           return value.match(/^\d{3}-\d{4}$|^\d{3}-\d{2}$|^\d{3}$/);
         }
      ]
     ,telno: [
         "電話番号を入力して下さい。"
        ,"電話番号のみ"
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
        ,"携帯番号のみ"
        ,function (value) {
           if (value == "") return true;
           return value.match(/^\d{3}-\d{4}-\d{4}$|^\d{11}$/);
         }
      ]
     ,mailaddress: [
         "メールアドレスを入力して下さい。"
        ,"メールアドレスのみ"
        ,function (value) {
           if (value == "") return true;
           return value.match(/\S+@\S+\.\S+$/);
         }
      ]
     ,url: [
         "URLを入力して下さい。"
        ,"URLのみ"
        ,function (value) {
           if (value == "") return true;
           return value.match(/(http|https|ftp):\/\/.+/);
         }
      ]
     ,ipaddress: [
         "IPアドレスを入力して下さい。"
        ,"IPアドレスのみ"
        ,function (value) {
           if (value == "") return true;
           return value.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
         }
      ]
     ,min: [
         ""
        ,"桁数不足"
        ,function (value, size) {
           if (value == "") return true;
           if (value.length < size) return false;
           return true;
         }
      ]
     ,max: [
         ""
        ,"桁数超過"
        ,function (value, size) {
           if (value == "") return true;
           if (value.length > size) return false;
           return true;
         }
      ]
     ,minbyte: [
         ""
        ,"バイト数不足"
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
        ,"バイト数超過"
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
     ,minbyteUnicode: [
         ""
        ,"バイト数不足"
        ,function (value, size) {
           var count = encodeURI(value).replace(/%[0-9A-F]{2}/g, '*').length;
           if (count < size) return false;
           return true;
         }
      ]
     ,maxbyteUnicode: [
         ""
        ,"バイト数超過"
        ,function (value, size) {
           var count = encodeURI(value).replace(/%[0-9A-F]{2}/g, '*').length;
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
      var validData = this.validation.getData();  // rmenumvc.js Validationクラス
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
   ,checkData: function(value, targetRule, errorMessage, type, row) {
      var validations  = targetRule["validation"];
      var validlength  = validations.length;
      var rule, message;
      for (var i = 0; i < validlength; i++) {
        rule = validations[i];
        if (row > 0) {
          if (type == "onBlur") {
            if (rule == "required") {
              continue;
            }
          }
        }
        if (rule in this.validationRule) {
          if (this.validationRule[rule][2](value)) continue;          // チェック OK
          message = this.validationRule[rule][1] + "\n";              // エラーメッセージ設定
          errorMessage.push(message);
          return;
        }
      }
    }
    // サイズチェックを行う
   ,checkSize: function(value, targetRule, errorMessage, type, row) {
      var check = function(self, value, size, rule) {
        if (!size) return;
        if (self.validationRule[rule][2](value, size)) return;        // チェック OK
        var message = self.validationRule[rule][1] + "\n";            // エラーメッセージ設定
        errorMessage.push(message);
      }
      // 次に記述されているメソッドが、サイズチェック実行の候補になります
      var array_method = [
        "min", "max"
       ,"minbyte", "maxbyte"
       ,"minbyteUnicode", "maxbyteUnicode"
      ];
      for (var i = 0, n = array_method.length; i < n; i++) {
        check(this, value, targetRule[array_method[i]], array_method[i]);
      }
    }
    // チェック 処理
   ,validationCheck: function(target, value, row, type) {
      $R.log("ValidationMixin validationCheck : start  name:" + target.name + "  row:" + row);

      var message    = {};
      var okmessage  = {target: target, status: "OK", message: "", multiline: "no", no_display_message: "no", row: row};
      var targetRule = this.validation.getTargetRule(target.name);
      if (!targetRule) {
         $R.log("ValidationMixin validationCheck : end status=OK nonRule");
         return okmessage;
      }

      var multiline          = this.validation.getTargetMultline(target.name);
      var no_display_message = this.validation.getTargetNoDisplayMessage(target.name);
      var errorMessage       = [];
      this.checkData(value, targetRule, errorMessage, type, row);
      this.checkSize(value, targetRule, errorMessage, type, row);

      if (errorMessage.length > 0) {
        //message = {target: target, status: "ERROR", message: errorMessage, multiline: multiline, no_display_message: no_display_message};
        message = {target: target, status: "ERROR", message: errorMessage, multiline: multiline, no_display_message: no_display_message, row: row};
        
        $R.log("ValidationMixin validationCheck : end status=ERROR message:" + message["message"]);
        return message;
      }

      // チェック用カスタムイベント名設定（check + 項目名 を設定する）
      var eventname = "check" + target.name;
      if (this.pubsub.isEvent(eventname)) {
        var arg = {target: target, value: value, multiline: multiline, no_display_message: no_display_message, row: row, type: type};
        message = this.pubsub.publish(eventname, arg);
        //message["multiline"] = multiline;
        if (message["status"] == "ERROR") {
          $R.log("ValidationMixin validationCheck : end status=ERROR message:" +  + message["message"]);
          return message;
        }
      }

      $R.log("ValidationMixin validationCheck : end status=OK");
      return okmessage;
    }
    
    // リクエストデータの一括チェック
   ,transactionCheck: function(requestdata) {
      $R.log("ValidationMixin transactionCheck : start");

      var error_count = 0;
      if (requestdata["records"]) {

        var message   = {};
        var records   = requestdata["records"];
        var maxlength = records.length;
        var record, name, value, valuelength, elementvalue, target, i, j;
        var multiline, defaultline;
        for (i = 0; i < maxlength; i++) {
          multiline = records[i]["multiline"]
          record    = records[i]["record"];
          for (name in record) {
            value       = record[name]["value"];
            valuelength = value.length;
            for (j = 0; j < valuelength; j++) {
              elementvalue = value[j];
              
              // 20170913 shimoji update
              //target       = this.dataset.getElementObject(name, j);
              if (multiline == "no") {
                target = $($("#" + name))[0];
                //target = $($("#" + name));
              }
              else {
                target = $($("." + name))[j];
              }
              
              if (target) {
                // 20140925 shimoji
                //message      = this.validationCheck(target, elementvalue);
                message      = this.validationCheck(target, elementvalue, j, "onTran");
                
                // 20190501 shimoji
                //this.pubsub.publish("removeToolTip", message);
                
                if (message["status"] == "OK" || message["no_display_message"] == "yes") {
                  this.onBlurDerive(target, elementvalue, j);
                }
                else {
                  this.pubsub.publish("errorToolTip", message);
                }
                error_count += (message["status"] == "OK" ? 0 : 1);
              }
            }
          }
        }

      }
      $R.log("ValidationMixin transactionCheck : end");
      return (error_count == 0);
    }
    // ボタン・ラジオボックス・チェックボックス等のガイドメッセージを作成する
   ,getButtonMessage: function(target) {
      return target.name + " ボタンをクリックして下さい。";;
    }
   ,getRadioMessage: function(target) {
      return target.name + " を選択して下さい。";;
    }
   ,getCheckboxMessage: function(target) {
      return target.name + " をチェックして下さい。";;
    }
   ,getSelectMessage: function(target) {
      return target.name + " を選択して下さい。";;
    }
   ,getNonValidMessage: function(target) {
      return target.name + " を入力して下さい。";;
    }
    // 入力ガイドメッセージ作成処理
   ,onFocusMessage: function(event) {
      $R.log("ValidationMixin onFocusMessage : start");

      var target = event.target;
      var type   = target.type;
      if (type == "button") {
        return this.getButtonMessage(target);
      }
      if (type == "radio") {
        return this.getRadioMessage(target);
      }
      if (type == "checkbox") {
        return this.getCheckboxMessage(target);
      }
      if (type == "select-one") {
        return this.getSelectMessage(target);
      }
      if (type == "select-multiple") {
        return this.getSelectMessage(target);
      }

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
      //guidemsg    = target.name + "に" + sizemsg + rulemsg + requiredmsg;
      guidemsg    = sizemsg + rulemsg + requiredmsg;

      $R.log("ValidationMixin onFocusMessage : end");
      return guidemsg;
    }
    // onBlur データチェック処理
   ,onBlurDataCheck: function(event, row) {
      $R.log("ValidationMixin onBlurDataCheck : start");

      var target  = event.target;
      var message = this.validationCheck(target, target.value, row, "onBlur");

      $R.log("ValidationMixin onBlurDataCheck : end");
      return message;
    }
    // onBlurDerive 導出項目編集処理
   ,onBlurDerive: function(target, value, row) {
      $R.log("ValidationMixin onBlurDerive : start");

      // 導出項目編集用カスタムイベント名設定（derive + 項目名 を設定する）
      var eventname = "derive" + target.name;
      if (this.pubsub.isEvent(eventname)) {
        var multiline = this.validation.getTargetMultline(target.name);
        var arg = {target: target, value: value, row: row};                     // 20140923 shimoji
        this.pubsub.publish(eventname, arg);
      }

      $R.log("ValidationMixin onBlurDerive : end");
    }
  };
}(jQuery, Rmenu));
