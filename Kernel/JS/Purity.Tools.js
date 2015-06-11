/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <reference path="~/Kernel/JS/Purity.Developer.Console.js" />
/// <module>
///     <summary>
///         Module has some methods which applied in many cases.
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("Tools",
            //Check references
            {
                modules     : ["HTML"],
                resources   : null
            },
                //Prototype part
                function () {
                /// <summary>Discription of library</summary>
                var name                = "Purity::: Tools",
                    version             = "1.0",
                    lastUpdate          = "29.05.2013",
                    author              = "Dmitry Astafyev",
                    //Declaration module's blocks
                    adArray             = {},
                    Run                 = {},
                    Vars                = {},
                    URL                 = {},
                    Objects             = {},
                    IDs                 = {},
                    Log                 = {},
                    publicArray         = {},
                    publicRun           = {},
                    publicVars          = {},
                    publicURL           = {},
                    publicObject        = {},
                    publicLog           = {},
                    publicIDs           = {},
                    //Declaration references
                    DeveloperConsole    = null,//Optional module
                    DeveloperLogs       = null,//Optional module
                    HTML                = new Purity.initModule("HTML");
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                //Инструменты по работе с массивами
                adArray = {
                    //Проверяет является ли экземпляр переданного объекта массивом
                    Is: function (ObjectPointer) {
                        if (typeof ObjectPointer === "object") {
                            if (ObjectPointer instanceof Array) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return null;
                    },
                    /*EnumerationMode - необязательный параметр. Если он опущен, либо равен false, то проверка производится стандартным методом
                    indexOf(). Если данный флаг установлен в true, то производится полный перебор массива. Для массива, содержащего более 100 элементов
                    используется бинарный метод поиска со случайным выбором проверяемой части массива.*/
                    In: function (objArray, Element, EnumerationMode) {
                        function BinarySearch(sourceArray, checkedElement) {
                            function IsInArray(sourceArray, checkedElement) {
                                for (var Index = sourceArray.length - 1; Index >= 0; Index -= 1) {
                                    if (sourceArray[Index] === checkedElement) {
                                        return true;
                                    }
                                }
                                return false;
                            };
                            var arrayLength     = sourceArray.length,
                                lengthPartOne   = null;
                                lengthPartTwo   = null;
                                arrayPartOne    = null;
                                arrayPartTwo    = null;
                                antiLoop        = 0;
                            if (arrayLength > 100) {
                                do {
                                    lengthPartOne = Math.floor(arrayLength / 2);
                                    lengthPartTwo = arrayLength - lengthPartOne;
                                    arrayPartOne = sourceArray.slice(0, lengthPartOne - 1);
                                    arrayPartTwo = sourceArray.slice(lengthPartOne - 1, arrayLength);
                                    //Случайным образом выбираем половину массива, которую будем проверять
                                    if (Math.random() > 0.5) {
                                        if (IsInArray(arrayPartOne, checkedElement) === true) {
                                            return true;
                                        } else {
                                            return BinarySearch(arrayPartTwo, checkedElement);
                                        }
                                    } else {
                                        if (IsInArray(arrayPartTwo, checkedElement) === true) {
                                            return true;
                                        } else {
                                            return BinarySearch(arrayPartOne, checkedElement);
                                        }
                                    }
                                    antiLoop += 1;
                                } while (antiLoop < 100);
                                return null;
                            } else {
                                return IsInArray(sourceArray, checkedElement);
                            }
                        };
                        if (adArray.Is(objArray) === true && typeof Element !== "undefined") {
                            if (typeof EnumerationMode !== "boolean") {
                                var EnumerationMode = false;
                            }
                            switch (EnumerationMode) {
                                case true:
                                    return BinarySearch(objArray, Element);
                                    break;
                                case false:
                                    if (objArray.indexOf(Element) === -1) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                    break;
                            }
                        }
                        return false;
                    },
                    //Парсит строковый массив в числовой
                    StrToInt: function (SourceArray) {
                        var ResultArray = null;
                        if (adArray.Is(SourceArray) === true) {
                            try {
                                ResultArray = SourceArray;
                                for (var Index = (ResultArray.length - 1) ; Index >= 0; Index -= 1) {
                                    ResultArray[Index] = parseInt(ResultArray[Index], 10);
                                }
                                return ResultArray;
                            } catch (e) {
                                return null;
                            }
                        }
                        return null;
                    },
                    copy: function (targetArray, sourceArray) {
                        var targetArray = (targetArray instanceof Array ? targetArray : []  ),
                            sourceArray = (sourceArray instanceof Array ? sourceArray : null);
                        if (targetArray !== null && sourceArray !== null) {
                            for (var index = sourceArray.length - 1; index >= 0; index -= 1) {
                                if (sourceArray[index] instanceof Array) {
                                    targetArray.unshift([]);
                                    targetArray[0] = adArray.copy(targetArray[0], sourceArray[index]);
                                } else {
                                    targetArray.unshift(sourceArray[index]);
                                }
                            }
                            return targetArray;
                        }
                    }
                };
                //Инструмены по запуску методов
                Run = {
                    //Пытается запустить указанный метод. Запуск осуществляется в безопасном режиме, то есть без eval и new Function
                    Method: function (strMethodName, funcParams) {
                        if (typeof funcParams       === "undefined" ) { var funcParams = null;  }
                        if (typeof strMethodName    !== "string"    ) { return null;            }
                        if (strMethodName           === ""          ) { return null;            }
                        //узнаем глубину цепочки
                        var arrayNamespaceChain = strMethodName.split("."),
                            currentObject       = null,
                            ResultMethod        = null;
                        try {
                            if (arrayNamespaceChain.length > 1) {
                                for (var Index = 0, MaxIndex = arrayNamespaceChain.length; Index < MaxIndex; Index += 1) {
                                    if (Index !== (MaxIndex - 1)) {
                                        if (currentObject === null) {
                                            currentObject = window[arrayNamespaceChain[Index]];
                                        } else {
                                            currentObject = currentObject[arrayNamespaceChain[Index]];
                                        }
                                        if (typeof currentObject !== "object") {
                                            return null;
                                        };
                                    } else if (Index === (MaxIndex - 1)) {
                                        ResultMethod = currentObject[arrayNamespaceChain[Index]](funcParams);
                                    }
                                }
                            } else if (arrayNamespaceChain.length === 1) {
                                ResultMethod = window[strMethodName](funcParams);
                            }
                            return ResultMethod;
                        } catch (e) {
                            return null;
                        }
                    }
                };
                //Инструмены по работе с переменными
                Vars = {
                    //Определяет существует ли переменная
                    IsExists: function (strVariableName) {
                        if (typeof strVariableName === "string") {
                            //узнаем глубину цепочки
                            var arrayNamespaceChain = strVariableName.split("."),
                                currentObject       = null;
                            try {
                                for (var Index = 0, MaxIndex = arrayNamespaceChain.length; Index < MaxIndex; Index += 1) {
                                    if (currentObject === null) {
                                        currentObject = window[arrayNamespaceChain[Index]];
                                    } else {
                                        currentObject = currentObject[arrayNamespaceChain[Index]];
                                    }
                                    if (typeof currentObject === "undefined") {
                                        return false;
                                    };
                                }
                                return true;
                            } catch (e) {
                                return null;
                            }
                        }
                        return null;
                    },
                    //Определяет равна (или НЕ равна) ли переменная заданному значению. Особенность метода в умении проводить групповые опрерации
                    Equality: {
                        check: function (targetVar, value, mode) {
                            if (typeof targetVar !== "undefined" && typeof value !== "undefined" && typeof mode === "string") {
                                if ((targetVar instanceof Array) !== true) {
                                    targetVar = [targetVar];
                                }
                                for (var Index = targetVar.length - 1; Index >= 0; Index -= 1) {
                                    switch (mode) {
                                        case "is":
                                            if (targetVar[Index] !== value) {
                                                return false;
                                            }
                                            break;
                                        case "not":
                                            if (targetVar[Index] === value) {
                                                return false;
                                            }
                                            break;
                                    }
                                }
                                return true;
                            }
                        },
                        is: function (targetVar, value) {
                            return Vars.Equality.check(targetVar, value, "is");
                        },
                        not: function (targetVar, value) {
                            return Vars.Equality.check(targetVar, value, "not");
                        }
                    },
                    //Проверяет соответствие типа переменной. Важно (!) checkedType множно задать в виде переменной. В этом случае метод сопоставляет тип переменной.
                    IsType: function (targetVar, checkedType) {
                    	/// <summary>
                    	/// Check type of var or vars. Can get several vars and severals types. If gets several vars result will be false if a least one var hasn't defined type. 
                    	/// </summary>
                    	/// <param name="targetVar" type="any var || array[vars]"> One or more vars</param>
                    	/// <param name="checkedType" type="string || array[string]">Type or collection of types.</param>
                    	/// <returns type="boolean"></returns>
                        function CheckVar(targetVar, checkedType) {
                            if (checkedType instanceof Array) {
                                for (var Index = checkedType.length - 1; Index >= 0; Index -= 1) {
                                    if (typeof targetVar === checkedType[Index]) {
                                        return true;
                                    }
                                }
                            } else {
                                if (typeof targetVar === checkedType) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        if (typeof targetVar !== "undefined" && typeof checkedType !== "undefined") {
                            if (typeof checkedType !== "string" && !checkedType instanceof Array) {
                                checkedType = typeof checkedType;
                            }
                            if (targetVar instanceof Array) {
                                for (var Index = targetVar.length - 1; Index >= 0; Index -= 1) {
                                    if (CheckVar(targetVar[Index], checkedType) === false) {
                                        return false;
                                    }
                                }
                                return true;
                            } else {
                                return CheckVar(targetVar, checkedType);
                            }
                        }
                        return false;
                    },
                };
                //Инструмены по работе с ссылками
                URL = {
                    //Парсит ссылку заменя всякую гадость %XX на рельные символы
                    Parse: function (strURL) {
                        if (typeof strURL !== "string") { return null; }
                        return decodeURIComponent(strURL);
                    }
                };
                //Инструменты по работе с объектами
                Objects = {
                    Attribute: {
                        //Удаляет атрибут объекта
                        Remove: function (TargetElement, AttributeName) {
                            if (typeof TargetElement === "object" && typeof AttributeName === "string") {
                                try {
                                    delete TargetElement[AttributeName];
                                } catch (e) {
                                    TargetElement.removeAttribute(AttributeName);
                                }
                                return TargetElement;
                            }
                            return null;
                        }
                    },
                    Properties : {
                        //Изменяет свойство во времени с текущего значения до заданного
                        pending : function (params) {
                            function validate(object, properties) {
                                function validateProperty(object, propertyData) {
                                    if (typeof propertyData === "object") {
                                        propertyData.name       = (typeof propertyData["name"]      === "string" ? propertyData["name"]     : null                      );
                                        propertyData.step       = (typeof propertyData["step"]      === "number" ? propertyData["step"]     : 1                         );
                                        if (typeof object[propertyData.name] === "number") {
                                            propertyData.start  = (typeof propertyData["start"]     === "number" ? propertyData["start"]    : object[propertyData.name] );
                                            propertyData.finish = (typeof propertyData["finish"]    === "number" ? propertyData["finish"]   : null                      );
                                        } else {
                                            propertyData.start  = null;
                                            propertyData.finish = null;
                                        }
                                    }
                                    if (Vars.Equality.not([propertyData.name, propertyData.finish], null) === true) {
                                        if (propertyData.step > 0 && propertyData.step !== 0 && propertyData.start !== propertyData.finish) {
                                            return propertyData;
                                        }
                                    }
                                    return null;
                                };
                                for (var index = properties.length - 1; index >= 0; index -= 1) {
                                    properties[index] = validateProperty(object, properties[index]);
                                    if (properties[index] === null) {
                                        properties.splice(index, 1);
                                    }
                                }
                                return (properties.length > 0 ? properties : null);
                            };
                            function execution(object, properties, onStep, onFinish, duration, interval) {
                                function measuring(object, properties) {
                                    var resultRunning;
                                    object.PurityToolsPendingProperiesData.start = new Date().valueOf();
                                    resultRunning = running(object, properties);
                                    object.PurityToolsPendingProperiesData.finish       = new Date().valueOf();
                                    object.PurityToolsPendingProperiesData.performance  = object.PurityToolsPendingProperiesData.finish - object.PurityToolsPendingProperiesData.start;
                                    return resultRunning;
                                };
                                function setSteps(properties, performance, duration, interval) {
                                    var countRunning    = Math.ceil(duration / (interval + performance));
                                    countRunning = (countRunning === 0 ? 1 : countRunning);
                                    for (var index = properties.length - 1; index >= 0; index -= 1) {
                                        properties[index].step = Math.abs(properties[index].finish - properties[index].start) / countRunning;
                                    }
                                };
                                function running(object, properties) {
                                    try{
                                        for (var index = properties.length - 1; index >= 0; index -= 1) {
                                            if (properties[index].finish > properties[index].start) {
                                                if (properties[index].finish > object[properties[index].name] + properties[index].step) {
                                                    object[properties[index].name] += properties[index].step;
                                                } else {
                                                    object[properties[index].name] = properties[index].finish;
                                                    properties.splice(index, 1);
                                                }
                                            } else {
                                                if (properties[index].finish < object[properties[index].name] - properties[index].step) {
                                                    object[properties[index].name] -= properties[index].step;
                                                } else {
                                                    object[properties[index].name] = properties[index].finish;
                                                    properties.splice(index, 1);
                                                }
                                            }
                                        }
                                        return true;
                                    } catch (e) {
                                        return false;
                                    }
                                };
                                function processing(object, properties, onStep, onFinish, interval, antiLoop) {
                                    if (properties.length > 0 && antiLoop > 0) {
                                        running(object, properties);
                                        Purity.System.runHandle(onStep, null, "[Tools][Objects.Properties.pending / processing]", this);
                                        setTimeout(function () {
                                            processing(object, properties, onStep, onFinish, interval, antiLoop - 1);
                                        }, interval);
                                    } else {
                                        object.PurityToolsPendingProperiesData = null;
                                        delete object.PurityToolsPendingProperiesData;
                                        Purity.System.runHandle(onFinish, null, "[Tools][Objects.Properties.pending / processing]", this);
                                    }
                                };
                                //Создаем объект данных
                                object.PurityToolsPendingProperiesData = {
                                    performance : null,
                                    start       : null,
                                    finish      : null
                                };
                                //Делаем первый прогон с измерением
                                if (measuring(object, properties) !== false) {
                                    //Пересчитываем шаги
                                    setSteps(properties, object.PurityToolsPendingProperiesData.performance, duration, interval);
                                    //Запускаем прогоны
                                    processing(object, properties, onStep, onFinish, interval, 1000);
                                }
                            };
                            var object      = (typeof params["object"]      === "object"    ? params["object"]      : null  ),
                                properties  = (typeof params["properties"]  !== "undefined" ? params["properties"]  : null  ),
                                onStep      = (typeof params["onStep"]      === "function"  ? params["onStep"]      : null  ),
                                onFinish    = (typeof params["onFinish"]    === "function"  ? params["onFinish"]    : null  ),
                                duration    = (typeof params["duration"]    === "number"    ? params["duration"]    : null  ),
                                interval    = (typeof params["interval"]    === "number"    ? params["interval"]    : 10);
                            if (Vars.Equality.not([object, properties, duration], null) === true) {
                                properties  = (properties instanceof Array ? properties : [properties]);
                                properties  = validate(object, properties);
                                interval    = (duration > interval ? interval : 10);
                                if (properties !== null || typeof object["PurityToolsPendingProperiesData"] === "undefined") {
                                    execution(object, properties, onStep, onFinish, duration, interval);
                                }
                            }
                        },
                        //Проверяет всю цепочку свойств
                        is      : function (target_object, property) {
                            var target_object   = (typeof target_object === "object" ? target_object    : null),
                                property        = (typeof property      === "string" ? property         : null),
                                properties      = null;
                            if (target_object !== null && property !== null) {
                                try{
                                    properties = property.split('.');
                                    for (var index = 0, max_index = properties.length; index < max_index; index += 1) {
                                        if (typeof target_object[properties[index]] !== "undefined") {
                                            target_object = target_object[properties[index]];
                                        } else {
                                            return false;
                                        }
                                    }
                                    return true;
                                } catch (e) {
                                    return null;
                                }
                            }
                            return null
                        }
                    },
                    //Копируем объект в другой
                    copy: function (targetObject, sourceObject) {
                        var targetObject = (typeof targetObject === "object" ? (targetObject === null ? {} : targetObject) : {}),
                            sourceObject = (typeof sourceObject === "object" ? sourceObject : null  );
                        if (sourceObject !== null) {
                            for (var key in sourceObject) {
                                if (sourceObject.hasOwnProperty(key)) {
                                    if (sourceObject[key] instanceof Array) {
                                        targetObject[key] = [];
                                        for (var index = 0, max_index = sourceObject[key].length; index < max_index; index += 1) {
                                            targetObject[key].push(sourceObject[key][index]);
                                        }
                                    } else if (typeof sourceObject[key] === "object" && sourceObject[key] !== null && typeof sourceObject[key] !== "function") {
                                        targetObject[key] = {};
                                        targetObject[key] = Objects.copy(targetObject[key], sourceObject[key]);
                                    } else {
                                        targetObject[key] = sourceObject[key];
                                    }

                                }
                            }
                            return targetObject;
                        }
                        return null;
                    },
                    //Проверяет свойства объекта
                    /*
                    properties = [{name: string, type: string || [string]}, ...]
                    or
                    properties = {name: string, type: string || [string]}
                    */
                    validate: function (targetObject, properties) {
                        var targetObject    = (typeof targetObject  === "object"    ? targetObject  : null),
                            properties      = (typeof properties    !== "undefined" ? properties    : null),
                            types           = null,
                            status          = null,
                            values_check    = null;
                        if (targetObject !== null && properties !== null) {
                            properties = (properties instanceof Array === true ? properties : [properties]);
                            for (var index = properties.length - 1; index >= 0; index -= 1) {
                                if (typeof properties[index].name === "string" && typeof properties[index].type !== "undefined") {
                                    if (typeof targetObject[properties[index].name] !== "undefined") {
                                        properties[index].type = (typeof properties[index].type === "string" ? [properties[index].type] : properties[index].type);
                                        if (properties[index].type instanceof Array) {
                                            status = false;
                                            for (var indexTypes = properties[index].type.length - 1; indexTypes >= 0; indexTypes -= 1) {
                                                if (properties[index].type[indexTypes]          === "node") {
                                                    status = (HTML.Nodes.Is(targetObject[properties[index].name]) === true ? true : status);
                                                } else if (properties[index].type[indexTypes]   === "array") {
                                                    status = (targetObject[properties[index].name] instanceof Array === true ? true : status);
                                                } else {
                                                    status = (typeof targetObject[properties[index].name] === properties[index].type[indexTypes] ? true : status);
                                                }
                                            }
                                            if (status === false) {
                                                if (typeof properties[index].value !== "undefined") {
                                                    targetObject[properties[index].name] = properties[index].value;
                                                } else {
                                                    return false;
                                                }
                                            } else {
                                                if (typeof properties[index].values !== "undefined") {
                                                    if (properties[index].values instanceof Array) {
                                                        values_check = false;
                                                        for (var indexValues = properties[index].values.length - 1; indexValues >= 0; indexValues -= 1) {
                                                            if (targetObject[properties[index].name] === properties[index].values[indexValues]) {
                                                                values_check = true;
                                                                break;
                                                            }
                                                        }
                                                        if (values_check === false) {
                                                            return false;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (typeof properties[index].value !== "undefined") {
                                            targetObject[properties[index].name] = properties[index].value;
                                        } else {
                                            return false;
                                        }
                                    }
                                }
                            }
                            return true;
                        }
                        return null;
                    }
                };
                //Создает уникальные (для текущей сессии) ID
                IDs = {
                    Data: {
                        createdIDs: []
                    },
                    //Генерирует случайную последовательность цифр
                    GetRandomNumbers: function (LengthNumber) {
                        var ResultNumber = "id";
                        if (typeof LengthNumber !== "number") {
                            var LengthNumber = 6;
                        }
                        if (LengthNumber < 6 || LengthNumber > 128) {
                            LengthNumber = 6;
                        }
                        for (var Index = 0; Index < LengthNumber; Index += 1) {
                            ResultNumber = ResultNumber + Math.round((Math.random() * 100));
                        }
                        return ResultNumber;
                    },
                    //Возвращает уникальный ID
                    Get: function (IDLength) {
                    	/// <summary>
                    	/// Generate unicly ID.
                    	/// </summary>
                    	/// <param name="IDLength" type="Number">Lenght of ID</param>
                    	/// <returns type="string">ID</returns>
                        var FinishOperationFlag = false,
                            ResultID            = "";
                        if (typeof IDLength !== "number") {
                            var IDLength = 6;
                        }
                        do {
                            ResultID = IDs.GetRandomNumbers(IDLength);
                            if (IDs.Data.createdIDs.indexOf(ResultID) === -1) {
                                IDs.Data.createdIDs.push(ResultID);
                                FinishOperationFlag = true;
                            }
                        } while (FinishOperationFlag === false);
                        return ResultID;
                    },
                    //Добавляет ID в реестр созданных ID
                    Set: function (ID) {
                    	/// <summary>
                    	/// Add defined ID to Purity base.
                    	/// </summary>
                    	/// <param name="ID">Added ID.</param>
                    	/// <returns type="boolean">True - everything is OK. False - ID is added (or genereted) before. Null - errors with params.</returns>
                        if (Vars.IsType(ID, ["string", "number"]) === true) {
                            if (IDs.Data.createdIDs.indexOf(ID) === -1) {
                                IDs.Data.createdIDs.push(ID);
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return null;
                    },
                    //Удаляет ID из реестра
                    Del: function (ID) {
                        /// <summary>
                        /// Delete defined ID from Purity base.
                        /// </summary>
                        /// <param name="ID">Deleted ID.</param>
                        /// <returns type="boolean">True - everything is OK. False - ID is deleted (or didn't genereted) before. Null - errors with params.</returns>
                        var IDIndex = null;
                        if (Vars.IsType(ID, ["string", "number"]) === true) {
                            IDIndex = IDs.Data.createdIDs.indexOf(ID);
                            if (IDIndex === -1) {
                                return false;
                            } else {
                                IDs.Data.createdIDs.splice(IDIndex, 1);
                                return true;
                            }
                        }
                        return null;
                    }
                };
                //Инструменты по работе с логами
                Log = {
                    init    : function (default_tab) {
                        if (DeveloperConsole === null) {
                            if (Purity.isModuleCreated(["Developer.Console"]) === true) {
                                DeveloperConsole = new Purity.initModule("Developer.Console");
                                DeveloperConsole.open(default_tab);
                            }
                        }
                    },
                    actions : {
                        events: {
                            register: function (params) {
                                Log.init("events");
                                if (DeveloperConsole !== null) {
                                    return DeveloperConsole.events.register(params);
                                }
                            },
                            launch  : function (params) {
                                Log.init("events");
                                if (DeveloperConsole !== null) {
                                    return DeveloperConsole.events.launch(params);
                                }
                            },
                            remove  : function (params) {
                                Log.init("events");
                                if (DeveloperConsole !== null) {
                                    return DeveloperConsole.events.remove(params);
                                }
                            },
                        },
                        console: {
                            message: function (params) {
                                var message_str = "";
                                Log.init("console");
                                if (DeveloperConsole !== null) {
                                    return DeveloperConsole.console.message(params);
                                } else {
                                    if (typeof console !== "undefined") {
                                        if (typeof console.log !== "undefined") {
                                            message_str = (params.message ? params.message : message_str);
                                            message_str = (params.details ? message_str + "(" + params.details + ")" : message_str);
                                            console.log(message_str);
                                        }
                                    }
                                }
                            }
                        },
                        lifeview: {
                            register: function (params) {
                                Log.init("lifeview");
                                if (DeveloperConsole !== null) {
                                    return DeveloperConsole.lifeview.register(params);
                                }
                            },
                            update  : function (params) {
                                Log.init("lifeview");
                                if (DeveloperConsole !== null) {
                                    return DeveloperConsole.lifeview.update(params);
                                }
                            },
                            remove  : function (params) {
                                Log.init("lifeview");
                                if (DeveloperConsole !== null) {
                                    return DeveloperConsole.lifeview.remove(params);
                                }
                            },
                        },
                        open: function (default_tab) {
                            Log.init();
                            if (DeveloperConsole !== null) {
                                return DeveloperConsole.open(default_tab);
                            }
                        }
                    },
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicArray = {
                    Is          : adArray.Is,
                    In          : adArray.In,
                    StrToInt    : adArray.StrToInt,
                    copy        : adArray.copy
                };
                publicRun = {
                    Method      : Run.Method
                };
                publicVars = {
                    IsExists        : Vars.IsExists,
                    IsEquality      : Vars.Equality.is,
                    IsNotEquality   : Vars.Equality.not,
                    IsType          : Vars.IsType
                };
                publicURL = {
                    Parse       : URL.Parse
                };
                publicObject = {
                    Attribute   : Objects.Attribute,
                    Properties  : Objects.Properties,
                    copy        : Objects.copy,
                    validate    : Objects.validate
                };
                publicLog = {
                    events  : Log.actions.events,
                    console : Log.actions.console,
                    lifeview: Log.actions.lifeview,
                    open    : Log.actions.open
                };
                publicIDs = {
                    Get: IDs.Get,
                    Set: IDs.Set,
                    Del: IDs.Del,
                    UIN: IDs.GetRandomNumbers
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
                    Array       : publicArray,
                    Run         : publicRun,
                    Vars        : publicVars,
                    URL         : publicURL,
                    Object      : publicObject,
                    Log         : publicLog,
                    IDs         : publicIDs
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());