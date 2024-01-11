(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.UserDetailMainte;

  // インスタンスプロパティを追加する
  var Model = App.Model = new $R.Class($R.Model);
  Model.fn.init = function(appspec) {
    $R.log("Model init : start");

    this.appspec = appspec;

    $R.log("Model init : end");
  }

  // 共通モジュールを追加する
  Model.include($R.Library.ValidationMixin);
  Model.include($R.Library.ModelMixin);
  Model.include($R.Library.HtmlTransitionMixin);

  // マスターメンテパターンミックスインを追加する
  Model.include($R.Library.DataMainteModelMixin);
  Model.include($R.Library.MemberModelMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Model.include({
    // ------------------------------------------------------
    //  初期処理
    // ------------------------------------------------------
    on初期処理: function() {
      $R.log("Model on初期処理 : start");

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      // 画面のセッションデータの処理モードを設定する(2021/1/28 MK)
      sessionStorage.saveItem("処理モード", "update");

      var mode           = sessionStorage.loadItem("処理モード");
      var beforeHtmlName = this.getBeforeHtmlName();

      var arg = {処理モード: mode, 前画面名: beforeHtmlName};
      this.pubsub.publish("showヘッダータイトル", arg);

      var dataSet = this.dataset.getData();
      arg["データセット"] = dataSet;

      $R.log("Model on初期処理 : end");
      return arg;
    }

  });

}(jQuery, Rmenu));