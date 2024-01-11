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
  $R.Version = "0.0.1";

  // 実行モード
  //$R.LogMode = "";
  $R.LogMode = "DEBUG";

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
          $(selector).on(event, function(e){
            var fnc = "self." + callback + "(e)";
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
      $(selector).off(event);
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
        $.getJSON(url, function(result) {
          Dataset.fn.data    = result;                                // dataset json
          Dataset.fn.synchro = true;                                  // 同期フラッグ：真
        });
      }

      $R.log("Dataset getDatasetJSON : end");
    }
    // value値をクリア
   ,clearDataValue: function() {
      $R.log("Dataset clearDataValue : start");

      var records   = this.data["records"];
      var maxrecord = records.length;
      var record, name, objNodeList, obj, defaultline, i, j;
      for (i = 0; i < maxrecord; i++) {
        defaultline = 1;
        if (records[i]["multiline"] == "yes") {
          defaultline = parseInt(records[i]["defaultline"]);
        }
        record = records[i]["record"];
        for (name in record) {
          objNodeList  = document.getElementsByName(name);
          obj          = objNodeList.item(0);
          if (obj) {
            type = obj.type;
            for (j = 0; j < defaultline; j++) {
              switch (type) {
                case "checkbox":
                  record[name]["value"][j] = "0";
                  break;
                case "radio":
                  record[name]["value"][j] = "0";
                  break;
                default:
                  record[name]["value"][j] = "";
                  break;
              }
            }
          }
          else {
            for (j = 0; j < defaultline; j++) {
              record[name]["value"][j] = "";
            }
          }
        }
      }

      $R.log("Dataset clearDataValue : end");
    }
    // レスポンスデータからvalue値をクリアする
   ,clearResponseValue: function(responseData) {
      $R.log("Dataset clearResponseValue : start");

      if (!responseData["records"]) return;
      var responseRecords = responseData["records"];
      var responselength  = responseRecords.length;
      var datasetRecords  = this.data["records"];
      var datasetlength   = datasetRecords.length;
      var responseRecord, name, idname, datasetRecord;
      var defaultline, i, j, k;
      for (i = 0; i < responselength; i++) {
        idname = responseRecords[i]["id"];
        for (j = 0; j < datasetlength; j++) {
          responseRecord = responseRecords[i]["record"];

          if (idname != datasetRecords[j]["id"]) continue;
          datasetRecord  = datasetRecords[j]["record"];
          defaultline    = 1;
          if (datasetRecords[j]["multiline"] == "yes") {
            defaultline = parseInt(datasetRecords[j]["defaultline"]);
          }
          for (name in responseRecord) {
            if (name in datasetRecord) {
              for (k = 0; k < defaultline; k++) {
                datasetRecord[name]["value"][k] = "";
              }
            }
          }
          break;
        }
      }

      $R.log("Dataset clearResponseValue : end");
    }
    // レスポンスデータからvalue値を設定する
   ,setResponseValue: function(responseData, pubsub) {
      $R.log("Dataset setResponseValue : start");

      if (!responseData["records"]) return;

      var responseRecords = responseData["records"];
      var responselength  = responseRecords.length;
      var datasetRecords  = this.data["records"];
      var datasetlength   = datasetRecords.length;
      var responseRecord, name, idname, datasetRecord;
      var eventname, values, valuelength, target, arg, i, j, k;
      for (i = 0; i < responselength; i++) {
        idname = responseRecords[i]["id"];
        for (j = 0; j < datasetlength; j++) {
          if (idname != datasetRecords[j]["id"]) continue;
          responseRecord = responseRecords[i]["record"];
          datasetRecord  = datasetRecords[j]["record"];
          for (name in responseRecord) {
            if (name in datasetRecord) {
              values = responseRecord[name]["value"];
              valuelength = values.length;
              for (k = 0; k < valuelength; k++) {
                datasetRecord[name]["value"][k] = values[k];
                eventname = "derive" + name;
                if (pubsub.isEvent(eventname)) {
                  target = this.getElementObject(name, k);
                  arg = {target: target, value: values[k], row: k};
                  pubsub.publish(eventname, arg);
                }
              }
            }
          }
        }
      }

      $R.log("Dataset setResponseValue : end");
    }
    // 指定ＩＤデータ（レコード）のvalue値をクリアする
   ,clearIDValue: function(idName) {
      $R.log("Dataset clearIDValue : start");

      var datasetRecords  = this.data["records"];
      var datasetlength   = datasetRecords.length;
      var name, datasetRecord, j;
      for (j = 0; j < datasetlength; j++) {
        if (idName != datasetRecords[j]["id"]) continue;
        datasetRecord  = datasetRecords[j]["record"];
        for (name in datasetRecord) {
          var tempArray = [""];
          datasetRecord[name]["value"] = tempArray;
        }
        break;
      }

      $R.log("Dataset clearIDValue : end");
    }
    // 指定ＩＤデータ（レコード）からvalue値を設定する
   ,setIDValue: function(idName, idValue) {
      $R.log("Dataset setIDValue : start");

      if (!idValue["record"]) return;

      // 最初に値をクリアする
      this.clearIDValue(idName);

      var datasetRecords  = this.data["records"];
      var datasetlength   = datasetRecords.length;
      var name, datasetRecord;
      var values, valuelength, j, k;
      for (j = 0; j < datasetlength; j++) {
        if (idName != datasetRecords[j]["id"]) continue;
        datasetRecord  = datasetRecords[j]["record"];
        for (name in idValue["record"]) {
          if (name in datasetRecord) {
            values = idValue["record"][name]["value"];
            valuelength = values.length;
            for (k = 0; k < valuelength; k++) {
              datasetRecord[name]["value"][k] = values[k];
            }
          }
        }
        break;
      }

      $R.log("Dataset setIDValue : end");
    }
    // formオブジェクトの順番をクリアする
   ,clearFormElementNo: function() {
      $R.log("Dataset clearFormElementNo : start");

      var records   = this.data["records"];
      var maxrecord = records.length;
      var record, name, i;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        for (name in record) {
          record[name]["idx"]   = [];
        }
      }

      $R.log("Dataset clearFormElementNo : end");
    }
    // formオブジェクトの順番を設定する
   ,setFormElementNo: function() {
      $R.log("Dataset setFormElementNo : start");

      var formobject = document.forms[this.formno];             //フォームオブジェクトを取得する
      var maxelement = formobject.length;
      var records    = this.data["records"];
      var maxrecord  = records.length;
      var record, name, idxlength, i, j;
      for (i = 0; i < maxelement; i++) {
        name = formobject.elements[i].name;
        if (!name) {
          continue;
        }
        for (j = 0; j < maxrecord; j++) {
          record = records[j]["record"];
          if (name in record) {
            if (record[name]["idx"][0] == "") {
              record[name]["idx"][0] = i;
            }
            else {
              record[name]["idx"].push(i);
            }
            break;
          }
        }
      }

      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        for (name in record) {
          this.elementno[name] = [];
          idxlength = record[name]["idx"].length;
          for (j = 0; j < idxlength; j++) {
            this.elementno[name][j] = record[name]["idx"][j];   // element番号を設定する
          }
        }
      }

      $R.log("Dataset setFormElementNo : end");
    }
    // 要素番号を取得する
   ,getElementNo: function(name, row) {
      $R.log("Dataset getElementNo : start");

      if (!(name in this.elementno)) return "";

      if (arguments.length == 1) return this.elementno[name][0];
      return this.elementno[name][row];

      $R.log("Dataset getElementNo : end");
    }
   ,getElementObject: function(name, row) {
      $R.log("Dataset getElementObject : start");

      var element    = this.elementno[name];
      if (!element) {
        return element;
      }
      var formobject = document.forms[this.formno];
      if (arguments.length == 1) return formobject.elements[element[0]];
      return formobject.elements[element[row]];

      $R.log("Dataset getElementObject : end");
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
   ,setElementValue: function(value, name) {
      var records   = this.data["records"];
      var maxrecord = records.length;
      var record, i;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        if (!(name in record)) continue;

        record[name]["value"] = value;
        return value;
      }
      return "";
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
        $.getJSON(url, function(result) {
          Validation.fn.data    = result;                               // validation json
          Validation.fn.synchro = true;                                 // 同期フラッグ：真
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
       return false;

      $R.log("Validation getTargetRule : end");
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
      return "no";

      $R.log("Validation getTargetMultline : end");
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
      this.mode     = callback[0];                          // モード
      this.request  = callback[1];                          // リクエスト前処理関数
      this.response = callback[2];                          // レスポンス処理関数
      this.error    = callback[3];                          // エラー処理関数

      $R.log("Transaction setTranCallback : end");
    }
    // リクエストデータのvalue値をクリアする
   ,clearDataValue: function() {
      $R.log("Transaction clearDataValue : start");

      if (!this.data["request"]["records"]) return;
      var records    = this.data["request"]["records"];
      var maxrecord  = records.length;
      var record, name, i;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        for (name in record) {
          record[name]["value"] = [""];
        }
      }

      $R.log("Transaction clearDataValue : end");
    }
    // データセットからリクエストデータのvalue値を設定する
   ,setDataValue: function(dataset) {
      $R.log("Transaction setDataValue : start");

      if (!this.data["request"]["records"]) return;
      var requestRecords = this.data["request"]["records"];
      var requestlength  = requestRecords.length;
      var datasetRecords = dataset.data["records"];
      var datasetlength  = datasetRecords.length;
      var requestRecord, name, idname, datasetRecord, valuelength, i, j, k;
      for (i = 0; i < requestlength; i++) {
        idname = requestRecords[i]["id"];
        for (j = 0; j < datasetlength; j++) {
          if (idname != datasetRecords[j]["id"]) continue;
          requestRecord = requestRecords[i]["record"];
          datasetRecord = datasetRecords[j]["record"];
          valuelength   = this.setValueLength(datasetRecords[j]);
          for (name in requestRecord) {
            if (name in datasetRecord) {
              for (k = 0; k < valuelength; k++) {
               requestRecord[name]["value"][k] = datasetRecord[name]["value"][k];
              }
            }
          }
          break;
        }
      }

      $R.log("Transaction setDataValue : end");
    }
   ,setValueLength: function(datasetRecords) {
      $R.log("Transaction setValueLength : start");

      if (datasetRecords["multiline"] == "no") return 1;

      var defaultline, i;
      defaultline = parseInt(datasetRecords["defaultline"]) - 1;
      for (i = defaultline; i >= 0; i--) {
        for (name in datasetRecords["record"]) {
          if (datasetRecords["record"][name]["value"][i] == "") continue;
          return i + 1;
        }
      }
      return 1;

      $R.log("Transaction setValueLength : end");
    }
    // リクエストデータを送信する
   ,ajax: function(self) {
      $R.log("Transaction ajax : start" + " mode=" + mode);

      var mode         = this.mode;                                         // モード
      var request      = "self."+ this.request;                   // リクエスト前処理関数
      var responseFnc  = "self."+ this.response + "(data, mode)"; // レスポンス処理関数
      var errorFnc     = "self."+ this.error + "(data, mode)";    // エラー処理関数
      var connectError = "self."+ "connectError";                           // サーバ接続エラー関数
      var reqData      = this.data["request"];                              // リクエストデータ
      var requestFnc = request + "(reqData, mode)";
      if (!eval(requestFnc)) return;

      var tranSelf    = this;
      var requestData = JSON.stringify(reqData);
      $.ajax({
         url:         $R.MainRackURL
        ,type:        "POST"
        ,data:        "data=" + requestData
        ,dataType:    "json"
        ,success:     function(data) {
           var status  = data["message"]["status"];
           if (status == "OK") {
             tranSelf.setResponseValue(data, tranSelf.data);
             $.proxy(eval(responseFnc), self);
           }
           else {
             $.proxy(eval(errorFnc), self);
           }
         }
        ,error: $.proxy(eval(connectError), self)
      });

      $R.log("Transaction ajax : end");
    }
    // ajaxの結果データからトランザクションリクエストデータのvalue値を設定する
   ,setResponseValue: function(data, tranData) {
      $R.log("Transaction setResponseValue : start");

      if (!data["records"]) return;
      var requestRecords = tranData["response"]["records"];
      var requestlength  = requestRecords.length;
      var datasetRecords = data["records"];
      var datasetlength  = datasetRecords.length;
      var requestRecord, name, idname, datasetRecord, valuelength, i, j, k;
      for (i = 0; i < requestlength; i++) {
        idname = requestRecords[i]["id"];
        for (j = 0; j < datasetlength; j++) {
          if (idname != datasetRecords[j]["id"]) continue;
          requestRecord = requestRecords[i]["record"];
          datasetRecord = datasetRecords[j]["record"];
          valuelength   = this.setValueLength(datasetRecords[j]);
          for (name in requestRecord) {
            if (name in datasetRecord) {
              for (k = 0; k < valuelength; k++) {
               requestRecord[name]["value"][k] = datasetRecord[name]["value"][k];
              }
            }
          }
          break;
        }
      }

      $R.log("Transaction setResponseValue : end");
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
   ,getTranJsons: function(appspec) {
      $R.log("TranControll getTranJsons : start");

      var recursive = {
        execute: function(callbackArray, urlArray) {
          var callback = callbackArray.shift();
          var url      = urlArray.shift();
          var mode     = callback[0];
          $.ajax({
             url:      url
            ,type:     "GET"
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
        recursive.execute(callbackArray, urlArray);
      }

      $R.log("TranControll getTranJsons : end");
    }
    // getter
   ,getTransaction: function(mode) {
      return this.trans[mode];
    }
  });

  // アプリケーション仕様クラス
  var AppSpec = $R.AppSpec = new Class();
  AppSpec.fn.name;                                                    // プログラム名
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
          $R.RmenuRackURL    = urlArray[0] + "//" + urlArray[2] + "/RmenuRack/";
          $R.MainRackURL     = urlArray[0] + "//" + urlArray[2] + "/RmenuRack/RmenuMain.rb";
          $R.HtmlRackURL     = urlArray[0] + "//" + urlArray[2] + "/RmenuRack/RmenuHtml.rb";
          $R.DownloadRackURL = urlArray[0] + "//" + urlArray[2] + "/RmenuRack/RmenuDownload.rb";
          $R.PdfURL          = urlArray[0] + "//" + urlArray[2] + "/System/Html/pdf/pdfpool/";
          break;
        case "RmenuRack":
          $R.SystemURL       = urlArray[0] + "//" + urlArray[2] + "/System/";
          $R.ApplicationURL  = urlArray[0] + "//" + urlArray[2] + "/Application/";
          $R.RmenuRackURL    = urlArray[0] + "//" + urlArray[2] + "/RmenuRack/";
          $R.MainRackURL     = urlArray[0] + "//" + urlArray[2] + "/RmenuRack/RmenuMain.rb";
          $R.HtmlRackURL     = urlArray[0] + "//" + urlArray[2] + "/RmenuRack/RmenuHtml.rb";
          $R.DownloadRackURL = urlArray[0] + "//" + urlArray[2] + "/RmenuRack/RmenuDownload.rb";
          $R.PdfURL          = urlArray[0] + "//" + urlArray[2] + "/System/Html/pdf/pdfpool/";
          break;
        default:
          $R.SystemURL       = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/System/";
          $R.ApplicationURL  = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/Application/";
          $R.RmenuRackURL    = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/RmenuRack/";
          $R.MainRackURL     = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/RmenuRack/RmenuMain.rb";
          $R.HtmlRackURL     = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/RmenuRack/RmenuHtml.rb";
          $R.DownloadRackURL = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/RmenuRack/RmenuDownload.rb";
          $R.PdfURL          = urlArray[0] + "//" + urlArray[2] + "/" + urlArray[3] + "/System/Html/pdf/pdfpool/";
          break;
      }

      //this.setFormNo();                                             // FormNoを設定する
      this.formno    = 0;                                             // 2013.05.28 shimoji
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
      var i, type;
      for (i = 0; i < maxelement; i++) {
        type = formobject.elements[i].type;
        switch (type) {
          case "checkbox":
            $(formobject.elements[i]).attr("checked",false).checkboxradio("refresh");
            break;
          case "radio":
            $(formobject.elements[i]).attr("checked",false).checkboxradio("refresh");
            break;
          default:
            formobject.elements[i].value = "";
            break;
        }
      }

      $R.log("View clearDataValue : end");
    }
    // レスポンスデータからform要素の値をクリアする
   ,clearResponseValue: function(responseData) {
      $R.log("View clearResponseValue : start");

      if (!responseData["records"]) return;
      var formobject = document.forms[this.appspec.formno];      //フォームオブジェクトを取得する
      var records    = responseData["records"];
      var maxrecord  = records.length;
      var record, name, elemenlength, element;
      var type, rule, arg, i, j;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        for (name in record) {
          element   = this.elementno[name];
          if (element) {
            elementlength = element.length;
            for (j = 0; j < elementlength; j++) {
              type = formobject.elements[element[j]].type;
              switch (type) {
                case "checkbox":
                  //$(formobject.elements[element[j]]).attr("checked",false).checkboxradio("refresh");
                  break;
                case "radio":
                  //formobject.elements[element[j]].value = "";
                  break;
                default:
                  formobject.elements[element[j]].value = "";
                  break;
              }
            }
          }
        }
      }

      $R.log("View clearResponseValue : end");
    }
    // レスポンスデータからform要素に値を設定する
   ,setResponseValue: function(responseData) {
      $R.log("View setResponseValue : start");

      if (!responseData["records"]) return;
      var setValue = {
        execute: function(obj, value) {
          switch (obj.type) {
            case "checkbox":
              if (value == 1) {
                $(obj).attr("checked",true).checkboxradio("refresh"); 
              }
              else {
                $(obj).attr("checked",false).checkboxradio("refresh"); 
              }
              break;
            case "radio":
              //obj.value = value;
              break;
            default:
              obj.value = value;
              break;
          }
        }
      };

      var formobject = document.forms[this.appspec.formno];      //フォームオブジェクトを取得する
      var records    = responseData["records"];
      var maxrecord  = records.length;
      var record, name, values, value, valuelength, element;
      var rule, arg, i, j;
      for (i = 0; i < maxrecord; i++) {
        record = records[i]["record"];
        for (name in record) {
          values      = record[name]["value"];
          valuelength = values.length;
          element     = this.elementno[name];
          if (element) {
            if (element.length > 0) {
              for (j = 0; j < valuelength; j++) {
                if (name in this.format) {
                  if (this.pubsub.isEvent("dataformat")) {
                    value = values[j];
                    rule  = this.format[name];
                    arg   = {value: value, rule: rule};
                    value = this.pubsub.publish("dataformat", arg);
                    //formobject.elements[element[j]].value = value;
                    setValue.execute(formobject.elements[element[j]], value);
                  }
                  else {
                    //formobject.elements[element[j]].value = values[j];
                    setValue.execute(formobject.elements[element[j]], values[j]);
                  }
                }
                else {
                  //formobject.elements[element[j]].value = values[j];
                  setValue.execute(formobject.elements[element[j]], values[j]);
                }
              }
            }
          }
        }
      }

      $R.log("View setResponseValue : end");
    }
    // formオブジェクトの順番をコピーする
   ,copyFormElementNo: function(formelementno) {
      $R.log("View copyFormElementNo : start");

      var name, idx, maxlength, i;
      for (name in formelementno) {
        idx       = formelementno[name];
        maxlength = idx.length;
        this.elementno[name] = [];
        for (i = 0; i < maxlength; i++) {
          this.elementno[name][i] = idx[i];
        }
      }

      $R.log("View copyFormElementNo : end");
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
  Controller.fn.appspec    = {};                                      // アプリケーション仕様クラス
  Controller.fn.model      = {};                                      // Modelクラス
  Controller.fn.view       = {};                                      // Viewクラス
  Controller.fn.event      = {};                                      // Eventクラス
  Controller.fn.pubsub     = {};                                      // PubSubクラス
  Controller.include({
    initialSetting: function() {
      $R.log("Controller initialSetting : start");

      //if (this.appspec.enterTabPFKey) {
      //  this.setEnterTabPFKey(this.appspec.enterTabPFKey);
      //}
      if (this.appspec.navButtonEvent) {
        this.setSelectorEvent(this.appspec.navButtonEvent, "navbutton");
      }
      if (this.appspec.validationEvent) {
        this.setSelectorEvent(this.appspec.validationEvent, "validation");
      }
      if (this.appspec.boxClickEvent) {
        this.setSelectorEvent(this.appspec.boxClickEvent, "boxClick");
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
  });
  // フォーム管理クラス（複数フォームで構成するアプリを作成する時に使用する）
  var FormControll = $R.FormControll = new Class();
  FormControll.fn.name;
  FormControll.fn.appspec    = {};                                    // アプリケーション仕様クラス
  FormControll.fn.pubsub     = {};                                    // PubSubクラス
  FormControll.include({
    // PubSubイベントを設定し、コールバック関数を指定する             // フォームのshow・hideイベントを設定する
    setPubSubEvent: function(showhideEvent) {
      $R.log("FormControll setPubSubEvent : start");

      this.pubsub = new PubSub();                                     // PubSubクラスを作成する
      this.pubsub.formcontroll = this;                                // PubSubクラスを作成する
      if (arguments.length == 0) {
        showhideEvent = this.showhideEvent;
      }
      this.pubsub.subscribe(showhideEvent);

      $R.log("FormControll setPubSubEvent : end");
    }
  });
}(jQuery));