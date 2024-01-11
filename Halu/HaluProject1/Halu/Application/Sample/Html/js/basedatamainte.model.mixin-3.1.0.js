/* ************************************************************************* */
/*  基本名称メンテ/ 一覧登録（単一テーブル）パターン                             */
/*  モデルミックスイン                                                        */
/*  （明細の削除行をサーバに送信し、テーブルの削除フラグを更新する）               */
/*  2014/08/16 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.BaseDataMainteModelMixin = {
    // ------------------------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------------------------
    initExecute: function() {
      $R.log("Model initExecute : start");

      var dataSet = this.dataset.getData();
      this.clearDatasetJson(dataSet);
      
      $R.log("Model initExecute : end");
    }

    // ------------------------------------------------------------------------
    //  セッションストレージからログイン情報を取得し表示イベントを発行する
    // ------------------------------------------------------------------------
    ,getログイン情報: function() {
      $R.log("Model getログイン情報 : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + ".Login");

      var username = sessionStorage.loadItem("ユーザ名称");
      var datetime = sessionStorage.loadItem("ログイン時刻");
      var jdate    = sessionStorage.loadItem("ログイン和暦");
      var arg      = {ユーザ名称: username, ログイン時刻: datetime, ログイン和暦: jdate};

      // ログイン情報をログインレコードに設定する
      var dataSet     = this.dataset.getData();
      var loginRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, "login");
      if (loginRecord) {
        loginRecord["record"]["ユーザＩＤ"]["value"][0] = sessionStorage.loadItem("ユーザＩＤ");
        loginRecord["record"]["ユーザ名称"]["value"][0] = sessionStorage.loadItem("ユーザ名称");
      }

      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      $R.log("Model getログイン情報 : end");
      return arg;
    }

    // ------------------------------------------------------------------------
    //  初期処理
    // ------------------------------------------------------------------------
    ,on初期処理: function() {
      $R.log("Model on初期処理 : start");

      var arg = {};

      $R.log("Model on初期処理 : end");
      return arg;
    }

    // ------------------------------------------------------------------------
    //  セッション情報をクリアする
    // ------------------------------------------------------------------------
    ,clearページ情報: function() {
      $R.log("Model clearページ情報 : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.deleteAll("");

      $R.log("Model clearページ情報 : end");
    }

    // ------------------------------------------------------------------------
    // ボタン・ファンクションキー イベント処理
    // ------------------------------------------------------------------------
    ,onクリア: function() {
      $R.log("Model onクリア : start");

      // データセットを設定する
      var dataSet = this.dataset.getData();

      this.clearSessionStorageOfKeyInfo(this.appspec.sessionStorageHeaderKey);
      this.setFromSessionStorageToDatasetOfKeyInfo(dataSet, this.appspec.sessionStorageHeaderKey);
      
      if ( this.appspec.isExists($("#該当ＮＯ")) ) {
        this.dataset.setElementData("", "該当ＮＯ");
      }

      $R.log("Model onクリア : end");
      return dataSet;
    }

    // ------------------------------------------------------------------------
    // 行追加 クリックイベント処理
    // ------------------------------------------------------------------------
    ,on行追加クリック: function(row) {
      $R.log("Model on行追加クリック : start");

      // デフォルトラインを設定する
      var dataSet      = this.dataset.getData();
      var detailRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail");
      this.insertRowOfDetailRecord(detailRecord, row);

      $R.log("Model on行追加クリック : end");
      return dataSet;
    }

    // ------------------------------------------------------------------------
    //  テーブルの選択行をセッションストレージに格納する
    // ------------------------------------------------------------------------
    ,on行チェック: function(name, row) {
      $R.log("Model on行チェック : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      // データセットを取得する
      var dataSet = this.dataset.getData();

      // 画面明細キー定義情報をセッションストレージにセイブする
      var datasetID     = this.appspec.sessionStorageDetailKey[0]["datasetid"];
      var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
      var maxSize       = this.appspec.sessionStorageDetailKey[0]["dataname"].length;
      for (var i = 0; i < maxSize; i++) {
        var itemName = this.appspec.sessionStorageDetailKey[0]["dataname"][i]
        sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][row]);
      }

      sessionStorage.saveItem("クリック名", name);
      sessionStorage.saveItem("クリック行", row);

      $R.log("Model on行チェック : end");
    }

    // ------------------------------------------------------------------------
    //  テーブルの選択行をセッションストレージに格納する
    // ------------------------------------------------------------------------
    ,onテーブル行クリック: function(arg) {
      $R.log("Model onテーブル行クリック : start");

      var clickRow = arg["クリック行"];

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      // データセットを取得する
      var dataSet = this.dataset.getData();

      // 画面明細キー定義情報をセッションストレージにセイブする
      var datasetID     = this.appspec.sessionStorageDetailKey[0]["datasetid"];
      var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
      var maxSize       = this.appspec.sessionStorageDetailKey[0]["dataname"].length;
      for (var i = 0; i < maxSize; i++) {
        var itemName = this.appspec.sessionStorageDetailKey[0]["dataname"][i]
        sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][clickRow]);
      }

      if ( this.appspec.isExists($("#該当ＮＯ")) ) {
        this.dataset.setElementData(clickRow + 1, "該当ＮＯ");
      }

      $R.log("Model onテーブル行クリック : end");
    }

    // ------------------------------------------------------------------------
    //  メンテナンス画面呼び出し（次画面呼び出し）
    // ------------------------------------------------------------------------
    ,on次画面表示: function(nextGui, mode) {
      $R.log("Model on次画面表示 : start");

      // 次画面への引き渡しデータをチェックする
      var arg = this.checkNextStorageData();
      if (arg["status"] != "OK") {
        this.pubsub.publish("alertDialog", arg);
        return;
      }

      // 自画面のキー定義情報をセッションストレージにセイブする
      this.saveSessionStorage();

      // 次画面への引き渡しデータを設定する
      this.setNextStorageData(nextGui);

      var currName  = this.appspec.urlInfo[0]["app"];
      var nextArray = currName.split("/"); 
      nextArray[3]  = nextGui;
      var nextName  = nextArray.join("/");

      this.setTransitionData(currName.slice(0, -1));
      this.postHtmlTransition(nextName.slice(0, -1));

      $R.log("Model on次画面表示 : end");
    }

    // ------------------------------------------------------------------------
    //  リクエストデータ編集・チェック処理
    // ------------------------------------------------------------------------
    ,on照会OfCheckRequestData: function(requestData, mode) {
      $R.log("Model on照会OfCheckRequestData : start");

      this.on実行OfCheckRequestData(requestData, mode);

      $R.log("Model on照会OfCheckRequestData : end");
      return true;
    }
    ,on実行OfCheckRequestData: function(requestData, mode) {
      $R.log("Model on実行OfCheckRequestData : start");

      // データセットからリクエストデータを設定する
      var dataSet = this.dataset.getData();
      this.setDatasetToJsonRecordsInDeleteLine(dataSet, requestData);

      $R.log("Model on実行OfCheckRequestData : end");
      return true;
    }
    ,on表示順再設定OfCheckRequestData: function(requestData, mode) {
      $R.log("Model on表示順再設定OfCheckRequestData : start");

      $R.log("Model on表示順再設定OfCheckRequestData : end");
      return true;
    }

    // ------------------------------------------------------------------------
    //  レスポンスデータ編集処理
    // ------------------------------------------------------------------------
    ,on初期処理OfEditResponseData: function(responseData) {
      $R.log("Model on初期処理OfEditResponseData : start");

      var dataSet = this.dataset.getData();
      this.setJsonRecordsToDataset(responseData, dataSet, this.pubsub);

      $R.log("Model on初期処理OfEditResponseData : end");
      return dataSet;
    }
    ,on照会OfEditResponseData: function(responseData) {
      $R.log("Model on照会OfEditResponseData : start");

      var dataSet = this.dataset.getData();
      this.setJsonRecordsToDataset(responseData, dataSet, this.pubsub);

      $R.log("Model on照会OfEditResponseData : end");
      return dataSet;
    }
    ,on実行OfEditResponseData: function(responseData) {
      $R.log("Model on実行OfEditResponseData : start");

      this.on照会OfEditResponseData(responseData);

      $R.log("Model on実行OfEditResponseData : end");
    }

    // ------------------------------------------------------------------------
    //  サーバ処理確認ダイアログを表示する
    // ------------------------------------------------------------------------
    ,onサーバ処理確認ダイアログ: function(responseData) {
      $R.log("Model onサーバ処理確認ダイアログ : start");

      var status = responseData["message"]["status"];
      var msg    = responseData["message"]["msg"];
      var arg    = {title: "サーバ処理確認", status: status, message: msg};
      this.pubsub.publish("serverDialog", arg);

      $R.log("Model onサーバ処理確認ダイアログ : end");
    }

  };
}(jQuery, Rmenu));
