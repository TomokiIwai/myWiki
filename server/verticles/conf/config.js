configs =
{
    ///////////////////////////////////////////////////
    // サーバ設定
    ///////////////////////////////////////////////////
    SERVER_PORT : 8080,
    SERVER_HOST : 'localhost',
    
    ///////////////////////////////////////////////////
    // DB初期化
    ///////////////////////////////////////////////////
    DB_INIT_SQL : [
        'SET NAMES utf8',
        
        'CREATE TABLE IF NOT EXISTS wiki ('+
            'id integer NOT NULL AUTO_INCREMENT,'+
            'title varchar(500) NOT NULL,'+
            'content text NOT NULL,'+
            'PRIMARY KEY (`id`)'+
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8',

        'CREATE TABLE IF NOT EXISTS tag ('+
            'id integer NOT NULL AUTO_INCREMENT,'+
            'name varchar(500) NOT NULL,'+
            'PRIMARY KEY (`id`)'+
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8',

        'CREATE TABLE IF NOT EXISTS rel_wiki_tag ('+
            'wiki_id integer NOT NULL,'+
            'tag_id integer NOT NULL,'+
            'PRIMARY KEY (`wiki_id`, `tag_id`)'+
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8'
    ],
    
    ///////////////////////////////////////////////////
    // DB接続設定(mywikiスキーマ)
    ///////////////////////////////////////////////////
    DB_DEFAULT : {
        name     : 'com.bloidonia~mod-jdbc-persistor~2.1',
        address  : 'mysql',
        driver   : 'com.mysql.jdbc.Driver',
        url      : 'jdbc:mysql://www22230u.sakura.ne.jp:3306/mywiki',
        username : 'myWiki_rw',
        password : 'myWiki_rw',
        minpool  : 5,
        maxpool  : 20,
        acquire  : 5
    }
};

module.exports = configs;