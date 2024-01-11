/* ************************************************************************* */
/*  基本名称メンテ/ 一覧登録（単一テーブル）パターン                             */
/*  ビューミックスイン                                                        */
/*  2014/08/16 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.BaseDataMainteViewMixin = {
    // ------------------------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------------------------
    initExecute: function(dataset) {
      $R.log("View initExecute : start");

      this.initテンプレートロード();
      this.initAlertDialog();        // 警告メッセージ用ダイアログ 初期処理
      this.initConfirmDialog(this);  // 確認メッセージ用ダイアログ 初期処理
      this.initExecuteDialog(this);  // 実行確認メッセージ用ダイアログ 初期処理
      this.initServerDialog(this);   // サーバ確認メッセージ用ダイアログ 初期処理

      $R.log("View initExecute : end");
    }

    // ------------------------------------------------------------------------
    //  テンプレートをロードする
    // ------------------------------------------------------------------------
    ,initテンプレートロード: function() {
      $R.log("View initテンプレートロード : start");

      // ＣＳＳファイル名をセッションストレージから取得しロードする
      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      var cssName = sessionStorage.loadItem("ＣＳＳファイル名");

      if (cssName) {
        var arg = {cssName: cssName};
        this.appendCSS(arg);
      }

      $('body').fadeIn("normal");

      $R.log("View initテンプレートロード : end");
    }

    // ------------------------------------------------------------------------
    //  ログイン情報を表示する
    // ------------------------------------------------------------------------
    ,setログイン情報: function(arg) {
      $R.log("View setログイン情報 : start");

      $("#ログイン和暦").html(arg["ログイン和暦"]); 
      $("#ログイン日時").html(arg["ログイン時刻"]); 
      $("#ユーザ氏名").html(arg["ユーザ名称"]); 

      $R.log("View setログイン情報 : end");
    }

    // ------------------------------------------------------------------------
    //  初期処理
    // ------------------------------------------------------------------------
    ,on初期処理: function(arg) {
      $R.log("View on初期処理 : start");

      $R.log("View on初期処理 : end");
    }

    // ------------------------------------------------------------------------
    // ボタン・ファンクションキー イベント処理
    // ------------------------------------------------------------------------
    ,onクリア: function(dataSet) {
      $R.log("View onクリア : start");

      // 検索項目をクリアする
      this.setFromDatasetToViewWithSessionStorageOfHeader(dataSet);

      if ( this.appspec.isExists($("#該当ＮＯ")) ) {
        var headerRecord  = this.appspec.getJSONChunkByIdAtRecords(dataSet, "header")["record"];
        $("#該当ＮＯ").val(headerRecord["該当ＮＯ"]["value"][0]);
      }

      $R.log("View onクリア : end");
    }

    // ------------------------------------------------------------------------
    // 行追加 クリックイベント処理
    // ------------------------------------------------------------------------
    ,on行追加クリック: function(dataSet) {
      $R.log("View on行追加クリック : start");

      this.resetJsonDataToTable("#mainTable", dataSet, "detail");

      $R.log("View on行追加クリック : end");
    }

    // ------------------------------------------------------------------------
    // 行チェック チェンジ イベント処理
    // ------------------------------------------------------------------------
    ,on行チェック: function(name, row) {
      $R.log("View on行チェック : start");

      var object  = $("." + name)
      var maxSize = object.length;
      for (var i = 0; i < maxSize; i++) {
        if (i == row) {
          $(object[i]).prop("checked", true);
        }
        else {
          $(object[i]).prop("checked", false);
        }
      }

      $R.log("View on行チェック : end");
    }

    // ------------------------------------------------------------------------
    //  テーブル行クリック処理
    // ------------------------------------------------------------------------
    ,onテーブル行クリック: function(arg) {
      $R.log("View onテーブル行クリック : start");

      var clickRow  = arg["クリック行"];

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      // 選択行にCSSクラスを設定する
      var j, k;
      var beforeRow = sessionStorage.loadItem("クリック行");
      var rows = $("#mainTable")[0].rows;
      jQuery.each(rows, function(j) {
        //k = j - 1;
        k = j;
        var cells = rows[j].cells;
        jQuery.each(cells, function() {
          if (k == beforeRow) {
            $(this).removeClass("rowBackground");
           }
          if (k == clickRow) {
            $(this).addClass("rowBackground");
          }
        });
      });

      sessionStorage.saveItem("クリック行", clickRow);

      // 20171124 shimoji
      if ( this.appspec.isExists($("#該当ＮＯ")) ) {
        $("#該当ＮＯ").val(arg["クリック行"] + 1);
      }

      $R.log("View onテーブル行クリック : end");
     }

    // ------------------------------------------------------------------------
    //  メインテーブル照会レスポンスデータ編集処理
    // ------------------------------------------------------------------------
    ,on照会OfEditResponseData: function(dataSet, responseData, mode) {
      $R.log("View on照会OfEditResponseData : start");

      this.fromJsonDataToView(responseData);
      this.resetJsonDataToTable("#mainTable", dataSet, "detail");

      // 削除チェックボックスに値を設定する
      var deleteCheckBox = $(".削除");
      var maxSize = deleteCheckBox.length;
      for (var i = 0; i < maxSize; i++) {
        $(deleteCheckBox[i]).prop("checked", false);
      }

      $R.log("View on照会OfEditResponseData : end");
    }

  };
}(jQuery, Rmenu));
