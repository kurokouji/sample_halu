/* ************************************************************************* */
/*  マスタメンテ/ 単票登録（単一テーブル）パターン                               */
/*  コントローラミックスイン                                                   */
/*  2014/08/16 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.DataMainteControllerMixin = {
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

        // セレクトボックスの一括初期表示
        this.onShowSelectBoxAll(dataSet, this.appspec.selectbox);
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

      // 新規の時：キー無し新規以外の時：キーが設定される
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

      this.model.clearセッション情報();
      this.model.previousTransition();

      $R.log("Controller on戻る : end");
    }
    ,on実行: function(event) {
      $R.log("Controller on実行 : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var mode = sessionStorage.loadItem("処理モード");

      if (mode == "select") return;

      if (mode == "convert") {
        mode = "insert";
      }
      this.ajaxExecute(mode);

      $R.log("Controller on実行 : end");
    }

    // ------------------------------------------------------------------------
    // 行追加 クリックイベント処理
    // データセット：detail
    // 明細テーブル：#mainTable
    // ------------------------------------------------------------------------
    ,on行追加クリック: function(event) {
      $R.log("Controller on行追加クリック : start");

      // 次のフォーカス項目番号を取得する
      var nextFocusNo = this.getNextFocusNo(event);

      var row = event.currentTarget.parentNode.parentNode.rowIndex;
      var dataSet = this.model.on行追加クリック(row);
      this.view.on行追加クリック(dataSet);
      $('input')[nextFocusNo].focus();

      $R.log("Controller on行追加クリック : end");
    }

    // ------------------------------------------------------------------------
    // テーブル行クリック処理処理
    // ------------------------------------------------------------------------
    ,onテーブル行クリック: function(event, arg) {
      $R.log("Controller onテーブル行クリック : start");

      var row = event.currentTarget.parentNode.parentNode.rowIndex;
      var idName = event.currentTarget.offsetParent.id;
      var arg    = {クリック行: row, セレクタ名: idName};
      this.model.onテーブル行クリック(arg);

      $R.log("Controller onテーブル行クリック : end");
    }

    // ------------------------------------------------------------------------
    // 削除チェンジ イベント処理（追加処理）
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
    ,onChange削除: function(event) {
      $R.log("Controller onChange削除 : start");

      var row = event.currentTarget.parentNode.parentNode.rowIndex;
      var checkValue = this.model.onChangeTableCheckBox(event, row, this.appspec.checkboxDetail);

      $R.log("Controller onChange削除 : end");
      return checkValue;
    }
    ,onChangeモード切替: function(event) {
      $R.log("Controller onChangeモード切替 : start");

      this.model.onChangeモード切替(event);

      $R.log("Controller onChangeモード切替 : end");
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

      var status = this.model.on照会OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $R.log("Controller on照会OfCheckRequestData : end");
      return status;
    }
    ,on登録OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on登録OfCheckRequestData : start");

      var status = this.model.on登録OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $R.log("Controller on登録OfCheckRequestData : end");
      return status;
    }
    ,on訂正OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on訂正OfCheckRequestData : start");

      var status = this.model.on訂正OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $R.log("Controller on訂正OfCheckRequestData : end");
      return status;
    }
    ,on削除OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on削除OfCheckRequestData : start");

      var status = this.model.on削除OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $R.log("Controller on削除OfCheckRequestData : end");
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

      // 新規の時：キー無し新規以外の時：キーが設定される
      this.ajaxExecute("select");

      $R.log("Controller on初期処理OfEditResponseData : end");
    }
    ,on照会OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on照会OfEditResponseData : start");

      var dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      this.view.setFirstFocusItem();

      $R.log("Controller on照会OfEditResponseData : end");
    }
    ,on登録OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on登録OfEditResponseData : start");

      var jsonRecords = responseData["records"];
      if (jsonRecords === undefined) {
        this.model.onサーバ処理確認ダイアログ(responseData);

        $R.log("Controller on登録OfEditResponseData : end");
        return;
      }

      var dataSet = this.model.on登録OfEditResponseData(responseData, mode);
      this.view.on登録OfEditResponseData(dataSet, responseData, mode);
      this.model.onサーバ処理確認ダイアログ(responseData);

      $R.log("Controller on登録OfEditResponseData : end");
    }
    ,on訂正OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on訂正OfEditResponseData : start");

      var jsonRecords = responseData["records"];
      if (jsonRecords === undefined) {
        this.model.onサーバ処理確認ダイアログ(responseData);

        $R.log("Controller on訂正OfEditResponseData : end");
        return;
      }

      var dataSet = this.model.on訂正OfEditResponseData(responseData, mode);
      this.view.on訂正OfEditResponseData(dataSet, responseData, mode);
      this.model.onサーバ処理確認ダイアログ(responseData);

      $R.log("Controller on訂正OfEditResponseData : end");
    }
    ,on削除OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on削除OfEditResponseData : start");

      var jsonRecords = responseData["records"];
      if (jsonRecords === undefined) {
        this.model.onサーバ処理確認ダイアログ(responseData);

        $R.log("Controller on削除OfEditResponseData : end");
        return;
      }

      var dataSet = this.model.on削除OfEditResponseData(responseData, mode);
      this.view.on削除OfEditResponseData(dataSet, responseData, mode);
      this.model.onサーバ処理確認ダイアログ(responseData);

      $R.log("Controller on削除OfEditResponseData : end");
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
