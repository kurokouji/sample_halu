//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.OrderDetailListMainte;
  var appspec = new app.AppSpec("OrderDetailListMainte");
  appspec.initialSetting(app);
});
