/* ************************************************************************* */
/*  マスタメンテ一覧表/ 一覧照会（単一テーブル）パターン                         */
/*  モデルミックスイン                                                        */
/*  2017/06/12 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.DataMainteListModelMixin = {
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

      var arg     = {};
      var dataSet = this.dataset.getData();
      arg["データセット"] = dataSet;

      $R.log("Model on初期処理 : end");
      return arg;
    }

    // ------------------------------------------------------------------------
    //  初期リロード前処理（セッションストレージのデータをデータセットに設定する）
    // ------------------------------------------------------------------------
    ,on初期リロード前処理: function() {
      $R.log("Model on初期リロード前処理 : start");

      // データセットを設定する
      var dataSet = this.dataset.getData();

      // セッションストレージのデータをデータセットに設定する
      dataSet = this.setFromSessionStorageToDatasetOfKeyInfo(dataSet, this.appspec.sessionStorageHeaderKey);

      $R.log("Model on初期リロード前処理 : end");
      return dataSet;
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
    //  テーブルの選択行をセッションストレージに格納する
    // ------------------------------------------------------------------------
    ,onテーブル行クリック: function(arg) {
      $R.log("Model onテーブル行クリック : start");

      var clickRow = arg["クリック行"];

      // データセットを取得する
      var dataSet = this.dataset.getData();

      // ダータ有無の判定
      var datasetID     = this.appspec.sessionStorageDetailKey[0]["datasetid"];
      var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
      var maxSize       = this.appspec.sessionStorageDetailKey[0]["dataname"].length;
      var status        = "ERROR";
      for (var i = 0; i < maxSize; i++) {
        var itemName = this.appspec.sessionStorageDetailKey[0]["dataname"][i]
        if (datasetRecord[itemName]["value"][clickRow] != "") {
          status = "OK";
          break;
        }
      }

      if (status != "OK") {
        $R.log("Model onテーブル行クリック : end");
        return status;
      }

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      // 画面明細キー定義情報をセッションストレージにセイブする
      for (var i = 0; i < maxSize; i++) {
        var itemName = this.appspec.sessionStorageDetailKey[0]["dataname"][i]
        sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][clickRow]);
      }

      if ( this.appspec.isExists($("#該当ＮＯ")) ) {
        this.dataset.setElementData(clickRow + 1, "該当ＮＯ");
      }

      $R.log("Model onテーブル行クリック : end");
     return status;
    }

    // ------------------------------------------------------------------------
    //  ページ情報を編集し、表示イベントを発行する
    // ------------------------------------------------------------------------
    ,onDeriveトータル件数: function(arg) {
      $R.log("Model onDeriveトータル件数 : start");

      var pageline   = this.dataset.getElementData("ページライン数");
      var curpage    = this.dataset.getElementData("カレントページ");
      var maxpage    = this.dataset.getElementData("最大ページ");
      var totalcount = this.dataset.getElementData("トータル件数");
      if (totalcount == "") {
        totalcount   = "0";
      }
      var arg = {ページライン数: pageline, カレントページ: curpage, 最大ページ: maxpage, トータル件数: totalcount};
      this.pubsub.publish("showページ情報", arg);

      $R.log("Model onDeriveトータル件数 : end");
    }

    // ------------------------------------------------------------------------
    //  ページネーション最初処理
    // ------------------------------------------------------------------------
    ,on最初のページ: function() {
      $R.log("Model on最初のページ : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      var dataset    = this.dataset.getData();
      var detailInfo = this.appspec.getJSONChunkByIdAtRecords(dataset, "detail");
      var pageline   = detailInfo["defaultline"];
      sessionStorage.saveItem("ページライン数", pageline);
      sessionStorage.saveItem("カレントページ", 1);
      sessionStorage.deleteItem("クリック行");

      this.dataset.setElementData(pageline, "ページライン数");
      this.dataset.setElementData(1, "カレントページ");

      $R.log("Model on最初のページ : end");
    }

    // ------------------------------------------------------------------------
    //  ページネーション前へ処理
    // ------------------------------------------------------------------------
    ,on前のページ: function() {
      $R.log("Model on前のページ : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      var pageline = sessionStorage.loadItem("ページライン数");
      this.dataset.setElementData(pageline, "ページライン数");

      var pageno = parseInt(sessionStorage.loadItem("カレントページ"));
      pageno     = pageno - 1;
      if (pageno < 1) {
        pageno   = 1;
      }
      sessionStorage.saveItem("カレントページ", pageno);
      sessionStorage.deleteItem("クリック行");

      this.dataset.setElementData(pageno, "カレントページ");

      $R.log("Model on前のページ : end");
    }

    // ------------------------------------------------------------------------
    //  ページネーション次へ処理
    // ------------------------------------------------------------------------
    ,on次のページ: function() {
      $R.log("Model on次のページ : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      var pageline = sessionStorage.loadItem("ページライン数");
      this.dataset.setElementData(pageline, "ページライン数");

      var maxpage = parseInt(this.dataset.getElementData("最大ページ"));
      var pageno  = parseInt(sessionStorage.loadItem("カレントページ"));
      pageno      = pageno + 1;
      if (pageno > maxpage) {
        pageno    = maxpage;
      }
      sessionStorage.saveItem("カレントページ", pageno);
      sessionStorage.deleteItem("クリック行");

      this.dataset.setElementData(pageno, "カレントページ");

      $R.log("Model on次のページ : end");
    }

    // ------------------------------------------------------------------------
    //  ページネーション最後処理
    // ------------------------------------------------------------------------
    ,on最後のページ: function() {
      $R.log("Model on最後のページ : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      var pageline = sessionStorage.loadItem("ページライン数");
      this.dataset.setElementData(pageline, "ページライン数");

      var pageno = this.dataset.getElementData("最大ページ");
      sessionStorage.saveItem("カレントページ", pageno);
      sessionStorage.deleteItem("クリック行");

      this.dataset.setElementData(pageno, "カレントページ");

      $R.log("Model on最後のページ : end");
    }

    // ------------------------------------------------------------------------
    //  ページネーションリロード処理
    // ------------------------------------------------------------------------
    ,onリロード: function() {
      $R.log("Model onリロード : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      var pageline = sessionStorage.loadItem("ページライン数");
      var pageno   = sessionStorage.loadItem("カレントページ");

      this.dataset.setElementData(pageline, "ページライン数");
      this.dataset.setElementData(pageno, "カレントページ");

      $R.log("Model onリロード : end");
    }

    // ------------------------------------------------------------------------
    //  セッション情報をクリアする
    // ------------------------------------------------------------------------
    ,clearセッション情報: function() {
      $R.log("Model clearページ情報 : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.deleteAll("");

      // セッションデータに識別名を設定する 2015.10.07 shimoji 追加
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.nextname);
      sessionStorage.deleteAll("");

      $R.log("Model clearページ情報 : end");
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
      // 2020/08/01 shimoji tadashi
      //if (mode != "insert") {
      //  this.setNextStorageData(nextGui);
      //}
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
    //  データが選択されているかチェックする
    // ------------------------------------------------------------------------
    ,check行選択: function() {
      $R.log("Model check行選択 : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      var value = sessionStorage.loadItem("クリック行");
      if (value) return true;

      var arg = {};
      arg["title"]   = "選択エラー";
      arg["status"]  = "ERROR";
      arg["message"] = "行が選択されていません。選択して下さい。";
      this.pubsub.publish("alertDialog", arg);

      $R.log("Model check行選択 : end");
      return false;
    }

    // ------------------------------------------------------------------------
    //  照会レスポンスデータ編集処理
    // ------------------------------------------------------------------------
    ,on初期処理OfEditResponseData: function(responseData, mode) {
      $R.log("Model on初期処理OfEditResponseData : start");

      var dataSet = this.dataset.getData();
      this.setJsonRecordsToDataset(responseData, dataSet, this.pubsub);

      $R.log("Model on初期処理OfEditResponseData : end");
      return dataSet;
    }
    ,on照会OfEditResponseData: function(responseData, mode) {
      $R.log("Model on照会OfEditResponseData : start");

      var dataSet = this.dataset.getData();
      this.setJsonRecordsToDataset(responseData, dataSet, this.pubsub);

      $R.log("Model on照会OfEditResponseData : end");
      return dataSet;
    }

  };
}(jQuery, Rmenu));
