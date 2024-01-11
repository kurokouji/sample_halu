/* ************************************************************************* */
/*  マスタメンテ一覧表/ 一覧照会（単一テーブル）パターン                         */
/*  コントローラミックスイン                                                   */
/*  2017/06/12 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.DataMainteListControllerMixin = {
    // ------------------------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------------------------
    initExecute: function() {
      $R.log("Controller initExecute : start");

      var arg = this.model.getログイン情報();
      this.view.setログイン情報(arg);
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

      var arg = this.model.on選択画面戻り();

      // 選択画面戻り処理
      if (arg["status"] == "OK") {
        var dataSet = this.model.dataset.getData();
        this.view.on照会OfEditResponseData(dataSet, dataSet, "");
          
        // 選択画面で選択データ無し
        if (arg["selected"] == "CANCEL") {
          if (arg["responseData"]["cancelfunction"] != "") {
            // 選択画面後処理関数呼出
            this.pubsub.publish(arg["responseData"]["cancelfunction"], arg);
          }
        }
        else {
          // 選択画面で選択データ有り
          if (arg["responseData"]["afterfunction"] != "") {
            // 選択画面後処理関数呼出
            this.pubsub.publish(arg["responseData"]["afterfunction"], arg);
          }
        }

        $R.log("Controller on初期処理 : end");
        return;
      }

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var currentpage = sessionStorage.loadItem("カレントページ");

      if (currentpage === undefined) {
        // メニュー画面または別一覧画面から呼び出された時
        // 別の一覧画面からの引き継ぎデータをデータセットに設定する
        this.model.setFromBeforeStorageDataToDataset();
        this.on最初のページ();
      }
      else {
        // 次画面から戻って来た時
        var dataSet = this.model.on初期リロード前処理();
        this.view.on初期リロード前処理(dataSet);
        this.onリロード();
      }

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

      if ( this.appspec.isExists($("#該当ＮＯ")) ) {
        $("#該当ＮＯ").focus();
      }

      $R.log("Controller onクリア : end");
    }
    ,on登録: function(event) {
      $R.log("Controller on登録 : start");

      // 次画面の処理モードを設定する
      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "insert");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "insert");

      $R.log("Controller on登録 : end");
    }
    ,on訂正: function(event) {
      $R.log("Controller on訂正 : start");

      if (!this.model.check行選択()) return;

      // 次画面の処理モードを設定する
      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "update");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "update");

      $R.log("Controller on訂正 : end");
    }
    ,on削除: function(event) {
      $R.log("Controller on削除 : start");

      if (!this.model.check行選択()) return;

      // 次画面の処理モードを設定する
      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "delete");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "delete");

      $R.log("Controller on削除 : end");
    }
    ,on照会: function(event) {
      $R.log("Controller on照会 : start");

      if (!this.model.check行選択()) return;

      // 次画面の処理モードを設定する
      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "select");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "select");

      $R.log("Controller on照会 : end");
    }
    ,on転用: function(event) {
      $R.log("Controller on転用 : start");

      if (!this.model.check行選択()) return;

      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "convert");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "convert");

      $R.log("Controller on転用 : end");
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

      var clickRow = arg["value"] - 1;
      var arg1     = {クリック行: clickRow};
      this.model.onテーブル行クリック(arg1);
      this.view.onテーブル行クリック(arg1);

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

      var fno = "F" + arg["value"];
      var fnc = "this." + this.appspec["enterTabPFKey"][fno] + "()";
      eval(fnc);

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
    //  リロード処理
    // ------------------------------------------------------------------------
    ,onリロード: function() {
      $R.log("Controller onリロード : start");

      this.model.onリロード();
      this.ajaxExecute("select");

      $R.log("Controller onリロード : end");
    }

    // ------------------------------------------------------------------------
    // テーブル行クリック処理処理
    // ------------------------------------------------------------------------
    ,onテーブル行クリック: function(event, arg) {
      $R.log("Controller onテーブル行クリック : start");

      var row    = event.currentTarget.parentNode.rowIndex;
      var idName = event.currentTarget.offsetParent.id;
      var arg    = {クリック行: row, セレクタ名: idName};
      var status = this.model.onテーブル行クリック(arg);
      if (status == "OK") {
        this.view.onテーブル行クリック(arg);
      }

      $R.log("Controller onテーブル行クリック : end");
    }

    // ------------------------------------------------------------------------
    // チェンジ イベント処理
    // ------------------------------------------------------------------------
    ,onChangeSelectBox: function(event) {
      $R.log("Controller onChangeSelectBox : start");

      var targetValue = this.model.onChangeSelectBox(event, this.appspec.selectbox);

      $R.log("Controller onChangeSelectBox : end");
      return targetValue;
    }
    ,onChangeTableSelectBox: function(event) {
      $R.log("Controller onChangeTableSelectBox : start");

      var row = event.currentTarget.parentNode.parentNode.rowIndex;
      var targetValue = this.model.onChangeTableSelectBox(event, row, this.appspec.selectbox);

      $R.log("Controller onChangeTableSelectBox : end");
      return targetValue;
    }
    ,onChangeCheckBox: function(event) {
      $R.log("Controller onChangeCheckBox : start");

      var checkValue = this.model.onChangeTableCheckBox(event, this.appspec.checkboxDetail);

      $R.log("Controller onChangeCheckBox : end");
      return checkValue;
    }
    ,onChangeTableCheckBox: function(event) {
      $R.log("Controller onChangeTableCheckBox : start");

      var row = event.currentTarget.parentNode.parentNode.rowIndex;
      var checkValue = this.model.onChangeTableCheckBox(event, row, this.appspec.checkboxDetail);

      $R.log("Controller onChangeTableCheckBox : end");
      return checkValue;
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

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var currentpage = sessionStorage.loadItem("カレントページ");

      if (currentpage === undefined) {
        // メニュー画面または別一覧画面から呼び出された時
        // 別の一覧画面からの引き継ぎデータをデータセットに設定する
        this.model.setFromBeforeStorageDataToDataset();
        this.on最初のページ();
      }
      else {
        // 次画面から戻って来た時
        var dataSet = this.model.on初期リロード前処理();
        this.view.on初期リロード前処理(dataSet);
        this.onリロード();
      }

      $R.log("Controller on初期処理OfEditResponseData : end");
    }
    ,on照会OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on照会OfEditResponseData : start");

      var dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var mode = sessionStorage.loadItem("処理モード");
      if (mode != "delete") {
        var clickRow = sessionStorage.loadItem("クリック行");
        if (clickRow === undefined) {
        }
        else {
          var arg = {クリック行: parseInt(clickRow, 10)};
          this.model.onテーブル行クリック(arg);
          this.view.onテーブル行クリック(arg);
        }
      }
      else {
        sessionStorage.deleteItem("クリック行");
      }
      sessionStorage.saveItem("処理モード", "");

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
