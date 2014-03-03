/// <reference path="../typings/backbone/backbone.d.ts"/>
/// <reference path="../typings/underscore/underscore.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../view/ContentView.ts"/>
/// <reference path="../template/WikilistTmpl.ts" />
/// <reference path="../model/WikiModel.ts" />

/**
 * wikilist Viewクラス
 */
class WikilistView extends Backbone.View
{
    template : (...data: any[]) => string;

    events()
    {
        return {
            "click .item" : "_onClickWikilistItem"
        };
    }

    /**
     * コンストラクタ
     * @param options
     */
    constructor(options?)
    {
        options = options ? options : {};
        options['el'] = '#wikilist';

        super(options);

        this.template = _.template(WikilistTmpl.format);

        this.collection = new WikiCollection;

        this.listenTo(this.collection, "add", this.render);

        // wiki一覧を取得
        this.collection.fetch();
    }

    /**
     * Wikiタイトルクリックハンドラー
     * @param e
     * @private
     */
    private _onClickWikilistItem(e)
    {
        var wikiId = $(e.target).attr('wikiId');

        new ContentView({ wikiId : wikiId });
    }

    /**
     * wikilistをレンダリングする。
     * @override
     * @returns {WikilistView}
     */
    render()
    {
        // collectionの内容について、テンプレートを使用してHTMLを作成
        var result = this.collection.reduce(function (memo, value)
        {
            return memo + this.template(value.toJSON());
        }, "", this);

        // 描画
        this.$el.html(result);

        return this;
    }
}