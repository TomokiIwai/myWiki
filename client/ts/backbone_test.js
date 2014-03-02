var TMPLS = (function () {
    function TMPLS() {
    }
    TMPLS.TaskView = "\
<% if (isEditing) { %>\
    <input class='name-input' type='text' value='<%= name %>'/>\
    <input class='save-input' type='button' value='save'/>\
    <input class='cancel-input' type='button' value='cancel'/>\
    <input class='delete-input' type='button' value='delete'/>\
<% } else { %>\
    <% if (completed) { %>\
        <input type='checkbox' checked><del><%= name %></del></input>\
    <% } else { %>\
        <input type='checkbox'><%= name %></input>\
    <% } %>\
    \
    <a class='edit-link' href='javascript:void(0);'>[edit]</a>\
<% } %>\
";
    return TMPLS;
})();
/// <reference path="typings/backbone/backbone.d.ts"/>
/// <reference path="typings/underscore/underscore.d.ts"/>
/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="templates.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* コンパイルコマンド
*
* tsc backbone_test.ts templates.ts --out backbone_test.js
*/
/**
* Taskモデルクラス
*/
var Task = (function (_super) {
    __extends(Task, _super);
    function Task() {
        _super.apply(this, arguments);
    }
    Task.prototype.defaults = function () {
        return { name: "", completed: false, isEditing: false };
    };

    Task.prototype.destroy = function () {
        this.trigger("destroy", this);
    };
    return Task;
})(Backbone.Model);

/**
* Taskコレクションクラス
*/
var TaskList = (function (_super) {
    __extends(TaskList, _super);
    /**
    * コンストラクタ
    */
    function TaskList() {
        _super.call(this);
        this.model = Task;

        this.bind("add", this._onAdd, this);
    }
    /**
    * 要素追加時のコールバックメソッド
    * @param task
    * @private
    */
    TaskList.prototype._onAdd = function (task) {
        this.listenTo(task, "destroy", this._onDestroy);
    };

    /**
    * 要素削除時のコールバックメソッド
    * @param task
    * @private
    */
    TaskList.prototype._onDestroy = function (task) {
        this.remove(task);
    };
    return TaskList;
})(Backbone.Collection);

/**
* Taskビュークラス
*/
var TaskView = (function (_super) {
    __extends(TaskView, _super);
    /**
    * コンストラクタ
    * @param options
    */
    function TaskView(options) {
        options["tagName"] = "div";

        //        this.tagName = "div";
        _super.call(this, options);

        this.template = _.template(TMPLS.TaskView);

        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "error", this._onError);
    }
    TaskView.prototype.events = function () {
        return {
            "change input[type=checkbox]": "_onCheck",
            "click a.edit-link": "_onEdit",
            "click input.save-input": "_onSave",
            "click input.cancel-input": "_onCancel",
            "click input.delete-input": "_onDelete"
        };
    };

    TaskView.prototype._onError = function (model, error) {
        alert(error);
    };

    TaskView.prototype._onCheck = function () {
        var completed = this.model.get("completed");
        this.model.set({ completed: !completed });
    };

    TaskView.prototype._onEdit = function () {
        this.model.set("isEditing", true);
    };

    TaskView.prototype._onSave = function () {
        var name = $(this.el).find("input.name-input").first().val();
        this.model.set({ name: name, isEditing: false });
    };

    TaskView.prototype._onCancel = function () {
        this.model.set("isEditing", false);
    };

    TaskView.prototype._onDelete = function () {
        this.model.destroy();
    };

    TaskView.prototype.render = function () {
        var data = this.model.toJSON();
        var html = this.template(data);
        this.$el.html(html);

        return this;
    };
    return TaskView;
})(Backbone.View);

var TaskListView = (function (_super) {
    __extends(TaskListView, _super);
    function TaskListView(options) {
        _super.call(this, options);

        //        this.setElement($("#main"), true);
        this.collection = new Backbone.Collection();
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);

        this.$name_input = $("#name-input");
        this.$task_list = $("#task-list");
    }
    TaskListView.prototype.events = function () {
        return {
            "click #add-input": "_onAddInputClick"
        };
    };

    TaskListView.prototype._onAddInputClick = function () {
        var name = this.$name_input.val();
        if (_.isEmpty(name)) {
            alert("task name is empty.");
            return;
        }

        var task = new Task({ "name": name });
        this.collection.add(task);
        this.$name_input.val("");
    };

    TaskListView.prototype.render = function () {
        var _this = this;
        this.$task_list.empty();

        this.collection.each(function (task) {
            var view = new TaskView({ model: task });
            view.render();
            _this.$task_list.append(view.el);
        });

        return this;
    };
    return TaskListView;
})(Backbone.View);

$(function () {
    var mainView = new TaskListView({ collection: new TaskList(), el: "#main" });
    mainView.render();
});
