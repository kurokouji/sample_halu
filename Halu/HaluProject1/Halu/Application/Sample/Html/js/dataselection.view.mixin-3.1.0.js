/* ************************************************************************* */
/*  選択画面パターン                                                          */
/*  ビューミックスイン                                                        */
/*  2017/09/06 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.DataSelectionViewMixin = {
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
    ,showログイン情報: function(arg) {
      $R.log("View showログイン情報 : start");

      $("#ユーザ氏名").html(arg["ユーザ名称"]); 
      $("#ログイン日時").html(arg["ログイン時刻"]); 

      if ( arg["ログイン和暦"] != "") {
        $("#ログイン和暦").html(arg["ログイン和暦"]); 
      }

      //this.set権限設定();

      $R.log("View showログイン情報 : end");
    }

    // ------------------------------------------------------------------------
    //  権限設定
    // ------------------------------------------------------------------------
    ,set権限設定: function() {
      $R.log("View set権限設定 : start");

      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      var w_ユーザ権限 = sessionStorage.loadItem("ユーザ権限");

      var w_権限情報 = this.appspec.roleInfo;
      var maxSize1   = w_権限情報.length;
      for (var i = 0; i < maxSize1; i++) {
        var w_Object    = w_権限情報[i][0];
        var w_roleArray = w_権限情報[i][1];
        var mazSize2 = w_roleArray.length;
        for(var j = 0; j< mazSize2; j++){
          if (w_roleArray[j] == "") {
            continue;
          }

          if (w_ユーザ権限 == w_roleArray[j]) {
            $(w_Object).hide();
          }
        }
      }

      $R.log("View set権限設定 : end");
    }

    // ------------------------------------------------------------------------
    //  初期処理
    // ------------------------------------------------------------------------
    ,on初期処理: function(arg) {
      $R.log("View on初期処理 : start");

      var dataSet = arg["データセット"];

      // テーブルの空行を作成する
      var detailInfo  = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail");
      if (detailInfo === undefined) {
      }
      else {
        if (detailInfo["multiline"] == "yes") {
          this.resetJsonDataToTable("#mainTable", dataSet, "detail");
        }
      }

      $R.log("View on初期処理 : end");
    }

    // ------------------------------------------------------------------------
    //  ページ情報を表示する
    // ------------------------------------------------------------------------
    ,showページ情報: function(arg) {
      $R.log("View showページ情報 : start");

      var pageline   = arg["ページライン数"];
      var curpage    = arg["カレントページ"];
      var maxpage    = arg["最大ページ"];
      var totalcount = arg["トータル件数"];
      var pagedata   = curpage + "/" + maxpage + "ページ(" + totalcount + "件)";
      $("#mainForm input[name='ページ情報']").val(pagedata);
      $("#mainForm input[name='ページ情報']").attr("disabled","disabled");

      $("#最初のページ").removeAttr("disabled");
      $("#前のページ").removeAttr("disabled");
      $("#次のページ").removeAttr("disabled");
      $("#最後のページ").removeAttr("disabled");
      if (curpage == 1) {
        $("#最初のページ").attr("disabled","disabled");
        $("#前のページ").attr("disabled","disabled");
      }
      if (curpage == maxpage) {
        $("#最後のページ").attr("disabled","disabled");
        $("#次のページ").attr("disabled","disabled");
      }

      $R.log("View showページ情報 : end");
    }

    // ------------------------------------------------------------------------
    // ボタン・ファンクションキー イベント処理
    // ------------------------------------------------------------------------
    ,onクリア: function(dataSet) {
      $R.log("View onクリア : start");

      // 検索項目をクリアする
      this.setFromDatasetToViewWithSessionStorageOfHeader(dataSet);
      
      $R.log("View onクリア : end");
    }

    // ------------------------------------------------------------------------
    //  テーブル行クリック処理
    // ------------------------------------------------------------------------
    ,onテーブル行クリック: function(arg) {
      $R.log("View onTableRowClick : start");

      var clickRow  = arg["クリック行"];

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      // 選択行にCSSクラスを設定する
      var j, k;
      var beforeRow = sessionStorage.loadItem("クリック行");
      var rows = $("#mainTable")[0].rows;
      jQuery.each(rows, function(j) {
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

      if ( this.appspec.isExists($("#該当ＮＯ")) ) {
        $("#該当ＮＯ").val(arg["クリック行"] + 1);
      }

      $R.log("View onTableRowClick : end");
    }

    // ------------------------------------------------------------------------
    //  照会レスポンスデータ編集処理
    // -------------------------------------------------------
   ,on照会OfEditResponseData: function(dataSet, responseData, mode) {
      $R.log("View on照会OfEditResponseData : start");

      // テーブル以外の項目（ヘッダー・フッター）にデータを表示する
      this.fromJsonDataToView(dataSet);
      // テーブルにデータを表示する
      this.resetJsonDataToTable("#mainTable", dataSet, "detail");

      $R.log("View on照会OfEditResponseData : end");
    }

  };
}(jQuery, Rmenu));
