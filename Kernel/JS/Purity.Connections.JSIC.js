/*global Purity*/
// It never hurts to try
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <module>
///     <summary>
///         Controll connetions to server by JSIC
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("Connections.JSIC",
            //Check references
            null,
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Purity.Connections.JSIC",
                    version         = "1.0",
                    lastUpdate      = "17.06.2013",
                    author          = "Dmitry Astafyev",
                //Declaration module's blocks
                    Config          = null,
                    Tracking        = null,
                    Scripts         = null,
                    Results         = null,
                    Events          = null,
                    publicMethods   = null;
                //Declaration references
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                //Конфигурация
                Config = {
                    timeout         : 20000, //ms
                    storagePrefix   : "JSICTrack",
                    storageProperty : "Purity.JSICTemporaryStorage",
                    waitHeadTimeout : 500, //ms
                    attemptsCount   : 3
                };
                //Очередь заданий
                Tracking = {
                    Data: {
                        tracks      : [],
                        IDs         : [],
                        currentID   : 0
                    },
                    Methods: {
                        //Добавляет задание на подключение
                        add: function (params) {
                            ///     <summary>Add task for JSIN asyn request by defined URL. [value] - default value.</summary>
                            ///     <param name="params" type="Object">
                            ///         {url        : string,               &#13;&#10;
                            ///          part       : number,       [1]     &#13;&#10;                  
                            ///          partsize   : number,       [40960] &#13;&#10;               
                            ///          onfinish   : function,     [null]  &#13;&#10;              
                            ///          onstep     : function,     [null]  &#13;&#10;              
                            ///          onerror    : function,     [null]  &#13;&#10;               
                            ///          ontimeout  : function,     [null]  &#13;&#10;
                            ///          command    : string,       ["get"] &#13;&#10;
                            ///          group      : string,       ["auto"] &#13;&#10;
                            ///         }
                            ///     </param>
                            ///     <returns type="boolean" mayBeNull="true">Null - if error. ID of tast (string) - if is OK.</returns>
                            if (params) {
                                var url         = (typeof (params.url)          === "string"    ? params.url        : null),
                                    part        = (typeof (params.part)         === "number"    ? params.part       : 0),
                                    partsize    = (typeof (params.partsize)     === "number"    ? params.partsize   : 40960),
                                    onfinish    = (typeof (params.onfinish)     === "function"  ? params.onfinish   : null),
                                    onstep      = (typeof (params.onstep)       === "function"  ? params.onstep     : null),
                                    onerror     = (typeof (params.onerror)      === "function"  ? params.onerror    : null),
                                    ontimeout   = (typeof (params.ontimeout)    === "function"  ? params.ontimeout  : null),
                                    command     = (typeof (params.command)      === "string"    ? params.command    : "get"),
                                    group       = (typeof (params.group)        === "string" || 
                                                   typeof (params.group)        === "number"    ? params.group      : Tracking.Data.currentID),
                                    tracks      = Tracking.Data.tracks,
                                    IDs         = Tracking.Data.IDs,
                                    processing  = Tracking.Methods.Processing,
                                    trackID     = group + "_" + part;
                                if (url !== null) {
                                    //Проверяем установлено ли уже задание
                                    if (IDs.indexOf(trackID) === -1){
                                        //Инициализируем хранилище
                                        Results.Methods.Storage.Init.set();
                                        //Сохраняем данные
                                        tracks.push({
                                            url         : url,
                                            part        : part,
                                            partsize    : partsize,
                                            onfinish    : onfinish,
                                            onstep      : onstep,
                                            onerror     : onerror,
                                            ontimeout   : ontimeout,
                                            id          : trackID,
                                            isfired     : false,
                                            group       : group,
                                            attempts    : 0,
                                            command     : command
                                        });
                                        IDs.push(trackID);
                                        Tracking.Data.currentID += 1;
                                        Tracking.Data.currentID = (Tracking.Data.currentID > 32000 ? 0 : Tracking.Data.currentID);//Да будет исключено переполнение
                                        //Запускаем обработку
                                        processing.fire();
                                    }
                                    return trackID;
                                }
                            }
                            return null;
                        },
                        //Удаляет задание
                        remove: function (taskID) {
                            var taskID      = (typeof taskID === "string" ? taskID : null),
                                tracks      = Tracking.Data.tracks,
                                IDs         = Tracking.Data.IDs,
                                taskIndex   = IDs.indexOf(taskID);
                            if (taskIndex !== -1) {
                                //Удаляем таймер
                                if (typeof tracks[taskIndex].timer !== "undefined") {
                                    clearTimeout(tracks[taskIndex].timer);
                                }
                                //Удаляем задачу
                                IDs.    splice(taskIndex, 1);
                                tracks. splice(taskIndex, 1);
                                //Очищаем хранилище
                                Results.Methods.Storage.Init.unset();
                                return true;
                            }
                            return null;
                        },
                        //Обработка заданий
                        Processing: {
                            //Возвращает имя переменной (оно же ID скрипта)
                            getStoragePropertyName : function(trackData){
                                var trackData       = (typeof trackData === "object" ? trackData : null);
                                if (trackData !== null){
                                    return Config.storageProperty + "." + Config.storagePrefix + trackData.id;
                                }
                                return null;
                            },
                            //Подготовка строки запроса
                            /*
                            command:
                            storage:
                            count:
                            size:
                            requested:
                            */
                            request : function(trackData){
                                var trackData       = (typeof trackData === "object" ? trackData : null),
                                    requestString   = "JSIC=";
                                if (trackData !== null) {
                                    requestString +=    "command:"      + trackData.command                                             + ";" +
                                                        "storage:"      + Tracking.Methods.Processing.getStoragePropertyName(trackData) + ";" +
                                                        "requested:"    + trackData.part                                                + ";" +
                                                        "size:"          + trackData.partsize;
                                    return (trackData.url.indexOf("?") === -1 ? trackData.url + "?" + requestString : trackData.url + "&" + requestString);
                                }
                                return null;
                            },
                            //Находит ближайщее неисполненное задание
                            getTrack: function () {
                                var tracks  = Tracking.Data.tracks,
                                    IDs = Tracking.Data.IDs;
                                for (var index = tracks.length - 1; index >= 0; index -= 1) {
                                    if (tracks[index].isfired === false) {
                                        tracks[index].isfired = true;
                                        return tracks[index];
                                    }
                                }
                                return null;
                            },
                            //Обработка
                            fire: function () {
                                var processing      = Tracking.Methods.Processing,
                                    processingTask  = processing.getTrack(),
                                    request         = null,
                                    head            = document.head,
                                    availability    = processing.Availability;
                                if (processingTask !== null) {
                                    //Получаем строку запроса
                                    request = processing.request(processingTask);
                                    if (request !== null) {
                                        //Проверяем готов ли документ к подключению скриптов
                                        if (head !== null){
                                            //Очищаем ожидаение (если было установлено)
                                            availability.clear();
                                            //Создаем объект скрипта и внедряем его
                                            Scripts.create(processingTask, request);
                                        } else {
                                            //Если скрипты пока подключать не можем, откладываем обработку
                                            availability.wait();
                                        }
                                    }
                                }
                            },
                            //Ожидание head докмента
                            Availability: {
                                wait: function () {
                                    var processing = Tracking.Methods.Processing;
                                    if (typeof processing.Availability.idTimer !== "undefined") {
                                        processing.Availability.idTimer = setTimeout(processing.fire, Config.waitHeadTimeout);
                                    }
                                },
                                clear: function () {
                                    var processing = Tracking.Methods.Processing;
                                    if (typeof processing.Availability.idTimer !== "undefined") {
                                        clearTimeout(processing.Availability.idTimer);
                                        processing.Availability.idTimer = null;
                                        delete processing.Availability.idTimer;
                                    }
                                }
                            }
                        },
                        //Возвращает объект задачи
                        getTrack: function (idTrack) {
                            var idTrack         = (typeof idTrack === "string" ? idTrack : null),
                                tracksData      = Tracking.Data,
                                trackIndex      = (idTrack !== null ? tracksData.IDs.indexOf(idTrack) : -1);
                            return (trackIndex !== -1 ? tracksData.tracks[trackIndex] : null);
                        }
                    }
                };
                //Блок по работе с объектами SCRIPT
                Scripts = {
                    getScriptID : function(trackDataOrTrackID){
                        var trackData   = (typeof trackDataOrTrackID === "object" ? trackDataOrTrackID : null),
                            trackID     = (typeof trackDataOrTrackID === "string" ? trackDataOrTrackID : null),
                            tracks      = Tracking.Data.tracks,
                            IDs         = Tracking.Data.IDs,
                            trackIndex  = null;
                        if (trackID !== null){
                            trackIndex = IDs.indexOf(trackID);
                            if (trackIndex !== -1){
                                trackData = tracks[trackIndex];
                            }
                        }
                        if (trackData !== null){
                            return Tracking.Methods.Processing.getStoragePropertyName(trackData);
                        }
                        return null;
                    },
                    create: function (trackData, request) {
                        var trackData       = (typeof trackData === "object" ? trackData    : null),
                            request         = (typeof request   === "string" ? request      : null),
                            scriptObject    = null,
                            setEvent        = Purity.System.Events.addListener;
                        if (trackData !== null && request !== null) {
                            //Создаем объект скрипта
                            scriptObject            = document.createElement("SCRIPT");
                            scriptObject.type       = "text/javascript";
                            scriptObject.id         = Scripts.getScriptID(trackData);
                            scriptObject.src        = request;
                            //Устанавливаем таймаут
                            trackData.timer = setTimeout(function () { Events.ontimeout(trackData.id); },
                                                         Config.timeout);
                            //Устанавливаем другие события
                            setEvent(scriptObject, "load",  function (e) { Events.onload(trackData.id, e);  });
                            setEvent(scriptObject, "error", function (e) { Events.onerror(trackData.id, e); });
                            //Внедряем объект
                            document.head.appendChild(scriptObject);
                            return true;
                        }
                        return null;
                    },
                    remove: function (trackID) {
                        var trackID         = (typeof trackID === "string" ? trackID : null),
                            scriptObject    = null;
                        if (trackID !== null) {
                            scriptObject = document.getElementById(Scripts.getScriptID(trackID));
                            if (typeof scriptObject.nodeName === "string") {
                                scriptObject.parentNode.removeChild(scriptObject);
                                return true;
                            }
                        }
                        return null;
                    }
                };
                //Блок результатов
                Results = {
                    Data: {
                        recievedData: {}
                    },
                    Methods: {
                        getStorageProperty: function (storageID) {
                            var storageID   = (typeof storageID === "string" ? storageID : null),
                                properties  = null,
                                property    = window;
                            if (storageID !== null) {
                                properties = storageID.split(".");
                                for (var index = 0, maxIndex = properties.length; index < maxIndex; index += 1) {
                                    if (typeof property[properties[index]] !== "undefined") {
                                        property = property[properties[index]];
                                    }
                                }
                                return (property === window ? null : property);
                            }
                            return null;
                        },
                        removeStorageProperty: function (storageID) {
                            var storageID       = (typeof storageID === "string" ? storageID : null),
                                properties      = null,
                                property        = window,
                                parentProperty  = null,
                                propertyName    = null;
                            if (storageID !== null) {
                                properties = storageID.split(".");
                                for (var index = 0, maxIndex = properties.length; index < maxIndex; index += 1) {
                                    if (typeof property[properties[index]] !== "undefined") {
                                        parentProperty  = property;
                                        property        = property[properties[index]];
                                        propertyName    = properties[index];
                                    }
                                }
                                if (property        !== window  && parentProperty !== window &&
                                    parentProperty  !== null    && parentProperty !== Purity && 
                                    propertyName    !== null) {
                                    property = null;
                                    delete parentProperty[propertyName];
                                    return true;
                                }
                            }
                            return null;
                        },
                        validate: function (storageProperty) {
                            var storageProperty = (typeof storageProperty === "object" ? storageProperty : null);
                            if (storageProperty !== null) {
                                if (typeof storageProperty.size     !== "number") { return false; }
                                if (typeof storageProperty.count    !== "number") { return false; }
                                if (typeof storageProperty.number   !== "number") { return false; }
                                if (typeof storageProperty.value    !== "string") { return false; }
                                return true;
                            }
                            return false;
                        },
                        extractBasicName: function (idScript) {
                            var idScript    = (typeof idScript === "string" ? idScript : null),
                                endPosition = null;
                            if (idScript !== null) {
                                endPosition = idScript.indexOf("_");
                                if (endPosition !== -1){
                                    return idScript.substr(0, endPosition)
                                }
                            }
                            return null;
                        },
                        save: function (idScript, trackID) {
                            function copyObject(sourceObject, part) {
                                var resultObject    = {},
                                    part            = (typeof part === "number" ? part : null);
                                for (var PropertyName in sourceObject) {
                                    resultObject[PropertyName] = sourceObject[PropertyName];
                                }
                                if (part !== null) {
                                    resultObject.part = part;
                                }
                                return resultObject;
                            };
                            var idScript            = (typeof idScript  === "string" ? idScript : null),
                                trackID             = (typeof trackID   === "string" ? trackID  : null),
                                storageProperty     = null,
                                resultMethods       = Results.Methods,
                                basicPropertyName   = null,
                                storageSlot         = null,
                                processingTrack     = null,
                                convertString       = null,
                                convertor           = Purity.System.Convertor.BASE64;
                            if (idScript !== null) {
                                //Проверяем наличие переменной
                                storageProperty = copyObject(resultMethods.getStorageProperty(idScript), null);
                                if (storageProperty !== null) {
                                    //Удаляем скрипт
                                    Scripts.remove(trackID);
                                    //Удаляем переменную
                                    resultMethods.removeStorageProperty(idScript);
                                    //Проверяем переменную
                                    if (resultMethods.validate(storageProperty) === true) {
                                        basicPropertyName = resultMethods.extractBasicName(idScript);
                                        if (basicPropertyName !== null) {
                                            storageSlot = resultMethods.Storage.getSlot(basicPropertyName);
                                            storageSlot = resultMethods.Storage.prepareSlot(storageSlot, storageProperty);
                                            if (storageSlot !== null) {
                                                //Сохраняем текущие данные 
                                                if (storageSlot.count > storageProperty.number) {
                                                    convertString = convertor.decode(storageProperty.value);
                                                    storageSlot.parts.splice(storageProperty.number, 1, convertString);
                                                    //storageSlot.parts.splice(storageProperty.number, 1, storageProperty.value);
                                                    storageSlot.loaded += 1;
                                                    if (storageSlot.count === storageSlot.loaded) {
                                                        //Загрузка завершена. Склеиваем результат
                                                        processingTrack = Tracking.Methods.getTrack(trackID);
                                                        storageSlot     = resultMethods.Storage.makeResult(storageSlot, processingTrack.command);
                                                        if (storageSlot !== null) {
                                                            return { status : "ready", message : "" };
                                                        } else {
                                                            return { status: "error", message: "cannot make result" };
                                                        }
                                                    } else {
                                                        //Если у нас идет первая часть, то хараняем параметры запроса
                                                        if (storageProperty.number === 0) {
                                                            //Достаем задание и создаем его копию
                                                            processingTrack = Tracking.Methods.getTrack(trackID);
                                                            if (processingTrack !== null) {
                                                                storageSlot.track = copyObject(processingTrack);
                                                            } else {
                                                                return { status: "error", message: "cannot read track info" };
                                                            }
                                                        }
                                                        //Делаем задания на оставшиеся части (задание не будет добавлено, если оно уже есть в очереди)
                                                        for (var index = 0, maxIndex = storageSlot.count; index < maxIndex; index += 1) {
                                                            if (typeof storageSlot.parts[index] === "undefined") {
                                                                Tracking.Methods.add(copyObject(storageSlot.track, index));
                                                            }
                                                        }
                                                        return { status: "wait", message: "wait other parts", loaded: storageSlot.loaded, count: storageSlot.count };
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } 
                                //Переменная не найдена. Либо данные некоректны.
                                return { status: "error", message: "cannot find such script" };
                            }

                        },
                        get: function (idScript) {
                            var idScript            = (typeof idScript  === "string" ? idScript : null),
                                storageProperty     = null,
                                resultMethods       = Results.Methods,
                                basicPropertyName   = null,
                                storageSlot         = null,
                                resultString        = "error getting data";
                            if (idScript !== null) {
                                basicPropertyName = resultMethods.extractBasicName(idScript);
                                if (basicPropertyName !== null) {
                                    storageSlot = resultMethods.Storage.getSlot(basicPropertyName);
                                    if (storageSlot !== null) {
                                        resultString = storageSlot.resultString;
                                        resultMethods.Storage.removeSlot(basicPropertyName);
                                    }
                                }
                            }
                            return resultString;
                        },
                        Storage: {
                            prepareBasicName: function (basicPropertyName) {
                                var basicPropertyName   = (typeof basicPropertyName === "string" ? basicPropertyName : null);
                                if (basicPropertyName !== null) {
                                    //Очищаем выражение от точек
                                    return basicPropertyName.replace(/\.*/gmi, "");
                                }
                                return null;
                            },
                            prepareSchemeObject:function(sourceString){
                                var sourceString    = (typeof sourceString === "string" ? sourceString.toLowerCase() : null),
                                    schemeObject    = {},
                                    pairs           = [],
                                    keyValue        = [];
                                if (sourceString !== null) {
                                    pairs = sourceString.split(";");
                                    for (var index = pairs.length - 1; index >= 0; index -= 1) {
                                        keyValue = pairs[index].split(":");
                                        if (keyValue.length === 2) {
                                            schemeObject[keyValue[0]] = keyValue[1];
                                        }
                                    }
                                }
                                return (Object.keys(schemeObject).length > 0 ? schemeObject : null);
                            },
                            getSlot: function (basicPropertyName) {
                                var basicPropertyName   = (typeof basicPropertyName === "string" ? Results.Methods.Storage.prepareBasicName(basicPropertyName) : null);
                                if (basicPropertyName !== null) {
                                    //Производим проверку
                                    if (typeof Results.Data.recievedData[basicPropertyName] === "undefined") {
                                        Results.Data.recievedData[basicPropertyName] = {};
                                    }
                                    return Results.Data.recievedData[basicPropertyName];
                                }
                                return null;
                            },
                            prepareSlot: function (storageSlot, storageProperty) {
                                var storageSlot     = (typeof storageSlot       === "object" ? storageSlot      : null),
                                    storageProperty = (typeof storageProperty   === "object" ? storageProperty  : null);
                                if (storageProperty !== null && storageSlot !== null) {
                                    if (typeof storageSlot.count    === "undefined" ||
                                        typeof storageSlot.parts    === "undefined" ||
                                        typeof storageSlot.loaded   === "undefined") {
                                        storageSlot.count   = storageProperty.count;
                                        storageSlot.loaded  = 0;
                                        storageSlot.parts   = new Array(storageSlot.count);
                                    }
                                    return storageSlot;
                                }
                                return null;
                            },
                            makeResult: function (storageSlot, command) {
                                var storageSlot     = (typeof storageSlot   === "object" ? storageSlot              : null),
                                    command         = (typeof command       === "string" ? command.toLowerCase()    : null),
                                    resultString    = "";
                                if (storageSlot !== null) {
                                    for (var index = 0, maxIndex = storageSlot.count; index < maxIndex; index += 1) {
                                        if (typeof storageSlot.parts[index] !== "string") {
                                            return null;
                                        } else {
                                            resultString = resultString + storageSlot.parts[index];
                                        }
                                    }
                                    storageSlot.resultString    = resultString;
                                    storageSlot.parts           = null;
                                    delete storageSlot.parts;
                                    if (command === "info") {
                                        storageSlot.resultString = Results.Methods.Storage.prepareSchemeObject(storageSlot.resultString);
                                    }
                                    return storageSlot;
                                }
                                return null;
                            },
                            removeSlot: function (basicPropertyName) {
                                var basicPropertyName   = (typeof basicPropertyName === "string" ? Results.Methods.Storage.prepareBasicName(basicPropertyName) : null);
                                if (basicPropertyName !== null) {
                                    if (typeof Results.Data.recievedData[basicPropertyName] !== "undefined") {
                                        Results.Data.recievedData[basicPropertyName] = null;
                                        delete Results.Data.recievedData[basicPropertyName];
                                        return true;
                                    }
                                }
                                return false;
                            },
                            Init: {
                                set: function () {
                                    var allProperties   = Config.storageProperty.split("."),
                                        currentProperty = window,
                                        parentStorage   = null,
                                        propertyName    = null;
                                    if (typeof Config.Storage === "undefined"){
                                        for (var index = 0, maxIndex = allProperties.length; index < maxIndex; index += 1) {
                                            propertyName = allProperties[index];
                                            if (typeof currentProperty[propertyName] === "undefined") {
                                                currentProperty[propertyName] = {};
                                            }
                                            parentStorage   = currentProperty;
                                            currentProperty = currentProperty[propertyName];
                                        }
                                        //Сохраняем данные
                                        Config.Storage                      = {};
                                        Config.Storage.parentStorage        = parentStorage;
                                        Config.Storage.storagePropertyName  = propertyName;
                                    }
                                },
                                unset: function () {
                                    var tracking            = Tracking.Data,
                                        results             = Results.Data.recievedData,
                                        parentStorage       = null,
                                        storagePropertyName = null;
                                    if (tracking.tracks.length === 0 && Object.keys(Results.Data.recievedData).length === 0) {
                                        if (typeof Config.Storage === "object") {
                                            if (typeof Config.Storage.parentStorage !== "undefined" && typeof Config.Storage.storagePropertyName !== "undefined") {
                                                parentStorage                       = Config.Storage.parentStorage;
                                                storagePropertyName                 = Config.Storage.storagePropertyName;
                                                parentStorage[storagePropertyName]  = null;
                                                delete parentStorage[storagePropertyName];
                                                Config.Storage                      = null;
                                                delete Config["Storage"];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                //Блок событий
                Events = {
                    getTrack: function (idTrack) {
                    },
                    runHandle : function(handle, params){
                        var handle = (typeof handle === "function" ? handle : null);
                        Purity.System.runHandle(handle, params, "[Connections.JSIC][Events.runHandle]", this);
                    },
                    onload: function (idTrack, e) {
                        var idTrack         = (typeof idTrack === "string" ? idTrack : null),
                            processing      = Tracking.Methods.Processing,
                            processingTask  = Tracking.Methods.getTrack(idTrack),
                            storageProperty = null,
                            scriptID        = null,
                            savingStatus    = null;
                        if (processingTask !== null) {
                            //Получаем идентификатор скрипта
                            scriptID = Scripts.getScriptID(idTrack);
                            if (scriptID !== null) {
                                //Пытаемся сохранить данные
                                savingStatus = Results.Methods.save(scriptID, idTrack);
                                //Проверяем результат
                                switch (savingStatus.status) {
                                    case "ready":
                                        Events.runHandle(processingTask.onfinish, Results.Methods.get(scriptID));
                                        break;
                                    case "wait":
                                        Events.runHandle(processingTask.onstep, { count: savingStatus.count, loaded: savingStatus.loaded});
                                        break;
                                    case "error":
                                        Events.runHandle(processingTask.onerror, savingStatus.message);
                                        break;
                                }
                                //Удаляем задание
                                Tracking.Methods.remove(idTrack);
                            }
                        }
                    },
                    onerror: function (idTrack, e) {
                        var idTrack         = (typeof idTrack === "string" ? idTrack : null),
                            processing      = Tracking.Methods.Processing,
                            processingTask  = Tracking.Methods.getTrack(idTrack);
                        if (processingTask !== null) {
                            //Удаляем объект скрипта
                            Scripts.remove(idTrack);
                            //Запускаем обработчик
                            Events.runHandle(processingTask.onerror, null);
                            //Удаляем задание
                            Tracking.Methods.remove(processingTask.id);
                        }
                    },
                    ontimeout: function (idTrack) {
                        var idTrack         = (typeof idTrack === "string" ? idTrack : null),
                            processing      = Tracking.Methods.Processing,
                            processingTask  = Tracking.Methods.getTrack(idTrack);
                        if (processingTask !== null) {
                            //Удаляем объект скрипта
                            Scripts.remove(idTrack);
                            //Проверяем количество попыток
                            if (processingTask.attempts < Config.attemptsCount) {
                                processingTask.isfired = false;
                                processingTask.attempts += 1;
                                processing.fire();
                            } else {
                                //Запускаем обработчик
                                Events.runHandle(processingTask.ontimeout, null);
                                //Удаляем задание
                                Tracking.Methods.remove(processingTask.id);
                            }
                        }
                    },
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicMethods = {
                    get: function (params) {
                        ///     <summary>Add task for JSIN asyn request by defined URL. [value] - default value.</summary>
                        ///     <param name="params" type="Object">
                        ///         {url        : string,               &#13;&#10;
                        ///          onfinish   : function,     [null]  &#13;&#10;              
                        ///          onstep     : function,     [null]  &#13;&#10;              
                        ///          onerror    : function,     [null]  &#13;&#10;               
                        ///          ontimeout  : function,     [null]  &#13;&#10;
                        ///         }
                        ///     </param>
                        ///     <returns type="boolean" mayBeNull="true">Null - if error. ID of tast (string) - if is OK.</returns>
                        var params = (typeof params === "object" ? params : null);
                        if (params !== null) {
                            params.command  = "get";
                            params.part     = null;
                            params.partsize = null;
                            return Tracking.Methods.add(params);
                        }
                        return null;
                    },
                    scheme: function (url, answerHandle, errorHandle) {
                        ///     <summary>Return information about of transfer's scheme: count of parts, part's size and etc.</summary>
                        ///     <param name="url" type="Object">string::: URL of JSIC data</param>
                        ///     <param name="answerHandle" type="Object">function::: handle which be called on finich</param>
                        ///     <param name="errorHandle" type="Object">function::: handle which be called on error</param>
                        ///     <returns type="boolean" mayBeNull="true">Null - if error. ID of tast (string) - if is OK.</returns>
                        var url = (typeof url === "string" ? url : null),
                            answerHandle    = (typeof answerHandle  === "function"  ? answerHandle  : null),
                            errorHandle     = (typeof errorHandle   === "function"  ? errorHandle   : null),
                            params = {};
                        if (url !== null && answerHandle !== null) {
                            params.url          = url;
                            params.command      = "info";
                            params.part         = null;
                            params.partsize     = null;
                            params.onfinish     = answerHandle;
                            params.onstep       = null;
                            params.onerror      = errorHandle;
                            params.ontimeout    = errorHandle;
                            return Tracking.Methods.add(params);
                        }
                        return null;
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
                    get         : publicMethods.get,
                    scheme      : publicMethods.scheme
                    //ServerDatas : {}//Хранилище результатов
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());