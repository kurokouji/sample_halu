//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.Login;
  var appspec = new app.AppSpec("Login");
  appspec.initialSetting(app);
});
