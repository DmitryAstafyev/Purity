/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.Extended.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.Touch.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.Mutation.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Overhead.js" />
/// <reference path="~/Kernel/JS/Purity.CSS.Manipulation.js" />
/// <reference path="~/Kernel/JS/Purity.Controls.Window.js" />
/// <reference path="~/Kernel/JS/Purity.Controls.Tabs.js" />
/// <reference path="~/Kernel/JS/Purity.Controls.ScrollBox.js" />
/// <module>
///     <summary>
///         
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("Developer.Console",
            //Check references
            {
                modules     : ["Tools", "HTML", "Environment.Events", "Environment.Events.Touch", "Environment.Overhead", "Environment.Events.Mutation", "HTML.Extended", "CSS.Manipulation", "Controls.Window", "Controls.ScrollBox", "Controls.Tabs"],
                resources   : [{ url: "", name: "Purity.Developer.Console.css", path: "~/Kernel/CSS/", type: "jsic", cache: true, initas: "css", id: "Purity.Developer.Console.css" }]
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Developer.Console",
                    version         = "2.0",
                    lastUpdate      = "03.02.2014",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Configuration   = {},
                    Parameters      = {},
                    Initializer     = {},
                    Render          = {},
                    Actions         = {},
                    Switcher        = {},
                    PublicMethods   = {},
                    //Declaration references
                    HTML            = new Purity.initModule("HTML"                          ),
                    HTMLExtended    = new Purity.initModule("HTML.Extended"                 ),
                    Tools           = new Purity.initModule("Tools"                         ),
                    Overhead        = new Purity.initModule("Environment.Overhead"          ),
                    DOMEvents       = new Purity.initModule("Environment.Events"            ),
                    MutationEvents  = new Purity.initModule("Environment.Events.Mutation"   ),
                    CSS             = new Purity.initModule("CSS.Manipulation"              ),
                    Windows         = new Purity.initModule("Controls.Window"               ),
                    Tabs            = new Purity.initModule("Controls.Tabs"                 ),
                    ScrollBox       = new Purity.initModule("Controls.ScrollBox"            ),
                    TouchEvents     = new Purity.initModule("Environment.Events.Touch"      );
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Configuration   = {
                    makeups: {
                        events : {
                            container: {
                                container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.Events" },
                                filter      : {
                                    container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.Events.Filter" },
                                    icon        : {
                                        container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.Events.Filter.Icon" },
                                        value       : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.Events.Filter.Icon.Image" },
                                        settingup   : {
                                            parent: "container",
                                            childs: ["value"]
                                        }
                                    },
                                    input        : {
                                        container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.Events.Filter.Input" },
                                        value       : { node: "INPUT", name: "data-type-element", value: "Purity.Developer.Console.Events.Filter.Input" },
                                        settingup   : {
                                            parent: "container",
                                            childs: ["value"]
                                        }
                                    },
                                    settingup   : {
                                        parent: "container",
                                        childs: ["icon", "input"]
                                    }
                                },
                                content     : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.Events.Content" },
                                settingup   : {
                                    parent: "container",
                                    childs: ["filter", "content"]
                                }
                            },
                            record: {
                                container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.EventsRecord" },
                                pin         : {
                                    container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Pin.Container"   },
                                    value       : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Pin"             },
                                    settingup   : {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                icon        : {
                                    container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Icon.Container"   },
                                    value       : {
                                        container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Icon.SubContainer" },
                                        value       : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Icon" },
                                        settingup   : {
                                            parent: "container",
                                            childs: ["value"]
                                        }
                                    },
                                    settingup: {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                time        : {
                                    container   : { node: "DIV",    name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Time" },
                                    value       : { node: "P",      name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Time" },
                                    settingup: {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                count        : {
                                    container   : { node: "DIV",    name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Count" },
                                    value       : { node: "P",      name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Count" },
                                    settingup: {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                name        : {
                                    container   : { node: "DIV",    name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Name" },
                                    value       : { node: "P",      name: "data-type-element", value: "Purity.Developer.Console.EventsRecord.Name" },
                                    settingup: {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                settingup: {
                                    parent: "container",
                                    childs: ["pin", "icon", "time", "count", "name"]
                                }
                            }
                        },
                        console : {
                            record: {
                                container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.LogsRecord" },
                                message     : {
                                    container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.LogsRecord.Message" },
                                    time        : {
                                        container   : { node: "DIV",    name: "data-type-element", value: "Purity.Developer.Console.LogsRecord.Time" },
                                        value       : { node: "P",      name: "data-type-element", value: "Purity.Developer.Console.LogsRecord.Time" },
                                        settingup   : {
                                            parent: "container",
                                            childs: ["value"]
                                        }
                                    },
                                    text        : {
                                        container   : { node: "DIV",    name: "data-type-element", value: "Purity.Developer.Console.LogsRecord.Name" },
                                        value       : { node: "P",      name: "data-type-element", value: "Purity.Developer.Console.LogsRecord.Name" },
                                        settingup   : {
                                            parent: "container",
                                            childs: ["value"]
                                        }
                                    },
                                    settingup   : {
                                        parent: "container",
                                        childs: ["time", "text"]
                                    }
                                },
                                details     : {
                                    container   : { node: "DIV",    name: "data-type-element", value: "Purity.Developer.Console.LogsRecord.Details" },
                                    value       : { node: "P",      name: "data-type-element", value: "Purity.Developer.Console.LogsRecord.Details" },
                                    settingup   : {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                settingup: {
                                    parent: "container",
                                    childs: ["message", "details"]
                                }
                            }
                        },
                        lifeview: {
                            record: {
                                container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord" },
                                icon        : {
                                    container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord.Icon.Container"   },
                                    value       : {
                                        container   : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord.Icon.SubContainer" },
                                        value       : { node: "DIV", name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord.Icon" },
                                        settingup   : {
                                            parent: "container",
                                            childs: ["value"]
                                        }
                                    },
                                    settingup: {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                time        : {
                                    container   : { node: "DIV",    name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord.Time" },
                                    value       : { node: "P",      name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord.Time" },
                                    settingup: {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                value        : {
                                    container   : { node: "DIV",    name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord.Value" },
                                    value       : { node: "P",      name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord.Value" },
                                    settingup: {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                name        : {
                                    container   : { node: "DIV",    name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord.Name" },
                                    value       : { node: "P",      name: "data-type-element", value: "Purity.Developer.Console.LifeViewRecord.Name" },
                                    settingup: {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                settingup: {
                                    parent: "container",
                                    childs: ["icon", "time", "value", "name"]
                                }
                            }
                        }
                    },
                    other   : {
                        variables_group_name: "Purity_Controls_Tabs",
                        variable_list_name  : "List_Of_Instances",
                        global_id           : "Purity_Developer_Console"
                    },
                    tabs    : {
                        icons   : {
                            events      : {
                                image   : "url(data:image/png;base64,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5ZfXDw4O7gWARCKBRCKBQqEwqR+iM2lZJZNJLF++DAcPHvxg3brv33P11dd8/umnn37VdV10d+eQTqfriQql6lV9RJZzVgulqOcY6nr1ndVr+urf0KZkpvVKJBLI5RbB9308++yz/3b77bdftWHDhjsV882t+UnT95kmI0IIdHR0AAAOHTr03w8++OCt11676iubNr3wS0IIurt7kE6nwBirM6MYCucU1eusLqDGxiurefmJYU99jsWiyOVyoJTipZd++h933HHn9Y8//sSNR48effu0Zgen08RUsXnv3vd6v/nNb61ateq6m1555ZVfG0YEXV3dUDanwlZVGKyGCF5LtGgo9ZYhr996FBeJRNDd3YNIJIodO7bvveuuu+586KGHfvfAgQOvz6mReia6ubt37/7F7t27f7Fp05fvvP/++x5evfqWlalUGwqFPCqVSu1+Wc/Iwvau7LzxCfBTexuGgc7OTriuh9dee+3Q5s2bN/T19b1Ql9RcO8lnsmDp7e39eW9v789XrbruWw888Jffue6665al020oFquj7apDlCCEgnOAMdIQ86uCqiJC1zVks1kAwJtvvjnw4x//5One3t5nAZTPJM1npXZ9443XN15//fWXrFmz5q9+9au3B1OpNsybtwCxWBSaxsEYqfsCQpTjqwqHMY758+dj3rz56OvbXfrGN+5d/7Wv/fGlvb29f3emmT9rAqgta8eOHX/7pS9ddcndd9+9/r333jNTqTZks/MQjUbrlafy9pQyZLOd6OpaiH379sn77rvvuTVr1ly6c+fOtQBOni0iz0Vfe2jLli1rr7zyykvuv/++5z/44IBMJtPo6OisPf5C0N7ejlwuh8OHD+Phhx/adtttt31u+/bt3wZw+GwTd84a+5ZlHX7mmR/9+Re+cMWla9eu3XbsWD/i8QQ+85llGBgYwKOPPrJz9erVV23ZsvUux3H2niu6OM7xyufH31+/fv1dW7du/Ycnn3zyScuy4o899tiTo6Oj//JJzBY4PqE1MDDw63vuuefLADQA3idFB/n/f57+lK9PvQD+bwDvBM48rW2oYwAAAABJRU5ErkJggg==)",
                                width   : "2em",
                                height  : "2em"
                            },
                            console     : {
                                image   : "url(data:image/png;base64,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)",
                                width   : "2em",
                                height  : "2em"
                            },
                            lifeview    : {
                                image   : "url(data:image/png;base64,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)",
                                width   : "2em",
                                height  : "2em"
                            },
                            launcher    : {
                                image   : "url(data:image/png;base64,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)",
                                width   : "2em",
                                height  : "2em"
                            },
                        },
                        titles  : {
                            events      : "events",
                            console     : "console",
                            lifeview    : "lifeview",
                            launcher    : "launcher"
                        }
                    },
                };
                Parameters      = {
                    register    : function (data) {
                        var argument_data   = (typeof data  === "object" ? data : null),
                            data            = null;
                        if (argument_data !== null) {
                            data = Overhead.vars.set(Configuration.other.variables_group_name, Configuration.other.global_id, argument_data);
                            if (data !== null) {
                                return data;
                            }
                        }
                        return false;
                    },
                    get         : function () {
                        return Overhead.vars.get(Configuration.other.variables_group_name, Configuration.other.global_id);
                    },
                    del         : function () {
                        return Overhead.vars.del(Configuration.other.variables_group_name, Configuration.other.global_id);
                    },
                    generateID  : function () {
                        Configuration.other.global_id = Configuration.other.global_id + Tools.IDs.Get(6);
                    }
                };
                Initializer     = {
                    actions : {
                        register    : function () {
                            var parameters = Parameters.get();
                            if (parameters === null) {
                                parameters = Parameters.register({
                                    IDs     : {
                                        events  : {},
                                        console : {},
                                        lifeview: {},
                                        launcher: {}
                                    },
                                    nodes   : {
                                        events  : {},
                                        console : {},
                                        lifeview: {},
                                        launcher: {}
                                    },
                                    data    : {
                                        events  : {},
                                        console : {},
                                        lifeview: {},
                                        launcher: {}
                                    },
                                    setting    : {
                                        events  : {},
                                        console : {},
                                        lifeview: {},
                                        launcher: {}
                                    },
                                    rendered: null,
                                    mounted : null
                                });
                            }
                            return parameters;
                        },
                        open        : function (default_tab) {
                            var parameters  = Initializer.actions.register(),
                                tabs        = ["events", "lifeview", "console"],
                                default_tab = (typeof default_tab === "string" ? (tabs.indexOf(default_tab) !== -1 ? default_tab : tabs[0]) : tabs[0]);
                            if (parameters.mounted !== true) {
                                //Make container
                                Render.container.make();
                                //Make tabs
                                Render.tabs.events  ();
                                Render.tabs.console ();
                                Render.tabs.lifeview();
                                Render.tabs.launcher();
                                //Switch to last tab or default
                                Switcher.to(default_tab);
                                parameters.mounted = true;
                                //Restore events
                                Actions.events.add.restore();
                                //Restore console
                                Actions.console.add.restore();
                                //Rectore lifeview
                                Actions.lifeview.add.restore();
                                return true;
                            }
                            return false;
                        },
                        close: function () {
                            var parameters = Parameters.get();
                            if (parameters !== null) {
                                Switcher.to("events");
                                parameters.mounted  = false;
                                parameters.rendered = false;
                            }
                        }
                    }
                };
                Render          = {
                    container   : {
                        make    : function () {
                            var data        = {window : null, tabs : null},
                                parameters  = Parameters.get();
                            if (parameters !== null) {
                                data.window = Windows.open({
                                    parent      : document.body,
                                    layout      : {
                                        vertical    : "top",
                                        horizontal  : "right"
                                    },
                                    size        : {
                                        width       : "50%",
                                        height      : "50%"
                                    },
                                    buttons     : {
                                        close       : true,
                                        minimaze    : false,
                                        maximaze    : true
                                    },
                                    min_size    : {
                                        width       : 200,
                                        height      : 100
                                    },
                                    events      : {
                                        resize      : {
                                            start       : null,
                                            processing  : Render.container.resize,
                                            finish      : null
                                        },
                                        movement    : {
                                            start       : null,
                                            processing  : null,
                                            finish      : null
                                        },
                                        close       : {
                                            before      : Initializer.actions.close,
                                            after       : null
                                        },
                                        maximaze    : {
                                            before  : null,
                                            after   : Render.container.resize
                                        },
                                    },
                                    resize      : true,
                                    title       : name + " [" + version + "]"
                                });
                                data.tabs = Tabs.create({
                                    parent  : data.window.content,
                                    size    : {
                                        width   : "100%",
                                        height  : "100%"
                                    },
                                    tabs    : {
                                        layout  : "top"
                                    }
                                });
                                if (data.window !== null && data.tabs !== null) {
                                    parameters.IDs.window   = data.window.id;
                                    parameters.nodes.window = data.window.content;
                                    parameters.IDs.tabs     = data.tabs;
                                    parameters.rendered     = true;
                                } else {
                                    if (data.window !== null) {
                                        Windows.close(data.window.id);
                                    }
                                }
                            }
                        },
                        resize  : function () {
                            var parameters = Parameters.get();
                            if (parameters !== null) {
                                if (parameters.rendered === true) {
                                    ScrollBox.update.bars.both(parameters.IDs[parameters.current].scroll);
                                }
                            }
                        }
                    },
                    tabs        : {
                        common  : {
                            make    : function (tab_name, tab_content, scroll_parent) {
                                var tab         = null,
                                    scroll      = null,
                                    parameters  = Parameters.get();
                                if (parameters !== null) {
                                    if (parameters.rendered === true) {
                                        tab = Tabs.add({
                                            id      : parameters.IDs.tabs,
                                            tab_id  : Configuration.other.global_id + "_" + tab_name + "_tab",
                                            title   : Configuration.tabs.titles[tab_name],
                                            active  : false,
                                            icon    : Configuration.tabs.icons[tab_name],
                                            events  : {
                                                enter: function () { Switcher.enter(tab_name); },
                                                exit : null
                                            }
                                        });
                                        if (tab !== null) {
                                            if (tab_content !== null && scroll_parent !== null) {
                                                tab.content.appendChild(tab_content);
                                            }else{
                                                scroll_parent = tab.content;
                                            }
                                            scroll = ScrollBox.create({
                                                parent      : scroll_parent,
                                                id          : Configuration.other.global_id + "_" + tab_name + "_scroll",
                                                width       : "100%",
                                                height      : "100%",
                                                layout      : {
                                                    vertical    : "right",
                                                    horizontal  : "bottom"
                                                },
                                                visibility  : {
                                                    vertical    : "auto",
                                                    horizontal  : "auto"
                                                },
                                            });
                                            parameters.IDs[tab_name].scroll     = scroll.id;
                                            parameters.IDs[tab_name].tab        = tab.id;
                                            parameters.nodes[tab_name].content  = scroll.content;
                                        }
                                    }
                                }
                            }
                        },
                        events  : function () {
                            var nodes = HTMLExtended.Nodes.build(Configuration.makeups.events.container);
                            if (nodes !== null) {
                                Render.tabs.common.make("events", nodes.container, nodes.content);
                                //Attach events
                                Actions.events.filter.init(nodes.filter.input.value);
                            }
                        },
                        console : function () {
                            var nodes = HTMLExtended.Nodes.build(Configuration.makeups.events.container);
                            if (nodes !== null) {
                                Render.tabs.common.make("console", nodes.container, nodes.content);
                                //Attach events
                                Actions.console.filter.init(nodes.filter.input.value);
                            }
                        },
                        lifeview: function () {
                            Render.tabs.common.make("lifeview", null, null);
                        },
                        launcher: function () {
                            //Render.tabs.common.make("launcher", null, null);
                        },
                    }
                };
                Switcher        = {
                    to      : function (tab_name) {
                        var parameters  = Parameters.get();
                        if (parameters !== null) {
                            if (parameters.current !== tab_name) {
                                parameters.current = tab_name;
                                Tabs.switchTo(parameters.IDs.tabs, parameters.IDs[parameters.current].tab);
                            }
                        }
                    },
                    accept  : function (tab_name) {
                        var parameters = Parameters.get();
                        if (parameters !== null) {
                            parameters.current = tab_name;
                        }
                    },
                    enter   : function (tab_name) {
                        Switcher.accept(tab_name);
                        Render.container.resize();
                    }
                };
                Actions         = {
                    events: {
                        validate: function (params) {
                            return Tools.Object.validate(params, [  { name: "name",     type: "string"              },
                                                                    { name: "color",    type: "string", value: null },
                                                                    { name: "id",       type: "string", value: null }]);
                        },
                        register: function (params) {
                            var parameters = null;
                            if (Actions.events.validate(params) === true) {
                                parameters = Parameters.get();
                                if (parameters !== null) {
                                    params.id = (params.id !== null ? params.id : Tools.IDs.Get(6));
                                    if (typeof parameters.data.events[params.id] !== "object") {
                                        parameters.data.events[params.id] = {
                                            id      : params.id,
                                            name    : params.name,
                                            color   : params.color,
                                            time    : "waiting",
                                            count   : 0,
                                            nodes   : {},
                                            lighting: false,
                                        };
                                        Actions.events.add.record(parameters, parameters.data.events[params.id]);
                                        return params.id;
                                    }
                                }
                            }
                            return null;
                        },
                        add     : {
                            record  : function (parameters, record) {
                                var nodes = null;
                                if (parameters !== null) {
                                    if (parameters.mounted === true) {
                                        nodes = HTMLExtended.Nodes.build(Configuration.makeups.events.record);
                                        if (nodes !== null) {
                                            record.nodes.indicator      = nodes.icon.value.value;
                                            record.nodes.count          = nodes.count.value;
                                            record.nodes.time           = nodes.time.value;
                                            record.nodes.container      = nodes.container;
                                            nodes.time.value.innerHTML  = record.time;
                                            nodes.count.value.innerHTML = record.count;
                                            nodes.name.value.innerHTML  = record.name;
                                            if (record.name.indexOf(parameters.setting.events.filter) === -1) {
                                                record.nodes.container.style.display = "none";
                                            } else {
                                                record.nodes.container.style.display = "";
                                            }
                                            parameters.nodes.events.content.appendChild(nodes.container);
                                            Render.container.resize();
                                        }
                                    }
                                }
                            },
                            restore : function () {
                                var parameters = Parameters.get();
                                if (parameters !== null) {
                                    if (parameters.mounted === true) {
                                        for (var property in parameters.data.events) {
                                            if (typeof parameters.data.events[property].nodes.container !== "object") {
                                                Actions.events.add.record(parameters, parameters.data.events[property]);
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        launch  : function (id) {
                            function moveUp() {
                                if (parameters.nodes.events.content.firstChild !== parameters.data.events[id].nodes.container) {
                                    parameters.nodes.events.content.insertBefore(parameters.data.events[id].nodes.container, parameters.nodes.events.content.firstChild);
                                }
                            };  
                            var parameters = Parameters.get(),
                                time        = new Date();
                            if (parameters !== null) {
                                if (typeof parameters.data.events[id] === "object") {
                                    parameters.data.events[id].count += 1;
                                    parameters.data.events[id].time = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + ":" + time.getMilliseconds();
                                    if (parameters.mounted === true) {
                                        if (parameters.current === "events") {
                                            if (parameters.data.events[id].lighting === false) {
                                                parameters.data.events[id].lighting = true;
                                                parameters.data.events[id].nodes.indicator.style.opacity = 1;
                                                setTimeout(function () {
                                                    if (typeof parameters.data.events[id] === "object") {
                                                        if (parameters.mounted === true) {
                                                            parameters.data.events[id].nodes.indicator.style.opacity = 0.1;
                                                        }
                                                        parameters.data.events[id].lighting = false;
                                                    }
                                                }, 400);
                                            }
                                            parameters.data.events[id].nodes.count.innerHTML    = parameters.data.events[id].count;
                                            parameters.data.events[id].nodes.time.innerHTML     = parameters.data.events[id].time;
                                            moveUp();
                                            return true;
                                        }
                                    }
                                }
                            }
                            return null;
                        },
                        remove  : function (id) {
                            var parameters = Parameters.get();
                            if (parameters !== null) {
                                if (typeof parameters.data.events[id] === "object") {
                                    if (parameters.mounted === true) {
                                        parameters.data.events[id].nodes.container.parentNode.removeChild(parameters.data.events[id].nodes.container);
                                    }
                                    parameters.data.events[id] = null;
                                    delete parameters.data.events[id];
                                    return true;
                                }
                            }
                            return null;
                        },
                        filter  : {
                            init        : function (input) {
                                var parameters = Parameters.get();
                                if (parameters !== null) {
                                    parameters.setting.events.filter = "";
                                    DOMEvents.DOM.AddListener(input,
                                        "keyup",
                                        Actions.events.filter.change,
                                        Configuration.other.global_id
                                    );
                                }
                            },
                            change      : function (event) {
                                if (event) {
                                    if (event.target) {
                                        Actions.events.filter.applyfilter(event.target.value);
                                    }
                                }
                            },
                            applyfilter : function (value) {
                                var parameters = Parameters.get();
                                if (parameters !== null) {
                                    parameters.setting.events.filter = value;
                                    if (parameters.mounted === true && typeof parameters.setting.events.filter === "string") {
                                        for (var property in parameters.data.events) {
                                            if (parameters.data.events[property].name.indexOf(value) === -1) {
                                                parameters.data.events[property].nodes.container.style.display = "none";
                                            } else {
                                                parameters.data.events[property].nodes.container.style.display = "";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    console: {
                        validate: function (params) {
                            return Tools.Object.validate(params, [  { name: "type",     type: "string", value: "normal" },
                                                                    { name: "color",    type: "string", value: null     },
                                                                    { name: "message",  type: "string"                  },
                                                                    { name: "details",  type: "string", value: null     },
                                                                    { name: "id",       type: "string", value: null     }]);
                        },
                        message : function (params) {
                            var parameters  = null,
                                time        = new Date();
                            if (Actions.console.validate(params) === true) {
                                parameters = Parameters.get();
                                if (parameters !== null) {
                                    params.id = (params.id !== null ? params.id : Tools.IDs.Get(6));
                                    if (typeof parameters.data.console[params.id] !== "object") {
                                        parameters.data.console[params.id] = {
                                            id      : params.id,
                                            message : params.message,
                                            details : params.details,
                                            time    : time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + ":" + time.getMilliseconds(),
                                            mounted : false,
                                            nodes   : {}
                                        };
                                        Actions.console.add.record(parameters, parameters.data.console[params.id]);
                                        return params.id;
                                    }
                                }
                            }
                            return null;
                        },
                        add     : {
                            record  : function (parameters, record) {
                                var nodes = null;
                                if (parameters !== null) {
                                    if (parameters.mounted === true) {
                                        nodes = HTMLExtended.Nodes.build(Configuration.makeups.console.record);
                                        if (nodes !== null) {
                                            record.mounted = true;
                                            nodes.message.text.value.innerHTML = record.message;
                                            nodes.message.time.value.innerHTML = record.time;
                                            if (record.details !== null) {
                                                nodes.details.value.innerHTML = record.details;
                                            } else {
                                                nodes.container.removeChild(nodes.details.container);
                                            }
                                            if (record.message.indexOf(parameters.setting.console.filter) === -1) {
                                                nodes.container.style.display = "none";
                                            } else {
                                                nodes.container.style.display = "";
                                            }
                                            parameters.nodes.console.content.appendChild(nodes.container);
                                            record.nodes.container = nodes.container;
                                            Render.container.resize();
                                            ScrollBox.scroll.vertical.max(parameters.IDs[parameters.current].scroll);
                                            Switcher.to("console");
                                        }
                                    }
                                }
                            },
                            restore : function () {
                                var parameters = Parameters.get();
                                if (parameters !== null) {
                                    if (parameters.mounted === true) {
                                        for (var property in parameters.data.console) {
                                            if (typeof parameters.data.console[property].mounted === false) {
                                                Actions.console.add.record(parameters, parameters.data.console[property]);
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        filter  : {
                            init        : function (input) {
                                var parameters = Parameters.get();
                                if (parameters !== null) {
                                    parameters.setting.console.filter = "";
                                    DOMEvents.DOM.AddListener(input,
                                        "keyup",
                                        Actions.console.filter.change,
                                        Configuration.other.global_id
                                    );
                                }
                            },
                            change      : function (event) {
                                if (event) {
                                    if (event.target) {
                                        Actions.console.filter.applyfilter(event.target.value);
                                    }
                                }
                            },
                            applyfilter : function (value) {
                                var parameters = Parameters.get();
                                if (parameters !== null) {
                                    parameters.setting.console.filter = value;
                                    if (parameters.mounted === true && typeof parameters.setting.console.filter === "string") {
                                        for (var property in parameters.data.console) {
                                            if (parameters.data.console[property].message.indexOf(value) === -1) {
                                                parameters.data.console[property].nodes.container.style.display = "none";
                                            } else {
                                                parameters.data.console[property].nodes.container.style.display = "";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    lifeview: {
                        validate: function (params) {
                            return Tools.Object.validate(params, [  { name: "name",     type: "string"              },
                                                                    { name: "color",    type: "string", value: null },
                                                                    { name: "id",       type: "string", value: null },
                                                                    { name: "value",    type: "string", value: null }]);
                        },
                        register: function (params) {
                            var parameters = null;
                            if (Actions.lifeview.validate(params) === true) {
                                parameters = Parameters.get();
                                if (parameters !== null) {
                                    params.id = (params.id !== null ? params.id : Tools.IDs.Get(6));
                                    if (typeof parameters.data.lifeview[params.id] !== "object") {
                                        params.value = (params.value === null ? "wait" : params.value);
                                        parameters.data.lifeview[params.id] = {
                                            id      : params.id,
                                            name    : params.name,
                                            color   : params.color,
                                            time    : "waiting",
                                            value   : params.value,
                                            nodes   : {},
                                            lighting: false,
                                        };
                                        Actions.lifeview.add.record(parameters, parameters.data.lifeview[params.id]);
                                        return params.id;
                                    }
                                }
                            }
                            return null;
                        },
                        add     : {
                            record  : function (parameters, record) {
                                var nodes = null;
                                if (parameters !== null) {
                                    if (parameters.mounted === true) {
                                        nodes = HTMLExtended.Nodes.build(Configuration.makeups.lifeview.record);
                                        if (nodes !== null) {
                                            record.nodes.indicator      = nodes.icon.value.value;
                                            record.nodes.value          = nodes.value.value;
                                            record.nodes.time           = nodes.time.value;
                                            record.nodes.container      = nodes.container;
                                            nodes.time.value.innerHTML  = record.time;
                                            nodes.value.value.innerHTML = record.value;
                                            nodes.name.value.innerHTML  = record.name;
                                            parameters.nodes.lifeview.content.appendChild(nodes.container);
                                            Render.container.resize();
                                        }
                                    }
                                }
                            },
                            restore : function () {
                                var parameters = Parameters.get();
                                if (parameters !== null) {
                                    if (parameters.mounted === true) {
                                        for (var property in parameters.data.lifeview) {
                                            if (typeof parameters.data.lifeview[property].nodes.container !== "object") {
                                                Actions.lifeview.add.record(parameters, parameters.data.lifeview[property]);
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        update  : function (params) {
                            function moveUp() {
                                if (parameters.nodes.lifeview.content.firstChild !== parameters.data.lifeview[id].nodes.container) {
                                    parameters.nodes.lifeview.content.insertBefore(parameters.data.lifeview[id].nodes.container, parameters.nodes.lifeview.content.firstChild);
                                }
                            };  
                            var parameters  = Parameters.get(),
                                time        = new Date(),
                                id          = (typeof params.id     === "string" ? params.id    : null),
                                value       = (typeof params.value === "string" ? params.value : (typeof params.value === "number" ? params.value : null));
                            if (parameters !== null && id !== null && value !== null) {
                                if (typeof parameters.data.lifeview[id] === "object") {
                                    parameters.data.lifeview[id].time   = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + ":" + time.getMilliseconds();
                                    parameters.data.lifeview[id].value  = value;
                                    if (parameters.mounted === true) {
                                        if (parameters.current === "lifeview") {
                                            if (parameters.data.lifeview[id].lighting === false) {
                                                parameters.data.lifeview[id].lighting = true;
                                                parameters.data.lifeview[id].nodes.indicator.style.opacity = 1;
                                                setTimeout(function () {
                                                    if (typeof parameters.data.lifeview[id] === "object") {
                                                        if (parameters.mounted === true) {
                                                            parameters.data.lifeview[id].nodes.indicator.style.opacity = 0.1;
                                                        }
                                                        parameters.data.lifeview[id].lighting = false;
                                                    }
                                                }, 400);
                                            }
                                            parameters.data.lifeview[id].nodes.value.innerHTML  = parameters.data.lifeview[id].value;
                                            parameters.data.lifeview[id].nodes.time.innerHTML   = parameters.data.lifeview[id].time;
                                            moveUp();
                                            return true;
                                        }
                                    }
                                }
                            }
                            return null;
                        },
                        remove  : function (id) {
                            var parameters = Parameters.get();
                            if (parameters !== null) {
                                if (typeof parameters.data.lifeview[id] === "object") {
                                    if (parameters.mounted === true) {
                                        parameters.data.lifeview[id].nodes.container.parentNode.removeChild(parameters.data.lifeview[id].nodes.container);
                                    }
                                    parameters.data.lifeview[id] = null;
                                    delete parameters.data.lifeview[id];
                                    return true;
                                }
                            }
                            return null;
                        },
                    }
                };
                PublicMethods   = {
                    open    : function () {
                        return Purity.System.runHandle(Initializer.actions.open, arguments, "[Developer.Console][Initializer.actions.open]", this);
                    },
                    events  : {
                        register    : function () {
                            return Purity.System.runHandle(Actions.events.register, arguments, "[Developer.Console][Actions.events.register]", this);
                        },
                        launch      : function () {
                            return Purity.System.runHandle(Actions.events.launch, arguments, "[Developer.Console][Actions.events.launch]", this);
                        },
                        remove      : function () {
                            return Purity.System.runHandle(Actions.events.remove, arguments, "[Developer.Console][Actions.events.remove]", this);
                        },
                    },
                    console: {
                        message     : function () {
                            return Purity.System.runHandle(Actions.console.message, arguments, "[Developer.Console][Actions.console.message]", this);
                        }
                    },
                    lifeview: {
                        register    : function () {
                            return Purity.System.runHandle(Actions.lifeview.register, arguments, "[Developer.Console][Actions.lifeview.register]", this);
                        },
                        update      : function () {
                            return Purity.System.runHandle(Actions.lifeview.update, arguments, "[Developer.Console][Actions.lifeview.update]", this);
                        },
                        remove      : function () {
                            return Purity.System.runHandle(Actions.lifeview.remove, arguments, "[Developer.Console][Actions.lifeview.remove]", this);
                        },
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                //---< Security part	>--[end]---------------------------------------------------------------------------------------
                //---< Init part	    >--[begin]---------------------------------------------------------------------------------------
                (function () {
                    //Generate global ID
                    Parameters.generateID();
                }());
                //---< Init part	    >--[end]---------------------------------------------------------------------------------------
                return {
                    //---< Public part		>--[begin]---------------------------------------------------------------------------------------
                    AboutModule: {
                        getName         : function () { return name;        },
                        getVersion      : function () { return version;     },
                        getLastUpdate   : function () { return lastUpdate;  },
                        getAuthor       : function () { return author;      }
                    },
                    open        : PublicMethods.open,
                    events      : {
                        register    : PublicMethods.events.register,
                        launch      : PublicMethods.events.launch,
                        remove      : PublicMethods.events.remove,
                    },
                    console     : {
                        message     : PublicMethods.console.message,
                    },
                    lifeview    : {
                        register    : PublicMethods.lifeview.register,
                        update      : PublicMethods.lifeview.update,
                        remove      : PublicMethods.lifeview.remove,
                    }
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());