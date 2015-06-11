/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
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
        Purity.createModule("HTML.Extended",
            //Check references
            {
                modules     : ["HTML", "Tools"],
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name                = "HTML.Extended",
                    version             = "1.0",
                    lastUpdate          = "30.11.2013",
                    author              = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Nodes               = {},
                    Selections          = {},
                    publicNodes         = {},
                    publicSelections    = {},
                    //Declaration references
                    HTML                = new Purity.initModule("HTML"  ),
                    Tools               = new Purity.initModule("Tools" );
                //---------------No references
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                //Работа с деревом узлов
                Nodes = {
                    //Строит набор узлов по указанной конфигурации
                    builder: function (attributes) {
                        function settingup(attributes, nodes) {
                            var parent = null,
                                childs = null;
                            if (typeof attributes.settingup === "object" && nodes !== null) {
                                parent = nodes[attributes.settingup.parent];
                                childs = attributes.settingup.childs;
                                for (var index = 0, max_index = childs.length; index < max_index; index += 1) {
                                    if (typeof nodes[childs[index]] !== "undefined"){
                                        if (typeof attributes[childs[index]].settingup === "object") {
                                            parent.appendChild(nodes[childs[index]][attributes[childs[index]].settingup.parent]);
                                        } else {
                                            parent.appendChild(nodes[childs[index]]);
                                        }
                                    }
                                }
                            }
                        };
                        function make(attribute) {
                            var node = null;
                            if (Tools.Object.validate(attribute, [{ name: "html", type: "string", value: null }]) === true) {
                                node = document.createElement(attribute.node);
                                node.setAttribute(attribute.name, attribute.value);
                                if (attribute.html !== null) {
                                    node.innerHTML = attribute.html;
                                }
                                return node;
                            } else {
                                return null;
                            }
                        };
                        var nodes = null;
                        try {
                            if (Tools.Object.validate(attributes, [ { name: "node",     type: "string" },
                                                                    { name: "name",     type: "string" },
                                                                    { name: "value",    type: "string" }]) === true) {
                                return make(attributes);
                            } else {
                                for (var property in attributes) {
                                    if (Tools.Object.validate(attributes[property], [   { name: "node",     type: "string" },
                                                                                        { name: "name",     type: "string" },
                                                                                        { name: "value",    type: "string" }]) === true) {
                                        if (nodes === null) { nodes = {}; }
                                        nodes[property] = make(attributes[property]);
                                        if (nodes[property] === null) {
                                            return null;
                                        }
                                    } else {
                                        if (typeof attributes[property] === "object" && property !== "settingup") {
                                            if (nodes === null) { nodes = {}; }
                                            nodes[property] = Nodes.builder(attributes[property]);
                                            if (nodes[property] === null) {
                                                return null;
                                            }
                                        }
                                    }
                                }
                                settingup(attributes, nodes);
                            }
                        } catch (e) {
                            return null;
                        }
                        return nodes;
                    },
                    //Возвращает индекс узла в массиве детей родителя
                    Index       : function (targetNode) {
                        if (HTML.Nodes.Is(targetNode) === true) {
                            if (typeof targetNode.parentNode !== "undefined") {
                                if (targetNode.parentNode !== null) {
                                    for (var Index = targetNode.parentNode.childNodes.length - 1; Index >= 0; Index -= 1) {
                                        if (targetNode.parentNode.childNodes[Index] === targetNode) {
                                            return Index;
                                        }
                                    }
                                }
                            }
                        }
                        return -1;
                    },
                    //Возвращает массив узлов от указанного узла до указанного узла. При этом узлы должны иметь удиного родителя хотя бы на одном из уровней
                    //flagNoParentage - данный флаг в положении true отключает проверку родственных связей между указанными узлами, соответсвенно, если узлы
                    //указаны с ошибкой и floorNode не является общим отцом, то возникнет зацикливание. Однако проверку следует отключать в том случае, если 
                    //она была произведена до вызова данного метода. Отключение проверки может повлиять на производительность (в лучшую, разумеется, сторону).
                    GetFromTo   : function (floorNode, firstNode, lastNode, flagNoParentage) {
                        //Проверяет является ли ParentNode одним из родителей relationNode
                        function CheckParentage(ParentNode, relationNode) {
                            if (typeof relationNode.parentNode !== "undefined") {
                                if (ParentNode === relationNode.parentNode) {
                                    return true;
                                } else {
                                    return CheckParentage(ParentNode, relationNode.parentNode);
                                }
                            } else {
                                return null;
                            }
                        };
                        //Находит ближайщего к "полу" отца
                        function GetNearestParent(ParentNode, relationNode, antiLoop) {
                            if (typeof antiLoop === "undefined") { var antiLoop = 0; } else { antiLoop += 1; }
                            if (antiLoop < 500) {
                                if (ParentNode !== relationNode.parentNode) {
                                    return GetNearestParent(ParentNode, relationNode.parentNode, antiLoop);
                                } else {
                                    return relationNode;
                                }
                            } else {
                                return null;
                            }
                        };
                        //Находит все узлы справа от родственника вниз к указанному отцу
                        function GetAllRightsNodes(ParentNode, relationNode, allNodes, LoopCount) {
                            var flagPositionAfterTarget = false;
                            if (typeof LoopCount    === "undefined") { var LoopCount    = 0;    } else { LoopCount += 1; }
                            if (typeof allNodes     === "undefined") { var allNodes     = [];   }
                            if (LoopCount === 0) {
                                allNodes.push(relationNode);//Первый вход
                            }
                            if (LoopCount < 500) {
                                if (ParentNode !== relationNode.parentNode) {
                                    for (var Index = 0, MaxIndex = relationNode.parentNode.childNodes.length; Index < MaxIndex; Index += 1) {
                                        if (flagPositionAfterTarget === true) {
                                            allNodes.push(relationNode.parentNode.childNodes[Index]);
                                        }
                                        if (relationNode === relationNode.parentNode.childNodes[Index]) {
                                            //Определили искомый узел, добавляем в массив всех следующих за ним детей
                                            flagPositionAfterTarget = true;
                                        }
                                    }
                                    return GetAllRightsNodes(ParentNode, relationNode.parentNode, allNodes, LoopCount)
                                } else {
                                    return allNodes;
                                }
                            } else {
                                return null;
                            }
                        };
                        //Находит все узлы слева от родственника вниз к указанному отцу
                        function GetAllLeftsNodes(ParentNode, relationNode, allNodes, LoopCount, lastNode) {
                            if (typeof LoopCount    === "undefined") { var LoopCount    = 0;            } else { LoopCount += 1; }
                            if (typeof lastNode     === "undefined") { var lastNode     = relationNode; }
                            if (typeof allNodes     === "undefined") { var allNodes     = [];           }
                            if (LoopCount < 500) {
                                if (ParentNode !== relationNode.parentNode) {
                                    if (relationNode.parentNode.childNodes.length > 1) {
                                        for (var Index = 0, MaxIndex = relationNode.parentNode.childNodes.length; Index < MaxIndex; Index += 1) {
                                            if (relationNode !== relationNode.parentNode.childNodes[Index]) {
                                                allNodes.push(relationNode.parentNodePurity.Tools.childNodes[Index]);
                                            } else {
                                                break;
                                            }
                                        }
                                    }
                                    return GetAllLeftsNodes(ParentNode, relationNode.parentNode, allNodes, LoopCount, lastNode)
                                } else {
                                    allNodes.push(lastNode);//Добавляем последний узел
                                    return allNodes;
                                }
                            } else {
                                return null;
                            }
                        };
                        var allNodes                    = [],
                            runningNodes                = [],
                            ResultOperation             = null,
                            firstNodeNearestParent      = null,
                            lastNodeNearestParent       = null,
                            firstNodeNearestParentIndex = null,
                            currentParentNode           = null,
                            groupIndex                  = 0;
                        if (typeof flagNoParentage !== "boolean") { var flagNoParentage = false; }
                        if (flagNoParentage === false) {
                            if (HTML.Nodes.Is(floorNode) === true && HTML.Nodes.Is(firstNode) === true && HTML.Nodes.Is(lastNode) === true) {
                                flagNoParentage = true;
                            }
                            if (CheckParentage(floorNode, firstNode) === true && CheckParentage(floorNode, lastNode) === true) {
                                flagNoParentage = true;
                            } else {
                                flagNoParentage = false;
                            }
                        }
                        if (flagNoParentage === true) {
                            //Этап №1. --------------- Обработка начала.
                            ResultOperation = GetAllRightsNodes(floorNode, firstNode);
                            if (ResultOperation === null) { return null; }
                            allNodes.push.apply(allNodes, ResultOperation);
                            //Этап №2. --------------- Обработка отрезка до конца.
                            firstNodeNearestParent = GetNearestParent(floorNode, firstNode);   //Получаем отца начала, лежащего на полу
                            lastNodeNearestParent = GetNearestParent(floorNode, lastNode);    //Получаем отца конца, лежащего на полу
                            if (firstNodeNearestParent === null || lastNodeNearestParent === null) { return null; }
                            for (var Index = 0, MaxIndex = floorNode.childNodes.length; Index < MaxIndex; Index += 1) {
                                if (firstNodeNearestParentIndex !== null && lastNodeNearestParent !== floorNode.childNodes[Index]) {
                                    allNodes.push(floorNode.childNodes[Index]);
                                }
                                if (firstNodeNearestParent === floorNode.childNodes[Index]) {
                                    firstNodeNearestParentIndex = Index;
                                }
                                if (lastNodeNearestParent === floorNode.childNodes[Index]) {
                                    break;
                                }
                            }
                            //Этап №3. --------------- Обработка конца.
                            ResultOperation = GetAllLeftsNodes(floorNode, lastNode);
                            if (ResultOperation === null) { return null; }
                            allNodes.push.apply(allNodes, ResultOperation);
                            //Подготавливаем данные по группам. Группировка производится по отцу
                            currentParentNode = allNodes[0].parentNode;
                            groupIndex = 0;
                            for (var Index = 0, MaxIndex = allNodes.length; Index < MaxIndex; Index += 1) {
                                if (groupIndex !== runningNodes.length - 1) {
                                    runningNodes.push({ parent: currentParentNode, nodes: [] });
                                }
                                if (currentParentNode !== allNodes[Index].parentNode) {
                                    currentParentNode = allNodes[Index].parentNode;
                                    groupIndex += 1;
                                    Index -= 1;
                                } else {
                                    runningNodes[groupIndex].nodes.push(allNodes[Index]);
                                }
                            }
                            return {
                                nodes: allNodes,
                                runningNodes: runningNodes
                            };
                        }
                        return null;
                    },
                    //Оборачивает указанный узел в заданный узел. targetNode - может быть один объект или несколько в виде массива
                    Cover       : function (targetNode, coverNodeName) {
                        if ((HTML.Nodes.Is(targetNode) === true || targetNode instanceof Array) && typeof coverNodeName === "string") {
                            try {
                                var coverNode = document.createElement(coverNodeName);
                                if (HTML.Nodes.Is(coverNode) === true) {
                                    if (targetNode instanceof Array) {
                                        if (targetNode[0].parentNode !== null) {
                                            targetNode[0].parentNode.insertBefore(coverNode, targetNode[0]);
                                        }
                                        for (var Index = 0, MaxIndex = targetNode.length; Index < MaxIndex; Index += 1) {
                                            coverNode.appendChild(targetNode[Index]);
                                        }
                                    } else {
                                        if (targetNode.parentNode !== null) {
                                            targetNode.parentNode.insertBefore(coverNode, targetNode);
                                        }
                                        coverNode.appendChild(targetNode);
                                    }
                                    return coverNode;
                                }
                            } catch (e) {
                                return null;
                            }
                        }
                        return null;
                    },
                    //Пермещает все узлы указанного тега в отца данного тега
                    UnCover     : function (coverNodeName) {
                        var flagEnd = false;
                        if (HTML.Nodes.Is(coverNodeName) === true) {
                            if (HTML.Nodes.Is(coverNodeName.parentNode) === true) {
                                do {
                                    if (coverNodeName.childNodes.length > 0) {
                                        coverNodeName.parentNode.insertBefore(coverNodeName.childNodes[0], coverNodeName);
                                    } else {
                                        flagEnd = true;
                                    }
                                } while (flagEnd === false);
                                coverNodeName.parentNode.removeChild(coverNodeName);
                            }
                        }
                        return null;
                    },
                    //Вставка узла после указанного
                    InsertAfter : function (inseredNode, pointNode) {
                        var IndexNode = null;
                        if (HTML.Nodes.Is([inseredNode, pointNode]) === true) {
                            if (typeof pointNode.parentNode !== "undefined") {
                                if (pointNode.parentNode.childNodes[pointNode.parentNode.childNodes.length - 1] !== pointNode) {
                                    IndexNode = Nodes.Index(pointNode);
                                    if (IndexNode !== -1 && IndexNode < pointNode.parentNode.childNodes.length - 1) {
                                        pointNode.parentNode.insertBefore(inseredNode, pointNode.parentNode.childNodes[IndexNode + 1]);
                                        return true;
                                    }
                                } else {
                                    pointNode.parentNode.appendChild(inseredNode);
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    //Блок создания различных узлов
                    Create      : {
                        //Создает вложенный узел, возвращая массив узлов. Например, если nodesNames = ["div", "p", "b"] будет создан узел: <div><p><b></b></p></div>
                        NestedNode      : function (nodesNames) {
                            var allNodes = [];
                            if (nodesNames instanceof Array) {
                                for (var Index = 0, MaxIndex = nodesNames.length; Index < MaxIndex; Index += 1) {
                                    if (typeof nodesNames[Index] === "string") {
                                        try {
                                            switch (nodesNames[Index].toLowerCase()) {
                                                case "#text":
                                                    allNodes.push(document.createTextNode(""));
                                                    break;
                                                default:
                                                    allNodes.push(document.createElement(nodesNames[Index].toLowerCase()));
                                                    break;
                                            }
                                            if (Index > 0) {
                                                allNodes[Index].appendChild(allNodes[Index - 1]);
                                            }
                                        } catch (e) {
                                            return null;
                                        }
                                    } else {
                                        return null;
                                    }
                                }
                                if (allNodes.length > 0) {
                                    return {
                                        all: allNodes,
                                        parent: allNodes[allNodes.length - 1],
                                        last: allNodes[0]
                                    };
                                }
                            }
                            return null;
                        }
                    },
                    //Блок возвращающий и определяющий узлы по различным параметрам
                    Get         : {
                        //Возвращает первого общего отца между указанными узлами
                        CommonParent    : function (nodeOne, nodeTwo) {
                            var antiLoop        = 0,
                                defaultOneNode  = nodeOne;
                            if (HTML.Nodes.Is([nodeOne, nodeTwo]) === true) {
                                do {
                                    if (HTML.Nodes.Is(nodeTwo.parentNode) === true) {
                                        nodeOne = defaultOneNode;
                                        do {
                                            if (HTML.Nodes.Is(nodeOne.parentNode) === true) {
                                                if (nodeTwo.parentNode === nodeOne.parentNode) {
                                                    return {
                                                        parent: nodeTwo.parentNode,
                                                        parentOne: nodeOne,
                                                        parentTwo: nodeTwo
                                                    }
                                                } else {
                                                    nodeOne = nodeOne.parentNode;
                                                }
                                            } else {
                                                break;
                                            }
                                        } while (antiLoop < 1000);
                                        nodeTwo = nodeTwo.parentNode;
                                    } else {
                                        break;
                                    }
                                    antiLoop += 1;
                                } while (antiLoop < 1000);
                                return null;
                            }
                        },
                        //Возвращает ближайщего отца указанного типа
                        NearestParent   : function (upperNode, parentNodeName) {
                            if (typeof parentNodeName === "string" && HTML.Nodes.Is(upperNode) === true) {
                                if (HTML.Nodes.Is(upperNode.parentNode) === true) {
                                    if (upperNode.parentNode.nodeName.toLowerCase() === parentNodeName.toLowerCase()) {
                                        return upperNode.parentNode;
                                    } else {
                                        return Nodes.Get.NearestParent(upperNode.parentNode, parentNodeName);
                                    }
                                }
                            }
                            return null;
                        }
                    }
                };
                //Инструменты по работе с выделением
                Selections = {
                    //Местные хелперы
                    Helpers: {
                        GetWindow: function (DocumentLink) {
                            if (typeof DocumentLink !== "undefined") {
                                if (typeof DocumentLink.parentWindow !== "undefined") {
                                    return DocumentLink.parentWindow;
                                } else if (typeof DocumentLink.defaultView !== "undefined") {
                                    return DocumentLink.defaultView;
                                }
                            }
                            return null;
                        },
                        //Находит и возвращает ближайшего общего отца двух указанных узлов
                        GetCommonParent: function (firstNode, secondNode) {
                            function IsCommonParent(checkingParent, checkingNode) {
                                var antiLoop = 0;
                                do {
                                    if (HTML.Nodes.Is(checkingNode.parentNode) === true) {
                                        if (checkingParent === checkingNode.parentNode) {
                                            return true;
                                        } else {
                                            return IsCommonParent(checkingParent, checkingNode.parentNode);
                                        }
                                    } else {
                                        return false;
                                    }
                                    antiLoop += 1;
                                } while (antiLoop < 1000);
                            };
                            var antiLoop = 0;
                            if (HTML.Nodes.Is([firstNode, secondNode]) === true) {
                                do {
                                    if (HTML.Nodes.Is(firstNode.parentNode) === true) {
                                        if (IsCommonParent(firstNode.parentNode, secondNode) === true) {
                                            return firstNode.parentNode;
                                        } else {
                                            firstNode = firstNode.parentNode;
                                        }
                                    } else {
                                        return null;
                                    }
                                    antiLoop += 1;
                                } while (antiLoop < 1000);
                            }
                        }
                    },
                    //Возвращает текущее выделение, если оно есть
                    Get: {
                        //DocumentLink необходим, например, если нужно получить selection из встроенного iFrame
                        //Возвращает только выделенный текст
                        Text: function (DocumentLink) {
                            if (typeof DocumentLink === "undefined") {
                                var DocumentLink = document;
                            }
                            var WindowLink = Selections.Helpers.GetWindow(DocumentLink);
                            if (WindowLink !== null) {
                                if (typeof WindowLink.getSelection !== "undefined") {
                                    //Not IE
                                    return WindowLink.getSelection().toString();
                                } else if (typeof DocumentLink.selection !== "undefined") {
                                    //IE
                                    return DocumentLink.selection.createRange().text;
                                }
                            }
                            //Unknown error
                            return null;
                        },
                        //Возвращает набор узлов, вошедших в выделение. Конечный узел - #text. Если конечный узел вошел не полностью, то 
                        //метод делит его на вошедшую и невошедшую части и возвращает вошедшую.
                        Nodes: function (DocumentLink) {
                            //Разделяет текстовой узел на три текстовых
                            function DivideToThree(srcTextNode, startPosition, EndPosition) {
                                var fullText        = srcTextNode.nodeValue,
                                    leftTextNode    = null;
                                    rightTextNode   = null;
                                    middleTextNode  = null;
                                if (fullText.length > startPosition && fullText.length >= EndPosition && startPosition < EndPosition) {
                                    if (startPosition > 0) {
                                        leftTextNode = document.createTextNode(fullText.substring(0, startPosition));
                                        srcTextNode.parentNode.insertBefore(leftTextNode, srcTextNode);
                                    }
                                    middleTextNode = document.createTextNode(fullText.substring(startPosition, EndPosition));
                                    srcTextNode.parentNode.insertBefore(middleTextNode, srcTextNode);
                                    if (EndPosition < fullText.length) {
                                        rightTextNode = document.createTextNode(fullText.substring(EndPosition, fullText.length));
                                        srcTextNode.parentNode.insertBefore(rightTextNode, srcTextNode);
                                    }
                                    srcTextNode.parentNode.removeChild(srcTextNode);
                                    return {
                                        left: leftTextNode,
                                        middle: middleTextNode,
                                        right: rightTextNode
                                    };
                                }
                                return null;
                            };
                            //Разделяет текстовой узел на два текстовых
                            function DivideToTwo(srcTextNode, dividePosition) {
                                var fullText        = srcTextNode.nodeValue,
                                    leftTextNode    = null,
                                    rightTextNode   = null;
                                if (fullText.length > dividePosition) {
                                    leftTextNode = document.createTextNode(fullText.substring(0, dividePosition));
                                    rightTextNode = document.createTextNode(fullText.substring(dividePosition, fullText.length));
                                    srcTextNode.parentNode.insertBefore(leftTextNode, srcTextNode);
                                    srcTextNode.parentNode.insertBefore(rightTextNode, srcTextNode);
                                    srcTextNode.parentNode.removeChild(srcTextNode);
                                    return {
                                        left: leftTextNode,
                                        right: rightTextNode
                                    };
                                }
                                return null;
                            };
                            if (typeof DocumentLink === "undefined") {
                                var DocumentLink = document;
                            }
                            var Selection       = null,
                                SelectedRange   = null,
                                WindowLink      = Selections.Helpers.GetWindow(DocumentLink),
                                selectedNodes   = [],
                                runningNodes    = [],
                                Parent          = null,
                                DivideNodes     = null,
                                Start           = null,
                                End             = null,
                                ResultOperation = null;
                            if (WindowLink !== null) {
                                if (typeof WindowLink.getSelection !== "undefined") {
                                    //Not IE
                                    Selection = WindowLink.getSelection();
                                    if (Selection.rangeCount > 0) {
                                        SelectedRange = Selection.getRangeAt(0);
                                        Start   = { container: SelectedRange.startContainer, offset: SelectedRange.startOffset };
                                        End     = { container: SelectedRange.endContainer, offset: SelectedRange.endOffset };
                                        Parent = SelectedRange.commonAncestorContainer;
                                        if (HTML.Nodes.Is(Start.container) === true &&
                                            HTML.Nodes.Is(End.container) === true &&
                                            HTML.Nodes.Is(Parent) === true) {
                                            //Проверяем корректность выделения. (!) Данный метод не работает, если один из узлов (конец или начало) === body
                                            if (Start.container.nodeName.toLowerCase() === "body" || End.container.nodeName.toLowerCase() === "body") {
                                                Tools.Log.console.message({ message: "Purity.Tools.Selection.Get.Nodes", details: "Body is start or end node." });
                                                return null;
                                            } else {
                                                if (Start.container === End.container) {
                                                    //Ситуация: Узелы начала и конца совпадают
                                                    if (Start.container.nodeName === "#text" || Start.container.nodeName === "text") {
                                                        DivideNodes = DivideToThree(Start.container, Start.offset, End.offset);
                                                        if (DivideNodes !== null) {
                                                            selectedNodes.push(DivideNodes.middle);
                                                            runningNodes.push({ parent: DivideNodes.middle.parentNode, nodes: [DivideNodes.middle] });
                                                            Start.container = DivideNodes.middle;
                                                            End.container = DivideNodes.middle;
                                                        }
                                                    } else {
                                                        selectedNodes.push(Start.container);
                                                        runningNodes.push({ parent: DivideNodes.middle.parentNode, nodes: [DivideNodes.middle] });
                                                    }
                                                } else {
                                                    //Ситуация: Узелы начала и конца НЕ совпадают
                                                    //Смотрим нужно ли делить узлы
                                                    if (Start.container.nodeName === "#text" || Start.container.nodeName === "text") {
                                                        DivideNodes = DivideToTwo(Start.container, Start.offset);
                                                        if (DivideNodes !== null) {
                                                            Start.container = DivideNodes.right;
                                                        } else { return null; }
                                                    }
                                                    if (End.container.nodeName === "#text" || End.container.nodeName === "text") {
                                                        DivideNodes = DivideToTwo(End.container, End.offset);
                                                        if (DivideNodes !== null) {
                                                            End.container = DivideNodes.left;
                                                        } else { return null; }
                                                    }
                                                    //Получаем набор узлов между границами
                                                    ResultOperation = HTML.Nodes.GetFromTo(Parent, Start.container, End.container, true);
                                                    if (ResultOperation !== null) {
                                                        selectedNodes = ResultOperation.nodes;
                                                        runningNodes = ResultOperation.runningNodes;
                                                    } else {
                                                        return null;
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        return false;
                                    }
                                } else if (typeof DocumentLink.selection !== "undefined") {
                                    //IE
                                    Selection = DocumentLink.selection;
                                    SelectedRange = Selection.createRange();
                                }
                                //Возвращаем результат
                                if (Parent !== null && selectedNodes.length > 0 && typeof runningNodes[0] === "object") {
                                    return {
                                        parent      : Parent,
                                        nodes       : selectedNodes,
                                        runningNodes: runningNodes,
                                        message     : "good",
                                        borders     : {
                                            start   : Start.container,
                                            end     : End.container
                                        }
                                    };
                                }
                            }
                            //Unknown error
                            return null;
                        }
                    },
                    //Очищает выделение
                    Clear: function () {
                        try {
                            if (typeof window.getSelection !== "undefined") {
                                //Not IE
                                window.getSelection().collapse();
                            } else if (typeof document.selection !== "undefined") {
                                //IE
                                document.selection.clear();
                            }
                        } catch (e) {
                        }
                    },
                    //Устанавливаем выделение
                    Set: {
                        //Устанавливает выделение по указанным узлам
                        ByNodes: function (startNode, endNode) {
                            var commonParent    = null,
                                resultSelection = null,
                                selectedRange   = null;
                            if (HTML.Nodes.Is([startNode, endNode]) === true) {
                                commonParent = Selections.Helpers.GetCommonParent(startNode, endNode);
                                if (HTML.Nodes.Is(commonParent) === true) {
                                    if (typeof document.createRange === "function") {
                                        resultSelection = window.getSelection();
                                        selectedRange   = document.createRange();
                                        selectedRange.setStart(startNode, 0);
                                        selectedRange.setEnd(endNode, endNode.nodeValue.length);
                                        resultSelection.removeAllRanges();
                                        resultSelection.addRange(selectedRange);
                                        return true;
                                    } else {
                                    }
                                }
                                Tools.Log.console.message({ message: "Purity.Tools.Selections.Set.ByNodes", details: "No common parent" });
                            }
                            return null;
                        }
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicNodes = {
                    build       : Nodes.builder,
                    Index       : Nodes.Index,
                    GetFromTo   : Nodes.GetFromTo,
                    Cover       : Nodes.Cover,
                    UnCover     : Nodes.UnCover,
                    InsertAfter : Nodes.InsertAfter,
                    Create      : Nodes.Create,
                    Get         : Nodes.Get
                };
                publicSelections = {
                    Get         : Selections.Get,
                    Set         : Selections.Set,
                    Clear       : Selections.Clear
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
                    Selection   : publicSelections,
                    Nodes       : publicNodes
                    //---< Public part		>--[end]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());