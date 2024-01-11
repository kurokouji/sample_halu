/* ************************************************************************* */
/*  ログインパターン                                                          */
/*  コントローラミックスイン                                                   */
/*  2017/09/17 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.LoginControllerMixin = {
    // ------------------------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------------------------
    initExecute: function() {
      $R.log("Controller initExecute : start");

      this.ajaxExecute("init");

      $R.log("Controller initExecute : end");
    }

    // ------------------------------------------------------------------------
    // Focus・Blue イベント処理
    // ------------------------------------------------------------------------
    ,onFocus: function(event) {
      $R.log("Controller onFocus : start");

      this.onControllerFocus(event);

      $R.log("Controller onFocus : end");
    }
    ,onBlur: function(event) {
      $R.log("Controller onBlur : start");

      this.onControllerBlur(event);

      $R.log("Controller onBlur : end");
    }

    // ------------------------------------------------------------------------
    // ボタン・ファンクションキー イベント処理
    // ------------------------------------------------------------------------
    ,onクリア: function(event) {
      $R.log("Controller onクリア : start");

      var dataSet = this.model.dataset.getData();
      this.model.clearDatasetJson(dataSet);
      this.view.fromJsonDataToView(dataSet);
      
      this.view.onクリア();

      $R.log("Controller onクリア : end");
    }
    ,onログイン: function(event) {
      $R.log("Controller onログイン : start");

      this.ajaxExecute("check");

      $R.log("Controller onログイン : end");
    }

    // ------------------------------------------------------------------------
    //  リクエストデータチェック処理
    // ------------------------------------------------------------------------
    ,on初期処理OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on初期処理OfCheckRequestData : start");

      var status = this.checkRequestData(requestData);

      $R.log("Controller on初期処理OfCheckRequestData : end");
      return status;
    }
    ,onチェックOfCheckRequestData: function(requestData, mode) {
      $R.log("Controller onチェックOfCheckRequestData : start");

      var status = this.checkRequestData(requestData);

      $R.log("Controller onチェックOfCheckRequestData : end");
      return status;
    }

    // ------------------------------------------------------------------------
    //  レスポンスデータ編集処理
    // ------------------------------------------------------------------------
    ,on初期処理OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on初期処理OfEditResponseData : start");

      var arg = this.model.on初期処理OfEditResponseData(responseData);
      this.view.on初期処理OfEditResponseData(responseData, arg);

      $R.log("Controller on初期処理OfEditResponseData : end");
    }
    ,onチェックOfEditResponseData: function(responseData, mode) {
      $R.log("Controller onチェックOfEditResponseData : start");

      // セッションストレージにユーザ情報を格納する
      this.model.onチェックOfEditResponseData(responseData);

      // 次画面を表示する
      var currName  = this.appspec.urlInfo[0]["app"];
      var nextArray = currName.split("/"); 
      nextArray[3]  = this.appspec.nextname;
      var nextName  = nextArray.join("/");

      this.model.clearTransitionData();
      this.model.setTransitionData(currName.slice(0, -1));
      this.model.postHtmlTransition(nextName.slice(0, -1));

      $R.log("Controller onチェックOfEditResponseData : end");
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
