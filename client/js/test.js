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
    // Wikiリストの表示
    /////////////////////////////////////////////
    $.getJSON('http://localhost:8080/wiki/', function(data)
    {
        list = $("#wikilist").empty();
        $.each(data, function(i, v)
        {
            list.append($("<li>").attr("wiki_id", v.id).text(v.title).click(function()
            {
                $.getJSON('http://localhost:8080/wiki/' + v.id + '/', function(wikiContent)
                {
                    $("#source").hide();
                    $("#preview").hide();
                    $("#screen").show().html(marked.parse(wikiContent.content));
                });
            }));
        });
    });

    /////////////////////////////////////////////
    // Markdown入力域のイベント設定
    /////////////////////////////////////////////
    $("#source").bind("keyup", function(e){
       $("#preview").html(marked.parse($("#source").val()));
    });
});
