//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.ThemeListMainte;
  var appspec = new app.AppSpec("ThemeListMainte");
  appspec.initialSetting(app);
});
