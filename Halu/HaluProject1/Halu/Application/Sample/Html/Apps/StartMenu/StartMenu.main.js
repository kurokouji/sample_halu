//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.StartMenu;
  var appspec = new app.AppSpec("StartMenu");
  appspec.initialSetting(app);
});
