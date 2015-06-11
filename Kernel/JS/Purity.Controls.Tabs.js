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
        Purity.createModule("Controls.Tabs",
            //Check references
            {
                modules     : ["Tools", "HTML", "Environment.Events", "Environment.Events.Touch", "Environment.Overhead", "Environment.Events.Mutation", "HTML.Extended", "CSS.Manipulation"],
                resources   : [{ url: "", name: "Purity.Controls.Tabs.css", path: "~/Kernel/CSS/", type: "jsic", cache: true, initas: "css", id: "Purity.Controls.Tabs.css" }]
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Controls.Tabs",
                    version         = "1.0",
                    lastUpdate      = "02.02.2014",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Configuration   = {},
                    Parameters      = {},
                    Initializer     = {},
                    Render          = {},
                    Events          = {},
                    PublicMethods   = {},
                    //Declaration references
                    HTML            = new Purity.initModule("HTML"                          ),
                    HTMLExtended    = new Purity.initModule("HTML.Extended"                 ),
                    Tools           = new Purity.initModule("Tools"                         ),
                    Overhead        = new Purity.initModule("Environment.Overhead"          ),
                    DOMEvents       = new Purity.initModule("Environment.Events"            ),
                    MutationEvents  = new Purity.initModule("Environment.Events.Mutation"   ),
                    CSS             = new Purity.initModule("CSS.Manipulation"              ),
                    TouchEvents     = new Purity.initModule("Environment.Events.Touch"      );
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Configuration   = {
                    makeups     : {
                        container   : {
                            container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Tabs"       },
                            tabs        : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Tabs.List"  },
                            content     : {
                                container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Tabs.Content" },
                                casing      : {
                                    container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Tabs.Content.Casing"    },
                                    value       : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Tabs.Content.Value"     },
                                    settingup   : {
                                        parent: "container",
                                        childs: ["value"]
                                    }
                                },
                                settingup   : {
                                    parent: "container",
                                    childs: ["casing"]
                                }
                            },
                            settingup: {
                                parent: "container",
                                childs: ["content", "tabs"]
                            }
                        },
                        tab         : {
                            container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Tabs.Button"    },
                            icon        : {
                                container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Tabs.Button.Icon.Container" },
                                value       : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Tabs.Button.Icon"           },
                                settingup   : {
                                    parent: "container",
                                    childs: ["value"]
                                }
                            },
                            caption         : {
                                container   : { node: "DIV",    name: "data-type-element",  value: "Purity.Controls.Tabs.Button.Caption"    },
                                value       : { node: "P",      name: "data-type-element",  value: "Purity.Controls.Tabs.Button.Caption"    },
                                settingup   : {
                                    parent: "container",
                                    childs: ["value"]
                                }
                            },
                            settingup   : {
                                parent: "container",
                                childs: ["icon", "caption"]
                            }
                        },
                        content: { node: "DIV", name: "data-type-element", value: "Purity.Controls.Tabs.DeveloperContent" }
                    },
                    attributes  : {
                        default_style   : { name: "data-default-style", value: "true" },
                        select_class    : "Purity_Controls_Tabs_Button_Select_Default",
                        tabs            : {
                            layout : "data-type-tabs-layout"
                        }
                    },
                    other       : {
                        variables_group_name    : "Purity_Controls_Tabs",
                        variable_list_name      : "List_Of_Instances"
                    },
                    flags       : {
                        manually_clear: {
                            status  : true,
                            timeout : 10000
                        }
                    }
                };
                Parameters = {
                    list: {
                        add     : function (id) {
                            var argument_id = (typeof id === "string" ? id : null),
                                data        = Parameters.list.get();
                            if (argument_id !== null && data !== null) {
                                if (data.indexOf(argument_id) === -1) {
                                    //Add id
                                    data.push(argument_id);
                                    //Activate clearning
                                    Parameters.list.clear.init(id);
                                    return true;
                                }
                            }
                            return false;
                        },
                        del     : function (id) {
                            var argument_id = (typeof id === "string" ? id : null),
                                data        = Parameters.list.get(),
                                index       = null;
                            if (argument_id !== null && data !== null) {
                                index = data.indexOf(argument_id);
                                if (index !== -1) {
                                    data.splice(index, 1);
                                    return true;
                                }
                            }
                            return false;
                        },
                        get     : function () {
                            var data = Overhead.vars.get(Configuration.other.variables_group_name, Configuration.other.variable_list_name);
                            return (data !== null ? data : Overhead.vars.set(Configuration.other.variables_group_name, Configuration.other.variable_list_name, [], true));
                        },
                        clear   : {
                            inProgress  : false,
                            inManually  : false,
                            DOMRemoving : {
                                supported       : null,
                                detectSupport   : function () {
                                    if (Parameters.list.clear.DOMRemoving.supported === null) {
                                        //Parameters.list.clear.DOMRemoving.supported = MutationEvents.isAvaliable("DOMNodeRemovedFromDocument");
                                        Parameters.list.clear.DOMRemoving.supported = false;
                                    }
                                    return Parameters.list.clear.DOMRemoving.supported;
                                },
                                attach          : function (id) {
                                    var element = null;
                                    Parameters.list.clear.DOMRemoving.detectSupport();
                                    if (Parameters.list.clear.DOMRemoving.supported === true) {
                                        element = Parameters.get(id);
                                        if (element !== null) {
                                            DOMEvents.DOM.AddListener(  element.nodes.container,
                                                                        "DOMNodeRemovedFromDocument",//DOMNodeRemoved
                                                                        function () {
                                                                            Parameters.list.clear.DOMRemoving.remove(id);
                                                                        },
                                                                        id
                                            );
                                            return true;
                                        }
                                    }
                                    return false;
                                },
                                remove          : function (id) {
                                    var parameters = Parameters.get(id);
                                    if (parameters !== null) {
                                        if (typeof parameters.modifyDOM === "boolean") {
                                            if (parameters.modifyDOM === true) {
                                                return false;
                                            }
                                        }
                                    }
                                    Parameters.list.del(id);
                                    Parameters.del      (id);
                                }
                            },
                            init        : function (id) {
                                if (Parameters.list.clear.DOMRemoving.attach(id) === false) {
                                    if (Configuration.flags.manually_clear.status === true) {
                                        if (Parameters.list.clear.inProgress === false) {
                                            Parameters.list.clear.processing();
                                            Parameters.list.clear.inProgress = true;
                                        }
                                    }
                                }
                            },
                            check       : function (){
                                var data    = Parameters.list.get(),
                                    element = null;
                                if (data !== null) {
                                    for (var index = data.length - 1; index >= 0; index -= 1) {
                                        element = Parameters.get(data[index]);
                                        if (element !== null) {
                                            if (HTML.Nodes.IsMounted(element.nodes.container) === false) {
                                                Parameters.del(data[index])
                                                data.splice(index, 1);
                                            }
                                        } else {
                                            data.splice(index, 1);
                                        }
                                    }
                                }
                            },
                            automatic   : function (){
                                var data    = Parameters.list.get();
                                if (data !== null) {
                                    Parameters.list.clear.check();
                                    if (data.length > 0) {
                                        Parameters.list.clear.processing();
                                    } else {
                                        Parameters.list.clear.inProgress = false;
                                    }
                                }
                            },
                            processing  : function () {
                                setTimeout(Parameters.list.clear.automatic, Configuration.flags.manually_clear.timeout);
                            },
                            manually    : function () {
                                var data = null;
                                if (Parameters.list.clear.DOMRemoving.supported !== true) {
                                    data = Parameters.list.get();
                                    if (data !== null) {
                                        if (data.length > 0) {
                                            if (Parameters.list.clear.inManually === false) {
                                                Parameters.list.clear.inManually = true;
                                                Parameters.list.clear.check();
                                                setTimeout(function () { Parameters.list.clear.inManually = false; }, 1000);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    register: function (id, data) {
                        var argument_id     = (typeof id    === "string" ? id   : null),
                            argument_data   = (typeof data  === "object" ? data : null),
                            data            = null;
                        if (argument_id !== null && argument_data !== null) {
                            data = Overhead.vars.set(Configuration.other.variables_group_name, argument_id, argument_data);
                            if (data !== null) {
                                return data;
                            }
                        }
                        return false;
                    },
                    get     : function (id) {
                        var argument_id = (typeof id === "string" ? id : null);
                        if (argument_id !== null) {
                            return Overhead.vars.get(Configuration.other.variables_group_name, id);
                        }
                        return null;
                    },
                    del     : function (id) {
                        var argument_id = (typeof id === "string" ? id : null);
                        if (argument_id !== null) {
                            return Overhead.vars.del(Configuration.other.variables_group_name, id);
                        }
                        return null;
                    },
                };
                Initializer     = {
                    validate    : {
                        container : {
                            basic       : function (params) {
                                return Tools.Object.validate(params, [  { name: "parent",       type: "node"                                                    },
                                                                        { name: "id",           type: "string", value: null                                     },
                                                                        { name: "size",         type: "object", value: {}                                       },
                                                                        { name: "attribute",    type: "object", value: {}                                       },
                                                                        { name: "select_class", type: "string", value: Configuration.attributes.select_class    },
                                                                        { name: "tabs",         type: "object", value: {}                                       }, ]);
                            },
                            size        : function (size) {
                                if (Tools.Object.validate(size, [   { name: "width",    type: ["string", "number"], value: "100%" },
                                                                    { name: "height",   type: ["string", "number"], value: "100%" }]) === true) {
                                    size.width  = (typeof size.width    === "string" ? size.width   : size.width    + "px");
                                    size.height = (typeof size.height   === "string" ? size.height  : size.height   + "px");
                                    return true;
                                }
                                return false;
                            },
                            tabs        : function (tabs) {
                                if (Tools.Object.validate(tabs, [   { name: "layout", type: "string", value: "top", values : ["top", "bottom", "left", "right"] }]) === true) {
                                    return true;
                                }
                                return false;
                            },
                            attribute   : function (attribute) {
                                if (Tools.Object.validate(attribute, [  { name: "name",     type: "string"},
                                                                        { name: "value",    type: "string"}]) === false){
                                    attribute.name  = Configuration.attributes.default_style.name;
                                    attribute.value = Configuration.attributes.default_style.value;
                                }
                                return true;
                            },
                        },
                        tab: {
                            basic       : function (params) {
                                if (Tools.Object.validate(params, [ { name: "id",           type: "string"                      },
                                                                    { name: "tab_id",       type: "string",     value: null     },
                                                                    { name: "title",        type: "string",     value: ""       },
                                                                    { name: "icon",         type: "object",     value: {}       },
                                                                    { name: "content",      type: "node",       value: null     },
                                                                    { name: "active",       type: "boolean",    value: false    },
                                                                    { name: "events",       type: "object",     value: {}       }]) === true) {
                                    if (params.title === "" && params.icon === "") {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                };
                                return false;
                            },
                            icon        : function (icon) {
                                if (Tools.Object.validate(icon, [   { name: "image",    type: "string" },
                                                                    { name: "width",    type: "string" },
                                                                    { name: "height",   type: "string" }]) === false) {
                                    icon.image  = null;
                                    icon.height = null;
                                    icon.width  = null;
                                }
                               return true;
                            },
                            events      : function (events) {
                                return Tools.Object.validate(events, [  { name: "enter",    type: "function", value : null},
                                                                        { name: "exit",     type: "function", value : null }]);
                            },
                        }
                    },
                    actions     : {
                        create  : function (params) {
                            var parameters  = null,
                                validate    = Initializer.validate.container;
                            if (validate.basic(params) === true) {
                                if (validate.size       (params.size        ) === true &&
                                    validate.tabs       (params.tabs        ) === true &&
                                    validate.attribute  (params.attribute   ) === true) {
                                    //Check id
                                    params.id   = (params.id === null ? Tools.IDs.Get(6) : params.id);
                                    //Register parameters
                                    parameters  = Parameters.register(params.id,    {
                                                                                        id          : params.id,
                                                                                        size        : params.size,
                                                                                        events      : params.events,
                                                                                        tabsetting  : params.tabs,
                                                                                        attribute   : params.attribute,
                                                                                        select_class: params.select_class,
                                                                                        nodes       : {},
                                                                                        tabs        : {},
                                                                                        active      : null
                                                                                    }
                                    );
                                    //Make container
                                    Render.container.make(params.id, params.parent);
                                    //Add to list
                                    Parameters.list.add(params.id);
                                    //Return id
                                    return params.id;
                                }
                            }
                            return null;
                        },
                        tab     : function (params) {
                            var parameters  = null,
                                validate    = Initializer.validate.tab;
                            if (validate.basic(params) === true) {
                                parameters = Parameters.get(params.id);
                                if (parameters !== null) {
                                    //Check params
                                    validate.icon(params.icon   );
                                    validate.icon(params.events );
                                    //Check id
                                    params.tab_id = (params.tab_id === null ? Tools.IDs.Get(6) : params.tab_id);
                                    //Check tab
                                    if (typeof parameters.tabs[params.tab_id] === "undefined") {
                                        //Create data
                                        parameters.tabs[params.tab_id] = {
                                            id      : params.tab_id,
                                            nodes   : {},
                                            events  : params.events
                                        };
                                        //Create tab
                                        Render.tabs.make(params.id, params.tab_id, params.content, params.title, params.icon);
                                        //Init events
                                        Events.switcher.init(parameters.tabs[params.tab_id].nodes.button, params.id, params.tab_id);
                                        //Set tab as active
                                        if (params.active === true) {
                                            Events.switcher.manuallySet(params.id, params.tab_id);
                                        } else {
                                            Events.switcher.set.hide(params.id, params.tab_id);
                                        }
                                        return {
                                            id      : params.tab_id,
                                            content : parameters.tabs[params.tab_id].nodes.content
                                        };
                                    }
                                }
                            }
                            return null;
                        }
                    }
                };
                Render          = {
                    helpers : {
                        setDeveloperAttribute: function (nodes, style_record) {
                            if (typeof nodes === "object") {
                                if (HTML.Nodes.Is(nodes) === true) {
                                    nodes.setAttribute(style_record.name, style_record.value);
                                } else {
                                    for (var property in nodes) {
                                        if (HTML.Nodes.Is(nodes[property]) === true) {
                                            nodes[property].setAttribute(style_record.name, style_record.value);
                                        } else {
                                            Render.helpers.setDeveloperAttribute(nodes[property], style_record);
                                        }
                                    }
                                }
                            }
                        }
                    },
                    container   : {
                        make    : function (id, parent) {
                            var parameters  = Parameters.get(id),
                                nodes       = null;
                            if (parameters !== null) {
                                nodes = HTMLExtended.Nodes.build(Configuration.makeups.container);
                                if (nodes !== null) {
                                    //Apply developer styles
                                    Render.helpers.setDeveloperAttribute(nodes, parameters.attribute);
                                    //Save data
                                    parameters.nodes.container  = nodes.container;
                                    parameters.nodes.content    = {
                                        container   : nodes.content.casing.container,
                                        value       : nodes.content.casing.value,
                                    };
                                    parameters.nodes.tabs       = nodes.tabs;
                                    //Set layout
                                    Render.container.layout.set(id);
                                    //Set size
                                    Render.container.sizer.update(id);
                                    //Append nodes
                                    parent.appendChild(nodes.container);
                                }
                            }
                        },
                        layout  : {
                            set     : function (id) {
                                var parameters  = Parameters.get(id),
                                    attribute   = Configuration.attributes.tabs.layout;
                                if (parameters !== null) {
                                    parameters.nodes.content.container. setAttribute(attribute, parameters.tabsetting.layout);
                                    parameters.nodes.tabs.              setAttribute(attribute, parameters.tabsetting.layout);
                                }
                            }
                        },
                        sizer   : {
                            update  : function (id) {
                                var parameters = Parameters.get(id);
                                if (parameters !== null) {
                                    parameters.nodes.container.style.width  = parameters.size.width;
                                    parameters.nodes.container.style.height = parameters.size.height;
                                }
                            }
                        }
                    },
                    tabs        : {
                        make        : function (id, tab_id, content, title, icon) {
                            function setTitle   () {
                                if (title !== "") {
                                    tab.caption.value.innerHTML = title;
                                } else {
                                    tab.caption.container.parentNode.removeChild(tab.caption.container);
                                    tab.caption.container = null;
                                }
                            };
                            function setIcon    () {
                                if (icon.image !== null) {
                                    tab.icon.container. style.width             = icon.width;
                                    tab.icon.value.     style.backgroundImage   = icon.image;
                                    tab.icon.value.style.height                 = icon.height;
                                    tab.icon.value.style.width                  = icon.width;
                                    if (title === "") {
                                        tab.icon.container.style.height         = icon.height;
                                        tab.icon.container.style.position       = "relative";
                                        tab.icon.container.style.padding        = "0.5em";
                                    } else {
                                        tab.icon.container.style.position       = "absolute";
                                        tab.icon.container.style.height         = "100%";
                                        tab.icon.container.style.paddingLeft    = "0.5em";
                                        tab.icon.container.style.paddingRight   = "0.5em";
                                    }
                                } else {
                                    tab.icon.container.parentNode.removeChild(tab.icon.container);
                                    tab.icon.container = null;
                                }

                            };
                            function correctSize() {
                                var size_container  = null,
                                    size_icon       = null;
                                if (tab.icon.container !== null && tab.caption.container !== null) {
                                    size_container  = HTML.Render.GetSize(tab.icon.container);
                                    tab.caption.value.style.paddingLeft = size_container.OuterWidth + "px";
                                }
                                if (tab.icon.container !== null) {
                                    size_icon = HTML.Render.GetSize(tab.icon.value);
                                    tab.icon.value.style.marginTop  = -(size_icon.OuterHeight / 2)  + "px";
                                    tab.icon.value.style.marginLeft = -(size_icon.OuterWidth / 2)   + "px";
                                }
                            };
                            var parameters = Parameters.get(id),
                                tab         = null,
                                container   = null,
                                content     = (HTML.Nodes.Is(content) === true ? content : null);
                            if (parameters !== null) {
                                tab         = HTMLExtended.Nodes.build(Configuration.makeups.tab    );
                                container   = HTMLExtended.Nodes.build(Configuration.makeups.content);
                                if (tab !== null && container !== null) {
                                    //Apply developer styles
                                    Render.helpers.setDeveloperAttribute(tab,       parameters.attribute);
                                    Render.helpers.setDeveloperAttribute(container, parameters.attribute);
                                    //Add content if defined
                                    if (content !== null) {
                                        container.appendChild(content);
                                    }
                                    //Set content
                                    setTitle    ();
                                    setIcon     ();
                                    //Append elements
                                    parameters.nodes.content.value. appendChild(container       );
                                    parameters.nodes.tabs.          appendChild(tab.container   );
                                    //Save data
                                    parameters.tabs[tab_id].nodes.button    = tab.container;
                                    parameters.tabs[tab_id].nodes.content   = container;
                                    //Correct size of button
                                    correctSize();
                                    //Correct size of tabs area
                                    Render.tabs.sizer.correct(id, tab_id);
                                    //Correct position
                                    Render.tabs.positions.set(id, tab_id);
                                }
                            }
                        },
                        sizer       : {
                            correct : function (id, tab_id) {
                                function updateTabs(width, height) {
                                    for (var property in parameters.tabs) {
                                        if (width !== null) {
                                            parameters.tabs[property].nodes.button.style.width      = width + "px";
                                        }
                                        if (height !== null) {
                                            parameters.tabs[property].nodes.button.style.height     = height + "px";
                                        }
                                    }
                                };
                                var size        = null,
                                    parameters  = Parameters.get(id),
                                    button      = null;
                                if (parameters !== null) {
                                    button  = parameters.tabs[tab_id].nodes.button;
                                    size    = HTML.Render.GetSize(button);
                                    if (typeof parameters.tabsetting.size !== "object") {
                                        parameters.tabsetting.size = {
                                            width   : size.OuterWidth,
                                            height  : size.OuterHeight
                                        };
                                    }
                                    parameters.tabs[tab_id].size = {
                                        width   : size.OuterWidth,
                                        height  : size.OuterHeight
                                    };
                                    parameters.tabs[tab_id].position = {
                                        left: 0,
                                        top : 0
                                    };
                                    switch (parameters.tabsetting.layout) {
                                        case "top":
                                            if (parameters.tabsetting.size.height <= size.OuterHeight) {
                                                parameters.nodes.tabs.style.height              = size.OuterHeight + "px";
                                                parameters.tabsetting.size.height               = size.OuterHeight;
                                                parameters.nodes.content.container.style.top    = size.OuterHeight + "px";
                                            }
                                            updateTabs(null, parameters.tabsetting.size.height);
                                            break;
                                        case "bottom":
                                            if (parameters.tabsetting.size.height <= size.OuterHeight) {
                                                parameters.nodes.tabs.style.height              = size.OuterHeight + "px";
                                                parameters.nodes.tabs.style.marginTop           = -size.OuterHeight + "px";
                                                parameters.tabsetting.size.height               = size.OuterHeight;
                                                parameters.nodes.content.container.style.bottom = size.OuterHeight + "px";
                                            }
                                            updateTabs(null, parameters.tabsetting.size.height);
                                            break;
                                        case "left":
                                            if (parameters.tabsetting.size.width <= size.OuterWidth) {
                                                parameters.nodes.tabs.style.width               = size.OuterWidth + "px";
                                                parameters.tabsetting.size.width                = size.OuterWidth;
                                                parameters.nodes.content.container.style.left   = size.OuterWidth + "px";
                                            }
                                            updateTabs(parameters.tabsetting.size.width, null);
                                            break;
                                        case "right":
                                            if (parameters.tabsetting.size.width <= size.OuterWidth) {
                                                parameters.nodes.tabs.style.width               = size.OuterWidth + "px";
                                                parameters.nodes.tabs.style.marginLeft          = -size.OuterWidth + "px";
                                                parameters.tabsetting.size.width                = size.OuterWidth;
                                                parameters.nodes.content.container.style.right  = size.OuterWidth + "px";
                                            }
                                            updateTabs(parameters.tabsetting.size.width, null);
                                            break;
                                    }
                                }
                            },
                        },
                        positions   : {
                            set     : function (id, tab_id) {
                                function getLastPosition(tab_id) {
                                    var position    = {
                                            top     : 0,
                                            left    : 0
                                        };
                                    for (var property in parameters.tabs) {
                                        if (property !== tab_id) {
                                            position.top    = parameters.tabs[property].position.top    + parameters.tabs[property].size.height;
                                            position.left   = parameters.tabs[property].position.left   + parameters.tabs[property].size.width;
                                        }
                                    }
                                    return position;
                                };
                                var parameters  = Parameters.get(id),
                                    position    = null,
                                    button      = null;
                                if (parameters !== null) {
                                    button      = parameters.tabs[tab_id].nodes.button;
                                    position    = getLastPosition(tab_id);
                                    if (parameters.tabsetting.layout === "top" || parameters.tabsetting.layout === "bottom") {
                                        button.style.left   = position.left + "px";
                                        button.style.top    = "0px";
                                    } else {
                                        button.style.top    = position.top + "px";
                                        button.style.left   = "0px";
                                    }
                                    parameters.tabs[tab_id].position.top    = position.top;
                                    parameters.tabs[tab_id].position.left   = position.left;
                                }
                            },
                            update  : function (id) {
                                function applyPositions(propertyPosition) {
                                    for (var property in parameters.tabs) {
                                        parameters.tabs[property].nodes.button.style[propertyPosition] = (parameters.tabs[property].position[propertyPosition] - offset) + "px";
                                    }
                                };
                                function checkPosition(propertyPosition, propertySize) {
                                    if (parameters.tabs[parameters.active].position[propertyPosition] + parameters.tabs[parameters.active].size[propertySize] * (1 + addition_space) > size[propertySize] + offset) {
                                        if (index === Object.keys(parameters.tabs).length - 1) {
                                            if (parameters.tabs[parameters.active].position[propertyPosition] + parameters.tabs[parameters.active].size[propertySize] <= size[propertySize] + offset) {
                                                return true;
                                            }
                                        }
                                        if (index < Object.keys(parameters.tabs).length - 1) {
                                            addition = parameters.tabs[Object.keys(parameters.tabs)[index + 1]].size[propertySize] / 2;
                                        }
                                        offset = parameters.tabs[parameters.active].position[propertyPosition] + parameters.tabs[parameters.active].size[propertySize] - size[propertySize] + addition;
                                        parameters.tabsetting.offset = offset;
                                        applyPositions(propertyPosition);
                                        return true;
                                    }
                                    if (parameters.tabs[parameters.active].position[propertyPosition] * (1-addition_space) < offset) {
                                        if (index > 0) {
                                            addition = parameters.tabs[Object.keys(parameters.tabs)[index - 1]].size[propertySize] / 2;
                                        }
                                        offset -= (offset - parameters.tabs[parameters.active].position[propertyPosition] + addition);
                                        parameters.tabsetting.offset = offset;
                                        applyPositions(propertyPosition);
                                        return true;
                                    }
                                };
                                var parameters      = Parameters.get(id),
                                    size            = null,
                                    offset          = 0,
                                    index           = null,
                                    addition        = 0,
                                    addition_space  = 0.2;//%% 20% from size of element
                                if (parameters !== null) {
                                    size        = HTML.Render.GetSize(parameters.nodes.tabs);
                                    size.height = size.OuterHeight;
                                    size.width  = size.OuterWidth;
                                    if (typeof parameters.tabsetting.offset !== "number") {
                                        parameters.tabsetting.offset = 0;
                                    }
                                    offset  = parameters.tabsetting.offset;
                                    index   = Object.keys(parameters.tabs).indexOf(parameters.active);
                                    if (parameters.tabsetting.layout === "top" || parameters.tabsetting.layout === "bottom") {
                                        checkPosition("left", "width");
                                    } else {
                                        checkPosition("top", "height");
                                    }
                                }
                            }
                        },
                    }
                };
                Events          = {
                    switcher: {
                        init        : function (button, id, tab_id) {
                            TouchEvents.attach( button,
                                                "touchstart",
                                                "click",
                                                function (event) {
                                                    return Events.switcher.set.toggle(event, id, tab_id)
                                                },
                                                function (event) {
                                                    return Events.switcher.set.toggle(event, id, tab_id)
                                                },
                                                id + tab_id,
                                                false,
                                                true
                            );
                        },
                        set : {
                            toggle : function(event, id, tab_id){
                                var parameters = Parameters.get(id);
                                if (parameters !== null) {
                                    if (parameters.active !== tab_id) {
                                        if (parameters.active !== null) {
                                            Events.switcher.set.hide(id, parameters.active);
                                        }
                                        Events.switcher.set.show(id, tab_id);
                                        parameters.active = tab_id;
                                        Render.tabs.positions.update(id);
                                    }
                                }
                            },
                            hide : function(id, tab_id){
                                var parameters = Parameters.get(id);
                                if (parameters !== null) {
                                    CSS.Classes.remove(parameters.tabs[tab_id].nodes.button, parameters.select_class);
                                    parameters.tabs[tab_id].nodes.content.style.display = "none";
                                    Purity.System.runHandle(parameters.tabs[tab_id].events.exit, arguments, "[Controls.Tabs][Events.switcher.set.hide]", this);
                                }
                            },
                            show : function(id, tab_id){
                                var parameters = Parameters.get(id);
                                if (parameters !== null) {
                                    CSS.Classes.add(parameters.tabs[tab_id].nodes.button, parameters.select_class);
                                    parameters.tabs[tab_id].nodes.content.style.display = "";
                                    Purity.System.runHandle(parameters.tabs[tab_id].events.enter, arguments, "[Controls.Tabs][Events.switcher.set.show]", this);
                                }
                            },
                        },
                        manuallySet : function (id, tab_id) {
                            return Events.switcher.set.toggle(null, id, tab_id);
                        }
                    }
                };
                PublicMethods   = {
                    create  : function () {
                        return Purity.System.runHandle(Initializer.actions.create, arguments, "[Controls.Tabs][Initializer.actions.create]", this);
                    },
                    add     : function () {
                        return Purity.System.runHandle(Initializer.actions.tab, arguments, "[Controls.Tabs][Initializer.actions.tab]", this);
                    },
                    switchTo: function () {
                        return Purity.System.runHandle(Events.switcher.manuallySet, arguments, "[Controls.Tabs][Events.switcher.manuallySet]", this);
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                //---< Security part	>--[end]---------------------------------------------------------------------------------------
                //---< Init part	    >--[begin]---------------------------------------------------------------------------------------
                //---< Init part	    >--[end]---------------------------------------------------------------------------------------
                return {
                    //---< Public part		>--[begin]---------------------------------------------------------------------------------------
                    AboutModule: {
                        getName         : function () { return name;        },
                        getVersion      : function () { return version;     },
                        getLastUpdate   : function () { return lastUpdate;  },
                        getAuthor       : function () { return author;      }
                    },
                    create  : PublicMethods.create,
                    add     : PublicMethods.add,
                    switchTo: PublicMethods.switchTo
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());