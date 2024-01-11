//-------------------------------------------------------------
// ドキュメントロード時の初期処理
//-------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.Error404;
  var appspec = new app.AppSpec("Error404");
  appspec.initialSetting(app);
});
