(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.ControllerMixin = {
    // ブラウザ戻るボタンを無効にする
    onBrowserBackBotton: function(event) {
      $R.log("ControllerMixin onBrowserBackBotton : start");

      if (!event.originalEvent.state) {
        history.pushState(null, null, null);
      }

      $R.log("ControllerMixin onBrowserBackBotton : end");
    }

    // フレームワーク内部イベント設定（イベント名・実行コンテキスト・コールバック関数）
   ,pubsubRmenuEvent: [
      ["dataformat",         "view",       "onDataFormat"]
     ,["dataunformat",       "view",       "onDataUnformat"]
     ,["guidemessage",       "view",       "onGuideMessage"]
     ,["errorToolTip",       "view",       "onErrorToolTip"]
     ,["removeToolTip",      "view",       "onRemoveToolTip"]
     ,["alertDialog",        "view",       "onAlertDialog"]
     ,["confirmDialog",      "view",       "onConfirmDialog"]
     ,["confirmDialogAfter", "controller", "onConfirmDialogAfter"]
     ,["executeDialog",      "view",       "onExecuteDialog"]
     ,["executeDialogAfter", "controller", "onExecuteDialogAfter"]
     ,["serverDialog",       "view",       "onServerDialog"]
     ,["serverDialogAfter",  "controller", "onServerDialogAfter"]
    ]

    // Focus処理
   ,onControllerFocus: function(event) {
      $R.log("ControllerMixin onControllerFocus start name : " + event.target.name);

      this.focusName;                                                 // Focus された要素の name 属性
      this.focusCurRow    = 0;                                        // Focus されたセルの行位置
      this.focusCurCell   = 0;                                        // Focus されたセルの列位置
                                                                      // ※セルの位置は dataset 上の並び順と無関係であることに注意
      this.focusIndex     = 0;                                        // dataset 上の、該当データの位置
      this.focusName  = event.target.name;                            // 対象要素から name 属性を取得
      var isMultiline = this.model.dataset.isMultilineByName(this.focusName);
                                                                      // dataset を走査して multiline かどうかを求める
      // multiline の場合
      if (isMultiline) {
        // データが次の条件で表示されているものと想定して処理します
        // ・表形式であること
        // ・各セル内が、更に個別の表になっていないこと

        //- テーブル上のセル位置を求める ----------
        var targetRowObj = $(event.target).closest('tr');             // 該当要素を含む tr 要素を求める
        var targetCellObj = $(event.target).closest('td,th');         // 該当要素を含む td / th 要素を求める
        if (targetRowObj && targetCellObj) {                          // セル位置を求める
          this.focusCurRow = targetRowObj[0].rowIndex;
          this.focusCurCell = targetCellObj[0].cellIndex;
        }
        //- dataset 上の該当位置を求める ----------
        var sameNameRowObjs = $(document).find('[name="' + this.focusName + '"]').closest('tr');
                                                                      // 同じ name 属性の要素を含む、tr 要素の集合を求める
        this.focusIndex = sameNameRowObjs.index(targetRowObj);        // sameNameRowObjs 上の targetRowObj の位置が
                                                                      // dataset 上の位置に相当します
      }

      var value = this.model.onFocus(event, this.focusIndex);         // 入力項目の値をdatasetから取得する
      this.view.onFocus(event, value, this.focusCurRow);              // 値を画面に表示する

      var message = this.model.onFocusMessage(event);                 // 入力ガイドメッセージを作成する
      var arg = {status: "OK", message: message};
      this.view.onGuideMessage(arg);                                  // ガイドメッセージを表示する

      $R.log("ControllerMixin onControllerFocus : end");
    }
    // Blur処理
   ,onControllerBlur: function(event) {
      $R.log("ControllerMixin onControllerBlur start name : " + event.target.name);

      this.blurName;                                                  // Blur された要素の name 属性
      this.blurCurRow    = 0;                                         // Blur されたセルの行位置
      this.blurCurCell   = 0;                                         // Blur されたセルの列位置
                                                                      // ※セルの位置は dataset と無関係であることに注意
      this.blurIndex     = 0;                                         // dataset 上の、該当データの位置
      this.blurName  = event.target.name;                             // 対象要素から name 属性を取得
      var isMultiline = this.model.dataset.isMultilineByName(this.blurName);
                                                                      // dataset を走査して multiline かどうかを求める
      // multiline の場合
      if (isMultiline) {
        // データが次の条件で表示されているものと想定して処理します
        // ・表形式であること
        // ・各セル内が、更に個別の表になっていないこと

        //- テーブル上のセル位置を求める ----------
        var targetRowObj = $(event.target).closest('tr');             // 該当要素を含む tr 要素を求める
        var targetCellObj = $(event.target).closest('td,th');         // 該当要素を含む td / th 要素を求める
        if (targetRowObj && targetCellObj) {                          // セル位置を求める
          this.blurCurRow = targetRowObj[0].rowIndex;
          this.blurCurCell = targetCellObj[0].cellIndex;
        }
        //- dataset 上の該当位置を求める ----------
        var sameNameRowObjs = $(document).find('[name="' + this.blurName + '"]').closest('tr');
                                                                      // 同じ name 属性の要素を含む、tr 要素の集合を求める
        this.blurIndex = sameNameRowObjs.index(targetRowObj);         // sameNameRowObjs 上の targetRowObj の位置が
                                                                      // dataset 上の位置に相当します
      }

      this.model.onBlur(event, this.blurIndex);                       // 入力データをdatasetに設定する

      // 20140925 shimoji
      var message = this.model.onBlurDataCheck(event, this.blurIndex);                // 入力データをチェックする
      if (message["status"] == "OK" || message["no_display_message"] == "yes") {
        this.view.onRemoveToolTip(message);
      }
      else {
        this.view.onRemoveToolTip(message);  // 20180529 下地 追加（重複エラー表示の防止）
        this.view.onErrorToolTip(message);
      }

      this.view.onBlur(event);                                        // 入力データをフォーマットし再表示する

      if (message["status"] == "OK") {
        var target = event.target;
        //this.model.onBlurDerive(target, target.value, this.blurCurRow - 1);  // 20140923 shimoji
        this.model.onBlurDerive(target, target.value, this.blurCurRow);        // 20181018 shimoji
      }

      $R.log("ControllerMixin onControllerBlur : end");
    }

    // トランザクションを実行する
   ,ajaxExecute: function(mode) {
      $R.log("ControllerMixin ajaxExecute : start");

      var transaction = this.model.getTransaction(mode);
      if (!transaction.synchro) {
        transaction.synchroData(this, "ajaxExecuteDo");
      }
      else {
        this.ajaxExecuteDo(transaction);
      }

      $R.log("ControllerMixin ajaxExecute : end");
    }
    
   ,ajaxExecuteDo: function(transaction) {
      $R.log("ControllerMixin ajaxExecuteDo : start");
      
      var dataSet     = this.model.dataset.getData();
      var requestJson = transaction.data["request"];
      if (requestJson === undefined) {
      }
      else {
        this.model.setDatasetToJsonRecordsNoEmptyLine(dataSet, requestJson);
      }
      transaction.ajax(this);

      $R.log("ControllerMixin ajaxExecuteDo : end");
    }
    
    // 外部トランザクションを実行する
   ,ajaxExternalExecute: function(program, mode) {
      $R.log("ControllerMixin ajaxExternalExecute : start");

      var transaction = this.model.getExternalTransaction(program, mode);
      if (!transaction.synchro) {
        transaction.synchroData(this, "ajaxExecuteDo");
      }
      else {
        this.ajaxExternalExecuteDo(transaction);
      }

      $R.log("ControllerMixin ajaxExternalExecute : end");
    }
    
   ,ajaxExternalExecuteDo: function(transaction) {
      $R.log("ControllerMixin ajaxExecuteDo : start");
      
      var dataSet     = this.model.dataset.getData();
      var requestJson = transaction.data["request"];
      if (requestJson === undefined) {
      }
      else {
        this.model.setDatasetToJsonRecordsNoEmptyLine(dataSet, requestJson);
      }
      transaction.ajaxExternal(this);

      $R.log("ControllerMixin ajaxExecuteDo : end");
    }
    
    // リクエストデータをチェックする
   ,checkRequestData: function(data) {
      $R.log("ControllerMixin checkRequestData : start");

      var status = this.model.transactionCheck(data);

      $R.log("ControllerMixin checkRequestData : end");
      return status;
    }
    
    // レスポンスエラー
   ,errorResponseData: function(data) {
      $R.log("ControllerMixin errorResponseData : start");

      var msg = data["message"]["msg"];
      var arg = {title: "サーバエラー", status: "ERROR", message: msg};
      //this.pubsub.publish("guidemessage", arg);
      this.pubsub.publish("alertDialog", arg);

      $R.log("ControllerMixin errorResponseData : end");
    }
    
    // サーバとの接続エラー
   ,connectError: function(XMLHttpRequest, textStatus, errorThrown) {
      $R.log("ControllerMixin responseError : start");

      var arg = {};
      arg["title"]   = "通信エラー";
      arg["status"]  = "ERROR";
      arg["message"] = ["サーバとの接続に失敗しました。入力データが更新されていません。", "閉じるボタンを押し、そのままの画面でしばらくお待ちください。", "そして実行ボタンを押して下さい。"];
      //this.pubsub.publish("guidemessage", arg);
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

      if (this.model.dataset) {
        this.view.initExecute(this.model.dataset.data);
      }
      else {
        this.view.initExecute();
      }
      this.model.initExecute();
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

      var validation = this.model.getValidation();
      if (validation) {
        this.view.copyFormat(validation.getData());
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
    
    // -------------------------------------------------------
    // セレクトボックス表示処理
    // -------------------------------------------------------
   ,onShowSelectBox: function(responseData, defSelectBox) {
      $R.log("ControllerMixin onShowSelectBox : start");

      var detasetID      = defSelectBox["init"]["datasetid"];
      var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, detasetID);
      
      if (responseRecord) {
        if (defSelectBox["selectorid"]) {
          this.view.onShowSelectBox(defSelectBox, responseRecord["record"]);
        }
      }

      $R.log("ControllerMixin onShowSelectBox : end");
    }
    
  //   // -------------------------------------------------------
  //   // セレクトボックス表示処理 セレクタＩＤ指定によるセット 2015/07/01 OKADA
  //   // -------------------------------------------------------
  //  ,onShowSelectBoxById: function(responseData, defSelectBoxID) {
  //     $R.log("ControllerMixin onShowSelectBoxById : start");

  //     var max = this.appspec.selectbox.length;
  //     for (var i = 0; i < max; i++) {
  //       if ( this.appspec.selectbox[i]["selectorid"] == defSelectBoxID) {
  //         var defSelectBox = this.appspec.selectbox[i]
  //         var detasetID      = this.appspec.selectbox[i]["init"]["datasetid"];
  //         var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, detasetID);
          
  //         if (responseRecord) {
  //           if (defSelectBox["selectorid"]) {
  //             this.view.onShowSelectBox(defSelectBox, responseRecord["record"]);
  //           }
  //         }
  //         break;
  //       }
  //     }

  //     $R.log("ControllerMixin onShowSelectBoxById : end");
  //   }
    
    // -------------------------------------------------------
    // セレクトボックス一括表示処理（ＩＤでの設定）
    // -------------------------------------------------------
   ,onShowSelectBoxAll: function(responseData, defSelectBox) {
      $R.log("ControllerMixin onShowSelectBoxAll : start");
      
      if (this.appspec.isExists(defSelectBox[0])) {
        var max = defSelectBox.length;
        for (var i = 0; i < max; i++) {
          var detasetID      = defSelectBox[i]["init"]["datasetid"];
          var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, detasetID);
          if (!responseRecord) {
            continue;
          }
          
          if (defSelectBox[i]["selectorid"]) {
            this.view.onShowSelectBox(defSelectBox[i], responseRecord["record"]);
          }
        }
      }

      $R.log("ControllerMixin onShowSelectBoxAll : end");
    }
    
    // -------------------------------------------------------
    // チェックボックス表示処理
    // -------------------------------------------------------
   ,onShowCheckBox: function(responseData, defCheckBox) {
      $R.log("ControllerMixin onShowCheckBox : start");

      var detasetID      = defCheckBox["datasetid"];
      var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, detasetID);
      
      if (responseRecord) {
        if (defCheckBox["selectorid"]) {
          this.view.onShowCheckBox(defCheckBox, responseRecord["record"]);
        }
      }

      $R.log("ControllerMixin onShowCheckBox : end");
    }
    
    
    // -------------------------------------------------------
    // チェックボックス一括表示処理
    // -------------------------------------------------------
   ,onShowCheckBoxAll: function(responseData, defCheckBox) {
      $R.log("ControllerMixin onShowCheckBoxAll : start");

      var max = defCheckBox.length;
      for (var i = 0; i < max; i++) {
        var detasetID      = defCheckBox[i]["datasetid"];
        var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, detasetID);
        if (!responseRecord) {
          continue;
        }

        if (defCheckBox[i]["selectorid"]) {
          this.view.onShowCheckBox(defCheckBox[i], responseRecord["record"]);
        }
      }

      $R.log("ControllerMixin onShowCheckBoxAll : end");
    }
    
    // -------------------------------------------------------
    // テーブル　チェックボックス一括表示処理
    // -------------------------------------------------------
   ,onShowCheckBoxAllTable: function(responseData, defCheckBox) {
      $R.log("ControllerMixin onShowCheckBoxAllTable : start");

      var max = defCheckBox.length;
      for (var i = 0; i < max; i++) {
        var detasetID      = defCheckBox[i]["datasetid"];
        var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, detasetID);
        if (!responseRecord) {
          continue;
        }

        if (defCheckBox[i]["selectorname"]) {
          this.view.onShowCheckBoxTable(defCheckBox[i], responseRecord["record"]);
        }
      }

      $R.log("ControllerMixin onShowCheckBoxAllTable : end");
    }
    
    // -------------------------------------------------------
    // ラジオボタン表示処理
    // -------------------------------------------------------
   ,onShowRadioButton: function(responseData, defRadioButton) {
      $R.log("ControllerMixin onShowRadioButton : start");

      var detasetID      = defRadioButton["datasetid"];
      var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, detasetID);
      
      if (responseRecord) {
        if (defRadioButton["selectorname"]) {
          this.view.onShowRadioButton(defRadioButton, responseRecord["record"]);
        }
      }

      $R.log("ControllerMixin onShowRadioButton : end");
    }
    
    // -------------------------------------------------------
    // ラジオボタン一括表示処理
    // -------------------------------------------------------
   ,onShowRadioButtonAll: function(responseData, defRadioButton) {
      $R.log("ControllerMixin onShowRadioButtonAll : start");

      var max = defRadioButton.length;
      for (var i = 0; i < max; i++) {
        var detasetID      = defRadioButton[i]["datasetid"];
        var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, detasetID);
        if (!responseRecord) {
          continue;
        }

        if (defRadioButton[i]["selectorname"]) {
          this.view.onShowRadioButton(defRadioButton[i], responseRecord["record"]);
        }
      }

      $R.log("ControllerMixin onShowRadioButtonAll : end");
    }
    
  };
}(jQuery, Rmenu));
