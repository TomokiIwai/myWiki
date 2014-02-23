/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function(){
    
    /////////////////////////////////////////////
    // Markdownコンパイラの初期設定
    /////////////////////////////////////////////
    marked.setOptions({
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });
    
    /////////////////////////////////////////////
    // プレビューウィンドウの初期設定
    /////////////////////////////////////////////
    $("#preview").css({
        "top" : $(".content").position().top + 10,
        "left" : $(".content").width() / 2
    }).draggable();

    /////////////////////////////////////////////
    // Markdown入力域のイベント設定
    /////////////////////////////////////////////
    $("#source").bind("keyup", function(e){
       $("#preview").html(marked.parse($("#source").val()));
    });
});
