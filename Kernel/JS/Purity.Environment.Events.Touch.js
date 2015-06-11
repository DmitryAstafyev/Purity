/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Overhead.js" />
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
        Purity.createModule("Environment.Events.Touch",
            //Check references
            {
                modules: ["Tools", "HTML", "Environment.Events", "Environment.Overhead"]
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity.Environment.Events.Touch",
                    version         = "1.0",
                    lastUpdate      = "03.12.2013",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Configuration   = {},
                    Events          = {},
                    publicEvents    = {},
                    //Declaration references
                    HTML            = new Purity.initModule("HTML"                  ),
                    Tools           = new Purity.initModule("Tools"                 ),
                    Overhead        = new Purity.initModule("Environment.Overhead"  ),
                    DOMEvents       = new Purity.initModule("Environment.Events"    );
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Configuration = {
                    use_only_touch          : false, //This setting will be useful for debug touch on PC
                    double_property_name    : "is_launched"
                },
                Events = {
                    support     : {
                        cache   : {
                            mouse : {},
                            touch : {}
                        },
                        check   : {
                            touch: function (event_name) {
                                var event = null;
                                //Check touch
                                try {
                                    event = document.createEvent('TouchEvent');
                                    event.initTouchEvent(event_name, true, true);
                                    event = null;
                                    return true;
                                } catch (e) {
                                    return false;
                                }
                            },
                            mouse: function (event_name) {
                                var event = null;
                                //Check mouse
                                try {
                                    event = document.createEvent("MouseEvents");
                                    event.initMouseEvent(event_name, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
                                    event = null;
                                    return true;
                                } catch (e) {
                                    return false;
                                }
                            },
                        },
                        is      : {
                            mouse : function (event_name) {
                                var cache       = Events.support.cache.mouse,
                                    event_name  = (typeof event_name === "string" ? event_name : null);
                                if (event_name !== null) {
                                    if (typeof cache[event_name] !== "boolean") {
                                        cache[event_name] = Events.support.check.mouse(event_name);
                                    }
                                    return cache[event_name];
                                }
                                return null;
                            },
                            touch : function (event_name) {
                                var cache       = Events.support.cache.touch,
                                    event_name  = (typeof event_name === "string" ? event_name : null);
                                if (event_name !== null) {
                                    if (typeof cache[event_name] !== "boolean") {
                                        cache[event_name] = Events.support.check.touch(event_name);
                                    }
                                    return cache[event_name];
                                }
                                return null;
                            },
                        }
                    },
                    unify       : function (event, handle, call_always) {
                        var event       = (typeof event         === "object"    ? event         : null),
                            handle      = (typeof handle        === "function"  ? handle        : null),
                            call_always = (typeof call_always   === "boolean"   ? call_always   : false),
                            unify_done  = false;
                        if (event !== null && handle !== null) {
                            if (typeof event.touches === "object") {
                                if (event.touches.length === 1) {
                                    event._clientX   = event.touches[0].clientX;
                                    event._clientY   = event.touches[0].clientY;
                                    event._target    = event.touches[0];
                                    unify_done      = true;
                                }
                            } else {
                                event._clientX = (typeof event.clientX !== "undefined" ? event.clientX : null);
                                event._clientY = (typeof event.clientY !== "undefined" ? event.clientY : null);
                            }
                            if (unify_done === true || call_always === true) {
                                return Purity.System.runHandle(handle, event, "[Environment.Events.Touch][Events.unify]", this);
                            }
                            return null;
                        }
                    },
                    processing  : function (event, type, element, handle, call_always) {
                        function reset() {
                            status.touch = false;
                            status.mouse = false;
                        };
                        var status = Overhead.Properties.Get(element, Configuration.double_property_name, false);
                        //Check for new event
                        if ((type === "touch" && status.touch === true) || (type === "mouse" && status.mouse === true)) {
                            reset();
                        }
                        if (status.touch === false && status.mouse === false) {
                            switch (type) {
                                case "touch":
                                    status.touch = true;
                                    break;
                                case "mouse":
                                    status.mouse = true;
                                    break;
                            }
                            if (typeof call_always === "boolean") {
                                return Events.unify(event, handle, call_always);
                            } else {
                                return Purity.System.runHandle(handle, event, "[Environment.Events.Touch][Events.processing]", this);
                            }
                        }
                    },
                    attach      : function (element, touch_event, mouse_event, touch_handle, mouse_handle, id, unify_event, call_always) {
                        function single() {
                            if (Events.support.is.touch(touch_event) === true) {
                                if (unify_event === true) {
                                    DOMEvents.DOM.AddListener(  element,
                                                                touch_event,
                                                                function (event) {
                                                                    return Events.unify(event, touch_handle, call_always);
                                                                },
                                                                id
                                    );
                                } else {
                                    DOMEvents.DOM.AddListener(element, touch_event, touch_handle, id);
                                }
                            }
                            if (Events.support.is.mouse(mouse_event) === true && Configuration.use_only_touch === false) {
                                DOMEvents.DOM.AddListener(  element,
                                                            mouse_event,
                                                            mouse_handle,
                                                            id
                                );
                            }
                        };
                        function double() {
                            if (unify_event === true) {
                                DOMEvents.DOM.AddListener(  element,
                                                            touch_event,
                                                            function (event) {
                                                                return Events.processing(event, "touch", element, touch_handle, call_always);
                                                            },
                                                            id
                                );
                            } else {
                                DOMEvents.DOM.AddListener(  element,
                                                            touch_event,
                                                            function (event) {
                                                                return Events.processing(event, "touch", element, touch_handle);
                                                            },
                                                            id
                                );
                            }
                            DOMEvents.DOM.AddListener(  element,
                                                        mouse_event,
                                                        function (event) {
                                                            return Events.processing(event, "mouse", element, mouse_handle);
                                                        },
                                                        id
                            );
                            Overhead.Properties.Set(element, Configuration.double_property_name, {touch:false, mouse: false}, true);
                        };
                        ///     <summary>Attach touch event and mouse event to same element, or attach only touch event (if supported).</summary>
                        ///     <param name="element"       type="node"     >DOM node                                               </param>
                        ///     <param name="touch_event"   type="string"   >name of touch event                                    </param>
                        ///     <param name="mouse_event"   type="string"   >name of mouse event                                    </param>
                        ///     <param name="touch_handle"  type="function" >handle what will be called by touch event              </param>
                        ///     <param name="mouse_handle"  type="function" >handle what will be called by mouse event              </param>
                        ///     <param name="id"            type="string"   >ID of event                                            </param>
                        ///     <param name="unify_event"   type="boolean"  >[false in default] in [true] object [event] of touch will be modify like object [event] for mouse</param>
                        ///     <param name="call_always"   type="boolean"  >[false in default] in [true] handle will be called if event wasn't unified</param>
                        ///     <returns type="boolean" mayBeNull="true">True - if OK. False - if some problem is</returns>
                        var element         = (HTML.Nodes.Is(element)   === true        ? element       : (element === window ? element : null)),
                            touch_event     = (typeof touch_event       === "string"    ? touch_event   : null),
                            mouse_event     = (typeof mouse_event       === "string"    ? mouse_event   : null),
                            id              = (typeof id                === "string"    ? id            : null),
                            touch_handle    = (typeof touch_handle      === "function"  ? touch_handle  : null),
                            mouse_handle    = (typeof mouse_handle      === "function"  ? mouse_handle  : null),
                            unify_event     = (typeof unify_event       === "boolean"   ? unify_event   : false),
                            call_always     = (typeof call_always       === "boolean"   ? call_always   : false),
                            double_event    = false;
                        if (Tools.Vars.IsNotEquality([element, touch_event, mouse_event, touch_handle, mouse_handle, id], null) === true) {
                            //Check doulble event
                            if (Events.support.is.touch(touch_event) === true && Events.support.is.mouse(mouse_event) === true && Configuration.use_only_touch === false) {
                                double_event = true;
                            } else {
                                double_event = false;
                            }
                            switch (double_event) {
                                case true:
                                    double();
                                    break;
                                case false:
                                    single();
                                    break;
                            }
                            return true;
                        }
                        return false;
                    },
                    detach      : function (element, touchEvent, mouseEvent, id) {
                        ///     <summary>Detach touch event and mouse event of same element.</summary>
                        ///     <param name="element"       type="node"     >DOM node                                               </param>
                        ///     <param name="touch_event"   type="string"   >name of touch event                                    </param>
                        ///     <param name="mouse_event"   type="string"   >name of mouse event                                    </param>
                        ///     <param name="id"            type="string"   >ID of event                                            </param>
                        ///     <returns type="boolean" mayBeNull="true">True - if OK. False - if some problem is</returns>
                        var element         = (HTML.Nodes.Is(element)   === true        ? element       : (element === window ? element : null)),
                            touch_event     = (typeof touchEvent        === "string"    ? touchEvent    : null),
                            mouse_event     = (typeof mouseEvent        === "string"    ? mouseEvent    : null),
                            id              = (typeof id                === "string"    ? id            : null);
                        if (Tools.Vars.IsNotEquality([element, touch_event, mouse_event, id], null) === true) {
                            if (Events.support.is.touch(touch_event) === true) {
                                DOMEvents.DOM.RemoveListener(element, touch_event, id, null);
                            }
                            if (Events.support.is.mouse(mouse_event) === true && Configuration.use_only_touch === false) {
                                DOMEvents.DOM.RemoveListener(element, mouse_event, id, null);
                            }
                            return true;
                        }
                        return false;
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicEvents = {
                    attach  : Events.attach,
                    detach  : Events.detach,
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
                    attach      : publicEvents.attach,
                    detach      : publicEvents.detach,
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());