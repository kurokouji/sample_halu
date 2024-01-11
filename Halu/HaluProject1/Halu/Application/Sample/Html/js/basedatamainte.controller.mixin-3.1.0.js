/* ************************************************************************* */
/*  基本名称メンテ/ 一覧登録（単一テーブル）パターン                             */
/*  コントローラミックスイン                                                   */
/*  2014/08/16 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.BaseDataMainteControllerMixin = {
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

      // 画面ヘッダキー定義の値をdataSetに設定する
      // メニュー画面から遷移した時：なにも処理されない
      // 遷移先画面から戻って来た時：遷移前の値が設定される
      this.model.setMyUIStorageData();

      // 初期処理：前画面の引き継ぎデータをデータセットに設定する
      var status1 = this.model.setFromBeforeStorageDataToDataset();
      if (status1 == "OK") {
        var dataSet = this.model.dataset.getData();
        this.view.fromJsonDataToView(dataSet);
      }

      this.ajaxExecute("select");

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

      this.model.clearページ情報();
      this.model.previousTransition();

      $R.log("Controller on戻る : end");
    }
    ,on実行: function(event) {
      $R.log("Controller on実行 : start");

      this.ajaxExecute("execute");

      $R.log("Controller on実行 : end");
    }
    ,on検索: function(event) {
      $R.log("Controller on検索 : start");
      
      this.ajaxExecute("select");
      
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

    // ------------------------------------------------------------------------
    // 行追加 クリックイベント処理
    // ------------------------------------------------------------------------
    ,on行追加クリック: function(event, arg) {
      $R.log("Controller on行追加クリック : start");

      // 次のフォーカス項目番号を取得する
      var nextFocusNo = this.getNextFocusNo(event);
      
      var row     = event.currentTarget.parentNode.parentNode.rowIndex;
      var dataSet = this.model.on行追加クリック(row);
      this.view.on行追加クリック(dataSet);
      $('input')[nextFocusNo].focus();

      $R.log("Controller on行追加クリック : end");
    }

    // ------------------------------------------------------------------------
    // 表示順再設定 クリックイベント処理
    // ------------------------------------------------------------------------
    ,on表示順再設定: function(event, arg) {
      $R.log("Controller on表示順再設定 : start");

      this.ajaxExecute("renumber");
      
      $R.log("Controller on表示順再設定 : end");
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
    ,on削除: function(event, arg) {
      $R.log("Controller on削除 : start");

      var row = event.currentTarget.parentNode.parentNode.rowIndex;
      var checkValue = this.model.onChangeTableCheckBox(event, row, this.appspec.checkboxDetail);

      $R.log("Controller on削除 : end");
      return checkValue;
    }
    ,on行チェック: function(event, arg) {
      $R.log("Controller on行チェック : start");

      var name = event.currentTarget.name;
      var row  = event.currentTarget.parentNode.parentNode.rowIndex;
      this.model.on行チェック(name, row);
      this.view.on行チェック(name, row);

      $R.log("Controller on行チェック : end");
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
    //  リクエストデータチェック処理
    // ------------------------------------------------------------------------
    ,on初期処理OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on初期処理OfCheckRequestData : start");

      var status = this.checkRequestData(requestData);

      $R.log("Controller on初期処理OfCheckRequestData : end");
      return status;
    }
    ,on照会OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on照会OfCheckRequestData : start");

      var status = this.model.on照会OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $R.log("Controller on照会OfCheckRequestData : end");
      return status;
    }
    ,on実行OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on実行OfCheckRequestData : start");

      var status = this.model.on実行OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $R.log("Controller on実行OfCheckRequestData : end");
      return status;
    }
    ,on表示順再設定OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on表示順再設定OfCheckRequestData : start");

      var status = this.model.on表示順再設定OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $R.log("Controller on表示順再設定OfCheckRequestData : end");
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

      // 画面ヘッダキー定義の値をdataSetに設定する
      // メニュー画面から遷移した時：なにも処理されない
      // 遷移先画面から戻って来た時：遷移前の値が設定される
      this.model.setMyUIStorageData();

      this.ajaxExecute("select");

      $R.log("Controller on初期処理OfEditResponseData : end");
    }
    ,on照会OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on照会OfEditResponseData : start");

      var dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var row = sessionStorage.loadItem("クリック行");
      if (row === undefined) {
      }
      else {
        var arg = {クリック行: row};
        this.view.onテーブル行クリック(arg);

        var name = sessionStorage.loadItem("クリック名");
        if (name === undefined) {
        }
        else {
          this.model.on行チェック(name, row);
          this.view.on行チェック(name, row);
        }
      }

      this.view.setFirstFocusItem();

      $R.log("Controller on照会OfEditResponseData : end");
    }
    ,on実行OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on実行OfEditResponseData : start");

      var dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      this.model.onサーバ処理確認ダイアログ(responseData);

      $R.log("Controller on実行OfEditResponseData : end");
    }
    ,on表示順再設定OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on表示順再設定OfEditResponseData : start");

      var dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      this.model.onサーバ処理確認ダイアログ(responseData);

      $R.log("Controller on表示順再設定OfEditResponseData : end");
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
