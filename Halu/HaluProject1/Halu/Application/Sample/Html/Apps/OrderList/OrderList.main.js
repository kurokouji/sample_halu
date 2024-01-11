//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Rmenu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Rmenu.Application.OrderList;
  var appspec = new app.AppSpec("OrderList");
  appspec.initialSetting(app);
});
