(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // データフォーマット関数
  App.FormatMixin = {
    formatExecute: {
      yyyySmmSdd: {
        format: function(value) {
          if (value == "") return value;
          var yyyy = value.substring(0, 4);
          var mm   = value.substring(4, 6);
          var dd   = value.substring(6, 8);
          return yyyy + "/" + mm + "/" + dd;
        }
       ,unformat: function(value) {
          if (value == "") return value;
          return new String(value).replace( /\//g, "" );
        }
      }
     ,yyyyNmmTddH: {
        format: function(value) {
          if (value == "") return value;
          var yyyy      = value.substring(0, 4);
          var mm        = value.substring(4, 6);
          var dd        = value.substring(6, 8);
          return yyyy + "年" + mm + "月" + dd + "日";
        }
       ,unformat: function(value) {
          if (value == "") return value;
          var yyyy = value.substring(0, 4);
          var mm   = value.substring(5, 7);
          var dd   = value.substring(8, 10);
          return yyyy + mm + dd;
        }
      }
     ,quantity: {
        format: function(value) {
          if (value == "") return value;
          var formatvalue = String(value);
          for(i = 0; i < formatvalue.length/3; i++){
            return formatvalue.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2");
          }
        }
       ,unformat: function(value) {
          if (value == "") return value;
          return new String(value).replace( /,/g, "" );
        }
      }
     ,price: {
        format: function(value) {
          if (value == "") return value;
          var formatvalue = String(value);
          for(i = 0; i < formatvalue.length/3; i++){
            return formatvalue.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2");
          }
        }
       ,unformat: function(value) {
          if (value == "") return value;
          return new String(value).replace( /,/g, "" );
        }
      }
     ,money: {
        format: function(value) {
          if (value == "") return value;
          var formatvalue = String(value);
          for(i = 0; i < formatvalue.length/3; i++){
            return formatvalue.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2");
          }
        }
       ,unformat: function(value) {
          if (value == "") return value;
          return new String(value).replace( /,/g, "" );
        }
      }
    }
    // 値をフォーマットする
   ,onDataFormat: function(arg) {
      $R.log("FormatMixin dataFormat : start");

      var value = arg["value"];
      var rule  = arg["rule"];
      if (rule in this.formatExecute) {
        value = this.formatExecute[rule].format(value);
      }

      $R.log("FormatMixin dataFormat : end");
      return value;
    }
    // フォーマットを元の値に戻す
   ,onDataUnformat: function(arg) {
      $R.log("FormatMixin dataUnformat : start");

      var value = arg["value"];
      var rule  = arg["rule"];
      if (rule in this.formatExecute) {
        value = this.formatExecute[rule].unformat(value);
      }

      $R.log("FormatMixin dataUnformat : end");
      return value;
    }
  };
  // アウトライン関数
  App.OutlineMixin = {
    // アウトラインのイベント設定
    outlineEvent: [
      ["#headerTable td input", "mouseover", "span_mouseover"]
     ,["#headerTable td input", "mouseout",  "span_mouseout"]
     ,["#headerTable td input", "focus",     "span_focus"]
     ,["#headerTable td input", "blur",      "span_blur"]
     ,["#detailTable td input", "mouseover", "td_mouseover"]
     ,["#detailTable td input", "mouseout",  "td_mouseout"]
     ,["#detailTable td input", "focus",     "td_focus"]
     ,["#detailTable td input", "blur",      "td_blur"]
    ]
    // アウトラインプロパティを設定する
   ,setOutlineProperty: function() {
      this.focusName;
      this.focusCurRow    = 0;
      this.focusCurCell   = 0;
      this.blurName;
      this.blurCurRow     = 0;
      this.blurCurCell    = 0;
      this.rmenuspanhover = "rmenuspanhover";
      this.rmenuspanfocus = "rmenuspanfocus";
      this.rmenutdhover   = "rmenutdhover";
      this.rmenutdfocus   = "rmenutdfocus";
    }
    // アウトラインイベントを設定し、コールバック関数を指定する
   ,setOutlineEvent: function(outlineEvent) {
      $R.log("OutlineMixin setOutlineEvent : start");

      this.setOutlineProperty();
      var event = this.event["outline"] = new $R.Event;               // イベントクラスを作成する
      if (arguments.length == 0) {
        outlineEvent = this.outlineEvent;
      }
      event.setEvent(this, outlineEvent);                             // アウトラインイベントを設定する

      $R.log("OutlineMixin setOutlineEvent : end");
    }


    // ヘッダコントロールにカーソルが乗った時、クラス名を付ける
   ,span_mouseover: function(event) {
      $(event.target).parent("span").addClass(this.rmenuspanhover);
    }

    // ヘッダコントロールからカーソルが離れた時、クラス名を削除する
   ,span_mouseout: function(event) {
      $(event.target).parent("span").removeClass(this.rmenuspanhover);
    }

    // ヘッダコントロールがフォーカスを得た時、クラス名を付ける
   ,span_focus: function(event) {
      $(event.target).parent("span").addClass(this.rmenuspanfocus);

      this.focusName    = event.target.name;
      this.focusCurRow  = 0;
      this.focusCurCell = 0;
    }

    // ヘッダコントロールがフォーカスを失った時、クラス名を削除する
   ,span_blur: function(event) {
      $(event.target).parent("span").removeClass(this.rmenuspanfocus);

      this.blurName    = event.target.name;
      this.blurCurRow  = 0;
      this.blurCurCell = 0;
    }

    // 明細コントロールにカーソルが乗った時、クラス名を付ける
   ,td_mouseover: function(event) {
      $(event.target).parent("td").addClass(this.rmenutdhover);
    }

    // 明細コントロールからカーソルが離れた時、クラス名を削除する
   ,td_mouseout: function(event) {
      $(event.target).parent("td").removeClass(this.rmenutdhover);
    }

    // 明細コントロールがフォーカスを得たときにクラス名を付ける
   ,td_focus: function(event) {
      var target = event.target;
      $(target).parent("td").addClass(this.rmenutdfocus);

      this.focusName    = target.name;
      this.focusCurRow  = target.parentNode.parentNode.rowIndex - 1;
      this.focusCurCell = target.parentNode.cellIndex;
    }

    // 明細コントロールがフォーカスを失ったときはクラス名を削除する
   ,td_blur: function(event) {
      var target = event.target;
      $(target).parent("td").removeClass(this.rmenutdfocus);

      this.blurName    = target.name;
      this.blurCurRow  = target.parentNode.parentNode.rowIndex - 1;
      this.blurCurCell = target.parentNode.cellIndex;
    }

    // 明細ラジオボタンのchangeイベント処理
   ,td_radiochange: function(event) {
      var target = event.target;
      if (target.checked){
        this.focusName    = target.name;
        this.focusCurRow  = target.parentNode.parentNode.rowIndex - 1;
        this.focusCurCell = target.parentNode.cellIndex;
      }
    }
  };

  // 関数を追加する
  App.ViewMixin = {
    onFocus: function(event, value) {
      $R.log("ViewMixin onFocus : start");

      var target = event.target;
      switch (target.type) {
        case "button":
          break;
        case "checkbox":
          break;
        case "radio":
          break;
        default:
          target.value = value;
          break;
      }

      var idname = "#error" + event.target.name;
      if(!$(idname)) return;
      $(idname).hide();
      $(idname).remove();

      $R.log("ViewMixin onFocus : end");
    }
   ,onBlur: function(event) {
      $R.log("ViewMixin onBlur : start");

      // 入力データをフォーマットし再表示する
      var target = event.target;
      switch (target.type) {
        case "button":
          break;
        case "checkbox":
          break;
        case "radio":
          break;
        default:
          var value = target.value;
          var rule  = this.format[target.name];
          var arg   = {value: value, rule: rule};
          value     = this.onDataFormat(arg);
          target.value = value;
          break;
      }

      $R.log("ViewMixin onBlur : end");
    }
    // ガイドメッセージを表示する arg = {status: ステータス, message: メッセージ}
   ,onGuideMessage: function(arg) {
      $R.log("ViewMixin onGuideMessage : start");

      //if (this.guidemessage) {
      //  $("#footer_status").html(arg["status"]);
      //  $("#footer_message").html(arg["message"]);
      //}

      $R.log("ViewMixin onGuideMessage : end");
    }
    // エラーツールチップを表示する
    // arg = {target: イベントターゲット, message: エラーメッセージ, multiline: yes or no}
   ,onErrorToolTip: function(arg) {
      $R.log("ViewMixin onErrorToolTip : start");

      var toolTip = function(target, errorText, multiline) {
        var idname  = "#error" + target.name
        var toolTip = $("<div id='error" + target.name + "'></div>");
        $(toolTip).addClass("errorToolTip");
        if ($(target).parent("td")) {
          $(target).parent("td").append(toolTip);
        }
        if ($(target).parent("div")) {
          $(target).parent("div").after(toolTip);
        }

        var message = $("<span>" + errorText  + "</span>");
        $(message).addClass("errorMessage");
        $(toolTip).append(message);
      }

      var length    = arg["message"].length;
      var errorText = "";
      for (var i = 0; i < length; i++) {
        errorText += arg["message"][i];
      }
      toolTip(arg["target"], errorText, arg["multiline"]);

      $R.log("ViewMixin onErrorToolTip : end");
    }
    // エラーツールチップを削除する arg = {target: イベントターゲット}
   ,onRemoveToolTip: function(arg) {
      $R.log("ViewMixin onRemoveToolTip : start");

      var idname = "#error" + arg["target"].name;
      if(!$(idname)) return;
      $(idname).hide();
      $(idname).remove();

      $R.log("ViewMixin onRemoveToolTip : end");
    }
    // 警告ダイアログ 初期設定
   ,initAlertDialog: function() {
      $R.log("ViewMixin initAlertDialog : start");

      var data = '<div data-role="popup" id="popupAlert" data-overlay-theme="a" data-theme="c" ';
      data += 'data-dismissible="false" style="max-width:400px;"> ';
      data += '<div data-role="header" data-theme="a" id="popupAlertHeader"> ';
      data += '<h4>警告</h4> ';
      data += '<div> ';  // data-role header
      data += '<div data-role="content" data-theme="d" id="popupAlertContent"> ';
      data += '<p></p></br> ';
      data += '<a href="#" data-role="button" data-inline="true" data-rel="back" data-theme="a">閉じる</a> ';
      data += '<div> ';  // data-role content
      data += '<div> ';  // data-role popup
      $("body:first").append(data).trigger("create");

      $R.log("ViewMixin initAlertDialog : end");
    }
    // 警告ダイアログを表示する
   ,onAlertDialog: function(arg) {
      $R.log("ViewMixin onAlertDialog : start");

      $("#popupAlertHeader h4").text(arg["title"]);
      $("#popupAlertContent p").text(arg["message"]);
      $("#popupAlert").popup("open");

      $R.log("ViewMixin onAlertDialog : end");
    }
    // 確認ダイアログ 初期設定
   ,initConfirmDialog: function(object) {
      $R.log("ViewMixin initConfirmDialog : start");

      var self = object;
      var data = '<div id= "confirmDialog" class="modal hide fade" tabindex="-1" role="dialog">';
      data += '<div id="confirmHeader" class="modal-header">';
      data += '<h4>確認</h4>';
      data += '<div>';  // alertHeader
      data += '<div id="confirmBody" class="modal-body">';
      data += '<p></p></br>';
      data += '<div>';  // alertBody
      data += '<div id="confirmFooter" class="modal-footer">';
      data += '<input type="button" class="btn" data-dismiss="modal" aria-hidden="true" value="は　い" ';
      data += 'onclick="sessionStorage.setItem(\'confirmDialog\', 1);">';
      data += '<input type="button" class="btn" data-dismiss="modal" aria-hidden="true" value="いいえ" ';
      data += 'onclick="sessionStorage.setItem(\'confirmDialog\', 0);">';
      data += '<div>';  // alertFooter
      data += '<div>';  // alertDialog
      $("body").append(data);

      $('#confirmDialog').on('hidden', function () {
        var status = self.pubsub.publish("confirmDialogAfter");
      })

      $R.log("ViewMixin initConfirmDialog : end");
    }
    // 確認ダイアログを表示する
   ,onConfirmDialog: function(arg) {
      $R.log("ViewMixin onConfirmDialog : start");

      $("#confirmHeader h4").text(arg["title"]);
      $("#confirmBody p").text(arg["message"]);
      $("#confirmDialog").modal("show")

      $R.log("ViewMixin onConfirmDialog : end");
    }
    // 実行確認ダイアログ 初期設定
   ,initExecuteDialog: function(object) {
      $R.log("ViewMixin initExecuteDialog : start");

      var self = object;
      var data = '<div id= "executeDialog" class="modal hide fade" tabindex="-1" role="dialog">';
      data += '<div id="executeHeader" class="modal-header">';
      data += '<h4>実行確認</h4>';
      data += '<div>';  // alertHeader
      data += '<div id="executeBody" class="modal-body">';
      data += '<p></p></br>';
      data += '<div>';  // alertBody
      data += '<div id="executeFooter" class="modal-footer">';
      data += '<input type="button" class="btn" data-dismiss="modal" aria-hidden="true" value="は　い" ';
      data += 'onclick="sessionStorage.setItem(\'executeDialog\', 1);">';
      data += '<input type="button" class="btn" data-dismiss="modal" aria-hidden="true" value="いいえ" ';
      data += 'onclick="sessionStorage.setItem(\'executeDialog\', 0);">';
      data += '<div>';  // alertFooter
      data += '<div>';  // alertDialog
      $("body").append(data);

      $('#executeDialog').on('hidden', function () {
        var status = self.pubsub.publish("executeDialogAfter");
      })

      $R.log("ViewMixin initExecuteDialog : end");
    }
    // 実行確認ダイアログを表示する
   ,onExecuteDialog: function(arg) {
      $R.log("ViewMixin onExecuteDialog : start");

      $("#executeHeader h4").text(arg["title"]);
      $("#executeBody p").text(arg["message"]);
      $("#executeDialog").modal("show")

      $R.log("ViewMixin onExecuteDialog : end");
    }
    // サーバ確認ダイアログ 初期設定
   ,initServerDialog: function(object) {
      $R.log("ViewMixin initServerDialog : start");

      var self = object;
      var data = '<div id= "serverDialog" class="modal hide fade" tabindex="-1" role="dialog">';
      data += '<div id="serverHeader" class="modal-header">';
      data += '<h4>サーバ確認</h4>';
      data += '<div>';  // alertHeader
      data += '<div id="serverBody" class="modal-body">';
      data += '<p></p></br>';
      data += '<div>';  // alertBody
      data += '<div id="serverFooter" class="modal-footer">';
      data += '<input type="button" class="btn" data-dismiss="modal" aria-hidden="true" value="ＯＫ" ';
      data += 'onclick="sessionStorage.setItem(\'serverDialog\', 1);">';
      data += '<div>';  // alertFooter
      data += '<div>';  // alertDialog
      $("body").append(data);

      $('#serverDialog').on('hidden', function () {
        var status = self.pubsub.publish("serverDialogAfter");
      })

      $R.log("ViewMixin initServerDialog : end");
    }
    // サーバ確認ダイアログを表示する
   ,onServerDialog: function(arg) {
      $R.log("ViewMixin onServerDialog : start");

      $("#serverHeader h4").text(arg["title"]);
      $("#serverBody p").text(arg["message"]);
      $("#serverDialog").modal("show")

      $R.log("ViewMixin onServerDialog : end");
    }
    // テーブルの明細行を作成する
   ,createTableRows: function(tableid, defaultline) {
      $R.log("ViewMixin createTableRows : start");

      var i;
      defaultline = defaultline - 1;
      for (i = 0; i < defaultline; i++) {
        $(tableid  + " tbody tr").eq(0).clone(true).insertAfter($(tableid  + " tbody tr").eq(i));
      }

      $R.log("ViewMixin createTableRows : end");
    }
  };
}(jQuery, Rmenu));