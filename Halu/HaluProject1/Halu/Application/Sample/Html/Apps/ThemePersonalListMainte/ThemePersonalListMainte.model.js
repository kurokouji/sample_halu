(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.ThemePersonalListMainte;

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

  // 基本名称メンテパターンミックスインを追加する
  Model.include($R.Library.BaseDataMainteModelMixin);

  // ----------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // ----------------------------------------------------------
  Model.include({
    // --------------------------------------------------------
    //  テーブルの選択行をセッションストレージに格納する
    // --------------------------------------------------------
    on使用行クリック: function(arg) {
      $R.log("Model on使用行クリック : start");

      var clickRow  = arg["クリック行"];

      var dataSet    = this.dataset.getData();
      var headerInfo = this.appspec.getJSONChunkByIdAtRecords(dataSet, "header");
      var detailInfo = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail");
      var maxSize    = detailInfo["record"]["使用"]["value"].length;

      for (var i = 0; i < maxSize; i++) {
        detailInfo["record"]["使用"]["value"][i] = "";
      }
      detailInfo["record"]["使用"]["value"][clickRow] = "1";

      var w_選択テーマコード = detailInfo["record"]["テーマコード"]["value"][clickRow];
      headerInfo["record"]["選択テーマコード"]["value"][0] =w_選択テーマコード;

      var arg9        = {};
      arg9["cssName"] = w_選択テーマコード;

      $R.log("Model on使用行クリック : end");
      return arg9;
    }

  });

}(jQuery, Rmenu));