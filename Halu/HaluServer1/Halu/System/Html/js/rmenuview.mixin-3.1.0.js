(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // データフォーマット関数
  App.FormatMixin = {
    formatExecute: {
      yyyySmmSdd: {
        format: function(value) {
          if (value == ""|| value == null) return value;
          var yyyy = value.substring(0, 4);
          var mm   = value.substring(4, 6);
          var dd   = value.substring(6, 8);
          return yyyy + "/" + mm + "/" + dd;
        }
       ,unformat: function(value) {
          if (value == ""|| value == null) return value;
          return new String(value).replace( /\//g, "" );
        }
      }
     ,yyyyNmmTddH: {
        format: function(value) {
          if (value == ""|| value == null) return value;
          var yyyy      = value.substring(0, 4);
          var mm        = value.substring(4, 6);
          var dd        = value.substring(6, 8);
          return yyyy + "年" + mm + "月" + dd + "日";
        }
       ,unformat: function(value) {
          if (value == ""|| value == null) return value;
          var yyyy = value.substring(0, 4);
          var mm   = value.substring(5, 7);
          var dd   = value.substring(8, 10);
          return yyyy + mm + dd;
        }
      }
     ,yyyyNmmT: {
        format: function(value) {
          if (value == ""|| value == null) return value;
          var yyyy      = value.substring(0, 4);
          var mm        = value.substring(4, 6);
          return yyyy + "年" + mm + "月";
        }
       ,unformat: function(value) {
          if (value == ""|| value == null) return value;
          var yyyy = value.substring(0, 4);
          var mm   = value.substring(5, 7);
          return yyyy + mm;
        }
      }
     ,quantity: {
        format: function(value) {
          if (value == ""|| value == null) return value;
          var formatvalue = String(value);
          // 20180307 符号付小数点の3桁カンマ編集対応 Okada
          return formatvalue.replace(/^([+-]?\d+)(?=\.|$)/, function(s){ return s.replace(/(\d+?)(?=(?:\d{3})+$)/g, '$1,');});
        //return formatvalue.replace(/(\d)(?=(\d\d\d)+$)/g, "$1,");
        //for(i = 0; i < formatvalue.length/3; i++){
        //  return formatvalue.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2");
        //}
        }
       ,unformat: function(value) {
          if (value == ""|| value == null) return value;
          return new String(value).replace( /,/g, "" );
        }
      }
     ,price: {
        format: function(value) {
          if (value == ""|| value == null) return value;
          var formatvalue = String(value);
          // 20180307 符号付小数点の3桁カンマ編集対応 Okada
          return formatvalue.replace(/^([+-]?\d+)(?=\.|$)/, function(s){ return s.replace(/(\d+?)(?=(?:\d{3})+$)/g, '$1,');});
        //return formatvalue.replace(/(\d)(?=(\d\d\d)+$)/g, "$1,");
        //for(i = 0; i < formatvalue.length/3; i++){
        //  return formatvalue.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2");
        //}
        }
       ,unformat: function(value) {
          if (value == ""|| value == null) return value;
          return new String(value).replace( /,/g, "" );
        }
      }
     ,money: {
        format: function(value) {
          if (value == ""|| value == null) return value;
          var formatvalue = String(value);
          // 20180307 符号付小数点の3桁カンマ編集対応 Okada
          return formatvalue.replace(/^([+-]?\d+)(?=\.|$)/, function(s){ return s.replace(/(\d+?)(?=(?:\d{3})+$)/g, '$1,');});
        //return formatvalue.replace(/(\d)(?=(\d\d\d)+$)/g, "$1,");
        //for(i = 0; i < formatvalue.length/3; i++){
        //  return formatvalue.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2");
        //}
        }
       ,unformat: function(value) {
          if (value == ""|| value == null) return value;
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
    // ローディング画像を表示する場所を設定する
    setLoadingImage: function() {
      var data = '<div id="loading" />';
      $("body").append(data);
    }
    // アウトラインイベントを設定し、コールバック関数を指定する
   ,setOutlineEvent: function(outlineEvent) {
      $R.log("OutlineMixin setOutlineEvent : start");

      this.setLoadingImage();

      $R.log("OutlineMixin setOutlineEvent : end");
    }
  };

  // テンプレートファイル　ロード関数
  App.LoadTemplateMixin = {
    // ナビバー　テンプレート　ファイルを設定する
    loadNavBar: function(arg) {
      $R.log("LoadTemplateMixin loadPageNavBar : start");

      if (arg["htmlName"]) {
        var url = $R.ApplicationURL + "/" + arg["htmlName"];
        $('#rmenu-navbar').loadTemplate(url, arg);
      }

      $R.log("LoadTemplateMixin loadPageNavBar : end");
    }
    // ヘッダー　テンプレート　ファイルを設定する
   ,loadHeader: function(arg) {
      $R.log("LoadTemplateMixin loadHeader : start");

      if (arg["htmlName"]) {
        var url = $R.ApplicationURL + "/" + arg["htmlName"];
        $('#rmenu-header').loadTemplate(url, arg);
      }

      $R.log("LoadTemplateMixin loadHeader : end");
    }
    // フッター　テンプレート　ファイルを設定する
   ,loadFooter: function(arg) {
      $R.log("LoadTemplateMixin loadFooter : start");

      if (arg["htmlName"]) {
        var url = $R.ApplicationURL + "/" + arg["htmlName"];
        $('#rmenu-footer').loadTemplate(url, arg);
      }

      $R.log("LoadTemplateMixin loadFooter : end");
    }
    // ページフッター　テンプレート　ファイルを設定する
   ,loadPageFooter: function(arg) {
      $R.log("LoadTemplateMixin loadPageFooter : start");

      if (arg["htmlName"]) {
        var url = $R.ApplicationURL + "/" + arg["htmlName"];
        $('#rmenu_pagefooter').loadTemplate(url, arg);
      }

      $R.log("LoadTemplateMixin loadPageFooter : end");
    }
    // HTMLテンプレートをロードする
   ,loadTemplate: function(arg) {
      $R.log("LoadTemplateMixin loadTemplate : start");

      var w_element  = arg["element"];
      var w_htmlname = arg["htmlName"];

      if (w_element) {
        if (w_htmlname) {
          var url = $R.ApplicationURL + "/" + w_htmlname;
          $(w_element).loadTemplate(url, arg);
        }
      }

      $R.log("LoadTemplateMixin loadTemplate : end");
    }
    // CSSファイルを追加する
   ,appendCSS: function(arg) {
      $R.log("LoadTemplateMixin appendCSS : start");

      if (arg["cssName"]) {
        var url = $R.ApplicationURL + arg["cssName"];

        $("head").append("<link>");
        css = $("head").children(":last");
        css.attr({
            rel: "stylesheet",
            type: "text/css",
            href: url
        });

      }

      $R.log("LoadTemplateMixin appendCSS : end");
    }
  };

  // 関数を追加する
  App.ViewMixin = {
    onFocus: function(event, value, focusCurRow) {
      $R.log("ViewMixin onFocus : start");

      var target = event.target;
      
      // 20150722 shimoji
      switch (target.type){
        case "button":
          break;
        case "checkbox":
          break;
        case "radio":
          break;
        case "file":
          break;
        case "select-one":
          break;
        case "select-multiple":
          break;
        default:
          target.value = value;
          //$(target).prop('selectionStart', 0);
          //$(target).prop('selectionEnd', 0);
          //target.setSelectionRange(0, 0);
          break;
      }

      var w_focusCurRow = focusCurRow;
      if (w_focusCurRow > 0) {
        w_focusCurRow = w_focusCurRow - 1;
      }
      var idname = "#error" + event.target.name + w_focusCurRow;
      if(!$(idname)) return;
      $(idname).hide();
      $(idname).remove();

      $R.log("ViewMixin onFocus : end");
    }
   ,onBlur: function(event) {
      $R.log("ViewMixin onBlur : start");

      // 入力データをフォーマットし再表示する
      var target = event.target;
      var value  = target.value;
      var rule   = this.format[target.name];
      var arg    = {value: value, rule: rule};

      // 20150722 shimoji
      switch (target.type){
        case "button":
          break;
        case "checkbox":
          break;
        case "radio":
          break;
        case "file":
          break;
        case "select-one":
          break;
        case "select-multiple":
          break;
        default:
          value        = this.onDataFormat(arg);
          target.value = value;
          break;
      }

      $R.log("ViewMixin onBlur : end");
    }
    // ガイドメッセージを表示する arg = {status: ステータス, message: メッセージ}
   ,onGuideMessage: function(arg) {
      $R.log("ViewMixin onGuideMessage : start");

      if (this.guidemessage) {
        $("#footer_status").html(arg["status"]);
        $("#footer_message").html(arg["message"]);
      }

      $R.log("ViewMixin onGuideMessage : end");
    }
    // エラーツールチップを表示する
    // arg = {target: イベントターゲット, message: エラーメッセージ, multiline: yes or no}
   ,onErrorToolTip: function(arg) {
      $R.log("ViewMixin onErrorToolTip : start");

      var toolTip = function(target, errorText, multiline, row) {
        var toolTip = $("<div id='error" + target.name + row + "'></div>");
        $(toolTip).addClass("errorToolTip");
// 2019-09-10 Okada
//      if ($(target).parent("td")) {
//        // 20140925 shimoji
//        //$(target).parent("td").append(toolTip);
//        $(target).parents("td").append(toolTip);
//      }
//      if ($(target).parent("div")) {
//        if ($(target).parent("div").parent("td")) {
//          $(target).parent("div").parent("td").append(toolTip);
//        }
//        else {
//          $(target).parent("div").append(toolTip);
//        }
//      }
// 2019-09-10 Okada
        $(target).parent().append(toolTip); //2019-09-10 Okada

        var message = $("<span>" + errorText  + "</span>");
        $(message).addClass("errorMessage");
        $(toolTip).append(message);
      }

      var length    = arg["message"].length;
      var errorText = "";
      for (var i = 0; i < length; i++) {
        errorText += arg["message"][i];
      }
      toolTip(arg["target"], errorText, arg["multiline"], arg["row"]);

      $R.log("ViewMixin onErrorToolTip : end");
    }
    // エラーツールチップを削除する arg = {target: イベントターゲット}
   ,onRemoveToolTip: function(arg) {
      $R.log("ViewMixin onRemoveToolTip : start");

      if(!$(".errorToolTip")) return;
      
      $(".errorMessage").hide();
      $(".errorMessage").remove();
      $(".errorToolTip").hide();
      $(".errorToolTip").remove();

      $R.log("ViewMixin onRemoveToolTip : end");
    }
    // 警告ダイアログ 初期設定
   ,initAlertDialog: function() {
      $R.log("ViewMixin initAlertDialog : start");

      var data = '<div class="modal fade" id="alertDialog" tabindex="-1" role="dialog" aria-labelledby="alertHeader" aria-hidden="true">';
      data += '<div class="modal-dialog">';
      data += '<div class="modal-content">';
      data += '<div class="modal-header">';
      data += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
      data += '<h4 class="modal-title" id="alertHeader">サーバ　エラー</h4>';
      data += '</div>';
      data += '<div class="modal-body" id="alertBody">';
      data += '<p></p></br>';
      data += '</div>';
      data += '<div class="modal-footer" id="alertFooter">'
      data += '<button id="alertDialogCLOSE" type="button" class="btn btn-default" data-dismiss="modal" default-value="閉じる" '
      data += '>閉じる</button>'
      data += '</div>';
      data += '</div>';
      data += '</div>';
      data += '</div>';
      $("body").append(data);

      $('#alertDialog').on('shown.bs.modal', function () {
        $("#alertDialogCLOSE").focus();
      })

      $R.log("ViewMixin initAlertDialog : end");
    }
    // 警告ダイアログを表示する
   ,onAlertDialog: function(arg) {
      $R.log("ViewMixin onAlertDialog : start");

      // 2013.05.28 光保 タイトル・メッセージに 複数行を設定できるようにしました
      if (Array.isArray(arg["title"])) {
        $("#alertHeader").html(arg["title"].join('<br />'));
      } else {
        $("#alertHeader").text(arg["title"]);
      }
      if (Array.isArray(arg["message"])) {
        $("#alertBody p").html(arg["message"].join('<br />'));
      } else {
        $("#alertBody p").text(arg["message"]);
      }
      // 2013.01.23 光保 ボタンの文字列を設定できるようにしました
      this.setDialogButtonLabels($("#alertFooter"), arg);
      $("#alertDialog").modal("show");

      $R.log("ViewMixin onAlertDialog : end");
    }
    // 確認ダイアログ 初期設定
   ,initConfirmDialog: function(object) {
      $R.log("ViewMixin initConfirmDialog : start");

      var self = object;
      var data  = '<div id="confirmDialog" class="modal fade" tabindex="-1" role="dialog">';
          data += '  <div class="modal-dialog">';
          data += '    <div class="modal-content">';
          data += '      <div id="confirmHeader" class="modal-header">';
          data += '        <h4>確認</h4>';
          data += '      </div>';  // confirmHeader
          data += '      <div id="confirmBody" class="modal-body">';
          data += '        <p></p></br>';
          data += '      </div>';  // confirmBody
          data += '      <div id="confirmFooter" class="modal-footer">';
          data += '        <input id="confirmDialogYES" type="button" class="btn" data-dismiss="modal" aria-hidden="true" value="は　い" ';
          data += '          default-value="は　い" ';
          data += '          onclick="sessionStorage.setItem(\'confirmDialog\', 1);">';
          data += '        <input id="confirmDialogNO" type="button" class="btn" data-dismiss="modal" aria-hidden="true" value="いいえ" ';
          data += '          default-value="いいえ" ';
          data += '          onclick="sessionStorage.setItem(\'confirmDialog\', 0);">';
          data += '      </div>';  // confirmFooter
          data += '    </div>';  // confirmDialog
          data += '  <div>';
          data += '<div>';
      $("body").append(data);

      $('#confirmDialog').on('hidden.bs.modal', function () {
        var status = self.pubsub.publish("confirmDialogAfter");
      })

      $('#confirmDialog').on('shown.bs.modal', function () {
        $("#confirmDialogYES").focus();
      })

      $R.log("ViewMixin initConfirmDialog : end");
    }
    // 確認ダイアログを表示する
   ,onConfirmDialog: function(arg) {
      $R.log("ViewMixin onConfirmDialog : start");

      // 2013.05.28 光保 タイトル・メッセージに 複数行を設定できるようにしました
      if (Array.isArray(arg["title"])) {
        $("#confirmHeader h4").html(arg["title"].join('<br />'));
      } else {
        $("#confirmHeader h4").text(arg["title"]);
      }
      if (Array.isArray(arg["message"])) {
        $("#confirmBody p").html(arg["message"].join('<br />'));
      } else {
        $("#confirmBody p").text(arg["message"]);
      }
      // 2013.01.23 光保 ボタンの文字列を設定できるようにしました
      this.setDialogButtonLabels($("#confirmFooter"), arg);
      $("#confirmDialog").modal("show");

      $R.log("ViewMixin onConfirmDialog : end");
    }
    // 実行確認ダイアログ 初期設定
   ,initExecuteDialog: function(object) {
      $R.log("ViewMixin initExecuteDialog : start");

      var self = object;
      var data  = '<div id="executeDialog" class="modal fade" tabindex="-1" role="dialog">';
          data += '  <div class="modal-dialog">';
          data += '    <div class="modal-content">';
          data += '      <div id="executeHeader" class="modal-header">';
          data += '        <h4>実行確認</h4>';
          data += '      </div>';  // executeHeader
          data += '      <div id="executeBody" class="modal-body">';
          data += '        <p></p></br>';
          data += '      </div>';  // executeBody
          data += '      <div id="executeFooter" class="modal-footer">';
          data += '        <input id="executeDialogYES" type="button" class="btn" data-dismiss="modal" aria-hidden="true" value="は　い" ';
          data += '          default-value="は　い" ';
          data += '          onclick="sessionStorage.setItem(\'executeDialog\', 1);">';
          data += '        <input id="executeDialogNO" type="button" class="btn" data-dismiss="modal" aria-hidden="true" value="いいえ" ';
          data += '          default-value="いいえ" ';
          data += '          onclick="sessionStorage.setItem(\'executeDialog\', 0);">';
          data += '      </div>';  // executeFooter
          data += '    </div>';  // executeDialog
          data += '  </div>';
          data += '</div>';
      $("body").append(data);

      $('#executeDialog').on('hidden.bs.modal', function () {
        var status = self.pubsub.publish("executeDialogAfter");
      })

      $('#executeDialog').on('shown.bs.modal', function () {
        $("#executeDialogYES").focus();
      })

      $R.log("ViewMixin initExecuteDialog : end");
    }
    // 実行確認ダイアログを表示する
   ,onExecuteDialog: function(arg) {
      $R.log("ViewMixin onExecuteDialog : start");

      // 2013.05.28 光保 タイトル・メッセージに 複数行を設定できるようにしました
      if (Array.isArray(arg["title"])) {
        $("#executeHeader h4").html(arg["title"].join('<br />'));
      } else {
        $("#executeHeader h4").text(arg["title"]);
      }
      if (Array.isArray(arg["message"])) {
        $("#executeBody p").html(arg["message"].join('<br />'));
      } else {
        $("#executeBody p").text(arg["message"]);
      }
      // 2013.01.23 光保 ボタンの文字列を設定できるようにしました
      this.setDialogButtonLabels($("#executeFooter"), arg);
      $("#executeDialog").modal("show");

      $R.log("ViewMixin onExecuteDialog : end");
    }

    // サーバ確認ダイアログ 初期設定
   ,initServerDialog: function(object) {
      $R.log("ViewMixin initServerDialog : start");

      var self = object;
      var data = '<div class="modal fade" id="serverDialog" tabindex="-1" role="dialog" aria-labelledby="serverHeader" aria-hidden="true">';
         data += '  <div class="modal-dialog">';
         data += '    <div class="modal-content">';
         data += '      <div class="modal-header">';
         data += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
         data += '        <div class="modal-header" id="serverHeader">';
         data += '          <h4>サーバ確認</h4>';
         data += '        </div>';
         data += '      </div>';
         data += '      <div class="modal-body" id="serverBody">';
         data += '        <p></p></br>';
         data += '      </div>';
         data += '      <div class="modal-footer" id="serverFooter">'
         data += '        <button id="serverDialogＯＫ" type="button" class="btn btn-default" data-dismiss="modal" default-value="ＯＫ" '
         data += '          onclick="sessionStorage.setItem(\'serverDialog\', 1);">ＯＫ</button>'
         data += '      </div>';
         data += '    </div>';
         data += '  </div>';
         data += '</div>';
      $("body").append(data);

      $('#serverDialog').on('hidden.bs.modal', function () {
        var status = self.pubsub.publish("serverDialogAfter");
      })

      $('#serverDialog').on('shown.bs.modal', function () {
        $("#serverDialogＯＫ").focus();
      })

      $R.log("ViewMixin initServerDialog : end");
    }
    // サーバ確認ダイアログを表示する
   ,onServerDialog: function(arg) {
      $R.log("ViewMixin onServerDialog : start");

      // 2013.05.28 光保 タイトル・メッセージに 複数行を設定できるようにしました
      if (Array.isArray(arg["title"])) {
        $("#serverHeader h4").html(arg["title"].join('<br />'));
      } else {
        $("#serverHeader h4").text(arg["title"]);
      }
      if (Array.isArray(arg["message"])) {
        $("#serverBody p").html(arg["message"].join('<br />'));
      } else {
        $("#serverBody p").text(arg["message"]);
      }
      // 2013.01.23 光保 ボタンの文字列を設定できるようにしました
      this.setDialogButtonLabels($("#serverFooter"), arg);
      $("#serverDialog").modal("show");

      $R.log("ViewMixin onServerDialog : end");
    }

    // 2013.01.23 光保
    // ダイアログのボタンを設定します
   ,setDialogButtonLabels: function(footer_object, arg) {
      $R.log("ViewMixin setDialogButtonLabels : start");

      if ('button_labels' in arg) {
        footer_object.find('input[type="button"]').each(function(index) {
          $(this).val(arg.button_labels[index] !== undefined ?
            arg.button_labels[index] : $(this).attr('default-value'));
        });
      }

      $R.log("ViewMixin setDialogButtonLabels : end");
    }

    // -------------------------------------------------------
    // セレクトボックス表示処理（ＩＤでの設定）
    // -------------------------------------------------------
   ,onShowSelectBox: function(defSelectBox, responseRecord) {
      $R.log("ViewMixin onShowSelectBox : start");

      var selectorID = defSelectBox["selectorid"];
      var initValue  = defSelectBox["init"]["initvalue"];
      var initHtml   = defSelectBox["init"]["inithtml"];
      var valueName  = defSelectBox["init"]["valuename"];
      var htmlName   = defSelectBox["init"]["htmlname"];
      var max        = responseRecord[valueName]["value"].length;

      $("#" + selectorID + " option").remove(); //20150703 追加 Okada

      var option = $('<option selected:selected/>');
      if (initHtml) {
        option.val(initValue);
        option.html(initHtml);
        $("#" + selectorID).append(option);
      }
      

      for (var i = 0; i < max; i++) {
        option = $('<option />');
        option.val(responseRecord[valueName]["value"][i]);
        option.html(responseRecord[htmlName]["value"][i]);
        $("#" + selectorID).append(option);
      }

      $R.log("ViewMixin onShowSelectBox : end");
    }
    
    // --------------------------------------------------------------
    // セレクトボックス表示処理　ＩＤからカレント行を一括表示する
    // --------------------------------------------------------------
   ,showCurrentSelectBox: function(dataSetInfo, defSelectBox) {
      $R.log("View setCurrentSelectBox : start");
      
      var max = defSelectBox.length;
      for (var i = 0; i < max; i++) {
        
        var selectorid    = defSelectBox[i]["selectorid"];
        var detasetID     = defSelectBox[i]["change"]["datasetid"];
        var codeName      = defSelectBox[i]["change"]["valuename"];
        
        var dataSetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSetInfo, detasetID);
        var codeValue     = dataSetRecord["record"][codeName]["value"][0];
        
        $("#" + selectorid).val(codeValue);
        
      }

      $R.log("View setCurrentSelectBox : end");
    }
    
    // -------------------------------------------------------
    // チェックボックス表示処理
    // -------------------------------------------------------
   ,onShowCheckBox: function(defCheckBox, responseRecord) {
      $R.log("ViewMixin onShowCheckBox : start");
      
      var selectorID  = defCheckBox["selectorid"]
      var datasetName = defCheckBox["datasetname"];
      var onValue     = defCheckBox["value"]["on"];
      var offValue    = defCheckBox["value"]["off"];
      
      if (responseRecord[datasetName]["value"][0] == onValue) {
        $("#" + selectorID).prop("checked", true);
      }
      if (responseRecord[datasetName]["value"][0] == offValue) {
        $("#" + selectorID).prop("checked", false);
      }

      $R.log("ViewMixin onShowCheckBox : end");
    }
    
    // -------------------------------------------------------
    // テーブル　チェックボックス表示処理
    // -------------------------------------------------------
   ,onShowCheckBoxTable: function(defCheckBox, responseRecord) {
      $R.log("ViewMixin onShowCheckBoxTable : start");
      
      var selectorName = defCheckBox["selectorname"]
      var datasetName  = defCheckBox["datasetname"];
      var onValue      = defCheckBox["value"]["on"];
      var offValue     = defCheckBox["value"]["off"];
      var max          = responseRecord[datasetName]["value"].length;
      var targetObject = $("." + selectorName);
      
      for (var i = 0; i < max; i++) {
        if (responseRecord[datasetName]["value"][i] == onValue) {
          $(targetObject[i]).prop("checked", true);
        }
        if (responseRecord[datasetName]["value"][i] == offValue) {
          $(targetObject[i]).prop("checked", false);
        }
      }

      $R.log("ViewMixin onShowCheckBoxTable : end");
    }
    
    // -------------------------------------------------------
    // ラジオボタン表示処理
    // -------------------------------------------------------
   ,onShowRadioButton: function(defRadioButton, responseRecord) {
      $R.log("ViewMixin onShowRadioButton : start");


      $R.log("ViewMixin onShowRadioButton : end");
    }
    
    // -------------------------------------------------------
    // 20180402 下地　追加
    // -------------------------------------------------------
    // JsonDataから明細テーブルを再作成する
    // -------------------------------------------------------
   ,recreateJsonDataToTable: function(tableID, jsonData, idName, itemName) {
      $R.log("ViewMixin recreateJsonDataToTable : start");

      // 明細テーブルの２行目移行を削除する
      this.deleteTableSecondRow(tableID);
      
      // 明細テーブルの１行目をクリアする
      var detailRecord = this.appspec.getJSONChunkByIdAtRecords(jsonData, idName)["record"];
      this.clearTableFirstRow(detailRecord);

      // 明細テーブルの１行目をデータ件数分コピーする
      var maxSize = detailRecord[itemName]["value"].length;
      this.copyTableFirstRow(tableID, maxSize);

      $R.log("ViewMixin recreateJsonDataToTable : end");
    }
    
    // -------------------------------------------------------
    // 20170427 下地　追加
    // -------------------------------------------------------
    // JsonDataの値をViewに表示する
    // (テーブルデータは対象外)
    // -------------------------------------------------------
   ,fromJsonDataToView: function(jsonData) {
      $R.log("ModelMixin fromJsonDataToView : start");
      
      var jsonRecords = jsonData["records"];
      var maxSize     = jsonRecords.length;
      
      for (var i = 0; i < maxSize; i++) {
        var jsonRecord = jsonRecords[i];
        
        if (jsonRecord["multiline"] == "yes") {
          continue;
        }
        
        for (var name in jsonRecord["record"]) {
          var object = $("#" + name)[0];
          if (object === undefined) {
            continue;
          }
          
          var value = jsonRecord["record"][name]["value"][0];
          if (name in this.format) {
            var rule = this.format[name];
            var arg  = {value: value, rule: rule};
            value = this.pubsub.publish("dataformat", arg);
          }
          
          var tagName  = $(object)[0].tagName;
          var typeName = "";
          if (tagName == "INPUT") {
            typeName = $(object)[0].type;
          }

          this.setValueToObject(tagName, typeName, $(object)[0], value);
        }
      }

      $R.log("ModelMixin fromJsonDataToView : end");
    }

    // -------------------------------------------------------
    // JsonDataからテーブルを再描画する
    // -------------------------------------------------------
   ,resetJsonDataToTable: function(tableID, jsonData, idName) {
      $R.log("ViewMixin resetJsonDataToTable : start");

      // 明細テーブルの２行目移行を削除する
      this.deleteTableSecondRow(tableID);
      
      // 明細テーブルの１行目をクリアする
      var detailRecord = this.appspec.getJSONChunkByIdAtRecords(jsonData, idName)["record"];
      this.clearTableFirstRow(detailRecord);

      // 明細行数を設定する
      var maxSize = 0;
      for (var name in detailRecord) {
        maxSize = detailRecord[name]["value"].length
        break;
      }
      
      // 明細テーブルの１行目をデータ件数分コピーする
      this.copyTableFirstRow(tableID, maxSize);

      // 明細テーブルにデータを表示する
      this.showJsonDataToTable(detailRecord, maxSize);

      $R.log("ViewMixin resetJsonDataToTable : end");
    }
    
    // -------------------------------------------------------
    // テーブルの２行目以降を削除する
    // -------------------------------------------------------
   ,deleteTableSecondRow: function(tableID) {
      $R.log("ViewMixin deleteTableSecondRow : start");

      $(tableID).find("tbody tr:gt(0)").remove();

      var j;
      var rows = $(tableID)[0].rows;
      jQuery.each(rows, function(j) {
        var cells = rows[j].cells;
        jQuery.each(cells, function() {
          $(this).removeClass("rowBackground");
        });
      });

      $R.log("ViewMixin deleteTableSecondRow : end");
    }
    
    // -------------------------------------------------------
    // 明細テーブルの１行目をクリアする
    // -------------------------------------------------------
   ,clearTableFirstRow: function(detailRecord) {
      $R.log("ViewMixin clearTableFirstRow : start");

      for (var name in detailRecord) {
        var objArray = $("." + name);
        if ( !objArray.length ) {
          continue;
        }

        var tagName  = $(objArray)[0].tagName;
        var typeName = "";
        if (tagName == "INPUT") {
          typeName = $(objArray)[0].type;
        }
        
        this.setValueToObject(tagName, typeName, $(objArray)[0], "");
      }

      $R.log("ViewMixin clearTableFirstRow : end");
    }
    
    // -------------------------------------------------------
    // テーブルの１行目を指定行数分コピーする
    // -------------------------------------------------------
   ,copyTableFirstRow: function(tableID, maxSize) {
      $R.log("ViewMixin copyTableFirstRow : start");

      var copySize = maxSize - 1;
      for (var i = 0; i < copySize; i++) {
        $(tableID  + " tbody tr").eq(0).clone(true).insertAfter($(tableID  + " tbody tr").eq(i));
      }

      $R.log("ViewMixin copyTableFirstRow : end");
    }
    
    // -------------------------------------------------------
    // テーブルのROWにid番号を付与する
    // -------------------------------------------------------
   ,setRowidOfTable: function(tableID) {
      $R.log("ViewMixin setRowidOfTable : start");
      
      var table   = document.getElementById(tableID); 
      var maxSize = table.rows.length;
      for (var i = 0; i < maxSize; i++) {
        var row = table.rows[i]; 
        $(row).attr('id', i);
      }

      $R.log("ViewMixin setRowidOfTable : end");
    }

    // -------------------------------------------------------
    // 明細テーブルにデータを表示する
    // -------------------------------------------------------
   ,showJsonDataToTable: function(detailRecord, maxSize) {
      $R.log("ViewMixin showJsonDataToTable : start");

      for (var i = 0; i < maxSize; i++) {
        for (var name in detailRecord) {
          var objArray = $("." + name);
          if ( !objArray.length ) {
            continue;
          }

          var tagName  = $(objArray)[0].tagName;
          var typeName = "";
          if (tagName == "INPUT") {
            typeName = $(objArray)[0].type;
          }
        
          var value = detailRecord[name]["value"][i];
          
          if (name in this.format) {
            var rule = this.format[name];
            var arg  = {value: value, rule: rule};
            value = this.pubsub.publish("dataformat", arg);
          }

          this.setValueToObject(tagName, typeName, $(objArray)[i], value);
        }
      }

      $R.log("ViewMixin showJsonDataToTable : end");
    }
    
   ,setValueToObject: function(tagName, typeName, object, value) {

      switch (tagName){
        case "INPUT":
          this.setValueToObjectOfInput(tagName, typeName, object, value);
          break;
        case "SELECT":
          this.setValueToObjectOfInput(tagName, typeName, object, value);
          break;
        case "TEXTAREA":
          this.setValueToObjectOfInput(tagName, typeName, object, value);
          break;
        default:
          this.setValueToObjectOfOther(tagName, typeName, object, value);
          break;
      }

    }

   ,setValueToObjectOfInput: function(tagName, typeName, object, value) {

      switch (typeName){
        case "text":
          $(object).val(value);
          break;
        case "checkbox":
          if (value == "" || value == "0") {
            $(object).prop("checked", false);
          }
          else {
            $(object).prop("checked", true);
          }
          break;
        case "radio":
          if (value == "" || value == "0") {
            $(object).prop("checked", false);
          }
          else {
            $(object).prop("checked", true);
          }
          break;
        case "button":
          break;
        default:
          $(object).val(value);
          break;
      }
      
    }

   ,setValueToObjectOfOther: function(tagName, typeName, object, value) {
      
      switch (tagName){
        case "BUTTON":
          break;
        case "DIV":
          $(object).html(value);
          break;
        case "LABEL":
          $(object).text(value);
          break;
        case "TD":
          $(object).html(value);
          break;
        default:
          $(object).html(value);
          break;
      }

    }
    
    // -------------------------------------------------------
    // 画面遷移・選択画面　処理
    
    // -------------------------------------------------------
    //  画面ヘッダ　キー項目　表示＆クリア処理
    // -------------------------------------------------------
   ,setFromDatasetToViewWithSessionStorageOfHeader: function(dataSet) {
      $R.log("ViewMixin setFromDatasetToViewWithSessionStorageOfHeader : start");
      
      this.setFromDatasetToViewWithKeyInfo(dataSet, this.appspec.sessionStorageHeaderKey);

      $R.log("ViewMixin setFromDatasetToViewWithSessionStorageOfHeader : end");
    }
    
    // -------------------------------------------------------
    //  前画面からの引き継ぎデータを表示する
    // -------------------------------------------------------
   ,setFromDatasetToViewWithBeforeStorageData: function(dataSet) {
      $R.log("ViewMixin setFromDatasetToViewWithBeforeStorageData : start");
      
      this.setFromDatasetToViewWithKeyInfo(dataSet, this.appspec.beforeStorageData);

      $R.log("ViewMixin setFromDatasetToViewWithBeforeStorageData : end");
    }
    
    // -------------------------------------------------------
    //  画面キー情報＆前画面からの引き継ぎデータを表示する
    // -------------------------------------------------------
   ,setFromDatasetToViewWithKeyInfo: function(dataSet, keyInfo) {
      // 検索項目をクリアする
      var maxSize1      = keyInfo.length;
      for (var i = 0; i < maxSize1; i++) {
        var datasetID     = keyInfo[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = keyInfo[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName  = keyInfo[i]["dataname"][j];
          var className = keyInfo[i]["classname"][j];
          var typeName  = keyInfo[i]["typename"][j];
          
          if (typeName == "text") {
            $("." + className).val(datasetRecord[itemName]["value"][0]);
          }
          if (typeName == "select") {
            $("." + className).val(datasetRecord[itemName]["value"][0]);
          }
          if (typeName == "multipleselect") {
            var strArray = datasetRecord[itemName]["value"][0].split(",");
            var $select   = $("#" + className);
            $select.multipleSelect("uncheckAll");
            $select.multipleSelect("setSelects", strArray);
          }
          if (typeName == "checkbox") {
            if (datasetRecord[itemName]["value"][0] == "" || datasetRecord[itemName]["value"][0] == "0") {
              $("." + className).prop("checked", false);
            }
            else {
              $("." + className).prop("checked", true);
            }
          }
          if (typeName == "td") {
            $("." + className).text(datasetRecord[itemName]["value"][0]);
          }
        }
      }
    }
    
    // ------------------------------------------------------------------
    //  画面が表示された時、最初にフォーカスを設定する項目を指定する
    // ------------------------------------------------------------------
   ,setFirstFocusItem: function() {
      $R.log("ViewMixin setFirstFocusItem : start");

      if (this.appspec.isExists(this.appspec.firstFocusItem) ) {
        if (this.appspec.isExists(this.appspec.firstFocusItem[0]) ) {
          if (this.appspec.firstFocusItem[0][0] == "class") {
            var object =  $("." + this.appspec.firstFocusItem[0][1])[0];
          }
          else {
            var object = $("#" + this.appspec.firstFocusItem[0][1])[0];
          }
        
          object.focus();
          if (object.type == "text" || object.type == "textarea") {
            //object.setSelectionRange(0, 0);
            object.value += "";  // 20181025 shimoji キャレットを最後に設定
          }
        }
      }

      $R.log("ViewMixin setFirstFocusItem : end");
    }
    
    // ------------------------------------------------------------------
    //  F12押下時、フォーカスを設定する項目を指定する
    // ------------------------------------------------------------------
   ,setF12FocusItem: function() {
      $R.log("ViewMixin setF12FocusItem : start");

      if (this.appspec.isExists(this.appspec.f12FocusItem) ) {
        if (this.appspec.isExists(this.appspec.f12FocusItem[0]) ) {
          if (this.appspec.f12FocusItem[0][0] == "class") {
            var object =  $("." + this.appspec.f12FocusItem[0][1])[0];
          }
          else {
            var object = $("#" + this.appspec.f12FocusItem[0][1])[0];
          }
        
          object.focus();
          if (object.type == "text" || object.type == "textarea") {
            //object.setSelectionRange(0, 0);
            object.value += "";  // 20181025 shimoji キャレットを最後に設定
          }
        }
      }

      $R.log("ViewMixin setF12FocusItem : end");
    }
    

  };
}(jQuery, Rmenu));
