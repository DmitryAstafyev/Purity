/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
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
        Purity.createModule("Environment.Events.Mutation",
            //Check references
            {
                modules: ["Environment.Events", "Environment.Overhead"],
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Environment.Events.Mutation",
                    version         = "1.0",
                    lastUpdate      = "27.01.2014",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Configuration   = {},
                    EmulateTable    = {},
                    Support         = {},
                    publicMethods   = {},
                    //Declaration references
                    Overhead        = new Purity.initModule("Environment.Overhead"  ),
                    DOMEvents       = new Purity.initModule("Environment.Events"    );
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Configuration   = {
                    variables_group : "Environment_Events_Mutation",
                    variable_name   : "SupportData",
                };
                Support         = {
                    data        : {
                        get: function () {
                            var data = Overhead.vars.get(Configuration.variables_group, Configuration.variable_name);
                            return (data !== null ? data : Overhead.vars.set(Configuration.variables_group, Configuration.variable_name, {}));
                        }
                    },
                    emulators   : {
                        removing: function (event_name) {
                            var supporting_data = Support.data.get(),
                                node            = null;
                            supporting_data[event_name] = false;
                            node                        = document.createElement("DIV");
                            node.style.display          = "none";
                            document.body.appendChild(node);
                            DOMEvents.DOM.AddListener(  node,
                                                        event_name,
                                                        function () {
                                                            supporting_data[event_name] = true;
                                                        },
                                                        event_name + "temporarily"
                            );
                            document.body.removeChild(node);
                        }
                    },
                    detect      : function (event_name) {
                        /*
                        (!) in IE this method gives wrong result. That's why use emulation
                        var supporting_data = Support.data.get(),
                            event           = null;
                        if (!supporting_data[event_name]) {
                            try {
                                event = document.createEvent('MutationEvent');
                                event.initMutationEvent(event_name, true, true, null, null, null, null, MutationEvent.REMOVAL);
                                event = null;
                                supporting_data[event_name] = true;
                            } catch (e) {
                                supporting_data[event_name] = false;
                                return false;
                            }
                        }
                        return supporting_data[event_name];
                        */
                        var supporting_data = Support.data.get();
                        if (EmulateTable[event_name]) {
                            if (!supporting_data[event_name]) {
                                EmulateTable[event_name](event_name);
                            }
                            return supporting_data[event_name];
                        }
                        return false;
                    }
                };
                EmulateTable    = {
                    DOMNodeRemoved              : Support.emulators.removing,
                    DOMNodeRemovedFromDocument  : Support.emulators.removing,
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicMethods = {
                    detect : Support.detect
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
                    isAvaliable : publicMethods.detect
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());