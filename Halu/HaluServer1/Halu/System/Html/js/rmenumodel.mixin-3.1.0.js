(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.ModelMixin = {
    onFocus: function(event, row) {
      $R.log("ModelMixin onFocus : start");

      var target = event.target;
      var value  = "";
      
      // 20150722 shimoji
      switch (target.type){
        case "button":
          break;
        case "checkbox":
          break;
        case "radio":
          break;
        case "file":
          break;
        case "select-one":
          break;
        case "select-multiple":
          break;
        default:
          value = this.dataset.getElementData(target.name, row);
          break;
      }

      $R.log("ModelMixin onFocus : end");
      return value;
    }
   ,onBlur: function(event, row) {
      $R.log("ModelMixin onBlur : start");

      var target = event.target;
      
      // 20150722 shimoji
      switch (target.type){
        case "button":
          break;
        case "checkbox":
          break;
        case "radio":
          break;
        case "file":
          break;
        case "select-one":
          break;
        case "select-multiple":
          break;
        default:
          this.dataset.setElementData(target.value, target.name, row);
          break;
      }

      $R.log("ModelMixin onBlur : end");
    }

    // -------------------------------------------------------
    // セレクトボックス　チェンジ処理
    // -------------------------------------------------------
   ,onChangeSelectBox: function(event, defSelectBox) {
      $R.log("ModelMixin onChangeSelectBox : start");
      
      var targetID    = event.target.id;
      var targetValue = $("#" + targetID).val();
      var targetHtml  = $("#" + targetID + " option:selected").text();
      
      var max      = defSelectBox.length;
      for (var i = 0; i < max; i++) {
        if (targetID != defSelectBox[i]["selectorid"]) {
          continue;
        }
        
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(this.dataset.data, defSelectBox[i]["change"]["datasetid"]);
        var valueName     = defSelectBox[i]["change"]["valuename"];
        if (valueName) {
          if ( this.appspec.isExists(defSelectBox[i]["multiple"]) ) {
            if (defSelectBox[i]["multiple"] == "multiple") {
              if ( $.isArray(targetValue) ) {
                datasetRecord["record"][valueName]["value"][0] = targetValue.join(',');
              }
              else {
                if ( this.appspec.isExists(targetValue) ) {
                  datasetRecord["record"][valueName]["value"][0] = targetValue;
                }
                else {
                  datasetRecord["record"][valueName]["value"][0] = "";
                }
              }
            }
            else {
              datasetRecord["record"][valueName]["value"][0] = targetValue;
            }
          }
          else {
            datasetRecord["record"][valueName]["value"][0] = targetValue;
          }
        }

        var htmlName     = defSelectBox[i]["change"]["htmlname"];
        if (htmlName) {
          datasetRecord["record"][htmlName]["value"][0] = targetHtml;
        }
        
        break;
      }

      $R.log("ModelMixin onChangeSelectBox : end");
      return targetValue;
    }
    
    // -------------------------------------------------------
    // テーブル　セレクトボックス　チェンジ処理
    // -------------------------------------------------------
   ,onChangeTableSelectBox: function(event, row, defSelectBox) {
      $R.log("ModelMixin onChangeTableSelectBox : start");
      
      var targetName   = event.target.name;
      var targetObject = $("." + targetName);
      var targetValue  = $(targetObject[row]).val();

      var max      = defSelectBox.length;
      for (var i = 0; i < max; i++) {
        if (targetName != defSelectBox[i]["selectorname"]) {
          continue;
        }

        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(this.dataset.data, defSelectBox[i]["change"]["datasetid"]);
        var valueName     = defSelectBox[i]["change"]["valuename"];
        if (valueName) {
          datasetRecord["record"][valueName]["value"][row] = targetValue;
        }
        
        break;
      }

      $R.log("ModelMixin onChangeTableSelectBox : end");
      return targetValue;
    }
    
    // -------------------------------------------------------
    // チェックボックス　チェンジ処理
    // -------------------------------------------------------
   ,onChangeCheckBox: function(event, defCheckBox) {
      $R.log("ModelMixin onChangeCheckBox : start");

      var targetID    = event.target.id;
      
      var max      = defCheckBox.length;
      for (var i = 0; i < max; i++) {
        if (targetID != defCheckBox[i]["selectorid"]) {
          continue;
        }
        
        var datasetID   = defCheckBox[i]["datasetid"];
        var datasetName = defCheckBox[i]["datasetname"];
        var checkValue;
        if ( $("#" + targetID).is(":checked") ) {
          checkValue = defCheckBox[i]["value"]["on"];
        }
        else {
          checkValue = defCheckBox[i]["value"]["off"];
        }
        
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(this.dataset.data, datasetID);
        datasetRecord["record"][datasetName]["value"][0] = checkValue;
        
        break;
      }

      $R.log("ModelMixin onChangeCheckBox : end");
      return checkValue;
    }
    
    // -------------------------------------------------------
    // テーブル　チェックボックス　チェンジ処理
    // 20170428 下地 追加
    // -------------------------------------------------------
   ,onChangeTableCheckBox: function(event, row, defCheckBox) {
      $R.log("ModelMixin onChangeTableCheckBox : start");

      var targetName  = event.currentTarget.name;
      
      var max      = defCheckBox.length;
      for (var i = 0; i < max; i++) {
        if (targetName != defCheckBox[i]["selectorname"]) {
          continue;
        }
        
        var datasetID   = defCheckBox[i]["datasetid"];
        var datasetName = defCheckBox[i]["datasetname"];
        var targetObject = $("." + targetName);
        if ( $(targetObject[row]).prop("checked") ) {
          var checkValue = defCheckBox[i]["value"]["on"];
        }
        else {
          var checkValue = defCheckBox[i]["value"]["off"];
        }
        
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(this.dataset.data, datasetID);
        datasetRecord["record"][datasetName]["value"][row] = checkValue;
        
        break;
      }

      $R.log("ModelMixin onChangeTableCheckBox : end");
      return checkValue;
    }
    
    // -------------------------------------------------------
    // ラジオボタン　チェンジ処理
    // -------------------------------------------------------
   ,onChangeonRadioButton: function(event, defRadioButton) {
      $R.log("ModelMixin onChangeonRadioButton : start");


      $R.log("ModelMixin onChangeonRadioButton : end");
    }
    
    // --------------------------------------------------------------
    // セレクトボックス　ＩＤに対応する名称にデータを一括設定する
    // --------------------------------------------------------------
   ,setFromCodeToNameOfSelectBoxALL: function(dataSetInfo, defSelectBox) {
      $R.log("Model setFromIdToNameOfSelectBox : start");
      
      var maxI = defSelectBox.length;
      for (var i = 0; i < maxI; i++) {
        
        var selectID      = defSelectBox[i]["init"]["datasetid"];
        var selectRecord  = this.appspec.getJSONChunkByIdAtRecords(dataSetInfo, selectID);
        var selectValue   = defSelectBox[i]["init"]["valuename"];
        var selectName    = defSelectBox[i]["init"]["htmlname"];

        var detasetID     = defSelectBox[i]["change"]["datasetid"];
        var dataSetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSetInfo, detasetID);
        var dataValue     = defSelectBox[i]["change"]["valuename"];
        var dataName      = defSelectBox[i]["change"]["htmlname"];
        
        var maxJ          = selectRecord["record"][selectValue]["value"].length;
        for (var j = 0; j < maxJ; j++) {
          if (dataSetRecord["record"][dataValue]["value"][0] == selectRecord["record"][selectValue]["value"][j]) {
            dataSetRecord["record"][dataName]["value"][0] = selectRecord["record"][selectName]["value"][j];
            break;
          }
        }
        
      }

      $R.log("Model setFromIdToNameOfSelectBox : end");
    }
    
    // -------------------------------------------------------
    // セレクトボックス　ＩＤに対応する名称にデータを設定する
    // -------------------------------------------------------
   ,setFromCodeToNameOfSelectBox: function(dataSetInfo, defSelectBox, selectorid) {
      $R.log("Model setFromIdToNameOfSelectBox : start");
      
      var maxI = defSelectBox.length;
      for (var i = 0; i < maxI; i++) {
        
        if (selectorid != defSelectBox[i]["selectorid"]) {
          continue;
        }

        var selectID      = defSelectBox[i]["init"]["datasetid"];
        var selectRecord  = this.appspec.getJSONChunkByIdAtRecords(dataSetInfo, selectID);
        var selectValue   = defSelectBox[i]["init"]["valuename"];
        var selectName    = defSelectBox[i]["init"]["htmlname"];

        var detasetID     = defSelectBox[i]["change"]["datasetid"];
        var dataSetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSetInfo, detasetID);
        var dataValue     = defSelectBox[i]["change"]["valuename"];
        var dataName      = defSelectBox[i]["change"]["htmlname"];
        
        var maxJ          = selectRecord["record"][selectValue]["value"].length;
        for (var j = 0; j < maxJ; j++) {
          if (dataSetRecord["record"][dataValue]["value"][0] == selectRecord["record"][selectValue]["value"][j]) {
            dataSetRecord["record"][dataName]["value"][0] = selectRecord["record"][selectName]["value"][j];
            break;
          }
        }
        
      }

      $R.log("Model setFromIdToNameOfSelectBox : end");
    }
    
    // -------------------------------------------------------
    // セレクトボックス　名称に対応するＩＤにデータを設定する
    // -------------------------------------------------------
   ,setFromNameToCodeOfSelectBox: function(dataSetInfo, defSelectBox, selectorid) {
      $R.log("Model setFromNameToCodeOfSelectBox : start");
      
      var maxI = defSelectBox.length;
      for (var i = 0; i < maxI; i++) {
        
        if (selectorid != defSelectBox[i]["selectorid"]) {
          continue;
        }

        var selectID      = defSelectBox[i]["init"]["datasetid"];
        var selectRecord  = this.appspec.getJSONChunkByIdAtRecords(dataSetInfo, selectID);
        var selectValue   = defSelectBox[i]["init"]["valuename"];
        var selectName    = defSelectBox[i]["init"]["htmlname"];

        var detasetID     = defSelectBox[i]["change"]["datasetid"];
        var dataSetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSetInfo, detasetID);
        var dataValue     = defSelectBox[i]["change"]["valuename"];
        var dataName      = defSelectBox[i]["change"]["htmlname"];
        
        var maxJ          = selectRecord["record"][selectName]["value"].length;
        for (var j = 0; j < maxJ; j++) {
          if (dataSetRecord["record"][dataName]["value"][0] == selectRecord["record"][selectName]["value"][j]) {
            dataSetRecord["record"][dataValue]["value"][0] = selectRecord["record"][selectValue]["value"][j];
            break;
          }
        }
        
      }

      $R.log("Model setFromNameToCodeOfSelectBox : end");
    }

  };
  
  // -------------------------------------------------------
  // 画面遷移関数を追加する
  // -------------------------------------------------------
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

      var body = document.getElementsByTagName("body")[this.appspec.formno];
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
    
    // -------------------------------------------------
    // 20170427 下地　追加
    // -------------------------------------------------
    // dataset.jsonのvalue値をクリアする
    // -------------------------------------------------
   ,clearDatasetJson: function(dataset) {
      $R.log("ModelMixin clearDatasetJson : start");

      var datasetRecords = dataset["records"];
      var maxSize        = datasetRecords.length;
      
      for (var i = 0; i < maxSize; i++) {
        this.clearDatasetRecord(datasetRecords[i]);
      }
      
      $R.log("ModelMixin clearDatasetJson : end");
    }

   ,clearDatasetRecord: function(datasetRecord) {
      var multiline   = datasetRecord["multiline"];
      
      if (multiline == "yes") {
        var defaultline = datasetRecord["defaultline"];
      }
      else {
        var defaultline = 1;
      }
      
      for (var name in datasetRecord["record"]) {
        for (var i = 0; i < defaultline; i++) {
          datasetRecord["record"][name]["value"][i] = "";
        }
      }
      
      $R.log("ViewMixin clearDataOfItemNameInRecord : end");
    }

    // ---------------------------------------------------------------
    // dataset.json request.json response.jsonのvalue値をクリアする
    // ---------------------------------------------------------------
   ,clearJsonRecords: function(jsonData) {
      $R.log("ModelMixin clearJsonRecords : start");
     
      var jsonRecords = jsonData["records"];
      var maxSize     = jsonRecords.length;
      
      for (var i = 0; i < maxSize; i++) {
        this.clearJsonRecord(jsonRecords[i]);
      }
      
      $R.log("ModelMixin clearJsonRecords : end");
    }

   ,clearJsonRecord: function(jsonRecord) {
   
      for (var name in jsonRecord["record"]) {
        jsonRecord["record"][name]["value"] = [""]; // 2017/05/19 UPDATE Okada
      }
      
    }
    
    // -------------------------------------------------
    //  datasetからjsondataをセットする
    // (datasetからrequestをセットする)
    // -------------------------------------------------
   ,setDatasetToJsonRecords: function(dataset, request) {
      $R.log("ModelMixin setDatasetToJsonRecords : start");
     
      this.clearJsonRecords(request);

      var datasetRecords = dataset["records"];
      var requestRecords = request["records"];
      var datasetSize    = datasetRecords.length;
      var requestSize    = requestRecords.length;
      
      for (var i = 0; i < requestSize; i++) {
        var requestRecord = requestRecords[i];
        for (var j = 0; j < datasetSize; j++) {
          var datasetRecord = datasetRecords[j];
          if (requestRecord["id"] == datasetRecord["id"]) {
            this.setDatasetRecordToJsonRecord(datasetRecord, requestRecord);
            break;
          }
        }
      }
      
      $R.log("ModelMixin setDatasetToJsonRecords : end");
    }
   
   ,setDatasetRecordToJsonRecord: function(datasetRecord, requestRecord) {
   
      for (var name in requestRecord["record"]) {
        if (name in datasetRecord["record"]) {
          this.setDatasetValueToJsonValue(datasetRecord["record"][name]["value"], requestRecord["record"][name]["value"]);
        }
      }
    }
   
   ,setDatasetValueToJsonValue: function(datasetValue, requestValue) {
      var maxSize = datasetValue.length;
      
      for (var i = 0; i < maxSize; i++) {
        requestValue[i] = datasetValue[i];
      }
      
    }
   
    // -----------------------------------------------------------------
    //  datasetの空行を除いた行をjsondataにコピーする
    // -----------------------------------------------------------------
   ,setDatasetToJsonRecordsNoEmptyLine: function(dataset, request) {
      $R.log("ModelMixin setDatasetToJsonRecordsNoEmptyLine : start");
     
      this.clearJsonRecords(request);

      var datasetRecords = dataset["records"];
      var requestRecords = request["records"];
      var datasetSize    = datasetRecords.length;
      var requestSize    = requestRecords.length;
      
      for (var i = 0; i < requestSize; i++) {
        var requestRecord = requestRecords[i];
        for (var j = 0; j < datasetSize; j++) {
          var datasetRecord = datasetRecords[j];
          if (requestRecord["id"] == datasetRecord["id"]) {
            this.setDatasetRecordToJsonRecordNoEmptyLine(datasetRecord, requestRecord);
            break;
          }
        }
      }

      $R.log("ModelMixin setDatasetToJsonRecordsNoEmptyLine : end");
    }
   
   ,setDatasetRecordToJsonRecordNoEmptyLine: function(datasetRecord, requestRecord) {

      // マルチラインでないとき
      if (datasetRecord["multiline"] != "yes") {
        this.setDatasetRecordToJsonRecord(datasetRecord, requestRecord);
        return;
      }
      
      // マルチライン処理
      var maxSize = 0;
      for (var name in datasetRecord["record"]) {
        if (maxSize < datasetRecord["record"][name]["value"].length) {
          maxSize = datasetRecord["record"][name]["value"].length;
        }
      }
      
      var toNo = 0;
      for (var fromNo = 0; fromNo < maxSize; fromNo++) {
        var emptySW  = 0;
        for (var name in datasetRecord["record"]) {
          if (datasetRecord["record"][name]["value"][fromNo] != "") {
            emptySW = 1;
            break;
          }
        }
        
        // 全項目が空の時
        if (emptySW == 0) {
          continue;
        }
        
        for (var name in requestRecord["record"]) {
          if (name in datasetRecord["record"]) {
            requestRecord["record"][name]["value"][toNo] = datasetRecord["record"][name]["value"][fromNo];
          }
        }
        toNo = toNo + 1;
      }
    }
    
    // -----------------------------------------------------------------
    //  datasetの空行を除いた行をjsondataにコピーする
    // マルチラインの時は、削除行をjsondataに出力する
    // -----------------------------------------------------------------
   ,setDatasetToJsonRecordsInDeleteLine: function(dataset, request) {
      $R.log("ModelMixin setDatasetToJsonRecordsInDeleteLine : start");
     
      this.clearJsonRecords(request);

      var datasetRecords = dataset["records"];
      var requestRecords = request["records"];
      var datasetSize    = datasetRecords.length;
      var requestSize    = requestRecords.length;
      
      for (var i = 0; i < requestSize; i++) {
        var requestRecord = requestRecords[i];
        for (var j = 0; j < datasetSize; j++) {
          var datasetRecord = datasetRecords[j];
          if (requestRecord["id"] == datasetRecord["id"]) {
            this.setDatasetRecordToJsonRecordInDeleteLine(datasetRecord, requestRecord);
            break;
          }
        }
      }

      $R.log("ModelMixin setDatasetToJsonRecordsInDeleteLine : end");
    }
   
   ,setDatasetRecordToJsonRecordInDeleteLine: function(datasetRecord, requestRecord) {

      // マルチラインでないとき
      if (datasetRecord["multiline"] != "yes") {
        this.setDatasetRecordToJsonRecord(datasetRecord, requestRecord);
        return;
      }
      
      // マルチライン処理
      var maxSize = 0;
      for (var name in datasetRecord["record"]) {
        if (maxSize < datasetRecord["record"][name]["value"].length) {
          maxSize = datasetRecord["record"][name]["value"].length;
        }
      }
      
      var toNo = 0;
      for (var fromNo = 0; fromNo < maxSize; fromNo++) {
        var emptySW  = 0;
        for (var name in datasetRecord["record"]) {
          if (name == "削除") {
            continue;
          }
          if (name == "行追加") {
            continue;
          }
          
          if (datasetRecord["record"][name]["value"][fromNo] != "") {
            emptySW = 1;
            break;
          }
        }
        
        // 全項目が空の時
        if (emptySW == 0) {
          continue;
        }
        
        for (var name in requestRecord["record"]) {
          if (name in datasetRecord["record"]) {
            requestRecord["record"][name]["value"][toNo] = datasetRecord["record"][name]["value"][fromNo];
          }
        }
        toNo = toNo + 1;
      }
    }
   
    // -----------------------------------------------------------------
    //  datasetの空行を除いた行をjsondataにコピーする
    // マルチラインの時は、削除行をjsondataに出力しない
    // -----------------------------------------------------------------
   ,setDatasetToJsonRecordsNoDeleteLine: function(dataset, request) {
      $R.log("ModelMixin setDatasetToJsonRecordsNoDeleteLine : start");
     
      this.clearJsonRecords(request);

      var datasetRecords = dataset["records"];
      var requestRecords = request["records"];
      var datasetSize    = datasetRecords.length;
      var requestSize    = requestRecords.length;
      
      for (var i = 0; i < requestSize; i++) {
        var requestRecord = requestRecords[i];
        for (var j = 0; j < datasetSize; j++) {
          var datasetRecord = datasetRecords[j];
          if (requestRecord["id"] == datasetRecord["id"]) {
            this.setDatasetRecordToJsonRecordNoDeleteLine(datasetRecord, requestRecord);
            break;
          }
        }
      }

      $R.log("ModelMixin setDatasetToJsonRecordsNoDeleteLine : end");
    }
   
   ,setDatasetRecordToJsonRecordNoDeleteLine: function(datasetRecord, requestRecord) {

      // マルチラインでないとき
      if (datasetRecord["multiline"] != "yes") {
        this.setDatasetRecordToJsonRecord(datasetRecord, requestRecord);
        return;
      }
      
      // マルチライン処理
      var maxSize = 0;
      for (var name in datasetRecord["record"]) {
        if (maxSize < datasetRecord["record"][name]["value"].length) {
          maxSize = datasetRecord["record"][name]["value"].length;
        }
      }
      
      var toNo = 0;
      for (var fromNo = 0; fromNo < maxSize; fromNo++) {
        var emptySW  = 0;
        for (var name in datasetRecord["record"]) {
          if (name == "行追加") {
            continue;
          }
          if (name == "削除") {
            continue;
          }
          
          if (datasetRecord["record"][name]["value"][fromNo] != "") {
            emptySW = 1;
            break;
          }
        }
        
        // 全項目が空の時
        if (emptySW == 0) {
          continue;
        }
        
        emptySW = 0;
        
        for (var name in datasetRecord["record"]) {
          if (name != "削除") {
            continue;
          }
          
          if (datasetRecord["record"]["削除"]["value"][fromNo] == "1") {
            emptySW = 1;
            break;
          }
          if (datasetRecord["record"]["削除"]["value"][fromNo] == "9") {
            emptySW = 1;
            break;
          }
        }
        
        if (emptySW == 0) {
          for (var name in requestRecord["record"]) {
            if (name in datasetRecord["record"]) {
              requestRecord["record"][name]["value"][toNo] = datasetRecord["record"][name]["value"][fromNo];
            }
          }
          toNo = toNo + 1;
        }
      }
    }

    // -------------------------------------------------
    //  jsondataからdataset.jsonをセットする
    // (responseからdataset.jsonをセットする)
    // -------------------------------------------------
   ,setJsonRecordsToDataset: function(response, dataset, pubsub, nonclear) {
      $R.log("ModelMixin setJsonRecordsToDataset : start");
     
      var responseRecords = response["records"];
      var datasetRecords  = dataset["records"];
      var responseSize    = responseRecords.length;
      var datasetSize     = datasetRecords.length;
      
      for (var i = 0; i < responseSize; i++) {
        var responseRecord = responseRecords[i];
        for (var j = 0; j < datasetSize; j++) {
          var datasetRecord = datasetRecords[j];
          if (responseRecord["id"] == datasetRecord["id"]) {
            this.setJsonRecordToDatasetRecord(responseRecord, datasetRecord, pubsub, nonclear);
            break;
          }
        }
      }
      
      $R.log("ModelMixin setJsonRecordsToDataset : end");
    }
   
   ,setJsonRecordToDatasetRecord: function(responseRecord, datasetRecord, pubsub, nonclear) {
   
      var multiline   = datasetRecord["multiline"];
      var defaultline = datasetRecord["defaultline"];
      
      // 20170920 shimoji start
      if (arguments.length == 3) {
        if (multiline == "yes") {
          this.clearJsonRecord(datasetRecord);
        }
      }
      // 20170920 shimoji end
      
      var deleteSW = 0;
      for (var name in responseRecord["record"]) {
        if (name == "削除") {
          deleteSW = 1;
        }
        
        if (name in datasetRecord["record"]) {
          this.setJsonValueToDatasetValue(responseRecord["record"][name]["value"], datasetRecord["record"][name]["value"], multiline, defaultline, name, pubsub);
        }
      }
      
      // 20180929 shimoji start
      if (deleteSW == 1) {
        return;
      }
      if (multiline != "yes") {
        return;
      }
      
      // 削除クリア
      for (var name in datasetRecord["record"]) {
        if (name != "削除") {
         continue;
        }
        
        for (var i = 0; i < defaultline; i++) {
          datasetRecord["record"]["削除"]["value"][i] = "";
        }
        break;
      }
      // 20180929 shimoji end
      
    }
   
   ,setJsonValueToDatasetValue: function(responseValue, datasetValue, multiline, defaultline, name, pubsub) {
     
      if (multiline == "no") {
        datasetValue[0] = responseValue[0];
        this.deriveJsonValueToDatasetValue(pubsub, name, datasetValue[0], 0);
        return;
      }
     
      var responseSize = responseValue.length;
      datasetValue.splice(0, datasetValue.length);  // 20171227 shimoji
      
      for (var i = 0; i < responseSize; i++) {
        datasetValue[i] = responseValue[i];
        this.deriveJsonValueToDatasetValue(pubsub, name, datasetValue[i], i);
      }
      
      if (defaultline > responseSize) {
        for (var j = responseSize; j < defaultline; j++) {
          datasetValue[j] = "";
        }
      }
      
    }

   ,deriveJsonValueToDatasetValue: function(pubsub, name, value, row) {
     
     if (pubsub === undefined) {
       return;
     }
     
      var objArray  = $("." + name);
      var eventname = "derive" + name;
      
      if (pubsub.isEvent(eventname)) {
        target = objArray[row];
        arg = {target: target, value: value, row: row, name: name};
        pubsub.publish(eventname, arg);
      }
      
    }

    // -------------------------------------------------
    //  detailRecordの指定行に空行を挿入する
    // -------------------------------------------------
   ,insertRowOfDetailRecord: function(detailRecord, row) {
      $R.log("ModelMixin insertRowOfDetailRecord : start");
     
      for (var name in detailRecord["record"]) {
        detailRecord["record"][name]["value"].splice(row, 0, "")
      }
      
      detailRecord["defaultline"] = String(parseInt(detailRecord["defaultline"]) + 1);
      
      $R.log("ModelMixin insertRowOfDetailRecord : end");
      return detailRecord;
    }
    
    // -------------------------------------------------
    //  detailRecordの指定行を削除する
    // -------------------------------------------------
   ,deleteRowOfDetailRecord: function(detailRecord, row) {
      $R.log("ModelMixin deleteRowOfDetailRecord : start");
     
      for (var name in detailRecord["record"]) {
        detailRecord["record"][name]["value"].splice(row, 1)
      }
      
      detailRecord["defaultline"] = String(parseInt(detailRecord["defaultline"]) - 1);
      
      $R.log("ModelMixin deleteRowOfDetailRecord : end");
      return detailRecord;
    }
    
    // -------------------------------------------------
    //  detailRecordの指定行を連想配列に取り出す
    // -------------------------------------------------
   ,fromDetailRecordtoHash: function(detailRecord, row) {
      $R.log("ModelMixin fromDetailRecordtoHash : start");
     
      var detailHash = {};
      for (var name in detailRecord["record"]) {
        detailHash[name] = detailRecord["record"][name]["value"][row];
      }
      
      $R.log("ModelMixin fromDetailRecordtoHash : end");
      return detailHash;
    }
    
    // -------------------------------------------------
    //  連想配列をdetailRecordの指定行に挿入する
    // -------------------------------------------------
   ,insertHashtoDetailRecord: function(detailHash, detailRecord, row) {
      $R.log("ModelMixin insertHashtoDetailRecord : start");
     
      for (var name in detailHash["record"]) {
        detailRecord["record"][name]["value"].splice(row, 0, detailHash[name])
      }
      
      detailRecord["defaultline"] = String(parseInt(detailRecord["defaultline"]) + 1);
      
      $R.log("ModelMixin insertHashtoDetailRecord : end");
      return detailRecord;
    }
    
    // -------------------------------------------------
    //  連想配列をdetailRecordの指定行に置換する
    // -------------------------------------------------
   ,replaceHashtoDetailRecord: function(detailHash, detailRecord, row) {
      $R.log("ModelMixin replaceHashtoDetailRecord : start");
     
      for (var name in detailHash["record"]) {
        detailRecord["record"][name]["value"][row] = detailHash[name];
      }
      
      $R.log("ModelMixin replaceHashtoDetailRecord : end");
      return detailRecord;
    }
    
    // -------------------------------------------------------
    // 画面遷移・選択画面　処理
    // -------------------------------------------------------
    //  キー定義情報をセッションストレージにセイブする
    // -------------------------------------------------------
   ,saveSessionStorage: function() {
      $R.log("Model saveSessionStorage : start");
      
      this.saveSessionStorageOfKeyInfo(this.appspec.sessionStorageHeaderKey);
      this.saveSessionStorageOfDetail();
      this.saveSessionStorageOfKeyInfo(this.appspec.sessionStorageFooterKey);
      
      $R.log("Model saveSessionStorage : end");
    }

   ,saveSessionStorageOfKeyInfo: function(keyInfo) {
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      
      // データセットを設定する
      var dataSet = this.dataset.getData();

      // 画面ヘッダ　キー定義情報をセッションストレージにセイブする
      var maxSize1      = keyInfo.length;
      for (var i = 0; i < maxSize1; i++) {
        var datasetID     = keyInfo[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = keyInfo[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName = keyInfo[i]["dataname"][j];
          sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][0]);
        }
      }
      
    }
    
   ,saveSessionStorageOfDetail: function() {
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      
      // データセットを設定する
      var dataSet = this.dataset.getData();

      // 画面明細　キー定義情報をセッションストレージにセイブする
      var clickRow      = sessionStorage.loadItem("クリック行");
      var maxSize1      = this.appspec.sessionStorageDetailKey.length;
      for (var i = 0; i < maxSize1; i++) {
        var datasetID     = this.appspec.sessionStorageDetailKey[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = this.appspec.sessionStorageDetailKey[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName = this.appspec.sessionStorageDetailKey[i]["dataname"][j];
        
          if (clickRow === undefined) {
            sessionStorage.saveItem(itemName, "");
            continue;
          }
          sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][clickRow]);
        }
      }
      
    }

    // -------------------------------------------------------
    //  セッションストレージのキー定義情報をクリアする
    // -------------------------------------------------------
   ,clearSessionStorage: function() {
      $R.log("Model clearSessionStorage : start");
      
      this.clearSessionStorageOfKeyInfo(this.appspec.sessionStorageHeaderKey);
      this.clearSessionStorageOfKeyInfo(this.appspec.sessionStorageDetailKey);
      this.clearSessionStorageOfKeyInfo(this.appspec.sessionStorageFooterKey);
      
      $R.log("Model clearSessionStorage : end");
    }

   ,clearSessionStorageOfKeyInfo: function(keyInfo) {
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      
      // セッションストレージの画面ヘッダ　キー定義情報をクリアする
      var maxSize1   = keyInfo.length;
      for (var i = 0; i < maxSize1; i++) {
        var maxSize2 = keyInfo[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName = keyInfo[i]["dataname"][j];
          
          // 2020/01/20 追加
          if ( this.appspec.isExists(keyInfo[i]["initvalue"]) ) {
            sessionStorage.saveItem(itemName, keyInfo[i]["initvalue"][j]);
          }
          else {
            sessionStorage.saveItem(itemName, "");
          }
          //sessionStorage.saveItem(itemName, "");
        }
      }
      
    }
    
   ,clearSessionStorageOfKeyInfoOfNumber: function(keyInfo, clearNumber) {
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      
      // セッションストレージの画面ヘッダ　キー定義情報をクリアする
      var maxSize1   = keyInfo.length;
      for (var i = 0; i < maxSize1; i++) {
        if (clearNumber != keyInfo[i]["datasetid"].slice( -1 )) {
          continue;
        }

        var maxSize2 = keyInfo[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName = keyInfo[i]["dataname"][j];
          
          // 2019/08/29 追加
          if ( this.appspec.isExists(keyInfo[i]["initvalue"]) ) {
            sessionStorage.saveItem(itemName, keyInfo[i]["initvalue"][j]);
          }
          else {
            sessionStorage.saveItem(itemName, "");
          }
        }
      }
      
    }
    
    // -------------------------------------------------------------------
    //  セッションストレージのキー定義情報をデータセットに設定する
    // -------------------------------------------------------------------
   ,setFromSessionStorageToDataset: function() {
      $R.log("Model setFromSessionStorageToDataset : start");
      
      // データセットを設定する
      var dataSet = this.dataset.getData();

      this.setFromSessionStorageToDatasetOfKeyInfo(dataSet, this.appspec.sessionStorageHeaderKey);
      this.setFromSessionStorageToDatasetOfKeyInfo(dataSet, this.appspec.sessionStorageFooterKey);
      
      $R.log("Model setFromSessionStorageToDataset : end");
      return dataSet;
    }

   ,setFromSessionStorageToDatasetOfKeyInfo: function(dataSet, keyInfo) {
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      
      // セッションストレージの画面ヘッダ　キー定義情報をデータセットに設定する
      var maxSize1        = keyInfo.length;
      for (var i = 0; i < maxSize1; i++) {
        var datasetID     = keyInfo[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = keyInfo[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName  = keyInfo[i]["dataname"][j];
          var value = sessionStorage.loadItem(itemName);
          if (value === undefined) {
            continue;
          }
          
          datasetRecord[itemName]["value"][0] = value;
        }
      }

      return dataSet;
    }

   ,setFromSessionStorageToDatasetOfKeyInfoOfNumber: function(dataSet, keyInfo, clearNumber) {
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      
      // セッションストレージの画面ヘッダ　キー定義情報をデータセットに設定する
      var maxSize1        = keyInfo.length;
      for (var i = 0; i < maxSize1; i++) {
        if (clearNumber != keyInfo[i]["datasetid"].slice( -1 )) {
          continue;
        }

        var datasetID     = keyInfo[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = keyInfo[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName  = keyInfo[i]["dataname"][j];
          var value = sessionStorage.loadItem(itemName);
          if (value === undefined) {
            continue;
          }
          
          datasetRecord[itemName]["value"][0] = value;
        }
      }

      return dataSet;
    }

    // -------------------------------------------------------
    //  画面遷移処理：次画面の処理モードを設定する
    // -------------------------------------------------------
   ,saveSessionStorageOfNextMode: function(guiName, mode) {
      $R.log("Model saveSessionStorageOfNextMode : start");
      
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.saveItem("処理モード", mode);
      
      sessionStorage.setIdName(this.appspec.sysname + "." + guiName);
      sessionStorage.saveItem("処理モード", mode);
      
      $R.log("Model saveSessionStorageOfNextMode : end");
    }

    // -------------------------------------------------------------------
    //  画面遷移処理：次画面への引き継ぎデータをチェックする
    // -------------------------------------------------------------------
   ,checkNextStorageData: function() {
      var arg = {status: "OK"};
   
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var clickRow      = sessionStorage.loadItem("クリック行");
      
      // データセットを設定する
      var dataSet = this.dataset.getData();

      // 次画面への引き継ぎデータをチェックする
      var maxSize1        = this.appspec.nextStorageData.length;
      for (var i = 0; i < maxSize1; i++) {
        var datasetID     = this.appspec.nextStorageData[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = this.appspec.nextStorageData[i]["dataname"].length;
        
        for (var j = 0; j < maxSize2; j++) {
          var itemName  = this.appspec.nextStorageData[i]["dataname"][j];
          var titleName = this.appspec.nextStorageData[i]["titlename"][j];
          
          // ヘッダ・フッター項目　チェック
          if (datasetID != "detail") {
            if (this.appspec.nextStorageData[i]["validation"][j] == "required") {
              if (datasetRecord[itemName]["value"][0] == "") {
                arg["title"]   = "入力（選択）エラー";
                arg["status"]  = "ERROR";
                arg["message"] = titleName + "は必須項目です。入力（選択）して下さい。";
                return arg;
              }
            }
            continue;
          }
          
          // 明細項目　チェック
          if (this.appspec.nextStorageData[i]["validation"][j] == "required") {
            if (clickRow === undefined) {
              arg["title"]   = "行選択エラー";
              arg["status"]  = "ERROR";
              arg["message"] = titleName + "は必須項目です。行を選択して下さい。";
              return arg;
            }
            if (datasetRecord[itemName]["value"][clickRow] == "") {
              var arg = {};
              arg["title"]   = "行選択エラー";
              arg["status"]  = "ERROR";
              arg["message"] = titleName + "は必須項目です。行を選択して下さい。";
              return arg;
            }
          }
        }
      }
      
      return arg;
    }
    
    // -------------------------------------------------------------------
    //  画面遷移処理：次画面への引き継ぎデータを設定する
    // -------------------------------------------------------------------
   ,setNextStorageData: function(guiName) {
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var clickRow      = sessionStorage.loadItem("クリック行");
      
      // データセットを設定する
      var dataSet = this.dataset.getData();

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + guiName);
      
      // 次画面への引き継ぎデータを次画面セッションストレージに設定する
      var maxSize1        = this.appspec.nextStorageData.length;
      for (var i = 0; i < maxSize1; i++) {
        var datasetID     = this.appspec.nextStorageData[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = this.appspec.nextStorageData[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName = this.appspec.nextStorageData[i]["dataname"][j];
          if (datasetID != "detail") {
            sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][0]);
            continue;
          }
          
          if (clickRow === undefined) {
            sessionStorage.saveItem(itemName, "");
          }
          else {
            sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][clickRow]);
          }
        }
      }
    }

    // -------------------------------------------------------------------
    //  画面遷移処理：次画面への引き継ぎデータを設定する（アクティブタブ）
    // -------------------------------------------------------------------
   ,setNextStorageTabData: function(guiName, activetabnumber) {
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var clickRow      = sessionStorage.loadItem("クリック行_" + activetabnumber);
      
      // データセットを設定する
      var dataSet = this.dataset.getData();

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + guiName);
      
      // 次画面への引き継ぎデータを次画面セッションストレージに設定する
      var maxSize1        = this.appspec.nextStorageData.length;
      for (var i = 0; i < maxSize1; i++) {
        var datasetID     = this.appspec.nextStorageData[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = this.appspec.nextStorageData[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName = this.appspec.nextStorageData[i]["dataname"][j];
          if (datasetID != ("detail_" + activetabnumber)) {
            sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][0]);
            continue;
          }
          
          if (clickRow === undefined) {
            sessionStorage.saveItem(itemName, "");
          }
          else {
            sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][clickRow]);
          }
        }
      }
    }

    // -------------------------------------------------------------------
    //  画面遷移処理：前画面からの引き継ぎデータをセータセットに設定する
    // -------------------------------------------------------------------
   ,setFromBeforeStorageDataToDataset: function() {
       var status = "OK";
       
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      
      // データセットを設定する
      var dataSet = this.dataset.getData();

      // 前画面からの引き継ぎデータをセータセットに設定する
      var maxSize1        = this.appspec.beforeStorageData.length;
      for (var i = 0; i < maxSize1; i++) {
        var datasetID     = this.appspec.beforeStorageData[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = this.appspec.beforeStorageData[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName = this.appspec.beforeStorageData[i]["dataname"][j];
          
          // 引き継ぎデータ無し
          if (sessionStorage.loadItem(itemName) === undefined) {
            continue;
          }
          
          // 引き継ぎデータ有り
          status = "OK";
          datasetRecord[itemName]["value"][0] = sessionStorage.loadItem(itemName);
        }
      }
      
      return status;
    }
    
    // ---------------------------------------------------------------------------------
    //  画面遷移処理：画面遷移後、自画面に戻って来た時、
    //  画面ヘッダ　キー定義が設定されている時　：遷移直前の状態にdataSetを設定する
    //  画面ヘッダ　キー定義が設定されていない時：メニューから遷移した。何もしない
    // ---------------------------------------------------------------------------------
   ,setMyUIStorageData: function() {
      var arg = {};
      arg["status"]   = "NO";
      
      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
     
      // データセットを設定する
      var dataSet = this.dataset.getData();
      
      // セッションストレージの画面ヘッダ　キー定義情報をデータセットに設定する
      var maxSize1        = this.appspec.sessionStorageHeaderKey.length;
      for (var i = 0; i < maxSize1; i++) {
        var datasetID     = this.appspec.sessionStorageHeaderKey[i]["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
        var maxSize2      = this.appspec.sessionStorageHeaderKey[i]["dataname"].length;
        for (var j = 0; j < maxSize2; j++) {
          var itemName = this.appspec.sessionStorageHeaderKey[i]["dataname"][j];
          if (datasetID != "detail") {
            var value = sessionStorage.loadItem(itemName);
            if (value === undefined) {
              return arg;
            }
            
            datasetRecord[itemName]["value"][0] = value;
            arg["status"] = "OK";
            continue;
          }
        }
      }
      
      return arg;
    }

    // -------------------------------------------------------------------
    //  選択画面処理：呼び出し側の処理
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    //  選択画面処理：遷移処理
    // -------------------------------------------------------------------
   ,on選択画面遷移: function(selectStorageRequestData, selectStorageResponseData, row) {
      $R.log("Model on選択画面遷移 : start");
      
      var dataSet = this.dataset.getData();

      // 遷移前にデータセットを退避する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.saveItem("選択画面名", selectStorageRequestData["requestname"]);
      sessionStorage.saveItem("クリック行退避", row);
      sessionStorage.saveObject("データセット退避", dataSet);
      
      // 次画面のリクエストデータをセットする
      var maxSize       = selectStorageRequestData["dataname"].length;
      if (maxSize > 0) {
        var datasetid     = selectStorageRequestData["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetid)["record"];
        for (var i = 0; i < maxSize; i++) {
          var name  = selectStorageRequestData["dataname"][i];
          var value = datasetRecord[name]["value"][0];
          selectStorageRequestData["value"][i] = value;
        }
      }
      
      // 次画面のセッションストレージにリクエストデータを退避する
      sessionStorage.setIdName(this.appspec.sysname + "." + selectStorageRequestData["requestname"]);
      sessionStorage.saveObject("リクエストデータ", selectStorageRequestData);
      
      // 次画面のセッションストレージにレスポンスデータを退避する
      sessionStorage.saveObject("レスポンスデータ", selectStorageResponseData);
      
      // 次画面へ遷移する
      var currName  = this.appspec.urlInfo[0]["app"];
      var nextArray = currName.split("/"); 
      nextArray[3]  = selectStorageRequestData["requestname"];
      var nextName  = nextArray.join("/");

      this.setTransitionData(currName.slice(0, -1));
      this.postHtmlTransition(nextName.slice(0, -1));

      $R.log("Model on選択画面遷移 : end");
    }

    // -------------------------------------------------------------------
    //  選択画面処理：戻り処理
    // -------------------------------------------------------------------
   ,on選択画面戻り: function() {
      $R.log("Model on選択画面戻り : start");
      
      var arg = {};
      arg["status"]   = "NO";
      arg["selected"] = "";
      
      // 遷移前にデータセットを復元する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var selectName = sessionStorage.loadItem("選択画面名");
      if (selectName === undefined) {
        sessionStorage.deleteItem("選択画面名");
        
        $R.log("Model on選択画面戻り : end");
        return arg;
      }
      
      var clickRow = sessionStorage.loadItem("クリック行退避");
      
      // 20191115 shimoji 追加 start
      if (clickRow === undefined) {
        clickRow = 0;
      }
      // 20191115 shimoji 追加 end
      
      var dataSet  = sessionStorage.loadObject("データセット退避");
      var selectStorageResponseData = sessionStorage.loadObject("レスポンスデータ");
      sessionStorage.deleteItem("選択画面名");
      
      // 選択画面で選択データ無し
      arg["status"]       = "OK";
      arg["responseData"] = selectStorageResponseData;
      arg["clickRow"]     = clickRow;
      arg["selected"]     = "CANCEL";
      
      if (selectStorageResponseData["status"] == "CANCEL") {
        this.dataset.setData(dataSet);
        
        $R.log("Model on選択画面戻り : end");
        return arg;
      }
      
      // 選択画面で選択データ有り
      arg["selected"] = "OK";

      var maxSize  = selectStorageResponseData["dataname"].length;
      if (maxSize > 0) {
        var datasetid = selectStorageResponseData["datasetid"];
        var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetid)["record"];
        for (var i = 0; i < maxSize; i++) {
          var dataname = selectStorageResponseData["dataname"][i];
          datasetRecord[dataname]["value"][clickRow] = selectStorageResponseData["value"][i];
        }
      }
      this.dataset.setData(dataSet);
      
      $R.log("Model on選択画面戻り : end");
      return arg;
    }
    
    // -------------------------------------------------------------------
    //  選択画面処理：呼び出される側の処理
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    //  選択画面処理：選択画面のリクエストデータを設定
    // -------------------------------------------------------------------
   ,setリクエストデータOf選択画面: function() {
      $R.log("Model setリクエストデータOf選択画面 : start");
      
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      
      // 前画面からのリクエスト情報を設定する
      var selectStorageRequestData = sessionStorage.loadObject("リクエストデータ");
      this.appspec.selectStorageRequestData[0] = selectStorageRequestData
      
      // 前画面からのレスポンス情報を設定する
      var selectStorageResponseData = sessionStorage.loadObject("レスポンスデータ");
      this.appspec.selectStorageResponseData[0] = selectStorageResponseData

      var dataSet = this.dataset.getData();
      
      // 前画面のリクエストデータをデータセットにセットする
      if (this.appspec.isExists(selectStorageRequestData) ) {
        var maxSize = selectStorageRequestData["dataname"].length;
        if (maxSize > 0) {
          var datasetID     = selectStorageRequestData["datasetid"];
          var datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
          for (var i = 0; i < maxSize; i++) {
            var name  = selectStorageRequestData["dataname"][i];
            datasetRecord[name]["value"][0] = selectStorageRequestData["value"][i];
          }
        }
      }

      $R.log("Model setリクエストデータOf選択画面 : end");
    }

    // -------------------------------------------------------------------
    //  選択画面処理：選択画面のレスポンスデータを設定（選択有り）
    // -------------------------------------------------------------------
   ,set選択レスポンスデータOf選択画面: function() {
      $R.log("Model set選択レスポンスデータOf選択画面 : start");
      
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var selectStorageResponseData = this.appspec.selectStorageResponseData[0];

      var maxSize1       = selectStorageResponseData["dataname"].length;
      var maxSize2       = this.appspec.sessionStorageDetailKey[0]["dataname"].length;
      for (var i = 0; i < maxSize1; i++) {
        selectStorageResponseData["value"][i] = "";
        var dataName = selectStorageResponseData["dataname"][i]
        
        for (var j = 0; j < maxSize2; j++) {
          if (dataName == this.appspec.sessionStorageDetailKey[0]["dataname"][j]) {
            selectStorageResponseData["value"][i] = sessionStorage.loadItem(dataName);
            break;
          }
        }
      }
      
      // ステータスを設定する
      selectStorageResponseData["status"] = "OK";
      
      // 前画面のセッションストレージにレスポンスデータを退避する
      sessionStorage.setIdName(this.appspec.sysname + "." + selectStorageResponseData["responsename"]);
      sessionStorage.saveObject("レスポンスデータ", selectStorageResponseData);
      

      $R.log("Model set選択レスポンスデータOf選択画面 : end");
    }

    // -------------------------------------------------------------------
    //  選択画面処理：選択画面のレスポンスデータを設定（選択無し）
    // -------------------------------------------------------------------
   ,set戻るレスポンスデータOf選択画面: function() {
      $R.log("Model set戻るレスポンスデータOf選択画面 : start");
      
      var selectStorageResponseData = this.appspec.selectStorageResponseData[0];
      
      if (this.appspec.isExists(selectStorageResponseData) ) {
        var maxSize = selectStorageResponseData["dataname"].length;
        for (var i = 0; i < maxSize; i++) {
          selectStorageResponseData["value"][i] = "";
        }
      }

      // ステータスを設定する
      selectStorageResponseData["status"] = "CANCEL";
      
      // 前画面のセッションストレージにレスポンスデータを退避する
      sessionStorage.setIdName(this.appspec.sysname + "." + selectStorageResponseData["responsename"]);
      sessionStorage.saveObject("レスポンスデータ", selectStorageResponseData);

      $R.log("Model set戻るレスポンスデータOf選択画面 : end");
    }

  };
}(jQuery, Rmenu));
