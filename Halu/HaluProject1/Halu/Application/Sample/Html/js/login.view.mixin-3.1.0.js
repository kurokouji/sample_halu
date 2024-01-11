/* ************************************************************************* */
/*  ログインパターン                                                          */
/*  ビューミックスイン                                                        */
/*  2017/09/17 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.LoginViewMixin = {
    // ------------------------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------------------------
    initExecute: function() {
      $R.log("View initExecute : start");

      this.initAlertDialog();        // 警告メッセージ用ダイアログ 初期処理
      this.initConfirmDialog(this);  // 確認メッセージ用ダイアログ 初期処理
      this.initExecuteDialog(this);  // 実行確認メッセージ用ダイアログ 初期処理
      this.initServerDialog(this);   // サーバ確認メッセージ用ダイアログ 初期処理

      $R.log("View initExecute : end");
    }

    // ------------------------------------------------------------------------
    // ボタン・ファンクションキー イベント処理
    // ------------------------------------------------------------------------
    ,onクリア: function(event) {
      $R.log("View onクリア : start");

      // 画面の最初の項目にフォーカスを当てる
      $("#ログインＩＤ").focus();

      $R.log("View onクリア : end");
    }

    // ------------------------------------------------------------------------
    //  レスポンスデータ編集処理
    // ------------------------------------------------------------------------
    ,on初期処理OfEditResponseData: function(responseData, arg) {
      $R.log("View on初期処理OfEditResponseData : start");

      //  ＣＳＳファイルをロードする
      var cssName = arg["ＣＳＳファイル名"];
      if (cssName != "") {
        var arg = {cssName: cssName};
        this.appendCSS(arg);
      }
      $('body').fadeIn("normal");
      // 画面の最初の項目にフォーカスを当てる
      $("#ログインＩＤ").focus();

      $R.log("View on初期処理OfEditResponseData : end");
    }

  };
}(jQuery, Rmenu));
