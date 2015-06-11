/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.Touch.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Overhead.js" />
/// <reference path="~/Kernel/JS/Purity.CSS.Manipulation.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.Extended.js" />
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
        Purity.createModule("Controls.Lists.Group",
            //Check references
            {
                modules     : ["Tools", "HTML", "Environment.Events", "Environment.Events.Touch", "Environment.Overhead", "CSS.Manipulation", "HTML.Extended", "Environment.Events.Mutation"],
                resources   : [{ url: "", name: "Purity.Controls.Lists.Group.css", path: "~/Kernel/CSS/", type: "jsic", cache: true, initas: "css", id: "Purity.Controls.Lists.Group.css" }]
//Добавить проверку на драг енд дроп
//Проверку на contenteditable
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Controls.Lists.Group",
                    version         = "1.0",
                    lastUpdate      = "20.12.2013",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Configuration   = {},
                    Parameters      = {},
                    Initializer     = {},
                    Render          = {},
                    Spaces          = {},
                    Groups          = {},
                    Items           = {},
                    PublicMethods   = {},
                    //Declaration references
                    HTML            = new Purity.initModule("HTML"                          ),
                    HTMLExtended    = new Purity.initModule("HTML.Extended"                 ),
                    Tools           = new Purity.initModule("Tools"                         ),
                    CSS             = new Purity.initModule("CSS.Manipulation"              ),
                    Overhead        = new Purity.initModule("Environment.Overhead"          ),
                    DOMEvents       = new Purity.initModule("Environment.Events"            ),
                    MutationEvents  = new Purity.initModule("Environment.Events.Mutation"   ),
                    TouchEvents     = new Purity.initModule("Environment.Events.Touch"      );
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Configuration = {
                    attributes : {
                        container   : { name: "data-type-element", value: "Controls.Lists.Group.Container"  },
                        item        : {
                            container       : { name: "data-type-element", value: "Controls.Lists.Group.Item"               },
                            cover_group     : { name: "data-type-element", value: "Controls.Lists.Group.Item.Cover.Group"   },
                            cover_replace   : { name: "data-type-element", value: "Controls.Lists.Group.Item.Cover.Replace" },
                            group           : { name: "data-type-element", value: "Controls.Lists.Group.Item.Group"         }
                        },
                        space       : { name: "data-type-element", value: "Controls.Lists.Group.Space"      },
                        group       : {
                            container   : { name: "data-type-element", value: "Controls.Lists.Group.ItemsGroup"             },
                            title       : { name: "data-type-element", value: "Controls.Lists.Group.ItemsGroup.Title"       },
                            title_cover : { name: "data-type-element", value: "Controls.Lists.Group.ItemsGroup.Title.Cover" },
                            list        : { name: "data-type-element", value: "Controls.Lists.Group.ItemsGroup.List"        },
                            arrow : {
                                container   : { name: "data-type-element", value: "Controls.Lists.Group.ItemsGroup.Arrow"       },
                                node        : { name: "data-type-element", value: "Controls.Lists.Group.ItemsGroup.Arrow.Node"  },
                                layout      : {
                                    left    : { name: "data-type-element-layout", value: "Left"  },
                                    right   : { name: "data-type-element-layout", value: "Right" }
                                },
                                position    : {
                                    minimized: { name: "data-type-element-position", value: "Minimized" },
                                    maximized: { name: "data-type-element-position", value: "Maximized" }
                                }
                            }
                        }
                    },
                    properties: {
                        id          : "data-id-control",
                        id_item     : "data-id-item",
                        id_group    : "data-id-group",
                    },
                    other       : {
                        id_prefix               : "Lists_Group_",
                        id_item_prefix          : "ID_item_",
                        default_group_name      : "Set group name",
                        group_data              : "Group_Data",
                        item_group_data         : "Item_Group_Data",
                        variables_group_name    : "Controlls_Lists_Group_Variables",
                        variable_list_name      : "Controlls.List_Variable"
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
                                            if (HTML.Nodes.IsMounted(element.nodes.content) === false) {
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
                        }
                    },
                    register: function (id, data) {
                        var argument_id     = (typeof id    === "string" ? id   : null),
                            argument_data   = (typeof data  === "object" ? data : null),
                            data            = null;
                        if (argument_id !== null && argument_data !== null) {
                            data = Overhead.vars.set(Configuration.other.variables_group_name, argument_id, argument_data);
                            if (data !== null) {
                                data.count      = 0;
                                data.nodes      = {};
                                data.properties = {};
                                data.sorting    = {};
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
                    validate: {
                        list : {
                            params      : function (params){
                                return Tools.Object.validate(params, [  { name: "parent",       type: "node"                        },
                                                                        { name: "width",        type: "string"                      },
                                                                        { name: "minimized",    type: "boolean",    value: true     },
                                                                        { name: "arrow",        type: "object",     value: {}       },
                                                                        { name: "subgrouping",  type: "boolean",    value: true     },
                                                                        { name: "events",       type: "object",     value: {}       },
                                                                        { name: "attributes",   type: "object",     value: {}       },
                                                                        { name: "before",       type: "node",       value: null     },
                                                                        { name: "container",    type: "node",       value: null     },
                                                                        { name: "content",      type: "node",       value: null     }, ]);
                            },
                            attributes  : function (attributes) {
                                var result_validation = Tools.Object.validate(attributes, [ { name: "container",    type: "object", value: null },
                                                                                            { name: "item",         type: "object", value: null },
                                                                                            { name: "group",        type: "object", value: null },
                                                                                            { name: "title",        type: "object", value: null },
                                                                                            { name: "group_label",  type: "object", value: null }]);
                                if (result_validation === true){
                                    for (var property in attributes) {
                                        if (attributes[property] !== null) {
                                            result_validation = (Tools.Object.validate(attributes[property], [{ name: "name", type: "string" }, { name: "value", type: "string" }]) === true ? result_validation : false);
                                        }
                                    }
                                    return result_validation;
                                } 
                                return false;
                            },
                            arrow       : function (arrow) {
                                return Tools.Object.validate(arrow, [   { name: "color",    type: "string", value: "rgba(255,255,255,0.5)" },
                                                                        { name: "layout",   type: "string", value: "right", values : ["right", "left"]  }]);
                            },
                            events      : function (events) {
                                return Tools.Object.validate(events, [  { name: "groupIn",      type: "function", value: null },
                                                                        { name: "groupOut",     type: "function", value: null },
                                                                        { name: "groupRename",  type: "function", value: null }]);
                            },
                            width       : function (width) {
                                var units           = ["px", "em", "%"],
                                    result_checking = false;
                                if (typeof width === "string") {
                                    for (var index = units.length - 1; index >= 0; index -= 1) {
                                        result_checking = (width.indexOf(units[index]) === -1 ? result_checking : true);
                                    }
                                }
                                return result_checking;
                            }
                        },
                        item: {
                            params: function (params) {
                                return Tools.Object.validate(params, [  { name: "id",       type: "string"                  },
                                                                        { name: "id_item",  type: "string", value : null    },
                                                                        { name: "events",   type: "object", value : {}      },
                                                                        { name: "content",  type: "node"                    }]);
                            },
                            events: function (events) {
                                return Tools.Object.validate(events, [  { name: "click",    type: "function", value: null }]);
                            },
                            remove: function (params) {
                                return Tools.Object.validate(params, [  { name: "id",       type: "string" },
                                                                        { name: "id_item",  type: "string" }]);
                            },
                        },
                        group: {
                            params: function (params) {
                                return Tools.Object.validate(params, [  { name: "id",       type: "string"  },
                                                                        { name: "id_group", type: "string"  },
                                                                        { name: "name",     type: "string"  },
                                                                        { name: "items",    type: "array"   }]);
                            },
                        }
                    },
                    create      : function (params) {
                        ///     <summary>Create group list.</summary>
                        ///     <param name="params" type="Object">
                        ///         {   parent          : DOMObject,                                                    &#13;&#10;
                        ///             width           : string    (with "px", "em" or "%"),                           &#13;&#10;
                        ///             [minimized]     : boolean   (allow minimize and maximize groups),               &#13;&#10;
                        ///             [subgrouping]   : boolean   (allow make subgroups in groups),                   &#13;&#10;
                        ///             [arrow]         : object    {color: string, layout: string},                    &#13;&#10;
                        ///             [before]        : DOMObject (add list before this node in parent),              &#13;&#10;
                        ///             [container]     : DOMObject (use this node as contaier for list),               &#13;&#10;
                        ///             [content]       : DOMObject (use this node for items),                          &#13;&#10;
                        ///             [attributes]    : object    {container: object, item: object, group: object},   &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <returns type="Boolean" mayBeNull="true">Null - if error. True if is OK.</returns>
                        var validate    = Initializer.validate.list,
                            parameters  = null,
                            id          = null;
                        if (validate.params(params) === true) {
                            if (validate.events(params.events) === true) {
                                if (validate.width(params.width) === true) {
                                    if (validate.attributes(params.attributes) === true) {
                                        if (validate.arrow(params.arrow) === true){
                                            id          = Configuration.other.id_prefix + Tools.IDs.Get(6);
                                            parameters  = Parameters.register(id,   {
                                                                                        attributes  : params.attributes,
                                                                                        minimized   : params.minimized,
                                                                                        arrow       : params.arrow,
                                                                                        events      : params.events,
                                                                                        subgrouping : params.subgrouping
                                                                                    });
                                            if (parameters !== null) {
                                                //Set size 
                                                parameters.properties.width = params.width;
                                                //Render
                                                if (Render.container.make(id, params) === true) {
                                                    //Set size
                                                    Render.container.size.update(id);
                                                    Parameters.list.add(id);
                                                    return id;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return null;
                    },
                    add         : function (params) {
                        ///     <summary>Add item into.</summary>
                        ///     <param name="params" type="Object">
                        ///         {   
                        ///             id          : string    (id of list),       &#13;&#10;
                        ///             [id_item]   : string    (id of item),       &#13;&#10;
                        ///             content     : DOMObject (content of item),  &#13;&#10;
                        ///         }
                        ///     </param>
                        ///     <returns type="Boolean" mayBeNull="true">Null - if error. True if is OK.</returns>
                        var validate    = Initializer.validate.item,
                            parameters  = null;
                        if (validate.params(params) === true) {
                            if (validate.events(params.events) === true) {
                                parameters = Parameters.get(params.id);
                                if (parameters !== null) {
                                    if (Render.item.make(params) === true) {
                                        return true;
                                    }
                                }
                            }
                        }
                        return null;
                    },
                    group       : function (params){
                        ///     <summary>Make group of items</summary>
                        ///     <param name="params" type="Object">
                        ///         {   
                        ///             id          : string    (id of list),           &#13;&#10;
                        ///             id_group    : string    (id of group),          &#13;&#10;
                        ///             name        : string    (name of group),        &#13;&#10;
                        ///             items       : array     (array of IDs items),   &#13;&#10;
                        ///         }
                        ///     </param>
                        ///     <returns type="Boolean" mayBeNull="true">Null - if error. True if is OK.</returns>
                        var validate    = Initializer.validate.group,
                            parameters  = null;
                        if (validate.params(params) === true) {
                            parameters = Parameters.get(params.id);
                            if (parameters !== null) {
                                return Groups.manually.make(params.id, params.id_group, params.name, params.items);
                            }
                        }
                        return null;
                    },
                    remove      : function (params) {
                        ///     <summary>Create group list.</summary>
                        ///     <param name="params" type="Object">
                        ///         {   
                        ///             id          : string    (id of list),       &#13;&#10;
                        ///             id_item     : string    (id of item),       &#13;&#10;
                        ///         }
                        ///     </param>
                        ///     <returns type="Boolean" mayBeNull="true">Null - if error. True if is OK.</returns>
                        var validate    = Initializer.validate.item,
                            parameters  = null,
                            list        = null;
                        if (validate.remove(params) === true) {
                            parameters = Parameters.get(params.id);
                            if (parameters !== null) {
                                list = Render.item. destroy(params.id, params.id_item);
                                Render.space.       destroy(params.id, params.id_item);
                                if (list !== null) {
                                    Groups.clearGroup(list);
                                }
                            }
                        }
                        return null;
                    }
                };
                Render = {
                    container: {
                        make: function (id, params) {
                            var container   = null,
                                parameters  = Parameters.get(id),
                                attributes  = Configuration.attributes,
                                properties  = Configuration.properties;
                            if (parameters !== null) {
                                container = document.createElement("UL");
                                container.setAttribute(attributes.container.name,   attributes.container.value  );
                                container.setAttribute(properties.id,               id                          );
                                if (parameters.attributes.container !== null) {
                                    container.setAttribute(parameters.attributes.container.name, parameters.attributes.container.value);
                                }
                                if (params.container !== null && params.content !== null) {
                                    container.appendChild(params.container);
                                    //Save link to content
                                    parameters.nodes.content = params.content;
                                } else {
                                    //Save link to content
                                    parameters.nodes.content = container;
                                }
                                if (params.before !== null) {
                                    params.parent.insertBefore(container, params.before);
                                } else {
                                    params.parent.appendChild(container);
                                }
                                //Save link to container
                                parameters.nodes.container = container;
                                return true;
                            }
                            return false;
                        },
                        size: {
                            update: function (id) {
                                var parameters              = Parameters.get(id);
                                if (parameters !== null) {
                                    parameters.nodes.container.style.width = parameters.properties.width;
                                    return true;
                                }
                                return false;
                            }
                        }
                    },
                    item: {
                        make    : function (params) {
                            var item            = null,
                                parameters      = Parameters.get(params.id),
                                properties      = Configuration,
                                attributes      = Configuration.attributes.item,
                                cover_group     = null,
                                cover_replace   = null,
                                group           = null,
                                space           = null,
                                id_item         = null;
                            if (parameters !== null) {
                                //Set item's ID
                                id_item         = (params.id_item !== null ? params.id_item : properties.other.id_item_prefix + parameters.count);
                                //Make space
                                space           = Render.space.make(params.id, id_item);
                                //Make item
                                item            = document.createElement("LI");
                                cover_group     = document.createElement("DIV");
                                cover_replace   = document.createElement("DIV");
                                group           = document.createElement("DIV");
                                item.           setAttribute(attributes.container.name,     attributes.container.value                          );
                                item.           setAttribute("draggable",                   "true"                                              );
                                item.           setAttribute(properties.properties.id_item, id_item                                             );
                                cover_group.    setAttribute(attributes.cover_group.name,   attributes.cover_group.value                        );
                                cover_group.    setAttribute(properties.properties.id_item, id_item                                             );
                                cover_replace.  setAttribute(attributes.cover_replace.name, attributes.cover_replace.value                      );
                                cover_replace.  setAttribute(properties.properties.id_item, id_item                                             );
                                group.          setAttribute(attributes.group.name,         attributes.group.value                              );
                                group.          setAttribute(properties.properties.id_item, id_item                                             );
                                group.style.display = "none";
                                if (parameters.attributes.item !== null) {
                                    item.setAttribute(parameters.attributes.item.name, parameters.attributes.item.value);
                                }
                                if (parameters.attributes.group_label !== null) {
                                    group.setAttribute(parameters.attributes.group_label.name, parameters.attributes.group_label.value);
                                }
                                group.innerHTML = "<p>Make group</p>";
                                item.                       appendChild(params.content  );
                                item.                       appendChild(group           );
                                item.                       appendChild(cover_group     );
                                item.                       appendChild(cover_replace   );
                                parameters.nodes.content.   appendChild(item            );
                                //Attach events
                                Items.events.attach.common. dragstart   (item,          space,      id_item,    params.id           );
                                Items.events.attach.common. dragend     (item,          id_item,    params.id                       );
                                Items.events.attach.group.  dragenter   (cover_group,   group,      id_item,    params.id           );
                                Items.events.attach.group.  dragover    (cover_group,   id_item                                     );
                                Items.events.attach.group.  drop        (cover_group,   item,       space,      id_item,  params.id );
                                Items.events.attach.replace.dragenter   (cover_replace, space,      id_item,    params.id           );
                                Items.events.attach.replace.dragover    (cover_replace, id_item                                     );
                                Items.events.attach.replace.drop        (cover_replace, space,      id_item,    params.id           );
                                Items.events.attach.space.  dragover    (space,         id_item                                     );
                                Items.events.attach.space.  drop        (space,         id_item,    params.id                       );
                                Items.events.attach.developer.click(id_item, params.events.click, cover_group);
                                parameters.count += 1;
                                return true;
                            }
                            return false;
                        },
                        destroy : function (id, id_item) {
                            var parameters  = Parameters.get(id),
                                properties  = Configuration.properties,
                                attributes  = Configuration.attributes,
                                item        = null,
                                list        = null;
                            if (parameters !== null) {
                                item = HTML.Select.First("li[" + attributes.item.container.name + "=\"" + attributes.item.container.value + "\"][" + properties.id_item + "=\"" + id_item + "\"]");
                                list = HTMLExtended.Nodes.Get.NearestParent(item, "ul");
                                if (item !== null) {
                                    item.parentNode.removeChild(item);
                                    if (list !== null) {
                                        return (list.getAttribute(properties.id_group) !== null ? list : null);
                                    }
                                }
                                return null;
                            }
                        }
                    },
                    space: {
                        make    : function (id, id_item, append) {
                            var space           = null,
                                argument_append = (typeof append === "boolean" ? append : true),
                                parameters      = Parameters.get(id),
                                properties      = Configuration,
                                attributes      = Configuration.attributes.space;
                            if (parameters !== null) {
                                space = document.createElement("LI");
                                space.setAttribute(attributes.name,                 attributes.value    );
                                space.setAttribute(properties.properties.id_item,   id_item             );
                                if (argument_append === true) {
                                    parameters.nodes.content.appendChild(space);
                                }
                                return space;
                            }
                            return false;
                        },
                        destroy : function (id, id_item) {
                            var parameters  = Parameters.get(id),
                                properties  = Configuration.properties,
                                attributes  = Configuration.attributes,
                                space       = null;
                            if (parameters !== null) {
                                space = HTML.Select.First("li[" + attributes.space.name + "=\"" + attributes.space.value + "\"][" + properties.id_item + "=\"" + id_item + "\"]");
                                if (space !== null) {
                                    space.parentNode.removeChild(space);
                                    return true;
                                }
                                return false;
                            }
                        }
                    },
                    group: {
                        make: function (id, group_name, before_node, id_group) {
                            function createArrow(parameters, attributes, title_cover, title_input) {
                                var arrow_container = null,
                                    arrow_node      = null;
                                if (parameters.minimized === true) {
                                    arrow_container = document.createElement("DIV");
                                    arrow_node      = document.createElement("DIV");
                                    arrow_container.setAttribute(attributes.arrow.container.name, attributes.arrow.container.value);
                                    arrow_container.setAttribute(attributes.arrow.layout[parameters.arrow.layout].name, attributes.arrow.layout[parameters.arrow.layout].value);
                                    arrow_node.     setAttribute(attributes.arrow.node.name, attributes.arrow.node.value);
                                    arrow_node.style.borderTopColor = parameters.arrow.color;
                                    arrow_container.appendChild(arrow_node);
                                    title_cover.    appendChild(arrow_container);
                                    switch (parameters.arrow.layout) {
                                        case "left":
                                            title_input.style.paddingLeft = "1em";
                                            break;
                                        case "right":
                                            title_input.style.paddingRight = "1em";
                                            break;
                                    }
                                }
                                return arrow_container;
                            }
                            var group                   = null,
                                cover_replace           = null,
                                title                   = null,
                                list                    = null,
                                title_input             = null,
                                title_cover             = null,
                                space                   = null,
                                arrow                   = null,
                                argument_group_name     = (typeof group_name    === "string" ? group_name   : null              ),
                                argument_id_group       = (typeof id_group      === "string" ? id_group     : Groups.id.get()   ),
                                argument_before_node    = (HTML.Nodes.Is(before_node) === true ? before_node : null),
                                parameters              = Parameters.get(id),
                                properties              = Configuration,
                                attributes              = Configuration.attributes.group;
                            if (parameters !== null && before_node !== null) {
                                argument_group_name = (argument_group_name === null ? properties.other.default_group_name : argument_group_name);
                                group               = document.createElement("LI"   );
                                title               = document.createElement("DIV"  );
                                title_input         = document.createElement("INPUT");
                                title_cover         = document.createElement("DIV"  );
                                list                = document.createElement("UL"   );
                                group.          setAttribute("draggable",                   "true"                              );
                                group.          setAttribute(attributes.container.  name,       attributes.container.     value );
                                title.          setAttribute(attributes.title.      name,       attributes.title.         value );
                                title_cover.    setAttribute(attributes.title_cover.name,       attributes.title_cover.   value );
                                list.           setAttribute(attributes.list.       name,       attributes.list.          value );
                                list.           setAttribute(properties.properties.id_group,    argument_id_group               );
                                title_input.    setAttribute(properties.properties.id_group,    argument_id_group               );
                                if (parameters.attributes.group !== null) {
                                    group.setAttribute(parameters.attributes.group.name, parameters.attributes.group.value);
                                }
                                if (parameters.attributes.title !== null) {
                                    title.setAttribute(parameters.attributes.title.name, parameters.attributes.title.value);
                                }
                                title_input.value = argument_group_name;
                                title.  appendChild(title_input );
                                title.  appendChild(title_cover );
                                group.  appendChild(title       );
                                group.  appendChild(list        );
                                space = Render.space.make(id, "groups_space", false);
                                space.setAttribute(properties.properties.id_group, argument_id_group);
                                before_node.parentNode.insertBefore(space, before_node);
                                before_node.parentNode.insertBefore(group, before_node);
                                arrow = createArrow(parameters, attributes, title_cover, title_input);
                                //Attach events
                                Items.events.attach.common.dragstart    (group,         space,              argument_id_group, id   );
                                Items.events.attach.common.dragend      (group,         argument_id_group,  id                      );
                                Items.events.attach.replace.dragenter   (title_cover,   space,              argument_id_group, id   );
                                Items.events.attach.replace.dragover    (title_cover,   argument_id_group                           );
                                Items.events.attach.replace.drop        (title_cover,   space,              argument_id_group, id   );
                                Items.events.attach.space.dragover      (space,         argument_id_group                           );
                                Items.events.attach.space.drop          (space,         argument_id_group,  id                      );
                                DOMEvents.DOM.AddListener(title_cover, "dblclick",  function () { Groups.rename.open    (id, title_cover, title_input);                     }, argument_id_group);
                                DOMEvents.DOM.AddListener(title_input, "blur",      function () { Groups.rename.close   (id, argument_id_group, title_cover, title_input);  }, argument_id_group);
                                DOMEvents.DOM.AddListener(title_input, "input",     function () { Groups.rename.check   (title_input);                                      }, argument_id_group);
                                Groups.scroll.event.attach(id, argument_id_group, arrow, list);
                                return list;
                            }
                            return null;
                        }
                    }
                };
                Spaces = {
                    current: {
                        apply: function (space_node, id_list, height) {
                            var parameters = Parameters.get(id_list);
                            if (parameters !== null) {
                                space_node.style.height     = height + "px";
                                parameters.sorting.space    = space_node;
                            }

                        },
                        reset: function (id_list) {
                            var parameters = Parameters.get(id_list);
                            if (parameters !== null) {
                                if (typeof parameters.sorting.space !== "undefined") {
                                    parameters.sorting.space.style.height   = "0em";
                                    parameters.sorting.space                = null;
                                    delete parameters.sorting.space;
                                }
                            }
                        }
                    }
                };
                Groups = {
                    id          : {
                        index   : 0,
                        get     : function () {
                            Groups.id.index += 1;
                            return "group_" + Groups.id.index;
                        }
                    },
                    current     : {
                        apply: function (group_node, id_list) {
                            var parameters = Parameters.get(id_list);
                            if (parameters !== null) {
                                group_node.style.display = "";
                                parameters.sorting.group = group_node;
                            }
                        },
                        reset: function (id_list) {
                            var parameters = Parameters.get(id_list);
                            if (parameters !== null) {
                                if (typeof parameters.sorting.group !== "undefined") {
                                    parameters.sorting.group.style.display  = "none";
                                    parameters.sorting.group                = null;
                                    delete parameters.sorting.group;
                                }
                            }
                        }
                    },
                    isInGroup   : function (id_group, id_item) {
                        var properties  = Configuration.properties,
                            item        = HTML.Select.First("ul[" + properties.id_group + "=\"" + id_group + "\"] li[" + properties.id_item + "=\"" + id_item + "\"]");
                        return (item === null ? false : true);
                    },
                    clearGroup  : function (list_node) {
                        var attribute       = null,
                            attributes      = Configuration.attributes.group,
                            group_node      = null,
                            space_node      = null,
                            group_parent    = null;
                        if (HTML.Nodes.Is(list_node) === true) {
                            attribute   = list_node.getAttribute(attributes.list.name);
                            if (attribute === attributes.list.value) {
                                if (list_node.childNodes.length === 0) {
                                    space_node = Groups.spaces.get(list_node);
                                    if (space_node !== null) {
                                        space_node.parentNode.removeChild(space_node);
                                    }
                                    group_node      = list_node.parentNode;
                                    group_parent    = group_node.parentNode;
                                    group_parent.removeChild(group_node);
                                    attribute       = group_parent.getAttribute(attributes.list.name);
                                    if (attribute === attributes.list.value) {
                                        return Groups.clearGroup(group_parent);
                                    }
                                    return true;
                                }
                            }
                        }
                    },
                    spaces      : {
                        get : function(list_node){
                            var id_group    = null,
                                properties  = Configuration.properties,
                                attributes  = Configuration.attributes.space,
                                space_node  = null;
                            if (HTML.Nodes.Is(list_node) === true) {
                                id_group = list_node.getAttribute(properties.id_group);
                                if (id_group !== null) {
                                    return HTML.Select.First("li[" + properties.id_group + "=\"" + id_group + "\"][" + attributes.name + "=\"" + attributes.value + "\"]");
                                }
                            }
                            return null;
                        }
                    },
                    rename      : {
                        open    : function (id_list, title_cover, title_input) {
                            var parameters      = Parameters.get(id_list),
                                previous_value  = null;
                            if (parameters !== null) {
                                title_cover.style.display = "none";
                                previous_value = title_input.value;
                                Overhead.Properties.Set(title_input, "previous_value", previous_value, true);
                            }
                        },
                        close   : function (id_list, id_group, title_cover, title_input) {
                            var parameters      = Parameters.get(id_list),
                                previous_value  = null;
                            if (parameters !== null) {
                                title_cover.style.display = "";
                                previous_value = Overhead.Properties.Get(title_input, "previous_value", true);
                                if (previous_value !== title_input.value && previous_value !== null) {
                                    if (parameters.events.groupRename !== null) {
                                        return Purity.System.runHandle(parameters.events.groupRename,
                                                                        {
                                                                            group   : id_group,
                                                                            name    : title_input.value
                                                                        },
                                                                        "[Controls.Lists.Group][Groups.rename.close]",
                                                                        this
                                        );
                                    }
                                }
                            }
                        },
                        check   : function (title_input) {
                            var regExp  = new RegExp("[^A-Za-z0-9_-\\s]", "gm"),
                                name    = title_input.value;
                            name = name.replace(regExp, "");
                            if (title_input.value !== name) {
                                title_input.value = name;
                            }

                        }
                    },
                    scroll      : {
                        event   : {
                            attach      : function (id_list, id_group, cover, node) {
                                var parameters = Parameters.get(id_list);
                                if (parameters !== null) {
                                    if (parameters.minimized === true) {
                                        DOMEvents.DOM.AddListener(  cover,
                                                                    "click",
                                                                    function (event) { Groups.scroll.actions.toggle(event, cover, node); },
                                                                    id_group
                                        );
                                    }
                                }
                            }
                        },
                        actions : {
                            toggle      : function (event, cover, node) {
                                var data    = Overhead.Properties.Get(node, Configuration.other.group_data, false),
                                    actions = Groups.scroll.actions;
                                if (data === null) {
                                    data = Overhead.Properties.Set(node, Configuration.other.group_data, { state: "maximized", height: null });
                                }
                                switch (data.state) {
                                    case "minimized":
                                        actions.maximize(node, cover, data);
                                        break;
                                    case "maximized":
                                        actions.minimize(node, cover, data);
                                        break;
                                }
                                event.preventDefault();
                                return false;
                            },
                            minimize    : function (node, cover, data) {
                                var size = HTML.Render.GetSize(node);
                                if (size.OuterHeight !== null) {
                                    data.state          = "minimized";
                                    data.height         = size.OuterHeight;
                                    CSS.Animations.applyAnimation(  node,
                                                                    "{from{height:" + data.height + "px;}to{height:" + 0 + "px;}}",
                                                                    "150ms ease-in-out 0ms normal",
                                                                    function () { node.style.height = 0 + "px"; }
                                    );
                                    Groups.scroll.actions.arrow(cover, data.state);
                                }
                            },
                            maximize    : function (node, cover, data) {
                                if (typeof data.height === "number") {
                                    data.state          = "maximized";
                                    CSS.Animations.applyAnimation(  node,
                                                                    "{from{height:" + 0 + "px;}to{height:" + data.height + "px;}}",
                                                                    "150ms ease-in-out 0ms normal",
                                                                    function () { node.style.height = ""; }
                                    );
                                    Groups.scroll.actions.arrow(cover, data.state);
                                }
                            },
                            arrow       : function (cover, state) {
                                var attributes = Configuration.attributes.group.arrow.position[state];
                                cover.firstChild.setAttribute(attributes.name, attributes.value);
                            }
                        }
                    },
                    events      : {
                        groupIn : function (id_list, id_item) {
                            function subgroupingControl(parameters, item, id_item, id_list) {
                                if (parameters.subgrouping === false) {
                                    if (Overhead.Properties.Get(item, Configuration.other.item_group_data, false) === null) {
                                        Items.switcher.grouping.off(id_item, id_list);
                                    }
                                }
                            };
                            function checkGroupOut(item, id_list, id_item) {
                                var previous_group = Overhead.Properties.Get(item, Configuration.other.item_group_data, false);
                                if (previous_group !== null) {
                                    Groups.events.groupOut(id_list, id_item);
                                }
                            };
                            var parameters          = Parameters.get(id_list),
                                argument_id_item    = (typeof id_item === "string" ? id_item : null),
                                item                = null,
                                list                = null,
                                id_group            = null,
                                id                  = null,
                                title_input         = null,
                                properties          = Configuration.properties,
                                attributes          = Configuration.attributes.item.container,
                                items               = [],
                                hash                = "";
                            if (parameters !== null) {
                                item = HTML.Select.First("li[" + attributes.name + "=\"" + attributes.value + "\"][" + properties.id_item + "=\"" + argument_id_item + "\"]");
                                if (item !== null) {
                                    list = HTMLExtended.Nodes.Get.NearestParent(item, "ul");
                                    if (list !== null) {
                                        id_group = list.getAttribute(properties.id_group);
                                        if (id_group !== null) {
                                            title_input = HTML.Select.First("input[" + properties.id_group + "=\"" + id_group + "\"]");
                                            if (title_input !== null) {
                                                //Get all items in group
                                                for (var index = list.childNodes.length - 1; index >= 0; index -= 1) {
                                                    if (typeof list.childNodes[index].nodeName === "string") {
                                                        if (list.childNodes[index].nodeName.toLowerCase() === "li") {
                                                            if (list.childNodes[index].getAttribute(attributes.name) === attributes.value) {
                                                                id = list.childNodes[index].getAttribute(properties.id_item);
                                                                if (id !== null) {
                                                                    items.push(id);
                                                                    hash = hash + id;
                                                                    //Check group out
                                                                    checkGroupOut(list.childNodes[index], id_list, id);
                                                                    //Switch off subgrouping if necessary
                                                                    subgroupingControl(parameters, list.childNodes[index], id, id_list);
                                                                    //Save group data
                                                                    Overhead.Properties.Set(list.childNodes[index], 
                                                                                            Configuration.other.item_group_data,
                                                                                            id_group,
                                                                                            true
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (parameters.events.groupIn !== null) {
                                                    return Purity.System.runHandle( parameters.events.groupIn,
                                                                                    {
                                                                                        group   : id_group,
                                                                                        items   : items,
                                                                                        hash    : hash,
                                                                                        name    : title_input.value
                                                                                    },
                                                                                    "[Controls.Lists.Group][Groups.events.groupIn]",
                                                                                    this
                                                    );
                                                }
                                            }
                                        } else {
                                            Groups.events.groupOut(id_list, id_item);
                                        }
                                    }
                                }
                            }
                        },
                        groupOut: function (id_list, id_item) {
                            function subgroupingControl(parameters, id_item, id_list) {
                                if (parameters.subgrouping === false) {
                                    Items.switcher.grouping.on(id_item, id_list);
                                }
                            };
                            var parameters          = Parameters.get(id_list),
                                argument_id_item    = (typeof id_item === "string" ? id_item : null),
                                properties          = Configuration.properties,
                                attributes          = Configuration.attributes.item.container,
                                item                = null,
                                data                = null;
                            if (parameters !== null) {
                                item = HTML.Select.First("li[" + attributes.name + "=\"" + attributes.value + "\"][" + properties.id_item + "=\"" + argument_id_item + "\"]");
                                if (item !== null) {
                                    data = Overhead.Properties.Get(item, Configuration.other.item_group_data, false);
                                    if (data !== null) {
                                        subgroupingControl(parameters, id_item, id_list);
                                        Overhead.Properties.Del(item, Configuration.other.item_group_data);
                                        if (parameters.events.groupOut !== null) {
                                            return Purity.System.runHandle( parameters.events.groupOut,
                                                                            {
                                                                                group   : data,
                                                                                item    : id_item
                                                                            },
                                                                            "[Controls.Lists.Group][Groups.events.groupOut]",
                                                                            this
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    },
                    manually    : {
                        make: function (id_list, id_group, name, items) {
                            var parameters          = Parameters.get(id_list),
                                argument_id_list    = (typeof id_list   === "string"    ? id_list   : null),
                                argument_id_group   = (typeof id_group  === "string"    ? id_group  : null),
                                argument_name       = (typeof name      === "string"    ? name      : null),
                                argument_items      = (items instanceof Array           ? items     : null),
                                properties          = Configuration.properties,
                                attributes          = Configuration.attributes.item,
                                space               = null,
                                item                = null,
                                group               = null;
                            if (Tools.Vars.IsNotEquality([parameters, argument_id_group, argument_name, argument_items], null) === true) {
                                for (var index = 0, max_index = argument_items.length; index < max_index; index += 1) {
                                    space   = Items.nodes.space (argument_items[index], argument_id_list);
                                    item    = Items.nodes.item  (argument_items[index], argument_id_list);
                                    if (space !== null && item !== null) {
                                        if (group === null) {
                                            group = Render.group.make(argument_id_list, argument_name, space, argument_id_group);
                                        }
                                        group.appendChild(space );
                                        group.appendChild(item  );
                                        //Save group data
                                        Overhead.Properties.Set(item,
                                                                Configuration.other.item_group_data,
                                                                argument_id_group,
                                                                true
                                        );
                                    }
                                }
                                return true;
                            }
                            return null;
                        },
                    }
                };
                Items = {
                    state       : {
                        set     : function (node, space_node, id_item, id_list) {
                            var parameters  = Parameters.get(id_list),
                                size        = HTML.Render.GetSize(node);
                            if (parameters !== null && size !== null) {
                                if (typeof parameters.sorting.current === "undefined"){
                                    parameters.sorting.current = {
                                        id      : id_item,
                                        node    : node,
                                        space   : space_node,
                                        group   : (id_item.indexOf("group") === -1 ? false : true),
                                        height  : size.MarginHeight
                                    };
                                    return true;
                                }
                            }
                            return false;
                        },
                        get     : function (id_list) {
                            var parameters = Parameters.get(id_list);
                            if (parameters !== null) {
                                if (typeof parameters.sorting.current === "object") {
                                    if (parameters.sorting.current !== null) {
                                        return parameters.sorting.current;
                                    }
                                }
                            }
                            return null;
                        },
                        reset   : function (id_list) {
                            var parameters = Parameters.get(id_list);
                            if (parameters !== null) {
                                parameters.sorting.current = null;
                                delete parameters.sorting.current;
                            }
                        },
                    },
                    switcher    : {
                        grouping: {
                            on  : function (id_item, id_list) {
                                var parameters          = Parameters.get(id_list),
                                    argument_id_item    = (typeof id_item === "string" ? id_item : null),
                                    properties          = Configuration.properties,
                                    attributes          = Configuration.attributes.item,
                                    cover               = null,
                                    group               = null,
                                    item                = null,
                                    space               = null,
                                    attach              = Items.events.attach.group;
                                if (parameters !== null) {
                                    item        = HTML.Select.First("li[" + properties.id_item + "=\"" + argument_id_item + "\"]["      + attributes.container.     name + "=\"" + attributes.container.    value + "\"]");
                                    cover       = HTML.Select.First("li[" + properties.id_item + "=\"" + argument_id_item + "\"] div["  + attributes.cover_group.   name + "=\"" + attributes.cover_group.  value + "\"]");
                                    group       = HTML.Select.First("li[" + properties.id_item + "=\"" + argument_id_item + "\"] div["  + attributes.group.         name + "=\"" + attributes.group.        value + "\"]");
                                    attributes  = Configuration.attributes.space,
                                    space       = HTML.Select.First("li[" + properties.id_item + "=\"" + argument_id_item + "\"]["      + attributes.               name + "=\"" + attributes.              value + "\"]");
                                    if (item !== null && group !== null && cover !== null && space !== null) {
                                        attach.dragenter(cover, group, argument_id_item, id_list);
                                        attach.dragover (cover, argument_id_item);
                                        attach.drop     (cover, item, space, argument_id_item, id_list);
                                        return true;
                                    }
                                    return false;
                                }
                                return null;
                            },
                            off : function (id_item, id_list) {
                                var parameters          = Parameters.get(id_list),
                                    argument_id_item    = (typeof id_item === "string" ? id_item : null),
                                    properties          = Configuration.properties,
                                    attributes          = Configuration.attributes.item,
                                    cover               = null,
                                    detach              = Items.events.detach.group;
                                if (parameters !== null) {
                                    cover = HTML.Select.First("li[" + properties.id_item + "=\"" + argument_id_item + "\"] div[" + attributes.cover_group.  name + "=\"" + attributes.cover_group.  value + "\"]");
                                    if (cover !== null) {
                                        detach.dragenter(cover, argument_id_item);
                                        detach.dragover (cover, argument_id_item);
                                        detach.drop     (cover, argument_id_item);
                                        return true;
                                    }
                                    return false;
                                }
                                return null;
                            }
                        }
                    },
                    nodes: {
                        space   : function (id_item, id_list) {
                            var parameters          = Parameters.get(id_list),
                                argument_id_item    = (typeof id_item === "string" ? id_item : null),
                                properties          = Configuration.properties,
                                attributes          = Configuration.attributes.space;
                            if (parameters !== null) {
                                return HTML.Select.First("li[" + attributes.name + "=\"" + attributes.value + "\"][" + properties.id_item + "=\"" + argument_id_item + "\"]");
                            }
                            return null;
                        },
                        item    : function (id_item, id_list) {
                            var parameters          = Parameters.get(id_list),
                                argument_id_item    = (typeof id_item === "string" ? id_item : null),
                                properties          = Configuration.properties,
                                attributes          = Configuration.attributes.item;
                            if (parameters !== null) {
                                return HTML.Select.First("li[" + properties.id_item + "=\"" + argument_id_item + "\"][" + attributes.container.name + "=\"" + attributes.container.value + "\"]");
                            }
                            return null;
                        }
                    },
                    events      : {
                        attach: {
                            common : {
                                dragstart   : function (node, space_node, id_item, id_list) {
                                    DOMEvents.DOM.AddListener(  node, 
                                                                "dragstart",
                                                                function (event) {
                                                                    Items.actions.common.dragstart(event, node, space_node, id_item, id_list);
                                                                },
                                                                "dragstart" + id_item
                                    );
                                },
                                dragend     : function (node, id_item, id_list) {
                                    DOMEvents.DOM.AddListener(  node, 
                                                                "dragend",
                                                                function (event) {
                                                                    Items.actions.common.dragend(event, node, id_list, id_item);
                                                                },
                                                                "dragend" + id_item
                                    );
                                }
                            },
                            group : {
                                dragenter   : function (cover, group_node, id_item, id_list) {
                                    DOMEvents.DOM.AddListener(  cover,
                                                                "dragenter", 
                                                                function (event) {
                                                                    Items.actions.group.dragenter(event, group_node, id_item, id_list);
                                                                },
                                                                "dragenter" + id_item
                                    );
                                },
                                dragover    : function (cover, id_item) {
                                    DOMEvents.DOM.AddListener(  cover,
                                                                "dragover",
                                                                function (event) {
                                                                    Items.actions.group.dragover(event);
                                                                },
                                                                "dragover" + id_item
                                    );
                                },
                                drop        : function (cover, item_node, space_node, id_item, id_list) {
                                    DOMEvents.DOM.AddListener(  cover,
                                                                "drop",
                                                                function (event) {
                                                                    Items.actions.group.drop(event, item_node, space_node, id_item, id_list);
                                                                },
                                                                "drop" + id_item
                                    );
                                }
                            },
                            replace : {
                                dragenter   : function (cover, space_node, id_item, id_list) {
                                    DOMEvents.DOM.AddListener(  cover,
                                                                "dragenter", 
                                                                function (event) {
                                                                    Items.actions.replace.dragenter(event, space_node, id_item, id_list);
                                                                },
                                                                "dragenter" + id_item
                                    );
                                },
                                dragover    : function (cover, id_item) {
                                    DOMEvents.DOM.AddListener(  cover,
                                                                "dragover", 
                                                                function (event) {
                                                                    Items.actions.replace.dragover(event);
                                                                },
                                                                "dragover" + id_item
                                    );
                                },
                                drop        : function (cover, space_node, id_item, id_list) {
                                    DOMEvents.DOM.AddListener(  cover,
                                                                "drop",
                                                                function (event) {
                                                                    Items.actions.replace.drop(event, space_node, id_item, id_list);
                                                                },
                                                                "drop" + id_item
                                    );
                                }
                            },
                            space: {
                                dragover    : function (space_node, id_item) {
                                    DOMEvents.DOM.AddListener(  space_node,
                                                                "dragover", 
                                                                function (event) {
                                                                    Items.actions.replace.dragover(event);
                                                                },
                                                                "dragover" + id_item
                                    );
                                },
                                drop        : function (space_node, id_item, id_list) {
                                    DOMEvents.DOM.AddListener(  space_node,
                                                                "drop",
                                                                function (event) {
                                                                    Items.actions.replace.drop(event, space_node, id_item, id_list);
                                                                },
                                                                "drop" + id_item
                                    );
                                }
                            },
                            developer: {
                                click: function (id_item, handle, node) {
                                    var argument_id_item    = (typeof id_item   === "string"    ? id_item   : null),
                                        argument_handle     = (typeof handle    === "function"  ? handle    : null);
                                    if (argument_id_item !== null && argument_handle !== null) {
                                        TouchEvents.attach(node, 
                                            "touchstart", 
                                            "click",
                                            function (event) {
                                                return Purity.System.runHandle( handle,
                                                                                {
                                                                                    event   : event,
                                                                                    item    : id_item
                                                                                },
                                                                                "[Controls.Lists.Group][Events.attach.developer.click]",
                                                                                this
                                                );
                                            },
                                            function (event) {
                                                return Purity.System.runHandle( handle,
                                                                                {
                                                                                    event   : event,
                                                                                    item    : id_item
                                                                                },
                                                                                "[Controls.Lists.Group][Events.attach.developer.click]",
                                                                                this
                                                );
                                            },
                                            id_item
                                        );
                                    }
                                }
                            }
                        },
                        detach: {
                            group : {
                                dragenter   : function (cover, id_item) {
                                    DOMEvents.DOM.RemoveListener(   cover,
                                                                    "dragenter", 
                                                                    "dragenter" + id_item,
                                                                    null
                                    );
                                },
                                dragover    : function (cover, id_item) {
                                    DOMEvents.DOM.RemoveListener(   cover,
                                                                    "dragover",
                                                                    "dragover" + id_item,
                                                                    null
                                    );
                                },
                                drop        : function (cover, id_item) {
                                    DOMEvents.DOM.RemoveListener(   cover,
                                                                    "drop",
                                                                    "drop" + id_item,
                                                                    null
                                    );
                                }
                            },
                        }
                    },
                    actions: {
                        common  : {
                            dragstart   : function (event, node, space_node, id_item, id_list) {
                                if (Items.state.set(node, space_node, id_item, id_list) === true) {
                                    node.style.opacity                  = 0.5;
                                    event.dataTransfer.effectAllowed    = 'move';
                                    event.dataTransfer.setData("Text", id_item);
                                    //event.dataTransfer.setDragImage(event.target, 0, 0);
                                }
                            },
                            dragend     : function (event, node, id_list, id_item) {
                                Spaces.current. reset   (id_list           );
                                Groups.current. reset   (id_list           );
                                Items.state.    reset   (id_list           );
                                Groups.events.  groupIn (id_list, id_item  );
                                node.style.opacity = "";
                                return true;
                            },
                        },
                        group   : {
                            dragenter   : function (event, group_node, id_item, id_list) {
                                var current = Items.state.get(id_list);
                                if (current !== null) {
                                    Spaces.current.reset(id_list);
                                    Groups.current.reset(id_list);
                                    if (current.group !== true) {
                                        if (current.id !== id_item) {
                                            Groups.current.apply(group_node, id_list);
                                        }
                                    }
                                }
                            },
                            dragover    : function (event) {
                                event.preventDefault();
                            },
                            drop        : function (event, item_node, space_node, id_item, id_list) {
                                var current = Items.state.get(id_list),
                                    group   = null;
                                if (current !== null) {
                                    if (current.group !== true) {
                                        Spaces.current.reset(id_list);
                                        Groups.current.reset(id_list);
                                        if (current.id !== id_item) {
                                            group   = Render.group.make(id_list, null, space_node, null);
                                            if (group !== null) {
                                                group.appendChild(space_node    );
                                                group.appendChild(item_node     );
                                                group.appendChild(current.space );
                                                group.appendChild(current.node  );
                                            }
                                        }
                                        Items.state.reset(id_list);
                                        event.preventDefault();
                                        return false;
                                    }
                                }
                            }
                        },
                        replace : {
                            dragenter   : function (event, space_node, id_item, id_list) {
                                var current = Items.state.get(id_list);
                                if (current !== null) {
                                    Spaces.current.reset(id_list);
                                    Groups.current.reset(id_list);
                                    if (current.id !== id_item && Groups.isInGroup(current.id, id_item) === false) {
                                        Spaces.current.apply(space_node, id_list, current.height);
                                    }
                                }
                            },
                            dragover    : function (event) {
                                event.preventDefault();
                            },
                            drop        : function (event, space_node, id_item, id_list) {
                                var current         = Items.state.get(id_list),
                                    parent          = null,
                                    parent_previous = null;
                                if (current !== null) {
                                    Spaces.current.reset(id_list);
                                    if (current.id !== id_item && Groups.isInGroup(current.id, id_item) === false) {
                                        parent          = space_node.   parentNode;
                                        parent_previous = current.node. parentNode;
                                        parent.insertBefore(current.space,  space_node);
                                        parent.insertBefore(current.node,   space_node);
                                        Groups.clearGroup(parent_previous);
                                    }
                                    Items.state.reset(id_list);
                                    event.preventDefault();
                                    return false;
                                }
                            }
                        }
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                PublicMethods = {
                    create  : function () {
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
                        return Purity.System.runHandle(Initializer.create, arguments, "[Controls.Lists.Group][Initializer.create]", this);
                    },
                    add     : function () {
                        return Purity.System.runHandle(Initializer.add, arguments, "[Controls.Lists.Group][Initializer.add]", this);
                    },
                    remove  : function () {
                        return Purity.System.runHandle(Initializer.remove, arguments, "[Controls.Lists.Group][Initializer.remove]", this);
                    },
                    group   : function () {
                        return Purity.System.runHandle(Initializer.group, arguments, "[Controls.Lists.Group][Initializer.group]", this);
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
                    create  : PublicMethods.create,
                    add     : PublicMethods.add,
                    remove  : PublicMethods.remove,
                    group   : PublicMethods.group
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());