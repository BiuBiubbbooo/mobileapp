"use strict";

// ページ本体が読み込まれたタイミングで実行するコード
window.addEventListener("DOMContentLoaded",
  function() {

    // 1.localStorageが使えるか確認
    if (typeof localStorage === "undefined") {
      window.alert("このブラウザはLocal Storage機能が実装されていません");
      return;
    } else {
      viewStorage(); // localStorageからのデータの取得とテーブルへ表示
      saveLocalStorage();  // 2.localStorageへの保存
      delLocalStorage();   // 3.localStorageから1件削除
      allClearLocalStorage();  // 4.localStorageからすべて削除
      selectTable();       // 5.データ選択
    }

  }, false
);
  
// 2.localStorageへの保存
function saveLocalStorage() {
  const save = document.getElementById("save");
  save.addEventListener("click",
    function(e) {
       e.preventDefault();
       const key =document.getElementById("textKey").value;
       const value = document.getElementById("textMemo").value;

       // 値の入力チェック
       if (key =="" || value ==""){
         Swal.fire({
             title:"Memo app"  //   タイトルをここに設定
           , html :"Key、Memoはいずれも必須です。"  // メッセージ内容をここに設定
           , type :"error" // ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
           , allowOutsideClick : false    // 枠外クリックは許可しない
         });
         return;
       }else{
          let w_msg ="LocalStorageに\n「" + key + " " + value + " 」\nの内容を保存（save）しますか？"; 
          Swal.fire({
            title:"Memo app"           // タイトルをここに設定
            , html :w_msg              // メッセージ内容をここに設定
            , type :"question"         // ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
            , showCancelButton : true  // キャンセルボタンの表示
          }).then(function(result) {
              // 確認ダイアログで「OK」を押しされたとき、保存する。
                if (result.value === true) {
                  localStorage.setItem(key,value); 
                  viewStorage(); // localStorageからのデータの取得とテーブルへ表示
                  let w_msg = "LocalStorageに\n「" + key + " " + value + "」\nを保存(save)しました。";
                  Swal.fire({
                    title:"Memo app"            // タイトルをここに設定
                  , html :w_msg                 // メッセージ内容をここに設定
                  , type :"success"             // ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
                  , allowOutsideClick : false   // 枠外クリックは許可しない
                  });
                  document.getElementById("textKey").value = "";
                  document.getElementById("textMemo").value = "";
                }
              });
       }
    }, false
 );
};

// 3.localStorageから1件削除  //  version-up3 chg １件削除＝＝＞選択されている行を削除
function delLocalStorage() {
  const del = document.getElementById("del");
  del.addEventListener("click",
    function(e) {
      e.preventDefault();
      const chkbox1 = document.getElementsByName("chkbox1");  // version-up3 add
      const table1 = document.getElementById("table1");       // version-up3 add
      let w_cnt = 0;  // 選択されているチェックボックスの数が返却される  // version-up3 w_sel="0"==>w_cnt=0
      w_cnt = selectCheckBox(del);   // テーブルからデータ選択 version-up3 chg 戻り値:w_cnt 引数:なし==>"del"

      if(w_cnt >= 1){   // version-up3 chg w_sel === "1"==> w_cnt >= 1
        let w_msg = "LocalStorageから選択されている" + w_cnt + " 件を削除（delete）しますか？"; //version-up1 add
        // 確認ダイアログで「OK」を押しされたとき、削除する
        Swal.fire({
              title:"Memo app"          // タイトルをここに設定
            , html :w_msg               // メッセージ内容をここに設定
            , type :"question"          // ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
            , showCancelButton : true   // キャンセルボタンの表示
        }).then(function(result) {
              if (result.value === true) {
                for(let i = 0;i < chkbox1.length;i ++ ) { //version-up add
                  if(chkbox1[i].checked) {  //version-up add
                    localStorage.removeItem(table1.rows[i+1].cells[1].firstChild.data);  //version-up add
                  }  //version-up add
                }     //version-up add
              viewStorage(); // localStorageからのデータの取得とテーブルへ表示
              let w_msgg = "LocalStorageから" + w_cnt + "件を削除(delete)しました。 ";  //version-up add
              Swal.fire({
                  title:"Memo app"  //   タイトルをここに設定
                  , html :w_msgg  // メッセージ内容をここに設定
                  , type :"success" // ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
                  , allowOutsideClick : false    // 枠外クリックは許可しない
              });
              document.getElementById("textKey").value = "";
              document.getElementById("textMemo").value = "";
              }
         });
      }
    }, false
  );
};

