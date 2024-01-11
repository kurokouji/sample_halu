(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.OrderDetailListMainte;

  // インスタンスプロパティを追加する
  var Controller = App.Controller = new $R.Class($R.Controller);
  Controller.fn.init = function(appspec, model, view) {
    $R.log("Controllerr init : start");

    this.appspec = appspec;
    this.model   = model;
    this.view    = view;
    this.createPubSubEvent();

    $R.log("Controllerr init : end");
  };

  // 共通モジュールを追加する
  Controller.include($R.Library.EnterTabPFKeyMixin);
  Controller.include($R.Library.ControllerMixin);

  // マスターメンテパターンミックスインを追加する
  Controller.include($R.Library.DataMainteControllerMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Controller.include({
    // ------------------------------------------------------------------------
    // 初期処理
    // ------------------------------------------------------------------------
    on初期処理: function() {
      $R.log("Controller on初期処理 : start");

      // 処理モードを取得する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var mode = sessionStorage.loadItem("処理モード");
      if (mode == undefined) {
        var mode = "insert";
        sessionStorage.saveItem("処理モード", "insert");
      }

      // 初期処理
      var arg = this.model.on初期処理();
      this.view.on初期処理(arg);

      if (mode != "insert") {
        // 初期処理：前画面の引き継ぎデータをデータセットに設定する
        var status1 = this.model.setFromBeforeStorageDataToDataset();
        if (status1 == "OK") {
          var dataSet = this.model.dataset.getData();
          this.view.fromJsonDataToView(dataSet);
        }
      }

      // 新規の時：キー無し新規以外の時：キーが設定される
      this.ajaxExecute("select");
      // 項目の活性・非活性をセットする
      this.view.set項目制御(mode);

      $R.log("Controller on初期処理 : end");
    }
    // ------------------------------------------------------
    // チェンジ イベント処理（追加処理）
    // ------------------------------------------------------
    ,onChange削除: function(event) {
      $R.log("Controller onChange削除 : start");

      var row = event.currentTarget.parentNode.parentNode.rowIndex;
      this.model.onChangeTableCheckBox(event, row, this.appspec.checkboxDetail);

      // 削除行の金額は後継に加算しない
      var arg1 = this.model.calc合計金額();
      if (arg1["status"] == "OK") {
        this.view.set合計金額(arg1);
      }

      $R.log("Controller onChange削除 : end");
    }
    // ------------------------------------------------------
    // 導出項目編集用カスタムイベント処理
    // ------------------------------------------------------
    ,onDerive数量単価: function(arg) {
      $R.log("Controller onDerive数量単価 : start");

      var arg1 = this.model.calc受注金額(arg);
      if (arg1["status"] == "OK") {
        this.view.set受注金額(arg1);
      }
      var arg2 = this.model.calc合計金額();
      this.view.set合計金額(arg2);

      $R.log("Controller onDerive数量単価 : end");
    }

  });
}(jQuery, Rmenu));