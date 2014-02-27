exports =
{
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
//    unpackParam : function(str)
//    {
//        if (!str) { return null; }
//        
//        try
//        {
//            elements = str.split('&');
//
//            result = {};
//
//            for each(element in elements)
//            {
//                tmp = element.split('=');
//                k = tmp[0];
//                v = tmp[1];
//
//                result[k] = decodeURIComponent(v);
//            }
//
//            return result;
//        }
//        catch (e)
//        {
//            return null;
//        }
//    }
};

module.exports = exports;
