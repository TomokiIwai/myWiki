/// <reference path="../typings/backbone/backbone.d.ts"/>
/// <reference path="../typings/underscore/underscore.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="WikilistView.ts" />

/**
 * main Viewクラス
 */
class MainView extends Backbone.View
{
    /**
     * コンストラクタ
     * @param options
     */
    constructor(options?)
    {
        options = options ? options : {};
        options['el'] = '#main';

        super(options);
    }

    /**
     * @override
     * @returns {MainView}
     */
    render()
    {
        new WikilistView().render();

        return this;
    }
}