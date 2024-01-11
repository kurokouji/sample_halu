(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // Webソケット通信　関数
  App.WebsocketMixin = {
    // サーバ　ソケットサーバとの通信
    initSocketServer_Server: function (self, serverURL) {
      $R.log("WebsocketMixin initSocketServer_Server start");

      var socketOfServer = new WebSocket(serverURL);
       
      // 通信が接続された場合
      socketOfServer.onopen = function (event) {
        $R.log("WebsocketMixin サーバと接続されました。");
      };
       
      // エラーが発生した場合
      socketOfServer.onerror = function (event) {
        $R.log("WebsocketMixin ソケット通信（サーバ）でエラーが発生しました。");
        $R.log("WebsocketMixin エラー：" + event.data);
      };
       
      // メッセージを受け取った場合
      socketOfServer.onmessage = function (event) {
        $R.log("WebsocketMixin サーバからメッセージを受信しました。");
        self.onMessageSocketOfServer(event.data);
        //var msg = JSON.parse(event.data);
      };
        
      // 通信が切断された場合
      socketOfServer.onclose = function () {
        $R.log("WebsocketMixin サーバ接続（サーバ）が切断されました");
      };

      $R.log("WebsocketMixin initSocketServer_Server end");
      // このオブジェクトを使って、メッセージ送信とクローズを行う
      // メッセージ送信：socketOfServer.send(data);
      // 通信クローズ　：socketOfServer.close();
      return socketOfServer;
    }


    // クライアント　ソケットサーバとの通信
   ,initSocketServer_Client: function(self, clientURL) {
      $R.log("WebsocketMixin initSocketServer_Client start");

      var socketOfClient = new WebSocket(clientURL);
     
      // 通信が接続された場合
      socketOfClient.onopen = function(event) {
        $R.log("WebsocketMixin ");
      };
       
      // エラーが発生した場合
      socketOfClient.onerror = function(event) {
        $R.log("WebsocketMixin ソケット通信（クライアント）でエラーが発生しました。");
        $R.log("WebsocketMixin エラー：" + event.data);
      };
       
      // メッセージを受け取った場合
      socketOfClient.onmessage = function(event) {
        $R.log("WebsocketMixin サーバからメッセージを受信しました。");
        self.onMessageSocketOfClient(event.data);
        //var msg = JSON.parse(event.data);
      };
        
      // 通信が切断された場合
      socketOfClient.onclose = function() {
        $R.log("WebsocketMixin サーバ接続（クライアント）が切断されました");
      };
  
      $R.log("WebsocketMixin initSocketServer_Client end");
      // このオブジェクトを使って、メッセージ送信とクローズを行う
      // メッセージ送信：socketOfClient.send(data);
      // 通信クローズ　：socketOfClient.close();
      return socketOfClient;
    }
 };
}(jQuery, Rmenu));
