/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Overhead.js" />
/// <module>
///     <summary>
///         Environment.Events - controll all DOM events. Has two basic interfaces:
///         - DOM - for any events;
///         - Window - for window's events.
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("Environment.Events",
            //Check references
            {
                modules     : ["HTML", "Tools", "Environment.Overhead"],
                resources   : null
            },
            //Prototype part
            function () {
                //This source code was highlighted with Source Code Highlighter.
                /// <summary>Discription of library</summary>
                var name            = "Purity::: DOM's events module.",
                    version         = "2.0",
                    lastUpdate      = "29.05.2013",
                    author          = "Dmitry Astafyev",
                    moduleName      = "Purity.Environment.Events",
                //Declaration module's blocks
                    Config          = {},
                    DOM             = {},
                    CSS             = {},
                    Window          = {},
                    Logs            = {},
                    publicDOM       = {},
                    publicCSS       = {},
                    publicWindow    = {},
                //Declaration references
                    HTML            = new Purity.initModule("HTML"),
                    Tools           = new Purity.initModule("Tools"),
                    Overhead        = new Purity.initModule("Environment.Overhead");
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Config = {
                    ShowWarning : false,
                    ShowErrors  : true,
                    ShowEvents  : false,
                };
                //Any DOM's envets
                DOM = {
                    //Settings of DOM's events
                    Setting: {
                        //Generate new ID
                        get idEvent() {
                            if (typeof DOM.Setting.currentEventID !== "number") {
                                DOM.Setting.currentEventID = -1;
                            }
                            DOM.Setting.currentEventID += 1;
                            return DOM.Setting.Properties.eventIDPrefix + DOM.Setting.currentEventID.toString();
                        },
                        get idCommonHandle(){
                            if (typeof DOM.Setting.currentCommonHandleID !== "number") {
                                DOM.Setting.currentCommonHandleID = -1;
                            }
                            DOM.Setting.currentCommonHandleID += 1;
                            return DOM.Setting.Properties.commonHandleIDPrefix + DOM.Setting.currentCommonHandleID.toString();
                        },
                        Properties: {
                            eventIDPrefix           : "PurityEventID.",
                            commonHandleIDPrefix    : "PurityCommonHandleID.",
                            elementStorage          : "PurityEventsStorage"
                        }
                    },
                    //Местные хелперы
                    CrossBrowserCompatibility: {
                        //Универсальные методы по добавлению/удалению событий
                        addListener     : function(element, eventType, handle){},
                        removeListener  : function(element, eventType, handle){},
                        //Инициализация методов
                        init            : function () {
                            function validationParams(element, eventType, handle) {
                                if (DOM.CrossBrowserCompatibility.isSupportEvents(element) === true && 
                                    typeof eventType === "string" && typeof handle === "function") {
                                    return true;
                                }
                                return false;
                            };
                            if (typeof window.addEventListener === "function") {
                                DOM.CrossBrowserCompatibility.addListener = function (element, eventType, handle) {
                                    if (validationParams(element, eventType, handle) === true) {
                                        element.addEventListener(eventType, handle, false);
                                        return true;
                                    } else {
                                        return false;
                                    }
                                };
                                DOM.CrossBrowserCompatibility.removeListener = function (element, eventType, handle) {
                                    if (validationParams(element, eventType, handle) === true) {
                                        element.removeEventListener(eventType, handle, false);
                                        return true;
                                    } else {
                                        return false;
                                    }
                                };
                            } else if (typeof document.attachEvent === "function") {
                                DOM.CrossBrowserCompatibility.addListener = function (element, eventType, handle) {
                                    if (validationParams(element, eventType, handle) === true) {
                                        element.attachEvent(("on" + eventType), handle);
                                        return true;
                                    } else {
                                        return false;
                                    }
                                };
                                DOM.CrossBrowserCompatibility.removeListener = function (element, eventType, handle) {
                                    if (validationParams(element, eventType, handle) === true) {
                                        element.detachEvent(("on" + eventType), handle);
                                        return true;
                                    } else {
                                        return false;
                                    }
                                };
                            } else {
                                DOM.CrossBrowserCompatibility.addListener = function (element, eventType, handle) {
                                    if (validationParams(element, eventType, handle) === true) {
                                        element[("on" + eventType)] = handle;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                };
                                DOM.CrossBrowserCompatibility.removeListener = function (element, eventType, handle) {
                                    if (validationParams(element, eventType, handle) === true) {
                                        element[("on" + eventType)] = null;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                };
                            };
                        },
                        isSupportEvents : function (element){
                            if (typeof element === "object"){
                                if (typeof element.addEventListener     === "function" ||
                                    typeof element.attachEvent          === "function" ||
                                    typeof element[("on" + eventType)]  !== "undefined") {
                                    return true;
                                }
                            }
                            return false;
                        },
                        //Исправляет потенциальный косяк IE
                        fixIE           : function (element) {
                            if (element.setInterval && (element !== window && !element.frameElement)) {
                                element = window;
                            }
                            return element;
                        }
                    },
                    Handles: {
                        Manipulation: {
                            storage             : {
                                get     : function (element, onlyGet) {
                                    var element     = (typeof element === "object"  ? element : null),
                                        onlyGet     = (typeof onlyGet === "boolean" ? onlyGet : true),
                                        properties  = DOM.Setting.Properties,
                                        storage     = null;
                                    if (element !== null) {
                                        storage = Overhead.Properties.Get(element, properties.elementStorage);
                                        if (storage === null && onlyGet === false) {
                                            storage = Overhead.Properties.Set(element, properties.elementStorage, {});
                                        }
                                        return storage;
                                    }
                                    return null;
                                },
                                clear   : function (element) {
                                    var element     = (typeof element === "object"  ? element : null),
                                        properties  = DOM.Setting.Properties,
                                        storage     = null;
                                    if (element !== null) {
                                        storage = DOM.Handles.Manipulation.storage.get(element, true);
                                        if (storage !== null) {
                                            if (Object.keys(storage).length === 0) {
                                                Overhead.Properties.Del(element, properties.elementStorage);
                                                return true;
                                            } else {
                                                return false;
                                            }
                                        }
                                        return false;
                                    }
                                    return null;
                                }
                            },
                            validateEventRecord : function (eventRecord){
                                var eventRecord = (typeof eventRecord === "object" ? eventRecord : null);
                                if (eventRecord !== null) {
                                    if (typeof eventRecord.id           !== "string"    ||
                                        typeof eventRecord.handle       !== "function"  ||
                                        typeof eventRecord.onetimerun   !== "boolean"   ||
                                        typeof eventRecord.remove       !== "boolean"   ||
                                        typeof eventRecord.stamp        !== "string"    ) {
                                        return false;
                                    }
                                    return true;
                                }
                                return false;
                            },
                            add                 : function (params) {
                                ///     <summary>Set event's handle</summary>
                                ///     <param name="params" type="Object">
                                ///         {element    : DOMObject,        &#13;&#10;
                                ///          type       : string,           &#13;&#10;                  
                                ///          handle     : function,         &#13;&#10;              
                                ///          onetimerun : boolean [false],  &#13;&#10;              
                                ///          id         : string            &#13;&#10;              
                                ///         }
                                ///     </param>
                                ///     <returns type="Boolean" mayBeNull="true">Null - if error. True if is OK.</returns>
                                var CBC             = DOM.CrossBrowserCompatibility,
                                    settings        = DOM.Setting,
                                    element         = (CBC.isSupportEvents(params["element"])   === true        ? params["element"]     : null              ),
                                    type            = (typeof params["type"]                    === "string"    ? params["type"]        : null              ),
                                    handle          = (typeof params["handle"]                  === "function"  ? params["handle"]      : null              ),
                                    id              = (typeof params["id"]                      === "string"    ? params["id"]          : settings.idEvent  ),
                                    onetimerun      = (typeof params["onetimerun"]              === "boolean"   ? params["onetimerun"]  : false             ),
                                    storage         = null,
                                    id_logs         = null;
                                if (Tools.Vars.IsNotEquality([element, type, handle], null) === true) {
                                    //Get access to element's storage
                                    storage = DOM.Handles.Manipulation.storage.get(element, false);
                                    if (storage !== null) {
                                        storage = DOM.Handles.Processing.init(element, type, storage);
                                        if (storage instanceof Array) {
                                            //Mark handle to delete without id
                                            handle.id = id;
                                            //Add logs record
                                            id_logs = Logs.register(type, id);
                                            //Add event's handle record
                                            storage.push({
                                                id              : id,
                                                id_logs         : id_logs,
                                                handle          : handle,
                                                onetimerun      : onetimerun,
                                                remove          : false,
                                                stamp           : "NoVa"
                                            });
                                            return true;
                                        }
                                    }
                                }
                                return null;
                            },
                            addListener         : function (element, type, handle, id) {
                                return DOM.Handles.Manipulation.add({
                                    element : element,
                                    type    : type,
                                    handle  : handle,
                                    id      : id
                                });
                            },
                            remove              : function (params){
                                ///     <summary>Remove event's handle</summary>
                                ///     <param name="params" type="Object">
                                ///         {element    : DOMObject,        &#13;&#10;
                                ///          type       : string,           &#13;&#10;                  
                                ///          handle     : function,         &#13;&#10;              
                                ///          id         : string            &#13;&#10; 
                                ///         }
                                ///     </param>
                                ///     <returns type="Boolean" mayBeNull="true">Null - if error. True if is OK.</returns>
                                var CBC             = DOM.CrossBrowserCompatibility,
                                    settings        = DOM.Setting,
                                    element         = (CBC.isSupportEvents(params["element"])   === true        ? params["element"]         : null),
                                    type            = (typeof params["type"]                    === "string"    ? params["type"]            : null),
                                    handle          = (typeof params["handle"]                  === "function"  ? params["handle"]          : null),
                                    id              = (typeof params["id"]                      === "string"    ? params["id"]              : null),
                                    waitingRemove   = (typeof params["waitingRemove"]           === "boolean"   ? params["waitingRemove"]   : false),
                                    storage         = null,
                                    handles         = null;
                                if (Tools.Vars.IsNotEquality([element, type], null) === true) {
                                    //Try get id if it isn't defined
                                    if (id === null && waitingRemove === false) {
                                        if (handle !== null) {
                                            if (typeof handle.id !== "undefined") {
                                                id = handle.id;
                                            } else {
                                                return false;
                                            }
                                        } else {
                                            return false;
                                        }
                                    }
                                    //Get access to element's storage
                                    storage = DOM.Handles.Manipulation.storage.get(element, true);
                                    if (storage !== null) {
                                        if (typeof storage[type] === "object") {
                                            if (typeof storage[type].handles !== "undefined"){
                                                if (storage[type].handles instanceof Array) {
                                                    handles = storage[type].handles;
                                                    for (var index = handles.length - 1; index >= 0; index -= 1) {
                                                        switch(waitingRemove){
                                                            case true:
                                                                if (handles[index].remove === true){
                                                                    if (storage[type].awakeProcess === false) {
                                                                        Logs.remove(handles[index].id_logs);
                                                                        handles.splice(index, 1);
                                                                    }
                                                                }
                                                                break;
                                                            case false:
                                                                if (handles[index].id === id) {
                                                                    switch (storage[type].awakeProcess) {
                                                                        case true:
                                                                            handles[index].remove = true;
                                                                            break;
                                                                        case false:
                                                                            Logs.remove(handles[index].id_logs);
                                                                            handles.splice(index, 1);
                                                                            break;
                                                                    }
                                                                }
                                                                break;
                                                        }
                                                    }
                                                    //Clear handle's record
                                                    if (handles.length === 0) {
                                                        //Remove global handle
                                                        DOM.Handles.Processing.dest(element, type);
                                                        //Delete property
                                                        storage[type] = null;
                                                        delete storage[type];
                                                        //Clear element's storage
                                                        DOM.Handles.Manipulation.storage.clear(element);
                                                    }
                                                    return true;
                                                }
                                            }
                                        }
                                    }
                                }
                                return null;
                            },
                            removeListener      : function (element, type, id, handle) {
                                var element = (HTML.Nodes.Is(element)   === true        ? element   : (element === window ? element : null)),
                                    type    = (typeof type              === "string"    ? type      : null),
                                    handle  = (typeof handle            === "function"  ? handle    : null),
                                    id      = (typeof id                === "string"    ? id        : null);
                                if (Tools.Vars.IsNotEquality([element, type, id], null) === true) {
                                    return DOM.Handles.Manipulation.remove({
                                        element : element,
                                        type    : type,
                                        id      : id,
                                        handle  : handle
                                    });
                                }
                                return false;
                            }
                        },
                        Processing: {
                            get fixedEvent(){
                                if (!event) {
                                    if (window.event) {
                                        return window.event;
                                    }
                                }
                                return null;
                            },
                            init                : function (element, type, storage) {
                                var element         = (typeof element   === "object" ? element  : null),
                                    storage         = (typeof storage   === "object" ? storage  : null),
                                    type            = (typeof type      === "string" ? type     : null),
                                    properties      = DOM.Setting.Properties,
                                    CBC             = DOM.CrossBrowserCompatibility,
                                    settings        = DOM.Setting,
                                    idCommonHandle  = null;
                                if (Tools.Vars.IsNotEquality([element, type, storage], null) === true) {
                                    if (typeof storage[type] !== "object") {
                                        //Common handle for event's type [type] isn't initilazed. 
                                        idCommonHandle  = settings.idCommonHandle;
                                        storage[type]   = {
                                            globalHandle    : function (event) {
                                                return DOM.Handles.Processing.fire.call(element, event, idCommonHandle);
                                            },
                                            globalHandleID  : idCommonHandle,
                                            handles         : [],
                                            awakeProcess    : false
                                        };
                                        //Attach global handle of events
                                        if (CBC.addListener(element, type, storage[type].globalHandle) !== true) {
                                            return null;
                                        }
                                    }
                                    return storage[type].handles;
                                }
                                return null;
                            },
                            dest                : function (element, type) {
                                var element         = (typeof element   === "object" ? element  : null),
                                    type            = (typeof type      === "string" ? type     : null),
                                    properties      = DOM.Setting.Properties,
                                    CBC             = DOM.CrossBrowserCompatibility,
                                    settings        = DOM.Setting,
                                    storage         = null;
                                if (Tools.Vars.IsNotEquality([element, type], null) === true) {
                                    storage = DOM.Handles.Manipulation.storage.get(element, true);
                                    if (storage !== null) {
                                        if (typeof storage[type] === "object") {
                                            if (typeof storage[type].globalHandle === "function") {
                                                return CBC.removeListener(element, type, storage[type].globalHandle);
                                            }
                                        }
                                    }
                                    return false;
                                }
                                return null;
                            },
                            unificationEvent    : function (event) {
                                //Унификация функций приостановки
                                function UnificationStop(event) {
                                    if (typeof event.preventDefault !== "undefined") {
                                        event.preventDefault = event.preventDefault;
                                    } else {
                                        event.preventDefault = function () { try { this.returnValue = false; } catch (e) { } };
                                    }
                                    if (typeof event.stopPropagation !== "undefined") {
                                        event.stopPropagation = event.stopPropagation;
                                    } else {
                                        event.stopPropagation = function () { try { this.cancelBubble = true; } catch (e) { } };
                                    }
                                    return event;
                                };
                                //Унификация источника события
                                function UnificationTarget(event) {
                                    if (typeof event.target === "undefined") {
                                        if (typeof event.srcElement !== "undefined") {
                                            event.target = event.srcElement;
                                        } else {
                                            event.target = null;
                                        }
                                    }
                                    if (event.target !== null) {
                                        if (typeof event.relatedTarget === "undefined") {
                                            if (typeof event.fromElement !== "undefined") {
                                                if (event.fromElement === event.target) {
                                                    event.relatedTarget = event.toElement;
                                                } else {
                                                    event.relatedTarget = event.fromElement;
                                                }
                                            } else {
                                                event.relatedTarget = null;
                                                event.fromElement = null;
                                            }
                                        }
                                    }
                                    return event;
                                };
                                //Унификация координат
                                function UnificationCoordinate(event) {
                                    if (typeof event.clientX !== "undefined") {
                                        if (typeof event.pageX === "undefined") {
                                            event._pageX = null;
                                            event._pageY = null;
                                        }
                                        if (event.pageX === null && event.clientX !== null) {
                                            var DocumentLink    = document.documentElement,
                                                BodyLink        = document.body;
                                            event._pageX = event.clientX + (DocumentLink && DocumentLink.scrollLeft || BodyLink && BodyLink.scrollLeft  || 0) - (DocumentLink.clientLeft    || 0);
                                            event._pageY = event.clientY + (DocumentLink && DocumentLink.scrollTop  || BodyLink && BodyLink.scrollTop   || 0) - (DocumentLink.clientTop     || 0);
                                        } else {
                                            event._pageX = event.pageX;
                                            event._pageY = event.pageY;
                                        }
                                    } else {
                                        event._pageX = null;
                                        event._pageY = null;
                                    }
                                    event._clientX = (typeof event.clientX !== "undefined" ? event.clientX : null);
                                    event._clientY = (typeof event.clientY !== "undefined" ? event.clientY : null);
                                    event._offsetX = (typeof event.offsetX !== "undefined" ? event.offsetX : (typeof event.layerX !== "undefined" ? event.layerX : null));
                                    event._offsetY = (typeof event.offsetY !== "undefined" ? event.offsetY : (typeof event.layerY !== "undefined" ? event.layerY : null));
                                    return event;
                                };
                                //Унификация кнопок
                                function UnificationButtons(event) {
                                    if (typeof event.which === "undefined" && typeof event.button !== "undefined") {
                                        event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
                                    }
                                    return event;
                                };
                                //Проверяем было ли оно уже унифицировано
                                if (typeof event.UnificationFlag !== "boolean") {
                                    //Унифицируем событие
                                    event = UnificationStop         (event);
                                    event = UnificationTarget       (event);
                                    event = UnificationCoordinate   (event);
                                    event = UnificationButtons      (event);
                                    //Отмечаем как унифицированное
                                    event.UnificationFlag = true;
                                }
                                return event;
                            },
                            fire                : function (event, idCommonHandle) {
                                function getMessage(e) {
                                    var message= e.name + ": " + e.message + "\r\n--------------------------------------------";
                                    for (var property in e) {
                                        if (property !== "name" && property !== "message") {
                                            message = message + "\r\n  " + property + "=" + e[property];
                                        }
                                    }
                                    return message;
                                };
                                var processing      = DOM.Handles.Processing,
                                    manipulation    = DOM.Handles.Manipulation,
                                    event           = (typeof event             === "undefined" ? processing.fixedEvent : event),
                                    idCommonHandle  = (typeof idCommonHandle    === "string"    ? idCommonHandle        : null),
                                    stamp           = Tools.IDs.UIN(6),
                                    storage         = null,
                                    handles         = null,
                                    handleResult    = null,
                                    selfRemove      = false;
                                if (event !== null && idCommonHandle !== null) {
                                    //Unification event
                                    event   = processing.unificationEvent(event);
                                    //Get access to element's storage
                                    storage = manipulation.storage.get(this, true);
                                    if (storage !== null) {
                                        if (typeof storage[event.type] !== "undefined") {
                                            if (typeof storage[event.type].globalHandle !== "function"      ) { return false; }
                                            if (typeof storage[event.type].handles      === "undefined"     ) { return false; }
                                            if (storage[event.type].globalHandleID      !== idCommonHandle  ) { return false; }
                                            //Get event's handles
                                            handles                             = storage[event.type].handles;
                                            if (handles instanceof Array) {
                                                storage[event.type].awakeProcess = true;
                                                for (var index = handles.length - 1; index >= 0; index -= 1) {
                                                    if (manipulation.validateEventRecord(handles[index]) === true) {
                                                        if (handles[index].remove === false) {
                                                            if (handles[index].stamp !== stamp) {
                                                                //Set stamp to avoid restarting 
                                                                handles[index].stamp = stamp;
                                                                try {
                                                                    handleResult = null;
                                                                    handleResult = handles[index].handle.call(this, event);
                                                                    Logs.launch(handles[index].id_logs);
                                                                } catch (e) {
                                                                    Logs.message("error", "Error in DOM.Processing.fire: \r\n" + getMessage(e));
                                                                }
                                                                selfRemove = (handles[index].remove     === true ? true : selfRemove);
                                                                selfRemove = (handles[index].onetimerun === true ? true : selfRemove);
                                                                if (handleResult === false) {
                                                                    event.preventDefault();
                                                                    event.stopPropagation();
                                                                    Logs.message("warning", "Break event in DOM.Processing.fire: " + idCommonHandle);
                                                                    break;
                                                                }
                                                            } else {
                                                                Logs.message("error", "Bad event's stamp in DOM.Processing.fire: " + idCommonHandle);
                                                            }
                                                        }
                                                    }
                                                }
                                                storage[event.type].awakeProcess = false;
                                                //Apply removeing if it's neccesary
                                                if (selfRemove === true) {
                                                    for (var index = handles.length - 1; index >= 0; index -= 1) {
                                                        if (handles[index].remove === true) {
                                                            manipulation.remove({
                                                                id              : handles[index].id,
                                                                element         : this,
                                                                type            : event.type,
                                                            });
                                                        }
                                                    }
                                                }
                                                return true;
                                            }
                                        }
                                    }
                                }
                                return false;
                            }
                        }
                    },
                    Methods: {
                        isAvailable     : function (eventName, tagName, doEmulation) {
                            function emulationEvent(eventName, tagName) {
                                var tempElement = document.createElement(tagName);
                                document.body.appendChild(tempElement);
                                DOM.CrossBrowserCompatibility.addListener(tempElement, eventName, function () {
                                    DOM.Methods.isAvailable["resultOfEmulation"] = true;
                                });
                                //Call event
                                publicDOM.Call(tempElement, eventName);
                                //Clear after ourself
                                document.body.removeChild(tempElement);
                            };
                            var prefixes    = ["", "webkit", "o", "ms", "moz"],
                                index       = -1,
                                maxIndex    = prefixes.length,
                                vendor      = null,
                                eventName   = (typeof eventName     === "string"    ? eventName    : null   ),
                                tagName     = (typeof tagName       === "string"    ? tagName      : "DIV"  ),
                                doEmulation = (typeof doEmulation   === "boolean"   ? doEmulation   : true  );
                            if (eventName !== null) {
                                //Check properties
                                while ((index += 1) < maxIndex) {
                                    vendor = prefixes[index];
                                    if (("on" + vendor + eventName) in window                   || (vendor + eventName) in window ||
                                        ("on" + vendor + eventName) in document.documentElement || (vendor + eventName) in document.documentElement) {
                                        return true;
                                    }
                                }
                                if (doEmulation === true) {
                                    //If have no results - emulate event
                                    index = -1;
                                    DOM.Methods.isAvailable["resultOfEmulation"] = false;
                                    while ((index += 1) < maxIndex) {
                                        vendor = prefixes[index];
                                        if (DOM.Methods.isAvailable["resultOfEmulation"] !== true) {
                                            emulationEvent(vendor + eventName, tagName);
                                        }
                                    }
                                    return DOM.Methods.isAvailable["resultOfEmulation"];
                                }
                            }
                            return false;
                        },
                        call            : function (element, type) {
                            var element     = (HTML.Nodes.Is(element)   === true        ? element   : null),
                                type        = (typeof type              === "string"    ? type      : null),
                                calledEvent = null;
                            if (element !== null && type !== null) {
                                try {
                                    if (document.createEvent) {
                                        calledEvent = document.createEvent("HTMLEvents");
                                        calledEvent.initEvent(type, true, true);
                                    } else if (document.createEventObject) {
                                        calledEvent = document.createEventObject();
                                        calledEvent.eventType = type;
                                    }
                                    calledEvent.eventName   = type;
                                    if (document.createEvent) {
                                        element.dispatchEvent(calledEvent);
                                    } else {
                                        element.fireEvent("on" + calledEvent.eventType, calledEvent);
                                    }
                                    Logs.message("warning", "Was called event [" + type + "].");
                                } catch (e) {
                                    Logs.message("error", "Try call [" + type + "]. Error in DOM.Processing.call: " + e.message);
                                    return false;
                                }
                                return true;
                            }
                            return false;
                        },
                    }
                };
                //CSS's events
                CSS = {
                    //Controll animation's events
                    Animation : {
                        config      :{
                            eventIDPropertyPrefix: "PurityAnimationEvent_ID_",
                            get id() {
                                if (typeof CSS.Animation.config.currentID === "undefined") {
                                    CSS.Animation.config.currentID = -1;
                                }
                                CSS.Animation.config.currentID += 1;
                                return CSS.Animation.config.eventIDPropertyPrefix + CSS.Animation.config.currentID;
                            }
                        },
                        //Names of events via browsers
                        eventData   : [ { Platform: "W3C",      Prefix : "",        Events: { start: "animationstart",       iteration: "animationiteration",        end: "animationend"        } },
                                        { Platform: "firefox",  Prefix: "Moz",      Events: { start: "animationstart",       iteration: "animationiteration",        end: "animationend"        } },
                                        { Platform: "webkit",   Prefix: "Webkit",   Events: { start: "webkitAnimationStart", iteration: "webkitAnimationIteration",  end: "webkitAnimationEnd"  } },
                                        { Platform: "opera",    Prefix: "O",        Events: { start: "oanimationstart",      iteration: "oanimationiteration",       end: "oanimationend"       } },
                                        { Platform: "IE10",     Prefix: "ms",       Events: { start: "MSAnimationStart",     iteration: "MSAnimationIteration",      end: "MSAnimationEnd"      } }],
                        //Get basic information about names of animation's events
                        init        : function () {
                            var tempDOMElement  = document.createElement("DIV"),
                                resultPrefix    = "",
                                animationString = "animation",
                                events          = null,
                                propertyName    = "AnimationName",
                                platform        = "";
                            if (CSS.Animation.eventData instanceof Array) {
                                if (typeof tempDOMElement.style.animationName === "undefined") {
                                    for (var index = CSS.Animation.eventData.length - 1; index >= 0; index -= 1) {
                                        if (typeof tempDOMElement.style[CSS.Animation.eventData[index]["Prefix"] + propertyName] !== "undefined") {
                                            resultPrefix    = CSS.Animation.eventData[index]["Prefix"].toLowerCase();
                                            animationString = resultPrefix + "Animation";
                                            events          = CSS.Animation.eventData[index]["Events"];
                                            platform        = CSS.Animation.eventData[index]["Platform"];
                                            break;
                                        }
                                    }
                                } else {
                                    for (var index = CSS.Animation.eventData.length - 1; index >= 0; index -= 1) {
                                        if (CSS.Animation.eventData[index]["Platform"].toLowerCase() === "w3c") {
                                            events      = CSS.Animation.eventData[index]["Events"];
                                            platform    = CSS.Animation.eventData[index]["Platform"];
                                            break;
                                        }
                                    }
                                }
                                CSS.Animation.eventData = {
                                    animationString : animationString,
                                    prefix          : resultPrefix,
                                    events          : events,
                                    platform        : platform
                                };
                            }
                        },
                        attach      : function (element, eventType, handle, onceRun) {
                            var element         = (HTML.Nodes.Is(element)   === true        ? element   : null  ),
                                handle          = (typeof handle            === "function"  ? handle    : null  ),
                                eventType       = (typeof eventType         === "string"    ? eventType : null  ),
                                onceRun         = (typeof onceRun           === "boolean"   ? onceRun   : false ),
                                eventData       = CSS.Animation.eventData,
                                id              = CSS.Animation.config.id;
                            if (Tools.Vars.IsNotEquality([element, handle, eventType], null) === true) {
                                //Check type of event
                                if (typeof eventData["events"][eventType] !== "undefined") {
                                    //Set event
                                    publicDOM.Add({
                                        element     : element,
                                        type        : eventData["events"][eventType],
                                        handle      : function () {
                                            return CSS.Animation.processing(element, eventType, id, handle, onceRun);
                                        },
                                        id          : id,
                                        onetimerun  : onceRun
                                    });
                                    return true;
                                } else {
                                    Logs.message("warning", "Events's type (" + eventType + ") is unknown. Avalible types: " + Object.keys(eventData["events"]));
                                }
                            }
                            return false;
                        },
                        remove      : function (element, eventType, id) {
                            var element         = (HTML.Nodes.Is(element)   === true        ? element   : null  ),
                                eventType       = (typeof eventType         === "string"    ? eventType : null  ),
                                id              = (typeof id                === "string"    ? id        : null),
                                eventData       = CSS.Animation.eventData;
                            if (Tools.Vars.IsNotEquality([element, eventType, id], null) === true) {
                                //Check type of event
                                if (typeof eventData["events"][eventType] !== "undefined") {
                                    //Remove event
                                    publicDOM.Remove({
                                        element : element,
                                        type    : eventData["events"][eventType],
                                        id      : id
                                    });
                                    return true;
                                } else {
                                    Logs.message("warning", "Events's type (" + eventType + ") is unknown. Avalible types: " + Object.keys(eventData["events"]));
                                }
                            }
                            return false;
                        },
                        processing  : function (element, eventType, id, handle, onceRun) {
                            var element         = (HTML.Nodes.Is(element)   === true        ? element   : null),
                                eventType       = (typeof eventType         === "string"    ? eventType : null),
                                id              = (typeof id                === "string"    ? id        : null),
                                handle          = (typeof handle            === "function"  ? handle    : null),
                                onceRun         = (typeof onceRun           === "boolean"   ? onceRun   : null);
                            if (Tools.Vars.IsNotEquality([element, eventType, id, handle, onceRun], null) === true) {
                                Purity.System.runHandle(handle, null, "[Environment.Events][CSS.Animation.processing]", this);
                                if (onceRun === true) {
                                    CSS.Animation.remove(element, eventType, id);
                                }
                            }
                        },
                        interfaces  : {
                            attach: {
                                start       : function (element, handle, onceRun) {
                                    return CSS.Animation.attach(element, "start", handle, onceRun);
                                },
                                iteration   : function (element, handle, onceRun) {
                                    return CSS.Animation.attach(element, "iteration", handle, onceRun);
                                },
                                end         : function (element, handle, onceRun) {
                                    return CSS.Animation.attach(element, "end", handle, onceRun);
                                }
                            },
                            remove: {
                                start       : function (element) {
                                    return CSS.Animation.remove(element, "start");
                                },
                                iteration   : function (element) {
                                    return CSS.Animation.remove(element, "iteration");
                                },
                                end         : function (element) {
                                    return CSS.Animation.remove(element, "end", id);
                                }, 
                            }
                        }
                    },
                    Transition : {
                        config      : {
                            eventIDPropertyPrefix: "PurityTransitionEvent_ID_",
                            get id() {
                                if (typeof CSS.Transition.config.currentID === "undefined") {
                                    CSS.Transition.config.currentID = -1;
                                }
                                CSS.Transition.config.currentID += 1;
                                return CSS.Transition.config.eventIDPropertyPrefix + CSS.Transition.config.currentID;
                            }
                        },
                        eventData   : [ { Platform: "W3C",      Prefix: "",         Events: { end: "transitionend"          } },
                                        { Platform: "firefox",  Prefix: "Moz",      Events: { end: "transitionend"          } },
                                        { Platform: "webkit",   Prefix: "Webkit",   Events: { end: "webkitTransitionEnd"    } },
                                        { Platform: "opera",    Prefix: "O",        Events: { end: "oTransitionEnd "        } },
                                        { Platform: "IE10",     Prefix: "ms",       Events: { end: "transitionend"          } }],
                        isAvailable : function () {
                            return publicDOM.isAvaliable("transitionend", "DIV", true);
                        },
                        init        : function () {
                            if (CSS.Animation.eventData instanceof Array === false) {
                                if (typeof CSS.Animation.eventData["prefix"] === "string") {
                                    for (var index = CSS.Transition.eventData.length - 1; index >= 0; index -= 1) {
                                        if (CSS.Transition.eventData[index]["Prefix"].toLowerCase() === CSS.Animation.eventData["prefix"].toLowerCase()) {
                                            CSS.Transition.eventData = {
                                                prefix  : CSS.Transition.eventData[index]["Prefix"],
                                                events  : CSS.Transition.eventData[index]["Events"],
                                                platform: CSS.Transition.eventData[index]["Platform"]
                                            };
                                            if (CSS.Transition.isAvailable() === true) {
                                                CSS.Transition.isAvailable = true;
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                            CSS.Transition.eventData    = null;
                            CSS.Transition.isAvailable  = false;
                            Logs.message("warning", "Transition's events aren't avalible on this browser");
                        },
                        attach      : function (element, eventType, handle, onceRun) {
                            var element         = (HTML.Nodes.Is(element)   === true        ? element   : null  ),
                                handle          = (typeof handle            === "function"  ? handle    : null  ),
                                eventType       = (typeof eventType         === "string"    ? eventType : null  ),
                                onceRun         = (typeof onceRun           === "boolean"   ? onceRun   : false ),
                                eventData       = CSS.Transition.eventData,
                                id              = CSS.Transition.config.id;
                            if (Tools.Vars.IsNotEquality([element, handle, eventType], null) === true) {
                                if (CSS.Transition.isAvailable === true) {
                                    //Check type of event
                                    if (typeof eventData["events"][eventType] !== "undefined") {
                                        //Set event
                                        publicDOM.Add({
                                            element     : element,
                                            type        : eventData["events"][eventType],
                                            handle      : function () {
                                                return CSS.Transition.processing(element, eventType, id, handle, onceRun);
                                            },
                                            id          : id,
                                            onetimerun  : onceRun
                                        });
                                        return true;
                                    } else {
                                        Logs.message("warning", "Events's type (" + eventType + ") is unknown. Avalible types: " + Object.keys(eventData["events"]));
                                    }
                                } else {
                                    Logs.message("warning", "Transition's events aren't avalible on this browser");
                                }
                            }
                            return false;
                        },
                        remove      : function (element, eventType, id) {
                            var element         = (HTML.Nodes.Is(element)   === true        ? element   : null  ),
                                eventType       = (typeof eventType         === "string"    ? eventType : null  ),
                                id              = (typeof id                === "string"    ? id        : null),
                                eventData       = CSS.Transition.eventData;
                            if (Tools.Vars.IsNotEquality([element, eventType, id], null) === true) {
                                //Check type of event
                                if (typeof eventData["events"][eventType] !== "undefined") {
                                    //Remove event
                                    publicDOM.Remove({
                                        element : element,
                                        type    : eventData["events"][eventType],
                                        id      : id
                                    });
                                    return true;
                                } else {
                                    Logs.message("warning", "Events's type (" + eventType + ") is unknown. Avalible types: " + Object.keys(eventData["events"]));
                                }
                            }
                            return false;
                        },
                        processing  : function (element, eventType, id, handle, onceRun) {
                            var element         = (HTML.Nodes.Is(element)   === true        ? element   : null),
                                eventType       = (typeof eventType         === "string"    ? eventType : null),
                                id              = (typeof id                === "string"    ? id        : null),
                                handle          = (typeof handle            === "function"  ? handle    : null),
                                onceRun         = (typeof onceRun           === "boolean"   ? onceRun   : null);
                            if (Tools.Vars.IsNotEquality([element, eventType, id, handle, onceRun], null) === true) {
                                Purity.System.runHandle(handle, null, "[Environment.Events][CSS.Transition.processing]", this);
                                if (onceRun === true) {
                                    CSS.Transition.remove(element, eventType, id);
                                }
                            }
                        },
                        interfaces  : {
                            attach: {
                                end: function (element, handle, onceRun) {
                                    return CSS.Transition.attach(element, "end", handle, onceRun);
                                }
                            },
                            remove: {
                                end: function (element) {
                                    return CSS.Transition.remove(element, "end", id);
                                }
                            }
                        }
                    },
                    init : function(){
                        CSS.Animation.  init();
                        CSS.Transition. init();//It can be called only after CSS.Animation.init()
                    }
                };
                //Only window's events
                Window = {
                    Config: {
                        CommonHandlesID: "PurityCommonWindowHandle"
                    },
                    Data: {
                        //Стек всех обработчиков
                        handles: {}
                    },
                    //Инициализация блока
                    init        : function (TypeEvent) {
                        var handles = Window.Data.handles;
                        if (handles === null) {
                            handles = {};
                        }
                        if (typeof handles[TypeEvent] === "undefined") {
                            handles[TypeEvent] = [];
                            publicDOM.Add({
                                element : window,
                                type    : TypeEvent,
                                handle  : Window.processing,
                                id      : Window.Config.CommonHandlesID + TypeEvent
                            });
                        }
                    },
                    //Очистка обработчика, если он пуст
                    clear       : function (TypeEvent) {
                        var handles = Window.Data.handles;
                        if (handles !== null) {
                            if (typeof handles[TypeEvent] !== "undefined") {
                                if (handles[TypeEvent].length === 0) {
                                    handles[TypeEvent] = null;
                                    handles = Tools.Object.Attribute.Remove(handles, TypeEvent);
                                    publicDOM.Remove({
                                        element : window,
                                        type    : TypeEvent,
                                        id      : Window.Config.CommonHandlesID + TypeEvent
                                    });
                                }
                            }
                            if (Object.keys(handles).length === 0) {
                                handles = {};
                            }
                        }
                    },
                    //Удаление обработчика
                    remove      : function (TypeEvent, IDEventHandle) {
                        var handles = Window.Data.handles;
                        if ((typeof IDEventHandle === "number" || typeof IDEventHandle === "string") && typeof TypeEvent === "string") {
                            if (typeof handles[TypeEvent] !== "undefined") {
                                for (var Index = handles[TypeEvent].length - 1; Index >= 0; Index -= 1) {
                                    if (handles[TypeEvent][Index].id === IDEventHandle) {
                                        handles[TypeEvent].splice(Index, 1);
                                        Window.clear(TypeEvent);
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    },
                    //Добавляет обработчик
                    add         : function (TypeEvent, AddedHandle, IDEventHandle) {
                        var handles         = Window.Data.handles,
                            IDEventHandle   = (typeof IDEventHandle === "string" ? IDEventHandle : null);
                        if (typeof AddedHandle === "function" && typeof TypeEvent === "string") {
                            if (IDEventHandle === null) {
                                //ID события не определено, то есть удаляться будет только автоматически и больше никак
                                IDEventHandle = "automatic delete";
                            }
                            Window.init(TypeEvent);
                            handles[TypeEvent].push({
                                handle  : AddedHandle,
                                id      : IDEventHandle
                            });
                        }
                    },
                    //Проверяет установлен ли обработчик с указанным ID
                    isHandleSet : function (IDEventHandle) {
                        var handles = Window.Data.handles;
                        if (typeof IDEventHandle === "number" || typeof IDEventHandle === "string") {
                            if (handles !== null) {
                                for (var EventTypeKey in handles) {
                                    for (var Index = handles[EventTypeKey].length - 1; Index >= 0; Index -= 1) {
                                        if (handles[EventTypeKey][Index].id === IDEventHandle) {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                        return false;
                    },
                    //Общий обработчик событий
                    processing  : function (event) {
                        function RunMethod(MethodLink, event) {
                            var ResultOperation = null;
                            try {
                                ResultOperation = MethodLink(event);
                                if (ResultOperation !== true && ResultOperation !== false) {
                                    ResultOperation = false;
                                }
                                return ResultOperation;
                            } catch (e) {
                                Logs.message("error", "Window.processing: " + e.message);
                                return false;
                            }
                        };
                        var handles = Window.Data.handles;
                        if (typeof event !== "undefined") {
                            try{
                                //Унифицируем объект события
                                event = DOM.Handles.Processing.unificationEvent(event);
                                for (var Index = 0, MaxIndex = handles[event.type].length; Index < MaxIndex; Index += 1) {
                                    if (typeof handles[event.type][Index] === "object") {
                                        if (typeof handles[event.type][Index].handle === "function") {
                                            if (RunMethod(handles[event.type][Index].handle, event) === false) {
                                                handles[event.type][Index] = null;
                                                handles[event.type].splice(Index, 1);
                                            }
                                        } else {
                                            Logs.message("warning", " Window.processing: cannot find handle.");
                                        }
                                    } else {
                                        Logs.message("warning", " Window.processing: cannot find object by event type.");
                                    }
                                }
                            } catch (e) {
                                Logs.message("error", "Error in Window.processing: " + e.message);
                            }
                        }
                        Window.clear(event.type);
                    }
                };
                //Logs
                Logs = {
                    message : function (typeMessage, strMessage) {
                        if (Tools.Vars.IsType([strMessage, typeMessage], "string") === true) {
                            typeMessage = typeMessage.toLowerCase();
                            switch (typeMessage) {
                                case "error":
                                    if (Config.ShowErrors === true) {
                                        Tools.Log.console.message({ message: moduleName + "::: [" + typeMessage + "]: ", details: strMessage });
                                    }
                                    break;
                                case "warning":
                                    if (Config.ShowWarning === true) {
                                        Tools.Log.console.message({ message: moduleName + "::: [" + typeMessage + "]: ", details: strMessage });
                                    }
                                    break;
                            }
                        }
                    },
                    register: function (id, type) {
                        if (Config.ShowEvents === true) {
                            return Tools.Log.events.register({ name: "[" + type + "] id: [" + id + "]" });
                        }
                        return null;
                    },
                    launch  : function (id) {
                        if (Config.ShowEvents === true) {
                            return Tools.Log.events.launch(id);
                        }
                        return null;
                    },
                    remove  : function (id) {
                        if (Config.ShowEvents === true) {
                            return Tools.Log.events.remove(id);
                        }
                        return null;
                    },
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicDOM = {
                    Add             : DOM.Handles.Manipulation.add,
                    AddListener     : DOM.Handles.Manipulation.addListener,
                    Remove          : DOM.Handles.Manipulation.remove,
                    RemoveListener  : DOM.Handles.Manipulation.removeListener,
                    Call            : DOM.Methods.call,
                    isAvaliable     : DOM.Methods.isAvailable
                };
                publicWindow = {
                    Add     : Window.add,
                    Remove  : Window.remove,
                    IsSet   : Window.isHandleSet
                };
                publicCSS = {
                    Animation : CSS.Animation.interfaces,
                    Transition: CSS.Transition.interfaces
                };
                //---< Security part	>--[end]---------------------------------------------------------------------------------------
                //---< Init part	    >--[begin]---------------------------------------------------------------------------------------
                DOM.CrossBrowserCompatibility.init();
                CSS.init();
                //---< Init part	    >--[end]---------------------------------------------------------------------------------------
                return {
                    //---< Public part		>--[begin]---------------------------------------------------------------------------------------
                    AboutModule : {
                        getName         : function () { return name;        },
                        getVersion      : function () { return version;     },
                        getLastUpdate   : function () { return lastUpdate;  },
                        getAuthor       : function () { return author;      }
                    },
                    //---< Public part		>--[end]---------------------------------------------------------------------------------------
                    DOM         : publicDOM,
                    Window      : publicWindow,
                    CSS         : publicCSS
                }
            },
            //Init function
            function () {
            }
        );
    }
}());