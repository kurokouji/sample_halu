(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.ModelMixin = {
    onFocus: function(event, row) {
      $R.log("ModelMixin onFocus : start");

      var target = event.target;
      var value  = "";
      if (target.type != "button") {
        value = this.dataset.getElementData(target.name, row);
      }

      $R.log("ModelMixin onFocus name  : " + target.name);
      $R.log("ModelMixin onFocus type  : " + target.type);
      $R.log("ModelMixin onFocus value : " + value);
      $R.log("ModelMixin onFocus row   : " + row);

      $R.log("ModelMixin onFocus : end");
      return value;
    }
   ,onBlur: function(event, row) {
      $R.log("ModelMixin onBlur : start");

      var target = event.target;
      switch (target.type) {
        case "button":
          break;
        case "checkbox":
          if ($(target).is(':checked')) {
            this.dataset.setElementData(1, target.name, row);
          }
          else {
            this.dataset.setElementData(0, target.name, row);
          }
          break;
        case "radio":
          var name  = "input[name=" + target.name + "]:checked";
          var value = $(name).val()
          this.dataset.setElementData(value, target.name, row);
          break;
        default:
          this.dataset.setElementData(target.value, target.name, row);
          break;
      }

      $R.log("ModelMixin onBlur : end");
    }
   ,onBoxClick: function(event) {
      $R.log("ModelMixin onBoxClick : start");

      var target = event.target;
      switch (target.type) {
        case "checkbox":
          if ($(target).is(':checked')) {
            this.dataset.setElementData(1, target.name, 0);
          }
          else {
            this.dataset.setElementData(0, target.name, 0);
          }
          break;
        case "radio":
          var name  = "input[name=" + target.name + "]:checked";
          var value = $(name).val()
          this.dataset.setElementData(value, target.name, 0);
          break;
      }

      $R.log("ModelMixin onBoxClick : end");
    }
  };
  // 画面遷移関数を追加する
  App.HtmlTransitionMixin = {
    // 画面遷移情報をクリアする
    clearTransitionData: function() {
      sessionStorage.removeItem("画面遷移");
    }
    // カレント画面名を画面遷移情報に格納する
   ,setTransitionData: function(htmlName) {
      var newTransition;
      var htmlTransition = sessionStorage.getItem("画面遷移");
      if (htmlTransition) {
        newTransition = htmlTransition + ":" + htmlName;
      }
      else {
        newTransition = htmlName
      }
      sessionStorage.setItem("画面遷移", newTransition);
    }
    // 前画面名を取得する
   ,getBeforeHtmlName: function() {
      var htmlTransition   = sessionStorage.getItem("画面遷移");
      var arrayTransition  = htmlTransition.split(":");
      var max              = arrayTransition.length - 1;
      var stringTransition = arrayTransition[max];
      arrayTransition      = stringTransition.split("/");
      max                  = arrayTransition.length - 1;

      return arrayTransition[max];
    }
    // 前画面名をセッションストレージから削除する
   ,getTransitionData: function() {
      var htmlTransition  = sessionStorage.getItem("画面遷移");
      var arrayTransition = htmlTransition.split(":");
      var max             = arrayTransition.length - 1;
      var htmlName        = arrayTransition[max];
      var newTransition   = "";
      for (var i = 0; i < max; i++) {
         if (i == 0) {
           newTransition = arrayTransition[i];
         }
         else {
           newTransition = newTransition + ":" + arrayTransition[i];
         }
      }
      sessionStorage.setItem("画面遷移", newTransition);
      return htmlName;
    }
    // 前画面に遷移する
   ,previousTransition: function() {
      var htmlName = this.getTransitionData();
      this.postHtmlTransition(htmlName);
    }
    // 表示中の画面を消し、新しい画面を表示する
   ,postHtmlTransition: function(htmlName) {
      var form     = document.createElement("form");
      form.action  = $R.HtmlRackURL;
      form.method  = 'post';
      this.postTransition(form, htmlName);
    }
    // タブを追加し、新しい画面を表示する
   ,postTabTransition: function(htmlName) {
      window.open("", htmlName);

      var form     = document.createElement("form");
      form.action  = $R.HtmlRackURL;
      form.target  = htmlName;
      form.method  = 'post';
      this.postTransition(form, htmlName);
    }
    // ポップアップ画面を表示する
   ,postPopupTransition: function(htmlName, argWin) {
      window.open("", htmlName, argWin);
       
      var form     = document.createElement("form");
      form.action  = $R.HtmlRackURL;
      form.target  = htmlName;
      form.method  = 'post';
      this.postTransition(form, htmlName);
    }
   ,postTransition: function(form, htmlName) {
      var input = document.createElement('input');
      input.setAttribute("type","hidden");
      input.setAttribute("name","gamen");
      input.setAttribute("value",htmlName);
      form.appendChild(input);

      //var body = document.getElementsByTagName("body")[this.appspec.formno];
      var body = document.getElementsByTagName("body")[0];
      body.appendChild(form);
      form.submit();
      body.removeChild(form);
    }
   ,postDownloadRack: function(argHash) {
      var form = document.createElement("form");
      form.action = $R.DownloadRackURL;
      form.method = 'post';

      for (key in argHash) {
        var input = document.createElement('input');
        input.setAttribute("type","hidden");
        input.setAttribute("name",key);
        input.setAttribute("value",argHash[key]);
        form.appendChild(input);
      }
       
      var body = document.getElementsByTagName("body")[0];
      body.appendChild(form);
      form.submit();
      body.removeChild(form);
    }
  };
}(jQuery, Rmenu));