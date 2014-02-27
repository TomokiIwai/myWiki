var vertx = require('vertx');
var container = require('vertx/container');
// tagテーブルDAO
var tagDao = require('lib/dao/tagDao.js');
// HTTPユーティリティ
var httputil = require('lib/httputil.js');
// イベントバス
var eb = vertx.eventBus;
// ロガー
var logger = container.logger;

var console = require('vertx/console');

/**
 * ディスパッチャ
 * @param {type} req
 * @returns {undefined}
 */
function execute(req)
{
    if (req.method() === 'GET')
    {
        return get(req);
    }
//    else if (req.method() === 'POST')
//    {
//        return post(req);
//    }
    
    httputil.notFound(req.response);
}

/**
 * GETリクエストハンドラー
 * @param {type} req
 * @returns {undefined}
 */
function get(req)
{
    tagDao.select(function(result)
    {
        req.response.putHeader('Content-Type', 'text/html; charset=utf-8');

        req.response.end(JSON.stringify(result.map(function(tag) { return tag['name']; })));
        
//        req.response.chunked(true);
//
//        for each(row in result)
//        {
//            req.response.write(row.id + " : " + row.title + " : " + row.content);
//        }
//            
//        req.response.end();
    });
}

module.exports = execute;