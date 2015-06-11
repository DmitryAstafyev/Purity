/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <module>
///     <summary>
///         Parser.XML - controls XML data
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("Parser.XML",
            //Check references
            {
                modules         : null,
                resources       : null,
                compatibility   : {
                    xmlparser   : true
                }
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Parser.XML",
                    version         = "1.00",
                    lastUpdate      = "14.11.2013",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Parser          = {},
                    publicParser    = {};
                    //Declaration references
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Parser = {
                    fromString: function (sourceString, includeRoot) {
                        function make(nodes, resultObject) {
                            function setValue(fields, name, value) {
                                if (!fields[name]) {
                                    fields[name] = value;
                                    return value;
                                } else {
                                    if (fields[name] instanceof Array !== true) {
                                        fields[name] = [fields[name]];
                                    }
                                    fields[name].push(value);
                                    return fields[name][fields[name].length - 1];
                                }
                            };
                            var nodes           = (typeof nodes         !== "undefined" ? nodes         : null),
                                resultObject    = (typeof resultObject  === "object"    ? resultObject  : null);
                            if (nodes !== null && resultObject !== null) {
                                if (typeof nodes.nodeType === "number") {
                                    for (var index = nodes.childNodes.length - 1; index >= 0; index -= 1) {
                                        if (nodes.childNodes[index].childNodes.length === 0) {
                                            if (typeof nodes.childNodes[index].tagName === "string") {
                                                setValue(resultObject, nodes.childNodes[index].tagName, nodes.childNodes[index].nodeValue);
                                            }
                                        } else if (nodes.childNodes[index].childNodes.length === 1 && nodes.childNodes[index].firstChild.nodeType === 3){
                                            if (typeof nodes.childNodes[index].tagName === "string") {
                                                setValue(resultObject, nodes.childNodes[index].tagName, nodes.childNodes[index].firstChild.nodeValue);
                                            }
                                        } else {
                                            make(   nodes.childNodes[index],
                                                    setValue(resultObject, nodes.childNodes[index].tagName, {})
                                            );
                                        }
                                    }
                                    return true;
                                }
                            }
                            return false;
                        };
                        var sourceString        = (typeof sourceString  === "string"    ? sourceString  : null  ),
                            includeRoot         = (typeof includeRoot   === "boolean"   ? includeRoot   : false ),
                            parsedObject        = null,
                            resultObject        = {},
                            microsoftXMLObject  = null;
                        if (sourceString !== null) {
                            try {
                                if (window.DOMParser){
                                    parsedObject = (new DOMParser()).parseFromString(sourceString, "application/xml");
                                }else if (window.ActiveXObject){
                                    microsoftXMLObject          = new ActiveXObject("Microsoft.XMLDOM");
                                    microsoftXMLObject.async    = false;
                                    parsedObject                = microsoftXMLObject.loadXML(sourceString);
                                    microsoftXMLObject          = null;
                                }else{
                                    return null;
                                }
                                parsedObject = (parsedObject.nodeType   === 9       ? parsedObject = parsedObject.firstChild : parsedObject);//9 == DOCUMENT_NODE
                                parsedObject = (includeRoot             === true    ? parsedObject = parsedObject.firstChild : parsedObject);
                                if (make(parsedObject, resultObject) === true) {
                                    return resultObject;
                                }
                            } catch (error) {
                                return null;
                            }
                            return null;
                        }
                        return null;
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicParser = {
                    fromString : Parser.fromString
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
                    fromString  : publicParser.fromString
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());