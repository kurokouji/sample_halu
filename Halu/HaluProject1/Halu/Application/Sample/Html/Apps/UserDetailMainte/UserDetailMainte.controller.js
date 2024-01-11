(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.UserDetailMainte;

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
    // ------------------------------------------------------
    // 初期処理
    // ------------------------------------------------------
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
      // セレクトボックスの値を取得する
      this.ajaxExecute("init");
      // 項目の活性・非活性をセットする
      this.view.set項目制御(mode);

      $R.log("Controller on初期処理 : end");
    }

    // ------------------------------------------------------
    //  レスポンスデータ編集処理
    // ------------------------------------------------------
    ,on初期処理OfEditResponseData: function(responseData, mode) {
      $R.log("Controller on初期処理OfEditResponseData : start");

      var dataSet = this.model.on初期処理OfEditResponseData(responseData, mode);
      // セレクトボックスの一括初期表示
      this.onShowSelectBoxAll(responseData, this.appspec.selectbox);

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var mode = sessionStorage.loadItem("処理モード");
      // 新規の時：キー無し,新規以外の時：キーが設定される
      if (mode != "insert") {
        this.ajaxExecute("select");
      }

      $R.log("Controller on初期処理OfEditResponseData : end");
    }

  });

}(jQuery, Rmenu));