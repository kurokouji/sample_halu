/* ************************************************************************* */
/*  タブメニューパターン                                                      */
/*  モデルミックスイン                                                        */
/*  2017/09/17 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.TabMenuModelMixin = {
    // --------
    // 処理開始
    // --------
    initExecute: function() {
      $R.log("Model initExecute : start");

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
    // イベント処理
    // ------------------------------------------------------------------------
    ,onメニュー項目: function(arg) {
      $R.log("Model onメニュー項目 : start");

      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.saveItem("次画面名", arg["次画面名"]);

      $R.log("Model onメニュー項目 : end");
    }

    // ------------------------------------------------------------------------
    //  リクエストデータチェック処理
    // ------------------------------------------------------------------------
    ,on初期処理OfCheckRequestData: function(requestData, mode) {
      $R.log("Model on初期処理OfCheckRequestData : start");

      var headerRecord = this.appspec.getJSONChunkByIdAtRecords(requestData, "header")["record"];

      headerRecord["ユーザＩＤ"]["value"][0] = this.getUserID();
      headerRecord["画面名"]["value"][0]     = "ログイン（メニュー開始）";
      this.setDisplayInfo(headerRecord);

      $R.log("Model on初期処理OfCheckRequestData : end");
      return true;
    }

    ,onユーザ情報OfCheckRequestData: function(requestData, mode) {
      $R.log("Model onユーザ情報OfCheckRequestData : start");

      var headerRecord = this.appspec.getJSONChunkByIdAtRecords(requestData, "header")["record"];

      headerRecord["ユーザＩＤ"]["value"][0] = this.getUserID();
      headerRecord["画面名"]["value"][0]     = this.getNextGuiName();
      this.setDisplayInfo(headerRecord);

      $R.log("Model onユーザ情報OfCheckRequestData : end");
      return true;
    }

    ,on終了処理OfCheckRequestData: function(requestData, mode) {
      $R.log("Model on終了処理OfCheckRequestData : start");

      var headerRecord = this.appspec.getJSONChunkByIdAtRecords(requestData, "header")["record"];

      headerRecord["ユーザＩＤ"]["value"][0] = this.getUserID();
      headerRecord["画面名"]["value"][0]     = "ログオフ（メニュー終了）";
      this.setDisplayInfo(headerRecord);

      $R.log("Model on終了処理OfCheckRequestData : end");
      return true;
    }

    // ------------------------------------------------------------------------
    //  レスポンスデータ編集処理
    // ------------------------------------------------------------------------
    ,onユーザ情報OfEditResponseData: function(responseData, mode) {
      $R.log("Model onユーザ情報OfEditResponseData : start");

      var nextGuiName = this.getNextGuiName();

      $R.log("Model onユーザ情報OfEditResponseData : end");
      return nextGuiName;
    }

    ,on終了処理OfEditResponseData: function() {
      $R.log("Model on終了処理OfEditResponseData : start");

      //  セッションストレージ（ログイン情報）をレージクリアする
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.deleteAll("");

      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      sessionStorage.deleteAll("");

      $R.log("Model on終了処理OfEditResponseData : end");
    }

    // ------------------------------------------------------------------------
    //  セッションストレージのユーザＩＤを取得する
    // ------------------------------------------------------------------------
    ,getUserID: function() {
      $R.log("Model getUserID : start");

      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      var userid = sessionStorage.loadItem("ユーザＩＤ");

      $R.log("Model getUserID : end");
      return userid;
    }

    // ------------------------------------------------------------------------
    //  セッションストレージの次画面名を取得する
    // ------------------------------------------------------------------------
    ,getNextGuiName: function() {
      $R.log("Model getNextGuiName : start");

      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var nextGuiName = sessionStorage.loadItem("次画面名");

      $R.log("Model getNextGuiName : end");
      return nextGuiName;
    }

    // ------------------------------------------------------------------------
    //  ローカル端末情報を設定する
    // ------------------------------------------------------------------------
    ,setDisplayInfo: function(headerRecord) {
      $R.log("Model setDisplayInfo : start");

      headerRecord["host"]["value"][0]       = location.host;
      headerRecord["hostname"]["value"][0]   = location.hostname;
      headerRecord["port"]["value"][0]       = location.port;
      headerRecord["request"]["value"][0]    = location.pathname;
      headerRecord["code"]["value"][0]       = navigator.appCodeName;
      headerRecord["browser"]["value"][0]    = navigator.appName;
      headerRecord["version"]["value"][0]    = navigator.appVersion;
      headerRecord["lang"]["value"][0]       = navigator.language;
      headerRecord["platform"]["value"][0]   = navigator.platform;
      headerRecord["useragent"]["value"][0]  = navigator.userAgent;
      headerRecord["referer"]["value"][0]    = document.referrer;
      headerRecord["domain"]["value"][0]     = document.domain;
      headerRecord["screen_w"]["value"][0]   = screen.width;
      headerRecord["screen_h"]["value"][0]   = screen.height;
      headerRecord["screen_col"]["value"][0] = screen.colorDepth + "Bit";

      $R.log("Model setDisplayInfo : end");
      return headerRecord;
    }

  };
}(jQuery, Rmenu));