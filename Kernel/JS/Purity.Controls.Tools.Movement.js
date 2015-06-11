/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.Touch.js" />
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
        Purity.createModule("Controls.Tools.Movement",
            //Check references
            {
                modules: ["Tools", "HTML", "Environment.Events.Touch"],
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Controls.Tools.Movement",
                    version         = "1.0",
                    lastUpdate      = "29.01.2014",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Initializer     = {},
                    Events          = {},
                    PublicMethods   = {},
                    //Declaration references
                    HTML            = new Purity.initModule("HTML"                          ),
                    Tools           = new Purity.initModule("Tools"                         ),
                    TouchEvents     = new Purity.initModule("Environment.Events.Touch"      );
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Initializer = {
                    validate: {
                        basic       : function (params) {
                            return Tools.Object.validate(params, [  { name: "id",           type: "string",     value: null },
                                                                    { name: "mutable",      type: "node"                    },
                                                                    { name: "caller",       type: "node"                    },
                                                                    { name: "events",       type: "object",     value: {}   },
                                                                    { name: "limits",       type: "object",     value: {}   }]);
                        },
                        limits      : function (limits) {
                            return Tools.Object.validate(limits, [  { name: "top",      type: "number", value: null },
                                                                    { name: "left",     type: "number", value: null },
                                                                    { name: "bottom",   type: "number", value: null },
                                                                    { name: "right",    type: "number", value: null }, ]);
                        },
                        events      : function (events) {
                            return Tools.Object.validate(events, [  { name: "start",        type: "function", value: null },
                                                                    { name: "processing",   type: "function", value: null },
                                                                    { name: "finish",       type: "function", value: null } ]);
                        },
                        detach       : function (params) {
                            return Tools.Object.validate(params, [  { name: "id",           type: "string",     value: null },
                                                                    { name: "caller",       type: "node"                    }]);
                        },
                    },
                    attach  : function (params) {
                        var parameters = null;
                        if (Initializer.validate.basic(params) === true) {
                            //Get ID
                            params.id = (params.id !== null ? params.id : Tools.IDs.Get(6));
                            //Check limits
                            Initializer.validate.limits(params.limits);
                            //Check handles
                            Initializer.validate.events(params.events);
                            //Attach event
                            Events.init(params);
                            return params.id;
                        }
                        return null;
                    },
                    detach  : function (params) {
                        if (Initializer.validate.detach(params) === true) {
                            //Detach event
                            Events.destroy(params);
                            return true;
                        }
                        return false;
                    }
                };
                Events = {
                    cache : {
                        data    : {},
                        clear   : function () {
                            Events.cache.data = {};
                        },
                        get     : function (clear_flag) {
                            var clear_flag = (typeof clear_flag === "boolean" ? clear_flag : false);
                            if (clear_flag === true) {
                                Events.cache.clear();
                            }
                            return Events.cache.data;
                        }
                    },
                    init    : function (params) {
                        TouchEvents.attach( params.caller,
                                            "touchstart",
                                            "mousedown",
                                            function (event) {
                                                return Events.actions.start(event, params.id, params.mutable, params.limits, params.events);
                                            },
                                            function (event) {
                                                return Events.actions.start(event, params.id, params.mutable, params.limits, params.events);
                                            },
                                            params.id,
                                            true,
                                            false
                        );
                    },
                    destroy : function (params) {
                        TouchEvents.detach(params.caller, "touchstart", "mousedown", params.id);
                    },
                    actions : {
                        start   : function (event, id, mutable, limits, handles) {
                            var event       = (typeof event === "object" ? event : null),
                                cache       = Events.cache.get(true),
                                size        = null,
                                position    = null;
                            if (event !== null) {
                                //Get size target node
                                size            = HTML.Render.GetSize(mutable);
                                //Get position
                                position        = HTML.Render.Position.ByPage(mutable)
                                //Save data into cache
                                cache.size      = {
                                    width   : size.OuterWidth,
                                    height  : size.OuterHeight
                                };
                                cache.position  = {
                                    top     : position.top,
                                    left    : position.left
                                };
                                cache.cursor = {
                                    x: event._clientX,
                                    y: event._clientY
                                };
                                //Attach events
                                Events.actions.move.    init(id, mutable, limits, handles.processing);
                                Events.actions.finish.  init(id, handles.finish);
                                Purity.System.runHandle(handles.start, null, "[Controls.Tools.Movement][Events.actions.start]", this);
                                event.preventDefault();
                                //Tools.Log.lifeview.register({id:id + "x", name : "x"});
                                //Tools.Log.lifeview.register({ id: id + "y", name: "y" });
                            }
                        },
                        move    : {
                            init        : function (id, mutable, limits, handle) {
                                TouchEvents.attach( window,
                                                    "touchmove",
                                                    "mousemove",
                                                    function (event) {
                                                        return Events.actions.move.processing(event, id, mutable, limits, handle);
                                                    },
                                                    function (event) {
                                                        return Events.actions.move.processing(event, id, mutable, limits, handle);
                                                    },
                                                    id,
                                                    true,
                                                    false
                                );
                            },
                            destroy     : function (id) {
                                TouchEvents.detach(window, "touchmove", "mousemove", id);
                            },
                            processing  : function (event, id, mutable, limits, handle) {
                                function reposition(node, position) {
                                    node.style.top      = position.top  + "px";
                                    node.style.left     = position.left + "px";
                                };
                                var event   = (typeof event === "object" ? event : null),
                                    cache   = Events.cache.get(false);
                                if (event !== null) {
                                    if (cache.cursor.x !== event._clientX || cache.cursor.y !== event._clientY) {
                                        cache.position.left -= (cache.cursor.x - event._clientX);
                                        cache.position.top  -= (cache.cursor.y - event._clientY);
                                        reposition(mutable, cache.position);
                                        Purity.System.runHandle(handle, null, "[Controls.Tools.Movement][Events.actions.move.processing]", this);
                                    }
                                    cache.cursor.x = event._clientX;
                                    cache.cursor.y = event._clientY;
                                    event.preventDefault();
                                    //Tools.Log.lifeview.update({ id: id + "x", value: cache.cursor.x });
                                    //Tools.Log.lifeview.update({ id: id + "y", value: cache.cursor.y });
                                }
                            }
                        },
                        finish  : {
                            init        : function (id, handle) {
                                TouchEvents.attach( window,
                                                    "touchend",
                                                    "mouseup",
                                                    function (event) {
                                                        return Events.actions.finish.processing(event, id, handle);
                                                    },
                                                    function (event) {
                                                        return Events.actions.finish.processing(event, id, handle);
                                                    },
                                                    id,
                                                    true,
                                                    false
                                );
                            },
                            destroy     : function (id) {
                                TouchEvents.detach(window, "touchend", "mouseup", id);
                            },
                            processing  : function (event, id, handle) {
                                var event   = (typeof event === "object" ? event : null);
                                if (event !== null) {
                                    Events.cache.clear();
                                    Events.actions.move.    destroy(id);
                                    Events.actions.finish.  destroy(id);
                                    Purity.System.runHandle(handle, null, "[Controls.Tools.Movement][Events.actions.finish.processing]", this);
                                }
                            }
                        }
                    },
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                PublicMethods = {
                    attach: function () {
                        return Purity.System.runHandle(Initializer.attach, arguments, "[Controls.Tools.Movement][Initializer.attach]", this);
                    },
                    detach: function () {
                        return Purity.System.runHandle(Initializer.detach, arguments, "[Controls.Tools.Movement][Initializer.detach]", this);
                    },
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
                    attach : PublicMethods.attach,
                    detach  : PublicMethods.detach,
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());