var vertx = require('vertx');
// イベントバス
var eb = vertx.eventBus;

exports = 
{
    insert : function(wiki_id, tag_ids, callback)
    {
        params = {
            action : 'insert',
            stmt : 'INSERT IGNORE INTO rel_wiki_tag(wiki_id, tag_id) VALUES (?, ?)',
            values : tag_ids.map(function(tag) { return [wiki_id, tag]; })
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