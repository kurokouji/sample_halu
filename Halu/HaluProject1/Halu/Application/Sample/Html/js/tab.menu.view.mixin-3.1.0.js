/* ************************************************************************* */
/*  アコーディオンメニューパターン                                             */
/*  ビューミックスイン                                                        */
/*  2017/09/17 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.TabMenuViewMixin = {
    // ------------------------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------------------------
    initExecute: function() {
      $R.log("View initExecute : start");

      this.initテンプレートロード();
      this.initAlertDialog();        // 警告メッセージ用ダイアログ 初期処理
      this.initConfirmDialog(this);  // 確認メッセージ用ダイアログ 初期処理
      this.initExecuteDialog(this);  // 実行確認メッセージ用ダイアログ 初期処理
      this.initServerDialog(this);   // サーバ確認メッセージ用ダイアログ 初期処理

      $R.log("View initExecute : end");
    }

    // ------------------------------------------------------------------------
    //  テンプレートをロードする
    // ------------------------------------------------------------------------
    ,initテンプレートロード: function() {
      $R.log("View initテンプレートロード : start");

      // ＣＳＳファイル名をセッションストレージから取得しロードする
      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      var cssName = sessionStorage.loadItem("ＣＳＳファイル名");

      if (cssName) {
        var arg = {cssName: cssName};
        this.appendCSS(arg);
      }

      $('body').fadeIn("normal");

      $R.log("View initテンプレートロード : end");
    }

    // ------------------------------------------------------------------------
    //  ログイン情報を表示する
    // ------------------------------------------------------------------------
    ,setログイン情報: function(arg) {
      $R.log("View setログイン情報 : start");

      $("#ログイン和暦").html(arg["ログイン和暦"]); 
      $("#ログイン日時").html(arg["ログイン時刻"]); 
      $("#ユーザ氏名").html(arg["ユーザ名称"]); 

      $R.log("View setログイン情報 : end");
    }

    // ------------------------------------------------------------------------
    //  メニュータブを開く
    // ------------------------------------------------------------------------
    ,openメニュータブ: function(tabName) {
      $R.log("Model openメニュータブ : start");

      $("#" + tabName).tab('show');
      $("#" + tabName).focus();

      // 20171120 shimoji
      if ( this.appspec.isExists($("#該当ＮＯ")) ) {
        $("#該当ＮＯ").focus();
      }

      $R.log("Model openメニュータブ : end");
    }

  };
}(jQuery, Rmenu));