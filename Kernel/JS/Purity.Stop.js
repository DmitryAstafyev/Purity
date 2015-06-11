/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
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
        Purity.createModule("Stop",
            //Check references
            null,
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name        = "Purity::: ",
                    version     = "1.0",
                    lastUpdate  = "29.05.2013",
                    author      = "Dmitry Astafyev";
                    //Declaration module's blocks
                    //Declaration references
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
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
                    },
                    stop: function () {
                        var stop = true;
                    }
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());