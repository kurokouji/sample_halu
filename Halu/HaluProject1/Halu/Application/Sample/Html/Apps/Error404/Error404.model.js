(function($, $R){
  // 名前空間を設定する
  var App = $R.Application.Error404;

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

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Model.include({
    // ------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------
    initExecute: function() {
      $R.log("Model initExecute : start");

      //var dataSet = this.dataset.getData();
      //this.clearDatasetJson(dataSet);
      
      $R.log("Model initExecute : end");
    }

  });

}(jQuery, Rmenu));