// 4.localStorageからすべて削除
function allClearLocalStorage() {
  const allClear = document.getElementById("allClear");
  allClear.addEventListener("click",
    function(e) {
      e.preventDefault();
      let w_msg = "LocalStorageのデータをすべて削除（all clear）します。\nよろしいですか？"; 
      Swal.fire({
        title:"Memo app"          //  タイトルをここに設定
      , html :w_msg               // メッセージ内容をここに設定
      , type :"question"          // ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
      , showCancelButton : true   // キャンセルボタンの表示
      }).then(function(result) {
      // 確認ダイアログで「OK」を押しされたとき、すべて削除する
          if (result.value == true) {
            localStorage.clear(); 
            viewStorage(); // localStorageからのデータの取得とテーブルへ表示
            let w_msgg = "LocalStorageのデータをすべて削除（all clear）しました。";
            Swal.fire({
              title:"Memo app"  //   タイトルをここに設定
            , html :w_msgg  // メッセージ内容をここに設定
            , type :"success" // ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
            , allowOutsideClick : false    // 枠外クリックは許可しない
            });
            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
      });
    }, false
  );
};

// 5.データ選択
function selectTable() {
  const select = document.getElementById("select");
  select.addEventListener("click",
    function(e) {
      e.preventDefault;
      selectCheckBox(select);  // テーブルからデータ選択  version-up3 chg 引数:なし ==>"select"
    }, false
  ); 
}

// テーブルからデータ選択
function selectCheckBox(mode) {  // version-up3 chg 引数:なし ==> mode
  //let w_sel = "0";  //選択されていれば、"1"にする
  let w_cnt = 0;    //選択されているチェックボックスの数　//  version-up2 add
  const chkbox1 = document.getElementsByName("chkbox1");  // version-up2 chg:radio1 ==> chkbox1
  const table1 = document.getElementById("table1");
  let w_textKey = "";   // work version-up2 add
  let w_textMemo = "";  // work version-up2 add

  for(let i=0; i < chkbox1.length; i++) {  //  version-up2 chg:radio1 ==> chkbox1
    if(chkbox1[i].checked) {  //  version-up2 chg:radio1 ==> chkbox1
      if(w_cnt === 0) {  // 最初にチェックされている行をワークに退避　version-up2 add
        w_textKey = table1.rows[i+1].cells[1].firstChild.data;   // version-up2  chg  document.getElementById("textKey").value ==>  w_textKey
        w_textMemo = table1.rows[i+1].cells[2].firstChild.data;  // version-up2  chg  document.getElementById("textMemo").value ==>  w_textMemo
        // return w_sel = "1"; // version-up2 del
      } // version-up2 add
      w_cnt++;  //  選択されているチェックボックスの数をカウント　version-up2 add
    }
  }

  document.getElementById("textKey").value = w_textKey;
  document.getElementById("textMemo").value = w_textMemo;

  if(mode === select) {
    if (w_cnt === 1) {
      return w_cnt;   ////version-up chg  w_sel = "1" ==> w_cnt
    } 
    else {
      Swal.fire({
        title:"Memo app"  //   タイトルをここに設定
      , html :"1つ選択（select）してください。"  // メッセージ内容をここに設定
      , type :"error" // ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
      , allClearLocalStorage : false   // 枠外クリックは許可しない
      });
    }
  }

  if(mode === del) {
    if (w_cnt >= 1) {
      return w_cnt;   ////version-up chg  w_sel = "1" ==> w_cnt
    } 
    else {
      Swal.fire({
        title:"Memo app"  //   タイトルをここに設定
      , html :"1以上つ選択（select）してください。"  // メッセージ内容をここに設定
      , type :"error" // ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
      , allClearLocalStorage : false   // 枠外クリックは許可しない
      });
    }
  }
}



// localStorageからのデータの取得とテーブルへ表示
function viewStorage() {
  const list = document.getElementById("list");
  // htmlのテーブル初期化
  while(list.rows[0]) list.deleteRow(0);

  // localStorageすべての情報の取得
  for (let i=0; i < localStorage.length; i++) {
    let w_key = localStorage.key(i);
  
    // localStorageのキーと値を表示
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    list.appendChild(tr);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    td1.innerHTML = "<input name='chkbox1' type='checkbox'>";
    td2.innerHTML = w_key;
    td3.innerHTML = localStorage.getItem(w_key);
  }
  // jQueryのplugin tablesorterを使ってテーブルのソート
  // sortList: 引数 1...最初からソートしておく列を指定、引数2...0...昇順1...降順
  $("#table1").tablesorter({        //tablesort add
    sortList: [[1,0]]               //tablesort add
  });                               //tablesort add

  $("#table1").trigger("update");   //tablesort add
};

