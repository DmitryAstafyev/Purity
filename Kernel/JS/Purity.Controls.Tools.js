/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <module>
///     <summary>
///         This module is used by control elements.
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("Controls.Tools",
            //Check references
            {
                modules     : ["HTML", "Tools"],
                resources   : null
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Controls.Tools",
                    version         = "1.0",
                    lastUpdate      = "05.06.2013",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Nodes           = {},
                    Variable        = {},
                    publicNodes     = {},
                    publicVariable  = {},
                    //Declaration references
                    Tools           = new Purity.initModule("Tools"),
                    HTML            = new Purity.initModule("HTML");
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                //Инструменты по работе с узлами
                Nodes = {
                    //Получает ссылку либо на узел, либо строку. Если строку, то пытается найти узел. Возвращает в любом случае ссылку на узел. Нужна для Controls
                    Get: function (nodeObject, callPlace) {
                        if (HTML.Nodes.Is(nodeObject) === true) {
                            return nodeObject;
                        }
                        if (typeof nodeObject === "string") {
                            try {
                                nodeObject = HTML.Select(nodeObject);
                                return nodeObject;
                            } catch (e) {
                                if (typeof callPlace === "string") {
                                    Tools.Log.console.message({ message: "Error. Bad selector was colled in [" + callPlace + "]" });
                                } else {
                                    Tools.Log.console.message({ message: "Error. Bad selector." });
                                }
                                return null;
                            }
                        }
                        return null;
                    }
                };
                //Инструменты проверки параметров
                Variable = {
                    Types: {
                        Available: ["string", "number", "boolean", "function", "array", "node"],
                        Is: function (variable, type) {
                            function CheckType(variable, type) {
                                type = type.toLowerCase();
                                if (Variable.Types.Available.indexOf(type) !== -1) {
                                    switch (type) {
                                        case "array":
                                            if (variable instanceof Array) {
                                                return true;
                                            }
                                            break;
                                        case "node":
                                            return HTML.Nodes.Is(variable);
                                            break;
                                        default:
                                            if (typeof variable === type) {
                                                return true;
                                            }
                                            break;
                                    }
                                }
                                return false;
                            };
                            var resultOperation = null;
                            if (typeof variable !== "undefined" && (type instanceof Array || typeof type === "string")) {
                                if (type instanceof Array) {
                                    resultOperation = false;
                                    for (var Index = type.length - 1; Index >= 0; Index -= 1) {
                                        resultOperation = CheckType(variable, type[Index]);
                                        if (resultOperation === true) {
                                            return resultOperation;
                                        }
                                    }
                                    return resultOperation;
                                } else {
                                    return CheckType(variable, type);
                                }
                            }
                            return false;
                        }
                    },
                    /*Производит проверку переменных
                    variable        : any       - ссылка на переменную
                    type            : string    - тип соответствия переменной, то есть тот тип, каким она должна быть
                    defaultValue    : any       - значение по умолчанию
                    availableValues : array     - допустимые значения
                    */
                    Prepare: function (Params) {
                        var variable        = null,
                            type            = null,
                            defaultValue    = null,
                            availableValues = null;
                        if (typeof Params["variable"]         !== "undefined" ) { variable        = Params["variable"];       }
                        if (typeof Params["defaultValue"]     !== "undefined" ) { defaultValue    = Params["defaultValue"];   }
                        if (typeof Params["type"]             === "object") {
                            if (Params["type"] instanceof Array) {
                                type = Params["type"];
                            }
                        }
                        if (typeof Params["availableValues"] !== "undefined") {
                            if (Params["availableValues"] instanceof Array) {
                                availableValues = Params["availableValues"];
                            }
                            if (Params["availableValues"] === null) {
                                availableValues = "no check";
                            }
                        }
                        if (variable !== null && type !== null && availableValues !== null) {
                            //Проверяем соответствие типа
                            if (Variable.Types.Is(variable, type) === true) {
                                //Проверяем значение допустимые значения
                                if (availableValues !== "no check") {
                                    if (availableValues.indexOf(variable) === -1) {
                                        //Присваиваем значение по умолчанию
                                        variable = defaultValue;
                                    }
                                }
                            }
                        }else{
                            //Присваиваем значение по умолчанию
                            variable = defaultValue;
                        }
                        return variable;
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicNodes = {
                    Get: Nodes.Get
                };
                publicVariable = {
                    Prepare: Variable.Prepare
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
                    Nodes       : publicNodes,
                    Variable    : publicVariable
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());