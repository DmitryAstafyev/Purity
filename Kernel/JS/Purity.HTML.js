/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
/// <module>
///     <summary>
///         Control some operation with HTML elements and DOM elements
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("HTML",
            //Check references
            null,
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: HTML",
                    version         = "1.0",
                    lastUpdate      = "29.05.2013",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Nodes           = {},
                    Select          = {},
                    Render          = {},
                    Images          = {},
                    AbsAlignment    = {},
                    Init            = {},
                    iFrames         = {},
                    publicNodes     = {},
                    publicSelect    = {},
                    publicImages    = {},
                    publicRender    = {},
                    publicIFrames   = {},
                    publicAlign     = {};
                //Declaration references
                    //---------------No references
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                //Работа с деревом узлов
                Nodes = {
                    //Проверяет явлется ли переданный объект объектом DOM
                    Is          : function (TargetObject) {
                        function IsNode(targetObject) {
                            if (typeof targetObject === "object") {
                                if (targetObject !== null) {
                                    if (typeof targetObject.nodeName !== "undefined") {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };
                        var OnlyTrue = true;
                        if (typeof TargetObject !== "undefined") {
                            if (TargetObject instanceof Array) {
                                for (var Index = TargetObject.length - 1; Index >= 0; Index -= 1) {
                                    if (IsNode(TargetObject[Index]) === false) {
                                        OnlyTrue = false;
                                    }
                                }
                                return OnlyTrue;
                            } else {
                                return IsNode(TargetObject);
                            }
                        }
                        return false;
                    },
                    //Проверяет вмонтирован ли узел
                    IsMounted   : function (node) {
                        function getLastParent(node) {
                            if (node !== null) {
                                if (node.parentNode) {
                                    return getLastParent(node.parentNode);
                                } else {
                                    if (node.nodeName) {
                                        return (node.nodeName.toLowerCase().indexOf("document") === -1 ? null : node);
                                    }
                                    return null;
                                }
                            }
                            return null;
                        };
                        if (Nodes.Is(node) === true) {
                            return (getLastParent(node) !== null ? true : false);
                        }
                        return false;
                    },
                    //Возвращает следующий за указанным тег в рамках родительского узла
                    Next        : function (previewsNode) {
                        var parentNode          = null,
                            indexPreviewsNode   = null;
                        if (Nodes.Is(previewsNode) === true) {
                            parentNode          = previewsNode.parentNode;
                            indexPreviewsNode   = Nodes.Index(previewsNode);
                            if (indexPreviewsNode >= 0) {
                                if (indexPreviewsNode < parentNode.childNodes.length - 1) {
                                    return parentNode.childNodes[indexPreviewsNode + 1];
                                } else {
                                    return false;
                                }
                            }
                        }
                        return null;
                    },
                    //Возвращает следующий за указанным тег, но в отличае от Nodes.Next ищет и за пределами отца, то есть по всему дереву
                    NextInTree  : function (previewsNode) {
                        var nextNode = null;
                        if (Nodes.Is(previewsNode) === true) {
                            nextNode = Nodes.Next(previewsNode);
                            if (Nodes.Is(nextNode) === true) {
                                return nextNode;
                            } else {
                                if (Nodes.Is(previewsNode.parentNode) === true) {
                                    return Nodes.NextInTree(previewsNode.parentNode);
                                } else {
                                    return false;
                                }
                            }
                        }
                        return null;
                    },
                };
                //Селекторы
                Select = {
                    Config: {
                        SupportQuerySelectorFlag: null
                    },
                    //Инициализация блока
                    Init    : function () {
                        if (Select.Config.SupportQuerySelectorFlag === null) {
                            if (typeof document.querySelectorAll === "function" && typeof document.querySelector === "function") {
                                Select.Config.SupportQuerySelectorFlag = true;
                            } else {
                                Select.Config.SupportQuerySelectorFlag = false;
                            }
                        }
                    },
                    //возвращает DOM элемент по селектору
                    First   : function (strSelector, paramDocumentLink) {
                        var ResultObjectCollection  = null,
                            DocumentLink            = document;
                        if (typeof strSelector === "string") {
                            if (typeof paramDocumentLink !== "undefined") {
                                DocumentLink = paramDocumentLink;
                            }
                            if (Select.Config.SupportQuerySelectorFlag === true) {
                                ResultObjectCollection = DocumentLink.querySelector(strSelector);
                            } else {
                                try { ResultObjectCollection = $(strSelector).get(0); } catch (e) { }
                            }
                        }
                        return ResultObjectCollection;
                    },
                    //возвращает набор DOM элементов по селектору
                    All     : function (strSelector, paramDocumentLink) {
                        var ResultObjectCollection  = null,
                            DocumentLink            = document;
                        if (typeof strSelector === "string") {
                            if (typeof paramDocumentLink !== "undefined") {
                                DocumentLink = paramDocumentLink;
                            }
                            if (Select.Config.SupportQuerySelectorFlag === true) {
                                ResultObjectCollection = DocumentLink.querySelectorAll(strSelector);
                            } else {
                                try { ResultObjectCollection = $(strSelector); } catch (e) { }
                            }
                        }
                        return ResultObjectCollection;
                    }
                };
                //Работа отображение элементов
                Render = {
                    //Универсальная функция по определению размеров элемента
                    GetSize : function (TargetElement) {
                        function ClientRectSize(TargetElement) {
                            var ElementHeight       = 0,
                                ElementWidth        = 0,
                                BoundingClientRect  = null;
                            if (typeof TargetElement.getBoundingClientRect !== "undefined") {
                                BoundingClientRect = TargetElement.getBoundingClientRect();
                                ElementHeight = BoundingClientRect.bottom - BoundingClientRect.top;
                                ElementWidth = BoundingClientRect.right - BoundingClientRect.left;
                            }
                            return { Height: ElementHeight, Width: ElementWidth }
                        };
                        function OffsetSize(TargetElement) {
                            var ElementHeight   = 0,
                                ElementWidth    = 0;
                            if (typeof TargetElement.offsetHeight !== "undefined") {
                                ElementHeight = TargetElement.offsetHeight;
                                ElementWidth = TargetElement.offsetWidth;
                            }
                            return { Height: ElementHeight, Width: ElementWidth }
                        };
                        var ElementHeight       = null,
                            ElementWidth        = null,
                            ElementOutHeight    = null,
                            ElementOutWidth     = null,
                            clientRectSize      = null,
                            offsetSize          = null,
                            MarginTop           = null,
                            MarginBottom        = null, 
                            MarginRight         = null,
                            MarginLeft          = null;
                        if (typeof TargetElement === "object") {
                            //определяем базовые размеры элемента тремя способами
                            clientRectSize  = ClientRectSize(TargetElement);
                            offsetSize      = OffsetSize(TargetElement);
                            //Гипотиза. Тот вариант, который дает наибольший размер и есть верный.
                            ElementHeight   = Math.max(clientRectSize["Height"], offsetSize["Height"]);
                            ElementWidth    = Math.max(clientRectSize["Width"], offsetSize["Width"]);
                            //определяем отступы
                            MarginTop       = parseInt(document.defaultView.getComputedStyle(TargetElement).marginTop, 10);
                            MarginBottom    = parseInt(document.defaultView.getComputedStyle(TargetElement).marginBottom, 10);
                            MarginRight     = parseInt(document.defaultView.getComputedStyle(TargetElement).marginRight, 10);
                            MarginLeft      = parseInt(document.defaultView.getComputedStyle(TargetElement).marginLeft, 10);
                            if (MarginTop       === null || MarginTop       === "") { MarginTop     = 0; } else { MarginTop     = parseInt(MarginTop, 10);      }
                            if (MarginBottom    === null || MarginBottom    === "") { MarginBottom  = 0; } else { MarginBottom  = parseInt(MarginBottom, 10);   }
                            if (MarginRight     === null || MarginRight     === "") { MarginRight   = 0; } else { MarginRight   = parseInt(MarginRight, 10);    }
                            if (MarginLeft      === null || MarginLeft      === "") { MarginLeft    = 0; } else { MarginLeft    = parseInt(MarginLeft, 10);     }
                            ElementOutHeight    = ElementHeight + MarginTop + MarginBottom;
                            ElementOutWidth     = ElementWidth + MarginRight + MarginLeft;
                        }
                        return {
                            OuterHeight : ElementHeight,
                            OuterWidth  : ElementWidth,
                            MarginHeight: ElementOutHeight,
                            MarginWidth : ElementOutWidth,
                            height      : ElementHeight,
                            width       : ElementWidth,
                        };
                    },
                    //Жестко привязывает размер
                    FixSize : function (targetNode, width, height) {
                        function ApplyTask(targetNode, width, height) {
                            var stylePrefix = "";
                            if (typeof width === "string" || typeof width === "number") {
                                if (typeof width === "number") { stylePrefix = "px" } else { stylePrefix = "" }
                                targetNode.style.width      = width + stylePrefix;
                                targetNode.style.minWidth   = width + stylePrefix;
                                targetNode.style.maxWidth   = width + stylePrefix;
                            }
                            if (typeof height === "string" || typeof height === "number") {
                                if (typeof height === "number") { stylePrefix = "px" } else { stylePrefix = "" }
                                targetNode.style.height     = height + stylePrefix;
                                targetNode.style.minHeight  = height + stylePrefix;
                                targetNode.style.maxHeight  = height + stylePrefix;
                            }
                        };
                        if (Nodes.Is(targetNode) === true) {
                            if (targetNode instanceof Array) {
                                for (var Index = targetNode.length - 1; Index >= 0; Index -= 1) {
                                    if (Nodes.Is(targetNode[Index]) === true) {
                                        ApplyTask(targetNode[Index], width, height);
                                    }
                                }
                            } else {
                                ApplyTask(targetNode, width, height);
                            }
                        }
                    },
                    //Определение позиции элемента
                    Position: {
                        Private : {
                            //Универсальный метод определения координат. Метод плохой, ибо медленный. Координаты относительно страницы.
                            OldScholl   : function (TargetElement) {
                                var TopOffset   = 0,
                                    LeftOffset  = 0;
                                if (typeof TargetElement === "object") {
                                    while (TargetElement) {
                                        if (typeof TargetElement.offsetTop !== "undefined" && typeof TargetElement.offsetLeft !== "undefined") {
                                            TopOffset = TopOffset + parseFloat(TargetElement.offsetTop);
                                            LeftOffset = LeftOffset + parseFloat(TargetElement.offsetLeft);
                                        }
                                        TargetElement = TargetElement.offsetParent;
                                    }
                                }
                                return {
                                    top : Math.round(TopOffset),
                                    left: Math.round(LeftOffset)
                                };
                            },
                            //Современный метод определения координат. Координаты относительно страницы.
                            Normal      : function (TargetElement) {
                                var TopOffset           = 0,
                                    LeftOffset          = 0,
                                    ElementBox          = null,
                                    objBody             = null,
                                    objDocumentElement  = null,
                                    scrollTop           = null,
                                    scrollLeft          = null,
                                    clientTop           = null,
                                    clientLeft          = null,
                                    TopOffset           = null,
                                    LeftOffset          = null;
                                if (typeof TargetElement === "object") {
                                    ElementBox          = TargetElement.getBoundingClientRect();
                                    objBody             = document.body;
                                    objDocumentElement  = document.documentElement;
                                    scrollTop           = window.pageYOffset || objDocumentElement.scrollTop || objBody.scrollTop;
                                    scrollLeft          = window.pageXOffset || objDocumentElement.scrollLeft || objBody.scrollLeft;
                                    clientTop           = objDocumentElement.clientTop || objBody.clientTop || 0;
                                    clientLeft          = objDocumentElement.clientLeft || objBody.clientLeft || 0;
                                    TopOffset           = ElementBox.top + scrollTop - clientTop;
                                    LeftOffset          = ElementBox.left + scrollLeft - clientLeft;
                                }
                                return {
                                    top : Math.round(TopOffset),
                                    left: Math.round(LeftOffset)
                                };
                            }
                        },
                        //Определение координат. Координаты относительно страницы.
                        ByPage  : function (TargetElement) {
                            //пробуем нормальный вариант
                            var TopOffset       = null,
                                LeftOffset      = null,
                                ElementBox      = null,
                                ElementOffset   = null,
                                scrollTop       = null,
                                scrollLeft      = null;
                            if (typeof TargetElement === "object") {
                                try {
                                    ElementBox      = TargetElement.getBoundingClientRect();
                                    TopOffset       = ElementBox.top;
                                    LeftOffset      = ElementBox.left;
                                } catch (e) {
                                    ElementOffset   = Render.Position.Private.OldScholl(TargetElement);
                                    scrollTop       = window.pageYOffset || objDocumentElement.scrollTop || objBody.scrollTop;
                                    scrollLeft      = window.pageXOffset || objDocumentElement.scrollLeft || objBody.scrollLeft;
                                    TopOffset       = ElementOffset["top"] - scrollTop;
                                    LeftOffset      = ElementOffset["left"] - scrollLeft;
                                    return {
                                        top : Math.round(TopOffset),
                                        left: Math.round(LeftOffset)
                                    };
                                }
                            }
                            return {
                                top : Math.round(TopOffset),
                                left: Math.round(LeftOffset)
                            };
                        },
                        //Определение координат. Координаты относительно окна.
                        ByWindow: function (TargetElement) {
                            //пробуем нормальный вариант
                            var ResultOffset = null;
                            if (typeof TargetElement === "object") {
                                try {
                                    ResultOffset = Render.Position.Private.Normal(TargetElement);
                                } catch (e) {
                                    ResultOffset = Render.Position.Private.OldScholl(TargetElement);
                                    return ResultOffset;
                                }
                            }
                            return ResultOffset;
                        }
                    },
                    //Размеры окна браузера
                    WindowSize: {
                        Height: function () {
                            var frameHeight = null;
                            if (self.innerHeight) { frameHeight = self.innerHeight; }
                            else if (document.documentElement && document.documentElement.clientHeight) { frameHeight = document.documentElement.clientHeight; }
                            else if (document.body) { frameHeight = document.body.clientHeight; }
                            return frameHeight;
                        },
                        Width: function () {
                            var frameWidth = null;
                            if (self.innerWidth) { frameWidth = self.innerWidth; }
                            else if (document.documentElement && document.documentElement.clientWidth) { frameWidth = document.documentElement.clientWidth; }
                            else if (document.body) { frameWidth = document.body.clientWidth; }
                            return frameWidth;
                        }
                    }
                };
                //Изображения
                Images = {
                    //Определяет загружено ли изображение
                    IsLoaded: function (CheckingImage) {
                        // Для большенсвтва браузеров.
                        if (!CheckingImage.complete) {
                            return false;//незагружена.
                        }
                        // Для Gecko-based браузеров.
                        if (typeof CheckingImage.naturalWidth !== "undefined" && CheckingImage.naturalWidth === 0) {
                            return false;//незагружена.
                        }
                        return true;//загружена.
                    }
                };
                //Блок, отвечающий за выравнивание элементов относительно друг друга, либо окна
                AbsAlignment = {
                    //Выравнивание узла
                    /*
                    (*)     node        : DOMObject             - Узел, который будет выравниваться
                    (false) byParent    : boolean               - true: выравниваение будет относительно отца
                    (*)     align       : {x:string, y:string}  - параметры выравнивания
                    align : x и y могут принимать любое значение из x: "left", "right", "center", y: "top",  "bottom", "center"
                    */
                    Align: function (Params) {
                        //Проверяет корректность заданного направления и возвращает его в виде объекта
                        function GetDirection(allDirections, align) {
                            var xDirection = null,
                                yDirection = null;
                            if (typeof align.x === "string" && typeof align.y === "string") {
                                for (var Index = allDirections.x.length - 1; Index >= 0; Index -= 1) {
                                    if (align.x.toLowerCase().indexOf(allDirections.x[Index]) !== -1) {
                                        xDirection = allDirections.x[Index];
                                        break;
                                    }
                                }
                                for (var Index = allDirections.y.length - 1; Index >= 0; Index -= 1) {
                                    if (align.y.toLowerCase().indexOf(allDirections.y[Index]) !== -1) {
                                        yDirection = allDirections.y[Index];
                                        break;
                                    }
                                }
                                if (xDirection !== null && yDirection !== null) {
                                    return {
                                        x: xDirection,
                                        y: yDirection
                                    }
                                }
                            }
                            return null;
                        };
                        var targetNode              = null,
                            alignByParent           = null,
                            align                   = null,
                            alignBaseObject         = null,
                            allDirections           = {
                                x: ["left", "right", "center"],
                                y: ["top", "bottom", "center"]
                            },
                            alignDirection          = null,
                            alignNodeSize           = null,
                            alignBaseObjectSize     = null,
                            alignBaseObjectPosition = null,
                            resultPosition          = null,
                            Tools                   = new Purity.initModule("Tools");
                        if (Nodes.Is(Params["node"]) === true) { targetNode = Params["node"]; }
                        if (typeof Params["byParent"] === "boolean") { alignByParent = Params["byParent"]; } else { alignByParent = false; }
                        if (typeof Params["align"] === "object") { align = Params["align"]; }
                        if (targetNode !== null && align !== null) {
                            //Проверяем узел
                            if (document.defaultView.getComputedStyle(targetNode).position !== "absolute" &&
                                document.defaultView.getComputedStyle(targetNode).position !== "relative") {
                                //Выравнивать можно только то, что позиционируется в координатах, то есть то для чего можно задать top и left
                                if (Tools !== null) {
                                    Tools.Log.console.message({ message: "Warning. [Purity.HTML.AbsAlignment] You can align only nodes with position = \"absolute\" || \"relative\"." });
                                }
                                return null;
                            }
                            //Проверяем и получаем данные по направлениям
                            alignDirection = GetDirection(allDirections, align);
                            if (alignDirection === null) {
                                if (Tools !== null) {
                                    Tools.Log.console.message({ message: "Warning. [Purity.HTML.AbsAlignment] Wrong align value. Use, for example, align = {x : \"left || right || center\", y : \"top || bottom || center\"}" });
                                }
                                return null;
                            }
                            //Определяем отца по которому будет выравнивание
                            switch (alignByParent) {
                                case true:
                                    if (Nodes.Is(targetNode.parentNode) === true) {
                                        alignBaseObject = targetNode.parentNode;
                                    }
                                    break;
                                case false:
                                    alignBaseObject = window;
                                    break;
                            }
                            if (alignBaseObject === null) {
                                if (Tools !== null) {
                                    Tools.Log.console.message({ message: "Warning. [Purity.HTML.AbsAlignment] Can not find align basis node.}" });
                                }
                                return null;
                            }
                            //Определяем размеры целевого узла и базового узла
                            alignNodeSize = Render.GetSize(targetNode);
                            alignNodeSize = { h: alignNodeSize.OuterHeight, w: alignNodeSize.OuterWidth };
                            alignBaseObjectSize = null;
                            alignBaseObjectPosition = null;
                            if (Nodes.Is(alignBaseObject) === true) {
                                alignBaseObjectSize = Render.GetSize(targetNode);
                                alignBaseObjectSize = { h: alignBaseObjectSize.OuterHeight, w: alignBaseObjectSize.OuterWidth };
                                alignBaseObjectPosition = Render.Position.ByPage(alignBaseObject);
                                alignBaseObjectPosition = { y: alignBaseObjectPosition.top, x: alignBaseObjectPosition.left };
                            } else {
                                alignBaseObjectSize = { h: Render.WindowSize.Height(), w: Render.WindowSize.Width() };
                                alignBaseObjectPosition = { y: 0, x: 0 };
                            }
                            //Определяем координаты
                            resultPosition = { x: 0, y: 0 };
                            switch (alignDirection.x) {
                                case "left":
                                    resultPosition.x = 0 + alignBaseObjectPosition.x; break;
                                case "right":
                                    resultPosition.x = alignBaseObjectSize.w - alignNodeSize.w + alignBaseObjectPosition.x; break;
                                case "center":
                                    resultPosition.x = Math.round((alignBaseObjectSize.w - alignNodeSize.w) / 2 + alignBaseObjectPosition.x); break;
                            }
                            switch (alignDirection.y) {
                                case "top":
                                    resultPosition.y = 0 + alignBaseObjectPosition.y; break;
                                case "bottom":
                                    resultPosition.y = alignBaseObjectSize.h - alignNodeSize.h + alignBaseObjectPosition.y; break;
                                case "center":
                                    resultPosition.y = Math.round((alignBaseObjectSize.h - alignNodeSize.h) / 2 + alignBaseObjectPosition.y); break;
                            }
                            //Устанавливаем новое положение
                            targetNode.style.left = resultPosition.x + "px";
                            targetNode.style.top = resultPosition.y + "px";
                        }
                        return null;
                    }
                };
                //Блок по работе с феймами
                iFrames = {
                    getDocument : function (iFrame) {
                        var iFrame = (Nodes.Is(iFrame) === true ? iFrame : null);
                        if (iFrame !== null) {
                            if (iFrame.contentWindow && iFrame.contentWindow.document) {
                                return iFrame.contentWindow.document;
                            } else if (iFrame.document && iFrame.document) {
                                return iFrame.document;
                            } else if (iFrame.contentDocument && iFrame.contentDocument) {
                                return iFrame.contentDocument;
                            }
                            return null;
                        }
                    },
                    //Есть проблема. В IE (да и иногда в других браузерах) нужно ждать пока фрейм сформируется. То есть body 
                    //будет доступно только после load события.
                    getBody     : function (iFrame) {
                        var iFrame = (Nodes.Is(iFrame) === true ? iFrame : null);
                        if (iFrame !== null) {
                            if (iFrame.contentWindow && iFrame.contentWindow.document.body) {
                                return iFrame.contentWindow.document.body;
                            } else if (iFrame.document && iFrame.document.body) {
                                return iFrame.document.body;
                            } else if (iFrame.contentDocument && iFrame.contentDocument.body) {
                                return iFrame.contentDocument.body;
                            }
                            return null;
                        }
                    }
                };
                //Инициализация модуля
                Init = {
                    All: function () {
                        Select.Init();
                    },
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicNodes = {
                    Is          : Nodes.Is,
                    IsMounted   : Nodes.IsMounted,
                    Next        : Nodes.Next,
                    NextInTree  : Nodes.NextInTree,
                };
                publicSelect = {
                    First   : Select.First,
                    All     : Select.All
                };
                publicImages = {
                    IsLoaded: Images.IsLoaded
                };
                publicRender = {
                    GetSize     : Render.GetSize,
                    FixSize     : Render.FixSize,
                    Position    : {
                        ByPage      : Render.Position.ByPage,
                        ByWindow    : Render.Position.ByWindow
                    },
                    WindowSize  : Render.WindowSize
                };
                publicAlign = {
                    Align       : AbsAlignment.Align,
                };
                publicIFrames = {
                    getDocument : iFrames.getDocument,
                    getBody     : iFrames.getBody,
                };
                //---< Security part	>--[end]---------------------------------------------------------------------------------------
                //---< Init part	    >--[begin]---------------------------------------------------------------------------------------
                Init.All();
                //---< Init part	    >--[end]---------------------------------------------------------------------------------------
                return {
                    //---< Public part		>--[begin]---------------------------------------------------------------------------------------
                    AboutModule: {
                        getName         : function () { return name;        },
                        getVersion      : function () { return version;     },
                        getLastUpdate   : function () { return lastUpdate;  },
                        getAuthor       : function () { return author;      }
                    },
                    Nodes           : publicNodes,
                    Select          : publicSelect,
                    Images          : publicImages,
                    Render          : publicRender,
                    AbsoluteAlign   : publicAlign,
                    iFrame          : publicIFrames
                    //---< Public part		>--[end]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());