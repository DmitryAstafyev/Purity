/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
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
        Purity.createModule("Controls.ScrollBox",
            //Check references
            {
                modules     : ["Tools", "HTML", "Environment.Events", "Environment.Events.Touch", "Environment.Overhead", "CSS.Manipulation", "Environment.Events.Mutation"],
                resources   : [{ url: "", name: "Purity.Controls.ScrollBox.css", path: "~/Kernel/CSS/", type: "jsic", cache: true, initas: "css", id: "Purity.Controls.ScrollBox.css" }]
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Scroll Box",
                    version         = "2.0",
                    lastUpdate      = "25.12.2013",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Configuration   = {},
                    Parameters      = {},
                    Initializer     = {},
                    Render          = {},
                    Sizer           = {},
                    GlobalResize    = {},
                    Events          = {},
                    PublicMethods   = {},
                    //Declaration references
                    HTML            = new Purity.initModule("HTML"                          ),
                    Tools           = new Purity.initModule("Tools"                         ),
                    CSS             = new Purity.initModule("CSS.Manipulation"              ),
                    Overhead        = new Purity.initModule("Environment.Overhead"          ),
                    DOMEvents       = new Purity.initModule("Environment.Events"            ),
                    MutationEvents  = new Purity.initModule("Environment.Events.Mutation"   ),
                    TouchEvents     = new Purity.initModule("Environment.Events.Touch"      );
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Configuration   = {
                    attributes  : {
                        area            : {
                            container       : { name: "data-type-element",  value: "Controls.ScrollBox.Container"               },
                            content         : { name: "data-type-element",  value: "Controls.ScrollBox.Content"                 },
                            content_value   : { name: "data-type-element",  value: "Controls.ScrollBox.Content.Value"           },
                        },
                        vertical        : {
                            track       : { name: "data-type-element",  value: "Controls.ScrollBox.Bar.Vertical"            },
                            runner      : { name: "data-type-element",  value: "Controls.ScrollBox.Bar.Vertical.Runner"     },
                            up          : { name: "data-type-element",  value: "Controls.ScrollBox.Bar.Vertical.Up"         },
                            down        : { name: "data-type-element",  value: "Controls.ScrollBox.Bar.Vertical.Down"       },
                        },
                        horizontal      : {
                            track       : { name: "data-type-element",  value: "Controls.ScrollBox.Bar.Horizontal"          },
                            runner      : { name: "data-type-element",  value: "Controls.ScrollBox.Bar.Horizontal.Runner"   },
                            left        : { name: "data-type-element",  value: "Controls.ScrollBox.Bar.Horizontal.Left"     },
                            right       : { name: "data-type-element",  value: "Controls.ScrollBox.Bar.Horizontal.Right"    },
                        },
                        default_style   : { name: "data-type-style",    value: "Controls.ScrollBox.DefaultStyle"            },
                        layout          : {
                            vertical    : {
                                left    : { name: "data-type-layout",   value: "Controls.ScrollBox.Left"                    },
                                right   : { name: "data-type-layout",   value: "Controls.ScrollBox.Right"                   },
                            },
                            horizontal  : {
                                top     : { name: "data-type-layout",   value: "Controls.ScrollBox.Top"                     },
                                bottom  : { name: "data-type-layout",   value: "Controls.ScrollBox.Bottom"                  },
                            },
                        },
                        cover           : { name: "data-type-element",  value: "Controls.ScrollBox.Bar.Runner.Cover"        },
                    },
                    other       : {
                        id_prefix               : "ScrollBox_",
                        event_window_prefix     : "Controls_ScrollBox_Events_",
                        actions_cache_var_name  : "Controls_ScrollBox_Actions_Cache",
                        variables_group_name    : "Controls_ScrollBox_Variables",
                        variable_list_name      : "Controls_ScrollBox_List_Instances",
                        timeout_buttons_start   : 10,
                        timeout_buttons_next    : 50,
                        timeout_tracks_start    : 10,
                        timeout_tracks_next     : 150,
                        step_buttons            : 0.01,
                        fade_track_onscroll     : 4000
                    },
                    flags       : {
                        auto_resize     : true,
                        manually_clear  : {
                            status  : true,
                            timeout : 10000
                        }
                    }
                };
                Parameters      = {
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
                                                                        "DOMNodeRemovedFromDocument",
                                                                        function () {
                                                                            Parameters.list.del(id);
                                                                            Parameters.del(id);
                                                                        },
                                                                        id
                                            );
                                            return true;
                                        }
                                    }
                                    return false;
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
                    register    : function (id, data) {
                        var argument_id     = (typeof id    === "string" ? id   : null),
                            argument_data   = (typeof data  === "object" ? data : null),
                            data            = null,
                            list            = null;
                        if (argument_id !== null && argument_data !== null) {
                            data = Overhead.vars.set(Configuration.other.variables_group_name, argument_id, argument_data, false);
                            if (data !== null) {
                                data.nodes      = {};
                                data.tracks     = {
                                    vertical    : {},
                                    horizontal  : {}
                                };
                                data.browser    = {};
                                //return instance of dataset
                                return data;
                            }
                        }
                        return false;
                    },
                    get         : function (id) {
                        var argument_id = (typeof id === "string" ? id : null);
                        if (argument_id !== null) {
                            return Overhead.vars.get(Configuration.other.variables_group_name, id);
                        }
                        return null;
                    },
                    del         : function (id) {
                        var argument_id = (typeof id === "string" ? id : null);
                        if (argument_id !== null) {
                            return Overhead.vars.del(Configuration.other.variables_group_name, id);
                        }
                        return null;
                    },
                };
                Initializer     = {
                    validate : {
                        params      : function (params){//visibility
                            return Tools.Object.validate(params, [  { name: "parent",               type: "node"                        },
                                                                    { name: "width",                type: "string"                      },
                                                                    { name: "height",               type: "string"                      },
                                                                    { name: "events",               type: "object",     value: {}       },
                                                                    { name: "id",                   type: "string",     value: null     },
                                                                    { name: "attributes",           type: "object",     value: { vertical: {},      horizontal: {}          } },
                                                                    { name: "visibility",           type: "object",     value: { vertical: "auto",  horizontal: "auto"      } },
                                                                    { name: "layout",               type: "object",     value: { vertical: "right", horizontal: "bottom"    } },
                                                                    { name: "before",               type: "node",       value: null     },
                                                                    { name: "use_default_style",    type: "boolean",    value: null     },
                                                                    { name: "hide_tracks",          type: "boolean",    value: false    }]);
                        },
                        visibility  : function (visibility) {
                            return Tools.Object.validate(visibility, [  { name: "vertical",     type: "string", values: ["auto", "visible", "hidden"] },
                                                                        { name: "horizontal",   type: "string", values: ["auto", "visible", "hidden"] }]);
                        },
                        layout      : function (layout) {
                            return Tools.Object.validate(layout, [  { name: "vertical",     type: "string", values: ["right", "left"] },
                                                                    { name: "horizontal",   type: "string", values: ["bottom", "top"] }]);
                        },
                        events      : function (events) {
                            return Tools.Object.validate(events, [  { name: "scroll",               type: "function", value: null },
                                                                    //{ name: "manual_scroll",        type: "function", value: null },
                                                                    { name: "button_up",            type: "function", value: null },
                                                                    { name: "button_down",          type: "function", value: null },
                                                                    { name: "button_left",          type: "function", value: null },
                                                                    { name: "button_right",         type: "function", value: null },
                                                                    { name: "track_vertical",       type: "function", value: null },
                                                                    { name: "track_horizontal",     type: "function", value: null },
                                                                    { name: "runner_vertical",      type: "function", value: null },
                                                                    { name: "runner_horizontal",    type: "function", value: null }]);
                        },
                        attributes  : function (attributes) {
                            function validate(attributes_object) {
                                var result_validation = true;
                                for (var property in attributes_object) {
                                    if (attributes_object[property] !== null) {
                                        result_validation = (Tools.Object.validate(attributes_object[property], [
                                            { name: "name",         type: "string" },
                                            { name: "value",        type: "string" },
                                            { name: "innerHTML",    type: "string", value: null }]) === true ? result_validation : false);
                                    } else {
                                        badStyle = true;
                                    }
                                }
                                return result_validation;
                            }
                            var result_validation   = Tools.Object.validate(attributes, [   { name: "vertical",     type: "object" },
                                                                                            { name: "horizontal",   type: "object"}]),
                                horizontal          = null,
                                vertical            = null,
                                badStyle            = false;
                            if (result_validation === true){
                                horizontal  = Tools.Object.validate(attributes.horizontal,  [   { name: "track",        type: "object", value: null },
                                                                                                { name: "runner",       type: "object", value: null },
                                                                                                { name: "left",         type: "object", value: null },
                                                                                                { name: "right",        type: "object", value: null }]);
                                vertical    = Tools.Object.validate(attributes.vertical,    [   { name: "track",        type: "object", value: null },
                                                                                                { name: "runner",       type: "object", value: null },
                                                                                                { name: "up",           type: "object", value: null },
                                                                                                { name: "down",         type: "object", value: null }]);
                                result_validation = (validate(attributes.horizontal ) === true ? result_validation : false);
                                result_validation = (validate(attributes.vertical   ) === true ? result_validation : false);
                            }
                            return {
                                validate: result_validation,
                                style   : badStyle
                            };
                        },
                        size        : function (size) {
                            var units           = ["px", "em", "%"],
                                result_checking = false;
                            if (typeof size === "string") {
                                for (var index = units.length - 1; index >= 0; index -= 1) {
                                    result_checking = (size.indexOf(units[index]) === -1 ? result_checking : true);
                                }
                            }
                            return result_checking;
                        },
                        type        : function (type) {
                            if (typeof type === "string") {
                                if (type === "vertical" || type === "horizontal") {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    create: function (params) {
                        var validate    = Initializer.validate,
                            parameters  = null,
                            styles      = null;
                        if (validate.params(params) === true) {
                            if (validate.layout(params.layout) === true) {
                                if (validate.visibility(params.visibility) === true) {
                                    if (validate.size(params.width) === true && validate.size(params.height) === true) {
                                        styles = validate.attributes(params.attributes);
                                        if (styles.validate === true) {
                                            validate.events(params.events);
                                            params.id   = (params.id !== null ? params.id : Configuration.other.id_prefix + Tools.IDs.Get(6));
                                            params.id   = (Parameters.get(params.id) === null ? params.id : Configuration.other.id_prefix + Tools.IDs.Get(6));
                                            parameters  = Parameters.register(   params.id,
                                                                                { 
                                                                                    attributes          : params.attributes,
                                                                                    use_default_style   : (styles.style === true ? true : false),
                                                                                    width               : params.width,
                                                                                    height              : params.height,
                                                                                    layout              : params.layout,
                                                                                    visibility          : params.visibility,
                                                                                    events              : params.events,
                                                                                    hide_tracks         : (styles.style === true ? true : params.hide_tracks)
                                                                                }
                                            );
                                            if (parameters !== null) {
                                                if (Render.area.make(params.id, params.parent, params.before) !== null) {
                                                    Sizer.size.         set     (params.id);
                                                    Sizer.size.         update  (params.id);
                                                    Sizer.track.buttons.getSize (params.id);
                                                    Events.             init    (params.id);
                                                    Sizer.track.update. both    (params.id)
                                                    //add data to list
                                                    Parameters.list.    add     (params.id);
                                                    //attach global resize
                                                    GlobalResize.attach();
                                                    //attach global resize
                                                    GlobalResize.initResizeViaTransition(params.id);
                                                    return {
                                                        content     : parameters.nodes.content_value,
                                                        container   : parameters.nodes.container,
                                                        id          : params.id
                                                    };
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return null;
                    }
                };
                Render = {
                    area    : {
                        make    : function (id, parent, before) {
                            var parameters      = Parameters.get(id),
                                argument_parent = (HTML.Nodes.Is(parent) === true ? parent : null),
                                attributes      = Configuration.attributes.area,
                                nodes           = {
                                    container       : null,
                                    content         : null,
                                    content_value   : null,
                                    iframe          : null,
                                    horizontal      : null,
                                    vertical        : null
                                };
                            if (parameters !== null && argument_parent !== null) {
                                nodes.container     = document.createElement("DIV"      );
                                nodes.content       = document.createElement("DIV"      );
                                nodes.content_value = document.createElement("DIV"      );
                                nodes.container.    setAttribute(attributes.container.      name, attributes.container.     value);
                                nodes.content.      setAttribute(attributes.content.        name, attributes.content.       value);
                                nodes.content_value.setAttribute(attributes.content_value.  name, attributes.content_value. value);
                                nodes.horizontal = Render.tracks.horizontal.make(id);
                                nodes.vertical              = Render.tracks.vertical.   make(id);
                                if (nodes.horizontal !== null && nodes.vertical !== null) {
                                    Render.tracks.horizontal.   layout(id);
                                    Render.tracks.vertical.     layout(id);
                                    nodes.content.  appendChild(nodes.content_value );
                                    nodes.container.appendChild(nodes.content       );
                                    nodes.container.appendChild(nodes.horizontal    );
                                    nodes.container.appendChild(nodes.vertical      );
                                    if (before !== null) {
                                        before.parentNode.insertBefore(nodes.container, before);
                                    } else {
                                        parent.appendChild(nodes.container);
                                    }
                                    parameters.nodes.container      = nodes.container;
                                    parameters.nodes.content        = nodes.content;
                                    parameters.nodes.content_value  = nodes.content_value;
                                    return nodes.container;
                                }
                            }
                            return null;
                        }
                    },
                    tracks: {
                        common      : {
                            buttons : function (type) {
                                if (typeof type === "string") {
                                    switch (type) {
                                        case "vertical":
                                            return { A: "up",    B: "down"    };
                                        case "horizontal":
                                            return { A: "left",  B: "right"   };
                                    }
                                }
                                return null;
                            },
                            make    : function (id, type){
                                var parameters  = Parameters.get(id),
                                    attributes  = Configuration.attributes,
                                    nodes       = {
                                        track   : null,
                                        runner  : null,
                                        cover   : null
                                    },
                                    buttons     = Render.tracks.common.buttons(type);
                                if (parameters !== null && buttons !== null) {
                                    attributes          = attributes[type];
                                    nodes.track         = document.createElement("DIV");
                                    nodes.runner        = document.createElement("DIV");
                                    nodes.cover         = document.createElement("DIV");
                                    nodes[buttons.A]    = document.createElement("DIV");
                                    nodes[buttons.B]    = document.createElement("DIV");
                                    nodes.track.        setAttribute(attributes.track.              name, attributes.track.                 value);
                                    nodes.runner.       setAttribute(attributes.runner.             name, attributes.runner.                value);
                                    nodes.cover.        setAttribute(Configuration.attributes.cover.name, Configuration.attributes.cover.   value);
                                    nodes[buttons.A].   setAttribute(attributes[buttons.A].         name, attributes[buttons.A].            value);
                                    nodes[buttons.B].   setAttribute(attributes[buttons.B].         name, attributes[buttons.B].            value);
                                    if (parameters.use_default_style === true) {
                                        nodes.track.        setAttribute(Configuration.attributes.default_style.name, Configuration.attributes.default_style.value);
                                        nodes.runner.       setAttribute(Configuration.attributes.default_style.name, Configuration.attributes.default_style.value);
                                        nodes[buttons.A].   setAttribute(Configuration.attributes.default_style.name, Configuration.attributes.default_style.value);
                                        nodes[buttons.B].   setAttribute(Configuration.attributes.default_style.name, Configuration.attributes.default_style.value);
                                    } else {
                                        if (parameters.attributes[type].track !== null) {
                                            nodes.track.setAttribute(parameters.attributes[type].track.name, parameters.attributes[type].track.value);
                                            if (parameters.attributes[type].track.innerHTML !== null) {
                                                nodes.track.innerHTML = parameters.attributes[type].track.innerHTML;
                                            }
                                        }
                                        if (parameters.attributes[type].runner !== null) {
                                            nodes.runner.setAttribute(parameters.attributes[type].runner.name, parameters.attributes[type].runner.value);
                                            if (parameters.attributes[type].runner.innerHTML !== null) {
                                                nodes.runner.innerHTML = parameters.attributes[type].runner.innerHTML;
                                            }
                                        }
                                        if (parameters.attributes[type][buttons.A] !== null) {
                                            nodes[buttons.A].setAttribute(parameters.attributes[type][buttons.A].name, parameters.attributes[type][buttons.A].value);
                                            if (parameters.attributes[type][buttons.A].innerHTML !== null) {
                                                nodes[buttons.A].innerHTML = parameters.attributes[type][buttons.A].innerHTML;
                                            }
                                        }
                                        if (parameters.attributes[type][buttons.B] !== null) {
                                            nodes[buttons.B].setAttribute(parameters.attributes[type][buttons.B].name, parameters.attributes[type][buttons.B].value);
                                            if (parameters.attributes[type][buttons.B].innerHTML !== null) {
                                                nodes[buttons.B].innerHTML = parameters.attributes[type][buttons.B].innerHTML;
                                            }
                                        }
                                    }
                                    nodes.track.    appendChild(nodes[buttons.A]);
                                    nodes.track.    appendChild(nodes[buttons.B]);
                                    nodes.track.    appendChild(nodes.runner    );
                                    nodes.runner.   appendChild(nodes.cover     );
                                    parameters.nodes[type] = {
                                        runner  : nodes.runner,
                                        track   : nodes.track,
                                        cover   : nodes.cover
                                    };
                                    parameters.nodes[type][buttons.A] = nodes[buttons.A];
                                    parameters.nodes[type][buttons.B] = nodes[buttons.B];
                                    return nodes.track;
                                }
                                return null;
                            },
                            layout  : function (id, type) {
                                var parameters  = Parameters.get(id),
                                    attributes  = Configuration.attributes.layout,
                                    layout      = parameters;
                                if (parameters !== null && Initializer.validate.type(type) === true) {
                                    attributes = attributes[type];
                                    parameters.nodes[type].track.setAttribute(attributes[parameters.layout[type]].name, attributes[parameters.layout[type]].value);
                                    return true;
                                }
                                return false;
                            }
                        },
                        vertical    : {
                            make    : function (id) {
                                return Render.tracks.common.make(id, "vertical");
                            },
                            layout  : function (id) {
                                return Render.tracks.common.layout(id, "vertical");
                            }
                        },
                        horizontal  : {
                            make    : function (id) {
                                return Render.tracks.common.make(id, "horizontal");
                            },
                            layout  : function (id) {
                                return Render.tracks.common.layout(id, "horizontal");
                            }
                        }
                    },
                };
                Sizer = {
                    size : {
                        set     : function (id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                parameters.nodes.container.style.   width   = parameters.width;
                                parameters.nodes.container.style.   height  = parameters.height;
                            }
                        },
                        update  : function (id) {
                            function getScrollBarsSize() {
                                var div = document.createElement("DIV");
                                if (typeof parameters.browser.tracks === "object") {
                                    if (typeof parameters.browser.tracks.width === "number" &&
                                        typeof parameters.browser.tracks.height === "number") {
                                        return parameters.browser.tracks;
                                    }
                                }
                                div.style.position = "absolute";
                                div.style.top       = "-1000px";
                                div.style.left      = "-1000px";
                                div.style.width     = "300px";
                                div.style.height    = "300px";
                                div.style.overflow  = "scroll";
                                document.body.appendChild(div);
                                parameters.browser.tracks = {
                                    width   : div.offsetWidth   - div.clientWidth,
                                    height  : div.offsetHeight  - div.clientHeight
                                };
                                document.body.removeChild(div);
                                parameters.browser.tracks.width     = (parameters.browser.tracks.width  === 0 ? 15 : parameters.browser.tracks.width);
                                parameters.browser.tracks.height    = (parameters.browser.tracks.height === 0 ? 15 : parameters.browser.tracks.height);
                                return parameters.browser.tracks;
                                /*
                                Здесь проблемное место. Дело в том, что на таблетках полоса проктутки накладывается на содержимое страницы.
                                Это приводит к тому, что метод определения ширины полосы путем вычетания из общего размера области размера 
                                содержимого не дает результатов, так как полоса прокрутки над содержимым и не "уменьшает" его. Но а найти
                                на момент написания этого комментрия сколь нибудь достойных решений по определению размера полосы прокрутки
                                на таблетках - не удалось. Поэтому и берется фиксированный размер в 15 пк. 
                                23.01.2014
                                */
                            }
                            var parameters              = Parameters.get(id),
                                tracks                  = null,
                                content                 = null,
                                container               = null;
                            if (parameters !== null) {
                                content                     = parameters.nodes.content;
                                container                   = parameters.nodes.container;
                                tracks                      = getScrollBarsSize();
                                content.style.width         = (container.clientWidth    + tracks.width)     + "px";
                                content.style.height        = (container.clientHeight   + tracks.height)    + "px";
                                return true;
                            }
                            return false;
                        }
                    },
                    track: {
                        buttons: {
                            vertical: {
                                getSize: function (id) {
                                    var parameters  = Parameters.get(id),
                                        size        = { up: null, track: null },
                                        position    = { up: null, down: null },
                                        borders     = { up: null, down: null };
                                    if (parameters !== null) {
                                        size.up         = HTML.Render.GetSize(parameters.nodes.vertical.up      ).OuterHeight;
                                        size.track      = HTML.Render.GetSize(parameters.nodes.vertical.track   ).OuterHeight;
                                        if (size.up !== null && size.track !== null) {
                                            position.up     = parameters.nodes.vertical.up.     offsetTop;
                                            position.down   = parameters.nodes.vertical.down.   offsetTop;
                                            borders.up      = position.up   + size.up;
                                            borders.down    = size.track    - position.down;
                                            parameters.tracks.vertical.buttons = {
                                                up  : borders.up,
                                                down: borders.down
                                            };
                                            return true;
                                        }
                                    }
                                    return null;
                                }
                            },
                            horizontal: {
                                getSize: function (id) {
                                    var parameters  = Parameters.get(id),
                                        size        = { left: null, track: null },
                                        position    = { left: null, right: null },
                                        borders     = { left: null, right: null };
                                    if (parameters !== null) {
                                        size.left   = HTML.Render.GetSize(parameters.nodes.horizontal.left  ).OuterWidth;
                                        size.track  = HTML.Render.GetSize(parameters.nodes.horizontal.track ).OuterWidth;
                                        if (size.left !== null && size.track !== null) {
                                            position.left   = parameters.nodes.horizontal.left. offsetLeft;
                                            position.right  = parameters.nodes.horizontal.right.offsetLeft;
                                            borders.left    = position.left + size.left;
                                            borders.right   = size.track    - position.right;
                                            parameters.tracks.horizontal.buttons = {
                                                left    : borders.left,
                                                right   : borders.right
                                            };
                                            return true;
                                        }
                                    }
                                    return null;
                                }
                            },
                            getSize: function (id) {
                                Sizer.track.buttons.vertical.   getSize(id);
                                Sizer.track.buttons.horizontal. getSize(id);
                            }
                        },
                        visibility: {
                            buttons: {
                                vertical: {
                                    update: function (id) {
                                        var parameters  = Parameters.get(id),
                                            rates       = Sizer.track.size.rates(id),
                                            borders     = { up: null, down: null },
                                            content     = null;
                                        if (parameters !== null && rates !== null) {
                                            if (typeof parameters.tracks.vertical.buttons === "object") {
                                                content         = parameters.nodes.content;
                                                borders.up      = content.scrollTop * rates.vertical;
                                                borders.down    = (content.scrollHeight - content.scrollTop - content.clientHeight) * rates.vertical;
                                                if (parameters.tracks.vertical.buttons.up === 0 || parameters.tracks.vertical.buttons.down === 0) {
                                                    Sizer.track.buttons.vertical.getSize(id);
                                                }
                                                if (borders.up <= parameters.tracks.vertical.buttons.up) {
                                                    parameters.nodes.vertical.up.style.opacity = 0;
                                                } else {
                                                    parameters.nodes.vertical.up.style.opacity = 1;
                                                }
                                                if (borders.down <= parameters.tracks.vertical.buttons.down) {
                                                    parameters.nodes.vertical.down.style.opacity = 0;
                                                } else {
                                                    parameters.nodes.vertical.down.style.opacity = 1;
                                                }
                                            }
                                        }
                                        return false;
                                    }
                                },
                                horizontal: {
                                    update: function (id) {
                                        var parameters  = Parameters.get(id),
                                            rates       = Sizer.track.size.rates(id),
                                            borders     = { left: null, right: null },
                                            content     = null;
                                        if (parameters !== null && rates !== null) {
                                            if (typeof parameters.tracks.horizontal.buttons === "object") {
                                                content         = parameters.nodes.content;
                                                borders.left    = content.scrollLeft * rates.horizontal;
                                                borders.right   = (content.scrollWidth - content.scrollLeft - content.clientWidth) * rates.horizontal;
                                                if (parameters.tracks.horizontal.buttons.left === 0 || parameters.tracks.horizontal.buttons.right === 0) {
                                                    Sizer.track.buttons.horizontal.getSize(id);
                                                }
                                                if (borders.left <= parameters.tracks.horizontal.buttons.left) {
                                                    parameters.nodes.horizontal.left.style.opacity = 0;
                                                } else {
                                                    parameters.nodes.horizontal.left.style.opacity = 1;
                                                }
                                                if (borders.right <= parameters.tracks.horizontal.buttons.right) {
                                                    parameters.nodes.horizontal.right.style.opacity = 0;
                                                } else {
                                                    parameters.nodes.horizontal.right.style.opacity = 1;
                                                }
                                            }
                                        }
                                        return false;
                                    }
                                }
                            },
                            tracks: {
                                common      : {
                                    update: function (id, type) {
                                        function setVisible() {
                                            if (track_style.display !== "") {
                                                track_style.display = "";
                                            }
                                        }
                                        function setHidden() {
                                            if (track_style.display !== "none") {
                                                track_style.display = "none";
                                            }
                                        }
                                        var parameters  = Parameters.get(id),
                                            content     = null,
                                            track_style = null;
                                        if (parameters !== null) {
                                            track_style = parameters.nodes[type].track.style;
                                            switch (parameters.visibility[type]) {
                                                case "auto":
                                                    content = parameters.nodes.content;
                                                    if (type === "vertical") {
                                                        if (content.clientHeight    < content.scrollHeight  ) { setVisible(); } else { setHidden(); }
                                                    } else {
                                                        if (content.clientWidth     < content.scrollWidth   ) { setVisible(); } else { setHidden(); }
                                                    }
                                                    break;
                                                case "visible":
                                                    setVisible();
                                                    break;
                                                case "hidden":
                                                    setHidden();
                                                    break;
                                            }
                                            return true;
                                        }
                                        return false;
                                    }
                                },
                                vertical    : function (id) {
                                    return Sizer.track.visibility.tracks.common.update(id, "vertical");
                                },
                                horizontal  : function (id) {
                                    return Sizer.track.visibility.tracks.common.update(id, "horizontal");
                                },
                                both        : function (id) {
                                    var result_operation = true;
                                    result_operation = (Sizer.track.visibility.tracks.vertical  (id) === true ? result_operation : false);
                                    result_operation = (Sizer.track.visibility.tracks.horizontal(id) === true ? result_operation : false);
                                    return result_operation;
                                },
                            }
                        },
                        size        : {
                            update      : function (id, type) {
                                var parameters      = Parameters.get(id),
                                    runner          = null,
                                    content         = null,
                                    size_scroll     = null,
                                    size_client     = null,
                                    property        = null;
                                if (parameters !== null && Initializer.validate.type(type) === true) {
                                    runner      = parameters.nodes[type].runner;
                                    content     = parameters.nodes.content;
                                    size_scroll = (type === "vertical" ? content.scrollHeight   : content.scrollWidth   );
                                    size_client = (type === "vertical" ? content.clientHeight   : content.clientWidth   );
                                    property    = (type === "vertical" ? "height"               : "width"               );
                                    runner.style[property] = (size_client * (size_client / size_scroll)) + "px";
                                    return true;
                                }
                                return false;
                            },
                            vertical    : function (id) {
                                return Sizer.track.size.update(id, "vertical");
                            },
                            horizontal  : function (id) {
                                return Sizer.track.size.update(id, "horizontal");
                            },
                            both        : function (id) {
                                var result_operation = true;
                                result_operation = (Sizer.track.size.update(id, "vertical"  ) === true ? result_operation : false);
                                result_operation = (Sizer.track.size.update(id, "horizontal") === true ? result_operation : false);
                                return result_operation;
                            },
                            rates       : function (id) {
                                var parameters      = Parameters.get(id),
                                    content         = null;
                                if (parameters !== null) {
                                    content     = parameters.nodes.content;
                                    return {
                                        vertical    : content.clientHeight  / content.scrollHeight,
                                        horizontal  : content.clientWidth   / content.scrollWidth
                                    };
                                }
                                return null;
                            }
                        },
                        position    : {
                            update      : function (id, type) {
                                var parameters      = Parameters.get(id),
                                    runner          = null,
                                    content         = null,
                                    size_scroll     = null,
                                    size_client     = null,
                                    position        = null,
                                    property        = null;
                                if (parameters !== null && Initializer.validate.type(type) === true) {
                                    runner      = parameters.nodes[type].runner;
                                    content     = parameters.nodes.content;
                                    size_scroll = (type === "vertical" ? content.scrollHeight   : content.scrollWidth   );
                                    size_client = (type === "vertical" ? content.clientHeight   : content.clientWidth   );
                                    position    = (type === "vertical" ? content.scrollTop      : content.scrollLeft    );
                                    property    = (type === "vertical" ? "top"                  : "left"                );
                                    runner.style[property] = (position * (size_client / size_scroll)) + "px";
                                    return true;
                                }
                                return false;
                            },
                            vertical    : function (id) {
                                return Sizer.track.position.update(id, "vertical");
                            },
                            horizontal  : function (id) {
                                return Sizer.track.position.update(id, "horizontal");
                            },
                            both        : function (id) {
                                var result_operation = true;
                                result_operation = (Sizer.track.position.update(id, "vertical"  )       === true ? result_operation : false);
                                result_operation = (Sizer.track.position.update(id, "horizontal")       === true ? result_operation : false);
                                return result_operation;
                            },
                            scroll      : {
                                common      : {
                                    to  : function (id, type, position) {
                                        function getPosition(content, position, type) {
                                            var property = (type === "vertical" ? "scrollHeight" : "scrollWidth");
                                            if (typeof position === "string") {
                                                position = (position === "max" ? content[property] : 0);
                                            }
                                            return position;
                                        }
                                        function update(id, type) {
                                            Sizer.track.position[type](id);
                                        }
                                        var parameters      = Parameters.get(id),
                                            content         = null,
                                            property        = null;
                                        if (parameters !== null && Initializer.validate.type(type) === true) {
                                            content                 = parameters.nodes.content;
                                            position                = getPosition(content, position, type);
                                            property                = (type === "vertical" ? "scrollTop" : "scrollLeft");
                                            content[property]       = position;
                                            update(id, type);
                                            return true;
                                        }
                                        return false;
                                    }
                                },
                                vertical    : {
                                    to  : function (id, position) {
                                        return Sizer.track.position.scroll.common.to(id, "vertical", position);
                                    },
                                    min : function (id) {
                                        return Sizer.track.position.scroll.common.to(id, "vertical", "min");
                                    },
                                    max : function (id) {
                                        return Sizer.track.position.scroll.common.to(id, "vertical", "max");
                                    },
                                },
                                horizontal  : {
                                    to  : function (id, position) {
                                        return Sizer.track.position.scroll.common.to(id, "horizontal", position);
                                    },
                                    min : function (id) {
                                        return Sizer.track.position.scroll.common.to(id, "horizontal", "min");
                                    },
                                    max : function (id) {
                                        return Sizer.track.position.scroll.common.to(id, "horizontal", "max");
                                    },
                                }
                            }
                        },
                        update: {
                            vertical    : function (id) {
                                var result_operation = true;
                                result_operation = (Sizer.track.size.                       update  (id, "vertical")    === true ? result_operation : false);
                                result_operation = (Sizer.track.position.                   update  (id, "vertical")    === true ? result_operation : false);
                                result_operation = (Sizer.track.visibility.buttons.vertical.update  (id)                === true ? result_operation : false);
                                result_operation = (Sizer.track.visibility.tracks.          vertical(id)                === true ? result_operation : false);
                                return result_operation;
                            },
                            horizontal  : function (id) {
                                var result_operation = true;
                                result_operation = (Sizer.track.size.                           update      (id, "horizontal")  === true ? result_operation : false);
                                result_operation = (Sizer.track.position.                       update      (id, "horizontal")  === true ? result_operation : false);
                                result_operation = (Sizer.track.visibility.buttons.horizontal.  update      (id)                === true ? result_operation : false);
                                result_operation = (Sizer.track.visibility.tracks.              horizontal  (id)                === true ? result_operation : false);
                                return result_operation;
                            },
                            both        : function (id) {
                                var result_operation = true;
                                result_operation = (Sizer.size.update               (id) === true ? result_operation : false);
                                result_operation = (Sizer.track.update.vertical     (id) === true ? result_operation : false);
                                result_operation = (Sizer.track.update.horizontal   (id) === true ? result_operation : false);
                                return result_operation;
                            }
                        }
                    }
                };
                GlobalResize = {
                    activated               : false,
                    initResizeViaTransition : function (id) {
                        var parameters = Parameters.get(id);
                        if (parameters !== null) {
                            DOMEvents.CSS.Transition.attach.end(parameters.nodes.content_value,
                                                            function (event) {
                                                                Sizer.track.update.both(id);
                                                            },
                                                            false);
                        }
                    },
                    attach                  : function () {
                        if (Configuration.flags.auto_resize === true) {
                            if (GlobalResize.activated === false) {
                                DOMEvents.DOM.AddListener(window,
                                                            "resize",
                                                            GlobalResize.processing,
                                                            Configuration.other.event_window_prefix + "_Global_Resize"
                                );
                                GlobalResize.activated = true;
                            }
                        }
                    },
                    processing              : function () {
                        var list = Parameters.list.get();
                        if (list !== null) {
                            //If Mutations events doesn't support by browser we have to make manually checking of deleted elements
                            Parameters.list.clear.manually();
                            for (var index = list.length - 1; index >= 0; index -= 1) {
                                Sizer.track.update.both(list[index]);
                            }
                        }
                    }
                };
                Events          = {
                    init        : function (id) {
                        Events.tracks.attach.           scroll      (id);
                        Events.tracks.attach.runner.    vertical    (id);
                        Events.tracks.attach.runner.    horizontal  (id);
                        Events.tracks.attach.buttons.   vertical    (id);
                        Events.tracks.attach.buttons.   horizontal  (id);
                        Events.tracks.attach.tracks.    vertical    (id);
                        Events.tracks.attach.tracks.    horizontal  (id);
                        Events.container.attach.        blockScroll (id);
                    },
                    container   : {
                        attach  : {
                            blockScroll: function (id) {
                                var parameters = Parameters.get(id);
                                if (parameters !== null) {
                                    DOMEvents.DOM.AddListener(  parameters.nodes.container,
                                                                "scroll",
                                                                function (event) {
                                                                    Events.container.actions.blockScroll(event, id);
                                                                },
                                                                id
                                    );
                                }
                            }
                        },
                        actions : {
                            blockScroll: function (event, id) {
                                var parameters = Parameters.get(id);
                                if (parameters !== null) {
                                    parameters.nodes.container.scrollTop    = 0;
                                    parameters.nodes.container.scrollLeft   = 0;
                                }
                                event.preventDefault();
                                return false;
                            }
                        }
                    },
                    tracks: {
                        attach: {
                            scroll  : function (id) {
                                var parameters = Parameters.get(id);
                                if (parameters !== null) {
                                    DOMEvents.DOM.AddListener(  parameters.nodes.content,
                                                                "scroll",
                                                                function (event) {
                                                                    Events.tracks.actions.scroll(event, id);
                                                                },
                                                                id
                                    );
                                }
                            },
                            runner  : {
                                vertical    : function (id) {
                                    var parameters = Parameters.get(id);
                                    if (parameters !== null) {
                                        DOMEvents.DOM.AddListener(  parameters.nodes.vertical.cover,
                                                                    "mousedown",
                                                                    function (event) {
                                                                        Events.tracks.actions.runner.vertical.mousedown(event, id);
                                                                    },
                                                                    id
                                        );
                                    }
                                },
                                horizontal  : function (id) {
                                    var parameters = Parameters.get(id);
                                    if (parameters !== null) {
                                        DOMEvents.DOM.AddListener(  parameters.nodes.horizontal.cover,
                                                                    "mousedown",
                                                                    function (event) {
                                                                        Events.tracks.actions.runner.horizontal.mousedown(event, id);
                                                                    },
                                                                    id
                                        );
                                    }
                                }
                            },
                            buttons : {
                                vertical    : function (id) {
                                    var parameters = Parameters.get(id);
                                    if (parameters !== null) {
                                        DOMEvents.DOM.AddListener(  parameters.nodes.vertical.up,
                                                                    "mousedown",
                                                                    function (event) {
                                                                        Events.tracks.actions.buttons.common.mousedown(event, id, "up", "vertical");
                                                                    },
                                                                    id
                                        );
                                        DOMEvents.DOM.AddListener(  parameters.nodes.vertical.down,
                                                                    "mousedown",
                                                                    function (event) {
                                                                        Events.tracks.actions.buttons.common.mousedown(event, id, "down", "vertical");
                                                                    },
                                                                    id
                                        );
                                    }
                                },
                                horizontal  : function (id) {
                                    var parameters = Parameters.get(id);
                                    if (parameters !== null) {
                                        DOMEvents.DOM.AddListener(  parameters.nodes.horizontal.left,
                                                                    "mousedown",
                                                                    function (event) {
                                                                        Events.tracks.actions.buttons.common.mousedown(event, id, "left", "horizontal");
                                                                    },
                                                                    id
                                        );
                                        DOMEvents.DOM.AddListener(  parameters.nodes.horizontal.right,
                                                                    "mousedown",
                                                                    function (event) {
                                                                        Events.tracks.actions.buttons.common.mousedown(event, id, "right", "horizontal");
                                                                    },
                                                                    id
                                        );
                                    }
                                }
                            },
                            tracks  : {
                                vertical    : function (id) {
                                    var parameters = Parameters.get(id);
                                    if (parameters !== null) {
                                        DOMEvents.DOM.AddListener(  parameters.nodes.vertical.track,
                                                                    "mousedown",
                                                                    function (event) {
                                                                        Events.tracks.actions.tracks.common.mousedown(event, id, "vertical");
                                                                    },
                                                                    id
                                        );
                                    }
                                },
                                horizontal  : function (id) {
                                    var parameters = Parameters.get(id);
                                    if (parameters !== null) {
                                        DOMEvents.DOM.AddListener(  parameters.nodes.horizontal.track,
                                                                    "mousedown",
                                                                    function (event) {
                                                                        Events.tracks.actions.tracks.common.mousedown(event, id, "horizontal");
                                                                    },
                                                                    id
                                        );
                                    }
                                }
                            },
                        },
                        actions: {
                            cache   : {
                                reset   : function (data) {
                                    if (typeof data === "object") {
                                        Overhead.vars.set(Configuration.other.variables_group_name, Configuration.other.actions_cache_var_name, data, true);
                                    } else {
                                        Overhead.vars.set(Configuration.other.variables_group_name, Configuration.other.actions_cache_var_name, null, true);
                                    }
                                },
                                get     : function () {
                                    return Overhead.vars.get(Configuration.other.variables_group_name, Configuration.other.actions_cache_var_name);
                                }
                            },
                            visibility: {
                                cache       : {
                                    timers  : {},
                                    set     : function (id) {
                                        var parameters  = Parameters.get(id),
                                            data        = Events.tracks.actions.visibility.cache.timers;
                                        if (parameters !== null) {
                                            if (typeof data[id] !== "object") {
                                                data[id] = {
                                                    vertical    : null,
                                                    horizontal  : null
                                                };
                                            }
                                        }
                                    },
                                    get     : function (id) {
                                        var data = Events.tracks.actions.visibility.cache.timers;
                                        if (typeof data[id] === "object") {
                                            return data[id];
                                        } else {
                                            Events.tracks.actions.visibility.cache.set(id);
                                            return data[id];
                                        }
                                        return null;
                                    }
                                },
                                apply       : function (id, action, type) {
                                    var parameters      = Parameters.get(id),
                                        cache           = Events.tracks.actions.visibility.cache.get(id),
                                        cache_tracks    = Events.tracks.actions.cache.get();
                                    if (parameters !== null && cache !== null) {
                                        if (parameters.hide_tracks === true) {
                                            switch (action) {
                                                case "show":
                                                    parameters.nodes[type].track.style.opacity = "1";
                                                    break;
                                                case "hide":
                                                    if (cache[type] !== null) {
                                                        clearTimeout(cache[type]);
                                                    }
                                                    cache[type] = setTimeout(
                                                        function () {
                                                            if (Events.tracks.actions.cache.get() === null) {
                                                                parameters.nodes[type].track.style.opacity = "";
                                                            }
                                                            cache[type] = null;
                                                        },
                                                        Configuration.other.fade_track_onscroll
                                                    );
                                                    break;
                                            }
                                            return true;
                                        }
                                    }
                                    return false;
                                },
                                vertical    : {
                                    show: function (id) {
                                        return Events.tracks.actions.visibility.apply(id, "show", "vertical");
                                    },
                                    hide: function (id) {
                                        return Events.tracks.actions.visibility.apply(id, "hide", "vertical");
                                    },
                                },
                                horizontal  : {
                                    show: function (id) {
                                        return Events.tracks.actions.visibility.apply(id, "show", "horizontal");
                                    },
                                    hide: function (id) {
                                        return Events.tracks.actions.visibility.apply(id, "hide", "horizontal");
                                    },
                                },
                                fade        : function (id) {
                                    var result_operation    = false,
                                        cache               = Events.tracks.actions.cache.get();
                                    if (cache === null) {
                                        result_operation = (Events.tracks.actions.visibility.vertical.show(id)      === true ? true : result_operation);
                                        result_operation = (Events.tracks.actions.visibility.horizontal.show(id)    === true ? true : result_operation);
                                        result_operation = (Events.tracks.actions.visibility.vertical.hide(id)      === true ? true : result_operation);
                                        result_operation = (Events.tracks.actions.visibility.horizontal.hide(id)    === true ? true : result_operation);
                                    }
                                }
                            },
                            scroll  : function (event, id) {
                                var parameters = Parameters.get(id);
                                if (parameters !== null) {
                                    Sizer.track.update.both(id);
                                    if (Events.tracks.actions.cache.get() === null) {
                                        Events.tracks.actions.visibility.fade(id);
                                    }
                                    Purity.System.runHandle(parameters.events.scroll, [event, id], "[Purity.Controls.ScrollBox]: Events.actions.scroll", this);
                                }
                            },
                            tracks  : {
                                common    : {
                                    mousedown   : function (event, id, track) {
                                        var parameters  = Parameters.get(id),
                                            cache       = Events.tracks.actions.cache.get(),
                                            timer       = null,
                                            clientSize  = null,
                                            direction   = null,
                                            position    = null;
                                        if (parameters !== null && cache === null) {
                                            cache = Events.tracks.actions.cache;
                                            position = HTML.Render.Position.ByPage(parameters.nodes[track].runner)[(track === "vertical" ? "top" : "left")];
                                            switch (track) {
                                                case "vertical":
                                                    clientSize  = parameters.nodes.content.clientHeight;
                                                    direction   = (event._pageY < position ? "up" : "down");
                                                    Purity.System.runHandle(parameters.events.track_vertical, [event, id], "[Purity.Controls.ScrollBox]: Events.actions.scroll", this);
                                                    break;
                                                case "horizontal":
                                                    clientSize  = parameters.nodes.content.clientWidth;
                                                    direction   = (event._pageX < position ? "left" : "right");
                                                    Purity.System.runHandle(parameters.events.track_horizontal, [event, id], "[Purity.Controls.ScrollBox]: Events.actions.scroll", this);
                                                    break;
                                            }
                                            timer = setTimeout( Events.tracks.actions.tracks[track].processing,
                                                                Configuration.other.timeout_tracks_start,
                                                                { id: id, direction: direction });
                                            cache.reset({
                                                            step    : clientSize,
                                                            timer   : timer 
                                                        }
                                            );
                                            Events.tracks.actions.tracks.common.mouseup.attach(id, track);
                                            Events.tracks.actions.visibility[track].show(id);
                                            event.preventDefault();
                                            return false;
                                        }
                                    },
                                    mouseup     : {
                                        attach      : function (id, track) {
                                            var event_type = "mouseup";
                                            DOMEvents.DOM.AddListener(  window,
                                                                        event_type,
                                                                        function (event) {
                                                                            Events.tracks.actions.tracks.common.mouseup.processing(event, id, track);
                                                                        },
                                                                        Configuration.other.event_window_prefix + event_type + id
                                            );
                                        },
                                        detach      : function (id) {
                                            var event_type = "mouseup";
                                            DOMEvents.DOM.RemoveListener(   window,
                                                                            event_type,
                                                                            Configuration.other.event_window_prefix + event_type + id,
                                                                            null
                                            );
                                        },
                                        processing  : function (event, id, track) {
                                            var parameters  = Parameters.get(id),
                                                cache       = Events.tracks.actions.cache.get();
                                            if (parameters !== null) {
                                                Events.tracks.actions.tracks.common.mouseup.detach(id);
                                                Events.tracks.actions.visibility[track].hide(id);
                                                if (cache !== null) {
                                                    clearTimeout(cache.timer);
                                                    Events.tracks.actions.cache.reset();
                                                }
                                            }
                                        }
                                    }
                                },
                                vertical: {
                                    processing: function (params) {
                                        var parameters  = Parameters.get(params.id),
                                            cache       = Events.tracks.actions.cache.get(),
                                            next_step   = false;
                                        if (parameters !== null && cache !== null) {
                                            switch (params.direction) {
                                                case "up":
                                                    parameters.nodes.content.scrollTop -= cache.step;
                                                    next_step = (parameters.nodes.content.scrollTop > 0 ? true : false);
                                                    break;
                                                case "down":
                                                    parameters.nodes.content.scrollTop += cache.step;
                                                    next_step = (parameters.nodes.content.scrollTop < parameters.nodes.content.scrollHeight - parameters.nodes.content.clientHeight ? true : false);
                                                    break;
                                            }
                                            if (next_step === true) {
                                                cache.timer = setTimeout(   Events.tracks.actions.tracks.vertical.processing,
                                                                            Configuration.other.timeout_tracks_next,
                                                                            { id: params.id, direction: params.direction });
                                            } else {
                                                Events.tracks.actions.cache.reset();
                                            }
                                        }
                                    },
                                },
                                horizontal: {
                                    processing: function (params) {
                                        var parameters  = Parameters.get(params.id),
                                            cache       = Events.tracks.actions.cache.get(),
                                            next_step   = false;
                                        if (parameters !== null && cache !== null) {
                                            switch (params.direction) {
                                                case "left":
                                                    parameters.nodes.content.scrollLeft -= cache.step;
                                                    next_step = (parameters.nodes.content.scrollLeft > 0 ? true : false);
                                                    break;
                                                case "right":
                                                    parameters.nodes.content.scrollLeft += cache.step;
                                                    next_step = (parameters.nodes.content.scrollLeft < parameters.nodes.content.scrollWidth - parameters.nodes.content.clientWidth ? true : false);
                                                    break;
                                            }
                                            if (next_step === true) {
                                                cache.timer = setTimeout(   Events.tracks.actions.tracks.horizontal.processing,
                                                                            Configuration.other.timeout_tracks_next,
                                                                            { id: params.id, direction: params.direction });
                                            } else {
                                                Events.tracks.actions.cache.reset();
                                            }
                                        }
                                    },
                                }
                            },
                            buttons : {
                                common    : {
                                    mousedown   : function (event, id, button, track) {
                                        var parameters  = Parameters.get(id),
                                            cache       = Events.tracks.actions.cache,
                                            timer       = null,
                                            clientSize  = null,
                                            step        = null;
                                        if (parameters !== null) {
                                            timer = setTimeout( Events.tracks.actions.buttons[track].processing,
                                                                Configuration.other.timeout_buttons_start,
                                                                { id: id, button: button });
                                            clientSize  = (track === "vertical" ? parameters.nodes.content.clientHeight : parameters.nodes.content.clientWidth);
                                            step        = clientSize * Configuration.other.step_buttons;
                                            step        = (step < 1 ? 1 : step);
                                            cache.reset({
                                                            step    : step,
                                                            timer   : timer 
                                                        }
                                            );
                                            Events.tracks.actions.buttons.common.mouseup.attach(id, track);
                                            Events.tracks.actions.visibility[track].show(id);
                                            switch (button) {
                                                case "up":
                                                    Purity.System.runHandle(parameters.events.button_up, [event, id], "[Purity.Controls.ScrollBox]: Events.actions.scroll", this);
                                                    break;
                                                case "down":
                                                    Purity.System.runHandle(parameters.events.button_down, [event, id], "[Purity.Controls.ScrollBox]: Events.actions.scroll", this);
                                                    break;
                                                case "left":
                                                    Purity.System.runHandle(parameters.events.button_left, [event, id], "[Purity.Controls.ScrollBox]: Events.actions.scroll", this);
                                                    break;
                                                case "right":
                                                    Purity.System.runHandle(parameters.events.button_right, [event, id], "[Purity.Controls.ScrollBox]: Events.actions.scroll", this);
                                                    break;
                                            }
                                            event.preventDefault();
                                            return false;
                                        }
                                    },
                                    mouseup     : {
                                        attach      : function (id, track) {
                                            var event_type = "mouseup";
                                            DOMEvents.DOM.AddListener(  window,
                                                                        event_type,
                                                                        function (event) {
                                                                            Events.tracks.actions.buttons.common.mouseup.processing(event, id, track);
                                                                        },
                                                                        Configuration.other.event_window_prefix + event_type + id
                                            );
                                        },
                                        detach      : function (id) {
                                            var event_type = "mouseup";
                                            DOMEvents.DOM.RemoveListener(   window,
                                                                            event_type,
                                                                            Configuration.other.event_window_prefix + event_type + id,
                                                                            null
                                            );
                                        },
                                        processing  : function (event, id, track) {
                                            var parameters  = Parameters.get(id),
                                                cache       = Events.tracks.actions.cache.get();
                                            if (parameters !== null) {
                                                Events.tracks.actions.buttons.common.mouseup.detach(id);
                                                Events.tracks.actions.visibility[track].hide(id);
                                                if (cache !== null) {
                                                    clearTimeout(cache.timer);
                                                    Events.tracks.actions.cache.reset();
                                                }
                                            }
                                        }
                                    }
                                },
                                vertical: {
                                    processing: function (params) {
                                        var parameters  = Parameters.get(params.id),
                                            cache       = Events.tracks.actions.cache.get(),
                                            next_step   = false;
                                        if (parameters !== null && cache !== null) {
                                            switch (params.button) {
                                                case "up":
                                                    parameters.nodes.content.scrollTop -= cache.step;
                                                    next_step = (parameters.nodes.content.scrollTop > 0 ? true : false);
                                                    break;
                                                case "down":
                                                    parameters.nodes.content.scrollTop += cache.step;
                                                    next_step = (parameters.nodes.content.scrollTop < parameters.nodes.content.scrollHeight - parameters.nodes.content.clientHeight ? true : false);
                                                    break;
                                            }
                                            if (next_step === true) {
                                                cache.timer = setTimeout(   Events.tracks.actions.buttons.vertical.processing,
                                                                            Configuration.other.timeout_buttons_next,
                                                                            { id: params.id, button: params.button });
                                            } else {
                                                Events.tracks.actions.cache.reset();
                                            }
                                        }
                                    },
                                },
                                horizontal: {
                                    processing: function (params) {
                                        var parameters  = Parameters.get(params.id),
                                            cache       = Events.tracks.actions.cache.get(),
                                            next_step   = false;
                                        if (parameters !== null && cache !== null) {
                                            switch (params.button) {
                                                case "left":
                                                    parameters.nodes.content.scrollLeft -= cache.step;
                                                    next_step = (parameters.nodes.content.scrollLeft > 0 ? true : false);
                                                    break;
                                                case "right":
                                                    parameters.nodes.content.scrollLeft += cache.step;
                                                    next_step = (parameters.nodes.content.scrollLeft < parameters.nodes.content.scrollWidth - parameters.nodes.content.clientWidth ? true : false);
                                                    break;
                                            }
                                            if (next_step === true) {
                                                cache.timer = setTimeout(   Events.tracks.actions.buttons.horizontal.processing,
                                                                            Configuration.other.timeout_buttons_next,
                                                                            { id: params.id, button: params.button });
                                            } else {
                                                Events.tracks.actions.cache.reset();
                                            }
                                        }
                                    },
                                }
                            },
                            runner  : {
                                transition  : {
                                    on  : function (node) {
                                        var property = CSS.Styles.property(node, "transition");
                                        if (property !== null) {
                                            node.style[property.name] = "";
                                        }
                                    },
                                    off : function (node) {
                                        var property = CSS.Styles.property(node, "transition");
                                        if (property !== null) {
                                            node.style[property.name] = "none";
                                        }
                                    },
                                },
                                vertical    : {
                                    mousedown   : function (event, id) {
                                        var parameters  = Parameters.get(id),
                                            cache       = Events.tracks.actions.cache,
                                            actions     = Events.tracks.actions.runner.vertical;
                                        if (parameters !== null) {
                                            if (event.clienY !== "undefined") {
                                                actions.mousemove.  attach(id);
                                                actions.mouseup.    attach(id);
                                                cache.reset({ y: event.clientY });
                                                Events.tracks.actions.runner.transition.off(parameters.nodes.vertical.runner);
                                                Events.tracks.actions.visibility.vertical.show(id);
                                                event.preventDefault();
                                                return false;
                                            }
                                            Purity.System.runHandle(parameters.events.runner_vertical, [event, id], "[Purity.Controls.ScrollBox]: Events.actions.scroll", this);
                                        }
                                    },
                                    mousemove   : {
                                        attach      : function (id) {
                                            var event_type = "mousemove";
                                            DOMEvents.DOM.AddListener(  window,
                                                                        event_type,
                                                                        function (event) {
                                                                            Events.tracks.actions.runner.vertical.mousemove.processing(event, id);
                                                                        },
                                                                        Configuration.other.event_window_prefix + event_type + id
                                            );
                                        },
                                        detach      : function (id) {
                                            var event_type = "mousemove";
                                            DOMEvents.DOM.RemoveListener(   window,
                                                                            event_type,
                                                                            Configuration.other.event_window_prefix + event_type + id,
                                                                            null
                                            );
                                        },
                                        processing  : function (event, id) {
                                            var parameters  = Parameters.get(id),
                                                cache       = Events.tracks.actions.cache.get(),
                                                rates       = Sizer.track.size.rates(id);
                                            if (parameters !== null && rates !== null && cache !== null) {
                                                if (event.clientY !== "undefined") {
                                                    if (event.clientY !== cache.y) {
                                                        parameters.nodes.content.scrollTop  += Math.round((event.clientY - cache.y) * (1 / rates.vertical));
                                                        cache.y                             = event.clientY;
                                                        Sizer.track.position.vertical(id);
                                                    }
                                                }
                                            }
                                            event.preventDefault();
                                            return false;
                                        }
                                    },
                                    mouseup     : {
                                        attach      : function (id) {
                                            var event_type = "mouseup";
                                            DOMEvents.DOM.AddListener(  window,
                                                                        event_type,
                                                                        function (event) {
                                                                            Events.tracks.actions.runner.vertical.mouseup.processing(event, id);
                                                                        },
                                                                        Configuration.other.event_window_prefix + event_type + id
                                            );
                                        },
                                        detach      : function (id) {
                                            var event_type = "mouseup";
                                            DOMEvents.DOM.RemoveListener(   window,
                                                                            event_type,
                                                                            Configuration.other.event_window_prefix + event_type + id,
                                                                            null
                                            );
                                        },
                                        processing  : function (event, id) {
                                            var parameters = Parameters.get(id);
                                            if (parameters !== null) {
                                                Events.tracks.actions.cache.                    reset   ();
                                                Events.tracks.actions.runner.vertical.mousemove.detach  (id);
                                                Events.tracks.actions.runner.vertical.mouseup.  detach  (id);
                                                Events.tracks.actions.runner.transition.        on      (parameters.nodes.vertical.runner);
                                                Events.tracks.actions.visibility.vertical.      hide    (id);
                                            }
                                        }
                                    }
                                },
                                horizontal  : {
                                    mousedown   : function (event, id) {
                                        var parameters  = Parameters.get(id),
                                            cache       = Events.tracks.actions.cache,
                                            actions     = Events.tracks.actions.runner.horizontal;
                                        if (parameters !== null) {
                                            if (event.clienX !== "undefined") {
                                                actions.mousemove.  attach(id);
                                                actions.mouseup.    attach(id);
                                                cache.reset({ x: event.clientX });
                                                Events.tracks.actions.runner.transition.off(parameters.nodes.horizontal.runner);
                                                Events.tracks.actions.visibility.horizontal.show(id);
                                                event.preventDefault();
                                                return false;
                                            }
                                            Purity.System.runHandle(parameters.events.runner_horizontal, [event, id], "[Purity.Controls.ScrollBox]: Events.actions.scroll", this);
                                        }
                                    },
                                    mousemove   : {
                                        attach      : function (id) {
                                            var event_type = "mousemove";
                                            DOMEvents.DOM.AddListener(  window,
                                                                        event_type,
                                                                        function (event) {
                                                                            Events.tracks.actions.runner.horizontal.mousemove.processing(event, id);
                                                                        },
                                                                        Configuration.other.event_window_prefix + event_type + id
                                            );
                                        },
                                        detach      : function (id) {
                                            var event_type = "mousemove";
                                            DOMEvents.DOM.RemoveListener(   window,
                                                                            event_type,
                                                                            Configuration.other.event_window_prefix + event_type + id,
                                                                            null
                                            );
                                        },
                                        processing  : function (event, id) {
                                            var parameters  = Parameters.get(id),
                                                cache       = Events.tracks.actions.cache.get(),
                                                rates       = Sizer.track.size.rates(id);
                                            if (parameters !== null && rates !== null && cache !== null) {
                                                if (event.clientX !== "undefined") {
                                                    if (event.clientX !== cache.x) {
                                                        parameters.nodes.content.scrollLeft += Math.round((event.clientX - cache.x) * (1 / rates.horizontal));
                                                        cache.x                             = event.clientX;
                                                        Sizer.track.position.horizontal(id);
                                                    }
                                                }
                                            }
                                            event.preventDefault();
                                            return false;
                                        }
                                    },
                                    mouseup     : {
                                        attach      : function (id) {
                                            var event_type = "mouseup";
                                            DOMEvents.DOM.AddListener(  window,
                                                                        event_type,
                                                                        function (event) {
                                                                            Events.tracks.actions.runner.horizontal.mouseup.processing(event, id);
                                                                        },
                                                                        Configuration.other.event_window_prefix + event_type + id
                                            );
                                        },
                                        detach      : function (id) {
                                            var event_type = "mouseup";
                                            DOMEvents.DOM.RemoveListener(   window,
                                                                            event_type,
                                                                            Configuration.other.event_window_prefix + event_type + id,
                                                                            null
                                            );
                                        },
                                        processing  : function (event, id) {
                                            var parameters = Parameters.get(id);
                                            if (parameters !== null) {
                                                Events.tracks.actions.cache.                        reset   ();
                                                Events.tracks.actions.runner.horizontal.mousemove.  detach  (id);
                                                Events.tracks.actions.runner.horizontal.mouseup.    detach  (id);
                                                Events.tracks.actions.runner.transition.            on      (parameters.nodes.horizontal.runner);
                                                Events.tracks.actions.visibility.horizontal.        hide    (id);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                PublicMethods = {
                    create: function () {
                        ///     <summary>Create group list.</summary>
                        ///     <param name="params" type="Object">
                        ///         {   parent          : DOMObject,                                                    &#13;&#10;
                        ///             width           : string    (with "px", "em" or "%"),                           &#13;&#10;
                        ///             [before]        : DOMObject (add list before this node in parent),              &#13;&#10;
                        ///             [container]     : DOMObject (use this node as contaier for list),               &#13;&#10;
                        ///             [content]       : DOMObject (use this node for items),                          &#13;&#10;
                        ///             [attributes]    : object    {container: object, item: object, group: object},   &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <returns type="Boolean" mayBeNull="true">Null - if error. True if is OK.</returns>
                        return Purity.System.runHandle(Initializer.create, arguments, "[Controls.ScrollBox][Initializer.create]", this);
                    },
                    update: {
                        bars : {
                            vertical    : function () {
                                return Purity.System.runHandle(Sizer.track.update.vertical,   arguments, "[Controls.ScrollBox][Sizer.track.size.vertical]",   this);
                            },
                            horizontal  : function () {
                                return Purity.System.runHandle(Sizer.track.update.horizontal, arguments, "[Controls.ScrollBox][Sizer.track.size.horizontal]", this);
                            },
                            both        : function () {
                                return Purity.System.runHandle(Sizer.track.update.both,       arguments, "[Controls.ScrollBox][Sizer.track.size.both]",       this);
                            }
                        }
                    },
                    scroll: {
                        vertical    : {
                            to  : function () {
                                return Purity.System.runHandle(Sizer.track.position.scroll.vertical.to, arguments, "[Controls.ScrollBox][Sizer.track.position.scroll.vertical.to]", this);
                            },
                            min : function () {
                                return Purity.System.runHandle(Sizer.track.position.scroll.vertical.min, arguments, "[Controls.ScrollBox][Sizer.track.position.scroll.vertical.min]", this);
                            },
                            max : function () {
                                return Purity.System.runHandle(Sizer.track.position.scroll.vertical.max, arguments, "[Controls.ScrollBox][Sizer.track.position.scroll.vertical.max]", this);
                            },
                        },
                        horizontal  : {
                            to  : function () {
                                return Purity.System.runHandle(Sizer.track.position.scroll.horizontal.to, arguments, "[Controls.ScrollBox][Sizer.track.position.scroll.horizontal.to]", this);
                            },
                            min : function () {
                                return Purity.System.runHandle(Sizer.track.position.scroll.horizontal.min, arguments, "[Controls.ScrollBox][Sizer.track.position.scroll.horizontal.min]", this);
                            },
                            max : function () {
                                return Purity.System.runHandle(Sizer.track.position.scroll.horizontal.max, arguments, "[Controls.ScrollBox][Sizer.track.position.scroll.horizontal.max]", this);
                            },
                        }
                    }
                };
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
                    create: PublicMethods.create,
                    update: {
                        bars: {
                            vertical    : PublicMethods.update.bars.vertical,
                            horizontal  : PublicMethods.update.bars.horizontal,
                            both        : PublicMethods.update.bars.both
                        }
                    },
                    scroll: {
                        vertical    : {
                            to  : PublicMethods.scroll.vertical.to,
                            max : PublicMethods.scroll.vertical.max,
                            min : PublicMethods.scroll.vertical.min,
                        },
                        horizontal  : {
                            to  : PublicMethods.scroll.horizontal.to,
                            max : PublicMethods.scroll.horizontal.max,
                            min : PublicMethods.scroll.horizontal.min,
                        },
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