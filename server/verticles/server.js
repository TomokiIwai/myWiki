load('lib/sugar/sugar-full.min.js');

var vertx = require('vertx');
var http = require('vertx/http');
var container = require('vertx/container');
var console = require('vertx/console');
var conf = require('conf/config.js');

///////////////////////////////////////////////////
// 初期化
///////////////////////////////////////////////////
// サーバ
var server = http.createHttpServer();
// ルータ
var router = new http.RouteMatcher();
// イベントバス
var eb = vertx.eventBus;
// ロガー
var logger = container.logger;

///////////////////////////////////////////////////
// 関数定義
///////////////////////////////////////////////////
/**
 * モジュールを停止する。
 * @returns {undefined}
 */
function exit()
{
    server.close(function() {
        console.log('Server closed.');
        container.exit();
    });
}

///////////////////////////////////////////////////
// ルーティング
///////////////////////////////////////////////////
// Hello World
router.get('/hello', function(req) {
    req.response.end('<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body>' +
        '<form action="wiki" method="post">'+
        'Title:<input type="text" name="title"><br/>'+
        'Content:<br/><textarea name="content"></textarea><br/>'+
        'Tags:<input type="text" name="tag"><input type="text" name="tag">'+
        '<input type="submit">'+
        '</form></body></html>');
});

// サーバ停止
router.get('/close', function(req) {
    req.response.end('Server closed.');
    exit();
});

// wiki
var wikiHandler = require('lib/module/wiki.js');
router.all('/wiki', wikiHandler);

// tag
var tagHandler = require('lib/module/tag.js');
router.all('/tag', tagHandler);

///////////////////////////////////////////////////
// mysql接続モジュール起動
///////////////////////////////////////////////////
container.deployModule(conf.DB_DEFAULT.name, conf.DB_DEFAULT, true, function() {
    
    var initFunc = function(message)
    {
        if (!message || message.status !== 'ok')
        {
            exit();
            return;
        }
        console.log('mysql persistor launched.');
    };
    
    // 初期化SQLを実行
    conf.DB_INIT_SQL.reverse().each(function(sql)
    {
        var tmp = initFunc;
        initFunc = function(message)
        {
            if (!message || message.status !== 'ok')
            {
                exit();
                return;
            }
            
            console.log('[DB_INIT_SQL] ' + sql);
            
            eb.send(conf.DB_DEFAULT.address, { action : 'execute', stmt : sql }, tmp);
        };
    });
    
    initFunc({status : 'ok'});
});


///////////////////////////////////////////////////
// サーバ起動
///////////////////////////////////////////////////
server.requestHandler(router).listen(conf.SERVER_PORT, conf.SERVER_HOST, function(){ console.log('Server Started.'); });

//var foo = require('lib/stringutil.js');
//var hoge = require('lib/test.js');
//
//vertx.createHttpServer().requestHandler(function(req) {
//  req.response.end("Hello World!");
//
//  logger.info("This is test log message. I'll write japanese below..");
//  logger.info("日本語のログはUTF-8で出力されるのかな？");
//  logger.info("[aaa] is empty ? " + (foo.is_empty("aaa") ? "empty" : "not empty"));
////  logger.info("1 + 2 = " + hoge(1, 2));
//
//}).listen(8080, 'localhost');
