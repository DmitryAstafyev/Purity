/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.HTML.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
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
        Purity.createModule("Controls.Tools.Align",
            //Check references
            {
                modules     : ["Tools", "HTML"],
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Controls.Tools.Align",
                    version         = "1.0",
                    lastUpdate      = "29.05.2013",
                    author          = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Initializer     = {},
                    Align           = {},
                    PublicMethods   = {},
                    //Declaration references
                    HTML            = new Purity.initModule("HTML"  ),
                    Tools           = new Purity.initModule("Tools" );
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Initializer = {
                    validate: {
                        basic   : function (params) {
                            return Tools.Object.validate(params, [  { name: "node",     type: "node"                },
                                                                    { name: "basenode", type: "node", value: null   },
                                                                    { name: "position", type: "object"              }]);
                        },
                        position: function (params) {
                            return Tools.Object.validate(params, [  { name: "vertical",     type: "string", values: ["top", "center", "bottom"] },
                                                                    { name: "horizontal",   type: "string", values: ["left", "center", "right"] }]);
                        },
                    },
                    set: function (params) {
                        if (Initializer.validate.basic(params) === true) {
                            //Check positions
                            if (Initializer.validate.position(params.position) === true) {
                                return Align.set(params);
                            }
                        }
                        return null;
                    }
                };
                Align = {
                    nodes: {
                        isAbsolute: function (node) {
                            //Проверяем узел
                            if (document.defaultView.getComputedStyle(node).position === "absolute" ||
                                document.defaultView.getComputedStyle(node).position === "relative") {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    set: function (params) {
                        var node_size           = null,
                            basenode_size       = null,
                            basenode_position   = null,
                            flag                = true,
                            position            = {
                                top : null,
                                left: null
                            };
                        //Check styles. Both nodes should be in absolution or relative.
                        flag = (flag === false ? flag : Align.nodes.isAbsolute(params.node));
                        flag = (flag === false ? flag : (params.basenode === null ? flag : Align.nodes.isAbsolute(params.basenode)));
                        if (flag !== false) {
                            //Get size and position
                            node_size                   = HTML.Render.GetSize           (params.node    );
                            node_size.width             = node_size.OuterWidth;
                            node_size.height            = node_size.OuterHeight;
                            if (params.basenode !== null) {
                                basenode_size           = HTML.Render.GetSize           (params.basenode);
                                basenode_position       = HTML.Render.Position.ByPage   (params.basenode);
                                basenode_size.width     = basenode_size.OuterWidth;
                                basenode_size.height    = basenode_size.OuterHeight;
                            } else {
                                basenode_size = {
                                    width   : HTML.Render.WindowSize.Width(),
                                    height  : HTML.Render.WindowSize.Height()
                                };
                                basenode_position = {
                                    top     : 0,
                                    left    : 0
                                };
                            }
                            //Get position
                            switch (params.position.horizontal) {
                                case "left":
                                    position.left = 0 + basenode_position.left; break;
                                case "right":
                                    position.left = basenode_size.width - node_size.width + basenode_position.left; break;
                                case "center":
                                    position.left = Math.round((basenode_size.width - node_size.width) / 2 + basenode_position.left); break;
                            }
                            switch (params.position.vertical) {
                                case "top":
                                    position.top = 0 + basenode_position.top; break;
                                case "bottom":
                                    position.top = basenode_size.height - node_size.height + basenode_position.top; break;
                                case "center":
                                    position.top = Math.round((basenode_size.height - node_size.height) / 2 + basenode_position.top); break;
                            }
                            //Apply position
                            params.node.style.left  = position.left + "px";
                            params.node.style.top   = position.top  + "px";
                            return position;
                        }
                        return false;
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                PublicMethods = {
                    set: function () {
                        return Purity.System.runHandle(Initializer.set, arguments, "[Controls.Tools.Align][Initializer.set]", this);
                    },
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
                    set : PublicMethods.set
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());