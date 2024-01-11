(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  // 関数を追加する
  App.AppSpecMixin = {

    // typeof の代替
    // value              : 判定値
    typeOf: function(value) {
      var result = Object.prototype.toString.call(value);
      var LTSH_NULL_OR_UNDEFINED = {
        '[object Object]':'IE',
        '[object Window]':'Opera',
        '[object DOMWindow]':'Safari iOS',
        '[object global]':'Android'
      };
      if (!value) {
        if (result in LTSH_NULL_OR_UNDEFINED) {
          result = (value === null ? 'Null' : 'Undefined');
        }
      }
      if (result === 'Object') {
        if (value.constructor !== Object) {
          return(null);
        }
      }
      return(result.toLowerCase().replace(/^\[.+ (.+)\]$/, "$1"));
    }

    // 指定値が null でも undefined でもなければ true を返します
    // value              : 判定値
   ,isExists: function(value) {
      return(value != null && value != undefined);
    }

    // 指定値が数値の場合に true を返します
    // value              : 判定値
    // strict             : (true)判定値が数値以外の場合は常に false
    //                      (false)判定値が文字列の場合も判定を実行します
   ,isNumeric: function(value, strict) {
      var strict = App.AppSpecMixin.replaceIfUndefined(strict, true) == true;
      var type = typeof(value);
      return(
        (type == 'number' || (!strict && type == 'string' && value != '')) &&
        !isNaN(value) &&
        isFinite(value));
    }

    // 指定値が配列の場合に true を返します
    // obj                : 判定値
   ,isArrayObj: function(obj) {
      return(obj.constructor === Array);
    }

    // 指定値が null か undefined である場合に代替値を与えます
    // value              : 判定値
    // replace            : 代替値
   ,replaceIfNotExists: function(value, replace) {
      var replace = replace != undefined ? replace : null;
      return(App.AppSpecMixin.isExists(value) ? value : replace);
    }

    // 指定値が undefined の場合に代替値を与えます
    // value              : 判定値
    // replace            : 代替値
   ,replaceIfUndefined: function(value, replace) {
      var replace = replace != undefined ? replace : null;
      return(value != undefined ? value : replace);
    }

    // 指定値が数値ではない場合に代替値を与えます
    // value              : 判定値
    // replace            : 代替値
    // strict             : (true)判定値が数値以外の場合は常に false
    //                      (false)判定値が文字列の場合も判定を実行します
   ,replaceIfNotNumeric: function(value, replace, strict) {
      var temp =
        replace == null ? replace : App.AppSpecMixin.replaceIfUndefined(replace, 0);
      return(App.AppSpecMixin.isNumeric(value, strict) ? value : temp);
    }

    // 指定オブジェクトから、キーの配列を生成します
    // obj                : オブジェクト
   ,getArrayOfKey: function(obj) {
      var result = false;
      switch (App.AppSpecMixin.typeOf(obj)) {
      case 'object':
        result = [];
        for (var key in obj) {
          result.push(key);
        }
        break;
      case 'array':
        result = [];
        for (var i = 0, n = obj.length; i < n; i++) {
          result.push(i);
        }
        break;
      }
      return(result);
    }

    // 指定オブジェクトから、値の配列を生成します
    // obj                : オブジェクト
   ,getArrayOfValue: function(obj) {
      var result = false;
      switch (App.AppSpecMixin.typeOf(obj)) {
      case 'object':
        result = [];
        for (var key in obj) {
          result.push(obj[key]);
        }
        break;
      case 'array':
        result = [];
        for (var i = 0, n = obj.length; i < n; i++) {
          result.push(obj[i]);
        }
        break;
      }
      return(result);
    }

    // JSONオブジェクト検索
    // JSONオブジェクトに含まれる各要素から、
    // 指定条件に合致する部分要素を求めて返却します(最初に合致した要素を返却)
    // 返却される要素はハッシュまたは配列となります
    //
    // 指定するJSONオブジェクトが多階層の構造であっても、再帰検索を行います
    //
    // 引数の与え方で３パターンの検索を行います
    // ・第２引数(ハッシュキー), 第３引数(指定なし)
    //   ハッシュキー = 第２引数
    //   となる【項目を含む】【ハッシュ】を検索します
    //
    // ・第２引数(ハッシュキー), 第３引数(キー値)
    //   ハッシュキー = 第２引数　かつ キー値 = 第３引数
    //   となる【項目を含む】【ハッシュ】を検索します
    //
    // ・第２引数(指定なし), 第３引数(配列値)
    //   配列値 = 第３引数
    //   となる【項目を含む】【配列】を検索します
    //
    // 該当する要素がない場合は false を返却します
    //
    // 【機能追加】
    // scan_all に true を設定すると、条件に合致する部分オブジェクト全てを
    // 配列形式で返却します
    // proc に 処理関数を設定すると、条件に合致した部分オブジェクトに対して
    // 処理を行えます 呼出し形式は proc(json_obj, hash_key, key_value, parent_key) です
    //
    // 入力値:
    //   json_obj       : 検索対象のJSONオブジェクト
    //   hash_key       : 検索するハッシュキー
    //   key_value      : キー値
    //   scan_all       : 全件検索(boolean / def:false)
    //   proc           : 処理関数(function / def:undefined)
    //   _ignore_me_1_  : (使用しません)
    //   _ignore_me_2_  : (使用しません)
    // 戻り値:
    //   オブジェクト   : 検索された要素(オブジェクト)
    //   false          : 該当なし
   ,getJSONChunkByHashKey:
    function(json_obj, hash_key, key_value, scan_all, proc, _ignore_me_1_, _ignore_me_2_) {
      // 初回呼出し時のみ、戻り値を初期化
      if (_ignore_me_2_ == undefined) {
        var _ignore_me_2_ = false;
      }
      // その他の入力値評価
      scan_all = App.AppSpecMixin.replaceIfNotExists(scan_all, false) === true;
      if (App.AppSpecMixin.typeOf(proc) != 'function') {
        proc = false;
      }
      // 検索された要素の格納用関数
      var storeIt = function(obj) {
        if (scan_all && obj !== false) {
          if (_ignore_me_2_ === false) {
            _ignore_me_2_ = [];
          }
          _ignore_me_2_.push(obj);
        } else {
          _ignore_me_2_ = obj;
        }
        if (proc !== false) {
          proc(obj, hash_key, key_value, _ignore_me_1_);
        }
      };

      // JSON オブジェクトの型により、処理を分ける
      switch (App.AppSpecMixin.typeOf(json_obj)) {
      // object の場合
      case 'object':
        // ハッシュキーが存在する場合
        if (hash_key in json_obj) {
          // キー値が設定されている場合は、値による確認も行う
          if (App.AppSpecMixin.isExists(key_value)) {
            // ハッシュキーに対応する値がキー値と同じ場合(条件に合致)
            if (json_obj[hash_key] == key_value) {
              // 戻り値を設定
              storeIt(json_obj);
            }
            // 検索終了
            break;
          }
          // 戻り値を設定して、検索終了
          storeIt(json_obj);
          break;
        // ハッシュキーが存在しない場合
        } else {
          // 下層のオブジェクトがあれば、再帰検索を行う
          for (var hash in json_obj) {
            var hash_type = App.AppSpecMixin.typeOf(json_obj[hash]);
            if (hash_type == 'object' || hash_type == 'array') {
              _ignore_me_1_ = hash;
              // argument.callee(..., _ignore_me_2_) では格納されないため
              // 戻り値を再設定しています
              _ignore_me_2_ = arguments.callee(
                json_obj[hash], hash_key, key_value, scan_all, proc, _ignore_me_1_, _ignore_me_2_);
            }
            // １つだけ検索の場合に、検索されたら、検索終了
            if (!scan_all && _ignore_me_2_ !== false) {
              break;
            }
          }
        }
        break;
      // array の場合
      case 'array':
        // 各配列要素を順に検索する
        for (var i = 0, n = json_obj.length; i < n; i++) {
          // 要素がオブジェクトの場合は再帰検索
          var hash_type = App.AppSpecMixin.typeOf(json_obj[i]);
          if (hash_type == 'object' || hash_type == 'array') {
            _ignore_me_1_ = i;
            // argument.callee(..., _ignore_me_2_) では格納されないため
            // 戻り値を再設定しています
            _ignore_me_2_ = arguments.callee(
              json_obj[i], hash_key, key_value, scan_all, proc, _ignore_me_1_, _ignore_me_2_);
          // 要素がオブジェクトでない場合は配列値検索
          } else {
            // 要素検索の指定時のみ検索実行
            if (!App.AppSpecMixin.isExists(hash_key) &&
                 App.AppSpecMixin.isExists(key_value)) {
              if (json_obj[i] == key_value) {
                // 戻り値を設定
                storeIt(json_obj);
                // 全体検索でなければ検索終了
                if (!scan_all) {
                  break;
                }
              }
            }
          }
          // １つだけ検索の場合に、検索されたら、検索終了
          if (!scan_all && _ignore_me_2_ !== false) {
            break;
          }
        }
        break;
      }
      // 戻り値の返却
      return(_ignore_me_2_);
    }

    // JSONオブジェクトid検索
    // JSONオブジェクトに含まれる配列(sqls, records など)から、
    // 指定idに対応する要素を求めて返却します
    // 該当する要素がない場合は false を返却します
    //
    // ここで扱うJSONオブジェクトには、次の構造が含まれることを想定しています
    // json_obj[index]["id"]  (index:0～)
    //
    // 入力値:
    //   json_obj       : 検索対象のJSONオブジェクト
    //   id             : 検索ID
    // 戻り値:
    //   オブジェクト   : 検索された要素(オブジェクト)
    //   false          : 該当なし または json_obj が配列ではない場合
    //
    // ※ おそらく getJSONChunkByHashKey() で代用可能です
    // 本関数をラッパー関数にする場合は
    // return(this.getJSONChunkByHashKey(json_obj, 'id', id))
    // とすればよい
   ,getJSONChunkById: function(json_obj, id) {
      var result = false;
      // json_obj が配列の場合のみ検索を実施
      if (json_obj.constructor === Array) {
        for (index in json_obj) {
          var temp = json_obj[index];
          // id が合致していたら、現在の要素を戻り値とする
          if (temp["id"] === id) {
            result = temp;
            break;
          }
        }
      }
      return(result);
//    return(this.getJSONChunkByHashKey(json_obj, 'id', id));
    }

    // JSONオブジェクトid検索(ラッパー関数)
    // JSONオブジェクトに含まれる「sqls 部分」から、
    // 指定idに対応する要素を求めて返却します
    // 該当する要素がない場合は false を返却します
    //
    // ここで扱うJSONオブジェクトには、次の構造が含まれることを想定しています
    // json_obj["sqls"][index]["id"]  (index:0～)
    //
    // 入力値:
    //   json_obj       : 検索対象のJSONオブジェクト
    //   id             : 検索ID
    // 戻り値:
    //   オブジェクト   : 検索された要素(オブジェクト)
    //   false          : 該当なし または json_obj["sqls"] なしの場合
   ,getJSONChunkByIdAtSqls: function(json_obj, id) {
      return(this.getJSONChunkById(json_obj["sqls"], id));
    }

    // JSONオブジェクトid検索(ラッパー関数)
    // JSONオブジェクトに含まれる「records 部分」から、
    // 指定idに対応する要素を求めて返却します
    // 該当する要素がない場合は false を返却します
    //
    // ここで扱うJSONオブジェクトには、次の構造が含まれることを想定しています
    // json_obj["records"][index]["id"]  (index:0～)
    //
    // 入力値:
    //   json_obj       : 検索対象のJSONオブジェクト
    //   id             : 検索ID
    // 戻り値:
    //   オブジェクト   : 検索された要素(オブジェクト)
    //   false          : 該当なし または json_obj["records"] なしの場合
   ,getJSONChunkByIdAtRecords: function(json_obj, id) {
      return(this.getJSONChunkById(json_obj["records"], id));
    }

    // JSONオブジェクトから、
    // 指定項目名(ハッシュキー)・指定配列名 による抽出を行います
    // 次の処理を指定項目名の数だけ行い、生成されたオブジェクトを返却します
    // (1)指定項目名による部分オブジェクトを求め
    // (2)さらに、指定配列名による部分オブジェクト(配列)を求め
    // (3)指定インデックスの要素を抽出して新しいオブジェクトを生成する
    //
    // 抽出ができなかった場合は false を返します
    //
    // 入力値:
    //   json_obj       : 抽出元JSONオブジェクト
    //   array_hash_key : 抽出するハッシュキー(配列)
    //   index          : 抽出する配列インデックス(def:'.*')
    //                    数値・正規表現文字列・正規表現を受け付けます
    //   value_name     : 抽出する配列名(def:value)
    // 戻り値:
    //   １つでも抽出できた場合 : 抽出された内容を含む、生成オブジェクト
    //   何も抽出しなかった場合 : false
   ,filterJSONChunkByHashKey:
    function(json_obj, array_hash_key, index, value_name) {
      var result = false;
      // 抽出元の配列名
      var value_name = App.AppSpecMixin.replaceIfNotExists(value_name, 'value');
      // 抽出する配列のindex
      var index = App.AppSpecMixin.convertIndexToRegExp(index);
      // 指定キーの項目分ループ
      for (var i = 0, n = array_hash_key.length; i < n; i++) {
        var key = array_hash_key[i];
        // キーに該当する部分を求める
        var temp_obj = App.AppSpecMixin.getJSONChunkByHashKey(json_obj, key);
        if (temp_obj !== false) {
          // 配列名に該当する部分を求める
          temp_obj = App.AppSpecMixin.getJSONChunkByHashKey(temp_obj[key], value_name);
          if ((temp_obj !== false) &&
              (App.AppSpecMixin.typeOf(temp_obj[value_name]) == 'array')) {
            temp_obj = temp_obj[value_name];
            // 戻り値の再初期化
            if (result === false) {
              result = {};
            }
            // 項目を複写して戻り値へ格納
            var temp = [];
            for (var j = 0, m = temp_obj.length; j < m; j++) {
              if (j.toString().match(index) != null) {
                temp.push(temp_obj[j]);
              }
            }
            result[key] = {};
            result[key][value_name] = temp;
          }
        }
      }
      return(result);
    }

    // 配列インデックス指定を正規表現に変換します
    // 入力値:
    //   index          : 配列インデックス(def:'.*')
    //                    数値・正規表現文字列・正規表現を受け付けます
    // 戻り値:
    //                  : 変換された正規表現
   ,convertIndexToRegExp: function(index) {
      var result = App.AppSpecMixin.replaceIfNotExists(index, '.*');
      switch (App.AppSpecMixin.typeOf(result)) {
      case 'regexp':
        break;
      case 'number':
        result = new RegExp('^' + result.toString() + '$');
        break;
      case 'string':
        if (App.AppSpecMixin.isNumeric(result, false)) {
          result = new RegExp('^' + result + '$');
        } else {
          result = new RegExp(result);
        }
        break;
      default:
        result = new RegExp('.*');
        break;
      }
      return(result);
    }

    // コンテナ名・関数名 で指定された関数を求めます
    // ⇒ $R.Application.<アプリケーション名>.<コンテナ名>.fn.<関数名>
    // 入力値:
    //   container_name : 検索コンテナ名(Model, View, Controller, …)
    //   function_name  : 検索関数名
    // 戻り値:
    //   検索条件に合致する関数オブジェクトを返却します
    //   検索条件に合致するものがなければ false を返却します
   ,getCallbackFunction: function(container_name, function_name) {
      var result = false;
      // 内部に container_name と合致するオブジェクトを含むものを求める
      var application = App.AppSpecMixin.getJSONChunkByHashKey($R.Application, container_name);
      if (application !== false) {
        // fn オブジェクトを求める
        var fn_obj = application[container_name].fn;
        if (fn_obj) {
          // 内部に function_name と合致するオブジェクトがある場合
          if (function_name in fn_obj) {
            // 該当オブジェクトが関数の場合は戻り値設定
            if (typeof(fn_obj[function_name]) == 'function') {
              result = fn_obj[function_name];
            }
          }
        }
      }
      // 戻り値返却
      return(result);
    }

  };

}(jQuery, Rmenu));
