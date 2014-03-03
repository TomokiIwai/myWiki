/// <reference path="typings/backbone/backbone.d.ts"/>
/// <reference path="typings/underscore/underscore.d.ts"/>
/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="templates.ts" />

/**
 * コンパイルコマンド
 *
 * tsc backbone_test.ts template.ts --out backbone_test.js
 */

/**
 * Taskモデルクラス
 */
class Task extends Backbone.Model
{
    defaults()
    {
        return { name : "", completed : false, isEditing : false};
    }

    destroy()
    {
        this.trigger("destroy", this);
    }
}

/**
 * Taskコレクションクラス
 */
class TaskList extends Backbone.Collection
{
    model = Task;

    /**
     * コンストラクタ
     */
    constructor()
    {
        super();

        this.bind("add", this._onAdd, this);
    }

    /**
     * 要素追加時のコールバックメソッド
     * @param task
     * @private
     */
    private _onAdd(task: Task)
    {
        this.listenTo(task, "destroy", this._onDestroy);
    }

    /**
     * 要素削除時のコールバックメソッド
     * @param task
     * @private
     */
    private _onDestroy(task: Task)
    {
        this.remove(task);
    }
}

/**
 * Taskビュークラス
 */
class TaskView extends Backbone.View
{
    template : (...data: any[]) => string;

    /**
     * コンストラクタ
     * @param options
     */
    constructor(options?)
    {
        options["tagName"] = "div";
//        this.tagName = "div";

        super(options);

        this.template = _.template(TMPLS.TaskView);

        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "error", this._onError);
    }

    events()
    { 
        return {
            "change input[type=checkbox]" : "_onCheck",
            "click a.edit-link" : "_onEdit",
            "click input.save-input" : "_onSave",
            "click input.cancel-input" : "_onCancel",
            "click input.delete-input" : "_onDelete"
        };
    }

    private _onError(model, error)
    {
        alert(error);
    }

    private _onCheck()
    {
        var completed = this.model.get("completed");
        this.model.set({ completed : !completed });
    }

    private _onEdit()
    {
        this.model.set("isEditing", true);
    }

    private _onSave()
    {
        var name = $(this.el).find("input.name-input").first().val();
        this.model.set({ name : name, isEditing : false });
    }

    private _onCancel()
    {
        this.model.set("isEditing", false);
    }

    private _onDelete()
    {
        this.model.destroy();
    }

    render()
    {
        var data = this.model.toJSON();
        var html = this.template(data);
        this.$el.html(html);

        return this;
    }
}

class TaskListView extends Backbone.View
{
    $name_input : JQuery;
    $task_list : JQuery;

    events()
    {
        return {
            "click #add-input" : "_onAddInputClick"
        };
    }

    constructor(options?)
    {
        super(options);

//        this.setElement($("#main"), true);
        this.collection = new Backbone.Collection();
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);

        this.$name_input = $("#name-input");
        this.$task_list = $("#task-list");
    }

    private _onAddInputClick()
    {
        var name = this.$name_input.val();
        if (_.isEmpty(name))
        {
            alert("task name is empty.");
            return;
        }

        var task = new Task({ "name" : name });
        this.collection.add(task);
        this.$name_input.val("");
    }

    /**
     * @override
     * @returns {TaskListView}
     */
    render()
    {
        this.$task_list.empty();

        this.collection.each(task =>
        {
            var view = new TaskView({ model : task });
            view.render();
            this.$task_list.append(view.el);
        });

        return this;
    }
}

$(() => {
    var mainView = new TaskListView({ collection : new TaskList(), el : "#main" });
    mainView.render();
});
