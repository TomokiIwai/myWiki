//var console = require('vertx/console');

exports =
{
    /**
     * レスポンスオブジェクトに400 Bad Requestを設定するユーティリティ関数
     * @param {type} res
     * @returns {undefined}
     */
    badRequest : function(res)
    {
        res.statusCode(400);
        res.end('Bad Request');
    },
    
    notFound : function(res)
    {
        res.statusCode(404);
        res.end('Not Found.');
    },
    
//    packParam : function(map)
//    {
//        if (map.constructor !== Object)
//        {
//            return null;
//        }
//        
//        result = [];
//        
//        for (k in map)
//        {
//            result.push([k, encodeURIComponent(map[k])].join('='));
//        }
//        
//        return result.join('&');
//    },
    unpackParam : function(str)
    {
        if (!str) { return null; }
        
        try
        {
            elements = str.split('&');

            result = {};

            for each(element in elements)
            {
                tmp = element.split('=');
                k = tmp[0];
                v = tmp[1];

                result[k] = decodeURIComponent(v.replace(/\+/g, " "));
            }

            return result;
        }
        catch (e)
        {
            return null;
        }
    }
};

module.exports = exports;
