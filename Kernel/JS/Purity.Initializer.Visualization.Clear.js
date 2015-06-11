/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <module>
///     <summary>
///         Make visualization on loading proccess
///     </summary>
/// </module>
(function () {
    "use strict";
    var Visualization = function () {
        /// <summary>Discription of library</summary>
        var name        = "Purity::: Visualization: Clear",
            version     = "1.0",
            lastUpdate  = "29.07.2013",
            author      = "Dmitry Astafyev",
            //Declaration module's blocks
            Render      = {},
            Logs        = {},
            Stages      = {},
            Events      = {},
            init        = null;
            //Declaration references
        //---< Private part		>--[begin]---------------------------------------------------------------------------------------
        Render = {
            Resources : {
                css             : "html{width:100%;height:100%}body{width:100%;height:100%;max-width:1px;max-height:1px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAMAAADto6y6AAAAD1BMVEUgICAAAQAoKCg1NTU/Pz+suxeKAAAAOklEQVR42u2QwQkAMAgDo3b/mftSlKO4QO+VINGgZPJkarMyXb8TcaJM1/IJBtiYFh3WBDpsx8l/CbgSVgPZd9YSYQAAAABJRU5ErkJggg==);background-repeat:repeat;overflow:visible}div[data-type=\"PVC.Background.Cover\"]{position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;opacity:.7}div[data-type=\"PVC.Logo.Container\"]{position:absolute;top:100%;left:50px;margin-top:-150px;width:100px;height:100px}div[data-type=\"PVC.Logo.Basis\"]{position:absolute;width:100px;height:100px;border-radius:50px;background:#383838;background:-moz-linear-gradient(top,rgba(56,56,56,1) 1%,rgba(214,214,214,1) 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(1%,rgba(56,56,56,1)),color-stop(100%,rgba(214,214,214,1)));background:-webkit-linear-gradient(top,rgba(56,56,56,1) 1%,rgba(214,214,214,1) 100%);background:-o-linear-gradient(top,rgba(56,56,56,1) 1%,rgba(214,214,214,1) 100%);background:-ms-linear-gradient(top,rgba(56,56,56,1) 1%,rgba(214,214,214,1) 100%);background:linear-gradient(to bottom,rgba(56,56,56,1) 1%,rgba(214,214,214,1) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#383838',endColorstr='#d6d6d6',GradientType=0);-webkit-box-shadow:3px 3px 15px rgba(0,0,0,.4),-3px -3px 15px rgba(255,255,255,1);box-shadow:3px 3px 15px rgba(0,0,0,.4),-3px -3px 15px rgba(255,255,255,1)}div[data-type=\"PVC.Logo.Basis\"]:after{content:\"\";position:absolute;width:90px;height:90px;margin-top:5px;margin-left:5px;border-radius:50px;background:#000}div[data-type=\"PVC.Logo.LightWayRing\"]{position:absolute;width:70px;height:70px;margin-top:10px;margin-left:10px;border-radius:40px;border:dotted 5px #00f}div[data-type=\"PVC.Logo.LightWayRing.Cover\"]{position:absolute;width:80px;height:80px;margin-top:10px;margin-left:10px;border-radius:40px;background:-moz-linear-gradient(top,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,rgba(0,0,0,0)),color-stop(50%,rgba(0,0,0,1)),color-stop(100%,rgba(0,0,0,1)));background:-webkit-linear-gradient(top,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 100%);background:-o-linear-gradient(top,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 100%);background:-ms-linear-gradient(top,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 100%);background:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000',endColorstr='#000000',GradientType=0);-moz-animation-name:PVC_Logo_LightWayRing_Cover;-o-animation-name:PVC_Logo_LightWayRing_Cover;-webkit-animation-name:PVC_Logo_LightWayRing_Cover;animation-name:PVC_Logo_LightWayRing_Cover;-moz-animation-iteration-count:infinite;-o-animation-iteration-count:infinite;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-moz-animation-duration:2000ms;-o-animation-duration:2000ms;-webkit-animation-duration:2000ms;animation-duration:2000ms;-moz-animation-timing-function:linear;-o-animation-timing-function:linear;-webkit-animation-timing-function:linear;animation-timing-function:linear}div[data-type=\"PVC.Logo.Button\"]{position:absolute;width:60px;height:60px;margin-top:20px;margin-left:20px;border-radius:30px;background:#a5a5a5;background:-moz-radial-gradient(center,ellipse cover,rgba(165,165,165,1) 1%,rgba(0,0,0,1) 77%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(1%,rgba(165,165,165,1)),color-stop(77%,rgba(0,0,0,1)));background:-webkit-radial-gradient(center,ellipse cover,rgba(165,165,165,1) 1%,rgba(0,0,0,1) 77%);background:-o-radial-gradient(center,ellipse cover,rgba(165,165,165,1) 1%,rgba(0,0,0,1) 77%);background:-ms-radial-gradient(center,ellipse cover,rgba(165,165,165,1) 1%,rgba(0,0,0,1) 77%);background:radial-gradient(ellipse at center,rgba(165,165,165,1) 1%,rgba(0,0,0,1) 77%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#a5a5a5',endColorstr='#000000',GradientType=1)}div[data-type=\"PVC.Logo.Button\"]:after{content:\"\";position:absolute;width:60px;height:60px;border-radius:30px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAWCAYAAAC2ew6NAAAEZUlEQVR42oWX12ogMQxFhzTSe4f03ntPSCP1JY2E/P+PaDmCA2Z2s3kQnrElX+lalmaqlpaWQGZnZ2NpaSnW19djdXXVMWVzczP6+vpiZGQkSn2E597e3lhbW4udnZ0ct7e3Y2NjI/fo6OiIpqammJmZCfW1X1xcRA+MtNna2krZ29v7C68CBOFlbm6OzTFiBDjHlZWVmJ6eTsCenh71dTLXDWx3dzftlpeXERxKZ9Uv8RYWFgwI3ZKkDKzEq2RmeHg4Dg8PMdRRmGSDdGR/fz8GBgZicnKyZCb1Tk5OGBEYSV3ZPTo6StDm5ubUr+MhpaNiYzc4OCheMppHcHl5ySIARKXDCHPJ1OnpabKADceCzvn5eZydnck8wTEPMI6yzt7smc6Jpx362IqJjY6CNz8/n6xWn5+f8fDwwIK5wqIRMrIZzmbu3N/fx8fHR7y8vMTT0xNzbA6T6BtYinMHBwdxd3cXX19f8fr6Ch5Mso4++yMEmnY6fHx8HDc3N/H9/R0VE0bEkTGW4DIFo7zDBjrlMakHmBcS/TLPsfOiGQTinJfJk2QekiSqYlLaZdJ3jQHnWSM2Yd0biw4jLOGEzpS3H+FZFrVlP94hg5EAJY93SNNRI85xamoqk7i1tTVlaGiIhM6NdKhkUkcmJiaw85KRj+Qz+jqpLuASAh6XNLHa29ujv7/f6iNBKVV5W3Gos7MzGhoaMObCZIno6upiU4+REce9NNxqEj5tGxsbsUnbsbExwGRRlnSeNUpXHY991IHNfK7MBYBHR0dhA2PLSTrQ3d0d4+PjBoTAFnY8AwAYIOhigy17wLTOcawEZ05j9yMevhgYAVVl4re1tVkr6x0IVr10lhSFNZgETP16B8LG/Db3f8VDR2YrjO0kLMJKrYMgRF8vPToOI4hMlvbM/av0MP6Kh09UIi8TjDLBcWpYZ8aS5THaNpkjR9mYsc4MlcQqwqiYoz/iUXvNa2w5eqNkkdwgR0pmOBoCwVDBxnwjUI6Qo5cZWbEt6yxi6vwXj7bs6aWjHqFl4+LiAkc4MiSBbm9vMbQpyIiAOXd1dcWJeMnIS1ogHQ8d6yq6BsiaeDiLkzgPXq6ZLnn0gNou7bHPz89Ba0UeHx9xEtasoSkGiK1BXl9fx/v7e7y9vdHfZQU7bcsgCQbHbMvg8ZxzBidG5bHrqB0IKT4wZMEW+U+HfS4dK2+7TcMuJK52YsO67VVnq9IJj1LnTHiD8AbCLgwK4Gg71U4QA2Rf9RxtmTLoXVDX9lrRBWh33Fgd0kkDMD3QoU1aoPkKJycB+OGbwXcuG5eFkkRbpk3++s2AHb6BV1EeEDYCVGetmTqJEQlPB6K4WzuZ45b6C4GtHQgmcAgycJICX8fDDhxZLUseQYnnPxNgMiGbjH7a0UIBBAQ22QjhmRJjXnpRzHHWAKNUJUaJh6Pq+qFNsJBUx/OfyWMpCzOGbISzfNkQmWWkrHscZXmjS4H1ZNJeXsfzyw1Hy89DbEq8P07aJTElh3R1AAAAAElFTkSuQmCC);background-repeat:repeat;opacity:.3}div[data-type=\"PVC.Logo.Button.Glare\"]{position:absolute;width:50px;height:50px;margin-top:3px;margin-left:5px;border-radius:25px;background:-moz-linear-gradient(top,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 18%,rgba(255,255,255,0) 69%,rgba(255,255,255,0) 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,rgba(255,255,255,1)),color-stop(18%,rgba(255,255,255,1)),color-stop(69%,rgba(255,255,255,0)),color-stop(100%,rgba(255,255,255,0)));background:-webkit-linear-gradient(top,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 18%,rgba(255,255,255,0) 69%,rgba(255,255,255,0) 100%);background:-o-linear-gradient(top,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 18%,rgba(255,255,255,0) 69%,rgba(255,255,255,0) 100%);background:-ms-linear-gradient(top,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 18%,rgba(255,255,255,0) 69%,rgba(255,255,255,0) 100%);background:linear-gradient(to bottom,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 18%,rgba(255,255,255,0) 69%,rgba(255,255,255,0) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff',endColorstr='#00ffffff',GradientType=0)}div[data-type=\"PVC.Logo.Button.Cover\"]{position:absolute;width:60px;height:60px;margin-top:20px;margin-left:20px;border-radius:30px;background:#fff;-webkit-box-shadow:0 0 25px rgba(255,255,255,1);box-shadow:0 0 25px rgba(255,255,255,1);opacity:.01;-webkit-transition:opacity ease-out 400ms;-moz-transition:opacity ease-out 400ms;-ms-transition:opacity ease-out 400ms;-o-transition:opacity ease-out 400ms;transition:opacity ease-out 400ms;cursor:pointer}div[data-type=\"PVC.Logo.Button.Cover\"]:hover{opacity:.4}div[data-type=\"PVC.Label.Container\"]{position:absolute;top:100%;left:200px;margin-top:-150px;height:100px}p[data-type=\"PVC.Label.Title\"]{font-family:'OCR A Std';font-size:40px;color:rgba(0,0,0,.8);margin:25px 0 0 -3px;padding:0;-webkit-text-shadow:0 2px 3px #666;text-shadow:0 2px 3px #666;cursor:default}p[data-type=\"PVC.Label.SubTitle\"]{font-family:'OCR A Std';font-size:12px;color:#323232;margin:0;padding:0;cursor:default}div[data-type=\"PVC.Logs.Container\"]{position:absolute;top:10%;left:20%;width:60%;height:60%;border-radius:6px;background:rgba(0,0,0,.4);-webkit-box-shadow:3px 3px 15px rgba(0,0,0,.4);box-shadow:3px 3px 15px rgba(0,0,0,.4);overflow:hidden}div[data-type=\"PVC.Logs.Container\"]:hover{overflow:auto}p[data-type=\"PVC.Logs.Message\"]{font-family:'Arial Narrow','Nimbus Sans L',sans-serif;font-size:12px;margin:6px 6px 6px 24px;padding:0}span[data-type=\"PVC.Logs.Message.Type.OK\"]{color:#088f02;font-weight:bold}span[data-type=\"PVC.Logs.Message.Type.BAD\"]{color:#a40000;font-weight:bold}span[data-type=\"PVC.Logs.Message.Type.RESPONSE\"]{color:#030575;font-weight:bold}.PVC_Logs_Message_Type_Normal{color:#fff}.PVC_Logs_Message_Type_Critical{color:#ff3232}div[data-type=\"PVC.Stages.Container\"]{position:absolute;top:50%;left:20%;margin-top:-25px;width:60%;height:50px}p[data-type=\"PVC.Stages.Message\"]{font-family:'Arial Narrow','Nimbus Sans L',sans-serif;font-size:22px;margin:6px;padding:0;text-align:center;-moz-animation-name:PVC_Stages_Message;-o-animation-name:PVC_Stages_Message;-webkit-animation-name:PVC_Stages_Message;animation-name:PVC_Stages_Message;-moz-animation-duration:400ms;-o-animation-duration:400ms;-webkit-animation-duration:400ms;animation-duration:400ms;-moz-animation-timing-function:ease-in-out;-o-animation-timing-function:ease-in-out;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}.PVC_Stages_Message_Type_Normal{color:#323232;-webkit-text-shadow:0 0 6px rgba(255,255,255,.7);text-shadow:0 0 6px rgba(255,255,255,.7)}.PVC_Stages_Message_Type_Critical{color:red;-webkit-text-shadow:0 0 6px rgba(0,0,0,.7);text-shadow:0 0 6px rgba(0,0,0,.7)}@keyframes PVC_Logo_LightWayRing_Cover{from{-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-moz-keyframes PVC_Logo_LightWayRing_Cover{from{-moz-transform:rotate(0deg);transform:rotate(0deg)}to{-moz-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes PVC_Logo_LightWayRing_Cover{from{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes PVC_Stages_Message{from{-moz-transform:translateY(-60px);-ms-transform:translateY(-60px);-o-transform:translateY(-60px);-webkit-transform:translateY(-60px);transform:translateY(-60px);opacity:0}to{-moz-transform:translateY(0);-ms-transform:translateY(0);-o-transform:translateY(0);-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@-moz-keyframes PVC_Stages_Message{from{-moz-transform:translateY(-60px);transform:translateY(-60px);opacity:0}to{-moz-transform:translateY(0);transform:translateY(0);opacity:1}}@-webkit-keyframes PVC_Stages_Message{from{-webkit-transform:translateY(-60px);transform:translateY(-60px);opacity:0}to{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}",
                cssStyleSheet   : null,
                backgroundLayer : null,
                logoLayer       : null,
                labelLayer      : null,
                stageLayer      : null,
                logsLayer       : null
            },
            Init: {
                resources: function () {
                    Render.Resources.cssStyleSheet = Purity.System.Resources.css.adoption(Render.Resources.css);
                },
                visualisation: function () {
                    var backgroundLayer = document.createElement("DIV"),
                        logoLayer       = document.createElement("DIV"),
                        labelLayer      = document.createElement("DIV"),
                        stageLayer      = document.createElement("DIV"),
                        logsLayer       = document.createElement("DIV"),
                        switcher        = null;
                    backgroundLayer.setAttribute("data-type", "PVC.Background.Cover");
                    logoLayer.      setAttribute("data-type", "PVC.Logo.Container"  );
                    labelLayer.     setAttribute("data-type", "PVC.Label.Container" );
                    stageLayer.     setAttribute("data-type", "PVC.Stages.Container");
                    logsLayer.      setAttribute("data-type", "PVC.Logs.Container"  );
                    logoLayer.      innerHTML = "<div data-type=\"PVC.Logo.Basis\"></div><div data-type=\"PVC.Logo.LightWayRing\"></div><div data-type=\"PVC.Logo.LightWayRing.Cover\"></div><div data-type=\"PVC.Logo.Button\"><div data-type=\"PVC.Logo.Button.Glare\"> </div></div><div id=\"PVC.Logo.Button.Cover\" data-type=\"PVC.Logo.Button.Cover\"></div>";
                    labelLayer.     innerHTML = "<p data-type=\"PVC.Label.Title\">Purity</p><p data-type=\"PVC.Label.SubTitle\">Distinctly. Scalable. Upgradable.</p>";
                    Render.Resources.backgroundLayer    = backgroundLayer;
                    Render.Resources.logoLayer          = logoLayer;
                    Render.Resources.stageLayer         = stageLayer;
                    Render.Resources.logsLayer          = logsLayer;
                    Render.Resources.labelLayer         = labelLayer;
                    Logs.Switch.off();
                    document.body.appendChild(backgroundLayer);
                    document.body.appendChild(logoLayer);
                    document.body.appendChild(stageLayer);
                    document.body.appendChild(logsLayer);
                    document.body.appendChild(labelLayer);
                    switcher = document.getElementById("PVC.Logo.Button.Cover");
                    Purity.System.Events.addListener(switcher, "click", Logs.Switch.taggle);
                },
                all: function () {
                    Render.Init.resources();
                    Render.Init.visualisation();
                }
            }
        };
        Logs = {
            Switch: {
                isOn    : true,
                on      : function () {
                    var logsLayer = Render.Resources.logsLayer;
                    if (logsLayer !== null) {
                        logsLayer.style.opacity = 1;
                        Logs.Switch.isOn = true;
                        Stages.Switch.off();
                    }
                },
                off     : function () {
                    var logsLayer = Render.Resources.logsLayer;
                    if (logsLayer !== null) {
                        logsLayer.style.opacity = 0.01;
                        Logs.Switch.isOn = false;
                        Stages.Switch.on();
                    }
                },
                taggle  : function () {
                    if (Events.closeHandle === null) {
                        if (Logs.Switch.isOn === true) {
                            Logs.Switch.off();
                        } else {
                            Logs.Switch.on();
                        }
                    } else {
                        Events.finish();
                        Purity.System.runHandle(Events.closeHandle, null, "[Initializer.Visualization.Clear][Logs.Switch.taggle]", this);
                    }
                }
            },
            types:{
                begin: function (type) {
                    switch (type) {
                        case "[response]":
                            return "<span data-type=\"PVC.Logs.Message.Type.RESPONSE\">[response] </span><hr><xmp>";
                            break;
                        case "[ok]":
                            return "<span data-type=\"PVC.Logs.Message.Type.OK\">[ok] </span>";
                            break;
                        case "[bad]":
                            return "<span data-type=\"PVC.Logs.Message.Type.OK\">[bad] </span>";
                            break;
                    }
                    return "";
                },
                end: function (type) {
                    switch (type) {
                        case "[response]":
                            return "</xmp><hr>";
                            break;
                    }
                    return "";
                },
            },
            add: function (message, isCritical, type) {
                var message             = (typeof message       === "string"    ? (message.length > 1000 ? message.substr(0, 1000) : message + "... [cut: more than 1000 symbols]") : null          ),
                    type                = (typeof type          === "string"    ? type          : "[standart]"  ),
                    isCritical          = (typeof isCritical    === "boolean"   ? isCritical    : false         ),
                    logsLayer           = Render.Resources.logsLayer,
                    messageParagraph    = null;
                if (logsLayer !== null && message !== null) {
                    messageParagraph = document.createElement("P");
                    messageParagraph.innerHTML = Logs.types.begin(type) + message + Logs.types.end(type);
                    messageParagraph.setAttribute("data-type", "PVC.Logs.Message");
                    if (isCritical === true) {
                        messageParagraph.className = "PVC_Logs_Message_Type_Critical";
                    } else {
                        messageParagraph.className = "PVC_Logs_Message_Type_Normal";
                    }
                    logsLayer.appendChild(messageParagraph);
                    logsLayer.scrollTop = logsLayer.scrollHeight;
                }
            }
        };
        Stages = {
            Cache : {
                paragraph   : null,
                update      : function (newParagraph) {
                    if (Stages.Cache.paragraph !== null) {
                        if (typeof Stages.Cache.paragraph.parentNode !== "undefined") {
                            if (Stages.Cache.paragraph.parentNode !== null) {
                                Stages.Cache.paragraph.parentNode.removeChild(Stages.Cache.paragraph);
                            }
                        }
                    }
                    Stages.Cache.paragraph = newParagraph;
                }
            },
            Switch: {
                isOn    : true,
                on      : function () {
                    var stageLayer = Render.Resources.stageLayer;
                    if (stageLayer !== null) {
                        stageLayer.style.opacity = 1;
                        Stages.Switch.isOn = true;
                    }
                },
                off     : function () {
                    var stageLayer = Render.Resources.stageLayer;
                    if (stageLayer !== null) {
                        stageLayer.style.opacity = 0.01;
                        Stages.Switch.isOn = false;
                    }
                },
                taggle  : function () {
                    if (Stages.Switch.isOn === true) {
                        Stages.Switch.off();
                    } else {
                        Stages.Switch.on();
                    }
                }
            },
            show: function (message, isCritical) {
                var message             = (typeof message       === "string"    ? message       : null  ),
                    isCritical          = (typeof isCritical    === "boolean"   ? isCritical    : false ),
                    stageLayer          = Render.Resources.stageLayer,
                    messageParagraph    = null;
                if (stageLayer !== null && message !== null && isCritical !== null) {
                    messageParagraph            = document.createElement("P");
                    messageParagraph.innerHTML  = message;
                    messageParagraph.setAttribute("data-type", "PVC.Stages.Message");
                    if (isCritical === true) {
                        messageParagraph.className = "PVC_Stages_Message_Type_Critical";
                    } else {
                        messageParagraph.className = "PVC_Stages_Message_Type_Normal";
                    }
                    stageLayer.appendChild(messageParagraph);
                    Stages.Cache.update(messageParagraph);
                }
            }
        },
        Events = {
            closeHandle: null,
            getMessage: function (params) {
                var message     = (typeof params.message    === "string"    ? params.message    : null          ),
                    type        = (typeof params.type       === "string"    ? params.type       : "[standart]"  ),
                    isCritical  = (typeof params.isCritical === "boolean"   ? params.isCritical : false         );
                if (message !== null) {
                    Logs.add(message, isCritical, type);
                    Stages.show(message, isCritical);
                }
            },
            finish: function () {
                try{
                    document.body.removeChild(Render.Resources.backgroundLayer);
                    document.body.removeChild(Render.Resources.labelLayer);
                    document.body.removeChild(Render.Resources.logoLayer);
                    document.body.removeChild(Render.Resources.logsLayer);
                    document.body.removeChild(Render.Resources.stageLayer);
                    document.head.removeChild(Render.Resources.cssStyleSheet);
                    Visualization = null;
                }catch(e){}
            },
            onConsole : function(){
                Logs.Switch.on();
            },
            registrationCloseHandle: function (closeHandle) {
                if (typeof closeHandle === "function" && Events.closeHandle === null) {
                    Events.closeHandle = closeHandle;
                }
            },
            init: function () {
                if (typeof Purity.attachVisualization === "function") {
                    Purity.attachVisualization(Events.getMessage, Events.onConsole, Events.finish, Events.registrationCloseHandle);
                }
            }
        };
        init = function () {
            Events.init();
            Render.Init.all();
            Events.getMessage({ message: "Purity.Initializer is loaded", isCritical: false });
            Events.getMessage({ message: "Initializer visualization was activated::: \"Clear\" theme", isCritical: false });
        };
        init();
        //---< Private part		>--[end]---------------------------------------------------------------------------------------
        //---< Security part	>--[begin]---------------------------------------------------------------------------------------
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
            }
            //---< Public end		>--[begin]---------------------------------------------------------------------------------------
        }
    };
    //Run visualization
    Visualization();
}());