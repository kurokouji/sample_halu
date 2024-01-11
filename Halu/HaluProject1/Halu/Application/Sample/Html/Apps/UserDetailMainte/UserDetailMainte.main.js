//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.UserDetailMainte;
  var appspec = new app.AppSpec("UserDetailMainte");
  appspec.initialSetting(app);
});
