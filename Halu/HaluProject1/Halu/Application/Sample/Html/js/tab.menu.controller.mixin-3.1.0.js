/* ************************************************************************* */
/*  タブメニューパターン                                                      */
/*  コントローラミックスイン                                                   */
/*  2017/09/17 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.TabMenuControllerMixin = {
    // ------------------------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------------------------
    initExecute: function() {
      $R.log("Controller initExecute : start");

      var arg = this.model.getログイン情報();
      this.view.setログイン情報(arg);

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      var tabname = sessionStorage.loadItem("ターゲットタブ");
      if ( this.appspec.isExists(tabname) ) {
        this.view.openメニュータブ(tabname);
      }
      else {
        this.ajaxExecute("init");
      }

      $R.log("Controller initExecute : end");
    }

    // ------------------------------------------------------------------------
    // イベント処理
    // ------------------------------------------------------------------------
    ,onメニュータブ: function(event) {
      $R.log("Controller onメニュータブ : start");

      var tabName = event.currentTarget.id;
      $("#" + tabName).tab('show');
      $("#" + tabName).focus();

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.saveItem("ターゲットタブ", tabName);

      this.onFocus12(event);

      $R.log("Controller onメニュータブ : end");
    }

    ,onメニュー項目: function(event) {
      $R.log("Controller onメニュー項目 : start");

      var htmlName  = event.currentTarget.name;
      if (htmlName != "") {
        var arg = {次画面名: htmlName};
        this.model.onメニュー項目(arg);
        this.ajaxExecute("userinfo");
      }

      $R.log("Controller onメニュー項目 : end");
    }

    ,on実行: function(event) {
      $R.log("Controller on実行 : start");


      $R.log("Controller on実行 : end");
    }

    ,on戻る: function(event) {
      $R.log("Controller on戻る : start");

      this.ajaxExecute("term");

      $R.log("Controller on戻る : end");
    }

   ,onFocus12: function(event) {
      $R.log("Controller onFocus12 : start");

      this.view.setF12FocusItem();

      $R.log("Controller onFocus12 : end");
    }

    // ------------------------------------------------------------------------
    //  リクエストデータチェック処理
    // ------------------------------------------------------------------------
    ,on初期処理OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on初期処理OfCheckRequestData : start");

      var status = this.model.on初期処理OfCheckRequestData(requestData, mode);

      $R.log("Controller on初期処理OfCheckRequestData : end");
      return status;
    }

    ,onユーザ情報OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller onユーザ情報OfCheckRequestData : start");

      var status = this.model.onユーザ情報OfCheckRequestData(requestData, mode);

      $R.log("Controller onユーザ情報OfCheckRequestData : end");
      return status;
    }

    ,on終了処理OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on終了処理OfCheckRequestData : start");

      var status = this.model.on終了処理OfCheckRequestData(requestData, mode);

      $R.log("Controller on終了処理OfCheckRequestData : end");
      return status;
    }

    // ------------------------------------------------------------------------
    //  レスポンスデータ編集処理
    // ------------------------------------------------------------------------
    ,on初期処理OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on初期処理OfEditResponseData : start");

      var tabName = "tab_1";

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.saveItem("ターゲットタブ", tabName);
      this.view.openメニュータブ(tabName);

      $R.log("Controller on初期処理OfEditResponseData : end");
    }

    ,onユーザ情報OfEditResponseData: function(responseData, mode) {
      $R.log("Controller onユーザ情報OfEditResponseData : start");

      var htmlName  = this.model.onユーザ情報OfEditResponseData(responseData, mode);
      var currName  = this.appspec.urlInfo[0]["app"];
      this.model.setTransitionData(currName.slice(0, -1));
      this.model.postHtmlTransition(htmlName);

      $R.log("Controller onユーザ情報OfEditResponseData : end");
    }

    ,on終了処理OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on終了処理OfEditResponseData : start");

      this.model.on終了処理OfEditResponseData();
      this.model.previousTransition();

      $R.log("Controller on終了処理OfEditResponseData : end");
    }

    // ------------------------------------------------------------------------
    //  レスポンスエラー処理
    // ------------------------------------------------------------------------
    ,onErrorResponseData: function(responseData, mode) {
      $R.log("Controller onErrorResponseData : start");

      this.errorResponseData(responseData);

      $R.log("Controller onErrorResponseData : end");
    }

    // ------------------------------------------------------------------------
    // タブ移動
    // ------------------------------------------------------------------------
    ,onTabPainMove: function(val) {
      $R.log("Controller onTabPainMove : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var tabName1 = sessionStorage.loadItem("ターゲットタブ");
      var noArray  = tabName1.split('_');
      var tabNo    = Number(noArray[1]) + val;

      if (tabNo == 0) {
        tabNo = this.appspec.maxTabNo;
      }
      if (tabNo > this.appspec.maxTabNo) {
        tabNo = 1;
      }
      var tabName2 = "タブ_" + String(tabNo);

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.saveItem("ターゲットタブ", tabName2);
      this.view.openメニュータブ(tabName2);

      $R.log("Controller onTabPainMove : end");
    }

    // ------------------------------------------------------------------------
    // 処理起動確認ダイアログ後の処理
    // ------------------------------------------------------------------------
    ,onConfirmDialogAfter: function() {
      $R.log("Controller onConfirmDialogAfter : start");

      $R.log("Controller onConfirmDialogAfter : end");
    }

    ,onExecuteDialogAfter: function() {
      $R.log("Controller onExecuteDialogAfter : start");

      $R.log("Controller onExecuteDialogAfter : end");
    }

    ,onServerDialogAfter: function() {
      $R.log("Controller onServerDialogAfter : start");

      $R.log("Controller onServerDialogAfter : end");
    }

  };
}(jQuery, Rmenu));