/* ************************************************************************* */
/*  マスタメンテ/ 単票登録（単一テーブル）パターン                               */
/*  ビューミックスイン                                                        */
/*  2014/08/16 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.DataMainteViewMixin = {
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

      $("#ユーザ氏名").html(arg["ユーザ名称"]); 
      $("#ログイン日時").html(arg["ログイン時刻"]); 

      if ( arg["ログイン和暦"] != "") {
        $("#ログイン和暦").html(arg["ログイン和暦"]); 
      }

      //this.set権限設定();

      $R.log("View setログイン情報 : end");
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
    //  ヘッダタイトルを表示する
    // ------------------------------------------------------------------------
    ,showヘッダータイトル: function(arg) {
      $R.log("View showヘッダータイトル : start");

      var w_title    = $("#ヘッダータイトル").html();
      var titleArray = w_title.split(" ");
      var title      = titleArray[0];

      var mode  = arg["処理モード"];

      switch (mode) {
        case "select":
          title   += " （照会）";
          $("#実行").hide();
          break;
        case "insert":
          title   += " （新規）";
          $("#実行").show();
          break;
        case "convert":
          title   += " （複写）";
          $("#実行").show();
          break;
        case "update":
          title   += " （訂正）";
          $("#実行").show();
          break;
        case "delete":
          title   += " （削除）";
          $("#実行").show();
      }

      $("#ヘッダータイトル").html(title); 

      if ( $("#モード切替") ) {
        var beforHtmlName = this.appspec.beforename;
        if (beforHtmlName == arg["前画面名"]) {
          $("#モード切替").hide();
        }
      }

      $R.log("View showヘッダータイトル : end");
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
    // 行追加 クリックイベント処理
    // データセット：detail
    // 明細テーブル：#mainTable
    // ------------------------------------------------------------------------
    ,on行追加クリック: function(dataSet) {
      $R.log("View on行追加クリック : start");

      this.resetJsonDataToTable("#mainTable", dataSet, "detail");

      $R.log("View on行追加クリック : end");
    }

    // ------------------------------------------------------------------------
    //  照会レスポンスデータ編集処理
    //  データセット：detail
    //  明細テーブル：#mainTable
    // ------------------------------------------------------------------------
    ,on照会OfEditResponseData: function(dataSet, responseData, mode) {
      $R.log("View on照会OfEditResponseData : start");

      // テーブル以外の項目（ヘッダー・フッター）にデータを表示する
      this.fromJsonDataToView(dataSet);

      // テーブルにデータを表示する
      var detailInfo  = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail");
      if (detailInfo === undefined) {
      }
      else {
        if (detailInfo["multiline"] == "yes") {
          this.resetJsonDataToTable("#mainTable", dataSet, "detail");
        }
      }

      $R.log("View on照会OfEditResponseData : end");
    }
    ,on登録OfEditResponseData: function(dataSet, responseData, mode) {
      $R.log("View on登録OfEditResponseData : start");

      this.on照会OfEditResponseData(dataSet, responseData, mode);

      $R.log("View on登録OfEditResponseData : end");
      return dataSet;
    }
    ,on訂正OfEditResponseData: function(dataSet, responseData, mode) {
      $R.log("View on訂正OfEditResponseData : start");
      
      this.on照会OfEditResponseData(dataSet, responseData, mode);

      $R.log("View on訂正OfEditResponseData : end");
    }
    ,on削除OfEditResponseData: function(dataSet, responseData, mode) {
      $R.log("View on削除OfEditResponseData : start");
      
      this.on照会OfEditResponseData(dataSet, responseData, mode);

      $R.log("View on削除OfEditResponseData : end");
    }

  };
}(jQuery, Rmenu));
