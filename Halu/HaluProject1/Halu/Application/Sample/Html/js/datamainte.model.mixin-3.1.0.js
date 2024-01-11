/* ************************************************************************* */
/*  マスタメンテ/ 単票登録（単一テーブル）パターン                               */
/*  モデルミックスイン                                                         */
/*  （明細の削除行をサーバに送信し、テーブルの削除フラグを更新する）               */
/*  2014/08/16 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.DataMainteModelMixin = {
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

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var mode           = sessionStorage.loadItem("処理モード");
      var beforeHtmlName = this.getBeforeHtmlName();

      var arg = {処理モード: mode, 前画面名: beforeHtmlName};
      this.pubsub.publish("showヘッダータイトル", arg);

      var dataSet = this.dataset.getData();
      arg["データセット"] = dataSet;

      $R.log("Model on初期処理 : end");
      return arg;
    }

    // ------------------------------------------------------------------------
    //  セッション情報をクリアする
    // ------------------------------------------------------------------------
    ,clearセッション情報: function() {
      $R.log("Model clearページ情報 : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.deleteAll("");

      $R.log("Model clearページ情報 : end");
    }

    // ------------------------------------------------------------------------
    //  モード切替
    // ------------------------------------------------------------------------
    ,onChangeモード切替: function(event) {
      $R.log("Model onChangeモード切替 : start");

      var w_モード = $("#モード切替").val();
      if (w_モード == "init") {
        $R.log("Model onChangeモード切替 : end");
        return;
      }

      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.saveItem("処理モード", w_モード);
      this.on初期処理();
      $("#モード切替").val("init");

      $R.log("Model onChangeモード切替 : end");
    }

    // ------------------------------------------------------------------------
    // 行追加 クリックイベント処理
    // データセット：detail
    // 明細テーブル：#mainTable
    // ------------------------------------------------------------------------
    ,on行追加クリック: function(row) {
      $R.log("Model on行追加クリック : start");

      var dataSet      = this.dataset.getData();
      var detailRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail");
      this.insertRowOfDetailRecord(detailRecord, row);

      $R.log("Model on行追加クリック : end");
      return dataSet;
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

      sessionStorage.saveItem("クリック行", clickRow);

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

      // 自画面のセッションストレージをセイブする
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

      var status = this.on訂正OfCheckRequestData(requestData, mode);

      $R.log("Model on照会OfCheckRequestData : end");
      return status;
    }
    ,on登録OfCheckRequestData: function(requestData, mode) {
      $R.log("Model on登録OfCheckRequestData : start");

      var status = this.on訂正OfCheckRequestData(requestData, mode);

      $R.log("Model on登録OfCheckRequestData : end");
      return status;
    }
    ,on訂正OfCheckRequestData: function(requestData, mode) {
      $R.log("Model on訂正OfCheckRequestData : start");

      // データセットからリクエストにデータを設定する
      var dataSet = this.dataset.getData();
      //this.setDatasetToJsonRecordsInDeleteLine(dataSet, requestData);    // 削除行をリクエストデータに出力する
      this.setDatasetToJsonRecordsNoDeleteLine(dataSet, requestData);    // 削除行をリクエストデータに出力しない

      $R.log("Model on訂正OfCheckRequestData : end");
      return true;
    }
    ,on削除OfCheckRequestData: function(requestData, mode) {
      $R.log("Model on削除OfCheckRequestData : start");

      var status = this.on訂正OfCheckRequestData(requestData, mode);

      $R.log("Model on削除OfCheckRequestData : end");
      return true;
    }

    // ------------------------------------------------------------------------
    //  照会レスポンスデータ編集処理
    //  データセット：detail
    //  明細テーブル：#mainTable
    // ------------------------------------------------------------------------
    ,on初期処理OfEditResponseData: function(responseData) {
      $R.log("Model on初期処理OfEditResponseData : start");

      var dataSet = this.dataset.getData();
      this.setJsonRecordsToDataset(responseData, dataSet, this.pubsub);

      $R.log("Model on初期処理OfEditResponseData : end");
      return dataSet;
    }
    ,on照会OfEditResponseData: function(responseData, mode) {
      $R.log("Model on照会OfEditResponseData : start");

      // データセットの明細デフォルト行数を取得
      var dataSet      = this.dataset.getData();
      var detailInfo   = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail");

      if (detailInfo === undefined) {
      }
      else {
        var defaultline  = detailInfo["defaultline"];

        // レスポンスの明細行数を取得
        var detailRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, "detail")["record"];
        var maxSize      = 0;
        for (var name in detailRecord) {
          maxSize = detailRecord[name]["value"].length
          break;
        }

        // レスポンスの明細行数が大きいとき、データセットの明細デフォルト行数とする
        if (maxSize > defaultline) {
          detailInfo["defaultline"] = maxSize;
        }
      }

      // レスポンスデータをデータセットにセットする
      this.setJsonRecordsToDataset(responseData, dataSet, this.pubsub);

      $R.log("Model on照会OfEditResponseData : end");
      return dataSet;
    }
    ,on登録OfEditResponseData: function(responseData, mode) {
      $R.log("Model on登録OfEditResponseData : start");

      var dataSet = this.on照会OfEditResponseData(responseData, mode);

      $R.log("Model on登録OfEditResponseData : end");
      return dataSet;
    }
    ,on訂正OfEditResponseData: function(responseData, mode) {
      $R.log("Model on訂正OfEditResponseData : start");

      var dataSet = this.on照会OfEditResponseData(responseData, mode);

      $R.log("Model on訂正OfEditResponseData : end");
      return dataSet;
    }
    ,on削除OfEditResponseData: function(responseData, mode) {
      $R.log("Model on削除OfEditResponseData : start");

      var dataSet = this.on照会OfEditResponseData(responseData, mode);

      $R.log("Model on削除OfEditResponseData : end");
      return dataSet;
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

    // ------------------------------------------------------------------------
    //  入力エラー確認ダイアログを表示する
    // ------------------------------------------------------------------------
    ,on入力エラー確認ダイアログ: function(message) {
      $R.log("Model on入力エラー確認ダイアログ : start");

      var status = message["status"];
      var msg    = message["message"];
      var arg    = {title: "入力エラー確認", status: status, message: msg};
      this.pubsub.publish("alertDialog", arg);

      $R.log("Model on入力エラー確認ダイアログ : end");
    }

  };
}(jQuery, Rmenu));
