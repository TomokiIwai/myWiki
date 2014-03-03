/// <reference path="../typings/backbone/backbone.d.ts"/>
/// <reference path="../typings/underscore/underscore.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/marked/marked.d.ts"/>
/// <reference path="../typings/highlightjs/highlightjs.d.ts"/>
/// <reference path="../model/WikiModel.ts"/>
/// <reference path="../template/ContentTmpl.ts"/>

/**
 * content Viewクラス
 */
class ContentView extends Backbone.View
{
    template : (...data: any[]) => string;
    wikiId : number;

    /**
     * コンストラクタ
     * @param options
     */
    constructor(options?)
    {
        marked.setOptions({
            highlight: function(code) {
                return hljs.highlightAuto(code).value;
            }
        });

        options = options ? options : {};
        options['el'] = '#content';

        super(options);

        this.wikiId = options['wikiId'];

        this.template = _.template(ContentTmpl.format);

        this.model = new WikiModel({ id : this.wikiId });

        this.listenTo(this.model, "change", this.render);

        this.model.fetch();
    }

    /**
     * レンダリングする。
     * @override
     * @returns {ContentView}
     */
    render()
    {
        if (this.model.has('content'))
        {
            // Markdown記法をパース
            var result = marked.parse(this.model.get('content'));

            // テンプレートを使用してHTMLを作成し、描画
            this.$el.html(this.template({ content : result }));
        }

        return this;
    }
}