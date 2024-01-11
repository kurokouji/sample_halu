(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.ControllerMixin = {
    // フレームワーク内部イベント設定（イベント名・実行コンテキスト・コールバック関数）
   pubsubRmenuEvent: [
      ["dataformat",         "view",       "onDataFormat"]
     ,["dataunformat",       "view",       "onDataUnformat"]
     ,["guidemessage",       "view",       "onGuideMessage"]
     ,["errorToolTip",       "view",       "onErrorToolTip"]
     ,["removeToolTip",      "view",       "onRemoveToolTip"]
     ,["alertDialog",        "view",       "onAlertDialog"]
     ,["confirmDialog",      "view",       "onConfirmDialog"]
     ,["confirmDialogAfter", "model",      "onConfirmDialogAfter"]
     ,["executeDialog",      "view",       "onExecuteDialog"]
     ,["executeDialogAfter", "controller", "onExecuteDialogAfter"]
     ,["serverDialog",       "view",       "onServerDialog"]
     ,["serverDialogAfter",  "model",      "onServerDialogAfter"]
    ]
    // Focus処理
    // ---------------------------------------------------------------
    // datasetから値を取得し再表示している理由は、format表示したデータ
    // をunformatして再表示する為。
    // ---------------------------------------------------------------
   ,onControllerFocus: function(event) {
      $R.log("ControllerMixin onControllerFocus : start");

      var row   = this.view.focusCurRow;
      var value = this.model.onFocus(event, row);                     // 入力項目の値をdatasetから取得する
      this.view.onFocus(event, value);                                // 値を画面に表示する

      //var message = this.model.onFocusMessage(event);               // 入力ガイドメッセージを作成する
      //var arg = {status: "OK", message: message};
      //this.view.onGuideMessage(arg);                                // ガイドメッセージを表示する

      $R.log("ControllerMixin onControllerFocus : end");
    }
    // Blur処理
   ,onControllerBlur: function(event) {
      $R.log("ControllerMixin onControllerBlur : start");

      var row = this.view.blurCurRow;
      this.model.onBlur(event, row);                                  // 入力データをdatasetに設定する

      var message = this.model.onBlurDataCheck(event);                // 入力データをチェックする
      if (message["status"] == "OK") {
        this.view.onRemoveToolTip(message);
      }
      else {
        this.view.onErrorToolTip(message);
      }

      this.view.onBlur(event);                                        // 入力データをフォーマットし再表示する

      if (message["status"] == "OK") {
        var target = event.target;
        this.model.onBlurDerive(target, target.value);                // 導出項目編集処理
      }

      $R.log("ControllerMixin onControllerBlur : end");
    }
   ,onControllerBoxClick: function(event, row) {
      $R.log("ControllerMixin onControllerBoxClick : start");

      this.model.onBoxClick(event);

      $R.log("ControllerMixin onControllerBoxClick : end");
    }
    // データセットとフォームの値をクリアする
   ,clearFormData: function() {
      $R.log("ControllerMixin clearFormData : start");

      this.model.dataset.clearDataValue();                            // Datasetの値をクリアする
      this.view.clearDataValue();                                     // フォームの値をクリアする

      $R.log("ControllerMixin clearFormData : end");
    }
    // トランザクションを実行する
   ,ajaxExecute: function(mode) {
      $R.log("ControllerMixin ajaxExecute : start");

      var transaction = this.model.getTransaction(mode);
      if (!transaction.synchro) {
        transaction.synchroData(this, "ajaxExecuteDo");
      }
      else {
        this.ajaxExecuteDo(transaction)
      }

      $R.log("ControllerMixin ajaxExecute : end");
    }
   ,ajaxExecuteDo: function(transaction) {
      $R.log("ControllerMixin ajaxExecuteDo : start");

      transaction.clearDataValue();                                   // トランザクションの値をクリアする
      transaction.setDataValue(this.model.dataset);                   // トランザクションに値を設定する
      transaction.ajax(this);

      $R.log("ControllerMixin ajaxExecuteDo : end");
    }
    // リクエストデータをチェックする
   ,checkRequestData: function(data) {
      $R.log("ControllerMixin checkRequestData : start");

      var status = this.model.transactionCheck(data);

      $R.log("ControllerMixin checkRequestData : end");
      return status;
    }
    // レスポンスデータをデータセットとフォームに設定する
   ,editResponseData: function(data) {
      $R.log("ControllerMixin editResponseData : start");

      this.model.dataset.clearResponseValue(data);
      this.view.clearResponseValue(data);
      this.model.dataset.setResponseValue(data, this.pubsub);         // Datasetに値を設定する
      this.view.setResponseValue(data);                               // フォームに値を表示する

      $R.log("ControllerMixin editResponseData : end");
      return data;
    }
    // レスポンスエラー
   ,errorResponseData: function(data) {
      $R.log("ControllerMixin errorResponseData : start");

      var msg = data["message"]["msg"];
      var arg = {title: "サーバエラー", status: "ERROR", message: msg};
      this.pubsub.publish("guidemessage", arg);
      this.pubsub.publish("alertDialog", arg);

      $R.log("ControllerMixin errorResponseData : end");
    }
    // サーバとの接続エラー
   ,connectError: function(XMLHttpRequest, textStatus, errorThrown) {
      $R.log("ControllerMixin responseError : start");

      var arg = {};
      arg["title"]   = "通信エラー";
      arg["status"]  = "ERROR";
      arg["message"] = "サーバとの接続に失敗しました。担当者に連絡して下さい。";
      this.pubsub.publish("guidemessage", arg);
      this.pubsub.publish("alertDialog", arg);

      $R.log("ControllerMixin responseError : end");
    }
    // Dataset同期チェック
   ,synchroCheckDataset: function() {
      $R.log("ControllerMixin synchroCheckDataset : start");

      this.pubsub.model      = this.model;
      this.pubsub.view       = this.view;
      this.pubsub.controller = this;

      this.model.pubsub      = this.pubsub;
      this.view.pubsub       = this.pubsub;

      if (this.model.dataset) {
        this.model.dataset.synchroData(this, "synchroCheckValidation");
      }
      else {
        this.synchroCheckValidation();
      }

      $R.log("ControllerMixin synchroCheckDataset : end");
    }
    // Validation同期チェック
   ,synchroCheckValidation: function() {
      $R.log("ControllerMixin synchroCheckValidation : start");

      var validation = this.model.getValidation();
      if (validation) {
        validation.synchroData(this, "synchroCheckTransaction");
      }
      else {
        this.synchroCheckTransaction();
      }

      $R.log("ControllerMixin synchroCheckValidation : end");
    }
    // Transaction同期チェック
   ,synchroCheckTransaction: function() {
      $R.log("ControllerMixin synchroCheckTransaction : start");

      var dataset = this.model.getDataset();
      if (dataset) {
        dataset.clearDataValue();                                     // Datasetの値をクリアする
        dataset.clearFormElementNo();                                 // フォームオブジェクトの要素番号をクリアする
        dataset.setFormElementNo();                                   // フォームオブジェクトの要素番号を設定する
      }

      if (dataset) {
        this.view.copyFormElementNo(dataset.elementno);
      }

      var validation = this.model.getValidation();
      if (validation) {
        this.view.copyFormat(validation.getData());
      }

      //this.view.clearDataValue();

      this.model.initExecute();
      if (dataset) {
        this.view.initExecute(this.model.dataset.data);
      }
      else {
        this.view.initExecute();
      }

      var requestInfo   = this.appspec.requestInfo;
      if (requestInfo.length > 0) {
        var tranname    = requestInfo[0][0];
        var transaction = this.model.getTransaction(tranname);
        transaction.synchroData(this, "initExecute");
      }
      else {
        this.initExecute();
      }

      $R.log("ControllerMixin synchroCheckTransaction : end");
    }
  };
}(jQuery, Rmenu));