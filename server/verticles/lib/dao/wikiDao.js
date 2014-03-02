var vertx = require('vertx');
// イベントバス
var eb = vertx.eventBus;

exports =
{
    /**
     * 1件を取得する。
     * @param {integer} id
     * @param {function} callback
     * @returns {undefined}
     */
    select : function(id, callback)
    {
        params = {
            action : 'select',
            stmt   : 'SELECT id, title, content FROM wiki WHERE id = ?',
            values : [[id]]
        };
        
        eb.send('mysql', params, function(reply)
        {
            if (!reply || reply.status !== 'ok')
            {
                callback(null);
                return;
            }
            
            callback(reply.result);
        });
    },
    /**
     * 全件を取得する。
     * @param {function} callback
     * @returns {undefined}
     */
    selectAll : function(callback)
    {
        params = {
            action : 'select',
            stmt   : 'SELECT id, title, content FROM wiki ORDER BY id'
        };
        
        eb.send('mysql', params, function(reply)
        {
            if (!reply || reply.status !== 'ok')
            {
                callback(null);
                return;
            }
            
            callback(reply.result);
        });
    },
    /**
     * 最新の1件を取得する。
     * @param {function} callback
     * @returns {undefined}
     */
    selectLatest : function(callback)
    {
        params = {
            action : 'select',
            stmt   : 'SELECT id, title, content FROM wiki ORDER BY id DESC LIMIT 1'
        };
        
        eb.send('mysql', params, function(reply)
        {
            if (!reply || reply.status !== 'ok')
            {
                callback(null);
                return;
            }
            
            callback(reply.result);
        });
    },
    /**
     * レコードを登録する。
     * @param {string} title
     * @param {string} content
     * @param {function} callback
     * @returns {undefined}
     */
    insert : function(title, content, callback)
    {
        params = {
            action : 'insert',
            stmt : 'INSERT INTO wiki(title, content) VALUES(?, ?)',
            values : [[title, content]]
        };
        
        eb.send('mysql', params, function(reply)
        {
            if (!reply || reply.status !== 'ok')
            {
                callback(null);
                return;
            }
            
            callback(reply.result);
        });
    }
};

module.exports = exports;