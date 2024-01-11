(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.ThemeListMainte;

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

      var dataset    = this.dataset.getData();
      var detailInfo = this.appspec.getJSONChunkByIdAtRecords(dataset, "detail");
      var maxLines   = detailInfo["record"]["使用"]["value"].length;
      var i;

      for (i = 0; i < maxLines; i++) {
        detailInfo["record"]["使用"]["value"][i] = "";
      }
      detailInfo["record"]["使用"]["value"][clickRow] = "1";

      var arg9        = {};
      arg9["cssName"] = detailInfo["record"]["テーマコード"]["value"][clickRow];

      $R.log("Model on使用行クリック : end");
      return arg9;
    }

    // --------------------------------------------------------
    //  実行前編集処理
    // --------------------------------------------------------
    ,on実行OfCheckRequestData: function(requestData) {
      $R.log("Model on実行OfCheckRequestData : start");

      var dataSet = this.dataset.getData();
      this.setDatasetToJsonRecordsNoDeleteLine(dataSet, requestData);

      $R.log("Model on実行OfCheckRequestData : end");
      return true;
    }

  });

}(jQuery, Rmenu));