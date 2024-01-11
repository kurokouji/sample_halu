(function(jQuery){
  // Functionコンストラクタの実行でグローバルオブジェクトthisを返す
  // "use strict";
  var root = Function("return this")();

  // トップレベルの名前空間。Rmenuのすべてのパブリックのクラスとモジュールはこれに含まれる
  var Rmenu = root.Rmenu = {};
  Rmenu.Application = {};
  Rmenu.Library     = {};

  // Rmenuにアクセスするためのショートカット
  var $R       = Rmenu;

  // ライブラリの現在のバージョン
  $R.Version = "3.1.0";

  // 実行モード
  $R.LogMode = "DEBUG";
  //$R.LogMode = "";

  // ログ出力
  $R.log = function(message) {
    if ($R.LogMode != "DEBUG") return;                                // 実行モードの判定
    if (typeof console == "undefined") return;
    console.log(message);
  }

  /**
   * 基本クラスを定義する（参考情報）
   * 書籍名：ステートフルJavaScript MVCアーキテクチャに基づくアプリケーションの状態管理
   * 著　者：Alex MacCar(アレックス・マッカウ)
   * 発行所：株式会社オライリー・シャパン
   */
  var Class = $R.Class = function(parent) {
    var _class = function() {
      this.init.apply(this, arguments);
    };

    // クラスのプロトタイプを変更する
    if (parent) {
      var subclass = function() {};
      subclass.prototype = parent.prototype;
      _class.prototype = new subclass
    }

    // インスタンス時に呼び出される
    _class.prototype.init = function() {};

    // プロトタイプにアクセスするためのショートカット
    _class.fn = _class.prototype;

    // クラスにアクセスするためのショートカット
    _class.fn.parent = _class;
    _class._super = _class.__proto__;

    // クラスプロパティを追加する
    _class.extend = function(obj) {
      var extended = obj.extended;
      for(var i in obj) {
        _class[i] = obj[i];
      }
      if (extended) extended(_class);
    };

    // インスタンスプロパティを追加する
    _class.include = function(obj) {
      var included = obj.included;
      for(var i in obj) {
        _class.fn[i] = obj[i];
      }
      if (included) included(_class);
    };

    return _class;
  };

  // イベントクラス
  var Event = $R.Event = new Class();
  Event.fn.lives = {};                                                // liveイベント
  Event.include({
    // イベントを設定し、コールバック関数を指定する
    setEvent: function(self, events) {
      $R.log("Event setEvent : start");

      var liveevent = new Class();
      liveevent.include({
        execute: function(selector, event, callback) {
          // 全てのオブジェクトに対して、
          // delegate(), live() に相当するイベント登録を行う
          $(document).on(event, selector, function(e, arg){
            var fnc = "self." + callback + "(e, arg)";
            eval(fnc);
          });
        }
      });

      var selector, event, callback;
      var maxcount = events.length, i;
      for (i = 0; i < maxcount; i++){
        selector = events[i][0];
        event    = events[i][1];
        callback = events[i][2];

        this.lives[callback] = new liveevent();
        this.lives[callback].execute(selector, event, callback);
      }

      $R.log("Event setEvent : end");
    }
    // イベントを削除する
   ,dieEvent: function(selector, event, callback) {
      $(selector).die(event);
      delete this.lives[callback];
    }
  });

  // PubSubクラス(カスタムイベント管理)
  var PubSub = $R.PubSub = new Class();
  PubSub.fn.context      = {};                                        // 実行コンテキスト
  PubSub.fn.callback     = {};                                        // コールバック関数
  PubSub.fn.model        = {};
  PubSub.fn.view         = {};
  PubSub.fn.controller   = {};
  PubSub.fn.formcontroll = {};
  PubSub.include({
    // ベント名でコールバック関数名を格納する
    subscribe: function(pubsubEvent) {
      $R.log("PubSub subscribe : start");

      var event, context, callback;
      var maxcount = pubsubEvent.length, i;
      for (i = 0; i < maxcount; i++){
        event    = pubsubEvent[i][0];

        if (event in this.callback) continue;

        context  = pubsubEvent[i][1];
        callback = pubsubEvent[i][2];
        this.context[event]  = context;
        this.callback[event] = callback;
      }

      $R.log("PubSub subscribe : end");
    }
    // イベントを削除する
   ,unsubscribe: function(event) {
      $R.log("PubSub unsubscribe : start");

      if (event in this.callback) {
        delete this.context[event];
        delete this.callback[event];
      }

      $R.log("PubSub unsubscribe : end");
    }
    // イベント名でコールバック関数を実行する
   ,publish: function(event, arg) {
      $R.log("PubSub publish : start");

      if (!(event in this.callback)) return;

      var callback = this.callback[event];
      var context  = this.context[event];
      var self     = {};
      var fnc;
      if (context == "model") {
        self = this.model;
      }
      if (context == "view") {
        self = this.view;
      }
      if (context == "controller") {
        self = this.controller;
      }
      if (context == "formcontroll") {
        self = this.formcontroll;
      }
      fnc = "self." + callback + "(arg)";

      $R.log("PubSub publish : end");
      return eval(fnc);
    }
    // PubSubイベントが登録されているか
   ,isEvent: function(event) {
      return this.callback[event];
    }
  });

  // 同期クラス(Datasetクラス・Transactionクラス・Validationクラスで使用する)
  var Synchro = $R.Synchro = new Class();
  Synchro.include({
    execute: function(self, fnc, obj) {
      $R.log("Synchro execute : start");

      var times = 0;
      var recursive = {
        execute: function(self, fnc, obj) {
          $R.log("Synchro object synchro : " + obj.synchro);
          var selffnc;
          if (obj.synchro) {                                          // 同期フラッグの判定
            selffnc = "self." + fnc + "(obj)";                        // 真の時コールバック関数を実行する
            eval(selffnc);
            return;
          }

          if (times < 100) {                                          // 偽の時再帰関数を実行する
            times += 1;
            $R.log("Synchro execute times: " + times);
            setTimeout(function(){recursive.execute(self, fnc, obj);}, 20);
          }
          else {
            selffnc = "self.connectError()";                           // 接続エラー
            eval(selffnc);
          }
        }
      };
      
      recursive.execute(self, fnc, obj);

      $R.log("Synchro execute : end");
    }
  });

  // データセットクラス
  var Dataset = $R.Dataset = new Class();
  Dataset.fn.name;
  Dataset.fn.synchro   = false;                                       // 同期フラッグ：偽
  Dataset.fn.data;                                                    // dataset json
  Dataset.fn.formno;                                                  // フォームNo
  Dataset.fn.elementno = {};                                          // element番号
  Dataset.include({
    // dataset JSONファイルを読み込む
    getDatasetJSON: function(appspec) {
      $R.log("Dataset getDatasetJSON : start");

      Dataset.fn.name   = appspec.name + "_dataset.json";
      Dataset.fn.formno = appspec.formno;                             // フォームNo
      if (appspec.jsonInfo[0].dataset == "yes") {
        var url = $R.ApplicationURL + appspec.urlInfo[1].json + Dataset.fn.name;
        $.ajax({
           url:      url
          ,type:     "GET"
          ,cache:    false
          ,dataType: "json"
          ,success:  function(data) {
             Dataset.fn.data    = data;                                // dataset json
             Dataset.fn.synchro = true;                                // 同期フラッグ：真
           }
        });
      }

      $R.log("Dataset getDatasetJSON : end");
    }
    // 同期処理
   ,synchroData: function(self, startFnc) {
      $R.log("Dataset synchroData : start");

      var synchro = new $R.Synchro();                                 // 同期クラスを作成する
      synchro.execute(self, startFnc, this);

      $R.log("Dataset synchroData : end");
    }
    // getter setter
   ,getData: function() {
      return this.data;
    }
   ,setData: function(dataset) {
      this.data = dataset;
    }
   ,getElementData: function(name, row) {
      var records   = this.data["records"];
      var maxrecord = records.length;
      var record, i;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        if (!(name in record)) continue;

        if (arguments.length == 1) return record[name]["value"][0];
        return record[name]["value"][row];
      }
      return "";
    }
   ,getIdElementData: function(id, name, row) {
      var records   = this.data["records"];
      var maxrecord = records.length;
      var record, i;
      for (i = 0; i < maxrecord; i++) {
        if (records[i]["id"] != id) {
          continue;
        }
        
        record = records[i]["record"];
        if (!(name in record)) {
          return "";
        }

        if (arguments.length == 2) return record[name]["value"][0];
        return record[name]["value"][row];
      }
      return "";
    }
   ,setElementData: function(value, name, row) {
      var records   = this.data["records"];
      var maxrecord = records.length;
      var record, i;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        if (!(name in record)) continue;

        if (arguments.length == 2) {
          record[name]["value"][0] = value;
        }
        else {
          record[name]["value"][row] = value;
        }
        return value;
      }
      return "";
    }
   ,setIdElementData: function(value, id, name, row) {
      var records   = this.data["records"];
      var maxrecord = records.length;
      var record, i;
      for (i = 0; i < maxrecord; i++) {
        if (records[i]["id"] != id) {
          continue;
        }

        record = records[i]["record"];
        if (!(name in record)) {
          return "";
        }

        if (arguments.length == 3) {
          record[name]["value"][0] = value;
        }
        else {
          record[name]["value"][row] = value;
        }
        return value;
      }
      return "";
    }
   ,getElementValue: function(name) {
      var records   = this.data["records"];
      var maxrecord = records.length;
      var record, i;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        if (!(name in record)) continue;
        return record[name]["value"];
      }
      return [""];
    }
   ,isMultilineByName: function(name) {
      var records   = this.data["records"];
      var maxrecord = records.length;
      var record, i;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        if (!(name in record)) continue;

        if (records[i]["multiline"] == "yes") {
          return true;
        }
        else {
          return false;
        }
      }
      return false;
    }
  });

  // validationクラス
  var Validation = $R.Validation = new Class();
  Validation.fn.name;
  Validation.fn.synchro      = false;                                 // 同期フラッグ：偽
  Validation.fn.data;                                                 // validation json
  Validation.include({
    // validation JSONファイルを読み込む
    getValidationJSON: function(appspec) {
      $R.log("Validation getValidationJSON : start");

      Validation.fn.name = appspec.name + "_validation.json";
      if (appspec.jsonInfo[1].validation == "yes") {
        var url = $R.ApplicationURL + appspec.urlInfo[1].json + Validation.fn.name;
        $.ajax({
           url:      url
          ,type:     "GET"
          ,cache:    false
          ,dataType: "json"
          ,success:  function(data) {
             Validation.fn.data    = data;                              // validation json
             Validation.fn.synchro = true;                              // 同期フラッグ：真
           }
        });
      }

      $R.log("Validation getValidationJSON : end");
    }
    // 該当項目のvalidationルールを取得する
   ,getTargetRule: function(targetName) {
      $R.log("Validation getTargetRule : start");

       var records   = this.data["records"];
       var reclength = records.length;
       var record, i;
       for (i = 0; i < reclength; i++) {
         record = records[i]["record"];
         if (targetName in record) {
           return record[targetName];
         }
       }

      $R.log("Validation getTargetRule : end");
      return false;
    }
    // 該当項目のmultiline情報を取得する
   ,getTargetMultline: function(targetName) {
      $R.log("Validation getTargetMultline : start");

      var records   = this.data["records"];
      var reclength = records.length;
      var record, i;
      for (i = 0; i < reclength; i++) {
        record = records[i]["record"];
        if (targetName in record) {
          return records[i]["multiline"];
        }
      }

      $R.log("Validation getTargetMultline : end");
      return "no";
    }
    // 該当項目の no_display_message 情報を取得する
    // xxx_validation.json に本項目が存在しない場合は "no" を返却します
   ,getTargetNoDisplayMessage: function(targetName) {
      $R.log("Validation getTargetNoDisplayMessage : start");

      var records   = this.data["records"];
      var reclength = records.length;
      var record, i, result;
      for (i = 0; i < reclength; i++) {
        record = records[i]["record"];
        if (targetName in record) {
          result = records[i]["no_display_message"];
          break;
        }
      }

      $R.log("Validation getTargetNoDisplayMessage : end");
      return (result == undefined ? "no" : result);
    }
    // getter
   ,getData: function() {
      return this.data;
    }
    // 同期処理
   ,synchroData: function(self, startFnc) {
      $R.log("Validation synchroData : start");

      var synchro = new $R.Synchro();                                 // 同期クラスを作成する
      synchro.execute(self, startFnc, this);

      $R.log("Validation synchroData : end");
    }
  });

  // トランザクションクラス
  var Transaction = $R.Transaction = new Class();
  Transaction.fn.name;
  Transaction.fn.synchro  = false;                                    // 同期フラッグ：偽
  Transaction.fn.formno;                                              // フォームNo
  Transaction.fn.program;                                                // モード
  Transaction.fn.mode;                                                // モード
  Transaction.fn.request;                                             // リクエスト前処理関数
  Transaction.fn.response;                                            // レスポンス処理関数
  Transaction.fn.error;                                               // エラー処理関数
  Transaction.fn.data     = {};                                       // transaction json
  Transaction.include({
    // transaction JSONファイルを読み込む
    setTranCallback: function(appspec, callback) {
      $R.log("Transaction setTranCallback : start");

      this.name     = appspec.name + "_" + callback[0] + "_tran.json";
      this.formno   = appspec.formno;                       // フォームNo
      this.program  = appspec.name;                         // プログラム名
      this.mode     = callback[0];                          // モード
      this.request  = callback[1];                          // リクエスト前処理関数
      this.response = callback[2];                          // レスポンス処理関数
      this.error    = callback[3];                          // エラー処理関数

      $R.log("Transaction setTranCallback : end");
    }
    // 外部transaction JSONファイルを読み込む
   ,setExternalTranCallback: function(appspec, callback) {
      $R.log("Transaction setExternalTranCallback : start");

      this.name     = callback[0] + "_" + callback[1] + "_tran.json";
      this.formno   = appspec.formno;                       // フォームNo
      this.program  = callback[0];                          // プログラム名
      this.mode     = callback[1];                          // モード
      this.request  = callback[2];                          // リクエスト前処理関数
      this.response = callback[3];                          // レスポンス処理関数
      this.error    = callback[4];                          // エラー処理関数

      $R.log("Transaction setExternalTranCallback : end");
    }
   ,setValueLength: function(datasetRecord) {
      $R.log("Transaction setValueLength : start");

      if (datasetRecord["multiline"] == "no") return 1;

      var name, curline, i;
      var maxline = 0;
      for (name in datasetRecord["record"]) {
        curline = datasetRecord["record"][name]["value"].length - 1;
        for (i = curline; i >= 0; i--) {
          if (datasetRecord["record"][name]["value"][i]) {
            break;
          }
        }
        if (i > maxline) {
          maxline = i;
        }
      }

      $R.log("Transaction setValueLength : end");
      return maxline + 1;
    }
    // リクエストデータを送信する
   ,ajax: function(self) {
      $R.log("Transaction ajax : start" + " mode=" + this.mode);

      var mode         = this.mode;                                         // モード
      var request      = "self."+ this.request;                             // リクエスト前処理関数
      var responseFnc  = "self."+ this.response + "(data, mode)";           // レスポンス処理関数
      var errorFnc     = "self."+ this.error + "(data, mode)";              // エラー処理関数
      var connectError = "self."+ "connectError";                           // サーバ接続エラー関数
      var reqData      = this.data["request"];                              // リクエストデータ
      var requestFnc = request + "(reqData, mode)";
      if (!eval(requestFnc)) return;

      var tranSelf    = this;
      var requestData = JSON.stringify(reqData);
      this.lockScreen("lockID");
      var imagesURL   = $R.SystemURL+ "Html/images/gif-load.gif";           // スピン画像を表示する
      $("#loading").html("<img src='" + imagesURL + "'/>");                 // スピン画像を表示する
      $.ajax({
         url:         $R.MainRackURL
        ,type:        "POST"
        ,data:        "data=" + encodeURIComponent(requestData)
        ,dataType:    "json"
        ,success:     function(data) {
           var status  = data["message"]["status"];
           if (status == "OK") {
             tranSelf.setResponseValue(data, tranSelf);
             $.proxy(eval(responseFnc), self);
           }
           else {
             $.proxy(eval(errorFnc), self);
           }
         }
        ,error: $.proxy(eval(connectError), self)
        ,complete: function(data) {
          $("#loading").empty();                                              // スピン画像を消去する
          tranSelf.unlockScreen("lockID");
        }
      });

      $R.log("Transaction ajax : end");
    }
    // 外部プログラムのリクエストデータを送信する
   ,ajaxExternal: function(self) {
      $R.log("Transaction ajaxExternal : start" + " mode=" + this.mode);

      var mode         = this.mode;                                         // モード
      var request      = "self."+ this.request;                             // リクエスト前処理関数
      var responseFnc  = "self."+ this.response + "(data, mode)";           // レスポンス処理関数
      var errorFnc     = "self."+ this.error + "(data, mode)";              // エラー処理関数
      var connectError = "self."+ "connectError";                           // サーバ接続エラー関数
      var reqData      = this.data["request"];                              // リクエストデータ
      var requestFnc = request + "(reqData, mode)";
      if (!eval(requestFnc)) return;

      var tranSelf    = this;
      var requestData = JSON.stringify(reqData);
      $.ajax({
         url:         $R.MainRackURL
        ,type:        "POST"
        ,data:        "data=" + encodeURIComponent(requestData)
        ,dataType:    "json"
        ,success:     function(data) {
           var status  = data["message"]["status"];
           if (status == "OK") {
             tranSelf.setResponseValue(data, tranSelf);
             $.proxy(eval(responseFnc), self);
           }
           else {
             $.proxy(eval(errorFnc), self);
           }
         }
        ,error: $.proxy(eval(connectError), self)
        ,complete: function(data) {
        }
      });

      $R.log("Transaction ajaxExternal : end");
    }
    // ログインリクエストデータを送信する
   ,loginAjax: function(self) {
      $R.log("Transaction loginAjax : start" + " mode=" + mode);

      var mode         = this.mode;                                         // モード
      var request      = "self."+ this.request;                             // リクエスト前処理関数
      var responseFnc  = "self."+ this.response + "(data, mode)";           // レスポンス処理関数
      var errorFnc     = "self."+ this.error + "(data, mode)";              // エラー処理関数
      var connectError = "self."+ "connectError";                           // サーバ接続エラー関数
      var reqData      = this.data["request"];                              // リクエストデータ
      var requestFnc = request + "(reqData, mode)";
      if (!eval(requestFnc)) return;

      var tranSelf    = this;
      var requestData = JSON.stringify(reqData);
      this.lockScreen("lockID");
      var imagesURL   = $R.SystemURL+ "Html/images/gif-load.gif";           // スピン画像を表示する
      $("#loading").html("<img src='" + imagesURL + "'/>");                 // スピン画像を表示する
      $.ajax({
         url:         $R.LoginRackURL
        ,type:        "POST"
        ,data:        "data=" + encodeURIComponent(requestData)
        ,dataType:    "json"
        ,success:     function(data) {
           var status  = data["message"]["status"];
           if (status == "OK") {
             tranSelf.setResponseValue(data, tranSelf);
             $.proxy(eval(responseFnc), self);
           }
           else {
             $.proxy(eval(errorFnc), self);
           }
         }
        ,error: $.proxy(eval(connectError), self)
        ,complete: function(data) {
          $("#loading").empty();                                              // スピン画像を消去する
          tranSelf.unlockScreen("lockID");
        }
      });

      $R.log("Transaction loginAjax : end");
    }
    // 画面をロックする
   ,lockScreen: function(id) {
      $R.log("Transaction lockScreen : start");
      var scHeight =  $(document).height();  // 2017/10/19 追 Okada
      var scWidth  =  $(document).width();  // 2017/10/19 追 Okada
      var lockTag = $("<div />").attr("id", id);
      lockTag.css("z-index", "99999")
             .css("position", "absolute")
             .css("top", "0px")
             .css("left", "0px")
//           .css("right", "0px")  // 2017/10/19 消 Okada
//           .css("bottom", "0px")  // 2017/10/19 消 Okada
             .css("background-color", "gray")
             .css("opacity", "0.3") 
             .css("height", scHeight + "px")  // 2017/10/19 追 Okada
             .css("width", scWidth + "px"); // 2017/10/19 追 Okada
      $("body").append(lockTag);

      $R.log("Transaction lockScreen : end");
    }
    // ロックを解除する
   ,unlockScreen: function(id) {
      $R.log("Transaction unlockScreen : start");
      
      $("#" + id).remove();

      $R.log("Transaction unlockScreen : end");
    }
    // ajaxの結果データからトランザクションレスポンスデータのvalue値を設定する
   ,setResponseValue: function(data, tranSelf) {
      $R.log("Transaction setResponseValue : start");

      if (!data["records"]) return;
      
      // レスポンスデータの値をクリアする
      tranSelf.clearResponseDataValue(tranSelf);

      // レスポンスデータに値を設定する
      var responseRecords = tranSelf.data["response"]["records"];
      var responselength  = responseRecords.length;
      var dataRecords     = data["records"];
      var datalength      = dataRecords.length;
      var responseRecord, name, idname, dataRecord, valuelength, i, j, k;
      for (i = 0; i < responselength; i++) {
        idname = responseRecords[i]["id"];
        for (j = 0; j < datalength; j++) {
          if (idname != dataRecords[j]["id"]) continue;
          responseRecord = responseRecords[i]["record"];
          dataRecord     = dataRecords[j]["record"];
          valuelength    = tranSelf.setValueLength(dataRecords[j]);
          for (name in responseRecord) {
            if (name in dataRecord) {
              for (k = 0; k < valuelength; k++) {
               responseRecord[name]["value"][k] = dataRecord[name]["value"][k];
              }
            }
          }
          break;
        }
      }

      $R.log("Transaction setResponseValue : end");
    }
    //  レスポンセデータのvalue値をクリアする
   ,clearResponseDataValue: function(tranSelf) {
      $R.log("Transaction clearResponseDataValue : start");

      if (!tranSelf.data["response"]["records"]) return;
      var records    = tranSelf.data["response"]["records"];
      var maxrecord  = records.length;
      var record, name, i;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        for (name in record) {
          record[name]["value"] = [""];
        }
      }

      $R.log("Transaction clearResponseDataValue : end");
    }
    // getter
   ,getData: function() {
      return this.data;
    }
    // 同期処理
   ,synchroData: function(self, startFnc) {
      $R.log("Transaction synchroData : start");

      var synchro = new $R.Synchro();                                 // 同期クラスを作成する
      synchro.execute(self, startFnc, this);

      $R.log("Transaction synchroData : end");
    }
  });

  // トランザクションク管理クラス
  var TranControll = $R.TranControll = new Class();
  TranControll.fn.trans = {};                                         // Transactionクラス集合
  TranControll.fn.externaltrans = {};                                 // 外部Transactionクラス集合
  TranControll.include({
    // トランザクションクラスを作成する
    setTran: function(appspec) {
      $R.log("TranControll setTran : start");

      var callbackes = appspec.requestInfo;
      var maxlength  = callbackes.length;
      var transaction, callback, mode, i;
      for (i = 0; i < maxlength; i++){
        callback = callbackes[i];
        mode     = callback[0];                                           // Transactionモード
        TranControll.fn.trans[mode] = new $R.Transaction(); // Transactionクラスを作成する
        TranControll.fn.trans[mode].setTranCallback(appspec, callback);
      }
      this.getTranJsons(appspec);

      $R.log("TranControll setTran : end");
    }
   ,tranControllRecursive: function(callbackArray, urlArray) {
      $R.log("TranControll tranControllRecursive : start");

      var recursive = {
        execute: function(callbackArray, urlArray) {
          var callback = callbackArray.shift();
          var url      = urlArray.shift();
          var mode     = callback[0];
          $.ajax({
             url:      url
            ,type:     "GET"
            ,cache:    false
            ,dataType: "json"
            ,success:  function(data) {
               TranControll.fn.trans[mode].data     = data;
               TranControll.fn.trans[mode].synchro  = true;
               if (callbackArray.length > 0) {
                 recursive.execute(callbackArray, urlArray);
               }
             }
          });
        }
      };

      recursive.execute(callbackArray, urlArray);

      $R.log("TranControll tranControllRecursive : end");
    }
   ,getTranJsons: function(appspec) {
      $R.log("TranControll getTranJsons : start");

      var urlArray      = [];
      var callbackArray = appspec.requestInfo;
      var maxlength = callbackArray.length;
      var url, mode, i;
      for (i = 0; i < maxlength; i++){
        mode = callbackArray[i][0];
        url = $R.ApplicationURL + appspec.urlInfo[1].json + appspec.name + "_" + mode + "_tran.json";
        urlArray[i]  = url;
      }

      if (maxlength > 0) {
        this.tranControllRecursive(callbackArray, urlArray);
      }

      $R.log("TranControll getTranJsons : end");
    }
    // 外部トランザクションクラスを作成する
   ,setExternalTran: function(appspec) {
      $R.log("TranControll setExternalTran : start");

      if (appspec.externalInfo === undefined) {
        $R.log("TranControll setExternalTran : end");
        return;
      }

      var callbackes = appspec.externalInfo;
      var maxlength  = callbackes.length;
      var transaction, callback, program, mode, i;
      for (i = 0; i < maxlength; i++){
        callback = callbackes[i];
        program  = callback[0];                                           // プログラム名
        mode     = callback[1];                                           // 外部Transactionモード
        TranControll.fn.externaltrans[program + "_" + mode] = new $R.Transaction(); // Transactionクラスを作成する
        TranControll.fn.externaltrans[program + "_" + mode].setExternalTranCallback(appspec, callback);
      }
      this.getExternalTranJsons(appspec);

      $R.log("TranControll setExternalTran : end");
    }
   ,tranControllExternalRecursive: function(callbackArray, urlArray) {
      $R.log("TranControll tranControllExternalRecursive : start");

      var recursive = {
        execute: function(callbackArray, urlArray) {
          var callback = callbackArray.shift();
          var url      = urlArray.shift();
          var mode     = callback[0] + "_" + callback[1];
          $.ajax({
             url:      url
            ,type:     "GET"
            ,cache:    false
            ,dataType: "json"
            ,success:  function(data) {
               TranControll.fn.externaltrans[mode].data     = data;
               TranControll.fn.externaltrans[mode].synchro  = true;
               if (callbackArray.length > 0) {
                 recursive.execute(callbackArray, urlArray);
               }
             }
          });
        }
      };

      recursive.execute(callbackArray, urlArray);

      $R.log("TranControll tranControllExternalRecursive : end");
    }
   ,getExternalTranJsons: function(appspec) {
      $R.log("TranControll getExternalTranJsons : start");

      var urlArray      = [];
      var requestInfo   = appspec.requestInfo;
      var callbackArray = appspec.externalInfo;
      var maxlength     = callbackArray.length;
      var url, program, mode, jsonUrl, jsonArray, extUrl, i;
      for (i = 0; i < maxlength; i++){
        program = callbackArray[i][0];
        mode    = callbackArray[i][1];
        jsonUrl = appspec.urlInfo[1].json;
        jsonArray = jsonUrl.split("/");
        extUrl    = jsonArray[0] + "/" + jsonArray[1] + "/" + jsonArray[2] + "/" + program + "/";
        url       = $R.ApplicationURL + extUrl + program + "_" + mode + "_tran.json";
        urlArray[i]  = url;
      }

      if (maxlength > 0) {
        this.tranControllExternalRecursive(callbackArray, urlArray);
      }

      $R.log("TranControll getExternalTranJsons : end");
    }
    // getter
   ,getTransaction: function(mode) {
      return this.trans[mode];
    }
   ,getExternalTransaction: function(program, mode) {
      return this.externaltrans[program + "_" + mode];
    }
  });

  // アプリケーション仕様クラス
  var AppSpec = $R.AppSpec = new Class();
  AppSpec.fn.sysname;                                                 // システム名        （20140814 shimoji 追加）
  AppSpec.fn.name;                                                    // プログラム名
  AppSpec.fn.nextname;                                                // 次画面プログラム名（20140814 shimoji 追加）
  AppSpec.fn.beforename;                                              // 前画面プログラム名（20140814 shimoji 追加）
  AppSpec.fn.formcontroll = {};                                       // フォーム管理クラス
  AppSpec.fn.formno;                                                  // フォームNo
  AppSpec.include({
    initialSetting: function(App) {
      $R.log("AppSpec initialSetting : start");

      // サーバ　アクセスパスを設定する
      var url            = location.href;
      var urlArray       = url.split("/");
      switch (urlArray[3]) {
        case "Application":
          $R.SystemURL       = urlArray[0] + "//" + urlArray[2] + "/System/";
          $R.ApplicationURL  = urlArray[0] + "//" + urlArray[2] + "/Application/";
          $R.RmenuRackURL    = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/";
          $R.MainRackURL     = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/Halumain";
          $R.HtmlRackURL     = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/Haluhtml";
          $R.DownloadRackURL = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/HaluDownload";
          $R.UploadRackURL   = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/HaluUpload";
          $R.LoginRackURL    = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/HaluLogin";
          break;
        case "HaluASGI":
          $R.SystemURL       = urlArray[0] + "//" + urlArray[2] + "/System/";
          $R.ApplicationURL  = urlArray[0] + "//" + urlArray[2] + "/Application/";
          $R.RmenuRackURL    = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/";
          $R.MainRackURL     = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/Halumain";
          $R.HtmlRackURL     = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/Haluhtml";
          $R.DownloadRackURL = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/HaluDownload";
          $R.UploadRackURL   = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/HaluUpload";
          $R.LoginRackURL    = urlArray[0] + "//" + urlArray[2] + "/HaluASGI/HaluLogin";
          break;
        case "Rmenu":
          $R.SystemURL       = urlArray[0] + "//" + urlArray[2] + "/System/";
          $R.ApplicationURL  = urlArray[0] + "//" + urlArray[2] + "/Application/";
          $R.RmenuRackURL    = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/";
          $R.MainRackURL     = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/Rmenumain";
          $R.HtmlRackURL     = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/Rmenuhtml";
          $R.DownloadRackURL = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/RmenuDownload";
          $R.UploadRackURL   = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/RmenuUpload";
          $R.LoginRackURL    = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/RmenuLogin";
          break;
        case "RmenuASGI":
          $R.SystemURL       = urlArray[0] + "//" + urlArray[2] + "/System/";
          $R.ApplicationURL  = urlArray[0] + "//" + urlArray[2] + "/Application/";
          $R.RmenuRackURL    = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/";
          $R.MainRackURL     = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/Rmenumain";
          $R.HtmlRackURL     = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/Rmenuhtml";
          $R.DownloadRackURL = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/RmenuDownload";
          $R.UploadRackURL   = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/RmenuUpload";
          $R.LoginRackURL    = urlArray[0] + "//" + urlArray[2] + "/RmenuASGI/RmenuLogin";
          break;
        default:
          $R.SystemURL       = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/System/";
          $R.ApplicationURL  = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/Application/";
          $R.RmenuRackURL    = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/HaluASGI/";
          $R.MainRackURL     = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/HaluASGI/Halumain";
          $R.HtmlRackURL     = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/HaluASGI/Haluhtml";
          $R.DownloadRackURL = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/HaluASGI/HaluDownload";
          $R.UploadRackURL   = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/HaluASGI/HaluUpload";
          $R.LoginRackURL    = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/HaluASGI/HaluLogin";
          break;
      }

      this.setSysName();                                              // システム名を設定する
      this.setFormNo();                                               // FormNoを設定する
      var model      = new App.Model(this);                           // モデルクラスを作成する
      var view       = new App.View(this);                            // ビュークラスを作成する
      var controller = new App.Controller(this, model, view);         // コントローラクラスを作成する
      model.initialSetting();
      view.initialSetting();
      controller.initialSetting();

      $R.log("AppSpec initialSetting : end");
    }
    // formnoを設定する
   ,setFormNo: function(enterTabPFKey) {
      $R.log("AppSpec setFormNo : start");

      if (arguments.length == 0) {
        enterTabPFKey = this.enterTabPFKey;
      }
      $R.log("AppSpec setFormNo : no = " + enterTabPFKey["Forms"]);

      this.formno = enterTabPFKey["Forms"];                           // フォームNoを設定する
      $R.log("AppSpec setFormNo : end");
    }
    // システム名を設定する
    ,setSysName: function() {
      $R.log("AppSpec setSysName : start");

      var appInfo  = this.urlInfo[0]["app"];
      appInfoArray = appInfo.split("/");
      this.sysname = appInfoArray[0];                                 // システム名を設定する

      $R.log("AppSpec setSysName : end");
    }
  });

  // モデルクラス
  var Model = $R.Model = new Class();
  Model.fn.appspec      = {};                                         // アプリケーション仕様クラス
  Model.fn.dataset;                                                   // Datasetクラス
  Model.fn.validation;                                                // Validationクラス
  Model.fn.trancontroll;                                              // トランザクション管理クラス
  Model.fn.event        = {};                                         // Eventクラス
  Model.fn.pubsub       = {};                                         // PubSubクラス
  Model.include({
    initialSetting: function() {
      $R.log("Model initialSetting : start");

      this.setDatasetJSON();
      this.setValidationJSON();
      this.setTransactionJSON();

      $R.log("Model initialSetting : end");
    }
    // dataset JSONファイルを読み込む
   ,setDatasetJSON: function() {
      $R.log("Model setDatasetJSON : start");

      if (this.appspec.jsonInfo[0].dataset == "yes") {
        this.dataset = new $R.Dataset();                              // Datasetクラスを作成する
        this.dataset.getDatasetJSON(this.appspec);
      }

      $R.log("Model setDatasetJSON : end");
    }
    // validation JSONファイルを読み込む
   ,setValidationJSON: function() {
      $R.log("Model setValidationJSON : start");

      if (this.appspec.jsonInfo[1].validation == "yes") {
        this.validation = new $R.Validation();                        // Validationクラスを作成する
        this.validation.getValidationJSON(this.appspec);
      }

      $R.log("Model setValidationJSON : end");
    }
    // トランザクションク管理クラスを作成する
   ,setTransactionJSON: function() {
      $R.log("Model setTransactionJSON : start");

      this.trancontroll = new $R.TranControll();                      // TranControllクラスを作成する
      this.trancontroll.setTran(this.appspec);
      this.trancontroll.setExternalTran(this.appspec);

      $R.log("Model setTransactionJSON : end");
    }
    // getter
   ,getDataset: function() {
      return this.dataset;                                            // Datasetクラス
    }
   ,getValidation: function() {
      return this.validation;                                         // validationクラス
    }
   ,getTransaction: function(mode) {
      return this.trancontroll.getTransaction(mode);                  // Transactionクラス
    }
   ,getExternalTransaction: function(program, mode) {
      return this.trancontroll.getExternalTransaction(program, mode); // 外部Transactionクラス
    }
  });

  // ビュークラス
  var View = $R.View = new Class();
  View.fn.appspec     = {};                                           // アプリケーション仕様クラス
  View.fn.event       = {};                                           // Eventクラス
  View.fn.pubsub      = {};                                           // PubSubクラス
  View.fn.format      = {};                                           // フォーマット
  View.fn.elementno   = {};                                           // element番号
  View.fn.guidemessage;                                               // ガイドメッセージ表示フラッグ
  View.include({
    initialSetting: function() {
      $R.log("View initialSetting : start");

      this.setOutlineEvent();

      $R.log("View initialSetting : end");
    }
    // form要素の値をクリアする
   ,clearDataValue: function() {
      $R.log("View clearDataValue : start");

      var formobject = document.forms[this.appspec.formno];           //フォームオブジェクトを取得する
      var maxelement = formobject.length;
      var i;
      for (i = 0; i < maxelement; i++) {
        formobject.elements[i].value = "";                            // 画面フォームオブジェクトのvalueをクリア
      }

      $R.log("View clearDataValue : end");
    }
    // validationJsonのformat情報をコピーする
   ,copyFormat: function(validationjson) {
      $R.log("View copyFormat : start");

      if (!validationjson["records"]) return;
      var records = validationjson["records"];
      var maxlength = records.length;
      var record, i;
      for (i = 0; i < maxlength; i++) {
        record = records[i]["record"];
        for (name in record) {
          if (record[name]["format"]) {
           this.format[name] = record[name]["format"];
          }
        }
      }

      $R.log("View copyFormat : end");
    }
    // ガイドメッセージ表示フラッグ
   ,setGuideMessage: function(value) {
      this.guidemessage = value;
    }
   ,getGuideMessage: function() {
      return this.guidemessage;
    }
  });

  // コントローラクラス
  var Controller = $R.Controller = new Class();
  Controller.fn.appspec          = {};                                // アプリケーション仕様クラス
  Controller.fn.model            = {};                                // Modelクラス
  Controller.fn.view             = {};                                // Viewクラス
  Controller.fn.event            = {};                                // Eventクラス
  Controller.fn.tablerowevent    = {};                                // TableRowEventクラス
  Controller.fn.tableobjectevent = {};                                // TableObjEventクラス
  Controller.fn.event            = {};                                // Eventクラス
  Controller.fn.pubsub           = {};                                // PubSubクラス
  Controller.include({
    initialSetting: function() {
      $R.log("Controller initialSetting : start");

      if (this.appspec.enterTabPFKey) {
        this.setEnterTabPFKey(this.appspec.enterTabPFKey);
      }
      if (this.appspec.navButtonEvent) {
        this.setSelectorEvent(this.appspec.navButtonEvent, "navbutton");
      }
      if (this.appspec.validationEvent) {
        this.setSelectorEvent(this.appspec.validationEvent, "validation");
      }
      if (this.appspec.selectorEvent) {
        this.setSelectorEvent(this.appspec.selectorEvent, "selector");
      }
      if (this.appspec.pubsubCheckEvent) {
        this.setPubSubEvent(this.appspec.pubsubCheckEvent);
      }
      if (this.appspec.pubsubDeriveEvent) {
        this.setPubSubEvent(this.appspec.pubsubDeriveEvent);
      }
      if (this.appspec.pubsubOtherEvent) {
        this.setPubSubEvent(this.appspec.pubsubOtherEvent);
      }

      // Dataset Jsonの同期処理
      this.synchroCheckDataset();

      // ブラウザ戻るボタンを無効にする
      this.setBrowserBackBotton(this);

      $R.log("Controller initialSetting : end");
    }
    // ナビゲーションボタンイベントを設定し、コールバック関数を指定する
   ,setSelectorEvent: function(selectorEvent, name) {
      $R.log("Controller setSelectorEvent : start");

      var event = this.event[name] = new Event();              // イベントクラスを作成する
      event.setEvent(this, selectorEvent);

      $R.log("Controller setSelectorEvent : end");
    }
    // PubSubイベントクラスを設定する
   ,createPubSubEvent: function() {
      $R.log("Controller createPubSubEvent : start");

      this.pubsub = new PubSub();                                     // PubSubクラスを作成する
      this.pubsub.subscribe(this.pubsubRmenuEvent);

      $R.log("Controller createPubSubEvent : end");
    }
    // チェック用PubSubイベントを設定し、コールバック関数を指定する
   ,setPubSubEvent: function(pubsubEvent) {
      $R.log("Controller setPubSubEvent : start");

      this.pubsub.subscribe(pubsubEvent);

      $R.log("Controller setPubSubEvent : end");
    }
    // ブラウザ戻るボタンを無効にする
    ,setBrowserBackBotton: function(self) {
      $R.log("Controller setBrowserBackBotton : start");

      history.pushState(null, null, null);
      $(window).on("popstate", function(event) {
        self.onBrowserBackBotton(event);
      })

      $R.log("Controller setBrowserBackBotton : end");
    }
  });
}(jQuery));
