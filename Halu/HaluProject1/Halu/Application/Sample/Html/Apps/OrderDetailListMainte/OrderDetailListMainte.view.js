(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.OrderDetailListMainte;

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
      if (mode == "insert") {
        $("#実行").hide();
        $("input").prop('disabled', true);
        $("select").prop('disabled', true);
      }

      $R.log("View set項目制御 : end");
    }
    // ------------------------------------------------------
    // 導出項目編集用カスタムイベント処理
    // ------------------------------------------------------
    ,set受注金額: function(arg1) {
      $R.log("View set受注金額 : start");

      var row = arg1["row"];
      var w_金額 = this.formatExecute["money"]["format"](arg1["受注金額"]);
      $($(".受注金額")[row]).val(w_金額);

      $R.log("View set受注金額 : end");
    }
    ,set合計金額: function(arg1) {
      $R.log("View set合計金額 : start");

      var w_合計金額 = this.formatExecute["money"]["format"](arg1["合計金額"]);
      $("#合計金額").val(w_合計金額);

      $R.log("View set合計金額 : end");
    }
  });
}(jQuery, Rmenu));