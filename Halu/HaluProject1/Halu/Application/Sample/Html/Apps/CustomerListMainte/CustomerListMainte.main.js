//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.CustomerListMainte;
  var appspec = new app.AppSpec("CustomerListMainte");
  appspec.initialSetting(app);
});
