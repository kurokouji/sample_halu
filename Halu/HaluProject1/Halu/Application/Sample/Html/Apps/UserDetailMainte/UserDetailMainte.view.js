(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.UserDetailMainte;

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

  // マスターメンテパターンミックスインを追加する
  View.include($R.Library.DataMainteViewMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  View.include({
    // ------------------------------------------------------
    //  項目の活性・非活性を設定
    // ------------------------------------------------------
    set項目制御: function(mode) {
      $R.log("View set項目制御 : start");

      // モードに応じて項目の活性・非活性をセット
      if (mode == "select" || mode == "delete") {
        $("input").prop('disabled', true);
        $("select").prop('disabled', true);
      }

      $R.log("View set項目制御 : end");
    }

  });

}(jQuery, Rmenu));