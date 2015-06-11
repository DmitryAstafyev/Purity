/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.Extended.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.Touch.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.Mutation.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Overhead.js" />
/// <reference path="~/Kernel/JS/Purity.Controls.Tools.Resize.js" />
/// <reference path="~/Kernel/JS/Purity.Controls.Tools.Movement.js" />
/// <reference path="~/Kernel/JS/Purity.Controls.Tools.Align.js" />
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
        Purity.createModule("Controls.Window",
            //Check references
            {
                modules     : ["Tools", "HTML", "Environment.Events", "Environment.Events.Touch", "Environment.Overhead", "Environment.Events.Mutation", "HTML.Extended", "Controls.Tools.Resize", "Controls.Tools.Movement", "Controls.Tools.Align"],
                resources   : [{ url: "", name: "Purity.Controls.Window.css", path: "~/Kernel/CSS/", type: "jsic", cache: true, initas: "css", id: "Purity.Controls.Window.css" }]
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Controls.Window",
                    version         = "1.0",
                    lastUpdate      = "28.01.2014",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Configuration   = {},
                    Parameters      = {},
                    Initializer     = {},
                    Render          = {},
                    Events          = {},
                    Maximaze        = {},
                    PublicMethods   = {},
                    //Declaration references
                    HTML            = new Purity.initModule("HTML"                          ),
                    HTMLExtended    = new Purity.initModule("HTML.Extended"                 ),
                    Tools           = new Purity.initModule("Tools"                         ),
                    Overhead        = new Purity.initModule("Environment.Overhead"          ),
                    ToolsResize     = new Purity.initModule("Controls.Tools.Resize"         ),
                    ToolsMovement   = new Purity.initModule("Controls.Tools.Movement"       ),
                    ToolsAlign      = new Purity.initModule("Controls.Tools.Align"          ),
                    DOMEvents       = new Purity.initModule("Environment.Events"            ),
                    MutationEvents  = new Purity.initModule("Environment.Events.Mutation"   ),
                    TouchEvents     = new Purity.initModule("Environment.Events.Touch"      );
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Configuration   = {
                    makeup: {
                        layer: {
                            container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window" },
                            casing      : {
                                container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Casing" },
                                header      : {
                                    container   : { node: "DIV",    name: "data-type-element", value: "Purity.Controls.Window.Header" },
                                    title       : {
                                        container   : { node: "DIV",    name: "data-type-element", value: "Purity.Controls.Window.Header.Title" },
                                        value       : { node: "P",      name: "data-type-element", value: "Purity.Controls.Window.Header.Title" },
                                        settingup   : {
                                            parent: "container",
                                            childs: ["value"]
                                        }
                                    },
                                    buttons : {
                                        container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Header.Buttons"          },
                                        close       : {
                                            container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Header.Buttons.Close"            },
                                            icon        : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Header.Buttons.Close.Icon"       },
                                            settingup   : {
                                                parent: "container",
                                                childs: ["icon"]
                                            }
                                        },
                                        minimaze    : {
                                            container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Header.Buttons.Minimaze"         },
                                            icon        : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Header.Buttons.Minimaze.Icon"    },
                                            settingup   : {
                                                parent: "container",
                                                childs: ["icon"]
                                            }
                                        },
                                        maximaze    : {
                                            container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Header.Buttons.Maximaze"         },
                                            icon        : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Header.Buttons.Maximaze.Icon"    },
                                            settingup   : {
                                                parent: "container",
                                                childs: ["icon"]
                                            }
                                        },
                                        settingup: {
                                            parent: "container",
                                            childs: ["minimaze", "maximaze", "close"]
                                        }
                                    },
                                    settingup   : {
                                        parent  : "container",
                                        childs  : ["title", "buttons"]
                                    }
                                },
                                content     : {
                                    container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Content"         },
                                    casing      : {
                                        container   : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Content.Casing" },
                                        value       : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Content.Value" },
                                        settingup: {
                                            parent: "container",
                                            childs: ["value"]
                                        }
                                    },
                                    settingup   : {
                                        parent  : "container",
                                        childs  : ["casing"]
                                    }
                                },
                                //Borders
                                top         : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Borders.Top"     },
                                bottom      : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Borders.Bottom"  },
                                left        : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Borders.Left"    },
                                right       : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Borders.Right"   },
                                //Corners
                                TL          : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Corners.TL"      },
                                TR          : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Corners.TR"      },
                                BL          : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Corners.BL"      },
                                BR          : { node: "DIV", name: "data-type-element", value: "Purity.Controls.Window.Corners.BR"      },
                                settingup   : {
                                    parent: "container",
                                    childs: ["content", "header", "top", "bottom", "left", "right", "TL", "TR", "BL", "BR"]
                                }
                            },
                            settingup: {
                                parent  : "container",
                                childs  : ["casing"]
                            }
                        },
                    },
                    attributes: {
                        default_style   : { name: "data-default-style", value: "true" },
                    },
                    other: {
                        variables_group_name: "Purity_Controls_Window",
                        variable_list_name  : "List_Of_Instances"
                    },
                    flags: {
                        manually_clear: {
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
                                    Parameters.list.del (id);
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
                                data.nodes  = {};
                                data.IDs    = {};
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
                Initializer = {
                    validate: {
                        basic       : function (params) {
                            return Tools.Object.validate(params, [  { name: "parent",       type: "node",       value: document.body    },
                                                                    { name: "id",           type: "string",     value: null             },
                                                                    { name: "size",         type: "object",     value: {}               },
                                                                    { name: "min_size",     type: "object",     value: {}               },
                                                                    { name: "content",      type: "node",       value: null             },
                                                                    { name: "layout",       type: "object",     value: {}               },
                                                                    { name: "title",        type: "string",     value: null             },
                                                                    { name: "buttons",      type: "object",     value: {}               },
                                                                    { name: "attribute",    type: "object",     value: {}               },
                                                                    { name: "events",       type: "object",     value: {}               },
                                                                    { name: "movement",     type: "boolean",    value: true             },
                                                                    { name: "resize",       type: "boolean",    value: true             }]);
                        },
                        layout      : function (layout) {
                            return Tools.Object.validate(layout, [  { name: "vertical",     type: "string", values: ["top", "center", "bottom"], value: "center" },
                                                                    { name: "horizontal",   type: "string", values: ["left", "center", "right"], value: "center" }]);
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
                        min_size    : function (min_size) {
                            return Tools.Object.validate(min_size, [{ name: "width",    type: "number", value: 0 },
                                                                    { name: "height",   type: "number", value: 0 }]);
                        },
                        buttons     : function (buttons) {
                            return Tools.Object.validate(buttons, [ { name: "close",    type: "boolean", value: true },
                                                                    { name: "minimaze", type: "boolean", value: true },
                                                                    { name: "maximaze", type: "boolean", value: true }]);
                        },
                        attribute   : function (attribute) {
                            if (Tools.Object.validate(attribute, [  { name: "name",     type: "string"},
                                                                    { name: "value",    type: "string"}]) === false){
                                attribute.name  = Configuration.attributes.default_style.name;
                                attribute.value = Configuration.attributes.default_style.value;
                            }
                            return true;
                        },
                        events      : function (events) {
                            if (Tools.Object.validate(events, [ { name: "resize",   type: "object", value: {} },
                                                                { name: "movement", type: "object", value: {} },
                                                                { name: "close",    type: "object", value: {} },
                                                                { name: "minimaze", type: "object", value: {} },
                                                                { name: "maximaze", type: "object", value: {} }]) === true) {
                                Tools.Object.validate(events.resize, [  { name: "start",        type: "function", value: null },
                                                                        { name: "processing",   type: "function", value: null },
                                                                        { name: "finish",       type: "function", value: null } ]);
                                Tools.Object.validate(events.movement, [{ name: "start",        type: "function", value: null },
                                                                        { name: "processing",   type: "function", value: null },
                                                                        { name: "finish",       type: "function", value: null } ]);
                                Tools.Object.validate(events.close, [   { name: "after",        type: "function", value: null },
                                                                        { name: "before",       type: "function", value: null }]);
                                Tools.Object.validate(events.minimaze, [{ name: "after",        type: "function", value: null },
                                                                        { name: "before",       type: "function", value: null }]);
                                Tools.Object.validate(events.maximaze, [{ name: "after",        type: "function", value: null },
                                                                        { name: "before",       type: "function", value: null }]);
                                return true;
                            }
                            return false;
                        },
                    },
                    actions : {
                        create      : function (params) {
                            var parameters  = null,
                                validate    = Initializer.validate;
                            if (validate.basic(params) === true) {
                                if (validate.buttons    (params.buttons     ) === true &&
                                    validate.size       (params.size        ) === true &&
                                    validate.min_size   (params.min_size    ) === true &&
                                    validate.attribute  (params.attribute   ) === true &&
                                    validate.layout     (params.layout      ) === true) {
                                    //Check id
                                    params.id           = (params.id === null ? Tools.IDs.Get(6) : params.id);
                                    //Register instance of element
                                    parameters          = Parameters.register(params.id,    {
                                                                                                id          : params.id,
                                                                                                size        : params.size,
                                                                                                min_size    : params.min_size,
                                                                                                title       : params.title,
                                                                                                buttons     : params.buttons,
                                                                                                layout      : params.layout,
                                                                                                attribute   : params.attribute,
                                                                                                resize      : params.resize,
                                                                                                movement    : params.movement,
                                                                                                events      : params.events
                                                                                            }
                                    );
                                    //Render element
                                    Render.make         (params.id, params.parent, params.content);
                                    //Set size
                                    Render.sizer.set    (params.id);
                                    //Correct size (if it was defined in %%)
                                    Render.sizer.accept (params.id);
                                    //Set buttons 
                                    Render.buttons.set  (params.id);
                                    //Align
                                    Render.align        (params.id);
                                    //Attach resize
                                    Events.init         (params.id);
                                    //Add into list
                                    Parameters.list.add (params.id);
                                    //Return result
                                    return {
                                        id          : params.id,
                                        content     : parameters.nodes.content
                                    };
                                }
                            }
                            return null;
                        }
                    }
                };
                Render          = {
                    make    : function (id, parent, content) {
                        function setDeveloperAttribute(nodes, style_record) {
                            if (typeof nodes === "object"){
                                for (var property in nodes) {
                                    if (HTML.Nodes.Is(nodes[property]) === true){
                                        nodes[property].setAttribute(style_record.name, style_record.value);
                                    } else {
                                        setDeveloperAttribute(nodes[property], style_record);
                                    }
                                }
                            }
                        };
                        var parameters      = Parameters.get(id),
                            nodes           = null,
                            content         = (HTML.Nodes.Is(content)   === true ? content  : null),
                            parent          = (HTML.Nodes.Is(parent)    === true ? parent   : null),
                            parent_borders  = null;
                        if (parameters !== null && parent !== null) {
                            //Create nodes
                            nodes = HTMLExtended.Nodes.build(Configuration.makeup.layer);
                            if (nodes !== null) {
                                //Apply developer styles
                                setDeveloperAttribute(nodes, parameters.attribute);
                                //Attach content
                                if (content !== null) {
                                    nodes.casing.content.value.appendChild(content);
                                }
                                //Add title
                                if (parameters.title !== null) {
                                    nodes.casing.header.title.value.innerHTML = parameters.title;
                                }
                                //Attach to parent
                                parent.appendChild(nodes.container);
                                //Save links
                                parameters.nodes.container  = nodes.container;
                                parameters.nodes.content    = nodes.casing.content.casing.value;
                                parameters.nodes.buttons = {
                                    close       : nodes.casing.header.buttons.close,
                                    minimaze    : nodes.casing.header.buttons.minimaze,
                                    maximaze    : nodes.casing.header.buttons.maximaze,
                                    container   : nodes.casing.header.buttons.container
                                }
                                parameters.nodes.title      = nodes.casing.header.title.container;
                                //Resize checking
                                if (parameters.resize === false) {
                                    parent_borders = nodes.casing.container;
                                    parent_borders.removeChild(nodes.casing.top     );
                                    parent_borders.removeChild(nodes.casing.bottom  );
                                    parent_borders.removeChild(nodes.casing.left    );
                                    parent_borders.removeChild(nodes.casing.right   );
                                    parent_borders.removeChild(nodes.casing.TL      );
                                    parent_borders.removeChild(nodes.casing.TR      );
                                    parent_borders.removeChild(nodes.casing.BL      );
                                    parent_borders.removeChild(nodes.casing.BR      );
                                } else {
                                    parameters.nodes.resize = {
                                        T   : nodes.casing.top,
                                        B   : nodes.casing.bottom,
                                        L   : nodes.casing.left,
                                        R   : nodes.casing.right,
                                        TL  : nodes.casing.TL,
                                        TR  : nodes.casing.TR,
                                        BL  : nodes.casing.BL,
                                        BR  : nodes.casing.BR,
                                    }
                                }
                                return true;
                            }
                        }
                        return false;
                    },
                    buttons : {
                        set: function (id) {
                            var parameters  = Parameters.get(id),
                                size        = null,
                                width       = 0;
                            if (parameters !== null) {
                                for (var property in parameters.buttons) {
                                    if (parameters.buttons[property] === true) {
                                        size    = HTML.Render.GetSize(parameters.nodes.buttons[property].container);
                                        width   += size.OuterWidth;
                                    } else {
                                        parameters.nodes.buttons[property].container.parentNode.removeChild(parameters.nodes.buttons[property].container);
                                    }
                                }
                                parameters.nodes.buttons.container.style.marginLeft = "-" + width + "px";
                                parameters.nodes.buttons.container.style.width      = width + "px";
                            }
                        }
                    },
                    sizer   : {
                        accept  : function (id){
                            var parameters  = Parameters.get(id),
                                size        = null;
                            if (parameters !== null) {
                                //If size was defined in %% here it's corrected
                                size = HTML.Render.GetSize(parameters.nodes.container);
                                parameters.nodes.container.style.width  = size.OuterWidth   + "px";
                                parameters.nodes.container.style.height = size.OuterHeight  + "px";
                            }
                        },
                        set     : function (id) {
                            var parameters  = Parameters.get(id);
                            if (parameters !== null) {
                                parameters.nodes.container.style.width   = parameters.size.width;
                                parameters.nodes.container.style.height  = parameters.size.height;
                            }
                        }
                    },
                    align: function (id) {
                        var parameters = Parameters.get(id);
                        if (parameters !== null) {
                            ToolsAlign.set({
                                node        : parameters.nodes.container,
                                position    : parameters.layout
                            });
                        }
                    }
                };
                Maximaze    = {
                    switcher: function (id) {
                        var parameters = Parameters.get(id);
                        if (parameters !== null) {
                            if (typeof parameters.maximazed === "undefined") {
                                parameters.maximazed = false;
                            }
                            parameters.modifyDOM = true;
                            switch (parameters.maximazed) {
                                case true:
                                    Maximaze.restore(id);
                                    break;
                                case false:
                                    Maximaze.maximaze(id);
                                    break;
                            }
                            parameters.modifyDOM = false;
                        }
                    },
                    maximaze: function (id) {
                        var parameters  = Parameters.get(id),
                            size        = null,
                            position    = null,
                            mark        = null;
                        if (parameters !== null) {
                            //Get current data
                            size        = HTML.Render.GetSize(parameters.nodes.container);
                            position    = HTML.Render.Position.ByPage(parameters.nodes.container);
                            if (size.OuterHeight !== null && position.top !== null) {
                                //Create mark node
                                mark                = document.createElement("DIV");
                                mark.style.display  = "none";
                                //Mount mark
                                parameters.nodes.container.parentNode.insertBefore(mark, parameters.nodes.container);
                                //Save data for restoring
                                parameters.restoring_data = {
                                    size        : {
                                        width   : size.OuterWidth,
                                        height  : size.OuterHeight
                                    },
                                    position    : {
                                        top     : position.top,
                                        left    : position.left
                                    },
                                    mark        : mark,
                                    z_index     : parameters.nodes.container.style.zIndex
                                };
                                //Change style
                                parameters.nodes.container.style.width  = "100%";
                                parameters.nodes.container.style.height = "100%";
                                parameters.nodes.container.style.top    = "0px";
                                parameters.nodes.container.style.left   = "0px";
                                parameters.nodes.container.style.zIndex = "1000";
                                //Change position in DOM tree
                                document.body.appendChild(parameters.nodes.container);
                                //Detach resizing and movement
                                Events.detach.resize    (id);
                                Events.detach.movement  (id);
                                //Accept maximazing
                                parameters.maximazed = true;
                            }
                        }
                    },
                    restore : function (id) {
                        var parameters  = Parameters.get(id);
                        if (parameters !== null) {
                            //Restore styles
                            parameters.nodes.container.style.width  = parameters.restoring_data.size.width + "px";
                            parameters.nodes.container.style.height = parameters.restoring_data.size.height + "px";
                            parameters.nodes.container.style.top    = parameters.restoring_data.position.top + "px";
                            parameters.nodes.container.style.left   = parameters.restoring_data.position.left + "px";
                            parameters.nodes.container.style.zIndex = parameters.restoring_data.z_index;
                            //Restore position in tree
                            parameters.restoring_data.mark.parentNode.insertBefore(parameters.nodes.container, parameters.restoring_data.mark);
                            //Remove mark
                            parameters.restoring_data.mark.parentNode.removeChild(parameters.restoring_data.mark);
                            //Reset data
                            parameters.restoring_data = null;
                            //Attach resizing and movement
                            Events.attach.resize    (id);
                            Events.attach.movement  (id);
                            //Accept restoring
                            parameters.maximazed = false;
                        }
                    }
                };
                Events      = {
                    init    : function (id){
                        Events.attach.resize    (id);
                        Events.attach.movement  (id);
                        Events.attach.close     (id);
                        Events.attach.maximaze  (id);
                    },
                    destroy : function(id){
                        Events.detach.resize    (id);
                        Events.detach.movement  (id);
                        Events.detach.close     (id);
                        Events.detach.maximaze  (id);
                    },
                    attach  : {
                        resize      : function (id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                if (parameters.resize === true) {
                                    parameters.IDs.resize = {};
                                    for (var property in parameters.nodes.resize) {
                                        parameters.IDs.resize[property] = ToolsResize.attach(   {
                                                                                                    mutable     : parameters.nodes.container,
                                                                                                    caller      : parameters.nodes.resize[property],
                                                                                                    direction   : property,
                                                                                                    limits      : {
                                                                                                        width   : parameters.min_size.width,
                                                                                                        height  : parameters.min_size.height
                                                                                                    },
                                                                                                    events      : {
                                                                                                        start       : parameters.events.resize.start,
                                                                                                        processing  : parameters.events.resize.processing,
                                                                                                        finish      : parameters.events.resize.finish,
                                                                                                    }
                                                                                                }
                                        );
                                    }
                                }
                            }
                        },
                        movement    : function (id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                if (parameters.movement === true) {
                                    parameters.IDs.movement = ToolsMovement.attach( {
                                                                                        mutable : parameters.nodes.container,
                                                                                        caller  : parameters.nodes.title,
                                                                                        limits  : null,
                                                                                        events  : {
                                                                                            start       : parameters.events.movement.start,
                                                                                            processing  : parameters.events.movement.processing,
                                                                                            finish      : parameters.events.movement.finish,
                                                                                        }
                                                                                    }
                                    );
                                }
                            }
                        },
                        close       : function (id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                if (parameters.buttons.close === true) {
                                    TouchEvents.attach( parameters.nodes.buttons.close.container,
                                                        "touchstart",
                                                        "click",
                                                        function (event) {
                                                            return Events.actions.close(event, id);
                                                        },
                                                        function (event) {
                                                            return Events.actions.close(event, id);
                                                        },
                                                        id,
                                                        true,
                                                        true
                                    );
                                }
                            }
                        },
                        maximaze    : function (id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                if (parameters.buttons.maximaze === true) {
                                    TouchEvents.attach( parameters.nodes.buttons.maximaze.container,
                                                        "touchstart",
                                                        "click",
                                                        function (event) {
                                                            return Events.actions.maximaze(event, id);
                                                        },
                                                        function (event) {
                                                            return Events.actions.maximaze(event, id);
                                                        },
                                                        id,
                                                        true,
                                                        true
                                    );
                                }
                            }
                        },
                    },
                    detach : {
                        resize  : function (id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                if (parameters.resize === true) {
                                    for (var property in parameters.nodes.resize) {
                                        ToolsResize.detach( {
                                                                id      : parameters.IDs.resize[property],
                                                                caller  : parameters.nodes.resize[property],
                                                            }
                                        );
                                    }
                                }
                            }
                        },
                        movement: function (id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                if (parameters.movement === true) {
                                    ToolsMovement.detach({
                                                                id      : parameters.IDs.movement,
                                                                caller  : parameters.nodes.title,
                                                            }
                                    );
                                }
                            }
                        },
                        close   : function (id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                if (parameters.buttons.close === true) {
                                    TouchEvents.detach(parameters.nodes.buttons.close.container, "touchstart", "click", id);
                                }
                            }
                        },
                        maximaze: function (id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                if (parameters.buttons.maximaze === true) {
                                    TouchEvents.detach(parameters.nodes.buttons.maximaze.container, "touchstart", "click", id);
                                }
                            }
                        },
                    },
                    actions: {
                        close       : function (event, id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                Purity.System.runHandle(parameters.events.close.before, arguments, "[Controls.Window][Events.actions.close]", this);
                                Events.destroy(id);
                                parameters.nodes.container.parentNode.removeChild(parameters.nodes.container);
                                Parameters.del(id);
                                Purity.System.runHandle(parameters.events.close.after, arguments, "[Controls.Window][Events.actions.close]", this);
                            }
                        },
                        maximaze    : function (event, id) {
                            var parameters = Parameters.get(id);
                            if (parameters !== null) {
                                Purity.System.runHandle(parameters.events.maximaze.before, arguments, "[Controls.Window][Events.actions.close]", this);
                                Maximaze.switcher(id);
                                Purity.System.runHandle(parameters.events.maximaze.after, arguments, "[Controls.Window][Events.actions.close]", this);
                            }
                        },
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                PublicMethods   = {
                    open    : function () {
                        return Purity.System.runHandle(Initializer.actions.create, arguments, "[Controls.Window][Initializer.actions.create]", this);
                    },
                    close   : function () {
                        return Purity.System.runHandle(Events.actions.close, arguments, "[Controls.Window][Events.actions.close]", this);
                    },
                };
                //---< Security part	>--[end]---------------------------------------------------------------------------------------
                //---< Init part	    >--[begin]---------------------------------------------------------------------------------------
                //---< Init part	    >--[end]---------------------------------------------------------------------------------------
                return {
                    //---< Public part		>--[begin]---------------------------------------------------------------------------------------
                    AboutModule : {
                        getName         : function () { return name;        },
                        getVersion      : function () { return version;     },
                        getLastUpdate   : function () { return lastUpdate;  },
                        getAuthor       : function () { return author;      }
                    },
                    open        : PublicMethods.open,
                    close       : PublicMethods.close,
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());