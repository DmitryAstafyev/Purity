/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
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
        Purity.createModule("Environment.AppEvents",
            //Check references
            null,
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity.Environment.AppEvents",
                    version         = "1.00",
                    lastUpdate      = "22.11.2013",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Events          = {},
                    Actions         = {},
                    publicAdd       = null,
                    publicRemove    = null,
                    publicCall      = null,
                    publicRegister  = null;
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Events = {
                    data    : {},
                    methods: {
                        serialize   : function (source_string){
                            var regExp = new RegExp(/\W/gim);
                            return source_string.replace(regExp, '_');

                        },
                        validate    : function (group_name, event_name) {
                            var serialize   = Events.methods.serialize,
                                group_name  = (typeof group_name === "string" ? serialize(group_name) : null),
                                event_name  = (typeof event_name === "string" ? serialize(event_name) : null),
                                data        = Events.data;
                            if (group_name !== null && event_name !== null) {
                                return (typeof data[group_name] !== "undefined" ? (typeof data[group_name][event_name] !== "undefined" ? true : null) : null);
                            }
                            return null;
                        },
                        register    : function (group_name, event_name){
                            var serialize   = Events.methods.serialize,
                                group_name  = (typeof group_name === "string" ? serialize(group_name) : null),
                                event_name  = (typeof event_name === "string" ? serialize(event_name) : null),
                                data        = Events.data;
                            if (group_name !== null && event_name !== null) {
                                data[group_name]    = (typeof data[group_name] === "undefined" ? {} : data[group_name]);
                                data                = data[group_name];
                                data[event_name]    = (typeof data[event_name] === "undefined" ? [] : data[event_name]);
                                return true;
                            }
                            return false;
                        },
                        clear       : function (group_name, event_name){
                            var serialize       = Events.methods.serialize,
                                group_name      = (typeof group_name === "string" ? serialize(group_name) : null),
                                event_name      = (typeof event_name === "string" ? serialize(event_name) : null),
                                handles_data    = Events.methods.get(group_name, event_name),
                                data            = Events.data;
                            if (handles_data !== null) {
                                if (handles_data.length === 0) {
                                    data[group_name][event_name] = null;
                                    delete data[group_name][event_name];
                                    if (Object.keys(data[group_name]).length === 0) {
                                        delete data[group_name];
                                    }
                                    return true;
                                }
                            }
                            return false;
                        },
                        add         : function (group_name, event_name, handle, handle_id, register) {
                            var serialize       = Events.methods.serialize,
                                group_name      = (typeof group_name    === "string"    ? serialize(group_name) : null  ),
                                event_name      = (typeof event_name    === "string"    ? serialize(event_name) : null  ),
                                handle_id       = (typeof handle_id     === "string"    ? handle_id             : null  ),
                                handle          = (typeof handle        === "function"  ? handle                : null  ),
                                register        = (typeof register      === "boolean"   ? register              : false ),
                                event_handles   = null,
                                data            = Events.data;
                            if (register === true) {
                                Events.methods.register(group_name, event_name);
                            }
                            if (Events.methods.validate(group_name, event_name) === true && handle_id !== null && handle !== null) {
                                data[group_name][event_name].push({
                                    handle      : handle,
                                    id          : handle_id
                                });
                                return true;
                            }
                            return false;
                        },
                        get         : function (group_name, event_name) {
                            var serialize   = Events.methods.serialize,
                                group_name  = (typeof group_name === "string" ? serialize(group_name) : null),
                                event_name  = (typeof event_name === "string" ? serialize(event_name) : null),
                                data        = Events.data;
                            if (Events.methods.validate(group_name, event_name) === true) {
                                return data[group_name][event_name];
                            }
                            return null;
                        }
                    }
                };
                Actions = {
                    listen  : function (group_name, event_name, handle, handle_id) {
                        return Events.methods.add(group_name, event_name, handle, handle_id);
                    },
                    call    : function (group_name, event_name, params, callback) {
                        var handles_data    = Events.methods.get(group_name, event_name),
                            callback        = (typeof callback === "function" ? callback : null),
                            callback_result = null;
                        if (handles_data !== null) {
                            for (var index = handles_data.length - 1; index >= 0; index -= 1) {
                                callback_result = Purity.System.runHandle(handles_data[index].handle, params, "[Environment.AppEvents][Actions.call]", this);
                                if (typeof callback_result !== "undefined" && callback !== null) {
                                    if (callback_result !== null) {
                                        Purity.System.runHandle(callback, callback_result, "[Environment.AppEvents][Actions.call]", this);
                                    }
                                }
                            }
                            return true;
                        }
                        return false;
                    },
                    remove    : function (group_name, event_name, id, clear_group) {
                        var handles_data    = Events.methods.get(group_name, event_name),
                            id              = (typeof id            === "string"    ? id            : null  ),
                            clear_group     = (typeof clear_group   === "boolean"   ? clear_group   : false );
                        if (handles_data !== null) {
                            for (var index = handles_data.length - 1; index >= 0; index -= 1) {
                                if (handles_data[index].id === id) {
                                    handles_data.splice(index, 1);
                                }
                            }
                            if (clear_group === true) {
                                Events.methods.clear(group_name, event_name);
                            }
                            return true;
                        }
                        return false;
                    },
                };
                publicAdd       = Actions.listen;
                publicRemove    = Actions.remove;
                publicCall      = Actions.call;
                publicRegister  = Events.methods.register;
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
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
                    listen      : publicAdd,
                    remove      : publicRemove,
                    call        : publicCall,
                    register    : publicRegister
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());