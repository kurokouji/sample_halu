/* ************************************************************************* */
/*  選択画面パターン                                                          */
/*  コントローラミックスイン                                                   */
/*  2017/09/06 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.DataSelectionControllerMixin = {
    // ------------------------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------------------------
    initExecute: function() {
      $R.log("Controller initExecute : start");

      var arg = this.model.getログイン情報();
      this.view.showログイン情報(arg);
      
      this.on初期処理();

      $R.log("Controller initExecute : end");
    }

    // ------------------------------------------------------------------------
    // 初期処理
    // ------------------------------------------------------------------------
    ,on初期処理: function() {
      $R.log("Controller on初期処理 : start");

      var arg = this.model.on初期処理();
      this.view.on初期処理(arg);

      // 選択画面リクエストデータとレスポンスデータを設定する
      this.model.setリクエストデータOf選択画面();

      // 初期処理：前画面の引き継ぎデータをデータセットに設定する
      var status = this.model.setFromBeforeStorageDataToDataset();
      if (status == "OK") {
        var dataSet = this.model.dataset.getData();
        this.view.fromJsonDataToView(dataSet);
      }

      this.on最初のページ();

      $R.log("Controller on初期処理 : end");
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
    ,onFocus12: function(event) {
      $R.log("Controller onFocus12 : start");

      this.view.setF12FocusItem();

      $R.log("Controller onFocus12 : end");
    }
    ,on戻る: function(event) {
      $R.log("Controller on戻る : start");

      // 前画面のレスポンスデータを設定
      this.model.set戻るレスポンスデータOf選択画面();

      // セッションストレージ情報をクリアし、前画面に戻る
      this.model.clearセッション情報();
      this.model.previousTransition();

      $R.log("Controller on戻る : end");
    }
    ,on検索: function(event) {
      $R.log("Controller on検索 : start");

      this.on最初のページ();

      $R.log("Controller on検索 : end");
    }
    ,onクリア: function(event) {
      $R.log("Controller onクリア : start");

      var dataSet = this.model.onクリア();
      this.view.onクリア(dataSet);

      $R.log("Controller onクリア : end");
    }
    ,on選択: function(event) {
      $R.log("Controller on選択 : start");

      if (!this.model.check行選択()) return;

      // 前画面のレスポンスデータを設定
      this.model.set選択レスポンスデータOf選択画面();

      // セッションストレージ情報をクリアし、前画面に戻る
      this.model.clearセッション情報();
      this.model.previousTransition();

      $R.log("Controller on選択 : end");
    }

    // ------------------------------------------------------------------------
    // チェンジ イベント処理（追加処理）
    // ------------------------------------------------------------------------
    ,onChangeSelectBox: function(event) {
      $R.log("Controller onChangeSelectBox : start");

      var targetValue = this.model.onChangeSelectBox(event, this.appspec.selectbox);

      $R.log("Controller onChangeSelectBox : end");
      return targetValue;
    }
    ,onChangeCheckBox: function(event) {
      $R.log("Controller onChangeCheckBox : start");

      var checkValue = this.model.onChangeCheckBox(event, this.appspec.checkboxDetail);

      $R.log("Controller onChangeCheckBox : end");
      return checkValue;
    }

    // ------------------------------------------------------------------------
    // カスタムチェック イベント処理
    // ------------------------------------------------------------------------
    ,onCheck該当ＮＯ: function(arg) {
      $R.log("Controller onCheck該当ＮＯ : start");

      var message  = {status: "OK"};

      if (arg["value"] == "") {
        $R.log("Controller onCheck該当ＮＯ : end");
        return message;
      }

      var status = this.model.onCheck該当ＮＯ(arg);
      if (status == "OK") {
        var clickRow = arg["value"] - 1;
        var arg1     = {クリック行: clickRow};
        this.model.onテーブル行クリック(arg1);
        this.view.onテーブル行クリック(arg1);
      }

      $R.log("Controller onCheck該当ＮＯ : end");
      return message;
    }

    ,onCheckＦＮＯ: function(arg) {
      $R.log("Controller onCheckＦＮＯ : start");

      var message  = {status: "OK"};

      if (arg["value"] == "") {
        $R.log("Controller onCheckＦＮＯ : end");
        return message;
      }

      var status = this.model.onCheckＦＮＯ(arg);
      if (status == "OK") {
        var fno = "F" + arg["value"];
        var fnc = "this." + this.appspec["enterTabPFKey"][fno] + "()";
        eval(fnc);
      }

      $R.log("Controller onCheckＦＮＯ : end");
      return message;
    }

    // ------------------------------------------------------------------------
    //  ページネーションイベント処理
    // ------------------------------------------------------------------------
    ,on最初のページ: function(event) {
      $R.log("Controller on最初のページ : start");

      this.model.on最初のページ();
      this.ajaxExecute("select");

      $R.log("Controller on最初のページ : end");
    }
    ,on前のページ: function(event) {
      $R.log("Controller on前のページ : start");

      this.model.on前のページ();
      this.ajaxExecute("select");

      $R.log("Controller on前のページ : end");
    }
    ,on次のページ: function(event) {
      $R.log("Controller on次のページ : start");

      this.model.on次のページ();
      this.ajaxExecute("select");

      $R.log("Controller on次のページ : end");
    }
    ,on最後のページ: function(event) {
      $R.log("Controller on最後のページ : start");

      this.model.on最後のページ();
      this.ajaxExecute("select");

      $R.log("Controller on最後のページ : end");
    }

    // ------------------------------------------------------------------------
    // テーブル行クリック処理処理
    // ------------------------------------------------------------------------
    ,onテーブル行クリック: function(event, arg) {
      $R.log("Controller onテーブル行クリック : start");

      var row    = event.currentTarget.parentNode.rowIndex;
      var idName = event.currentTarget.offsetParent.id;
      var arg    = {クリック行: row, セレクタ名: idName};
      this.model.onテーブル行クリック(arg);
      this.view.onテーブル行クリック(arg);

      $R.log("Controller onテーブル行クリック : end");
    }

    // ------------------------------------------------------------------------
    //  リクエストデータ編集・チェック処理
    // ------------------------------------------------------------------------
    ,on初期処理OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on初期処理OfCheckRequestData : start");

      var status = this.checkRequestData(requestData);

      $R.log("Controller on初期処理OfCheckRequestData : end");
      return status;
    }
    ,on照会OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on照会OfCheckRequestData : start");

      var status = this.checkRequestData(requestData);

      $R.log("Controller on照会OfCheckRequestData : end");
      return status;
    }

    // ------------------------------------------------------------------------
    //  レスポンスデータ編集処理
    // ------------------------------------------------------------------------
    ,on初期処理OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on初期処理OfEditResponseData : start");

      var dataSet = this.model.on初期処理OfEditResponseData(responseData, mode);

      // セレクトボックスの一括初期表示
      this.onShowSelectBoxAll(responseData, this.appspec.selectbox);

      this.on最初のページ();

      $R.log("Controller on初期処理OfEditResponseData : end");
    }
    ,on照会OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on照会OfEditResponseData : start");

      var dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      this.view.setFirstFocusItem();

      $R.log("Controller on照会OfEditResponseData : end");
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

      this.view.setFirstFocusItem();

      $R.log("Controller onServerDialogAfter : end");
    }

  };
}(jQuery, Rmenu));
