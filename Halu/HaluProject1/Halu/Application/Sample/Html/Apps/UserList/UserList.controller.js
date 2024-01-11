(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.UserList;

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

  // マスター一覧パターンミックスインを追加する
  Controller.include($R.Library.DataMainteListControllerMixin);

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

      var arg = this.model.on初期処理();
      this.view.on初期処理(arg);

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
        // this.onリロード();
      }

      // 初期処理を実行する
      this.ajaxExecute("init");

      $R.log("Controller on初期処理 : end");
    }

  });

}(jQuery, Rmenu));