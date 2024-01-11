(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.UserList;

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

  // マスター一覧パターンミックスインを追加する
  View.include($R.Library.DataMainteListViewMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加するs
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  View.include({

  });


}(jQuery, Rmenu));