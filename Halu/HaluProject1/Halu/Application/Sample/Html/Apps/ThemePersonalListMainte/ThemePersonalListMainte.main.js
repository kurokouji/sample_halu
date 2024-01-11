//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.ThemePersonalListMainte;
  var appspec = new app.AppSpec("ThemePersonalListMainte");
  appspec.initialSetting(app);
});
