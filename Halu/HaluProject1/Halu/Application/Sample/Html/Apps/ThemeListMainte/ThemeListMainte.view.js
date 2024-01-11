(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.ThemeListMainte;

  // インスタンスプロパティを追加する
  var View = App.View = new $R.Class($R.View);
  View.fn.init = function(appspec) {
    $R.log("View init : start");

    this.appspec = appspec;

    $R.log("View init : end");
  }

  // 共通モジュールを追加する
  View.include($R.Library.FormatMixin);
  View.include($R.Library.OutlineMixin);
  View.include($R.Library.LoadTemplateMixin);
  View.include($R.Library.ViewMixin);

  // 基本名称メンテパターンミックスインを追加する
  View.include($R.Library.BaseDataMainteViewMixin);

  // ----------------------------------------------------------
  // パターンに含まれない処理を追加する  
  // また、パターン内の処理を変更するときは、オーバライドする
  // ----------------------------------------------------------
  View.include({
    // --------------------------------------------------------
    //  テーブル行クリック処理
    // --------------------------------------------------------
    on使用行クリック: function(arg) {
      $R.log("View on使用行クリック : start");

      var cssName  = this.appspec.sysname + "/Html/css/" + arg["cssName"] + ".css";
      var arg = {cssName: cssName};
      this.appendCSS(arg);

      // ＣＳＳファイル情報をセッションストレージに格納する
      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      sessionStorage.saveItem("ＣＳＳファイル名", cssName);

      $R.log("View on使用行クリック : end");
     }

  });

}(jQuery, Rmenu));