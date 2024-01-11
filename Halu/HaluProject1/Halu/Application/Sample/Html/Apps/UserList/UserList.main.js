//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.UserList;
  var appspec = new app.AppSpec("UserList");
  appspec.initialSetting(app);
});
