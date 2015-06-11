/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <reference path="~/Kernel/JS/Purity.Tools.js" />
/// <reference path="~/Kernel/JS/Purity.Canvas.Geometry2D.js" />
/// <module>
///     <summary>
///         This module create some figures for CANVAS (only for 2D context)
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("Canvas.Figures",
            //Check references
            {
                modules     : ["Tools", "Canvas.Geometry2D"],
                resources   : null
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name                = "Purity.Canvas.Figures",
                    version             = "1.0",
                    lastUpdate          = "18.07.2013",
                    author              = "Dmitry Astafyev",
                //Declaration module's blocks
                    Axis                = {},
                    CanvasTools         = {},
                    Pinion              = {},
                    Arch                = {},
                    Rectangle           = {},
                    publicPinion        = {},
                    publicArch          = {},
                    publicRectangle     = {},
                    publicCanvasTools   = {},
                //Declaration references
                    Tools               = new Purity.initModule("Tools"),
                    Geometry2D          = new Purity.initModule("Canvas.Geometry2D");
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                //Draw axis
                Axis = {
                    draw: function (context, lengthX, lengthY) {
                        var context     = (typeof context !== "undefined" ? (typeof context.fillRect === "function" ? context : null) : null),
                            lengthX     = (typeof lengthX === "number" ? lengthX : null),
                            lengthY     = (typeof lengthY === "number" ? lengthY : null),
                            fragment    = 8,
                            offsetY     = 10;
                        if (Tools.Vars.IsNotEquality([context, lengthX, lengthY], null) === true) {
                            context.lineWidth   = 2;
                            context.strokeStyle = "rgba(20,20,20,0.4)";
                            context.fillStyle   = "rgba(20,20,20,0.4)";
                            CanvasTools.Shadows.reset(context);
                            context.beginPath();
                            context.moveTo(0,           -lengthY);
                            context.lineTo(0,           lengthY);
                            context.moveTo(-lengthX,    0);
                            context.lineTo(lengthX,     0);
                            context.moveTo(0,           -lengthY);
                            context.lineWidth = 1;
                            font = "12px Arial";
                            for (var index = -lengthY; index < lengthY; index += 10) {
                                context.moveTo(-(fragment / 2), index);
                                context.lineTo(fragment / 2, index);
                                context.fillText(index, fragment / 2, index);
                            }
                            for (var index = -lengthX; index < lengthX; index += 10) {
                                context.moveTo(index, -(fragment / 2));
                                context.lineTo(index, fragment / 2);
                                context.fillText(index, index, offsetY);
                                offsetY = (offsetY === 10 ? -10 : 10);
                            }
                            context.stroke();
                            context.closePath();
                        }
                    }
                };
                //Tools for canvas
                CanvasTools = {
                    Shadows: {
                        set: function (context, shadowData) {
                            var shadowData  = (typeof shadowData    === "object"    ? shadowData : null),
                                context     = (typeof context       !== "undefined" ? (typeof context.fillRect === "function" ? context : null) : null);
                            if (shadowData !== null && context !== null) {
                                if (typeof shadowData.shadowColor   === "string" && typeof shadowData.shadowBlur    === "number" &&
                                    typeof shadowData.shadowOffsetX === "number" && typeof shadowData.shadowOffsetY === "number") {
                                    context.shadowColor     = shadowData.shadowColor;
                                    context.shadowBlur      = shadowData.shadowBlur;
                                    context.shadowOffsetX   = shadowData.shadowOffsetX;
                                    context.shadowOffsetY   = shadowData.shadowOffsetY;
                                    return true;
                                }
                            }
                            return false;
                        },
                        reset: function (context) {
                            var context = (typeof context       !== "undefined" ? (typeof context.fillRect === "function" ? context : null) : null);
                            if (context !== null) {
                                context.shadowColor     = "";
                                context.shadowBlur      = 0;
                                context.shadowOffsetX   = 0;
                                context.shadowOffsetY   = 0;
                                return true;
                            }
                            return false;
                        }
                    }
                };
                //Draw pinion figure
                Pinion = {
                    render: function (params) {
                        ///     <summary>Create pinion figure.</summary>
                        ///     <param name="params" type="Object">
                        ///         {&#13;&#10;
                        ///             context : DOMObject &#13;&#10;
                        ///             x       : number (center of figure), &#13;&#10;                  
                        ///             y       : number (center of figure), &#13;&#10;               
                        ///             r       : number (radius of figure), &#13;&#10;              
                        ///             segments    : { &#13;&#10; 
                        ///                 count       : number (count of segments),&#13;&#10; 
                        ///                 indentation : number (deep of segments)&#13;&#10; 
                        ///             }&#13;&#10; 
                        ///             design      : { &#13;&#10; 
                        ///                 strokeStyle : string,&#13;&#10; 
                        ///                 lineWidth   : number,&#13;&#10; 
                        ///                 fillStyle   : string&#13;&#10; 
                        ///             }&#13;&#10; 
                        ///             shadow  : { &#13;&#10; 
                        ///                 shadowColor     : string,&#13;&#10; 
                        ///                 shadowBlur      : number,&#13;&#10; 
                        ///                 shadowOffsetX   : number,&#13;&#10; 
                        ///                 shadowOffsetY   : number,&#13;&#10; 
                        ///             }&#13;&#10; 
                        ///         }&#13;&#10;
                        ///         shadow - isn't obligatory
                        ///     </param>
                        ///     <returns type="Object" mayBeNull="true">Null - if error. True - if OK.</returns>
                        var params          = (params ? params : {}),
                            context         = (typeof params.context !== "undefined" ? (typeof params.context.fillRect === "function" ? params.context : null) : null),
                            design          = (typeof params.design === "object" ? params.design : null),
                            shadow          = (typeof params.shadow === "object" ? params.shadow : null),
                            center          = {},
                            segments        = (typeof params.segments  === "object" ? params.segments  : null),
                            r               = (typeof params.r === "number" ? params.r : null),
                            currentRadius   = 0;
                        //Prepare varibles
                        center.x = (typeof params.x         === "number" ? params.x         : null);
                        center.y = (typeof params.y         === "number" ? params.y         : null);
                        if (Tools.Vars.IsNotEquality([context, center.x, center.y, r, segments, design], null) === true) {
                            //Check segments property
                            if (typeof segments.count !== "number" || typeof segments.indentation !== "number") {
                                return null;
                            }
                            //Check design data
                            if (typeof design.strokeStyle !== "string" || typeof design.lineWidth !== "number" || typeof design.fillStyle !== "string") {
                                return null;
                            }
                            //Check shadow
                            if (shadow !== null) {
                                if (typeof shadow.shadowColor   !== "string" || typeof shadow.shadowBlur    !== "number" ||
                                    typeof shadow.shadowOffsetX !== "number" || typeof shadow.shadowOffsetY !== "number") {
                                    shadow = null;
                                }
                            }
                            //Prepare segments
                            segments.countAll       = segments.count * 2;
                            segments.angleSegment   = 360 / segments.countAll;
                            //Move context's center to center of circle
                            context.translate(center.x, center.y);
                            //Aplay decorations
                            context.strokeStyle = design.strokeStyle;
                            context.fillStyle   = design.fillStyle;
                            context.lineWidth   = design.lineWidth;
                            //Open path
                            context.beginPath();
                            //Move to start position
                            context.moveTo(r, 0);
                            //Drawing
                            currentRadius = r;
                            for (var index = 0; index < segments.countAll; index += 1) {
                                context.arc(0, 0, currentRadius, Geometry2D.Math.degToRad(index * segments.angleSegment), Geometry2D.Math.degToRad((index + 1) * segments.angleSegment), false);
                                if (currentRadius === r) {
                                    currentRadius = r + segments.indentation;
                                } else {
                                    currentRadius = r;
                                }
                            }
                            context.lineTo(r,0);
                            //Make shadow
                            if (shadow !== null) {
                                context.shadowColor     = shadow.shadowColor;
                                context.shadowBlur      = shadow.shadowBlur;
                                context.shadowOffsetX   = shadow.shadowOffsetX;
                                context.shadowOffsetY   = shadow.shadowOffsetY;
                            }
                            context.stroke();
                            context.fill();
                            //Close path
                            context.closePath();
                            //Return context's center to start place
                            context.translate(-center.x, -center.y);
                            //Confirm drawing
                            return true;
                        }
                        return null;
                    }
                };
                //Draw arch figure
                Arch = {
                    basic : {
                        //Draw basic arch
                        render: function (params) {
                            ///     <summary>Create basic arch figure with close or open side's borders.</summary>
                            ///     <param name="params" type="Object">
                            ///         {&#13;&#10;
                            ///             context     : DOMObject &#13;&#10;
                            ///             x           : number (center of figure), &#13;&#10;                  
                            ///             y           : number (center of figure), &#13;&#10;               
                            ///             r           : number (radius of figure), &#13;&#10;              
                            ///             showGrid    : boolean [default: false], &#13;&#10;              
                            ///             design      : { &#13;&#10; 
                            ///                 strokeStyle : string,&#13;&#10; 
                            ///                 lineWidth   : number,&#13;&#10; 
                            ///                 fillStyle   : string,&#13;&#10; 
                            ///                 archWidth   : number &#13;&#10;
                            ///             },&#13;&#10; 
                            ///             angles      : { &#13;&#10; 
                            ///                 start   : number (in deg),&#13;&#10; 
                            ///                 length  : number (in deg from 0 to 360)&#13;&#10; 
                            ///             },&#13;&#10; 
                            ///             edges       : { &#13;&#10; 
                            ///                 top : { &#13;&#10; 
                            ///                     close   : boolean [default: true],&#13;&#10; 
                            ///                     offset  : number (in deg) [default: 0, can be setted only for close === false]&#13;&#10; 
                            ///                 },&#13;&#10; 
                            ///                 bottom : { &#13;&#10; 
                            ///                     close   : boolean [default: true],&#13;&#10; 
                            ///                     offset  : number (in deg) [default: 0, can be setted only for close === false]&#13;&#10; 
                            ///                 }&#13;&#10; 
                            ///             },&#13;&#10; 
                            ///             shadow  : { &#13;&#10; 
                            ///                 shadowColor     : string,&#13;&#10; 
                            ///                 shadowBlur      : number,&#13;&#10; 
                            ///                 shadowOffsetX   : number,&#13;&#10; 
                            ///                 shadowOffsetY   : number,&#13;&#10; 
                            ///             }&#13;&#10; 
                            ///         }&#13;&#10;
                            ///         [shadow] - isn't obligatory 
                            ///     </param>
                            ///     <returns type="Object" mayBeNull="true">Null - if error. Data's object - if OK.</returns>
                            ///     <field name='outer' static='false' type='object'>{top : object, bottom: object}</field>
                            ///     <field name='inner' static='false' type='object'>{top : object, bottom: object}</field>
                            var params              = (params ? params : {}),
                                context             = (typeof params.context    !== "undefined" ? (typeof params.context.fillRect === "function" ? params.context : null) : null),
                                design              = (typeof params.design     === "object"    ? params.design     : null),
                                shadow              = (typeof params.shadow     === "object"    ? params.shadow     : null),
                                angles              = (typeof params.angles     === "object"    ? params.angles     : null),
                                center              = {},
                                r                   = (typeof params.r          === "number"    ? params.r          : null),
                                showGrid            = (typeof params.showGrid   === "boolean"   ? params.showGrid   : false),
                                edges               = (typeof params.edges      === "object"    ? params.edges      : { top: {}, bottom: {}}),
                                radius              = 0,
                                cirlcePointsTop     = {},
                                offsetPointsTop     = {},
                                nearPointTop        = {},
                                cirlcePointsBottom  = {},
                                offsetPointsBottom  = {},
                                nearPointBottom     = {};
                            //Prepare varibles
                            center.x = (typeof params.x === "number" ? params.x : null);
                            center.y = (typeof params.y === "number" ? params.y : null);
                            if (Tools.Vars.IsNotEquality([context, center.x, center.y, r, angles, design], null) === true) {
                                //Check angles property
                                if (typeof angles.start !== "number" || typeof angles.length !== "number") {
                                    return null;
                                }
                                if (angles.length < 0 || angles.length > 360) {
                                    return null;
                                }
                                //Check design data
                                if (typeof design.strokeStyle   !== "string" || typeof design.lineWidth !== "number" ||
                                    typeof design.fillStyle     !== "string" || typeof design.archWidth !== "number") {
                                    return null;
                                }
                                //Check shadow
                                if (shadow !== null) {
                                    if (typeof shadow.shadowColor   !== "string" || typeof shadow.shadowBlur    !== "number" ||
                                        typeof shadow.shadowOffsetX !== "number" || typeof shadow.shadowOffsetY !== "number") {
                                        shadow = null;
                                    }
                                }
                                //Check edges
                                if (typeof edges.top !== "object" || typeof edges.bottom !== "object") {
                                    edges = { top: {}, bottom: {} };
                                }
                                if (typeof edges.top.close !== "boolean" || typeof edges.top.offset !== "number") {
                                    edges.top.close = true;
                                    edges.top.offset = 0;
                                }
                                if (typeof edges.bottom.close !== "boolean" || typeof edges.bottom.offset !== "number") {
                                    edges.bottom.close = true;
                                    edges.bottom.offset = 0;
                                }
                                //Offset can be setted only for opened edges
                                edges.top.offset        = (edges.top.close      === false ? edges.top.offset    : 0);
                                edges.bottom.offset     = (edges.bottom.close   === false ? edges.bottom.offset : 0);
                                //Convert deg to rad
                                angles.outerStartRad    = Geometry2D.Math.degToRad(angles.start);
                                angles.outerEndRad      = Geometry2D.Math.degToRad(angles.start + angles.length);
                                angles.innerStartRad    = Geometry2D.Math.degToRad(angles.start + edges.bottom.offset);
                                angles.innerEndRad      = Geometry2D.Math.degToRad(angles.start + angles.length - edges.top.offset);
                                radius = r;
                                //Move context's center 
                                context.translate(center.x, center.y);
                                if (showGrid === true) {
                                    Axis.draw(context, 300, 300);
                                }
                                /*
                                //First - fill figure
                                context.beginPath();
                                    context.lineWidth   = design.archWidth;
                                    context.strokeStyle = design.fillStyle;
                                    CanvasTools.Shadows.reset(context);
                                    context.arc(0, 0, radius - design.archWidth / 2, angles.outerStartRad, angles.outerEndRad, false);
                                    context.stroke();
                                context.closePath();
                                */
                                //Repare styles
                                context.lineWidth   = design.lineWidth;
                                context.strokeStyle = design.strokeStyle;
                                //Make shadow
                                CanvasTools.Shadows.set(context, shadow);
                                context.beginPath();
                                //Draw  outer boundary.--------------Stage 0
                                context.arc(0, 0, radius, angles.outerStartRad, angles.outerEndRad, false);
                                //Draw  outer boundary cut border.---Stage 1
                                    cirlcePointsTop = Geometry2D.Points.getPointOnCircleByAngle({ x: 0, y: 0, r: radius }, -(angles.start + angles.length));
                                    offsetPointsTop = Geometry2D.Points.getPointOnLineInDistance(cirlcePointsTop.factors, cirlcePointsTop.points.closed, design.archWidth);
                                    nearPointTop    = Geometry2D.Points.getNearPoint({ x: 0, y: 0 }, [offsetPointsTop.p1, offsetPointsTop.p2]);
                                    context.moveTo(cirlcePointsTop.points.closed.x, cirlcePointsTop.points.closed.y);
                                    if (edges.top.close === true) {
                                        context.lineTo(nearPointTop.near.x, nearPointTop.near.y);
                                    }
                                //Draw  outer boundary cut border.---Stage 2
                                    cirlcePointsBottom  = Geometry2D.Points.getPointOnCircleByAngle({ x: 0, y: 0, r: radius }, -(angles.start + edges.bottom.offset));
                                    offsetPointsBottom  = Geometry2D.Points.getPointOnLineInDistance(cirlcePointsBottom.factors, cirlcePointsBottom.points.closed, design.archWidth + 1);
                                    nearPointBottom     = Geometry2D.Points.getNearPoint({ x: 0, y: 0 }, [offsetPointsBottom.p1, offsetPointsBottom.p2]);
                                //Draw  inner boundary.--------------Stage 3
                                    context.moveTo(nearPointBottom.near.x, nearPointBottom.near.y);
                                    context.arc(0, 0, radius - design.archWidth, angles.innerStartRad, angles.innerEndRad, false);
                                    context.moveTo(cirlcePointsBottom.points.closed.x, cirlcePointsBottom.points.closed.y);
                                    if (edges.bottom.close === true) {
                                        context.lineTo(nearPointBottom.near.x, nearPointBottom.near.y);
                                    }
                                //Aplly styles and close
                                    if (design.lineWidth > 0) {
                                        context.stroke();
                                    }
                                context.closePath();
                                //Fill figure
                                Arch.basic.fill({
                                    context : context,
                                    x: 0, y: 0, r: r,
                                    design  : design,
                                    angles  : angles,
                                    edges   : edges
                                });
                                //Return context's center to start place
                                context.translate(-center.x, -center.y);
                                //Confirm drawing
                                return {
                                    outer: {
                                        top     : cirlcePointsTop,
                                        bottom  : Geometry2D.Points.getPointOnCircleByAngle({ x: 0, y: 0, r: radius }, -angles.start)
                                    },
                                    inner: {
                                        top     : Geometry2D.Points.getPointOnCircleByAngle({ x: 0, y: 0, r: radius - design.archWidth }, -(angles.start + angles.length - edges.top.offset)),
                                        bottom  : Geometry2D.Points.getPointOnCircleByAngle({ x: 0, y: 0, r: radius - design.archWidth }, -(angles.start + edges.bottom.offset))
                                    }
                                };
                            }
                            return null;
                        },
                        //Fill basic arch
                        fill: function (params) {
                            ///     <summary>Create basic arch figure with close or open side's borders.</summary>
                            ///     <param name="params" type="Object">
                            ///         {&#13;&#10;
                            ///             context     : DOMObject &#13;&#10;
                            ///             x           : number (center of figure), &#13;&#10;                  
                            ///             y           : number (center of figure), &#13;&#10;               
                            ///             r           : number (radius of figure), &#13;&#10;              
                            ///             design      : { &#13;&#10; 
                            ///                 strokeStyle : string,&#13;&#10; 
                            ///                 lineWidth   : number,&#13;&#10; 
                            ///                 fillStyle   : string,&#13;&#10; 
                            ///                 archWidth   : number &#13;&#10;
                            ///             },&#13;&#10; 
                            ///             angles      : { &#13;&#10; 
                            ///                 start   : number (in deg),&#13;&#10; 
                            ///                 length  : number (in deg from 0 to 360)&#13;&#10; 
                            ///             },&#13;&#10; 
                            ///             edges       : { &#13;&#10; 
                            ///                 top : { &#13;&#10; 
                            ///                     close   : boolean [default: true],&#13;&#10; 
                            ///                     offset  : number (in deg) [default: 0, can be setted only for close === false]&#13;&#10; 
                            ///                 },&#13;&#10; 
                            ///                 bottom : { &#13;&#10; 
                            ///                     close   : boolean [default: true],&#13;&#10; 
                            ///                     offset  : number (in deg) [default: 0, can be setted only for close === false]&#13;&#10; 
                            ///                 }&#13;&#10; 
                            ///             }&#13;&#10; 
                            ///         }&#13;&#10;
                            ///     </param>
                            ///     <returns type="boolean" mayBeNull="true">False - if error. True - if OK.</returns>
                            var params              = (params ? params : {}),
                                context             = (typeof params.context    !== "undefined" ? (typeof params.context.fillRect === "function" ? params.context : null) : null),
                                design              = (typeof params.design     === "object"    ? params.design     : null),
                                angles              = (typeof params.angles     === "object"    ? params.angles     : null),
                                center              = {},
                                r                   = (typeof params.r          === "number"    ? params.r          : null),
                                edges               = (typeof params.edges      === "object"    ? params.edges      : { top: {}, bottom: {}}),
                                radius              = 0;
                            //Prepare varibles
                            center.x = (typeof params.x === "number" ? params.x : null);
                            center.y = (typeof params.y === "number" ? params.y : null);
                            if (Tools.Vars.IsNotEquality([context, center.x, center.y, r, angles, design], null) === true) {
                                //Check angles property
                                if (typeof angles.start !== "number" || typeof angles.length !== "number") {
                                    return null;
                                }
                                if (angles.length < 0 || angles.length > 360) {
                                    return null;
                                }
                                //Check design data
                                if (typeof design.strokeStyle   !== "string" || typeof design.lineWidth !== "number" ||
                                    typeof design.fillStyle     !== "string" || typeof design.archWidth !== "number") {
                                    return null;
                                }
                                //Check edges
                                if (typeof edges.top !== "object" || typeof edges.bottom !== "object") {
                                    edges = { top: {}, bottom: {} };
                                }
                                if (typeof edges.top.close !== "boolean" || typeof edges.top.offset !== "number") {
                                    edges.top.close     = true;
                                    edges.top.offset    = 0;
                                }
                                if (typeof edges.bottom.close !== "boolean" || typeof edges.bottom.offset !== "number") {
                                    edges.bottom.close  = true;
                                    edges.bottom.offset = 0;
                                }
                                //Offset can be setted only for opened edges
                                edges.top.offset        = (edges.top.close      === false ? edges.top.offset    : 0);
                                edges.bottom.offset     = (edges.bottom.close   === false ? edges.bottom.offset : 0);
                                //Convert deg to rad
                                angles.outerTopFillAdd      = (edges.top.offset < 0 ? edges.top.offset : 0);
                                angles.outerBottomFillAdd   = (edges.bottom.offset < 0 ? edges.bottom.offset : 0);
                                angles.outerStartRad        = Geometry2D.Math.degToRad(angles.start + angles.outerBottomFillAdd);
                                angles.outerEndRad          = Geometry2D.Math.degToRad(angles.start + angles.length - angles.outerTopFillAdd);
                                angles.innerStartRad        = Geometry2D.Math.degToRad(angles.start + edges.bottom.offset);
                                angles.innerEndRad          = Geometry2D.Math.degToRad(angles.start + angles.length - edges.top.offset);
                                radius                      = r;
                                //Move context's center 
                                context.translate(center.x, center.y);
                                context.beginPath();
                                    context.lineWidth   = design.archWidth - design.lineWidth;
                                    context.strokeStyle = design.fillStyle;
                                    CanvasTools.Shadows.reset(context);
                                    context.arc(0, 0, radius - design.archWidth / 2, angles.outerStartRad, angles.outerEndRad, false);
                                    context.stroke();
                                context.closePath();
                                //Return context's center to start place
                                context.translate(-center.x, -center.y);
                                //Confirm drawing
                                return true;
                            }
                            return false;
                        }
                    },
                    //Draw arch with edges
                    edges: function (params) {
                        function getAngleDelta(dataObject) {
                            dataObject.points       = {};
                            dataObject.points.C     = { x: 0,   y: 0 };
                            dataObject.points.A     = { x: -r,  y: 0 };
                            dataObject.points.B     = { x: 0,   y: -dataObject.width };
                            dataObject.points.D     = { x: -r,  y: -dataObject.width };
                            dataObject.factors      = {};
                            dataObject.factors.AC   = Geometry2D.Lines.getLineFactors(dataObject.points.C, dataObject.points.A);
                            dataObject.factors.DB   = Geometry2D.Lines.getLineFactors(dataObject.points.D, dataObject.points.B);
                            dataObject.points.X     = Geometry2D.Crossing.lineCircle(dataObject.factors.DB, { r: r - design.archWidth, x: 0, y: 0 });
                            dataObject.points.X     = Geometry2D.Points.getNearPoint(dataObject.points.A, [dataObject.points.X.p1, dataObject.points.X.p2]);
                            dataObject.angle        = Geometry2D.Lines.getAngleByPoints(dataObject.points.A, dataObject.points.X.near, dataObject.points.C);
                            dataObject.angle        = (dataObject.width < 0 ? -(180 - dataObject.angle) : dataObject.angle);
                            return dataObject;
                        };
                        var params = (params ? params : {}),
                            context             = (typeof params.context    !== "undefined" ? (typeof params.context.fillRect === "function" ? params.context : null) : null),
                            design              = (typeof params.design     === "object"    ? params.design     : null),
                            shadow              = (typeof params.shadow     === "object"    ? params.shadow     : null),
                            angles              = (typeof params.angles     === "object"    ? params.angles     : null),
                            center              = {},
                            r                   = (typeof params.r          === "number"    ? params.r          : null),
                            showGrid            = (typeof params.showGrid   === "boolean"   ? params.showGrid   : false),
                            edges               = (typeof params.edges      === "object"    ? params.edges      : { top: {}, bottom: {}}),
                            radius              = 0,
                            basicArchData       = {},
                            pointA1, pointA2    = {},
                            pointB1, pointB2    = {};
                        //Prepare varibles
                        center.x = (typeof params.x === "number" ? params.x : null);
                        center.y = (typeof params.y === "number" ? params.y : null);
                        if (Tools.Vars.IsNotEquality([context, center.x, center.y, r, angles, design], null) === true) {
                            //Check angles property
                            if (typeof angles.start !== "number" || typeof angles.length !== "number") {
                                return null;
                            }
                            if (angles.length < 0 || angles.length > 360) {
                                return null;
                            }
                            //Check design data
                            if (typeof design.strokeStyle   !== "string" || typeof design.lineWidth !== "number" ||
                                typeof design.fillStyle     !== "string" || typeof design.archWidth !== "number") {
                                return null;
                            }
                            //Check shadow
                            if (shadow !== null) {
                                if (typeof shadow.shadowColor   !== "string" || typeof shadow.shadowBlur    !== "number" ||
                                    typeof shadow.shadowOffsetX !== "number" || typeof shadow.shadowOffsetY !== "number") {
                                    shadow = null;
                                }
                            }
                            //Check edges
                            if (typeof edges.top            !== "object"    || typeof edges.bottom          !== "object") {
                                edges = { top: {}, bottom: {} };
                            }
                            if (typeof edges.top.close      !== "boolean"   || typeof edges.top.height      !== "number" || typeof edges.top.width !== "number") {
                                edges.top.close     = true;
                                edges.top.height    = 0;
                                edges.top.width     = 0;
                            }
                            if (typeof edges.bottom.close   !== "boolean"   || typeof edges.bottom.height   !== "number" || typeof edges.bottom.width !== "number") {
                                edges.bottom.close  = true;
                                edges.bottom.height = 0;
                                edges.bottom.width  = 0;
                            }
                            if (edges.top.height    < 0) { edges.top.height     = 0; }
                            if (edges.bottom.height < 0) { edges.bottom.height  = 0; }
                            //Get angle's deltas
                            edges.top       = getAngleDelta(edges.top);
                            edges.bottom    = getAngleDelta(edges.bottom);
                            radius          = r;
                            //Make basic arch
                            basicArchData = Arch.basic.render({
                                context     : context,
                                x           : center.x,
                                y           : center.y,
                                r           : r,
                                showGrid    : showGrid,
                                angles      : angles,
                                design      : design,
                                shadow      : shadow,
                                edges       : {
                                    top: {
                                        close   : false,
                                        offset  : edges.top.angle
                                    },
                                    bottom: {
                                        close   : false,
                                        offset  : edges.bottom.angle
                                    }
                                }
                            });
                            //Move context's center 
                            context.translate(center.x, center.y);
                            //Show grid and axis if it needs
                            if (showGrid === true) {
                                Axis.draw(context, 300, 300);
                            }
                            //Prepare styles
                            context.lineWidth   = design.lineWidth;
                            context.strokeStyle = design.strokeStyle;
                            context.fillStyle   = design.fillStyle;
                            //Prepare data
                            edges.top.outerHeight       = (edges.top.width      > 0 ? edges.top.height : edges.top.height - design.archWidth);
                            edges.top.innerHeight       = (edges.top.width      > 0 ? edges.top.height - design.archWidth : edges.top.height);
                            edges.bottom.outerHeight    = (edges.bottom.width   > 0 ? edges.bottom.height : edges.bottom.height - design.archWidth);
                            edges.bottom.innerHeight    = (edges.bottom.width   > 0 ? edges.bottom.height - design.archWidth : edges.bottom.height);
                            //Draw top segment
                            context.beginPath();
                                //Point A.
                                context.moveTo(basicArchData.outer.top.points.closed.x, basicArchData.outer.top.points.closed.y);
                                pointA1 = Geometry2D.Points.getPointOnLineInDistance(basicArchData.outer.top.factors,
                                                                                        basicArchData.outer.top.points.closed,
                                                                                        edges.top.outerHeight);
                                pointA1 = Geometry2D.Points.getNearPoint({ x: 0, y: 0 }, [pointA1.p1, pointA1.p2]);
                                if (edges.top.width < 0) { pointA1 = pointA1.far; } else { pointA1 = pointA1.near; }
                                context.lineTo(pointA1.x, pointA1.y);
                                //Point B
                                context.moveTo(basicArchData.inner.top.points.closed.x, basicArchData.inner.top.points.closed.y);
                                pointB1 = Geometry2D.Points.getPointOnLineInDistance(basicArchData.inner.top.factors,
                                                                                        basicArchData.inner.top.points.closed,
                                                                                        edges.top.innerHeight);
                                pointB1 = Geometry2D.Points.getNearPoint({ x: 0, y: 0 }, [pointB1.p1, pointB1.p2]);
                                if (edges.top.width < 0) { pointB1 = pointB1.far; } else { pointB1 = pointB1.near; }
                                context.lineTo(pointB1.x, pointB1.y);
                                context.lineTo(pointA1.x, pointA1.y);
                                context.lineTo(basicArchData.outer.top.points.closed.x, basicArchData.outer.top.points.closed.y);
                            //Close
                            CanvasTools.Shadows.set(context, shadow);
                            context.stroke();
                            CanvasTools.Shadows.reset(context);
                            context.fill();
                            context.stroke();
                            context.closePath();
                            //Draw bottom segment
                            context.beginPath();
                                //Point A.
                                context.moveTo(basicArchData.outer.bottom.points.closed.x, basicArchData.outer.bottom.points.closed.y);
                                pointA2 = Geometry2D.Points.getPointOnLineInDistance(   basicArchData.outer.bottom.factors,
                                                                                        basicArchData.outer.bottom.points.closed,
                                                                                        edges.bottom.outerHeight);
                                pointA2 = Geometry2D.Points.getNearPoint({ x: 0, y: 0 }, [pointA2.p1, pointA2.p2]);
                                if (edges.bottom.width < 0) { pointA2 = pointA2.far; } else { pointA2 = pointA2.near; }
                                context.lineTo(pointA2.x, pointA2.y);
                                //Point B
                                context.moveTo(basicArchData.inner.bottom.points.closed.x, basicArchData.inner.bottom.points.closed.y);
                                pointB2 = Geometry2D.Points.getPointOnLineInDistance(basicArchData.inner.bottom.factors,
                                                                                        basicArchData.inner.bottom.points.closed,
                                                                                        edges.bottom.innerHeight);
                                pointB2 = Geometry2D.Points.getNearPoint({ x: 0, y: 0 }, [pointB2.p1, pointB2.p2]);
                                if (edges.bottom.width < 0) { pointB2 = pointB2.far; } else { pointB2 = pointB2.near; }
                                context.lineTo(pointB2.x, pointB2.y);
                                context.lineTo(pointA2.x, pointA2.y);
                                context.lineTo(basicArchData.outer.bottom.points.closed.x, basicArchData.outer.bottom.points.closed.y);
                            //Close
                            CanvasTools.Shadows.set(context, shadow);
                            context.stroke();
                            CanvasTools.Shadows.reset(context);
                            context.fill();
                            context.stroke();
                            context.closePath();
                            //Fill figure
                            Arch.basic.fill({
                                context     : context,
                                x           : 0,
                                y           : 0,
                                r           : r,
                                angles      : angles,
                                design      : design,
                                edges       : {
                                    top: {
                                        close   : false,
                                        offset  : edges.top.angle
                                    },
                                    bottom: {
                                        close   : false,
                                        offset  : edges.bottom.angle
                                    }
                                }
                            });
                            //Repare borders
                            context.lineWidth   = design.lineWidth;
                            context.strokeStyle = design.strokeStyle;
                            context.beginPath();
                            if (edges.bottom.width > 0) {
                                context.moveTo(pointA2.x, pointA2.y);
                                context.lineTo(basicArchData.outer.bottom.points.closed.x, basicArchData.outer.bottom.points.closed.y);
                            } else {
                                context.moveTo(pointB2.x, pointB2.y);
                                context.lineTo(basicArchData.inner.bottom.points.closed.x, basicArchData.inner.bottom.points.closed.y);
                            }
                            context.stroke();
                            context.closePath();
                            context.beginPath();
                            if (edges.top.width > 0) {
                                context.moveTo(pointA1.x, pointA1.y);
                                context.lineTo(basicArchData.outer.top.points.closed.x, basicArchData.outer.top.points.closed.y);
                            } else {
                                context.moveTo(pointB1.x, pointB1.y);
                                context.lineTo(basicArchData.inner.top.points.closed.x, basicArchData.inner.top.points.closed.y);
                            }
                            context.stroke();
                            context.closePath();
                            //Move context's center 
                            context.translate(-center.x, -center.y);
                            return true;
                        }
                        return null;
                    }
                };
                //Draw rectangles
                Rectangle = {
                    rounded: function (params) {
                        function render(x, y, width, height, strokeStyle, lineWidth, angles, fillStyle) {
                            context.beginPath();
                                context.moveTo(x + angles.TL, y);
                                context.lineTo(x + width - angles.TR, y);
                                context.arcTo(x + width, y,
                                                x + width, y + angles.TR,
                                                angles.TR);
                                //context.moveTo(x + width, y + angles.TR);
                                context.lineTo(x + width, y + height - angles.BR);
                                context.arcTo(x + width, y + height,
                                                x + width - angles.BR, y + height,
                                                angles.BR);
                                context.lineTo(x + angles.BL, y + height);
                                context.arcTo(x, y + height,
                                                x, y + height - angles.BL,
                                                angles.BL);
                                context.lineTo(x, y + angles.TL);
                                context.arcTo(x, y,
                                                x + angles.TL, y,
                                                angles.TL);
                            context.closePath();
                            if (fillStyle) {
                                context.fillStyle = fillStyle;
                                context.fill();
                            }
                            context.strokeStyle = strokeStyle;
                            context.lineWidth   = lineWidth;
                            context.stroke();
                        };
                        var params = (params ? params : {}),
                            context         = (typeof params.context    !== "undefined" ? (typeof params.context.fillRect === "function" ? params.context : null) : null),
                            design          = (typeof params.design     === "object"    ? params.design : null),
                            shadow          = (typeof params.shadow     === "object"    ? params.shadow : null),
                            coordinate      = {},
                            angles          = (typeof params.angles     === "object"    ? params.angles : null);
                        //Prepare varibles
                        coordinate.x        = (typeof params.x      === "number" ? params.x         : null);
                        coordinate.y        = (typeof params.y      === "number" ? params.y         : null);
                        coordinate.width    = (typeof params.width  === "number" ? params.width     : null);
                        coordinate.height   = (typeof params.height === "number" ? params.height    : null);
                        if (Tools.Vars.IsNotEquality([context, coordinate.x, coordinate.y, coordinate.width, coordinate.height, angles, design], null) === true) {
                            //Check design data
                            if (design.borders instanceof Array !== true|| typeof design.fillStyle !== "string") {
                                return null;
                            }
                            if (typeof angles.TL !== "number" || typeof angles.TR !== "number" ||
                                typeof angles.BL !== "number" || typeof angles.BR !== "number") {
                                return null;
                            }
                            //Check shadow
                            if (shadow !== null) {
                                if (typeof shadow.shadowColor   !== "string" || typeof shadow.shadowBlur    !== "number" ||
                                    typeof shadow.shadowOffsetX !== "number" || typeof shadow.shadowOffsetY !== "number") {
                                    shadow = null;
                                }
                            }
                            for (var index = 0; index < design.borders.length - 1; index += 1) {
                                render( coordinate.x, coordinate.y, coordinate.width, coordinate.height,
                                        design.borders[index].color, design.borders[index].width, angles);
                                coordinate.x        += design.borders[index].width;
                                coordinate.y        += design.borders[index].width;
                                coordinate.width    -= design.borders[index].width*2;
                                coordinate.height   -= design.borders[index].width*2;
                                angles.TL           -= design.borders[index].width;
                                angles.TR           -= design.borders[index].width;
                                angles.BL           -= design.borders[index].width;
                                angles.BR           -= design.borders[index].width;
                                angles.TL           = (angles.TL < 0 ? 0 : angles.TL);
                                angles.TR           = (angles.TR < 0 ? 0 : angles.TR);
                                angles.BL           = (angles.BL < 0 ? 0 : angles.BL);
                                angles.BR           = (angles.BR < 0 ? 0 : angles.BR);

                            }
                            render(coordinate.x, coordinate.y, coordinate.width, coordinate.height,
                                    design.borders[index].color, design.borders[index].width,
                                    angles, design.fillStyle);
                        }
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicPinion    = Pinion.render;
                publicArch      = {
                    basic : Arch.basic.render,
                    edges : Arch.edges
                };
                publicRectangle = {
                    rounded: Rectangle.rounded
                };
                publicCanvasTools = {
                    shadow : CanvasTools.Shadows
                };
                //---< Security part	>--[end]---------------------------------------------------------------------------------------
                //---< Init part	    >--[begin]---------------------------------------------------------------------------------------
                //---< Init part	    >--[end]---------------------------------------------------------------------------------------
                return {
                    //---< Public part		>--[begin]---------------------------------------------------------------------------------------
                    AboutModule : {
                        getName         : function () { return name; },
                        getVersion      : function () { return version; },
                        getLastUpdate   : function () { return lastUpdate; },
                        getAuthor       : function () { return author; }
                    },
                    pinion      : publicPinion,
                    arch        : publicArch,
                    rect        : publicRectangle,
                    tools       : publicCanvasTools
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());