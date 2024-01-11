(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.ThemeListMainte;

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

  // 基本名称メンテパターンミックスインを追加する
  Controller.include($R.Library.BaseDataMainteControllerMixin);

  // ----------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // ----------------------------------------------------------
  Controller.include({
    // --------------------------------------------------------
    // テーブル行クリック処理処理
    // --------------------------------------------------------
    on使用行クリック: function(event, arg) {
      $R.log("Controller on使用行クリック : start");

      var row  = event.currentTarget.parentNode.parentNode.rowIndex;
      var arg  = {クリック行: row};
      var arg9 = this.model.on使用行クリック(arg);
      this.view.on使用行クリック(arg9);

      $R.log("Controller on使用行クリック : end");
    }

    // --------------------------------------------------------
    //  リクエストデータチェック処理
    // --------------------------------------------------------
    ,on実行OfCheckRequestData: function(requestData, mode) {
      $R.log("Controller on実行OfCheckRequestData : start");

      var status = this.model.on実行OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $R.log("Controller on実行OfCheckRequestData : end");
      return status;
    }

  });

}(jQuery, Rmenu));