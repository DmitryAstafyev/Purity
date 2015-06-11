/*global Purity*/
//Purity.Canvas.Geometry2D.js
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <module>
///     <summary>
///         Make some geometry countings
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("Canvas.Geometry2D",
            //Check references
            {
                modules     : ["Tools"],
                resources   : null
            },
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name                = "Purity.Canvas.Geometry2D",
                    version             = "1.0",
                    lastUpdate          = "19.07.2013",
                    author              = "Dmitry Astafyev",
                    //Declaration module's blocks
                    Lines               = {},
                    Crossing            = {},
                    Points              = {},
                    Mathematics         = {},
                    publicLines         = {},
                    publicCrossing      = {},
                    publicPoints        = {},
                    publicMathematics   = {},
                    //Declaration references
                    Tools               = new Purity.initModule("Tools");
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                Lines = {
                    //Return angle between two lines (via points of such lines)
                    getAngleByPoints: function (pointLineA, pointLineB, pointCross) {
                        ///     <summary>Return angle (in degrees) between two lines A and B. Line A goes from point A to cross point. Line B - from point B to cross point. </summary>
                        ///     <param name="pointLineA" type="Object">First point of line A:&#13;&#10;
                        ///         {&#13;&#10;
                        ///          x : number,&#13;&#10;
                        ///          y : number    &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <param name="pointLineB" type="Object">First point of line B:&#13;&#10;
                        ///         {&#13;&#10;
                        ///          x : number,&#13;&#10;
                        ///          y : number    &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <param name="pointCross" type="Object">Point of crossinf of line A and line B:&#13;&#10;
                        ///         {&#13;&#10;
                        ///          x : number,&#13;&#10;
                        ///          y : number    &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <returns type="number" mayBeNull="true">degrees</returns>
                        var pointA      = (typeof pointLineA === "object" ? pointLineA : null),
                            pointB      = (typeof pointLineB === "object" ? pointLineB : null),
                            pointCross  = (typeof pointCross === "object" ? pointCross : null),
                            lineA       = null,
                            lineB       = null,
                            angle       = null;
                        if (Tools.Vars.IsNotEquality([pointA, pointB, pointCross], null) === true) {
                            try {
                                lineA = Lines.getLineFactors(pointCross, pointA);
                                lineB = Lines.getLineFactors(pointCross, pointB);
                                if (lineA.a === Infinity    || lineB.a === Infinity     || lineA.b === Infinity     || lineB.b === Infinity     ||
                                    lineA.a === -Infinity   || lineB.a === -Infinity    || lineA.b === -Infinity    || lineB.b === -Infinity    ||
                                    (1 + lineA.a * lineB.a) === 0) {
                                    angle = 90;
                                } else {
                                    angle = Mathematics.radToDeg(Math.atan((lineB.a - lineA.a) / (1 + lineA.a * lineB.a)));
                                }
                                return (angle < 0 ? 180 + angle : angle);
                            } catch (e) {
                                return null;
                            }
                        }
                        return null;
                    },
                    //Return formula of line by points. y = Ax + B. Return A and B.
                    getLineFactors: function (pointA, pointB) {
                        ///     <summary>Return formula of line by points. y = Ax + B. Return factors A and B.</summary>
                        ///     <param name="pointA" type="Object">First point of line:&#13;&#10;
                        ///         {&#13;&#10;
                        ///          x : number,&#13;&#10;
                        ///          y : number    &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <param name="pointB" type="Object">Second point of line:&#13;&#10;
                        ///         {&#13;&#10;
                        ///          x : number,&#13;&#10;
                        ///          y : number    &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <returns type="object" mayBeNull="true">{&#13;&#10;
                        ///          a : number,    &#13;&#10;
                        ///          b : number     &#13;&#10;                  
                        ///         }</returns>
                        ///     <field name='a' static='false' type='number'>Return A [number] from: y = Ax + b</field>
                        ///     <field name='b' static='false' type='number'>Return B [number] from: y = ax + B</field>
                        var pointA  = (typeof pointA === "object" ? pointA : null),
                            pointB  = (typeof pointB === "object" ? pointB : null),
                            line    = { a: null, b: null };
                        if (Tools.Vars.IsNotEquality([pointA, pointB], null) === true) {
                            try {
                                line.a = (pointB.y - pointA.y) / (pointB.x - pointA.x);
                                line.b = pointA.y - line.a * pointA.x;
                            } catch (e) {
                                return line;
                            }
                        }
                        return line;
                    },
                    //Return perpendicular to defined line
                    getPerpendicular: function (pointCross, line) {
                        ///     <summary>Return formula of line (what is perpendiculared to defined line) by points. y = Ax + B. Return factors A and B.</summary>
                        ///     <param name="pointCross" type="Object">Point of crossing of lines:&#13;&#10;
                        ///         {&#13;&#10;
                        ///          x : number,&#13;&#10;
                        ///          y : number    &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <param name="line" type="Object">Basic line: y = Ax + B.&#13;&#10;
                        ///         {&#13;&#10;
                        ///          a : number,&#13;&#10;
                        ///          b : number    &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <returns type="object" mayBeNull="true">{&#13;&#10;
                        ///          a : number,    &#13;&#10;
                        ///          b : number     &#13;&#10;                  
                        ///         }</returns>
                        ///     <field name='a' static='false' type='number'>Return A [number] from: y = Ax + b</field>
                        ///     <field name='b' static='false' type='number'>Return B [number] from: y = ax + B</field>
                        var pointCross      = (typeof pointCross === "object" ? pointCross : null),
                            line            = (typeof line          === "object" ? line         : null),
                            perpendicular   = {};
                        if (Tools.Vars.IsNotEquality([pointCross, line], null) === true) {
                            try {
                                //perpendicular.b = line.a * pointCross.x + line.b - pointCross.x / line.a;
                                perpendicular.a = -1 / line.a;
                                perpendicular.b = pointCross.y - perpendicular.a * pointCross.x;
                                return perpendicular;
                            } catch (e) {
                                return e;
                            }
                        }
                        return null;
                    }
                };
                Crossing = {
                    //Return point of crossing line and circle
                    lineCircle: function (line, circle) {
                        ///     <summary>   Return point of crossing line and circle.&#13;&#10; 
                        ///                 Line: y = Ax + B. &#13;&#10; 
                        ///                 Circle: (x-a)^2 + (y-b)^2 = r^2; (a,b) - center's point &#13;&#10; 
                        ///                 Return point as (x,y).</summary>
                        ///     <param name="line" type="Object">Factors of line:&#13;&#10;
                        ///         {&#13;&#10;
                        ///          a : number, &#13;&#10;
                        ///          b : number  &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <param name="circle" type="Object">Factors of circle:&#13;&#10;
                        ///         {&#13;&#10;
                        ///          r : number, (radius of circle) &#13;&#10;
                        ///          x : number, (center of circle) &#13;&#10;                  
                        ///          y : number, (center of circle) &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <returns type="object" mayBeNull="true">{&#13;&#10;
                        ///          x : number,    &#13;&#10;
                        ///          y : number     &#13;&#10;                  
                        ///         }</returns>
                        ///     <field name='p1' static='false' type='object'>First point of crossing</field>
                        ///     <field name='p2' static='false' type='object'>Second point of crossing</field>
                        var line    = (typeof line      === "object" ? line     : null),
                            circle  = (typeof circle    === "object" ? circle   : null),
                            Xs      = null,
                            points  = {},
                            a       = 0,
                            b       = 0,
                            c       = 0;
                        if (Tools.Vars.IsNotEquality([line, circle], null) === true) {
                            if (typeof line.a   === "number" && typeof line.b   === "number" &&
                                typeof circle.x === "number" && typeof circle.y === "number" && typeof circle.r === "number") {
                                a   = 1 + Math.pow(line.a, 2);
                                b   = (2 * line.a * line.b) - (2 * circle.x) - (2 * circle.y * line.a);
                                c   = Math.pow(line.b, 2) - (2 * circle.y * line.b) + Math.pow(circle.x, 2) + Math.pow(circle.y, 2) - Math.pow(circle.r, 2);
                                Xs  = Mathematics.quadraticEquation(a, b, c);
                                if (Xs !== null) {
                                    points.p1 = { x: Xs.x1, y: line.a * Xs.x1 + line.b };
                                    points.p2 = { x: Xs.x2, y: line.a * Xs.x2 + line.b };
                                    return points;
                                }
                            }
                        }
                        return null;
                    }
                };
                Points = {
                    //Return points on circle for such circle with angle
                    getPointOnCircleByAngle: function (circle, angle) {
                        ///     <summary>   Return points on circle for such circle with angle.&#13;&#10; 
                        ///                 angle: in deg. &#13;&#10; 
                        ///                 circle: (x-a)^2 + (y-b)^2 = r^2; (a,b) - center's point &#13;&#10; 
                        ///                 Return two points as (x,y) and factors (a,b) for line: y = ax + b.</summary>
                        ///     <param name="angle" type="number">angle in deg&#13;&#10; </param>
                        ///     <param name="circle" type="Object">Factors of circle:&#13;&#10;
                        ///         {&#13;&#10;
                        ///          r : number, (radius of circle) &#13;&#10;
                        ///          x : number, (center of circle) &#13;&#10;                  
                        ///          y : number, (center of circle) &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <returns type="object" mayBeNull="true">{&#13;&#10;
                        ///          points     : {p1: {x:number, y:number}, p2:{x:number, y:number}},    &#13;&#10;
                        ///          factors    : {a:number, b:number}     &#13;&#10;                  
                        ///         }</returns>
                        ///     <field name='points' static='false' type='object'>Two points of crossing</field>
                        ///     <field name='factors' static='false' type='object'>Factors (a,b) for line: y = ax + b.</field>
                        var circle      = (typeof circle    === "object" ? circle   : null),
                            angle       = (typeof angle     === "number" ? angle    : null),
                            angleRad    = 0,
                            basicLine   = {},
                            resultLine  = {},
                            direction   = 1;
                        if (Tools.Vars.IsNotEquality([circle, angle], null) === true) {
                            //Check circle params
                            if (typeof circle.x === "number" && typeof circle.y === "number" && typeof circle.r === "number") {
                                //Normalizate angle
                                direction = (angle > 0 ? 1 : -1);
                                if (Math.abs(angle) > 360) {
                                    angle = (Math.abs(angle) - Math.floor(Math.abs(angle) / 360) * 360) * direction;
                                }
                                if (angle < 0) {
                                    angle = angle + 360;
                                }
                                //Prepare baseLine. Get two points of line
                                basicLine.pointA        = {};
                                basicLine.pointB        = {};
                                basicLine.pointA.x      = 0 + circle.x;
                                basicLine.pointA.y      = 0 + circle.y;
                                basicLine.pointB.x      = circle.r + circle.x;
                                basicLine.pointB.y      = 0 + circle.y;
                                //Get factors of line
                                basicLine.factors       = Lines.getLineFactors(basicLine.pointA, basicLine.pointB);
                                //Convert angle from deg to rad
                                angleRad                = Mathematics.degToRad(angle);
                                //Get factors of result line
                                resultLine.factors      = {};
                                resultLine.factors.a    = (basicLine.factors.a - Math.tan(angleRad)) / (basicLine.factors.a * Math.tan(angleRad) + 1);
                                resultLine.factors.b    = basicLine.factors.b;
                                //Get points on circle
                                resultLine.points       = Crossing.lineCircle(resultLine.factors, circle);
                                //Get factors of line
                                resultLine.factors      = Lines.getLineFactors(resultLine.points.p1, resultLine.points.p2);
                                //Get closed point
                                if (angle > 0 && angle <= 90) {
                                    if (resultLine.points.p1.x >= 0 && resultLine.points.p1.y < 0) {
                                        resultLine.points.closed = resultLine.points.p1;
                                    } else {
                                        resultLine.points.closed = resultLine.points.p2;
                                    }
                                } else if (angle > 90 && angle <= 180) {
                                    if (resultLine.points.p1.x < 0 && resultLine.points.p1.y < 0) {
                                        resultLine.points.closed = resultLine.points.p1;
                                    } else {
                                        resultLine.points.closed = resultLine.points.p2;
                                    }
                                } else if (angle > 180 && angle <= 270) {
                                    if (resultLine.points.p1.x < 0 && resultLine.points.p1.y >= 0) {
                                        resultLine.points.closed = resultLine.points.p1;
                                    } else {
                                        resultLine.points.closed = resultLine.points.p2;
                                    }
                                } else if ((angle > 270 && angle <= 360) || angle === 0) {
                                    if (resultLine.points.p1.x >= 0 && resultLine.points.p1.y >= 0) {
                                        resultLine.points.closed = resultLine.points.p1;
                                    } else {
                                        resultLine.points.closed = resultLine.points.p2;
                                    }
                                }
                                return resultLine;
                            }
                        }
                        return null;
                    },
                    //Get point from defined point to point in defined distance
                    getPointOnLineInDistance: function (factors, point, distance) {
                        ///     <summary>Return point as (x,y) on line (y = ax + b) in defined distance.</summary>
                        ///     <param name="factors" type="object">Factors for line y = ax + b &#13;&#10; 
                        ///         {&#13;&#10;
                        ///          a : number,  &#13;&#10;
                        ///          b : number  &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <param name="point" type="Object">Point (x,y) on line&#13;&#10;
                        ///         {&#13;&#10;
                        ///          x : number,  &#13;&#10;                  
                        ///          y : number  &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <param name="distance" type="Object">Distance from defined point</param>
                        ///     <returns type="object" mayBeNull="true">{&#13;&#10;
                        ///          p1: {x:number, y:number}, &#13;&#10;
                        ///          p2: {x:number, y:number}}   &#13;&#10;
                        ///         }
                        ///     </returns>
                        ///     <field name='p1' static='false' type='object'>First point</field>
                        ///     <field name='p2' static='false' type='object'>Second point</field>
                        var factors     = (typeof factors === "object" ? factors : null),
                            point       = (typeof point     === "object" ? point    : null),
                            distance    = (typeof distance  === "number" ? distance : null),
                            equation    = {};
                        if (Tools.Vars.IsNotEquality([factors, point, distance], null) === true) {
                            if (typeof factors.a    === "number" && typeof factors.b    === "number" &&
                                typeof point.x      === "number" && typeof point.y      === "number") {
                                equation.a      = (1 + Math.pow(factors.a, 2));
                                equation.b      = -(2 * point.x - 2 * factors.a * factors.b + 2 * factors.a * point.y);
                                equation.c      = (Math.pow(point.x, 2) + Math.pow(factors.b, 2) - 2 * factors.b * point.y + Math.pow(point.y, 2) - Math.pow(distance, 2));
                                equation.Xs     = Mathematics.quadraticEquation(equation.a, equation.b, equation.c);
                                if (equation.Xs !== null) {
                                    equation.Ys     = {};
                                    equation.Ys.y1  = equation.Xs.x1 * factors.a + factors.b;
                                    equation.Ys.y2  = equation.Xs.x2 * factors.a + factors.b;
                                    return {
                                        p1: { x: equation.Xs.x1, y: equation.Ys.y1 },
                                        p2: { x: equation.Xs.x2, y: equation.Ys.y2 }
                                    };
                                }
                            }
                        }
                        return null;
                    },
                    //Retrun near point from several points
                    getNearPoint: function (targetPoint, points) {
                        var targetPoint = (typeof targetPoint === "object" ? targetPoint : null),
                            points      = (points instanceof Array ? points : null),
                            resultPoint = {},
                            distance    = 0;
                        if (Tools.Vars.IsNotEquality([targetPoint, points], null) === true) {
                            resultPoint.far     = {};
                            resultPoint.near    = {};
                            if (typeof targetPoint.x === "number" && typeof targetPoint.y === "number") {
                                for (var index = points.length - 1; index >= 0; index -= 1) {
                                    if (typeof points[index].x === "number" && typeof points[index].y === "number") {
                                        distance = Math.sqrt(Math.pow(points[index].x - targetPoint.x, 2) + Math.pow(points[index].y - targetPoint.y, 2));
                                        if (typeof resultPoint.near.distance === "number") {
                                            if (resultPoint.near.distance > distance) {
                                                resultPoint.near.distance   = distance;
                                                resultPoint.near.x          = points[index].x;
                                                resultPoint.near.y          = points[index].y;
                                            } else {
                                                resultPoint.far.distance    = distance;
                                                resultPoint.far.x           = points[index].x;
                                                resultPoint.far.y           = points[index].y;
                                            }
                                        } else {
                                            resultPoint.near.distance   = distance;
                                            resultPoint.near.x          = points[index].x;
                                            resultPoint.near.y          = points[index].y;
                                            resultPoint.far.distance    = distance;
                                            resultPoint.far.x           = points[index].x;
                                            resultPoint.far.y           = points[index].y;
                                        }
                                    }
                                }
                                return (typeof resultPoint.near.distance !== "number" ? null : resultPoint);
                            }
                        }
                        return null;
                    },
                    //Return distance between two points
                    getDistance: function (pointA, pointB) {
                        ///     <summary>Return distance between defined points.</summary>
                        ///     <param name="pointA" type="Object">Point A(x,y) &#13;&#10;
                        ///         {&#13;&#10;
                        ///          x : number,  &#13;&#10;                  
                        ///          y : number  &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <param name="pointB" type="Object">Point B(x,y) &#13;&#10;
                        ///         {&#13;&#10;
                        ///          x : number,  &#13;&#10;                  
                        ///          y : number  &#13;&#10;                  
                        ///         }
                        ///     </param>
                        ///     <returns type="number" mayBeNull="true">Disnance</returns>
                        var pointA = (typeof pointA === "object" ? pointA : null),
                            pointB = (typeof pointB === "object" ? pointB : null);
                        if (Tools.Vars.IsNotEquality([pointA, pointB], null) === true) {
                            try{
                                return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
                            } catch (e) {
                                return e;
                            }
                        }
                        return null;
                    }
                };
                Mathematics = {
                    //Return solution of quadratic equation: ax^2 + bx + c = 0
                    quadraticEquation: function (a, b, c) {
                        ///     <summary>   Return solution of quadratic equation: &#13;&#10;
                        ///                 ax^2 + bx + c = 0</summary>
                        ///     <param name="a" type="number">Factor [a] in  ax^2 + bx + c = 0</param>
                        ///     <param name="b" type="number">Factor [b] in  ax^2 + bx + c = 0</param>
                        ///     <param name="c" type="number">Factor [c] in  ax^2 + bx + c = 0</param>
                        ///     <returns type="object" mayBeNull="true">{&#13;&#10;
                        ///          x1 : number,    &#13;&#10;
                        ///          x2 : number     &#13;&#10;                  
                        ///         }</returns>
                        ///     <field name='x1' static='false' type='number'>x1 from ax^2 + bx + c = 0 (null if equation hasn't solutions)</field>
                        ///     <field name='x2' static='false' type='number'>x2 from ax^2 + bx + c = 0 (null if equation hasn't solutions)</field>
                        var a       = (typeof a === "number" ? a : null),
                            b       = (typeof b === "number" ? b : null),
                            c       = (typeof c === "number" ? c : null),
                            result  = {x1: null, x2: null},
                            D       = 0;
                        if (Tools.Vars.IsNotEquality([a, b, c], null) === true) {
                            D = (b * b) - (4 * a * c);
                            if (D > 0) {
                                result.x1 = (-b + Math.sqrt(D)) / (2 * a);
                                result.x2 = (-b - Math.sqrt(D)) / (2 * a);
                                return result;
                            }
                        }
                        return null;
                    },
                    degToRad: function (deg) {
                        return deg * (Math.PI / 180);
                    },
                    radToDeg: function (rad) {
                        return rad * (180 / Math.PI);
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicLines = {
                    getAngleByPoints: Lines.getAngleByPoints,
                    getLineFactors  : Lines.getLineFactors,
                    getPerpendicular: Lines.getPerpendicular
                };
                publicCrossing = {
                    lineCircle: Crossing.lineCircle
                };
                publicPoints = {
                    getPointOnCircleByAngle : Points.getPointOnCircleByAngle,
                    getPointOnLineInDistance: Points.getPointOnLineInDistance,
                    getNearPoint            : Points.getNearPoint,
                    getDistance             : Points.getDistance
                };
                publicMathematics = {
                    quadraticEquation   : Mathematics.quadraticEquation,
                    degToRad            : Mathematics.degToRad,
                    radToDeg            : Mathematics.radToDeg
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
                    Lines       : publicLines,
                    Crossing    : publicCrossing,
                    Points      : publicPoints,
                    Math        : publicMathematics
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());