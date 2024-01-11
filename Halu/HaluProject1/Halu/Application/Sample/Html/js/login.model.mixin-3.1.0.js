/* ************************************************************************* */
/*  ログインパターン                                                          */
/*  モデルミックスイン                                                        */
/*  2017/09/17 tadashi shimoji                                               */
/* ************************************************************************* */

(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.LoginModelMixin = {
    // --------
    // 処理開始
    // --------
    initExecute: function() {
      $R.log("Model initExecute : start");

      $R.log("Model initExecute : end");
    }

    // ------------------------------------------------------------------------
    //  レスポンスデータ編集処理
    // ------------------------------------------------------------------------
    ,on初期処理OfEditResponseData: function(responseData) {
      $R.log("Model on初期処理OfEditResponseData : start");

      // ＣＳＳファイル情報をセッションストレージに格納する
      // セッションデータに識別名を設定する
      var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, "header");
      var cssName        = responseRecord["record"]["ＣＳＳファイル名"]["value"][0];

      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      if (cssName != "") {
        sessionStorage.saveItem("ＣＳＳファイル名", this.appspec.sysname + "/Html/css/" + cssName + ".css");
        var arg = {ＣＳＳファイル名: this.appspec.sysname + "/Html/css/" + cssName + ".css"};
      }
      else {
        sessionStorage.saveItem("ＣＳＳファイル名", "");
        var arg = {ＣＳＳファイル名: ""};
      }

      $R.log("Model on初期処理OfEditResponseData : end");
      return arg;
    }
    ,onチェックOfEditResponseData: function(responseData) {
      $R.log("Model onチェックOfEditResponseData : start");

      // ユーザ情報をセッションストレージに格納する
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + ".Login");

      // セッションデータに項目データを設定する
      var responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, "header");
      var userid   = responseRecord["record"]["ユーザＩＤ"]["value"][0];
      var username = responseRecord["record"]["ユーザ名称"]["value"][0];
      var menuname = responseRecord["record"]["メニュー名"]["value"][0];
      var cssname  = responseRecord["record"]["ＣＳＳファイル名"]["value"][0];
      var date     = new Date();
      var datetime = date.getFullYear()    + "/"
                   + (date.getMonth() + 1) + "/"
                   + date.getDate()        + " "
                   + date.getHours()       + ":"
                   + date.getMinutes();

      sessionStorage.saveItem("ユーザＩＤ", userid);
      sessionStorage.saveItem("ユーザ名称", username);
      sessionStorage.saveItem("メニュー名", menuname);
      sessionStorage.saveItem("ログイン時刻", datetime);

      var weekday = ["日", "月", "火", "水", "木", "金", "土"] ;
      var wday    = "（" + weekday[date.getDay()] + "）" ;

      // 西暦⇒和暦
      var w_和暦年 = date.getFullYear() - 2018;
      if (w_和暦年 == 1) {
        w_和暦年 = "元"
      }

      var jdate = "令和" + w_和暦年 + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + wday;
      sessionStorage.saveItem("ログイン和暦", jdate);
      
      // 表示メニューを設定する
      if (menuname != "") {
        this.appspec.nextname = menuname;
      }

      // ログインユーザ専用ＣＳＳファイル名をセッションストレージに格納する
      if (cssname != "") {
        sessionStorage.saveItem("ＣＳＳファイル名", this.appspec.sysname + "/Html/css/" + cssname + ".css");
      }

      $R.log("Model onチェックOfEditResponseData : end");
    }

  };
}(jQuery, Rmenu));
