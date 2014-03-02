var vertx = require('vertx');
var container = require('vertx/container');
// wikiテーブルDAO
var wikiDao = require('lib/dao/wikiDao.js');
// tagテーブルDAO
var tagDao = require('lib/dao/tagDao.js');
// rel_wiki_tagテーブルDAO
var wikiTagDao = require('lib/dao/relWikiTagDao.js');
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
    // TODO 削除 for debug code
    req.response.putHeader('Access-Control-Allow-Origin','*');

    if (req.method() === 'GET')
    {
        m = req.path().match(/^\/wiki\/([0-9]+)\/?$/);
        if (m)
        {
            return getOne(req, m[1]);
        }
        else
        {
            return getList(req);
        }
    }
    else if (req.method() === 'POST')
    {
        return post(req);
    }
    
    httputil.notFound(req.response);
}

/**
 * 単一wikiのGETリクエストハンドラー
 * @param {HttpServerRequest} req
 * @param {integer} id
 * @returns {undefined}
 */
function getOne(req, id)
{
    wikiDao.select(id, function(result)
    {
        req.response.putHeader('Content-Type', 'application/json; charset=utf-8');
        
        res = result ? result[0] : {};
        
        req.response.end(JSON.stringify(res));
    });
}

/**
 * wikiリストのGETリクエストハンドラー
 * @param {type} req
 * @returns {undefined}
 */
function getList(req)
{
    wikiDao.selectAll(function(result)
    {
        req.response.putHeader('Content-Type', 'application/json; charset=utf-8');
        
        res = result ? result : [];
        
        req.response.end(JSON.stringify(res));
    });
}

/**
 * POSTリクエストハンドラー
 * @param {type} req
 * @returns {undefined}
 */
function post(req)
{
    req.expectMultiPart(true);
    req.bodyHandler(function(data) {
        if (!data)
        {
            httputil.badRequest(req.response);
            return;
        }
        
        // パラメータ取得
//        params = req.formAttributes();
//        title = params.get('title');
//        content = params.get('content');
//        tags = params.getAll('tag');

        params = httputil.unpackParam(data.getString(0, data.length()));
        title = params['title'];
        content = params['content'];
        tags = params['tag'];
        
        // バリデーション
        if (!title || !content)
        {
            logger.info('Request parameter title or content is empty.');
            httputil.badRequest(req.response);
            return;
        }
        
        wikiDao.insert(title, content, function(wikiResult)
        {
            if (!wikiResult)
            {
                logger.error('Failed to insert wiki.');
                httputil.badRequest(req.response);
                return;
            }
            
            if (!tags || tags.isEmpty())
            {
                req.response.end('OK');
                return;
            }
            
            console.log("Wiki inserted.");
            
            // 採番されたwiki_id
            // TODO wiki insertをinsert ignoreにする？もしするなら、ここでIDが振られないパターンも考慮
            wikiId = Object.values(wikiResult[0])[0];
            tagDao.insert(tags, function(tagResult)
            {
                if (!tagResult)
                {
                    logger.error('Failed to insert tag.');
                    httputil.badRequest(req.response);
                    return;
                }
                
                console.log("Tag inserted.");

                tagIds = tagResult.map(function(tag)
                {
                    return Object.values(tag)[0];
                });
                
                wikiTagDao.insert(wikiId, tagIds, function(relResult)
                {
                    console.log("rel inserted.");

                    req.response.end('OK');
                });
            });
        });
    });
}

module.exports = execute;
