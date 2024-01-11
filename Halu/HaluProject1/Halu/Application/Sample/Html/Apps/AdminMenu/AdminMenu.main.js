//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.AdminMenu;
  var appspec = new app.AppSpec("AdminMenu");
  appspec.initialSetting(app);
});
