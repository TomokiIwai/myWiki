/// <reference path="../typings/backbone/backbone.d.ts"/>
/// <reference path="../typings/underscore/underscore.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* wiki Modelクラス
*/
var WikiModel = (function (_super) {
    __extends(WikiModel, _super);
    /**
    * コンストラクタ
    * @param attributes
    * @param options
    */
    function WikiModel(attributes, options) {
        _super.call(this, attributes, options);
        this.urlRoot = 'http://localhost:8080/wiki';
    }
    WikiModel.prototype.defaults = function () {
        return { id: null, title: null, content: null };
    };

    WikiModel.prototype.destroy = function () {
        //        this.trigger("destroy", this);
    };
    return WikiModel;
})(Backbone.Model);

var WikiCollection = (function (_super) {
    __extends(WikiCollection, _super);
    function WikiCollection() {
        _super.apply(this, arguments);
        this.model = WikiModel;
        this.url = 'http://localhost:8080/wiki';
    }
    return WikiCollection;
})(Backbone.Collection);
var ContentTmpl = (function () {
    function ContentTmpl() {
    }
    ContentTmpl.format = "\
<%= content %>\
";
    return ContentTmpl;
})();
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
var ContentView = (function (_super) {
    __extends(ContentView, _super);
    /**
    * コンストラクタ
    * @param options
    */
    function ContentView(options) {
        marked.setOptions({
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            }
        });

        options = options ? options : {};
        options['el'] = '#content';

        _super.call(this, options);

        this.wikiId = options['wikiId'];

        this.template = _.template(ContentTmpl.format);

        this.model = new WikiModel({ id: this.wikiId });

        this.listenTo(this.model, "change", this.render);

        this.model.fetch();
    }
    /**
    * @override
    * @returns {ContentView}
    */
    ContentView.prototype.render = function () {
        var content = this.model.get('content');
        if (content) {
            var result = marked.parse(content);

            //, function(result)
            //{
            //    this.$el.html(this.template({ content : content}));
            //});
            this.$el.html(this.template({ content: result }));
        }

        //        this.$task_list.empty();
        //
        //        this.collection.each(task =>
        //        {
        //            var view = new TaskView({ model : task });
        //            view.render();
        //            this.$task_list.append(view.el);
        //        });
        return this;
    };
    return ContentView;
})(Backbone.View);
var WikilistTmpl = (function () {
    function WikilistTmpl() {
    }
    WikilistTmpl.format = "\
<li><a href='#' class='item' wikiId=<%= id %>><%= title %></a></li>\
";
    return WikilistTmpl;
})();
/// <reference path="../typings/backbone/backbone.d.ts"/>
/// <reference path="../typings/underscore/underscore.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../view/ContentView.ts"/>
/// <reference path="../template/WikilistTmpl.ts" />
/// <reference path="../model/WikiModel.ts" />
/**
* wikilist Viewクラス
*/
var WikilistView = (function (_super) {
    __extends(WikilistView, _super);
    /**
    * コンストラクタ
    * @param options
    */
    function WikilistView(options) {
        options = options ? options : {};
        options['el'] = '#wikilist';

        _super.call(this, options);

        this.template = _.template(WikilistTmpl.format);

        this.collection = new WikiCollection;

        this.listenTo(this.collection, "add", this.render);

        // wiki一覧を取得
        this.collection.fetch();
    }
    WikilistView.prototype.events = function () {
        return {
            "click .item": "_onClickWikilistItem"
        };
    };

    /**
    * Wikiタイトルクリックハンドラー
    * @param e
    * @private
    */
    WikilistView.prototype._onClickWikilistItem = function (e) {
        var wikiId = $(e.target).attr('wikiId');

        new ContentView({ wikiId: wikiId });
        //        var name = this.$name_input.val();
        //        if (_.isEmpty(name))
        //        {
        //            alert("task name is empty.");
        //            return;
        //        }
        //
        //        var task = new Task({ "name" : name });
        //        this.collection.add(task);
        //        this.$name_input.val("");
    };

    /**
    * wikilistをレンダリングする。
    * @override
    * @returns {WikilistView}
    */
    WikilistView.prototype.render = function () {
        this.$el.empty();

        this.$el.html(this.collection.reduce(function (memo, value) {
            return memo + this.template(value.toJSON());
        }, "", this));

        return this;
    };
    return WikilistView;
})(Backbone.View);
/// <reference path="../typings/backbone/backbone.d.ts"/>
/// <reference path="../typings/underscore/underscore.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="WikilistView.ts" />
/**
* main Viewクラス
*/
var MainView = (function (_super) {
    __extends(MainView, _super);
    /**
    * コンストラクタ
    * @param options
    */
    function MainView(options) {
        options = options ? options : {};
        options['el'] = '#main';

        _super.call(this, options);
        //        this.collection = new Backbone.Collection();
        //        this.listenTo(this.collection, "add", this.render);
        //        this.listenTo(this.collection, "remove", this.render);
    }
    MainView.prototype.events = function () {
        return {};
    };

    //    private _onAddInputClick()
    //    {
    //        var name = this.$name_input.val();
    //        if (_.isEmpty(name))
    //        {
    //            alert("task name is empty.");
    //            return;
    //        }
    //
    //        var task = new Task({ "name" : name });
    //        this.collection.add(task);
    //        this.$name_input.val("");
    //    }
    /**
    * @override
    * @returns {MainView}
    */
    MainView.prototype.render = function () {
        new WikilistView().render();

        //        this.$task_list.empty();
        //
        //        this.collection.each(task =>
        //        {
        //            var view = new TaskView({ model : task });
        //            view.render();
        //            this.$task_list.append(view.el);
        //        });
        return this;
    };
    return MainView;
})(Backbone.View);
/// <reference path="typings/backbone/backbone.d.ts"/>
/// <reference path="typings/underscore/underscore.d.ts"/>
/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="view/MainView.ts" />
$(function () {
    new MainView().render();
});
