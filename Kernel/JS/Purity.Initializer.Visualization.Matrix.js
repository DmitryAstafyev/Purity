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
        var name        = "Purity::: Visualization: Matrix",
            version     = "1.0",
            lastUpdate  = "11.11.2013",
            author      = "Dmitry Astafyev",
            //Declaration module's blocks
            Render      = {},
            Logs        = {},
            Stages      = {},
            Performing  = {},
            Events      = {},
            Feedback    = {},
            init        = null;
            //Declaration references
        //---< Private part		>--[begin]---------------------------------------------------------------------------------------
        Render = {
            Resources : {
                css             :"html{width:100%;height:100%}body{width:100%;height:100%;max-width:1px;max-height:1px;overflow:hidden}div[data-type=\"PVC.Background.Cover\"]{position:absolute;top:0;left:0;width:100%;height:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAIAAAER4zjTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACxJREFUKM9jkJKSYsACcAijSCHU4FFNpKF4zSfSePobO1TMJMMuejpj6DsSALgzCSX+jMDUAAAAAElFTkSuQmCC);background-repeat:repeat}div[data-type=\"PVC.Logo.Container\"]{position:absolute;top:100%;left:100%;margin-left:-20em;margin-top:-8em;width:20em;height:4em;background:#323232;background:-moz-linear-gradient(top,rgba(50,50,50,1) 0%,rgba(20,20,20,1) 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,rgba(50,50,50,1)),color-stop(100%,rgba(20,20,20,1)));background:-webkit-linear-gradient(top,rgba(50,50,50,1) 0%,rgba(20,20,20,1) 100%);background:-o-linear-gradient(top,rgba(50,50,50,1) 0%,rgba(20,20,20,1) 100%);background:-ms-linear-gradient(top,rgba(50,50,50,1) 0%,rgba(20,20,20,1) 100%);background:linear-gradient(to bottom,rgba(50,50,50,1) 0%,rgba(20,20,20,1) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#323232',endColorstr='#141414',GradientType=0);overflow:hidden;opacity:.9}div[data-type=\"PVC.Logo.Container\"]:after{content:\"\";position:absolute;top:.1em;left:.1em;width:19.8em;height:3.8em;background:#141414;background:-moz-linear-gradient(top,rgba(20,20,20,1) 0%,rgba(50,50,50,1) 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,rgba(20,20,20,1)),color-stop(100%,rgba(50,50,50,1)));background:-webkit-linear-gradient(top,rgba(20,20,20,1) 0%,rgba(50,50,50,1) 100%);background:-o-linear-gradient(top,rgba(20,20,20,1) 0%,rgba(50,50,50,1) 100%);background:-ms-linear-gradient(top,rgba(20,20,20,1) 0%,rgba(50,50,50,1) 100%);background:linear-gradient(to bottom,rgba(20,20,20,1) 0%,rgba(50,50,50,1) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#141414',endColorstr='#323232',GradientType=0);z-index:1}div[data-type=\"PVC.Logo.LightWayRing\"]{position:absolute;width:100%;margin-top:3.8em;height:.2em;background:#009600;z-index:2}div[data-type=\"PVC.Logo.LightWayRing.Cover\"]{position:absolute;width:200%;height:.2em;margin-top:3.8em;background:-moz-linear-gradient(left,rgba(50,50,50,1) 0%,rgba(50,50,50,1) 42%,rgba(50,50,50,0) 50%,rgba(50,50,50,1) 58%,rgba(50,50,50,1) 100%);background:-webkit-gradient(linear,left top,right top,color-stop(0%,rgba(50,50,50,1)),color-stop(42%,rgba(50,50,50,1)),color-stop(50%,rgba(50,50,50,0)),color-stop(58%,rgba(50,50,50,1)),color-stop(100%,rgba(50,50,50,1)));background:-webkit-linear-gradient(left,rgba(50,50,50,1) 0%,rgba(50,50,50,1) 42%,rgba(50,50,50,0) 50%,rgba(50,50,50,1) 58%,rgba(50,50,50,1) 100%);background:-o-linear-gradient(left,rgba(50,50,50,1) 0%,rgba(50,50,50,1) 42%,rgba(50,50,50,0) 50%,rgba(50,50,50,1) 58%,rgba(50,50,50,1) 100%);background:-ms-linear-gradient(left,rgba(50,50,50,1) 0%,rgba(50,50,50,1) 42%,rgba(50,50,50,0) 50%,rgba(50,50,50,1) 58%,rgba(50,50,50,1) 100%);background:linear-gradient(to right,rgba(50,50,50,1) 0%,rgba(50,50,50,1) 42%,rgba(50,50,50,0) 50%,rgba(50,50,50,1) 58%,rgba(50,50,50,1) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#323232',endColorstr='#323232',GradientType=1);-moz-animation-name:PVC_Logo_LightWayRing_Cover;-o-animation-name:PVC_Logo_LightWayRing_Cover;-webkit-animation-name:PVC_Logo_LightWayRing_Cover;animation-name:PVC_Logo_LightWayRing_Cover;-moz-animation-iteration-count:infinite;-o-animation-iteration-count:infinite;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-moz-animation-duration:10000ms;-o-animation-duration:10000ms;-webkit-animation-duration:10000ms;animation-duration:10000ms;-moz-animation-timing-function:linear;-o-animation-timing-function:linear;-webkit-animation-timing-function:linear;animation-timing-function:linear;z-index:3}div[data-type=\"PVC.Logo.Button\"]{position:absolute;width:3em;height:3em;margin-top:.5em;margin-left:.5em;border-radius:.3em;background:#969696;background:-moz-linear-gradient(top,rgba(150,150,150,1) 0%,rgba(65,65,65,1) 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,rgba(150,150,150,1)),color-stop(100%,rgba(65,65,65,1)));background:-webkit-linear-gradient(top,rgba(150,150,150,1) 0%,rgba(65,65,65,1) 100%);background:-o-linear-gradient(top,rgba(150,150,150,1) 0%,rgba(65,65,65,1) 100%);background:-ms-linear-gradient(top,rgba(150,150,150,1) 0%,rgba(65,65,65,1) 100%);background:linear-gradient(to bottom,rgba(150,150,150,1) 0%,rgba(65,65,65,1) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#969696',endColorstr='#414141',GradientType=0);z-index:2}div[data-type=\"PVC.Logo.Button\"]:after{content:\"\";position:absolute;width:2.8em;height:2.8em;margin-top:.1em;margin-left:.1em;border-radius:.3em;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAMAAADto6y6AAAAD1BMVEUgICAAAQAoKCg1NTU/Pz+suxeKAAAAOklEQVR42u2QwQkAMAgDo3b/mftSlKO4QO+VINGgZPJkarMyXb8TcaJM1/IJBtiYFh3WBDpsx8l/CbgSVgPZd9YSYQAAAABJRU5ErkJggg==);background-repeat:repeat;opacity:.2}div[data-type=\"PVC.Logo.Button\"]:before{content:\"\";position:absolute;width:2.8em;height:2.8em;margin-top:.1em;margin-left:.1em;border-radius:.3em;background:#414141;background:-moz-linear-gradient(top,rgba(65,65,65,1) 0%,rgba(150,150,150,1) 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,rgba(65,65,65,1)),color-stop(100%,rgba(150,150,150,1)));background:-webkit-linear-gradient(top,rgba(65,65,65,1) 0%,rgba(150,150,150,1) 100%);background:-o-linear-gradient(top,rgba(65,65,65,1) 0%,rgba(150,150,150,1) 100%);background:-ms-linear-gradient(top,rgba(65,65,65,1) 0%,rgba(150,150,150,1) 100%);background:linear-gradient(to bottom,rgba(65,65,65,1) 0%,rgba(150,150,150,1) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#414141',endColorstr='#969696',GradientType=0);opacity:1}div[data-type=\"PVC.Logo.Button.Cover\"]{position:absolute;width:3em;height:3em;margin-top:.5em;margin-left:.5em;border-radius:.3em;background:#fff;-webkit-box-shadow:0 0 25px rgba(255,255,255,1);box-shadow:0 0 25px rgba(255,255,255,1);cursor:pointer;-moz-animation-name:PVC_Logo_Button_Cover;-o-animation-name:PVC_Logo_Button_Cover;-webkit-animation-name:PVC_Logo_Button_Cover;animation-name:PVC_Logo_Button_Cover;-moz-animation-iteration-count:infinite;-o-animation-iteration-count:infinite;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-moz-animation-duration:2000ms;-o-animation-duration:2000ms;-webkit-animation-duration:2000ms;animation-duration:2000ms;-moz-animation-timing-function:linear;-o-animation-timing-function:linear;-webkit-animation-timing-function:linear;animation-timing-function:linear;z-index:3;display:none}div[data-type=\"PVC.Label.Container\"]{position:absolute;top:100%;left:100%;margin-left:-15em;margin-top:-7.7em;z-index:2}p[data-type=\"PVC.Label.Title\"]{font-family:'Arial Narrow','Nimbus Sans L',sans-serif;font-size:2em;color:#e6e6e6;margin:0;padding:0;cursor:default}p[data-type=\"PVC.Label.SubTitle\"]{font-family:'Lucida Sans Unicode','Lucida Grande','Lucida Sans','DejaVu Sans Condensed',sans-serif;font-size:.7em;color:#c8c8c8;margin-top:-.3em;margin-left:0;padding:0;cursor:default}div[data-type=\"PVC.Logs.Container\"]{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);overflow:auto}div[data-type=\"PVC.Logs.Container.Records\"]{position:absolute;top:0;left:0;width:100%;height:100%;overflow:auto;scrollbar-face-color:rgba(255,255,255,.7);scrollbar-base-color:#000;scrollbar-base-color:#000;scrollbar-3dlight-color:#000;scrollbar-highlight-color:#000;scrollbar-track-color:#000;scrollbar-arrow-color:#000;scrollbar-shadow-color:#000;scrollbar-dark-shadow-color:#000}p[data-type=\"PVC.Logs.Message\"]{font-family:'Lucida Sans Unicode','Lucida Grande','Lucida Sans','DejaVu Sans Condensed',sans-serif;font-size:.8em;margin:6px 6px 6px 24px;padding:0}span[data-type=\"PVC.Logs.Message.Type.OK\"]{color:#088f02;font-weight:bold}span[data-type=\"PVC.Logs.Message.Type.BAD\"]{color:#a40000;font-weight:bold}span[data-type=\"PVC.Logs.Message.Type.RESPONSE\"]{color:#0496ff;font-weight:bold}span[data-type=\"PVC.Logs.Message.Type.CRITICAL\"]{color:#ffea00;font-weight:bold}.PVC_Logs_Message_Type_Normal{color:#fff}.PVC_Logs_Message_Type_Critical{color:#ff3232}a[data-type=\"PVC.Link.Style\"]{text-decoration:none;color:#088f02}a[data-type=\"PVC.Link.Style\"]:hover{text-decoration:underline}p[data-type=\"PVC.Logs.PerformingMessage\"]{font-family:'Lucida Sans Unicode','Lucida Grande','Lucida Sans','DejaVu Sans Condensed',sans-serif;font-size:.8em;margin:6px 6px 6px 24px;padding:0;color:#00a308}div[data-type=\"PVC.Logs.PerformingMessage\"]{display:inline-block;max-width:3em;margin-left:.5em;margin-right:.5em;overflow:hidden;color:#00a308}div[data-type=\"PVC.Logs.PerformingMessage.Progress\"]{position:relative;width:4em;height:.8em;overflow:hidden;border-radius:.2em;background:#000;background:-moz-linear-gradient(left,rgba(0,0,0,1) 0%,rgba(0,163,8,1) 50%,rgba(0,0,0,1) 100%);background:-webkit-gradient(linear,left top,right top,color-stop(0%,rgba(0,0,0,1)),color-stop(50%,rgba(0,163,8,1)),color-stop(100%,rgba(0,0,0,1)));background:-webkit-linear-gradient(left,rgba(0,0,0,1) 0%,rgba(0,163,8,1) 50%,rgba(0,0,0,1) 100%);background:-o-linear-gradient(left,rgba(0,0,0,1) 0%,rgba(0,163,8,1) 50%,rgba(0,0,0,1) 100%);background:-ms-linear-gradient(left,rgba(0,0,0,1) 0%,rgba(0,163,8,1) 50%,rgba(0,0,0,1) 100%);background:linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,163,8,1) 50%,rgba(0,0,0,1) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000',endColorstr='#000000',GradientType=1);-moz-animation-name:PVC_PerformingMessage_Progress;-o-animation-name:PVC_PerformingMessage_Progress;-webkit-animation-name:PVC_PerformingMessage_Progress;animation-name:PVC_PerformingMessage_Progress;-moz-animation-iteration-count:infinite;-o-animation-iteration-count:infinite;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-moz-animation-duration:2000ms;-o-animation-duration:2000ms;-webkit-animation-duration:2000ms;animation-duration:2000ms;-moz-animation-timing-function:linear;-o-animation-timing-function:linear;-webkit-animation-timing-function:linear;animation-timing-function:linear}div[data-type=\"PVC.Logs.Records.Top\"]{position:relative;width:100%}div[data-type=\"PVC.Logs.Records.Bottom\"]{position:relative;width:100%}div[data-type=\"PVC.Stages.Container\"]{position:absolute;top:50%;left:20%;margin-top:-25px;width:60%;height:50px}p[data-type=\"PVC.Stages.Message\"]{font-family:'Arial Narrow','Nimbus Sans L',sans-serif;font-size:22px;margin:6px;padding:0;text-align:center;-moz-animation-name:PVC_Stages_Message;-o-animation-name:PVC_Stages_Message;-webkit-animation-name:PVC_Stages_Message;animation-name:PVC_Stages_Message;-moz-animation-duration:400ms;-o-animation-duration:400ms;-webkit-animation-duration:400ms;animation-duration:400ms;-moz-animation-timing-function:ease-in-out;-o-animation-timing-function:ease-in-out;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}.PVC_Stages_Message_Type_Normal{color:#323232;-webkit-text-shadow:0 0 6px rgba(255,255,255,.7);text-shadow:0 0 6px rgba(255,255,255,.7)}.PVC_Stages_Message_Type_Critical{color:red;-webkit-text-shadow:0 0 6px rgba(0,0,0,.7);text-shadow:0 0 6px rgba(0,0,0,.7)}@keyframes PVC_Logo_LightWayRing_Cover{0%{left:-100%}50%{left:0%}100%{left:-100%}}@-moz-keyframes PVC_Logo_LightWayRing_Cover{0%{left:-100%}50%{left:0%}100%{left:-100%}}@-webkit-keyframes PVC_Logo_LightWayRing_Cover{0%{left:-100%}50%{left:0%}100%{left:-100%}}@keyframes PVC_PerformingMessage_Progress{from{left:-200%}to{left:100%}}@-moz-keyframes PVC_PerformingMessage_Progress{from{left:-200%}to{left:100%}}@-webkit-keyframes PVC_PerformingMessage_Progress{from{left:-200%}to{left:100%}}@keyframes PVC_Logo_Button_Cover{0%{opacity:0}50%{opacity:.7}100%{opacity:0}}@-moz-keyframes PVC_Logo_Button_Cover{0%{opacity:0}50%{opacity:.7}100%{opacity:0}}@-webkit-keyframes PVC_Logo_Button_Cover{0%{opacity:0}50%{opacity:.7}100%{opacity:0}}@keyframes PVC_Stages_Message{from{-moz-transform:translateY(-60px);-ms-transform:translateY(-60px);-o-transform:translateY(-60px);-webkit-transform:translateY(-60px);transform:translateY(-60px);opacity:0}to{-moz-transform:translateY(0);-ms-transform:translateY(0);-o-transform:translateY(0);-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@-moz-keyframes PVC_Stages_Message{from{-moz-transform:translateY(-60px);transform:translateY(-60px);opacity:0}to{-moz-transform:translateY(0);transform:translateY(0);opacity:1}}@-webkit-keyframes PVC_Stages_Message{from{-webkit-transform:translateY(-60px);transform:translateY(-60px);opacity:0}to{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}::-webkit-scrollbar{width:1em}::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 .5em rgba(0,0,0,.3);-webkit-border-radius:.5em;border-radius:.5em}::-webkit-scrollbar-thumb{-webkit-border-radius:.5em;border-radius:.5em;background:rgba(255,255,255,.7);-webkit-box-shadow:inset 0 0 .5em rgba(0,0,0,.5)}::-webkit-scrollbar-thumb:window-inactive{background:rgba(255,255,255,.7)}",
                cssStyleSheet   : null,
                backgroundLayer : null,
                logoLayer       : null,
                labelLayer      : null,
                stageLayer      : null,
                logsLayer       : null,
                logsRecords     : null,
                topRecords      : null,
                bottomRecords   : null
            },
            Init: {
                resources: function () {
                    Render.Resources.cssStyleSheet = Purity.System.Resources.css.adoption(Render.Resources.css);
                },
                visualisation: function () {
                    var backgroundLayer     = document.createElement("DIV"),
                        logoLayer           = document.createElement("DIV"),
                        labelLayer          = document.createElement("DIV"),
                        stageLayer          = document.createElement("DIV"),
                        logsLayer           = document.createElement("DIV"),
                        LightWayRing        = document.createElement("DIV"),
                        LightWayRingCover   = document.createElement("DIV"),
                        logsRecords         = document.createElement("DIV"),
                        switcher            = null;
                    backgroundLayer.    setAttribute("data-type",   "PVC.Background.Cover"          );
                    logoLayer.          setAttribute("data-type",   "PVC.Logo.Container"            );
                    labelLayer.         setAttribute("data-type",   "PVC.Label.Container"           );
                    stageLayer.         setAttribute("data-type",   "PVC.Stages.Container"          );
                    logsLayer.          setAttribute("data-type",   "PVC.Logs.Container"            );
                    LightWayRing.       setAttribute("data-type",   "PVC.Logo.LightWayRing"         );
                    LightWayRing.       setAttribute("id",          "PVC.Logo.LightWayRing"         );
                    LightWayRingCover.  setAttribute("data-type",   "PVC.Logo.LightWayRing.Cover"   );
                    LightWayRingCover.  setAttribute("id",          "PVC.Logo.LightWayRing.Cover"   );
                    logsRecords.        setAttribute("data-type",   "PVC.Logs.Container.Records"    );
                    logoLayer.  innerHTML = "<div data-type=\"PVC.Logo.Button\"></div><div id=\"PVC.Logo.Button.Cover\" data-type=\"PVC.Logo.Button.Cover\"></div>";
                    labelLayer. innerHTML = "<p data-type=\"PVC.Label.Title\">Purity</p><p data-type=\"PVC.Label.SubTitle\">Distinctly. Scalable. Upgradable.</p>";
                    logsRecords.innerHTML = "<div id=\"PVC.Logs.Records.Top\" data-type=\"PVC.Logs.Records.Top\"></div><div id=\"PVC.Logs.Records.Bottom\" data-type=\"PVC.Logs.Records.Bottom\"></div>";
                    logoLayer.appendChild(LightWayRing);
                    logoLayer.appendChild(LightWayRingCover );
                    logsLayer.appendChild(logsRecords       );
                    Render.Resources.backgroundLayer    = backgroundLayer;
                    Render.Resources.logoLayer          = logoLayer;
                    Render.Resources.stageLayer         = stageLayer;
                    Render.Resources.logsLayer          = logsLayer;
                    Render.Resources.labelLayer         = labelLayer;
                    Render.Resources.logsRecords        = logsRecords;
                    Logs.Switch.off();
                    document.body.appendChild(backgroundLayer);
                    document.body.appendChild(logsLayer);
                    document.body.appendChild(logoLayer);
                    document.body.appendChild(stageLayer);
                    document.body.appendChild(labelLayer);
                    switcher                        = document.getElementById("PVC.Logo.Button.Cover");
                    Render.Resources.topRecords     = document.getElementById("PVC.Logs.Records.Top");
                    Render.Resources.bottomRecords  = document.getElementById("PVC.Logs.Records.Bottom");
                    Purity.System.Events.addListener(switcher, "click", Logs.Switch.taggle);
                },
                all: function () {
                    Render.Init.resources();
                    Render.Init.visualisation();
                }
            }
        };
        Button = {
            on : function(){
                var LogoButtonCover     = document.getElementById("PVC.Logo.Button.Cover"       ),
                    LightWayRing        = document.getElementById("PVC.Logo.LightWayRing"       ),
                    LightWayRingCover   = document.getElementById("PVC.Logo.LightWayRing.Cover" );
                if (LogoButtonCover !== null && LightWayRing !== null && LightWayRingCover !== null) {
                    LightWayRing.style.display      = "none";
                    LightWayRingCover.style.display = "none";
                    LogoButtonCover.style.display   = "block";
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
                        Purity.System.runHandle(Events.closeHandle, null, "[Initializer.Visualization.Matrix][Logs.Switch.taggle]", this);
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
                            return "<span data-type=\"PVC.Logs.Message.Type.BAD\">[bad] </span>";
                            break;
                        case "[critical]":
                            return "<span data-type=\"PVC.Logs.Message.Type.CRITICAL\">[critical] </span>";
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
            add: function (message, isCritical, type, atTheEnd) {
                var message             = (typeof message       === "string"    ? (message.length > 1000 ? message.substr(0, 1000) + "... [cut: more than 1000 symbols]" : message) : null),
                    type                = (typeof type          === "string"    ? type          : "[standart]"  ),
                    isCritical          = (typeof isCritical    === "boolean"   ? isCritical    : false         ),
                    atTheEnd            = (typeof atTheEnd      === "boolean"   ? atTheEnd      : false         ),
                    logsRecords         = (atTheEnd === true ? Render.Resources.bottomRecords : Render.Resources.topRecords),
                    messageParagraph    = null;
                if (logsRecords !== null && message !== null) {
                    messageParagraph = document.createElement("P");
                    messageParagraph.innerHTML = Logs.types.begin(type) + message + Logs.types.end(type);
                    messageParagraph.setAttribute("data-type", "PVC.Logs.Message");
                    if (isCritical === true) {
                        messageParagraph.className = "PVC_Logs_Message_Type_Critical";
                    } else {
                        messageParagraph.className = "PVC_Logs_Message_Type_Normal";
                    }
                    logsRecords.appendChild(messageParagraph);
                    Render.Resources.logsRecords.scrollTop = Render.Resources.logsRecords.scrollHeight;
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
        };
        Performing = {
            add: function (message, id) {
                var message         = (typeof message   === "string" ? message  : null),
                    id              = (typeof id        === "string" ? id       : null),
                    paragraph       = null,
                    logsRecords     = Render.Resources.topRecords;
                if (message !== null && id !== null) {
                    paragraph = document.createElement("P");
                    paragraph.setAttribute("data-type", "PVC.Logs.PerformingMessage");
                    paragraph.innerHTML = "<span data-type=\"PVC.Logs.Message.Type.OK\" id=\"" + id + "\">[<div data-type=\"PVC.Logs.PerformingMessage\"><div data-type=\"PVC.Logs.PerformingMessage.Progress\"></div></div>]</span> " + message;
                    logsRecords.appendChild(paragraph);
                    Render.Resources.logsRecords.scrollTop = Render.Resources.logsRecords.scrollHeight;
                }
            },
            done: function (id) {
                var id                  = (typeof id === "string" ? id : null),
                    progressContainer   = null;
                if (id !== null) {
                    progressContainer = document.getElementById(id);
                    if (progressContainer !== null) {
                        progressContainer.innerHTML = "[done]";
                    }
                }
            },
            fail: function (id) {
                var id                  = (typeof id === "string" ? id : null),
                    progressContainer   = null;
                if (id !== null) {
                    progressContainer = document.getElementById(id);
                    if (progressContainer !== null) {
                        progressContainer.innerHTML = "[fail]";
                    }
                }
            }
        };
        Events = {
            closeHandle     : null,
            feedbackHandle  : null,
            getMessage              : function (params) {
                var message     = (typeof params.message    === "string"    ? params.message    : null          ),
                    type        = (typeof params.type       === "string"    ? params.type       : "[standart]"  ),
                    isCritical  = (typeof params.isCritical === "boolean"   ? params.isCritical : false         ),
                    atTheEnd    = (typeof params.atTheEnd   === "boolean"   ? params.atTheEnd   : false         );
                if (message !== null) {
                    Logs.add(message, isCritical, type, atTheEnd);
                    Stages.show(message, isCritical);
                }
            },
            finish                  : function () {
                try {
                    if (Visualization !== null) {
                        document.body.removeChild(Render.Resources.backgroundLayer);
                        document.body.removeChild(Render.Resources.labelLayer);
                        document.body.removeChild(Render.Resources.logoLayer);
                        document.body.removeChild(Render.Resources.logsLayer);
                        document.body.removeChild(Render.Resources.stageLayer);
                        document.head.removeChild(Render.Resources.cssStyleSheet);
                        Visualization = null;
                    }
                }catch(e){}
            },
            onConsole               : function(){
                Logs.Switch.on();
            },
            registrationCloseHandle : function (handle) {
                if (typeof handle === "function" && Events.closeHandle === null) {
                    Events.closeHandle = handle;
                    Button.on();
                }
            },
            openRecord              : function (params) {
                var params  = (typeof params === "object" ? params : null),
                    message = (params !== null ? (typeof params.message === "string" ? params.message   : null) : null),
                    id      = (params !== null ? (typeof params.id      === "string" ? params.id        : null) : null);
                if (message !== null && id !== null) {
                    Performing.add(message, id);
                }
            },
            closeRecord             : function (id){
                Performing.done(id);
            },
            failRecord          : function (id) {
                Performing.fail(id);
            },
            registrationFeedback: function (handle) {
                if (typeof handle === "function" && Events.feedbackHandle === null) {
                    Events.feedbackHandle = handle;
                }
            },
            init                    : function () {
                if (typeof Purity.attachVisualization === "function") {
                    Purity.attachVisualization( {
                        messageHandle       : Events.getMessage,
                        onConsole           : Events.onConsole,
                        finishHandle        : Events.finish,
                        manualCloseConsole  : Events.registrationCloseHandle,
                        openRecord          : Events.openRecord,
                        closeRecord         : Events.closeRecord,
                        failRecord          : Events.failRecord,
                        feedback            : Events.registrationFeedback
                    });
                }
            }
        };
        Feedback = {
            init : function(){
                var feedbackLink = document.getElementById("PVC.Link.Send.Logs");
                if (feedbackLink !== null) {
                    Purity.System.Events.addListener(feedbackLink, "click", Feedback.send);
                }
            },
            send: function () {
                var feedbackLink    = document.getElementById("PVC.Link.Send.Logs"),
                    regExp          = null,
                    sourceString    = null;
                if (typeof Events.feedbackHandle === "function" && Render.Resources.logsLayer !== null) {
                    sourceString    = Render.Resources.logsLayer.innerHTML;
                    regExp          = new RegExp("</p>", "gim");
                    sourceString    = sourceString.replace(regExp, "\n\r");
                    regExp          = new RegExp("<(.*?)>", "gim");
                    sourceString    = sourceString.replace(regExp, "");
                    regExp          = new RegExp("&", "gim");
                    sourceString    = sourceString.replace(regExp, ".");
                    regExp          = new RegExp("=", "gim");
                    sourceString    = sourceString.replace(regExp, ":");
                    Purity.System.runHandle(Events.feedbackHandle, sourceString, "[Initializer.Visualization.Matrix][Feedback.send]", this);
                    Events.feedbackHandle   = null;
                    feedbackLink.innerHTML  = "[you've sent logs]";
                }
            }
        };
        init = function () {
            Events.init();
            Render.Init.all();
            Events.getMessage({ message: "Purity.Initializer is loaded", isCritical: false });
            Events.getMessage({ message: "Initializer visualization was activated::: \"Matrix\" theme", isCritical: false });
            Events.getMessage({ message: "You can send these logs to developer. It can be useful if you have some problems with loading of site. To send logs press here <a id=\"PVC.Link.Send.Logs\" data-type=\"PVC.Link.Style\" href=\"#\">send logs</a>.", isCritical: false, atTheEnd: true });
            Feedback.init();
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