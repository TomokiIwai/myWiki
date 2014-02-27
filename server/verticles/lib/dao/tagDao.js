var vertx = require('vertx');
// イベントバス
var eb = vertx.eventBus;

exports =
{
    /**
     * レコードを取得する。
     * @param {type} callback
     * @returns {undefined}
     */
    select : function(callback)
    {
        params = {
            action : 'select',
            stmt : 'SELECT * FROM tag'
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
     * @param {type} names
     * @param {type} callback
     * @returns {undefined}
     */
    insert : function(names, callback)
    {
        params = {
            action : 'insert',
            stmt : 'INSERT INTO tag(name) VALUES (?)',
            values : names.map(function(name) { return [name]; })
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