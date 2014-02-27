var vertx = require('vertx');
// イベントバス
var eb = vertx.eventBus;

exports =
{
    /**
     * 最新の1件を取得する。
     * @param {type} callback
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
     * @param {type} title
     * @param {type} content
     * @param {type} callback
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