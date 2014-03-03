/// <reference path="../typings/backbone/backbone.d.ts"/>
/// <reference path="../typings/underscore/underscore.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>

/**
 * wiki Modelクラス
 */
class WikiModel extends Backbone.Model
{
    urlRoot = 'http://localhost:8080/wiki';

    /**
     * コンストラクタ
     * @param attributes
     * @param options
     */
    constructor(attributes?: any, options?: any)
    {
        super(attributes, options);
    }

    defaults()
    {
        return { id : null, title : null, content : null};
    }

    destroy()
    {
//        this.trigger("destroy", this);
    }
}

/**
 * wiki Collectionクラス
 */
class WikiCollection extends Backbone.Collection
{
    model = WikiModel;
    url = 'http://localhost:8080/wiki';
}
