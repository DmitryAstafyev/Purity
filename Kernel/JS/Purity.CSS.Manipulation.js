/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <reference path="~/Kernel/JS/Purity.Environment.Events.js" />
/// <module>
///     <summary>
///         This module cotrol and manage basic properies of CSS.
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("CSS.Manipulation",
            //Check references
            {
                modules     : ["HTML", "Environment.Events", "Tools", "Environment.Overhead", "Controls.Tools"],
                resources   : null
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name                = "Purity::: CSS.Manipulation",
                    version             = "1.0",
                    lastUpdate          = "08.07.2013",
                    author              = "Dmitry Astafyev",
                //Declaration module's blocks
                    StyleSheet          = {},
                    Rules               = {},
                    Classes             = {},
                    Keyframes           = {},
                    Animations          = {},
                    Styles              = {},
                    publicStyleSheet    = {},
                    publicKeyframes     = {},
                    publicAnimations    = {},
                    publicRules         = {},
                    publicClasses       = {},
                    publicStyles        = {},
                //Declaration references
                    HTML                = new Purity.initModule("HTML"),
                    Events              = new Purity.initModule("Environment.Events"),
                    Tools               = new Purity.initModule("Tools"),
                    ControlsTools       = new Purity.initModule("Controls.Tools"),
                    Overhead            = new Purity.initModule("Environment.Overhead");
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                //Control dynamic creation of style sheets
                StyleSheet = {
                    configuration : {
                        id_property: "purity_css_manipulation_title"
                    },
                    //Create StyleSheet
                    create: function (id) {
                        ///     <summary>Create new dynamic style sheet. Return new style sheet. Willn't create if sheet with defined id exists (return false).</summary>
                        ///     <param name="id" type="string">id of style sheet</param>
                        ///     <returns type="DOMObject" mayBeNull="true">Null - if error. False - if sheet exists. New style sheet - if is OK.</returns>
                        var linkNode            = null,
                            resultStyleSheet    = null,
                            id_property         = StyleSheet.configuration.id_property;
                        if (typeof id === "string") {
                            resultStyleSheet = StyleSheet.get(id);
                            if (resultStyleSheet === false) {
                                if (document.createStyleSheet) {
                                    resultStyleSheet                        = document.createStyleSheet();
                                    resultStyleSheet[id_property]           = id;
                                } else {
                                    resultStyleSheet                        = null;
                                    linkNode                                = document.createElement("STYLE");
                                    linkNode.id                             = id;
                                    linkNode.type                           = "text/css";
                                    document.head.insertBefore(linkNode, document.head.firstChild);
                                    if (linkNode.sheet) {
                                        linkNode.sheet[id_property]         = id;
                                        resultStyleSheet                    = linkNode.sheet;
                                    } else if (linkNode.styleSheet) {
                                        linkNode.styleSheet[id_property]    = id;
                                        resultStyleSheet                    = linkNode.styleSheet;
                                    }
                                }
                                //Unify stylesheet
                                resultStyleSheet = (resultStyleSheet !== null ? Rules.Unification.unify(resultStyleSheet) : null);
                            } else {
                                return false;
                            }
                            return resultStyleSheet;
                        }
                        return null;
                    },
                    //Return link to style sheet by id
                    get: function (id) {
                        ///     <summary>Return link to style sheet by id</summary>
                        ///     <param name="id" type="string">id 7-[
                        /// of style sheet</param>
                        ///     <returns type="DOMObject" mayBeNull="true">Null - if error. False - if not find. Style sheet - if is OK.</returns>
                        var styleSheets = document.styleSheets,
                            id_property = StyleSheet.configuration.id_property;
                        if (styleSheets !== null && typeof id === "string") {
                            for (var index = styleSheets.length - 1; index >= 0; index -= 1) {
                                if (typeof (styleSheets[index][id_property]) === "string") {
                                    if (styleSheets[index][id_property] === id) {
                                        return styleSheets[index];
                                    }
                                }
                            }
                            return false;
                        }
                        return null;
                    },
                };
                //Control CSS classes
                Classes = {
                    //Remove CSS class
                    remove: function (element, className) {
                        var element     = (HTML.Nodes.Is(element)   === true        ? element   : null),
                            className   = (typeof className         === "string"    ? className : null),
                            tagReg      = null;
                        if (Tools.Vars.IsNotEquality([element, className], null) === true) {
                            if (element.className.indexOf(className) !== -1) {
                                tagReg              = new RegExp("\\b" + className + "\\b", "gim");
                                element.className   = element.className.replace(tagReg, "");
                                element.className   = element.className.replace(/\s+/gim, " ");
                                element.className   = element.className.replace(/^\s*/gim, "");
                                element.className   = element.className.replace(/\s*$/gim, "");
                                return true;
                            }
                        }
                        return false;
                    },
                    //Add CSS class
                    add: function (element, className) {
                        var element     = (HTML.Nodes.Is(element)   === true        ? element   : null),
                            className   = (typeof className         === "string"    ? className : null),
                            tagReg      = null;
                        if (Tools.Vars.IsNotEquality([element, className], null) === true) {
                            if (element.className.indexOf(className) === -1) {
                                element.className = element.className + " " + className;
                                element.className = element.className.replace(/^\s*/gim, "");
                                return true;
                            }
                        }
                        return false;
                    },
                };
                //Controls CSS rules
                Rules = {
                    //Block of unification procedures for cross-browsers support
                    Unification: {
                        //Return all rules of sheet
                        crossRules: function (linkSheet) {
                            linkSheet.crossRules = linkSheet.cssRules ? linkSheet.cssRules : linkSheet.rules;
                            return linkSheet;
                        },
                        //Add new rule to sheet
                        crossAddRule: function (linkSheet) {
                            if (typeof linkSheet.insertRule !== "undefined") {
                                linkSheet.crossAddRule = function (ruleString) {
                                    if (typeof ruleString === "string") {
                                        this.insertRule(ruleString, 0);
                                        return true;
                                    }
                                    return false;
                                };
                            } else if (typeof linkSheet.addRule !== "undefined") {
                                linkSheet.crossAddRule = function (ruleString) {
                                    if (typeof ruleString === "string") {
                                        this.addRule(ruleString, -1);
                                        return true;
                                    }
                                    return false;
                                };
                            }
                            return linkSheet;
                        },
                        //Remove rule by index from sheet
                        crossDeleteRule: function (linkSheet) {
                            linkSheet.crossDeleteRule = linkSheet.deleteRule ? linkSheet.deleteRule : linkSheet.removeRule;
                            return linkSheet;
                        },
                        //Make all unifucation procedures for rules
                        unify: function (linkSheet) {
                            var unityRules = Rules.Unification;
                            if (typeof linkSheet !== "undefined") {
                                linkSheet = unityRules.crossRules(linkSheet);
                                linkSheet = unityRules.crossAddRule(linkSheet);
                                linkSheet = unityRules.crossDeleteRule(linkSheet);
                                return linkSheet;
                            }
                            return null;
                        }
                    },
                    //Add rule to style sheet
                    add: function (sheetLink, ruleString) {
                        if (typeof sheetLink.crossAddRule === "undefined") {
                            sheetLink = Rules.Unification.unify(sheetLink);
                        }
                        if (typeof sheetLink.crossAddRule !== "undefined" && typeof ruleString === "string") {
                            return sheetLink.crossAddRule(ruleString);
                        }
                        return false;
                    },
                    //Get index of rule
                    index: function (sheetLink, ruleName, isCSSClass, ruleSelector) {
                        var sheetLink       = (typeof sheetLink     !== "undefined" ? sheetLink     : null),
                            ruleName        = (typeof ruleName      === "string"    ? ruleName      : null),
                            ruleSelector    = (typeof ruleSelector  === "string"    ? ruleSelector  : ""),
                            isCSSClass      = (typeof isCSSClass    === "boolean"   ? isCSSClass    : false);
                        if (Tools.Vars.IsNotEquality([sheetLink, ruleName], null) === true) {
                            try {
                                if (typeof sheetLink.crossRules === "undefined") {
                                    sheetLink = Rules.Unification.unify(sheetLink);
                                }
                                ruleSelector = (isCSSClass      === true    ? "." + ruleName    : ruleName      );
                                ruleSelector = (ruleSelector    === ""      ? ruleName          : ruleSelector  );
                                for (var index = sheetLink.crossRules.length - 1; index >= 0; index -= 1) {
                                    if (typeof sheetLink.crossRules[index].name !== "undefined") {
                                        if (sheetLink.crossRules[index].name === ruleName) {
                                            return index;
                                        }
                                    }
                                    if (typeof sheetLink.crossRules[index].selectorText !== "undefined") {
                                        if (sheetLink.crossRules[index].selectorText === ruleSelector) {
                                            return index;
                                        }
                                    }
                                }
                                return -1;
                            } catch (e) {
                                return -1;
                            }
                        }
                    },
                    //Remove rule
                    remove: function (sheetLink, ruleName, isCSSClass, ruleSelector) {
                        var sheetLink       = (typeof sheetLink     !== "undefined" ? sheetLink     : null  ),
                            ruleName        = (typeof ruleName      === "string"    ? ruleName      : null  ),
                            ruleSelector    = (typeof ruleSelector  === "string"    ? ruleSelector  : ""    ),
                            isCSSClass      = (typeof isCSSClass    === "boolean"   ? isCSSClass    : false ),
                            ruleIndex       = null;
                        if (Tools.Vars.IsNotEquality([sheetLink, ruleName], null) === true) {
                            if (typeof sheetLink.crossDeleteRule === "undefined") {
                                sheetLink = Rules.Unification.unify(sheetLink);
                            }
                            ruleIndex = Rules.index(sheetLink, ruleName, isCSSClass, ruleSelector);
                            if (ruleIndex !== -1) {
                                sheetLink.crossDeleteRule(ruleIndex);
                                return true;
                            }
                        }
                        return false;
                    }
                };
                //Control CSS Keyframes
                Keyframes = {
                    //Create new Keyframe Rule
                    create: function (sheetLink, name, ruleString) {
                        ///     <summary>Create new Keyframe Rule.</summary>
                        ///     <param name="name" type="string">Name of rule</param>
                        ///     <param name="ruleString" type="string">Value of keyframe</param>
                        ///     <returns type="boolean" mayBeNull="true">Null - if error. True - if is OK.</returns>
                        var sheetLink   = (sheetLink ? sheetLink : null),
                            name        = (typeof name          === "string" ? name         : null),
                            ruleString  = (typeof ruleString    === "string" ? ruleString   : null),
                            newRule     = null,
                            add         = Rules.add;
                        if (sheetLink !== null && name !== null && ruleString !== null) {
                            if (ruleString.charAt(0)                        !== '{') { ruleString = "{" + ruleString; }
                            if (ruleString.charAt(ruleString.length - 1)    !== '}') { ruleString = ruleString + "}"; }
                            newRule = name + " " + ruleString;
                            if (CSSRule.WEBKIT_KEYFRAMES_RULE) {        // WebKit
                                return add(sheetLink, "@-webkit-keyframes " + newRule);
                            } else if (CSSRule.MOZ_KEYFRAMES_RULE) {    // Moz
                                return add(sheetLink, "@-moz-keyframes "    + newRule);
                            } else if (CSSRule.O_KEYFRAMES_RULE) {      // Opera
                                return add(sheetLink, "@-o-keyframes "      + newRule);
                            } else if (CSSRule.KEYFRAMES_RULE) {        // W3C
                                return add(sheetLink, "@keyframes "         + newRule);
                            }
                            return false;
                        }
                        return null;
                    },
                    remove: function (sheetLink, name) {
                        var sheetLink   = (sheetLink ? sheetLink : null),
                            name        = (typeof name === "string" ? name : null),
                            remove      = Rules.remove;
                        if (sheetLink !== null && name !== null) {
                            if (CSSRule.KEYFRAMES_RULE) {               // W3C
                                return remove(sheetLink,    name, false, "@keyframes "          + name);
                            } else if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
                                return remove(sheetLink,    name, false, "@-webkit-keyframes "  + name);
                            } else if (CSSRule.MOZ_KEYFRAMES_RULE) {    // Moz
                                return remove(sheetLink,    name, false, "@-moz-keyframes "     + name);
                            } else if (CSSRule.O_KEYFRAMES_RULE) {      // Opera
                                return remove(sheetLink,    name, false, "@-moz-keyframes "     + name);
                            }
                            return false;
                        }
                        return null;
                    },
                    //Return keyframe rule by name
                    get: function (sheetLink, name) {
                        ///     <summary>Return Keyframe Rule by name</summary>
                        ///     <param name="name" type="string">Name of rule</param>
                        ///     <returns type="DOMObject" mayBeNull="true">Null - if error. DOMObject - if is OK.</returns>
                        ///     <field name="rule" static="false" type="DOMObject">rule</field>
                        ///     <field name="index" static="false" type="number">index of rule</field>
                        var sheetLink = (sheetLink ? sheetLink : null),
                            name        = (typeof name === "string" ? name : null),
                            rules       = null,
                            resultRule  = null;
                        if (sheetLink !== null && typeof name !== null) {
                            if (typeof sheetLink.crossRules === "undefined") {
                                sheetLink = Rules.Unification.unify(sheetLink);
                            }
                            rules = sheetLink.crossRules;
                            if (rules !== null) {
                                for (var index = rules.length - 1; index >= 0; index -= 1) {
                                    if (rules[index].type === window.CSSRule.WEBKIT_KEYFRAMES_RULE  && rules[index].name === name) { resultRule = rules[index]; break; }
                                    if (rules[index].type === window.CSSRule.KEYFRAMES_RULE         && rules[index].name === name) { resultRule = rules[index]; break; }
                                    if (rules[index].type === window.CSSRule.MOZ_KEYFRAMES_RULE     && rules[index].name === name) { resultRule = rules[index]; break; }
                                }
                                if (resultRule !== null) {
                                    return {
                                        rule    : resultRule,
                                        index   : index
                                    };
                                }
                            }
                        }
                        return null;
                    },
                };
                //Create CSS animations
                Animations = {
                    config:{
                        sheetName       : "PurityCSSAnimationStyleSheet",
                        AnimationName   : "PurityCSSAnimationID",
                    },
                    IDs: {
                        id : -1,
                        get : function() {
                            Animations.IDs.id += 1;
                            return Animations.config.AnimationName + "_" + Animations.IDs.id;
                        },
                    },
                    Sheet: {
                        current : null,
                        get     : function () {
                            if (Animations.Sheet.current === null) {
                                Animations.Sheet.current = StyleSheet.create(Animations.config.sheetName);
                            }
                            return Animations.Sheet.current;
                        }
                    },
                    //Apply some animation to any DOM object and clear animation data after animation will finish
                    apply: function (params) {
                        ///     <summary>Apply CSS animation to any DOM object. Clear animation data after animation will finish</summary>
                        ///     <param name="params" type="Object">
                        ///         {element            : DOMObject || string (selector),                                       &#13;&#10;
                        ///          keyframes          : string    (rules like : {from{...}to{...}})                           &#13;&#10;                  
                        ///          animation          : string    (animation string like (without name of animation): 1000ms ease-in 0ms normal),         &#13;&#10;               
                        ///          onFinish           : function  (will be called on finish animation. [this] will be element &#13;&#10;              
                        ///         }
                        ///     </param>
                        ///     <returns type="boolean" mayBeNull="true">True - if OK. False - if some problem is</returns>
                        var idAnimation = Animations.IDs.get(),
                            sheet       = Animations.Sheet.get();
                        if (Tools.Object.validate(params, [ { name: "element",      type: "node"                    },
                                                            { name: "keyframes",    type: "string"                  },
                                                            { name: "animation",    type: "string"                  },
                                                            { name: "onFinish",     type: "function", value: null   }]) === true) {
                            //Attach event of end animation
                            Events.CSS.Animation.attach.end(params.element, function () {
                                Animations.clear(params.element, idAnimation, params.onFinish);
                            }, true);
                            //Create animation
                            Keyframes.create(sheet, idAnimation + "_keyFrames", params.keyframes);
                            //Create triggering class
                            Rules.add(sheet, "." + idAnimation + "_triggeringClass" + "{" +
                                "animation: "            + idAnimation + "_keyFrames" + " " + params.animation + ";" +
                                "-webkit-animation: "    + idAnimation + "_keyFrames" + " " + params.animation + ";" +
                                "-moz-animation: "       + idAnimation + "_keyFrames" + " " + params.animation + ";" +
                                "-o-animation: "         + idAnimation + "_keyFrames" + " " + params.animation + ";" +
                                "}");
                            //Launch animation: attach class
                            Classes.add(params.element, idAnimation + "_triggeringClass");
                            return idAnimation;
                        }
                        return null;
                    },
                    clear: function (element, id, onFinish) {
                        var element     = ControlsTools.Nodes.Get(element, "CSS.Manipulation: Animations.clear"),
                            id          = (typeof id        === "string"    ? id        : null),
                            onFinish    = (typeof onFinish  === "function"  ? onFinish  : null),
                            sheet       = Animations.Sheet.get();
                        if (Tools.Vars.IsNotEquality([element, id, sheet], null) === true) {
                            //Launch handle 
                            Purity.System.runHandle(onFinish, null, "[CSS.Manipulation] Animations.clear", element);
                            //Delete class
                            Classes.    remove(element, id + "_triggeringClass"         );
                            //Delete rule (of class)
                            Rules.      remove(sheet,   id + "_triggeringClass", true   );
                            //Delete rule (keyframes)
                            Keyframes.  remove(sheet,   id + "_keyFrames"               );
                            return true;
                        }
                        return false;
                    },
                };
                Styles = {
                    property: function (node, property) {
                        function getProperty(node, property, prefix) {
                            if (typeof node.style !== "undefined") {
                                for (var index = prefix.length - 1; index >= 0; index -= 1) {
                                    if (node.style[(prefix[index] + property)] !== "undefined") {
                                        return {
                                            name: prefix[index] + property
                                        };
                                    }
                                }
                            }
                            return null;
                        };
                        var argument_node       = (HTML.Nodes.Is(node) === true ? node : null),
                            argument_property   = (typeof property === "string" ? property : null),
                            prefix              = ["webkit", "moz", "o", "ms", ""],
                            result_property     = null;
                        if (argument_node !== null && argument_property !== null) {
                            result_property         = getProperty(argument_node, argument_property, prefix);
                            if (result_property === null) {
                                argument_property   = argument_property.substr(1, 1).toUpperCase() + argument_property.substr(2, argument_property.length);
                                result_property     = getProperty(argument_node, argument_property, prefix);
                            }
                            return result_property;
                        }
                        return null;
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicStyleSheet    = {
                    create  : StyleSheet.create,
                    get     : StyleSheet.get
                };
                publicKeyframes     = {
                    add     : Keyframes.create,
                    get     : Keyframes.get,
                    remove  : Keyframes.remove
                };
                publicAnimations    = {
                    apply           : Animations.apply,
                    applyAnimation  : function(element, keyframes, animation, onFinish){
                        ///     <summary>Apply CSS animation to any DOM object. Clear animation data after animation will finish</summary>
                        ///     <param name="element"   type="node"   >DOM node</param>
                        ///     <param name="keyframes" type="string"   >rules like : {from{...}to{...}})</param>
                        ///     <param name="animation" type="string"   >animation string like (without name of animation): 1000ms ease-in 0ms normal</param>
                        ///     <param name="onFinish"  type="function" >will be called on finish animation. [this] will be element</param>
                        ///     <returns type="boolean" mayBeNull="true">True - if OK. False - if some problem is</returns>
                        return Animations.apply({ element: element, keyframes: keyframes, animation: animation, onFinish: onFinish });
                    },
                    clear           : Animations.clear
                };
                publicRules         = {
                    add     : Rules.add,
                    remove  : Rules.remove
                };
                publicClasses       = {
                    add     : Classes.add,
                    remove  : Classes.remove
                };
                publicStyles        = {
                    property: Styles.property
                };
                //---< Security part	>--[end]---------------------------------------------------------------------------------------
                //---< Init part	    >--[begin]---------------------------------------------------------------------------------------
                //---< Init part	    >--[end]---------------------------------------------------------------------------------------
                return {
                    //---< Public part		>--[begin]---------------------------------------------------------------------------------------
                    AboutModule: {
                        getName         : function () { return name; },
                        getVersion      : function () { return version; },
                        getLastUpdate   : function () { return lastUpdate; },
                        getAuthor       : function () { return author; }
                    },
                    Sheets      : publicStyleSheet,
                    KeyFrames   : publicKeyframes,
                    Animations  : publicAnimations,
                    Rules       : publicRules,
                    Classes     : publicClasses,
                    Styles      : publicStyles
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                };
            },
            //Init function
            function () {
            }
        );
    }
}());