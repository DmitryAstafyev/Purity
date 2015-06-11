/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Connections.JSIC.js" />
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/*
<summary></summary>     <summary locid="descriptionID">description</summary>
<var></var>             <var type="ValueType" integer="true|false" domElement="true|false" mayBeNull="true|false" elementType="ArrayElementType" elementInteger="true|false" elementDomElement="true|false" elementMayBeNull="true|false" helpKeyword="keyword" locid="descriptionID">description</var> 
<field></field>         <field name="fieldName" static="true|false" type="FieldType" integer="true|false" domElement="true|false" mayBeNull="true|false" elementType="ArrayElementType" elementInteger="true|false" elementDomElement="true|false" elementMayBeNull="true|false" helpKeyword="keyword" locid="descriptionID" value="code">description</field>
<param></param>         <param name="a" type="Number">A number.</param>
<returns></returns>     <returns type="ValueType" integer="true|false" domElement="true|false" mayBeNull="true|false" elementType="ArrayElementType" elementInteger="true|false" elementDomElement="true|false" elementMayBeNull="true|false" locid="descriptionID" value="code">description</returns>
<signature></signature>
*/
/// <summary>Purity.Initializer controls initialization procedure of all modules of Purity.</summary>
(function () {
    "use strict";
    if (typeof Purity === "undefined") {
        //Портотип Purity. Делаем его локальным, так как в глобальном пространстве имен ему делать нечего.
        var PurityPrototype         = function () { };
        //Prototype библитеки Purity
        PurityPrototype.prototype   = (function () {
            /// <summary>Discription of library</summary>
            var name                        = "Purity::: web tools",
                version                     = "1.31",
                author                      = "Dmitry Astafyev",
            //Declaration module's blocks
                ModulesStorage              = {},
                Loader                      = {},
                Prototypes                  = {},
                Builder                     = {},
                Make                        = {},
                System                      = {},
                Logs                        = {},
                Resource                    = {},
                publicSystem                = {},
                publicPrototypes            = {},
                publicResource              = {},
                publicStarter               = null,
                publicAttachVisualization   = null,
                initModule                  = null,
                createModule                = null,
                isModuleCreated             = null;
            //---< Private part		>--[begin]---------------------------------------------------------------------------------------
            //Системный блок
            System = {
                //События
                Events: {
                    //Универсальные методы по добавлению/удалению событий
                    addListener     : null,
                    removeListener  : null,
                    //Инициализация методов
                    init: function () {
                        if (typeof window.addEventListener === "function") {
                            System.Events.addListener       = function (element, eventName, handle) {
                                if (typeof element !== "undefined" && typeof eventName === "string" && typeof handle !== "undefined") {
                                    if (element !== null && handle !== null) {
                                        element.addEventListener(eventName, handle, false);
                                    }
                                }
                            };
                            System.Events.removeListener    = function (element, eventName, handle) {
                                if (typeof element !== "undefined" && typeof eventName === "string" && typeof handle !== "undefined") {
                                    if (element !== null && handle !== null) {
                                        element.removeEventListener(eventName, handle, false);
                                    }
                                }
                            };
                        } else if (typeof document.attachEvent === "function") {
                            System.Events.addListener       = function (element, eventName, handle) {
                                if (typeof element !== "undefined" && typeof eventName === "string" && typeof handle !== "undefined") {
                                    if (element !== null && handle !== null) {
                                        element.attachEvent(("on" + eventName), handle);
                                    }
                                }
                            };
                            System.Events.removeListener    = function (element, eventName, handle) {
                                if (typeof element !== "undefined" && typeof eventName === "string" && typeof handle !== "undefined") {
                                    if (element !== null && handle !== null) {
                                        element.detachEvent(("on" + eventName), handle);
                                    }
                                }
                            };
                        } else {
                            System.Events.addListener       = function (element, eventName, handle) {
                                if (typeof element !== "undefined" && typeof eventName === "string" && typeof handle !== "undefined") {
                                    if (element !== null && handle !== null) {
                                        element[("on" + eventName)] = handle;
                                    }
                                }
                            };
                            System.Events.removeListener    = function (element, eventName, handle) {
                                if (typeof element !== "undefined" && typeof eventName === "string" && typeof handle !== "undefined") {
                                    if (element !== null && handle !== null) {
                                        element[("on" + eventName)] = null;
                                    }
                                }
                            };
                        };
                    },
                },
                //Внешние запросы
                Ajax : {
                    //Общие настройки блока
                    Config: {
                        timeOut: 10000//ms
                    },
                    //Блок, отвечающий за события
                    Events: {
                        //установка событий
                        set: function (httpRequest, idRequest, onReaction) {
                            if (httpRequest && idRequest) {
                                System.Events.addListener(httpRequest, "readystatechange",  function (Event) { System.Ajax.Processing.receive(Event, idRequest, onReaction); });
                                System.Events.addListener(httpRequest, "timeout",           function (Event) { System.Ajax.Processing.timeOut(Event, idRequest, onReaction); });
                                return httpRequest;
                            }
                            return null;
                        }
                    },
                    Processing: {
                        //Отслеживает корректность подключений. Вводит свой собственный timeout
                        Tracking : {
                            Data    : {
                                countRequests   : 0,
                                requests        : []
                            },
                            Methods : {
                                index   : function(idTracking){
                                    var tracking = System.Ajax.Processing.Tracking;
                                    if (idTracking){
                                        for (var Index = 0, MaxIndex = tracking.Data.requests.length; Index < MaxIndex; Index += 1) {
                                            if (tracking.Data.requests[Index].id === idTracking) {
                                                return Index;
                                            }
                                        }
                                    }
                                    return -1;
                                },
                                add     : function (onReceive, onError, onTimeout, forcedTimeout) {
                                    var tracking        = System.Ajax.Processing.Tracking,
                                        trackingRecord  = {};
                                    tracking.Data.countRequests += 1;
                                    trackingRecord.onReceive    = (typeof onReceive === "function" ? onReceive  : null);
                                    trackingRecord.onError      = (typeof onError   === "function" ? onError    : null);
                                    trackingRecord.onTimeout    = (typeof onTimeout === "function" ? onTimeout  : null);
                                    trackingRecord.id           = tracking.Data.countRequests;
                                    trackingRecord.errorFlag    = false;
                                    tracking.Data.requests.push(trackingRecord);
                                    window.setTimeout(function () { tracking.Methods.timeout(trackingRecord.id); }, forcedTimeout);
                                    return trackingRecord.id;
                                },
                                remove  : function (idTracking, indexTracking) {
                                    var tracking        = System.Ajax.Processing.Tracking,
                                        indexTracking   = (typeof indexTracking !== "number" ? tracking.Methods.index(idTracking) : indexTracking);
                                    if (indexTracking !== -1) {
                                        tracking.Data.requests.splice(indexTracking, 1);
                                        return true;
                                    }
                                    return false;
                                },
                                timeout : function (idTracking) {
                                    var tracking        = System.Ajax.Processing.Tracking,
                                        indexTracking   = tracking.Methods.index(idTracking),
                                        run             = System.runFunction;
                                    if (indexTracking !== -1) {
                                        if (tracking.Data.requests[indexTracking].errorFlag === false) {
                                            run(tracking.Data.requests[indexTracking].onTimeout);
                                        } else {
                                            run(tracking.Data.requests[indexTracking].onError);
                                        }
                                        tracking.Methods.remove(tracking.Data.requests[indexTracking].id, indexTracking);
                                    }
                                },
                                get     : function(idTracking){
                                    var tracking        = System.Ajax.Processing.Tracking,
                                        indexTracking   = tracking.Methods.index(idTracking);
                                    if (indexTracking !== -1) {
                                        return tracking.Data.requests[indexTracking];
                                    }
                                    return null;
                                }
                            }
                        },
                        //Подготовка и отправка запроса
                        send    : function (params) {
                            ///     <summary>Send asyn request by defined URL. [value] - default value.</summary>
                            ///     <param name="params" type="Object">
                            ///         {type           : string,               &#13;&#10;
                            ///          url            : string,               &#13;&#10;                  
                            ///          request        : string,               &#13;&#10;               
                            ///          onrecieve      : function,     [null]  &#13;&#10;              
                            ///          onreaction     : function,     [null]  &#13;&#10;              
                            ///          onerror        : function,     [null]  &#13;&#10;               
                            ///          ontimeout      : function,     [null]  &#13;&#10; 
                            ///          forcedtimeout  : number (ms)   [20000] &#13;&#10;                           
                            ///         }
                            ///     </param>reaction
                            ///     <returns type="boolean" mayBeNull="true">Null - if error. True - if is OK.</returns>
                            var httpRequest     = null,
                                enquiries       = System.Ajax,
                                idRequest       = null,
                                run             = System.runFunction,
                                typeRequest     = (typeof params["type"]            === "string"    ? params["type"]            : null),
                                urlRequest      = (typeof params["url"]             === "string"    ? params["url"]             : null),
                                requestString   = (typeof params["request"]         === "string"    ? params["request"]         : null),
                                onReceive       = (typeof params["onrecieve"]       === "function"  ? params["onrecieve"]       : null),
                                onReaction      = (typeof params["onreaction"]      === "function"  ? params["onreaction"]      : null),
                                onError         = (typeof params["onerror"]         === "function"  ? params["onerror"]         : null),
                                onTimeout       = (typeof params["ontimeout"]       === "function"  ? params["ontimeout"]       : null),
                                forcedTimeout   = (typeof params["forcedtimeout"]   === "number"    ? params["forcedtimeout"]   : enquiries.Config.timeOut);
                            if (typeRequest !== null && urlRequest !== null && typeof requestString !== null) {
                                try{
                                    //Генерируем объект подключения
                                    httpRequest     = new XMLHttpRequest();
                                    //Ставим свой timeout
                                    idRequest       = enquiries.Processing.Tracking.Methods.add(onReceive, onError, onTimeout, forcedTimeout);
                                    //Устанавливаем обработчики
                                    httpRequest     = enquiries.Events.set(httpRequest, idRequest, onReaction);
                                    if (httpRequest !== null) {
                                        //Подготавливаем запрос
                                        httpRequest.open(typeRequest, urlRequest, true);
                                        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                        //Отправляем запрос
                                        httpRequest.send(requestString);
                                        return true;
                                    } else {
                                        run(onError, null);
                                        tracking.Methods.remove(idRequest);
                                    }
                                } catch (e) {
                                    run(onError, e);
                                    tracking.Methods.remove(idRequest);
                                }
                            }
                            return null;
                        },
                        //Подтверждение о получении
                        receive : function (Event, idRequest, onReaction) {
                            var trackingRecord  = null,
                                tracking        = System.Ajax.Processing.Tracking,
                                run             = System.runFunction;
                            if (Event) {
                                System.runHandle(onReaction, Event, "System.Ajax.Processing.receive", this);
                                if (Event.target) {
                                    if (Event.target.readyState === 4) {
                                        if (idRequest) {
                                            trackingRecord = tracking.Methods.get(idRequest);
                                            if (trackingRecord !== null) {
                                                if (Event.target.status === 200) {
                                                    if (trackingRecord !== null) {
                                                        run(trackingRecord.onReceive, Event.target.responseText);
                                                        tracking.Methods.remove(idRequest);
                                                    }
                                                } else {
                                                    trackingRecord.errorFlag = true;
                                                }
                                            } 
                                        }
                                    } 
                                }
                            }
                        },
                        //Таймаут
                        timeOut : function (Event, idRequest, onReaction) {
                            var trackingRecord  = null,
                                tracking        = System.Ajax.Processing.Tracking,
                                run             = System.runFunction;
                            if (Event) {
                                if (Event.target) {
                                    if (idRequest) {
                                        trackingRecord = tracking.Methods.get(idRequest);
                                        if (trackingRecord !== null) {
                                            run(trackingRecord.onError);
                                            tracking.Methods.remove(idRequest);
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                //Работа с хранилищем
                Storage: {
                    //Способы сохранения данных
                    Means: {
                        //Работа с объектом localStorage
                        LocalStorage: {
                            //Достает из хранилища значение указанного ключа
                            getValue: function (keyValue) {
                                var value = null;
                                try {
                                    value = window.localStorage.getItem(keyValue);
                                    if (typeof value !== "string") {
                                        value = null;
                                    }
                                    return value;
                                } catch (e) {
                                    return null;
                                }
                            },
                            //Сохраняет указанное значение ключа
                            setValue: function (keyValue, value) {
                                var result_value = null;
                                try {
                                    window.localStorage.removeItem(keyValue);
                                    window.localStorage.setItem(keyValue, value);
                                    return true;
                                } catch (e) {
                                    return false;
                                }
                            },
                        }
                    },
                    Controls: {
                        getValue: null,
                        setValue: null,
                        init    : function () {
                            System.Storage.Controls.getValue = System.Storage.Means.LocalStorage.getValue;
                            System.Storage.Controls.setValue = System.Storage.Means.LocalStorage.setValue;
                        }
                    }
                },
                //Конвертор BASE64
                Convertor: {
                    UTF8: {
                        encode: function (s) {
                            return unescape(encodeURIComponent(s));
                        },
                        decode: function (s) {
                            return decodeURIComponent(escape(s));
                        }
                    },
                    BASE64: {
                        decode: function (s) {
                            var e = {}, i, k, v = [], r = "", w = String.fromCharCode, z,
                                n = [[65, 91], [97, 123], [48, 58], [43, 44], [47, 48]],
                                b = 0, c, x, l = 0, o = 0, char, num;
                            for (z in n) { for (i = n[z][0]; i < n[z][1]; i++) { v.push(w(i)); } }
                            for (i = 0; i < 64; i++) { e[v[i]] = i; }
                            if (s.length < 100) {
                                var stop = true;
                            }
                            for (i = 0; i < s.length; i += 72) {
                                o = s.substring(i, i + 72);
                                for (x = 0; x < o.length; x++) {
                                    c = e[o.charAt(x)]; b = (b << 6) + c; l += 6;
                                    while (l >= 8) {
                                        char    = w((b >>> (l -= 8)) % 256);
                                        num     = char.charCodeAt(0);
                                        r       = (num !== 0 ? r + char : r);
                                    }
                                }
                            }
                            return r;
                        },
                        encode: function (s) {
                            var b64     = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                                o1, o2, o3, h1, h2, h3, h4, r, bits, i = 0,
                                ac      = 0,
                                enc     = "",
                                tmp_arr = [];
                            if (!s) {
                                return s;
                            }
                            do { // pack three octets into four hexets
                                o1 = s.charCodeAt(i++);
                                o2 = s.charCodeAt(i++);
                                o3 = s.charCodeAt(i++);
                                bits = o1 << 16 | o2 << 8 | o3;
                                h1 = bits >> 18 & 0x3f;
                                h2 = bits >> 12 & 0x3f;
                                h3 = bits >> 6 & 0x3f;
                                h4 = bits & 0x3f;
                                // use hexets to index into b64, and append result to encoded string
                                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                            } while (i < s.length);
                            enc = tmp_arr.join('');
                            r   = s.length % 3;
                            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
                        }
                    }
                },
                //Запускает указанную функцию в безопасном режиме
                runFunction : function (handle, params) {
                    if (typeof handle === "function") {
                        try {
                            return handle(params);
                        } catch (e) {
                            Logs.show("Initializer runFunction method catch error: " + e, true);
                            return null;
                        }
                    }
                    return null;
                },
                runHandle   : function (handle_body, handle_arguments, call_point, this_argument) {
                    function getMessage(e) {
                        var message= e.name + ": " + e.message + "\r\n--------------------------------------------";
                        for (var property in e) {
                            if (property !== "name" && property !== "message") {
                                message = message + "\r\n  " + property + "=" + e[property];
                            }
                        }
                        return message;
                    };
                    var handle_body         = (typeof handle_body   === "function"  ? handle_body       : null),
                        handle_arguments    = (handle_arguments     !== "undefined" ? handle_arguments  : null),
                        call_point          = (typeof call_point    === "string"    ? call_point        : null),
                        this_argument       = (typeof this_argument !== "undefined" ? this_argument     : null);
                    if (handle_body !== null) {
                        try {
                            if (handle_arguments === null) {
                                return handle_body.call(this_argument);
                            } else {
                                if (typeof handle_arguments.length === "number" && typeof handle_arguments === "object") {
                                    return handle_body.apply(this_argument, handle_arguments);
                                } else {
                                    return handle_body.call(this_argument, handle_arguments);
                                }
                            }
                        } catch (e) {
                            Logs.show("Initializer runFunction method catch error: \r\n" + getMessage(e) + "\r\n Call point: " + call_point, false, true);
                            return null;
                        }
                    }
                    return null;
                },
                //Работа с ресурсами
                Resources   : {
                    Config  : {
                        Marks: {
                            attributeName   : "ConnectedBy",
                            value           : "Purity"
                        }
                    },
                    CSS     : {
                        //Подключение стиля через LINK
                        connect : function (url, onLoad, onError, doNotWaitCSS) {
                            /*К сожалению в некоторых браузерах не работает onLoad на LINK. Поэтому
                            приходится прибегать к хитрости и внедрять "тупо" картинку. Но делаем это только тогда, 
                            когда более ли менее уверены, что стандартный способ не работает. Просто и сразу вешать событие
                            на картинку не следует. Дело в том, что событие onError на картинке выскакивает раньше, чем onLoad на CSS
                            и мы можем получить страницу без активных стилей*/
                            function listenerURL(resourceCSS, url, onLoadContainer) {
                                resourceCSS.PurityInitializerTimerCSSonLoadEvent = setTimeout(function () {
                                    var tempImageTag = document.createElement("IMG");
                                    System.Events.addListener(tempImageTag, "load",
                                        function (event) {
                                            Logs.show("The handler (for LINK's onLoad) was run via IMG's tag handle [load]. Browser doesn't support onLoad for LINK.", false);
                                            onLoadContainer(event);
                                        });
                                    System.Events.addListener(tempImageTag, "error",
                                        function (event) {
                                            Logs.show("The handler (for LINK's onLoad) was run via IMG's tag handle [error]. Browser doesn't support onLoad for LINK.", false);
                                            onLoadContainer(event);
                                        });
                                    tempImageTag.src = url;
                                    if (typeof resourceCSS.PurityInitializerTimerCSSonLoadEvent !== "undefined") {
                                        resourceCSS.PurityInitializerTimerCSSonLoadEvent = null;
                                        delete resourceCSS.PurityInitializerTimerCSSonLoadEvent;
                                    }
                                }, 5000);
                                System.Events.addListener(resourceCSS, "load", function (event) {
                                    if (typeof resourceCSS.PurityInitializerTimerCSSonLoadEvent !== "undefined") {
                                        clearTimeout(resourceCSS.PurityInitializerTimerCSSonLoadEvent);
                                        resourceCSS.PurityInitializerTimerCSSonLoadEvent = null;
                                        delete resourceCSS.PurityInitializerTimerCSSonLoadEvent;
                                    }
                                    onLoadContainer(event);
                                });
                            };
                            function isStyleEmpty(target) {
                                if (target.styleSheet || target.sheet) {
                                    if (target.styleSheet) {
                                        if (target.styleSheet.cssText === "") {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    }
                                    if (target.sheet) {
                                        if (target.sheet.cssText === "") {
                                            return true;
                                        }
                                    }
                                    return false;
                                } else {
                                    return true;
                                }
                            };
                            var resourceCSS     = null,
                                onLoad          = (typeof onLoad        === "function"  ? onLoad        : null  ),
                                onError         = (typeof onError       === "function"  ? onError       : null  ),
                                url             = (typeof url           === "string"    ? url           : null  ),
                                doNotWaitCSS    = (typeof doNotWaitCSS  === "boolean"   ? doNotWaitCSS  : false ),
                                onLoadContainer = null;
                            if (url !== null) {
                                resourceCSS         = document.createElement("LINK");
                                resourceCSS.type    = "text/css";
                                resourceCSS.href    = url;
                                resourceCSS.rel     = "stylesheet";
                                resourceCSS.setAttribute(System.Resources.Config.Marks.attributeName, System.Resources.Config.Marks.value);
                                document.head.appendChild(resourceCSS);
                                if (onLoad !== null) {
                                    if (doNotWaitCSS === false) {
                                        onLoadContainer = function (event) {
                                            //Check for errors
                                            if (onError !== null) {
                                                if (typeof onError.isExecution === "undefined") {
                                                    onError.isExecution = true;
                                                    if (event) {
                                                        if (event.target) {
                                                            if (isStyleEmpty(event.target) === false) {
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                    System.runFunction(onError, event);
                                                    onLoad.isDeny = true;
                                                }
                                            }
                                            if (typeof onLoad.isExecution !== "boolean" && typeof onLoad.isDeny !== "boolean") {
                                                onLoad.isExecution = true;
                                                System.runFunction(onLoad, event);
                                            } else {
                                                Logs.show("Denied run handler (for LINK's onLoad). The handler has already been started.", false);
                                            }
                                        };
                                        listenerURL(resourceCSS, url, onLoadContainer);
                                    } else {
                                        System.runFunction(onLoad, event);
                                    }
                                }
                                if (onError !== null) {
                                    System.Events.addListener(resourceCSS, "error", function (event) {
                                        if (typeof onError.isExecution === "undefined") {
                                            onError.isExecution = true;
                                            System.runFunction(onError, event);
                                            onLoad.isDeny = true;
                                        }
                                    });
                                }
                                return true;
                            }
                            return false;
                        },
                        //Внедрение стиля в таблицу стилей (виртуальную)
                        adoption: function (cssText, documentLink) {
                            var documentLink = (typeof documentLink === "object" ? (typeof documentLink.body !== "undefined" ? documentLink : document) : document);
                            try {
                                var loaderCSS = documentLink.createElement("style");
                                loaderCSS.type = "text/css";
                                if (loaderCSS.styleSheet) {
                                    loaderCSS.styleSheet.cssText = cssText;
                                } else {
                                    loaderCSS.appendChild(documentLink.createTextNode(cssText));
                                }
                                documentLink.head.appendChild(loaderCSS);
                                return loaderCSS;
                            } catch (e) {
                                return null;
                            }
                        }
                    },
                    JS      : {
                        //Подключает скрипт через ссылку
                        connect : function (url, onLoad, onError) {
                            var resourceJS  = null,
                                onLoad      = (typeof onLoad    === "function"  ? onLoad    : null),
                                onError     = (typeof onError   === "function"  ? onError   : null),
                                url         = (typeof url       === "string"    ? url       : null);
                            if (url !== null) {
                                resourceJS      = document.createElement("SCRIPT");
                                resourceJS.type = "application/javascript";
                                resourceJS.src  = url;
                                resourceJS.setAttribute(System.Resources.Config.Marks.attributeName, System.Resources.Config.Marks.value);
                                if (onLoad !== null) {
                                    System.Events.addListener(resourceJS, "load", onLoad);
                                }
                                if (onError !== null) {
                                    System.Events.addListener(resourceJS, "error", onError);
                                }
                                //document.onerror
                                document.head.appendChild(resourceJS);
                                return resourceJS;
                            }
                            return false;
                        },
                        //Создает узел скрипта и внедряет в начало body
                        adoption: function (jsScript, onFinish) {
                            var resourceJS  = null,
                                onFinish    = (typeof onFinish  === "function"  ? onFinish  : null),
                                jsScript    = (typeof jsScript  === "string"    ? jsScript  : null);
                            if (jsScript !== null) {
                                resourceJS      = document.createElement("SCRIPT");
                                resourceJS.type = "application/javascript";
                                resourceJS.appendChild(document.createTextNode(jsScript));
                                document.body.insertBefore(resourceJS, document.body.childNodes[0]);
                                if (onFinish !== null) {
                                    System.runFunction(onFinish);
                                }
                            }
                        },
                        //Запускает указанный скритп
                        run     : function (jsScript, onFinish) {
                            var resourceJS  = null,
                                onFinish    = (typeof onFinish  === "function"  ? onFinish  : null),
                                jsScript    = (typeof jsScript  === "string"    ? jsScript  : null);
                            if (jsScript !== null) {
                                try{
                                    new Function(jsScript)();
                                    if (onFinish !== null) {
                                        System.runFunction(onFinish);
                                    }
                                    return true;
                                } catch (e) {
                                    Logs.show("Cannot init JavaScript code. Runtime error: " + e.toString(), true);
                                    //alert(e);
                                    return false;
                                }
                            }
                            return false;
                        },
                    }
                },
                //Инициализация блока
                init        : function () {
                    System.Events.          init();
                    System.Storage.Controls.init();
                    //Correction of publicSystem
                    publicSystem.Events.addListener     = System.Events.addListener;
                    publicSystem.Events.removeListener  = System.Events.removeListener;
                    //Correction storage
                    publicSystem.Storage.write          = System.Storage.Controls.setValue;
                    publicSystem.Storage.read           = System.Storage.Controls.getValue;
                }
            },
            //Загрузчик
            Loader = {
                Statistics : {
                    start               : new Date().valueOf(),
                    finish              : null,
                    duration            : null,
                    load_from_storage   : false
                },
                //Конфигуратор загрузки библиотеки
                Configurator: {
                    //Базовая конфигурация
                    data: {
                        Purity          : {
                            domain      : { value: window.location.host, type: "string" },
                            modules     : {
                                url         : { value: "/modules/get",  type: "string"  },
                                JSICPrefix  : { value: "JSIC",          type: "string"  },
                                useOnlyJSIC : { value: false,           type: "boolean" },
                                pathToJS    : { value: "/Kernel/JS",    type: "string"  },
                            },
                            resources   : {
                                url         : { value: "~/Resources/get",       type: "string" },
                                versions    : { value: "~/Resources/versions",  type: "string" },
                                basicPath   : { value: "",                      type: "string" },
                            }
                        },
                        Tasks           : {
                            modules         : {
                                list    : { value: [],          type: "object"  },
                                mode    : { value: "release",   type: "string", values: ["noconnections", "debug", "release", "release-debug"] },
                                useCache: { value: true,        type: "boolean" },
                            },
                            resources       : {
                                list                : { value: [],      type: "object"  },
                                loadAfterModules    : { value: true,    type: "boolean" },
                                versions            : { value: "",      type: "string"  },
                            },
                            compatibility   : {
                                localstorage    : { value: true,    type: "boolean" },
                                transform       : { value: true,    type: "boolean" },
                                animation       : { value: true,    type: "boolean" },
                                xmlhttprequest  : { value: true,    type: "boolean" },
                                xmlparser       : { value: false,   type: "boolean" },
                                canvas          : { value: false,   type: "boolean" }
                            }
                        },
                        Events          : {
                            onFinish: { value: null, type: "function" },
                            onError : { value: null, type: "function" },
                        },
                        Visualization   : {
                            show        : { value: true,    type: "boolean" },
                            urlExternal : { value: "",      type: "string"  },//*.js file with visualization script
                            consoleLogs : { value: true,    type: "boolean" },
                        },
                        Debug           : {
                            doNotWaitCSS                : { value: false, type: "boolean" },
                            noURLControl                : { value: false, type: "boolean" },
                            noVersionControl            : { value: false, type: "boolean" },
                            allowCommandsViaHash        : { value: false, type: "boolean" },
                            showServersResponse         : { value: false, type: "boolean" },
                            showLocalStorageStatus      : { value: false, type: "boolean" },
                            doNotCloseConsoleOnFinish   : { value: false, type: "boolean" },
                            showConsole                 : { value: false, type: "boolean" },
                            clearLocalStorage           : { value: false, type: "boolean" },
                            feedback                    : {
                                url     : { value: null, type: "string" },
                                email   : { value: null, type: "string" }
                            }
                        },
                        /*
                        /*resources: array[objects]:
                        [{  type        : "css" || "js",
                            url         : string,
                            id          : number needed for references
                            references  : array[number] isn't obligatory
                        }]
                        references - array of resources's IDs. Before such resources this resource willn't loaded
                        references - это массив IDs пользовательских ресурсов. Данный (текущий) ресурс будет загружен
                        только после того как загрузятся все модули из списка. 
                        Внимание (!). Проверки на цикличность (замкнутость) ссылок нет, посему нуно быть предельно аккуратным.
                        
                        loadResourcesAfterPurity 
                        если этот флажок в правде, то загрузка пользовательских ресурсов будет начата только после загрузки 
                        модулей Purity. Если же false, то загрузка будет начата одновремено с ресурсами Purity
                        accessToPurityModules: {
                            URLPath             : "/modules/get" add-on to URL,
                            JSICPrefix          : "JSIC" - prefix which will be added to URL if JSIC used,
                            useOnlyJSIC         : false - if true - only JSIC will be used,
                        },
                        */
                    },
                    //Проверка корректности пользовательской конфигурации
                    validate: function (developerConfigObject) {
                        function getDefault (propertyData) {
                            return propertyData.value;
                        };
                        function getProperty(propertyData, targetProperty) {
                            if (propertyData.type.indexOf(typeof targetProperty) === -1) {
                                //Тип не соответствует. Ставим то что по дефолту
                                return getDefault(propertyData);
                            } else {
                                if (typeof propertyData.values !== "undefined") {
                                    //Если заданы допустимые значения, то проверяем их
                                    if (propertyData.values.indexOf(targetProperty) === -1) {
                                        //Значение не найдено среди допустимых. Ставим то что по дефолту
                                        return getDefault(propertyData);
                                    }
                                }
                            }
                            return targetProperty;
                        };
                        function validate   (objectData, targerObject) {
                            for (var name in objectData) {
                                if (typeof objectData[name].value !== "undefined") {
                                    //Это конечное свойство, проверяем его
                                    targerObject[name] = getProperty(objectData[name], targerObject[name]);
                                } else {
                                    targerObject[name] = (typeof targerObject[name] === "undefined" ? {} : targerObject[name]);
                                    //Это группа свойств, идем на уровень глубже
                                    targerObject[name] = validate(objectData[name], targerObject[name]);
                                }
                            }
                            return targerObject;
                        };
                        //Проверяем настройки
                        developerConfigObject       = validate(Loader.Configurator.data, developerConfigObject);
                        //Заменяем
                        Loader.Configurator.data    = developerConfigObject;
                        //Проверяем хэш
                        if (Loader.Configurator.data.Debug.allowCommandsViaHash === true) {
                            if (window.location.hash.indexOf("showConsole=true") !== -1) {
                                Loader.Configurator.data.Debug.showConsole = true;
                            }
                            if (window.location.hash.indexOf("doNotCloseConsoleOnFinish=true") !== -1) {
                                Loader.Configurator.data.Debug.doNotCloseConsoleOnFinish = true;
                            }
                            if (window.location.hash.indexOf("mode=debug") !== -1) {
                                Loader.Configurator.data.Tasks.modules.mode = "debug";
                            }
                            if (window.location.hash.indexOf("mode=release") !== -1) {
                                Loader.Configurator.data.Tasks.modules.mode = "release";
                            }
                        }
                    },
                    //Инициализация настроек
                    init    : function () {
                        if (typeof purityConfigurator !== "undefined") {
                            Loader.Configurator.validate(purityConfigurator);
                            purityConfigurator = null;
                            delete window["purityConfigurator"];
                        } else {
                            Loader.Configurator.data = null;
                        }
                    }
                },
                //Начальная загрузка
                Starter: {
                    failFlag: false,
                    start   : function () {
                        if (typeof Purity !== "undefined") {
                            if (Loader.Configurator.data !== null) {
                                if (Loader.Compatibility.check(Loader.Configurator.data.Tasks.compatibility) === true) {
                                    //Apply debugger settings
                                    Loader.Debugger.apply();
                                    //Attach visualization
                                    Loader.Visualization.init();
                                    //Initialization of main transport
                                    /*Тут немного хитро все. Когда транспорт инициирован, то запускается анонимная функция, 
                                    переданная как параметр. Тем самым запускается запрос версий модуля и после только
                                    запускается Loader.Starter.process*/
                                    Loader.Resources.Modules.load.transport.config.methods.init(
                                        function () {
                                            Loader.Resources.Modules.versions.init.start(Loader.Starter.process);
                                        }
                                    );
                                } else {
                                    Loader.GlobalErrors.show("bad browser");
                                }
                            } else {
                                Loader.GlobalErrors.show("no config");
                            }
                        }
                    },
                    process : function (){
                        Loader.Resources.Modules.load.actions.get(
                            Loader.Configurator.data.Tasks.modules.list,
                            Loader.Starter.finish,
                            Loader.Starter.error,
                            null);
                        if (Loader.Configurator.data.Tasks.resources.loadAfterModules === false) {
                            Loader.Resources.External.get(Loader.Configurator.data.Tasks.resources.list);
                        }
                        //Таким обрабразом start у нас будет только один раз
                        Loader.Starter.start = function () { };
                    },
                    finish  : function () {
                        function finishIt() {
                            if (Loader.Starter.failFlag !== true) {
                                System.runFunction(Loader.Configurator.data.Events.onFinish);
                            }
                            //Таким обрабразом finish у нас будет только один раз
                            Loader.Starter.destroy();
                            return true;
                        };
                        var ExternalResourcesLoaded = Loader.Resources.External.finish,
                            visualizationMsg        = Loader.Visualization.message;
                        if (ExternalResourcesLoaded === true) {
                            //Устанавливаем статистику
                            Loader.Statistics.finish    = new Date().valueOf();
                            Loader.Statistics.duration  = (Loader.Statistics.finish - Loader.Statistics.start) / 1000;
                            if (Loader.Configurator.data.Debug.doNotCloseConsoleOnFinish === false) {
                                return finishIt();
                            } else {
                                if (Loader.Debugger.registrationCloseHandle(finishIt) === false) {
                                    return finishIt();
                                } else {
                                    visualizationMsg("Purity.Initializer::: initialization is finished.", {type : "[info]"});
                                }
                            }
                        }
                        if (ExternalResourcesLoaded !== true) {
                            visualizationMsg("Purity.Initializer::: initialization of Purity's modules is finished.");
                            visualizationMsg("Purity.Initializer::: start loading and initialization of developer's resources.");
                            Loader.Resources.External.get(Loader.Configurator.data.Tasks.resources.list);
                        }
                    },
                    error   : function (params){
                        if (Loader.Starter.failFlag !== true) {
                            Loader.Starter.failFlag = true;
                            System.runFunction(Loader.Configurator.data.Events.onError, params);
                        }
                    },
                    destroy : function () {
                        if (typeof Loader.Starter !== "undefined") {
                            Loader.Starter = null;
                            delete Loader.Starter;
                        }
                        if (typeof PurityPrototype.prototype.start !== "undefined") {
                            //Убиваем визуализацию (если она была подключена)
                            Loader.Visualization.destroy();
                            //Удаляем стартер (дабы исключить даже возможность повторно запуска)
                            PurityPrototype.prototype.start = null;
                            delete PurityPrototype.prototype.start;
                            //Удаляем интерфейс вызова визуализатора ибо нечего ему жить после загрузки
                            PurityPrototype.prototype.attachVisualization = null;
                            delete PurityPrototype.prototype.attachVisualization;
                            //Переопределям конструктор (дабы исключить возможность повторной инициализации)
                            PurityPrototype = function () {
                                return "Purity can be inited only once by session.";
                            };
                        }
                    }
                },
                //Ресурсы загрузчика
                Resources: {
                    //Создает ресурсы
                    Init: {
                        css : function (cssText) {
                            return System.Resources.CSS.adoption(cssText);
                        },
                        JS  : {
                            //Подключает скрипт через ссылку
                            connect     : function (link, onLoad, moduleName) {
                                var resourceJS          = null,
                                    onLoad              = (typeof onLoad    === "function"  ? onLoad    : null),
                                    link                = (typeof link      === "string"    ? link      : null),
                                    visualizationMsg    = Loader.Visualization.message;
                                if (link !== null) {
                                    System.Resources.JS.connect(link,
                                        function () {
                                            visualizationMsg("[" + moduleName + "]::: attached as SCRIPT's tag with SRC.");
                                            System.runFunction(onLoad, null);
                                        });
                                }
                                return null;
                            },
                            //Создает узел скрипта и внедряет в начало body
                            adoption    : function (jsScript, onFinish) {
                                System.Resources.JS.adoption(jsScript, onFinish);
                            },
                            //Запускает указанный скритп
                            run         : function (jsScript, onFinish, moduleName) {
                                System.Resources.JS.run(jsScript, onFinish);
                            },
                            //Проверка наличия дубликатов
                            hasLink     : function (link) {
                                var allScripts = null;
                                if (typeof link === "string") {
                                    allScripts = document.getElementsByTagName("SCRIPT");
                                    for (var Index = allScripts.length - 1; Index >= 0; Index -= 1) {
                                        if (allScripts[Index].src.toLowerCase() === link.toLowerCase()) {
                                            return allScripts[Index];
                                        }
                                    }
                                }
                                return null;
                            },
                            //Обобщающий метод
                            init        : function (jsScript, jsLink, modeInit, onFinish, moduleName) {
                                var jsScript            = (typeof jsScript      === "string"    ? jsScript      : null),
                                    jsLink              = (typeof jsLink        === "string"    ? jsLink        : null),
                                    modeInit            = (typeof modeInit      === "string"    ? modeInit      : null),
                                    onFinish            = (typeof onFinish      === "function"  ? onFinish      : null),
                                    moduleName          = (typeof moduleName    === "string"    ? moduleName    : null),
                                    jsInit              = Loader.Resources.Init.JS,
                                    resultChecking      = null;
                                try {
                                    if (modeInit !== null && jsLink !== null) {
                                        //Проверяем дубликат
                                        resultChecking = jsInit.hasLink(jsLink);
                                        if (resultChecking !== null) {
                                            if (onFinish !== null) {
                                                System.Events.addListener(resultChecking, "load", onFinish);
                                            }
                                        } else {
                                            switch (modeInit) {
                                                case "debug":
                                                    jsInit.connect(jsLink, onFinish, moduleName);
                                                    return true;
                                                    break;
                                                case "noconnections":
                                                    jsInit.connect(jsLink, onFinish, moduleName);
                                                    return true;
                                                    break;
                                                case "release":
                                                    if (jsScript !== null) {
                                                        jsInit.run(jsScript, onFinish, moduleName);
                                                        return true;
                                                    }
                                                    break;
                                                case "debug-release":
                                                    if (jsScript !== null) {
                                                        jsInit.adoption(jsScript, onFinish, moduleName);
                                                        return true;
                                                    }
                                                    break;
                                            }
                                        }
                                    }
                                }catch(e){}
                                return null;
                            }
                        }
                    },
                    Modules: {
                        load: {
                            //Используемый транспорт
                            transport :{
                                config: {
                                    data : {
                                        XMLHttpRequest  : false,
                                        JSIC            : false,
                                        basicURL        : "/modules/get",
                                        protocols       : { defalutIndex: 0, list: ["http", "https"] },
                                        JSICPrefix      : "JSIC",
                                        useOnlyJSIC     : false
                                    },
                                    methods : {
                                        validate        : function (URLString) {
                                            function fullTrim(sourceString) {
                                                var regExp = new RegExp(/^(\s|\u00A0)+/g);
                                                return sourceString.replace(regExp, '');
                                            };
                                            var URLString = (typeof URLString === "string" ? fullTrim(URLString) : ""),
                                                protocols = Loader.Resources.Modules.load.transport.config.data.protocols;
                                            for (var index = protocols.list.length - 1; index >= 0; index -= 1) {
                                                if (URLString.indexOf(protocols.list[index]) === 0) {
                                                    return URLString;
                                                }
                                            }
                                            return (Loader.Configurator.data.Debug.noURLControl === false ? protocols.list[protocols.defalutIndex] + "://" + URLString : URLString);
                                        },
                                        accept          : function () {
                                            var config          = Loader.Resources.Modules.load.transport.config,
                                                configuration   = (Loader.Configurator.data.Purity.modules ? Loader.Configurator.data.Purity.modules : {});
                                            config.data.basicURL    = (typeof configuration.url         === "string"    ? configuration.url         : config.data.basicURL      );
                                            config.data.JSICPrefix  = (typeof configuration.JSICPrefix  === "string"    ? configuration.JSICPrefix  : config.data.JSICPrefix    );
                                            config.data.useOnlyJSIC = (typeof configuration.useOnlyJSIC === "boolean"   ? configuration.useOnlyJSIC : config.data.useOnlyJSIC   );
                                            Loader.Configurator.data.Purity.domain   = config.methods.validate(Loader.Configurator.data.Purity.domain);
                                            config.data.basicURL    = Loader.Configurator.data.Purity.domain + config.data.basicURL;
                                        },
                                        init            : function (afterInitHandle) {
                                            var afterInitHandle     = (typeof afterInitHandle === "function" ? afterInitHandle : null),
                                                configuration       = Loader.Configurator.data,
                                                parentDomain        = window.location.host,
                                                visualizationMsg    = Loader.Visualization.message,
                                                transportConfig     = Loader.Resources.Modules.load.transport.config;
                                            //Accept global configuration
                                            transportConfig.methods.accept();
                                            //Init local block configuration
                                            if (typeof configuration.Purity.domain === "string" && typeof configuration.Purity.modules.pathToJS === "string" && afterInitHandle !== null) {
                                                visualizationMsg("Initialize transport for modules");
                                                if (configuration.Purity.domain.indexOf(parentDomain) !== -1 && transportConfig.data.useOnlyJSIC === false) {
                                                    //We can use simple XMLHttpRequest
                                                    transportConfig.data.XMLHttpRequest = true;
                                                    //Модуль не требует подключения он уже в системе
                                                    System.runFunction(afterInitHandle);
                                                } else {
                                                    //We have to use JSIC to solve cross-domain problem
                                                    transportConfig.data.basicURL   += transportConfig.data.JSICPrefix;
                                                    transportConfig.data.JSIC       = true;
                                                    //Подключаем модуль
                                                    System.Resources.JS.connect(configuration.Purity.domain + configuration.Purity.modules.pathToJS + "Purity.Connections.JSIC.js", afterInitHandle);
                                                }
                                            }
                                            return null;
                                        }
                                    }
                                },
                                //Подготовка команд для сервера
                                commands: {
                                    modules : function (list) {
                                        var listString = (list instanceof Array ? list.join(';') : list),
                                            requestString = "command="  + encodeURIComponent("content")                 + "&" +
                                                            "mode="     + Loader.Configurator.data.Tasks.modules.mode   + "&" +
                                                            "modules="  + encodeURIComponent(listString);
                                        return requestString;
                                    },
                                    versions: function () {
                                        return ("command=" + encodeURIComponent("versions"));
                                    },
                                },
                                requests: {
                                    //Физическая отправка запроса
                                    send        : function (request, onRecieve, onError, onTimeOut, onStep, count_index) {
                                        function updateIndex(requestIndex) {
                                            Loader.Resources.Modules.load.transport.requests.count = (requestIndex + 1);
                                        };
                                        var request             = (typeof request       !== "string"    ? null  : request       ),
                                            onRecieve           = (typeof onRecieve     !== "function"  ? null  : onRecieve     ),
                                            onError             = (typeof onError       !== "function"  ? null  : onError       ),
                                            onTimeOut           = (typeof onTimeOut     !== "function"  ? null  : onTimeOut     ),
                                            onStep              = (typeof onStep        !== "function"  ? null  : onStep        ),
                                            count_index         = (typeof count_index   !== "number"    ? 1     : count_index   ),
                                            loader              = Loader.Resources.Modules.load,
                                            send                = null,
                                            transportConfig     = Loader.Resources.Modules.load.transport.config,
                                            visualizationMsg    = Loader.Visualization.message,
                                            records             = Loader.Visualization.records,
                                            requestIndex        = (typeof Loader.Resources.Modules.load.transport.requests.count !== "number" ? 0 : Loader.Resources.Modules.load.transport.requests.count);
                                        if (request !== null && onRecieve !== null) {
                                            if (transportConfig.data.XMLHttpRequest === true) {
                                                records.open("Request XMLHttpRequest: [" + request + "]", requestIndex.toString());
                                                updateIndex(requestIndex);
                                                send = System.Ajax.Processing.send;
                                                send({
                                                    type        : "POST",
                                                    url         : transportConfig.data.basicURL,
                                                    request     : request,
                                                    onrecieve: function (serverAnswer) {
                                                        records.done(requestIndex.toString());
                                                        System.runFunction(onRecieve, serverAnswer);
                                                    },
                                                    onerror     : function (serverAnswer) {
                                                        records.fail(requestIndex.toString());
                                                        if (count_index < 8 && Loader.Starter.failFlag !== true) {
                                                            visualizationMsg("Request XMLHttpRequest: [" + request + "] did with errors. Try do request once more. Attempt " + count_index + " from 8.", { type: "[bad]" });
                                                            Loader.Resources.Modules.load.transport.requests.send(request, onRecieve, onError, onTimeOut, onStep, count_index + 1);
                                                        } else {
                                                            System.runFunction(onError, serverAnswer);
                                                        }
                                                    },
                                                    ontimeout   : function (serverAnswer) {
                                                        records.fail(requestIndex.toString());
                                                        if (count_index < 8 && Loader.Starter.failFlag !== true) {
                                                            visualizationMsg("Timeout is up. Request XMLHttpRequest: [" + request + "] is without answer from server. Attempt " + count_index + " from 8.", {type:"[bad]"});
                                                            Loader.Resources.Modules.load.transport.requests.send(request, onRecieve, onError, onTimeOut, onStep, count_index + 1);
                                                        } else {
                                                            System.runFunction(onTimeOut, serverAnswer);
                                                        }
                                                    }
                                                });
                                                return true;
                                            }
                                            if (transportConfig.data.JSIC === true) {
                                                if (Builder.isLoaded("Connections.JSIC") !== true) {
                                                    visualizationMsg("Transport for loading modules isn't ready. Cannot find JSIC module.");
                                                    return null;
                                                }
                                                records.open("Request JSIC: [" + request + "]", requestIndex.toString());
                                                updateIndex(requestIndex);
                                                send = new Purity.initModule("Connections.JSIC");
                                                send = send.get;
                                                send({
                                                    url         : transportConfig.data.basicURL + "?" + request,
                                                    onfinish    : function (serverAnswer) {
                                                        records.done(requestIndex.toString());
                                                        System.runFunction(onRecieve, serverAnswer);
                                                    },
                                                    onerror     : function (serverAnswer) { System.runFunction(onError,     serverAnswer); },
                                                    ontimeout   : function (serverAnswer) { System.runFunction(onTimeOut,   serverAnswer); },
                                                    onstep      : function (serverAnswer) { System.runFunction(onStep,      serverAnswer); },
                                                });
                                                return true;
                                            }
                                        }
                                        return false;
                                    },
                                    //Отправляет запрос на список версий модулей
                                    versions    : function (onFinish, onFail) {
                                        var onFinish    = (typeof onFinish  !== "function"  ? null : onFinish   ),
                                            onFail      = (typeof onFail    !== "function"  ? null : onFail     ),
                                            send        = Loader.Resources.Modules.load.transport.requests.send,
                                            commands    = Loader.Resources.Modules.load.transport.commands;
                                        if (onFinish !== null) {
                                            return send(commands.versions(), onFinish, onFail, onFail, null);
                                        }
                                    },
                                    //Отправляет запрос на указанные модули
                                    modules     : function (list, onFinish, onFail) {
                                        var list        = (typeof list      === "undefined" ? null : list       ),
                                            onFinish    = (typeof onFinish  !== "function"  ? null : onFinish   ),
                                            onFail      = (typeof onFail    !== "function"  ? null : onFail     ),
                                            send        = Loader.Resources.Modules.load.transport.requests.send,
                                            commands    = Loader.Resources.Modules.load.transport.commands,
                                            pseudo      = Loader.Resources.Modules.load.transport.requests.pseudo;
                                        if (pseudo(list, onFinish, onFail) === false) {
                                            if (list !== null && onFinish !== null) {
                                                return send(commands.modules(list), onFinish, onFail, onFail, null);
                                            }
                                        }
                                        return null;
                                    },
                                    //Моделирует запрос. Нужно если никакой транспорт не поддерживается (нет серверных скриптов)
                                    pseudo      : function (list, onFinish, onFail) {
                                        function checkName(moduleName) {
                                            if (moduleName.indexOf("Purity.") === -1) {
                                                return "Purity." + moduleName;
                                            }
                                            return moduleName;
                                        };
                                        function makeURL(moduleName) {
                                            var purityDomain        = Loader.Configurator.data.Purity.domain,
                                                pathToPurityModules = Loader.Configurator.data.Purity.modules.pathToJS,
                                                pathToPurityModules = (pathToPurityModules[pathToPurityModules.length - 1]  === '/' ? pathToPurityModules   : pathToPurityModules + '/'),
                                                url                 = (purityDomain[purityDomain.length - 1]                !== '/' ? purityDomain          : purityDomain.substr(0, purityDomain.length - 1));
                                            moduleName = checkName(moduleName);
                                            return purityDomain + pathToPurityModules + moduleName + ".js";
                                        };
                                        var list                = (typeof list      === "undefined" ? null : list       ),
                                            onFinish            = (typeof onFinish  !== "function"  ? null : onFinish   ),
                                            onFail              = (typeof onFail    !== "function"  ? null : onFail     ),
                                            applyRequest        = Loader.Resources.Modules.load.actions.applyRequest,
                                            pseudoServerAnswer  = [];
                                        if (Loader.Configurator.data.Tasks.modules.mode === "noconnections") {
                                            if (list !== null) {
                                                for (var index = list.length - 1; index >= 0; index -= 1) {
                                                    pseudoServerAnswer.push({
                                                        value   : "bm8gdmFsdWU=",//"no data" in BASE64String
                                                        url     : makeURL(list[index]),
                                                        name    : list[index],
                                                        version : "no data"
                                                    });
                                                }
                                                applyRequest(JSON.stringify(pseudoServerAnswer));
                                                return true;
                                            }
                                        }
                                        return false;
                                    }
                                }
                            },
                            actions: {
                                histiry: {
                                    data    : {},
                                    state   : {
                                        count: 0,
                                        done : 0
                                    },
                                    methods : {
                                        property                : function (name) {
                                            return name.replace(/\W/gi, "_");
                                        },
                                        registration            : function (name) {
                                            var name        = (typeof name === "string" ? name : null),
                                                data        = Loader.Resources.Modules.load.actions.histiry.data,
                                                state       = Loader.Resources.Modules.load.actions.histiry.state,
                                                property    = Loader.Resources.Modules.load.actions.histiry.methods.property;
                                            if (name !== null) {
                                                if (typeof data[property(name)] === "undefined") {
                                                    data[property(name)]    = name;
                                                    state.count             += 1;
                                                    Loader.Visualization.progress();
                                                    return true;
                                                }
                                                return false;
                                            }
                                            return null;
                                        },
                                        registrationCompletion  : function (handle) {
                                            var handle  = (typeof handle !== "function" ? null : handle),
                                                data    = Loader.Resources.Modules.load.actions.histiry.data;
                                            if (handle !== null) {
                                                if (typeof data.completion !== "function") {
                                                    //console.log("data.completion is ready");
                                                    data.completion = handle;
                                                    return true;
                                                }
                                                return false;
                                            }
                                            return null;
                                        },
                                        completion              : function (name) {
                                            //Регистрирует инициализацию отдельного модуля
                                            function accept(name) {
                                                data[property(name)]    = true;
                                                state.done              += 1;
                                                Loader.Visualization.progress();
                                            };
                                            //Завершение
                                            function completion() {
                                                if (typeof data.completion === "function") {
                                                    System.runFunction(data.completion, null);
                                                    //console.log("data.completion is run");
                                                    return true;
                                                }
                                                return false;
                                            };
                                            var name        = (typeof name === "string" ? name : null),
                                                data        = Loader.Resources.Modules.load.actions.histiry.data,
                                                state       = Loader.Resources.Modules.load.actions.histiry.state,
                                                isDone      = Loader.Resources.Modules.load.actions.histiry.methods.isDone,
                                                property    = Loader.Resources.Modules.load.actions.histiry.methods.property;
                                            if (name !== null) {
                                                accept(name);
                                            }
                                            if (isDone() === true) {
                                                if (completion() === true) {
                                                    //Чистим за собой, если все в порядке
                                                    Loader.Resources.Modules.load.actions.histiry.data = {};
                                                }
                                            }
                                        },
                                        isDone                  : function () {
                                            var data = Loader.Resources.Modules.load.actions.histiry.data;
                                            for (var key in data) {
                                                if (typeof data[key] !== "function") {
                                                    if (data[key] !== true) {
                                                        return false;
                                                    }
                                                }
                                            }
                                            return true;
                                        },
                                        state                   : function () {
                                            var state = Loader.Resources.Modules.load.actions.histiry.state;
                                            if (state !== null) {
                                                return {
                                                    count   : state.count,
                                                    done    : state.done
                                                };
                                            }
                                            return null;
                                        }
                                    }
                                },
                                //Отправка запросов на модули
                                get             : function (list, completionHandle, onFail, onFinish) {
                                    var check                   = Loader.Resources.Modules.load.actions.check,
                                        list                    = (typeof list              === "undefined" ? null : check(list)        ),
                                        completionHandle        = (typeof completionHandle  !== "function"  ? null : completionHandle   ),
                                        onFail                  = (typeof onFail            !== "function"  ? null : onFail             ),
                                        onFinish                = (typeof onFinish          !== "function"  ? null : onFinish           ),
                                        registration            = Loader.Resources.Modules.load.actions.histiry.methods.registration,
                                        registrationCompletion  = Loader.Resources.Modules.load.actions.histiry.methods.registrationCompletion,
                                        completion              = Loader.Resources.Modules.load.actions.histiry.methods.completion,
                                        module                  = null,
                                        modeJS                  = Loader.Configurator.data.Tasks.modules.mode,
                                        initializer             = Loader.Resources.Init.JS.init,
                                        requestedList           = [],
                                        requestModules          = Loader.Resources.Modules.load.transport.requests.modules,
                                        storing                 = Loader.Resources.Modules.storing;
                                    if (list !== null) {
                                        //Регистрируем обработчик полного завершения загрузки (сработает только однократно)
                                        registrationCompletion(completionHandle);
                                        if (list !== false) {
                                            //Регистрируем модули
                                            for (var index = list.length - 1; index >= 0; index -= 1) {
                                                if (registration(list[index]) !== true) {
                                                    //Удаляем "неправильный" модуль
                                                    list.splice(index, 1);
                                                }
                                            }
                                            //Загружаем модули
                                            for (var index = list.length - 1; index >= 0; index -= 1) {
                                                //Пытаемся достать из хранилища
                                                module = storing.get(list[index]);
                                                if (module === null) {
                                                    //Модуль не загружен. 
                                                    requestedList.push(list[index]);
                                                } else {
                                                    //Модуль есть в кэше. Инициализируем
                                                    initializer(module.value, module.url, modeJS, onFinish, module.name);
                                                }
                                            }
                                            //Если есть модули на дозагрузку
                                            if (requestedList.length > 0) {
                                                requestModules( requestedList,
                                                                function (serverAnswer) {
                                                                    Loader.Resources.Modules.load.actions.applyRequest(serverAnswer, onFinish);
                                                                },
                                                                onFail);
                                            }
                                        } else {
                                            completion();
                                        }
                                    }
                                },
                                //Проверяет список модулей и исключает уже загруженные
                                check           : function (list) {
                                    var list        = (typeof list === "undefined" ? null : (typeof list === "string" ? [list] : (list instanceof Array ? list : null))),
                                        checkedList = [];
                                    if (list !== null){
                                        for (var index = list.length - 1; index >= 0; index -= 1) {
                                            if (Builder.isLoaded(list[index]) !== true) {
                                                checkedList.push(list[index]);
                                            }
                                        }
                                        return checkedList;
                                    }
                                    return false;
                                },
                                //Обрабатывает ответ от запроса модуля
                                applyRequest    : function (serverAnswer, onFinish) {
                                    var serverAnswerTXT     = (typeof serverAnswer  === "string"    ? serverAnswer              : ""    ),
                                        serverAnswer        = (typeof serverAnswer  === "string"    ? JSON.parse(serverAnswer)  : null  ),
                                        onFinish            = (typeof onFinish      === "function"  ? onFinish                  : null  ),
                                        collection          = (serverAnswer instanceof Array        ? serverAnswer              : null  ),
                                        modeJS              = Loader.Configurator.data.Tasks.modules.mode,
                                        initializer         = Loader.Resources.Init.JS.init,
                                        storing             = Loader.Resources.Modules.storing,
                                        visualizationMsg    = Loader.Visualization.message,
                                        debugMessage        = Loader.Debugger.message;
                                    if (collection !== null) {
                                        debugMessage("Get server response: [begin]" + serverAnswerTXT + "[end]", "[response]", { type: "[response]" });
                                        for (var index = collection.length - 1; index >= 0; index -= 1) {
                                            if (collection[index].value !== null && collection[index].value !== "null") {
                                                if (storing.set(collection[index]) !== null) {
                                                    initializer(collection[index].value, collection[index].url, modeJS, onFinish, collection[index].name);
                                                } else {
                                                    visualizationMsg("Get bad answer form server. Cannot continue loading. See answer in console.", { isCritical: true });
                                                    Logs.show       ("Get bad answer form server. Cannot continue loading. Answer: [" + serverAnswer.toString() + "]", true);
                                                    return null;
                                                }
                                            } else {
                                                debugMessage("Module [" + collection[index].name + "] wasn't found on server. Correct list of modules or check server. Can't finish loading site.", "[critical]", { type: "[critical]"});
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        storing: {
                            commonResourceName  : "[PurityResource]",
                            fields  : [     { key: "name",      type: "string", base64string: false },
                                            { key: "url",       type: "string", base64string: false },
                                            { key: "value",     type: "string", base64string: true  },
                                            { key: "version",   type: "string", base64string: false }],
                            //Проверяет корректность записи данных модуля
                            validate: function (module) {
                                var module  = (typeof module === "object" ? module : null),
                                    storing = Loader.Resources.Modules.storing;
                                if (module !== null) {
                                    for (var Index = storing.fields.length - 1; Index >= 0; Index -= 1) {
                                        if (typeof module[storing.fields[Index].key] !== storing.fields[Index].type) {
                                            return false;
                                        } 
                                    }
                                    return true;
                                }
                                return null;
                            },
                            //Возвращает данные модуля из хранилищa c проверкой версии
                            get     : function (name) {
                                var name            = (typeof name === "string" ? name : null),
                                    storage         = System.Storage.Controls,
                                    storing         = Loader.Resources.Modules.storing,
                                    module          = {},
                                    key             = "",
                                    version         = Loader.Resources.Modules.versions.data.methods.get,
                                    validate        = Loader.Resources.Modules.storing.validate,
                                    debugMessage    = Loader.Debugger.message;
                                if (name !== null && Loader.Configurator.data.Tasks.modules.useCache === true) {
                                    //Проверка целостности данных
                                    for (var index = storing.fields.length - 1; index >= 0; index -= 1) {
                                        key = storing.commonResourceName + "[" + name + "]" + "[" + storing.fields[index].key + "]";
                                        module[storing.fields[index].key] = storage.getValue(key);
                                        if (module[storing.fields[index].key] === null) {
                                            debugMessage("Cannot get value of field [" + key + "] from localStorage", "[localstorage]", { type: "[bad]" });
                                            return null;
                                        } else {
                                            debugMessage("Get value of field [" + key + "] from localStorage", "[localstorage]", { type: "[ok]" });
                                        }
                                    }
                                    //Проверка актуальности версии
                                    if (validate(module) === true) {
                                        if (version(module.name) === module.version) {
                                            Loader.Statistics.load_from_storage = true;
                                            return module;
                                        }
                                    }
                                }
                                return null;
                            },
                            //Записывает данные модуля в хранилище
                            set     : function (module) {
                                function clearName(name) {
                                    var name            = (typeof name === "string" ? name : null),
                                        libraryPrefix   = "Purity.",
                                        fileExtension   = ".js";
                                    if (name !== null) {
                                        if (name.indexOf(libraryPrefix) === 0) {
                                            name = name.substring(libraryPrefix.length, name.length);
                                        }
                                        if (name.indexOf(fileExtension) === name.length - fileExtension.length) {
                                            name = name.substring(0, name.length - fileExtension.length);
                                        }
                                        return name;
                                    }
                                    return null;
                                };
                                var module          = (typeof module === "object" ? module : null),
                                    storage         = System.Storage.Controls,
                                    storing         = Loader.Resources.Modules.storing,
                                    key             = "",
                                    convertor       = System.Convertor,
                                    name            = "",
                                    debugMessage    = Loader.Debugger.message;
                                if (Loader.Configurator.data.Tasks.modules.useCache === false) {
                                    return (storing.validate(module) === true ? false : null);
                                }
                                if (module !== null) {
                                    if (storing.validate(module) === true) {
                                        name = clearName(module.name);
                                        for (var index = storing.fields.length - 1; index >= 0; index -= 1) {
                                            if (storing.fields[index].base64string === true) {
                                                module[storing.fields[index].key] = convertor.BASE64.decode(module[storing.fields[index].key]);
                                                module[storing.fields[index].key] = convertor.UTF8.decode(module[storing.fields[index].key]);
                                            }
                                            key = storing.commonResourceName + "[" + name + "]" + "[" + storing.fields[index].key + "]";
                                            if (storage.setValue(key, module[storing.fields[index].key]) !== true) {
                                                debugMessage("localStorage isn't avaliable. Cannot save field [" + key + "]", "[localstorage]", { type: "[bad]" });
                                                return null;
                                            } else {
                                                debugMessage("Field [" + key + "] is saved into localStorage", "[localstorage]", { type: "[ok]" });
                                            }
                                        }
                                        return true;
                                    }
                                }
                                return null;
                            },
                        },
                        versions: {
                            data : {
                                modules: [],
                                methods: {
                                    accept  : function (dataRecord) {
                                        var dataRecord  = (typeof dataRecord === "object" ? dataRecord : null),
                                            modules     = Loader.Resources.Modules.versions.data.modules;
                                        if (dataRecord !== null) {
                                            if (typeof dataRecord.version === "string" && typeof dataRecord.name === "string") {
                                                dataRecord.name = dataRecord.name.toLowerCase();
                                                modules.push(dataRecord);
                                            }
                                        }
                                    },
                                    get     : function (name) {
                                        var name    = (typeof name === "string" ? name.toLowerCase() : null),
                                            modules = Loader.Resources.Modules.versions.data.modules;
                                        if (name !== null) {
                                            name = name.replace("purity.", "");
                                            for (var index = modules.length - 1; index >= 0; index -= 1) {
                                                if (name === modules[index].name) {
                                                    return modules[index].version;
                                                }
                                            }
                                        }
                                        return null;
                                    }
                                }
                            },
                            init: {
                                start   : function (afterInitHandle) {
                                    var afterInitHandle = (typeof afterInitHandle === "function" ? afterInitHandle : null);
                                    if (Loader.Configurator.data.Debug.noVersionControl === false) {
                                        Loader.Resources.Modules.load.transport.requests.versions(
                                            function (serverAnswer) {
                                                Loader.Resources.Modules.versions.init.accept(serverAnswer, afterInitHandle);
                                            },
                                            function (serverAnswer) {
                                                Loader.Resources.Modules.versions.init.accept(null, afterInitHandle);
                                            }
                                        );
                                    } else {
                                        if (afterInitHandle !== null) {
                                            System.runFunction(afterInitHandle, null);
                                        }
                                    }
                                },
                                accept  : function (serverAnswer, afterInitHandle) {
                                    var serverAnswer    = (typeof serverAnswer      === "string"    ? JSON.parse(serverAnswer)  : null),
                                        afterInitHandle = (typeof afterInitHandle   === "function"  ? afterInitHandle           : null),
                                        methods         = Loader.Resources.Modules.versions.data.methods;
                                    if (serverAnswer instanceof Array) {
                                        for (var index = serverAnswer.length - 1; index >= 0; index -= 1) {
                                            methods.accept(serverAnswer[index]);
                                        }
                                    }
                                    if (afterInitHandle !== null) {
                                        System.runFunction(afterInitHandle, null);
                                    }
                                }
                            }
                        }

                    },
                    //Ресурсы пользователя. Внешние ресурсы
                    External: {
                        config:{
                            timeout         : 20000, //20s
                            attempts        : 3,
                            supportedTypes  : {
                            types           : [ { extension: "js",  type: "js",     fields: [   { name: "url",      type: "string",     value : null,   obligatory : true   }] },
                                                { extension: "css", type: "css",    fields: [   { name: "url",      type: "string",     value : null,   obligatory : true   }] },
                                                { extension: "*",   type: "jsic",   fields: [   { name: "url",      type: "string",     value : null,   obligatory : true   },
                                                                                                { name: "id",       type: "string",     value : null,   obligatory : false  },
                                                                                                { name: "cache",    type: "boolean",    value : false,  obligatory : false  },
                                                                                                { name: "initas",   type: "string",     value : null,   obligatory: false   },
                                                                                                { name: "name",     type: "string",     value : null,   obligatory: false   },
                                                                                                { name: "path",     type: "string",     value : null,   obligatory: false   }]
                                                },
                                                { extension: "*",   type: "image",  fields: [   { name: "url",      type: "string",     value : null,   obligatory : true   },
                                                                                                { name: "id",       type: "string",     value : null,   obligatory : false  }] }
                                        ],
                                //Try get type of resource form URL by file extemsion
                                fromURL : function (url) {
                                    var supportedTypes  = Loader.Resources.External.config.supportedTypes.types,
                                        extension       = "";
                                    for (var index = supportedTypes.length - 1; index >= 0; index -= 1) {
                                        if (supportedTypes[index].extension !== "*") {
                                            extension = "." + supportedTypes[index].extension;
                                            if (url.substring((url.length - extension.length), url.length).toLowerCase() === extension.toLowerCase()) {
                                                return supportedTypes[index].type.toLowerCase();
                                            }
                                        }
                                    }
                                    return null;
                                },
                                //Return type's record.
                                get     : function (typeName) {
                                    var typeName        = (typeof typeName === "string" ? typeName : null),
                                        supportedTypes  = Loader.Resources.External.config.supportedTypes.types;
                                    if (typeName !== null) {
                                        typeName = typeName.toLowerCase();
                                        for (var index = supportedTypes.length - 1; index >= 0; index -= 1) {
                                            if (supportedTypes[index].type.toLowerCase() === typeName) {
                                                return supportedTypes[index];
                                            }
                                        }
                                    }
                                    return null;
                                },
                                //Check fields
                                fields  : function (typeName, record, isModuleResource) {
                                    var typeName            = (typeof typeName          === "string"    ? typeName          : null  ),
                                        record              = (typeof record            === "object"    ? record            : null  ),
                                        isModuleResource    = (typeof isModuleResource  === "boolean"   ? isModuleResource  : false ),
                                        types               = Loader.Resources.External.config.supportedTypes,
                                        currentType         = null,
                                        fields              = {},
                                        urlHelpers          = Loader.Resources.External.helpers.urlsValidate;
                                    if (record !== null && typeName !== null) {
                                        currentType = types.get(typeName);
                                        if (currentType !== null) {
                                            for (var index = currentType.fields.length - 1; index >= 0; index -= 1) {
                                                if (typeof record[currentType.fields[index].name] !== currentType.fields[index].type) {
                                                    //Set default value
                                                    record[currentType.fields[index].name] = currentType.fields[index].value;
                                                    if (record[currentType.fields[index].name] === null && currentType.fields[index].obligatory === true) {
                                                        return false;
                                                    }
                                                }
                                                fields[currentType.fields[index].name] = record[currentType.fields[index].name];
                                            }
                                            if (isModuleResource === true) {
                                                if (typeof fields.path === "string") {
                                                    fields.path = urlHelpers.duplicates(Loader.Configurator.data.Purity.resources.basicPath + fields.path);
                                                }
                                            }
                                            return fields;
                                        }
                                    }
                                    return false;
                                }
                            }
                        },
                        tracking: {
                            constants: {
                                status: {
                                    wait        : "wait",
                                    done        : "done",
                                    fail        : "fail",
                                    processing  : "processing"
                                }
                            },
                            Data: {
                                resources   : [],
                                loaded      : 0,
                                waiting     : 0,
                                count       : 0
                            },
                            Methods: {
                                get         : function (resourceID) {
                                    var tracking    = Loader.Resources.External.tracking.Data,
                                        resourceID  = (typeof resourceID === "number" ? resourceID : null);
                                    if (resourceID !== null) {
                                        for (var index = tracking.resources.length - 1; index >= 0; index -= 1) {
                                            if (tracking.resources[index].id === resourceID) {
                                                return tracking.resources[index];
                                            }
                                        }
                                    }
                                    return null;
                                },
                                isDone      : function (resourceID) {
                                    var resourceID  = (typeof resourceID === "number" ? resourceID : null),
                                        tracking    = Loader.Resources.External.tracking,
                                        track       = tracking.Methods.get(resourceID);
                                    if (track !== null) {
                                        if (track.status !== tracking.constants.status.done) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }
                                    return false;
                                },
                                add         : function (resourceID, resourceType, resourceURL, references, fields, isModuleResource) {
                                    var resourceType        = (typeof resourceType      === "string"    ? resourceType      : null),
                                        resourceURL         = (typeof resourceURL       === "string"    ? resourceURL       : null),
                                        fields              = (typeof fields            === "object"    ? fields            : null),
                                        isModuleResource    = (typeof isModuleResource  === "boolean"   ? isModuleResource  : false),
                                        references          = (references instanceof Array ? references : null),
                                        tracking            = Loader.Resources.External.tracking,
                                        resourceID          = (typeof resourceID    === "number"    ? resourceID    : tracking.Data.count);
                                    if (resourceType !== null && resourceURL !== null) {
                                        tracking.Data.resources.push({
                                            id              : resourceID,
                                            type            : resourceType,
                                            url             : resourceURL,
                                            status          : tracking.constants.status.wait,
                                            references      : references,
                                            fields          : fields,
                                            isModuleResource: isModuleResource
                                        });
                                        tracking.Data.count     += 1;
                                        tracking.Data.waiting   += 1;
                                        Loader.Visualization.progress();
                                        return true;
                                    }
                                    return false;
                                },
                                done        : function (resourceID, resourceValue) {
                                    var resourceID          = (typeof resourceID === "number" ? resourceID : null),
                                        tracking            = Loader.Resources.External.tracking,
                                        track               = tracking.Methods.get(resourceID),
                                        visualizationMsg    = Loader.Visualization.message,
                                        currentTime         = new Date(),
                                        virtualStorage      = Loader.Resources.External.virtualStorage;
                                    if (track !== null) {
                                        tracking.Methods.clearTimer(resourceID);
                                        track.status            = tracking.constants.status.done;
                                        tracking.Data.loaded    += 1;
                                        tracking.Data.waiting   -= 1;
                                        //Check special resources, like JSIC, Images and etc.
                                        switch (track.type) {
                                            case "jsic":
                                                visualizationMsg("finish load [" + ((currentTime.valueOf() - track.startTime) / 1000) + "s]::: " + track.fields.name);
                                                break;
                                            case "image":
                                                visualizationMsg("image was cached::: " + track.url);
                                                break;
                                        }
                                        Loader.Visualization.progress();
                                        return track.isModuleResource;
                                    }
                                    return null;
                                },
                                fail        : function (resourceID) {
                                    var resourceID  = (typeof resourceID === "number" ? resourceID : null),
                                        tracking    = Loader.Resources.External.tracking,
                                        track       = tracking.Methods.get(resourceID);
                                    if (track !== null) {
                                        track.status = tracking.constants.status.fail;
                                    }
                                    return false;
                                },
                                processing  : function () {
                                    function versionsStatus() {
                                        var versions = Loader.Resources.External.versions;
                                        if (typeof processing.versionsStatus === "undefined") {
                                            processing.versionsStatus = "loading";
                                            versions.init(function () {
                                                processing.versionsStatus = "ready";
                                                processing();
                                            });
                                            return false;
                                        }else if (processing.versionsStatus === "loading"){
                                            return false;
                                        }
                                        return true;
                                    };
                                    function updateIndex(requestIndex) {
                                        Loader.Resources.External.tracking.Methods.processing.count = (requestIndex + 1);
                                    };
                                    var tracking            = Loader.Resources.External.tracking,
                                        events              = Loader.Resources.External.events,
                                        canLoadFlag         = true,
                                        visualizationMsg    = Loader.Visualization.message,
                                        currentTime         = new Date(),
                                        jsic                = null,
                                        jsicMethods         = Loader.Resources.External.jsic,
                                        jsicURL             = null,
                                        processing          = Loader.Resources.External.tracking.Methods.processing,
                                        cacheData           = null,
                                        virtualStorage      = Loader.Resources.External.virtualStorage,
                                        records             = Loader.Visualization.records,
                                        requestIndex        = (typeof Loader.Resources.External.tracking.Methods.processing.count !== "number" ? 0 : Loader.Resources.External.tracking.Methods.processing.count);
                                    if (versionsStatus() === false) {
                                        return false;
                                    }
                                    for (var index = tracking.Data.resources.length - 1; index >= 0; index -= 1) {
                                        if (tracking.Data.resources[index].status === tracking.constants.status.wait) {
                                            canLoadFlag = true;
                                            if (tracking.Data.resources[index].references !== null) {
                                                for (var refIndex = tracking.Data.resources[index].references.length - 1; refIndex >= 0; refIndex -= 1) {
                                                    if (tracking.Methods.isDone(tracking.Data.resources[index].references[index]) !== true) {
                                                        canLoadFlag = false;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (canLoadFlag === true) {
                                                tracking.Data.resources[index].startTime = currentTime.valueOf();
                                                switch (tracking.Data.resources[index].type) {
                                                    case "css":
                                                        visualizationMsg("loading::: " + tracking.Data.resources[index].url);
                                                        (function(index){
                                                            var id = tracking.Data.resources[index].id;
                                                            System.Resources.CSS.connect(   tracking.Data.resources[index].url,
                                                                                            function () {
                                                                                                events.onFinish(id);
                                                                                            },
                                                                                            function () {
                                                                                                events.onError(id, null);
                                                                                            },
                                                                                            Loader.Configurator.data.Debug.doNotWaitCSS
                                                            );
                                                        }(index));
                                                        tracking.Data.resources[index].status = tracking.constants.status.processing;
                                                        break;
                                                    case "js":
                                                        visualizationMsg("loading::: " + tracking.Data.resources[index].url);
                                                        (function (index) {
                                                            var id = tracking.Data.resources[index].id;
                                                            System.Resources.JS.connect(tracking.Data.resources[index].url,
                                                                                        function () {
                                                                                            events.onFinish(id);
                                                                                        },
                                                                                        function () {
                                                                                            events.onError(id, null);
                                                                                        }
                                                            );
                                                            //Устанавливаем TimeOut
                                                            tracking.Data.resources[index].timeout = setTimeout(function () { events.onTimeOut(id); }, Loader.Resources.External.config.timeout);
                                                        }(index));
                                                        tracking.Data.resources[index].status = tracking.constants.status.processing;
                                                        break;
                                                    case "jsic":
                                                        //First step - check cache
                                                        if (tracking.Data.resources[index].fields.cache === true) {
                                                            cacheData = jsicMethods.get(tracking.Data.resources[index]);
                                                            if (cacheData !== false) {
                                                                //Finish task
                                                                events.onFinish(tracking.Data.resources[index].id, cacheData, true);
                                                                break;
                                                            }
                                                        }
                                                        //If cache cannot be use - check module
                                                        if (Builder.isLoaded("Connections.JSIC") !== true) {
                                                            if (typeof processing.JSICStatus === "undefined") {
                                                                processing.JSICStatus = "loading";
                                                                Loader.Resources.Modules.load.actions.get("Connections.JSIC",
                                                                    null,
                                                                    null,
                                                                    function(){
                                                                        processing.JSICStatus = null;
                                                                        delete processing.JSICStatus;
                                                                        processing();
                                                                    }
                                                                );
                                                            }
                                                        } else {
                                                            jsic    = new Purity.initModule("Connections.JSIC");
                                                            jsicURL = jsicMethods.url(tracking.Data.resources[index].url, tracking.Data.resources[index].fields.name, tracking.Data.resources[index].fields.path);
                                                            if (jsicURL !== null) {
                                                                (function (index, requestIndex) {
                                                                    var id = tracking.Data.resources[index].id;
                                                                    records.open("Request JSIC: [" + jsicURL + "]", "ExternalResourcesJSIC" + requestIndex.toString());
                                                                    jsic.get({
                                                                        url         : jsicURL,
                                                                        onfinish    : function (resourceValue) {
                                                                            records.done("ExternalResourcesJSIC" + requestIndex.toString());
                                                                            events.onFinish(id, resourceValue);
                                                                        },
                                                                        onerror     : null,
                                                                        ontimeout   : function (resourceValue) {
                                                                            events.onTimeOut(id, resourceValue);
                                                                        },
                                                                        onstep      : null,
                                                                    });
                                                                }(index, requestIndex));
                                                                requestIndex += 1;
                                                                updateIndex(requestIndex);
                                                                tracking.Data.resources[index].status = tracking.constants.status.processing;
                                                            } else {
                                                                Logs.show("Incorrect developer's resource request. Chech definition of [name] and [path] params", true);
                                                            }
                                                        }
                                                        break;
                                                    case "image":
                                                        visualizationMsg("caching::: " + tracking.Data.resources[index].url);
                                                        (function (index) {
                                                            var cacheImg    = new Image();
                                                            System.Events.addListener(cacheImg, "load", function () {
                                                                events.onFinish(tracking.Data.resources[index].id);
                                                            });
                                                            //Запускаем загрузку
                                                            cacheImg.src = tracking.Data.resources[index].url;
                                                            //Устанавливаем TimeOut
                                                            tracking.Data.resources[index].timeout = setTimeout(function () { events.onTimeOut(tracking.Data.resources[index].id); }, Loader.Resources.External.config.timeout);
                                                            //Фиксируем начало
                                                            if (typeof tracking.Data.resources[index].started === "boolean") {
                                                                tracking.Data.resources[index].status = tracking.constants.status.fail;
                                                                events.onError(tracking.Data.resources[index].id);
                                                            } else {
                                                                tracking.Data.resources[index].started  = true;
                                                                tracking.Data.resources[index].status   = tracking.constants.status.processing;
                                                            }
                                                        }(index));
                                                        break;
                                                }
                                            }
                                        }
                                    }
                                },
                                clearTimer  : function (resourceID) {
                                    var resourceID          = (typeof resourceID === "number" ? resourceID : null),
                                        tracking            = Loader.Resources.External.tracking,
                                        track               = tracking.Methods.get(resourceID);
                                    if (track !== null) {
                                        if (typeof track.timeout !== "undefined") {
                                            clearTimeout(track.timeout);
                                            delete track.timeout;
                                        }
                                    }
                                },
                                state       : function () {
                                    var state = Loader.Resources.External.tracking.Data;
                                    if (state !== null) {
                                        return {
                                            count   : state.count,
                                            done    : state.loaded
                                        };
                                    }
                                    return null;
                                }
                            }
                        },
                        jsic: {
                            initializer : {
                                validate: function (initas) {
                                    var initas = (typeof initas === "string" ? initas.toLowerCase() : null);
                                    if (initas !== null) {
                                        if (initas === "js" || initas === "css" || initas === "data") {
                                            return true;
                                        }
                                    }
                                    return false;
                                },
                                make    : function(initas, value){
                                    //Checking isn't necessary it does jsic.save method
                                    var resourceInitializer = System.Resources;
                                    switch(initas.toLowerCase()){
                                        case "js":
                                            return resourceInitializer.JS.run(value, null);
                                            break;
                                        case "css":
                                            return (resourceInitializer.CSS.adoption(value) !== null ? true : false);
                                            break;
                                        case "data":
                                            return true;
                                            break;
                                    }
                                    return false;
                                }
                            },
                            url         : function(basicURL, name, path){
                                var basicURL    = (typeof basicURL  === "string" ? basicURL : null),
                                    name        = (typeof name      === "string" ? name     : null),
                                    path        = (typeof path      === "string" ? path     : null),
                                    prefix      = "";
                                if (basicURL !== null && name !== null & path !== null) {
                                    prefix = (basicURL.indexOf('?') === -1 ? "?" : "&");
                                    return basicURL + prefix + "name=" + name + "&path=" + path;
                                }
                                return null;
                            },
                            validate    : function (fields) {
                                var fields      = (typeof fields === "object" ? fields : null),
                                    initializer = Loader.Resources.External.jsic.initializer;
                                if (fields !== null) {
                                    if (typeof fields.cache !== null && fields.id !== null && fields.initas !== null) {
                                        return initializer.validate(fields.initas);
                                    }
                                }
                                return false;
                            },
                            save        : function (resourceID, resourceValue) {
                                var resourceID          = (typeof resourceID    === "number" ? resourceID                   : null),
                                    resourceValue       = (typeof resourceValue === "string" ? JSON.parse(resourceValue)    : null),
                                    tracking            = Loader.Resources.External.tracking,
                                    track               = tracking.Methods.get(resourceID),
                                    jsic                = Loader.Resources.External.jsic,
                                    storing             = Loader.Resources.External.storing,
                                    storingResult       = null,
                                    visualizationMsg    = Loader.Visualization.message;
                                if (track !== null && resourceValue !== null) {
                                    if (track.type === "jsic" && typeof resourceValue.value === "string" && typeof resourceValue.version === "string") {
                                        if (jsic.validate(track.fields) === true) {
                                            if (track.fields.cache === true) {
                                                //Try save
                                                storingResult = storing.set({
                                                                                path    : track.fields.path,
                                                                                name    : track.fields.name,
                                                                                initas  : track.fields.initas,
                                                                                version : resourceValue.version,
                                                                                value   : resourceValue.value
                                                                            }
                                                );
                                                if (storingResult !== null) {
                                                    //Try init
                                                    if (jsic.initializer.make(track.fields.initas, storingResult) === false) {
                                                        return null;
                                                    }
                                                }
                                            }
                                            if (track.fields.initas === "data") {
                                                if (storingResult === null) {
                                                    storingResult = storing.decode( {
                                                                                        path    : track.fields.path,
                                                                                        name    : track.fields.name,
                                                                                        initas  : track.fields.initas,
                                                                                        version : resourceValue.version,
                                                                                        value   : resourceValue.value
                                                                                    }
                                                    );
                                                }
                                                if (storingResult !== null) {
                                                    if (Loader.Resources.External.virtualStorage.save(track.fields.id, storingResult) === true) {
                                                        visualizationMsg("save resource::: ["           + track.fields.name + "] under ID [" + track.fields.id + "]");
                                                    } else {
                                                        visualizationMsg("fail to save resource::: "    + track.url);
                                                    }
                                                }
                                            }
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            },
                            get         : function (track) {
                                var track               = (typeof track === "object" ? track    : null),
                                    storing             = Loader.Resources.External.storing,
                                    jsic                = Loader.Resources.External.jsic,
                                    resource            = null,
                                    visualizationMsg    = Loader.Visualization.message,
                                    versions            = Loader.Resources.External.versions;
                                if (track !== null) {
                                    resource = storing.get(track.fields.path, track.fields.name);
                                    if (resource !== null) {
                                        if (resource.version === versions.actual(track.fields.path, track.fields.name)) {
                                            if (jsic.initializer.make(resource.initas, resource.value) === true) {
                                                visualizationMsg("localStorage::: [" + track.fields.name + "] was loaded from localStorage.");
                                                return resource.value;
                                            }
                                        } else {
                                            visualizationMsg("localStorage::: [" + track.fields.name + "] this resource has wrong version. Resource will be loaded from server.");
                                        }
                                    }
                                }
                                return false
                            },
                        },
                        events: {
                            onFinish    : function (resourceID, resourceValue, callFromProcessing) {
                                var resourceID          = (typeof resourceID            === "number"    ? resourceID            : null  ),
                                    resourceValue       = (typeof resourceValue         === "string"    ? resourceValue         : null  ),
                                    callFromProcessing  = (typeof callFromProcessing    === "boolean"   ? callFromProcessing    : false ),
                                    tracking            = Loader.Resources.External.tracking,
                                    isModuleResource    = null,
                                    isModulesReady      = Loader.Resources.Modules.load.actions.histiry.methods.isDone(),
                                    jsic                = Loader.Resources.External.jsic,
                                    track               = tracking.Methods.get(resourceID),
                                    debugMessage        = Loader.Debugger.message,
                                    visualizationMsg    = Loader.Visualization.message;
                                if (resourceID !== null) {
                                    //Проверяем присоединяемые ресурсы, через теги
                                    if (resourceValue === null) {
                                        visualizationMsg("Resource [" + track.fields.url + "] attached.", { type: "[ok]" });
                                    } else {
                                        if (callFromProcessing === false) {
                                            debugMessage("Get server response (JSIC transport): [begin]" + resourceValue + "[end]", "[response]", { type: "[response]" });
                                            //Проверяем вначале тип запроса JSIC
                                            if (jsic.save(resourceID, resourceValue) === null) {
                                                debugMessage("Resource [" + track.fields.name + "] cannot be initialized. It can be error during loading resource. Site will be reload in 5 seconds.", "[critical]", { type: "[critical]" });
                                                tracking.Methods.fail(resourceID);
                                                setTimeout(function () { window.location.reload();}, 5000);
                                                return false;
                                            }
                                        } else {
                                            if (Loader.Resources.External.virtualStorage.save(track.fields.id, resourceValue) === true) {
                                                visualizationMsg("save resource::: [" + track.fields.name + "] under ID [" + track.fields.id + "]");
                                            } else {
                                                visualizationMsg("fail to save resource::: " + track.url);
                                            }
                                        }
                                    }
                                    //Фиксируем задание как выполненое
                                    isModuleResource = tracking.Methods.done(resourceID, resourceValue);
                                    //Проверяем очередь
                                    if (tracking.Data.waiting === 0) {
                                        if (isModuleResource !== true || isModulesReady === true) {
                                            Loader.Resources.External.finish();
                                        }
                                    } else {
                                        if (callFromProcessing === false) {
                                            tracking.Methods.processing();
                                        }
                                    }
                                }
                            },
                            onError     : function (resourceID, resourceValue) {
                                var resourceID      = (typeof resourceID === "number" ? resourceID : null),
                                    tracking        = Loader.Resources.External.tracking,
                                    track           = tracking.Methods.get(resourceID),
                                    debugMessage    = Loader.Debugger.message;
                                if (track !== null) {
                                    tracking.Methods.fail       (resourceID);
                                    tracking.Methods.clearTimer (resourceID);
                                    debugMessage("Resource [" + track.url + "] wasn't found. Correct list of resources or check server. Can't finish loading site.", "[critical]", { type: "[critical]" });
                                }
                            },
                            onTimeOut   : function (resourceID, resourceValue) {
                                var resourceID          = (typeof resourceID === "number" ? resourceID : null),
                                    tracking            = Loader.Resources.External.tracking,
                                    track               = tracking.Methods.get(resourceID),
                                    visualizationMsg    = Loader.Visualization.message;
                                if (track !== null) {
                                    if (typeof track.attempts !== "number") {
                                        track.attempts = 0;
                                    }
                                    if (track.attempts < Loader.Resources.External.config.attempts) {
                                        track.attempts  += 1;
                                        track.status    = tracking.constants.status.wait;
                                        tracking.Methods.processing();
                                        visualizationMsg("loading [attempt " + (track.attempts + 1) + "/" + Loader.Resources.External.config.attempts + "]::: " + track.url, {isCritical:true});
                                    } else {
                                        tracking.Methods.fail(resourceID);
                                    }
                                }
                            }
                        },
                        storing: {
                            commonResourceName  : "[DeveloperResource]",
                            fields: [               { key: "path",      type: "string",     base64string: false },
                                                    { key: "name",      type: "string",     base64string: false },
                                                    { key: "initas",    type: "string",     base64string: false },
                                                    { key: "version",   type: "string",     base64string: false },
                                                    { key: "value",     type: "string",     base64string: true }],
                            history             : [],
                            //Проверяет корректность записи данных модуля
                            validate            : function (resource) {
                                var resource    = (typeof resource === "object" ? resource : null),
                                    storing     = Loader.Resources.External.storing;
                                if (resource !== null) {
                                    for (var Index = storing.fields.length - 1; Index >= 0; Index -= 1) {
                                        if (typeof resource[storing.fields[Index].key] !== storing.fields[Index].type) {
                                            return false;
                                        } 
                                    }
                                    return true;
                                }
                                return null;
                            },
                            //Декодирует ресурс, если нужно
                            decode              : function(resource){
                                var resource        = (typeof resource === "object" ? resource : null),
                                    storing         = Loader.Resources.External.storing,
                                    convertor       = System.Convertor;
                                if (resource !== null) {
                                    if (storing.validate(resource) === true) {
                                        for (var index = storing.fields.length - 1; index >= 0; index -= 1) {
                                            if (storing.fields[index].base64string === true && resource.initas !== "data") {
                                                resource[storing.fields[index].key] = convertor.BASE64.decode(resource[storing.fields[index].key]);
                                                resource[storing.fields[index].key] = convertor.UTF8.decode(resource[storing.fields[index].key]);
                                            }
                                        }
                                        return resource.value;
                                    }
                                }
                                return null;
                            },
                            //Возвращает данные модуля из хранилищa
                            get                 : function (path, name) {
                                var path            = (typeof path === "string" ? path : null),
                                    name            = (typeof name === "string" ? name : null),
                                    storage         = System.Storage.Controls,
                                    storing         = Loader.Resources.External.storing,
                                    resource        = {},
                                    key             = "",
                                    debugMessage    = Loader.Debugger.message;
                                if (Loader.Configurator.data.Tasks.modules.useCache === true) {
                                    //Проверка целостности данных
                                    for (var index = storing.fields.length - 1; index >= 0; index -= 1) {
                                        key = storing.commonResourceName + "[" + path + name + "]" + "[" + storing.fields[index].key + "]";
                                        resource[storing.fields[index].key] = storage.getValue(key);
                                        if (resource[storing.fields[index].key] === null) {
                                            debugMessage("Cannot get value of field [" + key + "] from localStorage", "[localstorage]", { type: "[bad]" });
                                            return null;
                                        } else {
                                            debugMessage("Get value of field [" + key + "] from localStorage", "[localstorage]", { type: "[ok]" });
                                        }
                                    }
                                    Loader.Statistics.load_from_storage = true;
                                    return resource;
                                }
                                return null;
                            },
                            //Записывает данные ресурса
                            set                 : function (resource) {
                                var resource        = (typeof resource === "object" ? resource : null),
                                    storage         = System.Storage.Controls,
                                    storing         = Loader.Resources.External.storing,
                                    key             = "",
                                    convertor       = System.Convertor,
                                    debugMessage    = Loader.Debugger.message;
                                if (Loader.Configurator.data.Tasks.modules.useCache === false) {
                                    return (storing.validate(resource) === true ? false : null);
                                }
                                if (resource !== null) {
                                    if (storing.decode(resource) !== null) {
                                        for (var index = storing.fields.length - 1; index >= 0; index -= 1) {
                                            key = storing.commonResourceName + "[" + resource.path + resource.name + "]" + "[" + storing.fields[index].key + "]";
                                            if (storage.setValue(key, resource[storing.fields[index].key]) !== true) {
                                                debugMessage("localStorage isn't avaliable. Cannot save field [" + key + "]", "[localstorage]", { type: "[bad]" });
                                                return null;
                                            } else {
                                                debugMessage("Field [" + key + "] is saved into localStorage", "[localstorage]", { type: "[ok]" });
                                            }
                                        }
                                        if (storing.history.indexOf(resource.path + resource.name) !== -1) {
                                            Logs.show("Developer's resources are using dublicates of path and name (bad path and name: path[" + resource.path + "]; name["+ resource.name + "])", true);
                                        }
                                        storing.history.push(resource.path + resource.name);
                                        return resource.value;
                                    }
                                }
                                return null;
                            }
                        },
                        versions: {
                            data    : null,
                            init    : function (afterInitHandle) {
                                var afterInitHandle             = (typeof afterInitHandle === "function" ? afterInitHandle : null),
                                    jsic                        = null,
                                    purityDomain                = Loader.Configurator.data.Purity.domain,
                                    versionsResourcesManager    = Loader.Configurator.data.Tasks.resources.versions;
                                if (afterInitHandle !== null) {
                                    if (Loader.Configurator.data.Debug.noVersionControl === false) {
                                        if (versionsResourcesManager !== null) {
                                            if (Builder.isLoaded("Connections.JSIC") !== true) {
                                                Loader.Resources.Modules.load.actions.get("Connections.JSIC",
                                                    null,
                                                    null,
                                                    function () {
                                                        Loader.Resources.External.versions.init(afterInitHandle);
                                                    }
                                                );
                                            } else {
                                                jsic = new Purity.initModule("Connections.JSIC");
                                                jsic.get({
                                                    url         : versionsResourcesManager.replace("~", purityDomain),
                                                    onfinish    : function (serverResponse) {
                                                        Loader.Resources.External.versions.apply(serverResponse, afterInitHandle, false);
                                                    },
                                                    onerror     : null,
                                                    ontimeout   : function (serverResponse) {
                                                        Loader.Resources.External.versions.apply(serverResponse, afterInitHandle, true);
                                                    },
                                                    onstep      : null,
                                                });
                                            }
                                        }else{
                                            //Контроль версий отключен
                                            System.runFunction(afterInitHandle);
                                        }
                                    } else {
                                        //Контроль версий отключен
                                        System.runFunction(afterInitHandle);
                                    }
                                }
                            },
                            apply   : function (serverResponse, afterInitHandle, timeOutFlag) {
                                function cancelVersionControl() {
                                    Loader.Configurator.data.Tasks.resources.versions = null;
                                    Logs.show("Cannot get version list of developer's resources from server. Version's controll (of developer's resources) is off.", false);
                                };
                                function applyVersionControl() {
                                    try{
                                        serverResponse = JSON.parse(serverResponse);
                                        if (serverResponse instanceof Array) {
                                            Loader.Resources.External.versions.data = serverResponse;
                                        } else {
                                            cancelVersionControl();
                                        }
                                    } catch (e) {
                                        cancelVersionControl();
                                    }
                                };
                                var serverResponse  = (typeof serverResponse    === "string"    ? serverResponse    : null),
                                    afterInitHandle = (typeof afterInitHandle   === "function"  ? afterInitHandle   : null),
                                    timeOutFlag     = (typeof timeOutFlag       === "boolean"   ? timeOutFlag       : null);
                                if (serverResponse !== null && afterInitHandle !== null && timeOutFlag !== null &&
                                    Loader.Configurator.data.Tasks.resources.versions !== null) {
                                    switch (timeOutFlag) {
                                        case true:
                                            //Не можем получить данные о версиях. Далее действуем так как их нет
                                            cancelVersionControl();
                                            break;
                                        case false:
                                            applyVersionControl();
                                            break;
                                    }
                                    System.runFunction(afterInitHandle);
                                }
                            },
                            actual  : function (path, name) {
                                var name    = (typeof name === "string" ? name : null),
                                    path    = (typeof path === "string" ? path : null),
                                    data    = Loader.Resources.External.versions.data,
                                    key     = null;
                                if (name !== null && path !== null && data !== null) {
                                    key = path + name;
                                    for (var index = data.length - 1; index >= 0; index -= 1){
                                        if (typeof data[index].resource === "string" && typeof data[index].version === "string") {
                                            if (data[index].resource === key) {
                                                return data[index].version;
                                            }
                                        }
                                    }
                                }
                                return null;
                            }
                        },
                        //Загружаемые ресурсы, такие как: jsic's data; images and etc.
                        virtualStorage : {
                            //Storage of resources
                            data: {
                                IDs     : [],
                                values  : []
                            },
                            //Save some recource to virtual storage
                            save    : function (id, value) {
                                var id              = (typeof id    === "string"    ? id    : (typeof id === "number" ? id : null)),
                                    value           = (typeof value !== "undefined" ? value : null),
                                    virtualStorage  = Loader.Resources.External.virtualStorage;
                                if (id !== null && value !== null) {
                                    if (virtualStorage.get(id) === null) {
                                        virtualStorage.data.IDs.push(id);
                                        virtualStorage.data.values.push(value);
                                        return true;
                                    }
                                }
                                return false;
                            },
                            //Get some resource from virtual storage
                            get     : function (id) {
                                var id              = (typeof id === "string" ? id : (typeof id === "number" ? id : null)),
                                    resourceIndex   = null,
                                    virtualStorage  = Loader.Resources.External.virtualStorage;
                                if (id !== null) {
                                    resourceIndex = virtualStorage.data.IDs.indexOf(id);
                                    if (resourceIndex !== -1) {
                                        return {
                                            index: resourceIndex,
                                            value: virtualStorage.data.values[resourceIndex]
                                        };
                                    }
                                }
                                return null;
                            },
                            remove  : function (id) {
                                var id              = (typeof id === "string" ? id : (typeof id === "number" ? id : null)),
                                    resource        = null,
                                    virtualStorage  = Loader.Resources.External.virtualStorage;
                                if (id !== null) {
                                    resource = virtualStorage.get(id);
                                    if (resource !== null) {
                                        virtualStorage.data.IDs.splice(resource.index, 1);
                                        virtualStorage.data.values.splice(resource.index, 1);
                                        return true;
                                    }
                                }
                                return false;
                            }
                        },
                        helpers: {
                            urlsValidate: {
                                tilde       : function (url) {
                                    var host     = window.location.host,
                                        protocol = window.location.protocol;
                                    if (url.indexOf("~") === 0) {
                                        url = Loader.Configurator.data.Purity.domain + url.substring(1, url.length);
                                    }
                                    return url;
                                },
                                duplicates: function (url) {
                                    var isTilda = (url[0] === '~' ? true : false);
                                    url = url.replace(/~/gim, '');
                                    url = url.replace(/(:\/\/)/gim, '[protocol]');
                                    url = url.replace(/(\/\/)/gim,          '/');
                                    url = url.replace(/(\[protocol\])/gim, '://');
                                    url = (isTilda === true ? "~" + url : url);
                                    return url;
                                }
                            }
                        },
                        get     : function (resources, isModuleResource) {
                            function correctModuleResource(url, isModuleResource) {
                                if (isModuleResource === true) {
                                    if (url.indexOf("~") === -1) {
                                        url = Loader.Configurator.data.Purity.resources.url + url;
                                    }
                                }
                                return url;
                            };
                            var tracking            = Loader.Resources.External.tracking,
                                resources           = (resources instanceof Array               ? resources         : null),
                                isModuleResource    = (typeof isModuleResource === "boolean"    ? isModuleResource  : false),
                                types               = Loader.Resources.External.config.supportedTypes,
                                resourceID          = null,
                                references          = null,
                                startLoading        = false,
                                resourceType        = "",
                                fields              = null,
                                urlHelpers          = Loader.Resources.External.helpers.urlsValidate;
                            if (resources !== null) {
                                if (resources instanceof Array) {
                                    for (var index = resources.length - 1; index >= 0; index -= 1) {
                                        if (typeof resources[index].url === "string") {
                                            resourceID              = (typeof resources[index].id === "number" ? resources[index].id : null);
                                            references              = (resources[index].references instanceof Array ? resources[index].references : null);
                                            resources[index].url    = correctModuleResource (resources[index].url, isModuleResource);
                                            resources[index].url    = urlHelpers.duplicates (resources[index].url);
                                            resources[index].url    = urlHelpers.tilde      (resources[index].url);
                                            resourceType            = null;
                                            if (typeof resources[index].type === "string") {
                                                if (types.get(resources[index].type) !== null) {
                                                    resourceType = resources[index].type;
                                                }
                                            } else {
                                                resourceType = types.fromURL(resources[index].url);
                                            }
                                            if (resourceType !== null) {
                                                fields = types.fields(resourceType, resources[index], isModuleResource);
                                                if (fields !== false) {
                                                    tracking.Methods.add(resourceID, resourceType, resources[index].url, references, fields, isModuleResource);
                                                    startLoading = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (startLoading === true) {
                                tracking.Methods.processing();
                            } else {
                                if (isModuleResource !== true) {
                                    Loader.Resources.External.finish();
                                }
                            }
                        },
                        finish  : function () {
                            //А вот берем и делаем так ))) 
                            Loader.Resources.External.finish = true;
                            Loader.Starter.finish();
                        }
                    },
                },
                //Визуализация отладчика
                Debugger: {
                    registrationCloseHandle : function(closeHandle){
                        var visualization   = Loader.Visualization.activities,
                            closeHandle     = (typeof closeHandle === "function" ? closeHandle : null);
                        if (visualization.manualCloseConsole !== null && closeHandle !== null) {
                            System.runFunction(visualization.manualCloseConsole, closeHandle);
                            return true;
                        }
                        return false;
                    },
                    apply                   : function(){
                        var message         = Loader.Visualization.message,
                            debugConfig     = Loader.Configurator.data.Debug;
                        if (debugConfig.clearLocalStorage === true) {
                            if (typeof window.localStorage !== "undefined") {
                                if (typeof window.localStorage.clear === "function") {
                                    window.localStorage.clear();
                                    message("localStorage is clear", {type:"[ok]"});
                                    return;
                                }
                            }
                            message("Cannot clear localStorage. Browser doesn't support localStorage.", { type: "[bad]" });
                        }
                    },
                    showConsole             : function(){
                        var visualization   = Loader.Visualization.activities,
                            debugConfig     = Loader.Configurator.data.Debug;
                        if (debugConfig.showConsole === true) {
                            System.runFunction(visualization.onConsole);
                        }
                    },
                    message                 : function (text, type, params) {
                        var text            = (typeof text      === "string" ? text     : null  ),
                            params          = (typeof params    === "object" ? params   : {}    ),
                            type            = (typeof type      === "string" ? type     : null  ),
                            visualization   = Loader.Visualization.activities,
                            debugConfig     = Loader.Configurator.data.Debug,
                            message         = Loader.Visualization.message;
                        /*mesage's types:
                        [response]
                        [localstorage]
                        */
                        if (text !== null && type !== null) {
                            if (debugConfig.showServersResponse     === true && type === "[response]"       ) {
                                message(text, params);
                                return;
                            }
                            if (debugConfig.showLocalStorageStatus  === true && type === "[localstorage]"   ) {
                                message(text, params);
                                return;
                            }
                            if (debugConfig.showLocalStorageStatus  === true && type === "[critical]") {
                                message(text, params);
                                return;
                            }
                            
                        }
                    },
                    feedback                : {
                        registration: function (feedback) {
                            var feedback = (typeof feedback === "function" ? feedback : null);
                            if (feedback !== null) {
                                System.runFunction(feedback, Loader.Debugger.feedback.send);
                            }
                        },
                        send        : function (content) {
                            var content         = (typeof content === "string" ? content : null),
                                configuration   = Loader.Configurator.data.Debug.feedback,
                                records         = Loader.Visualization.records,
                                url             = null;
                            if (content !== null && configuration.url !== null && configuration.email !== null) {
                                url = window.location.protocol + "//" + window.location.host + configuration.url;
                                records.open("Sending logs to developer.", "sending.logs");
                                System.Ajax.Processing.send({
                                    type        : "POST",
                                    url         : url,
                                    request     : "email=" + configuration.email + "&content=" + content,
                                    onrecieve   : function () {
                                        records.done("sending.logs");
                                    }
                                });
                            }
                        }
                    }
                },
                //Визуализация загрузки
                Visualization: {
                    activities  : {
                        messageHandle       : null,
                        onConsole           : null,
                        finishHandle        : null,
                        manualCloseConsole  : null,
                        openRecord          : null,
                        closeRecord         : null,
                        failRecord          : null,
                        feedback            : null,
                        progress            : null,
                        jsVisualization     : null,
                    },
                    attach      : function (activities) {
                        var activities      = (typeof activities === "object" ? activities : null),
                            visualization   = Loader.Visualization.activities;
                        if (activities !== null) {
                            for (var key in activities) {
                                if (typeof visualization[key] !== "undefined") {
                                    visualization[key] = activities[key];
                                }
                            }
                            if (activities["feedback"] !== null) {
                                Loader.Debugger.feedback.registration(activities["feedback"]);
                            }
                        }
                    },
                    message     : function (text, params) {
                        var text            = (typeof text              === "string"    ? text              : null          ),
                            params          = (typeof params            === "object"    ? params            : {}            ),
                            isCritical      = (typeof params.isCritical === "boolean"   ? params.isCritical : null          ),
                            type            = (typeof params.type       === "string"    ? params.type       : "[standart]"  ),
                            module          = (typeof params.module     === "string"    ? params.module     : null          ),
                            atTheEnd        = (typeof params.atTheEnd   === "boolean"   ? params.atTheEnd   : false         ),
                            visualization   = Loader.Visualization.activities;
                        /*mesage's types:
                        [standart]
                        [ok]
                        [bad]
                        [response] 
                        [critical]
                        */
                        if (text !== null) {
                            if (visualization.messageHandle !== null && visualization.finishHandle !== null) {
                                Loader.Debugger.showConsole();
                                System.runFunction(visualization.messageHandle, {
                                    message     : text,
                                    isCritical  : isCritical,
                                    type        : type,
                                    atTheEnd    : atTheEnd,
                                    module      : module
                                });
                            }
                        }
                    },
                    records     : {
                        open: function (message, id) {
                            if (Loader.Visualization.activities.openRecord !== null){
                                System.runFunction(Loader.Visualization.activities.openRecord, { message: message, id: id });
                            }
                        },
                        done: function (id) {
                            if (Loader.Visualization.activities.openRecord !== null) {
                                System.runFunction(Loader.Visualization.activities.closeRecord, id);
                            }
                        },
                        fail: function (id) {
                            if (Loader.Visualization.activities.failRecord !== null) {
                                System.runFunction(Loader.Visualization.activities.failRecord, id);
                            }
                        },
                    },
                    progress    : function (){
                        var modules     = Loader.Resources.Modules.load.actions.histiry.methods.state(),
                            resources   = Loader.Resources.External.tracking.Methods.state();
                        if (modules !== null && resources !== null) {
                            System.runFunction(Loader.Visualization.activities.progress,
                                {
                                    count: modules.count    + resources.count,
                                    done : modules.done     + resources.done
                                }
                            );
                        }
                    },
                    destroy     : function () {
                        var visualization = Loader.Visualization.activities;
                        if (visualization.messageHandle !== null && visualization.finishHandle !== null) {
                            System.runFunction(visualization.finishHandle, null);
                            visualization.messageHandle     = null;
                            visualization.finishHandle      = null;
                            if (visualization.jsVisualization !== null) {
                                document.head.removeChild(visualization.jsVisualization);
                                visualization.jsVisualization = null;
                            }
                            publicAttachVisualization       = null;
                        }
                    },
                    init        : function () {
                        var Configuration = Loader.Configurator.data,
                            visualization = Loader.Visualization.activities;
                        if (Configuration.Visualization.show === true) {
                            Loader.Visualization.internal.init();
                            if (Configuration.Visualization.urlExternal !== "") {
                                Loader.Visualization.message("Start loading external visualization");
                                visualization.jsVisualization = System.Resources.JS.connect(Configuration.Visualization.urlExternal, Loader.Visualization.internal.destroy);
                            }
                        }
                    },
                    internal    : {
                        data    : {
                            css         : "div[data-type=\"Purity.Initializer.InternalVisualization.Container\"]{position:absolute;top:0;left:0;width:100%;height:100%;background:#000;overflow:scroll}p[data-type=\"Purity.Initializer.InternalVisualization.Message\"]{font-family:'Lucida Sans Unicode','Lucida Grande','Lucida Sans','DejaVu Sans Condensed',sans-serif;font-size:.8em;margin:6px 6px 6px 24px;padding:0;color:green;-moz-animation-name:Purity_Initializer_InternalVisualization_Message;-o-animation-name:Purity_Initializer_InternalVisualization_Message;-webkit-animation-name:Purity_Initializer_InternalVisualization_Message;animation-name:Purity_Initializer_InternalVisualization_Message;-moz-animation-iteration-count:1;-o-animation-iteration-count:1;-webkit-animation-iteration-count:1;animation-iteration-count:1;-moz-animation-duration:100ms;-o-animation-duration:100ms;-webkit-animation-duration:100ms;animation-duration:100ms;-moz-animation-timing-function:ease-in;-o-animation-timing-function:ease-in;-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}span[data-type=\"Purity.Initializer.InternalVisualization.Message.Type.OK\"]{color:#088f02;font-weight:bold}span[data-type=\"Purity.Initializer.InternalVisualization.Message.Type.BAD\"]{color:#a40000;font-weight:bold}span[data-type=\"Purity.Initializer.InternalVisualization.Message.Type.RESPONSE\"]{color:#0496ff;font-weight:bold}span[data-type=\"Purity.Initializer.InternalVisualization.Message.Type.CRITICAL\"]{color:#ffea00;font-weight:bold}@keyframes Purity_Initializer_InternalVisualization_Message{from{opacity:0}to{opacity:1}}@-moz-keyframes Purity_Initializer_InternalVisualization_Message{from{opacity:0}to{opacity:1}}@-webkit-keyframes Purity_Initializer_InternalVisualization_Message{from{opacity:0}to{opacity:1}}",
                            container   : null,
                            criticals   : null
                        },
                        activities: {
                            messageHandle       : function (params) {
                                function getTypes(type) {
                                    switch (type) {
                                        case "[response]":
                                            return "<span data-type=\"Purity.Initializer.InternalVisualization.Message.Type.RESPONSE\">[response] </span><hr><xmp>";
                                            break;
                                        case "[ok]":
                                            return "<span data-type=\"Purity.Initializer.InternalVisualization.Message.Type.OK\">[ok] </span>";
                                            break;
                                        case "[bad]":
                                            return "<span data-type=\"Purity.Initializer.InternalVisualization.Message.Type.BAD\">[bad] </span>";
                                            break;
                                        case "[critical]":
                                            return "<span data-type=\"Purity.Initializer.InternalVisualization.Message.Type.CRITICAL\">[critical] </span>";
                                        case "[open]":
                                            return "<span data-type=\"Purity.Initializer.InternalVisualization.Message.Type.OK\">[open task] </span>";
                                            break;
                                        case "[close]":
                                            return "<span data-type=\"Purity.Initializer.InternalVisualization.Message.Type.OK\">[done task] </span>";
                                            break;
                                        case "[fail]":
                                            return "<span data-type=\"Purity.Initializer.InternalVisualization.Message.Type.BAD\">[fail task] </span>";
                                            break;
                                    }
                                    return "";
                                }
                                var message     = (typeof params === "object" ? (typeof params.message  === "string" ? params.message   : null) : null),
                                    type        = (typeof params === "object" ? (typeof params.type     === "string" ? params.type      : null) : null),
                                    container   = Loader.Visualization.internal.data.container,
                                    criticals   = Loader.Visualization.internal.data.criticals,
                                    paragraph   = null;
                                if (message !== null && container !== null) {
                                    paragraph               = document.createElement("P");
                                    paragraph.setAttribute("data-type", "Purity.Initializer.InternalVisualization.Message");
                                    paragraph.innerHTML     = getTypes(type) + message;
                                    if (type === "[info]" || type === "[critical]") {
                                        criticals.appendChild(paragraph);
                                    } else {
                                        container.insertBefore(paragraph, criticals);
                                    }
                                    container.scrollTop = container.scrollHeight;
                                }
                            },
                            onConsole           : null,
                            finishHandle        : function () { Loader.Visualization.internal.destroy(); },
                            manualCloseConsole  : null,
                            openRecord          : function (params) {
                                var message     = (typeof params === "object" ? (typeof params.message === "string" ? params.message : null) : null);
                                if (message !== null ) {
                                    Loader.Visualization.internal.activities.messageHandle({ message: message, type: "[open]"});
                                }
                            },
                            closeRecord         : function (params) {
                                var message     = (typeof params === "object" ? (typeof params.message === "string" ? params.message : null) : null);
                                if (message !== null ) {
                                    Loader.Visualization.internal.activities.messageHandle({ message: message, type: "[close]"});
                                }
                            },
                            failRecord          : function (params) {
                                var message = (typeof params === "object" ? (typeof params.message === "string" ? params.message : null) : null);
                                if (message !== null) {
                                    Loader.Visualization.internal.activities.messageHandle({ message: message, type: "[fail]" });
                                }
                            },
                            feedback            : null,
                            jsVisualization     : null
                        },
                        init    : function () {
                            var container   = document.createElement("DIV"),
                                criticals   = document.createElement("DIV"),
                                data        = Loader.Visualization.internal.data;
                            System.Resources.CSS.adoption(data.css);
                            container.setAttribute("data-type", "Purity.Initializer.InternalVisualization.Container");
                            container.appendChild(criticals);
                            document.body.appendChild(container);
                            data.container = container;
                            data.criticals = criticals;
                            Loader.Visualization.internal.append();
                            Loader.Visualization.message("Purity internal visualization is attached");
                        },
                        destroy : function () {
                            var container = Loader.Visualization.internal.data.container;
                            if (container) {
                                if (container !== null) {
                                    if (typeof container.parentNode !== "undefined") {
                                        if (typeof container.parentNode.removeChild === "function") {
                                            container.parentNode.removeChild(container);
                                            container = null;
                                        }
                                    }
                                }
                            }
                        },
                        append  : function () {
                            var activities          = Loader.Visualization.activities,
                                internal_activities = Loader.Visualization.internal.activities;
                            for (var key in internal_activities) {
                                if (typeof activities[key] !== "undefined") {
                                    activities[key] = internal_activities[key];
                                }
                            }

                        }
                    }
                },
                //Блок проверки минимальной совместимости
                Compatibility :{
                    isAvailable: {
                        localstorage    : function () {
                            return (typeof window["localStorage"] !== "undefined" ? true : false);
                        },
                        transform       : function () {
                            var ResultOperation = false;
                            if (typeof document.body.style.transform          === "string") { ResultOperation = true; }
                            if (typeof document.body.style.webkitTransform    === "string") { ResultOperation = true; }
                            if (typeof document.body.style.mozTransform       === "string") { ResultOperation = true; }
                            if (typeof document.body.style.oTransform         === "string") { ResultOperation = true; }
                            if (typeof document.body.style.msTransform        === "string") { ResultOperation = true; }
                            return ResultOperation;
                        },
                        animation       : function () {
                            var ResultOperation = false;
                            if (typeof document.body.style.animation        === "string") { ResultOperation = true; }
                            if (typeof document.body.style.webkitAnimation  === "string") { ResultOperation = true; }
                            if (typeof document.body.style.mozAnimation     === "string") { ResultOperation = true; }
                            if (typeof document.body.style.oAnimation       === "string") { ResultOperation = true; }
                            if (typeof document.body.style.msAnimation      === "string") { ResultOperation = true; }
                            return ResultOperation;
                        },
                        xmlhttprequest  : function () {
                            return (typeof window["XMLHttpRequest"] !== "undefined" ? true : false);
                        },
                        xmlparser       : function () {
                            var testXML             = '<?xml version="1.0" encoding="utf-8"?><data><group><field>value</field></group></data>',
                                microsoftXMLObject  = null,
                                parsedObject        = null;
                            if (typeof window["DOMParser"] !== "undefined"){
                                return true;
                            }else if (typeof window["ActiveXObject"] !== "undefined") {
                                try{
                                    microsoftXMLObject          = new ActiveXObject("Microsoft.XMLDOM");
                                    microsoftXMLObject.async    = false;
                                    parsedObject                = microsoftXMLObject.loadXML(testXML);
                                    microsoftXMLObject          = null;
                                    if (parsedObject !== null) {
                                        return (typeof parsedObject.nodeType !== "undefined" ? true : false);
                                    }
                                } catch (e) {
                                    return false;
                                }
                            }
                            return false;
                        },
                        canvas          : function () {
                            try {
                                return (typeof (document.createElement("CANVAS")).getContext === "function" ? true : false);
                            } catch (e) {
                                return false;
                            }
                        }
                    },
                    check: function (fields) {
                        var chk     = Loader.Compatibility.isAvailable,
                            fields  = (typeof fields === "object" ? fields : null);
                        if (fields !== null) {
                            for (var key in fields) {
                                if (typeof chk[key] === "function") {
                                    if (chk[key]() === false && fields[key] === true) {
                                        return false;
                                    }
                                } else {
                                    Logs.show("Cannot check support of [" + key + "]. Initialization didn't stop.");
                                }
                            }
                        }
                        return true;
                    }
                },
                GlobalErrors: {
                    show: function (index) {
                        var messageContainer    = document.createElement("DIV"),
                            textContainer       = document.createElement("P");
                        //Make styles
                        messageContainer.style.position     = "absolute";
                        messageContainer.style.top          = "50%";
                        messageContainer.style.left         = "50%";
                        messageContainer.style.width        = "50%";
                        messageContainer.style.height       = "50%";
                        messageContainer.style.marginTop    = "-25%";
                        messageContainer.style.marginLeft   = "-25%";
                        textContainer.style.textAlign       = "center";
                        textContainer.style.fontFamily      = "'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', 'DejaVu Sans Condensed', sans-serif";
                        textContainer.style.color           = "red";
                        textContainer.style.fontSize        = "18px"
                        switch (index) {
                            case "no config":
                                textContainer.innerHTML = "Cannot find cofiguration of Purity. Should be purityConfigurator global property.";
                                break;
                            case "bad browser":
                                textContainer.innerHTML = "Sorry. Your browser (or current configuration of it) doesn't support some necessary functions. Without such functions this site cannot be opened.";
                                break;
                        }
                        messageContainer.appendChild(textContainer);
                        document.body.appendChild(messageContainer);
                    }
                },
                //Инициализация блока
                init: function () {
                    Loader.Configurator.                init();
                    //Loader.Resources.ModulesBody.Config.init();
                }
            };
            //Блок по работе с портотипами
            Prototypes = {
                //Псевдо наследование портатипов
                inherit     : function (childObject, parentObject, makeLinkToRootProto) {
                    ///     <summary>Connect parent's prototype with child's prototype. Child's old prototype will be cleared.</summary>
                    ///     <param name="childObject"           type="object">Child object</param>
                    ///     <param name="parentObject"          type="object">Parent object</param>
                    ///     <param name="makeLinkToRootProto"   type="boolean">True - function will make link [rootPrototype]</param>
                    ///     <returns type="boolean" mayBeNull="true">True - if operation is done well; false - if has some errors with objects; null - if cannot find objects.</returns>
                    var tempFunction        = function () { },
                        makeLinkToRootProto = (typeof makeLinkToRootProto === "boolean" ? makeLinkToRootProto : false);
                    if (parentObject && childObject) {
                        try {
                            tempFunction.prototype              = parentObject.prototype;
                            childObject.prototype               = new tempFunction();
                            childObject.prototype.constructor   = childObject;
                            if (makeLinkToRootProto === true) {
                                childObject.rootPrototype       = parentObject.prototype;
                            }
                            return true;
                        } catch (e) {
                            return false;
                        }
                    } else {
                        return null;
                    }
                },
                //Собирает prototype из указанных объектов. Первым всегда указывается объект, для которого будет производится сборка прототипа
                inherits    : function () {
                    ///     <summary>Build child prototype from all defined parents. Pay attantion: link to root prototype will not be created.</summary>
                    ///     <param name="childObject" type="object">Child object</param>
                    ///     <param name="list of parent objects" type="object">Parent objects</param>
                    ///     <returns type="boolean" mayBeNull="true">True - if operation is done well; false - if has some errors with objects; null - if cannot find objects.</returns>
                    var parentsObjects  = Array.prototype.slice.call(arguments),
                        childObject     = parentsObjects.shift(),
                        property        = null,
                        prototypeMirror = function () { };
                    if (parentsObjects.length > 0 && childObject) {
                        try {
                            for (var Index = 0, MaxIndex = parentsObjects.length; Index < MaxIndex; Index += 1) {
                                if (Index === 0) {
                                    prototypeMirror.prototype = parentsObjects[Index].prototype;
                                } else {
                                    for (property in parentsObjects[Index].prototype) {
                                        prototypeMirror.prototype[property] = parentsObjects[Index].prototype[property];
                                    }
                                }
                            }
                            childObject.prototype               = new prototypeMirror();
                            childObject.prototype.constructor   = childObject;
                            return true;
                        } catch (e) {
                            return false;
                        }
                    } else {
                        return null;
                    }

                },
                //Очистка портотипа
                clear       : function (targetObject) {
                    ///     <summary>Clear prototype of defined object</summary>
                    ///     <param name="targetObject" type="object"></param>
                    ///     <returns type="object" mayBeNull="true"></returns>
                    if (targetObject) {
                        try{
                            targetObject.prototype = null;
                            //delete targetObject.prototype;
                            return targetObject;
                        }catch(e){}
                    }
                    return null;
                }
            };
            //Блок по инициализации модулей
            Builder = {
                moduleLink  : function (name){
                    /// <signature>
                    ///     <summary>Try to return link to module's object. Name should be without [Purity] word. For example: Tools - if needs Purity.Tools; or Environment.Events - if needs Purity.Environment.Events. Will return null if module isn't found.</summary>
                    ///     <param name="name" type="string">Module name</param>
                    ///     <returns type="Object" mayBeNull="true">Object if module is. NULL - module is't found.</returns>
                    /// </signature>
                    var namesArray                      = null,
                        moduleObject                    = ModulesStorage,
                        name                            = (typeof name === "string" ? name : null),
                        moduleInitializationProperty    = Make.config.moduleInitializationProperty;
                    if (name !== null) {
                        namesArray = name.split(".");
                        for (var Index = 0, MaxIndex = namesArray.length; Index < MaxIndex; Index += 1) {
                            if (typeof moduleObject[namesArray[Index]] === "undefined") {
                                return null;
                            } else {
                                moduleObject = moduleObject[namesArray[Index]];
                            }
                        }
                        return (typeof moduleObject[moduleInitializationProperty] === "function" ? moduleObject : null);
                    }
                    return null;
                },
                isLoaded    : function (names) {
                    /// <signature>
                    ///     <summary>Check initialize state of module</summary>
                    ///     <param name="names" type="Array[string]">Names of modules</param>
                    ///     <returns type="boolean">True - all are inited. False - someone isn't inited. </returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Check initialize state of module</summary>
                    ///     <param name="names" type="string">Module's name</param>
                    ///     <returns type="boolean" mayBeNull="true">True - module is inited. False - is't inited.</returns>
                    /// </signature>
                    var names                           = (typeof names !== "undefined" ? (typeof names === "string" ? [names] : (names instanceof Array ? names : null)) : null),
                        failModules                     = [],
                        moduleLink                      = null,
                        moduleInitializationProperty    = Make.config.moduleInitializationProperty;
                    if (names !== null) {
                        for (var Index = names.length - 1; Index >= 0; Index -= 1) {
                            moduleLink = Builder.moduleLink(names[Index]);
                            if (moduleLink === null) {
                                failModules.push(names[Index]);
                            } else if (typeof moduleLink[moduleInitializationProperty] !== "function") {
                                failModules.push(names[Index]);
                            }
                        }
                        if (failModules.length > 0) {
                            return failModules;
                        }
                        return true;
                    } else {
                        return false;
                    }
                },
                closeSpace  : function () {
                    /// <signature>
                    ///     <summary>Build an object of module</summary>
                    ///     <param name="requestedModules" type="string's list">Name of module</param>
                    ///     <param name="callback" type="function">This function makes close space for object. Should be last in arguments.</param>
                    ///     <returns type="object" mayBeNull="true">New object of requested module. Returns null in error.</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Build an object of several modules</summary>
                    ///     <param name="requestedModules" type="string's list">List of modules, like: "dom", "event" and etc.</param>
                    ///     <param name="callback" type="function">This function makes close space for object. Should be last in arguments.</param>
                    ///     <returns type="object" mayBeNull="true">New object of requested modules. All methods of modules will place to one exiting object. Returns null in error.</returns>
                    /// </signature>
                    var requestedModules                = Array.prototype.slice.call(arguments),
                        callback                        = requestedModules.pop(),
                        tepmFunction                    = null,
                        moduleInitializationProperty    = Make.config.moduleInitializationProperty;
                    if (typeof callback === "function" && requestedModules.length > 0) {
                        //Если была перезагрузка с оператором new, то нужно поправить массив
                        requestedModules = (requestedModules[0] instanceof Array ? requestedModules[0] : requestedModules);
                        //Проверяем наличия new 
                        if (!(this instanceof Builder.closeSpace)) {
                            return new Builder.closeSpace(requestedModules, callback);
                        }
                        //Приводим имя модуля к массиву
                        if (typeof requestedModules === "string") {
                            requestedModules = [requestedModules];
                        }
                        //Проверяем наличие модулей
                        if (Builder.isLoaded(requestedModules) === true) {
                            for (var Index = requestedModules.length - 1; Index >= 0; Index -= 1) {
                                //Инициализация модуля
                                Builder.moduleLink(requestedModules[Index])[moduleInitializationProperty](this);
                            }
                            //Передача готового объекта
                            callback(this);
                            return this;
                        }
                    }
                    return null;
                },
                module      : function () {
                    /// <signature>
                    ///     <summary>Build an object of module</summary>
                    ///     <param name="requestedModules" type="string">Name of module</param>
                    ///     <returns type="object" mayBeNull="true">New object of requested module. Returns null in error.</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Build an object of several modules</summary>
                    ///     <param name="requestedModules" type="string's list">List of modules, like: "dom", "event" and etc.</param>
                    ///     <returns type="object" mayBeNull="true">Collection of objects of requested module. Collection is object with names of modules. Returns null in error.</returns>
                    /// </signature>
                    function finalModuleName(fullModuleName) {
                        if (fullModuleName.indexOf(".") === -1) {
                            return fullModuleName;
                        } else {
                            return fullModuleName.split(".").pop();
                        }
                    };
                    var readyModules                    = {},
                        requestedModules                = Array.prototype.slice.call(arguments),
                        moduleInitializationProperty    = Make.config.moduleInitializationProperty;
                    if (requestedModules.length > 0) {
                        //Если была перезагрузка с оператором new, то нужно поправить массив
                        requestedModules = (requestedModules[0] instanceof Array ? requestedModules[0] : requestedModules);
                        //Проверяем наличия new 
                        if (!(this instanceof Builder.module)) {
                            return new Builder.module(requestedModules);
                        }
                        //Приводим имя модуля к массиву
                        if (typeof requestedModules === "string") {
                            requestedModules = [requestedModules];
                        }
                        //Проверяем наличие модулей
                        if (Builder.isLoaded(requestedModules) === true) {
                            //Создаем объекты массивов
                            for (var Index = requestedModules.length - 1; Index >= 0; Index -= 1) {
                                //Очищаем prototype
                                Prototypes.clear(Builder.closeSpace);
                                //Наследуем необходимый prototype
                                Prototypes.inherit( Builder.closeSpace,
                                                    Builder.moduleLink(requestedModules[Index])[moduleInitializationProperty],
                                                    false);
                                //Создаем объект модуля
                                readyModules[finalModuleName(requestedModules[Index])] = new Builder.closeSpace(requestedModules[Index], function (entity) { });
                            }
                            //Очищаем prototype
                            Prototypes.clear(Builder.closeSpace);
                            //Возвращаем ссылку на модуль/модули
                            return (requestedModules.length === 1 ? readyModules[finalModuleName(requestedModules[0])] : readyModules);
                        }
                    }
                    return null;
                }
            };
            //Блок по созданию модулей
            Make = {
                config      : {
                    moduleInitializationProperty: "moduleInitializationProperty"
                },
                crossing    : {
                    data    : [],
                    methods : {
                        registration    : function (caller, modules) {
                            var caller  = (typeof caller    === "string" ? caller       : null),
                                modules = (typeof modules   === "string" ? [modules]    : (modules instanceof Array ? modules : null)),
                                data    = Make.crossing.data,
                                isCross = Make.crossing.methods.isCross;
                            if (modules !== null && caller !== null) {
                                for (var index = modules.length - 1; index >= 0; index -= 1) {
                                    if (isCross(caller, modules[index]) === false){
                                        data.push(caller + "-" + modules[index]);
                                    }
                                }
                            }
                        },
                        isCross         : function (caller, modules) {
                            var caller      = (typeof caller    === "string" ? caller       : null),
                                modules     = (typeof modules   === "string" ? [modules]    : (modules instanceof Array ? modules : null)),
                                data        = Make.crossing.data,
                                crossing    = [];
                            if (caller !== null && modules !== null) {
                                for (var index = modules.length - 1; index >= 0; index -= 1) {
                                    if (data.indexOf((caller + "-" + modules[index])) !== -1 || data.indexOf((modules[index] + "-" + caller)) !== -1) {
                                        crossing.push(modules[index]);
                                    }
                                }
                                return (crossing.length === 0 ? false : crossing);
                            }
                            return false;
                        }
                    }
                },
                holded      : {
                    data    : {
                        ready   : [],
                        fails   : [],
                        waiting : {}
                    },
                    methods : {
                        //Регистрирует модуль, который требует дозагрузки
                        registration: function (name, modules, handle) {
                            var property    = Loader.Resources.Modules.load.actions.histiry.methods.property,
                                modules     = (typeof modules   === "undefined" ? null              : (typeof modules === "string" ? [modules] : (modules instanceof Array ? modules : null))),
                                handle      = (typeof handle    === "function"  ? handle            : null),
                                name        = (typeof name      === "string"    ? property(name)    : null),
                                data        = Make.holded.data;
                            if (modules !== null && handle !== null && name !== null) {
                                if (typeof data.waiting[name] !== "object") {
                                    data.waiting[name] = {
                                        modules : [],
                                        handle  : handle
                                    };
                                    for (var index = modules.length - 1; index >= 0; index -= 1) {
                                        if (data.ready.indexOf(modules[index]) === -1) {
                                            data.waiting[name].modules.push(modules[index]);
                                        }
                                    }
                                }
                            }
                        },
                        //Регистрирует загруженный модуль
                        accept      : function (name) {
                            var property        = Loader.Resources.Modules.load.actions.histiry.methods.property,
                                completion      = Loader.Resources.Modules.load.actions.histiry.methods.completion,
                                nameProperty    = null,
                                name            = (typeof name === "string" ? name : null),
                                data            = Make.holded.data,
                                holdRecordKey   = null,
                                moduleIndex     = null,
                                handles         = [];
                            if (name !== null) {
                                //Добавляем модуль в реестр инициированных
                                data.ready.push(name);
                                nameProperty = property(name);
                                if (typeof data.waiting[nameProperty] === "object") {
                                    data.waiting[nameProperty] = null;
                                    delete data.waiting[nameProperty];
                                }
                                for (holdRecordKey in data.waiting) {
                                    moduleIndex = data.waiting[holdRecordKey].modules.indexOf(name);
                                    if (moduleIndex !== -1) {
                                        data.waiting[holdRecordKey].modules.splice(moduleIndex, 1);
                                    }
                                    if (data.waiting[holdRecordKey].modules.length === 0) {
                                        handles.push(data.waiting[holdRecordKey].handle);
                                        //System.runFunction(data.waiting[holdRecordKey].handle);
                                    }
                                }
                                //Подтверждаем загрузку
                                completion(name);
                                //Выполняем необходимые callbacks
                                for(var index = handles.length - 1; index >= 0; index -= 1){
                                    System.runFunction(handles[index]);
                                }
                            }
                        },
                        //Проверяет не был ли модуль зарегистрирован, как проваленный
                        isFail      : function(name){
                            var fails   = Make.holded.data.fails,
                                name    = (typeof name === "string" ? name : null);
                            if (name !== null) {
                                return (fails.indexOf(name) === -1 ? false : true);
                            }
                            return true;
                        },
                        //Регистрируем провал сборки модуля
                        fail        : function (name) {
                            var fails   = Make.holded.data.fails,
                                isFail  = Make.holded.methods.isFail,
                                name    = (typeof name === "string" ? name : null);
                            if (name !== null) {
                                if (isFail(name) === false) {
                                    fails.push(name);
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                },
                //Подготавливает данные модуля. Сам экземпляр модуля не создается. Подгтавливается prototype (общий функционал) и
                //закрытая часть, то есть функционал присущий для каждого отдельного объекта модуля. Чтобы поспользоваться модулем,
                //нужно создать объект модуля используя Builder.module(#имя_модуля)
                module      : function (name, references, funcCommonPart, funcSingularPart) {
                    function validateCompatibility  (compatibility) {
                        var isAvailable = Loader.Compatibility.isAvailable;
                        if (compatibility !== null) {
                            for (var key in compatibility) {
                                if (typeof isAvailable[key] === "function") {
                                    if (compatibility[key] === true) {
                                        if (isAvailable[key]() !== true) {
                                            return key;
                                        }
                                    }
                                }
                            }
                        }
                        return true;
                    };
                    function crossingCheck          (caller, requestedModules,  references) {
                        var crossings   = null,
                            position    = null;
                        if (requestedModules instanceof Array) {
                            crossings = Make.crossing.methods.isCross(caller, requestedModules);
                            if (crossings !== false) {
                                for (var index = crossings.length - 1; index >= 0; index -= 1) {
                                    position = requestedModules.indexOf(crossings[index]);
                                    if (position !== -1) {
                                        requestedModules.splice(position, 1);
                                    }
                                    if (references instanceof Array) {
                                        position = references.indexOf(crossings[index]);
                                        if (position !== -1) {
                                            references.splice(position, 1);
                                        }
                                    }
                                }
                                return (requestedModules.length === 0 ? true : requestedModules);
                            }
                        }
                        return requestedModules;
                    };
                    function remove_dublicates      (caller, visualizationMsg, modules){
                        var values = {};
                        return modules.filter(function (element) {
                            var property = null;
                            if (typeof element === "string" || typeof element === "number") {
                                property = element.replace(/\W/gi, "_");
                            }
                            if (property in values === true) {
                                visualizationMsg("Purity.Initializer::: module [" + caller + "] has duplicates in list of modules (" + element + "). Purity.Initializer fixed error, but we strongly recommend remove duplicates from definition of modules.", { type: "[critical]", atTheEnd: true });
                                return false;
                            } else {
                                values[property] = true;
                                return true;
                            }
                            return (property in values ? false : (values[property] = true));
                        });
                    };
                    ///     <summary>Create module: prototype and object's data.</summary>
                    ///     <param name="name" type="string">Name of module</param>
                    ///     <param name="references" type="Array[string]">Names of modules which should be loaded before.</param>
                    ///     <param name="funcCommonPart" type="function">Function which generates prototype of module.</param>
                    ///     <param name="funcSingularPart" type="function">Function which generates objects in each module's object.</param>
                    ///     <returns type="boolean" mayBeNull="true">True - OK;  false - something bad; null - big errors.</returns>
                    var modulePlace                     = null,
                        name                            = (typeof name              === "string"    ? name              : null),
                        funcSingularPart                = (typeof funcSingularPart  === "function"  ? funcSingularPart  : null),
                        funcCommonPart                  = (typeof funcCommonPart    === "function"  ? funcCommonPart    : null),
                        references                      = (typeof references        === "object"    ? references        : null),
                        visualizationMsg                = Loader.Visualization.message,
                        moduleInitializationProperty    = Make.config.moduleInitializationProperty,
                        requestedModules                = null;
                    //Внимание! Этот блок никогда не будет запущен. Он сдесь исключительно что бы обмануть VS JavaScript IntelliSense
                    //Без этого блока JavaScript IntelliSense не будет подгружать "выход" модулей, а значить и программировать будет
                    //весьма затруднительно
                    if (Loader.Configurator.data === null) {
                        modulePlace = Make.namespace(name);
                        modulePlace.parent[modulePlace.property][moduleInitializationProperty]              = funcSingularPart;
                        modulePlace.parent[modulePlace.property][moduleInitializationProperty].prototype    = (funcCommonPart());
                        alert("Warning! This block cannot be run. Check structure of code. And find this block by content of this message.");
                    }
                    if (name !== null && funcCommonPart !== null && funcSingularPart !== null) {
                        if (Make.holded.methods.isFail(name) === true) {
                            return false;
                        }
                        if (Builder.moduleLink(name) === null) {
                            visualizationMsg("[" + name + "]::: is loaded.");
                            visualizationMsg("[" + name + "]::: is starting initialization.");
                            references                  = (references !== null ? references : { modules: null, resources: null, compatibility: null });
                            references.modules          = (typeof references.modules        === "undefined" ? null : references.modules         );
                            references.resources        = (typeof references.resources      === "undefined" ? null : references.resources       );
                            references.compatibility    = (typeof references.compatibility  === "undefined" ? null : references.compatibility   );
                            references.modules          = (references.modules       !== null ? ((references.modules     instanceof Array) !== true ? null : references.modules  ) : null);
                            references.modules          = (references.modules instanceof Array === true ? remove_dublicates(name, visualizationMsg, references.modules) : references.modules);
                            references.resources        = (references.resources     !== null ? ((references.resources   instanceof Array) !== true ? null : references.resources) : null);
                            references.compatibility    = (references.compatibility !== null ? (typeof compatibility === "object" ? null : references.compatibility) : null);
                            requestedModules            = Builder.isLoaded(references.modules);
                            requestedModules            = crossingCheck(name, requestedModules, references.modules);
                            if (requestedModules !== true) {
                                //Регистрируем пары модулей, для предотвращения пересекания
                                Make.crossing.methods.registration(name, requestedModules);
                            }
                            if (requestedModules === true || references.modules === null) {
                                //Проверяем совместимость
                                if (validateCompatibility(references.compatibility) !== true) {
                                    visualizationMsg("[" + name + "]::: module has requested support of [" + validateCompatibility(references.compatibility) + "], but this tech isn't supported.", { type: "[critical]", atTheEnd: true });
                                    visualizationMsg("Purity.Initializer::: initialization will not be finished. Try refuse from module [" + name + "]", { type: "[critical]", atTheEnd: true });
                                    //Регистрируем провал создания модуля
                                    Make.holded.methods.fail(name);
                                    return false;
                                }
                                //Создаем пространство имен
                                modulePlace = Make.namespace(name);
                                if (modulePlace !== null) {
                                    //Определяем частную часть (часть индивидуальную для каждого отдельного объекта)
                                    modulePlace.parent[modulePlace.property][moduleInitializationProperty]              = funcSingularPart;
                                    //Формируем prototype модуля
                                    modulePlace.parent[modulePlace.property][moduleInitializationProperty].prototype    = (funcCommonPart());
                                    visualizationMsg(" initialization is completed.", { type: "[ok]", module: name });
                                    //Загружаем ресурсы, если таковые определены
                                    if (references.resources !== null) {
                                        visualizationMsg("[" + name + "]::: module has requested external resources.");
                                        Loader.Resources.External.get(references.resources, true);
                                    }
                                    //Регистрируем модуль, как собранный
                                    Make.holded.methods.accept(name);
                                    return true;
                                }
                            } else {
                                visualizationMsg("[" + name + "]::: needs to load other modules before.");
                                //Регистриуем модуль, как требующий дозагрузки
                                Make.holded.methods.registration(name, references.modules, function () {
                                    Make.module(name, references, funcCommonPart, funcSingularPart);
                                });
                                setTimeout(function () {
                                                //Связанные модули не загружены. Нужно подгружать.
                                                Loader.Resources.Modules.load.actions.get(  references.modules,
                                                                                            null,
                                                                                            function () {
                                                                                                visualizationMsg("[" + name + "]::: cannot be initialized requested modules did not load.", { type: "[bad]" });
                                                                                                Loader.Starter.error();
                                                                                            },
                                                                                            function () {
                                                                                                visualizationMsg("[" + name + "]::: requested modules are loaded.", { type: "[ok]" });
                                                                                            });
                                            },
                                            10
                                );
                                //console.log("[task add]::: Make.module(" + name + ")");
                                return false;
                            }
                        } else {
                            //Регистрируем модуль, как собранный
                            Make.holded.methods.accept(name);
                        }
                    }
                    return null;
                },
                //Создает необходимое пространство имен в блоке ModulesStorage
                namespace   : function (strNamespace) {
                    var resultObject    = {},
                        allSteps        = [],
                        wayInModules    = ModulesStorage,
                        parentObject    = null;
                    if (typeof strNamespace === "string") {
                        try {
                            allSteps = strNamespace.split(".");
                            for (var Index = 0, MaxIndex = allSteps.length; Index < MaxIndex; Index += 1) {
                                if (!wayInModules[allSteps[Index]]) {
                                    wayInModules[allSteps[Index]] = {};
                                }
                                parentObject = wayInModules;
                                wayInModules = wayInModules[allSteps[Index]];
                            }
                            return {
                                parent  : parentObject,
                                property: allSteps[Index - 1]
                            }
                        } catch (e) {
                            return null;
                        }
                    }
                    return null;
                }
            };
            //Блок сообщенйи в консоль
            Logs = {
                show: function (message, criticalFlag, usePurityLogs) {
                    function showMessage() {
                        var module = null;
                        if (usePurityLogs === false || !window.console) {
                            if (window.console) {
                                if (window.console.log) {
                                    window.console.log("Purity initializer::: " + message);
                                } else {
                                    if (criticalFlag === true) {
                                        alert("Purity initializer::: " + message);
                                    }
                                }
                            }
                        } else {
                            if (Builder.isLoaded("Developer.Console") === true) {
                                module = new Purity.initModule("Developer.Console");
                                module.console.message({ message: message });
                                module = null;
                            }
                        }
                    };
                    var message         = (typeof message       !== "undefined" ? message       : null),
                        criticalFlag    = (typeof criticalFlag  === "boolean"   ? criticalFlag  : false),
                        usePurityLogs   = (typeof usePurityLogs === "boolean"   ? usePurityLogs : false);
                    if (message !== null) {
                        if (Loader.Configurator.data.Visualization.consoleLogs === true || criticalFlag === true) {
                            showMessage();
                        }
                    }
                },
            };
            //---< Private part		>--[end]---------------------------------------------------------------------------------------
            //---< Security part	>--[begin]---------------------------------------------------------------------------------------
            publicPrototypes    = Prototypes;
            //Инициализация модуля
            initModule          = Builder.module;
            //Создание модуля или загрузка модуля
            createModule        = Make.module;
            //Проверяет загружено ли тело модуля. Иными словами - сам файл модуля (скрипт)
            isModuleCreated     = Builder.isLoaded;
            //Любой внешний запрос
            publicSystem        = {
                ajax        : System.Ajax.Processing.send,
                runFunc     : System.runFunction,
                runHandle   : System.runHandle,
                Events      : {
                    addListener     : System.Events.addListener,
                    removeListener  : System.Events.removeListener
                },
                Storage      : {
                    write: System.Storage.Controls.setValue,
                    read : System.Storage.Controls.getValue
                },
                Convertor: {
                    UTF8    : System.Convertor.UTF8,
                    BASE64  : System.Convertor.BASE64
                },
                Resources: {
                    css     : System.Resources.CSS,
                    js      : System.Resources.JS
                }
            };
            publicResource = {
                save    : Loader.Resources.External.virtualStorage.save,
                get     : Loader.Resources.External.virtualStorage.get,
                remove  : Loader.Resources.External.virtualStorage.remove
            };
            //Запуск начальной загрузки
            publicStarter               = Loader.Starter.start;
            //Присоединение визуализатора загразки
            publicAttachVisualization   = Loader.Visualization.attach;
            //---< Security part	>--[end]---------------------------------------------------------------------------------------
            //---< Init part	    >--[begin]---------------------------------------------------------------------------------------
            System.init();
            Loader.init();
            //---< Init part	    >--[end]---------------------------------------------------------------------------------------
            return {
                AboutLibrary        : {
                    getName     : function () { return name;    },
                    getVersion  : function () { return version; },
                    getAuthor   : function () { return author;  }
                },
                Prototypes          : publicPrototypes,
                initModule          : initModule,
                createModule        : createModule,
                isModuleCreated     : isModuleCreated,
                System              : publicSystem,
                start               : publicStarter,
                attachVisualization : publicAttachVisualization,
                Resource            : publicResource,
                Statistics          : Loader.Statistics,
                ModulesStorage      : ModulesStorage,
                data                : Make.holded.data,
                cross               : Make.crossing
            }
        }());
        //Объявляем глобальный объект библиотеки Purity
        window["Purity"] = new PurityPrototype();
        Purity.start();
    }
}());
/*
Если внешний ресурс инициализирован, то надо удалить его из вируального хранилища
*/