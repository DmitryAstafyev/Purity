/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <module>
///     <summary>
///         Functional of work with prototypes.
///         Also include patterns of prototypes.
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
    if (typeof Purity !== "undefined") {
        //Init module prototype and init function
        Purity.createModule("Environment.ProtoExpansions",
            //Check references
            null,
            //Prototype part
            function () {
                /// <summary>Discription of library</summary>
                var name            = "Purity::: Environment.ProtoExpansions",
                    version         = "1.0",
                    lastUpdate      = "26.07.2013",
                    author          = "Dmitry Astafyev",
                //Declaration module's blocks
                    Initializator   = {},
                    Patterns        = {},
                    Configuration   = {},
                    publicJoin      = {};
                //Declaration references
                //---< Private part		>--[begin]---------------------------------------------------------------------------------------
                //Configuration of module
                Configuration = {
                    //This object will safe all added functional.
                    storageObject       : "PurityExpansions",
                    patternsList        : "all",
                    prototypeInfo       : "PrototypeInfo",
                    currentExpansion    : "purityExpansion",
                    switcherName        : "switchTo"
                };
                //Block of joining prototypes to object
                Initializator = {
                    Objects: {
                        //Return storage of object
                        getStorage: function (targetObject) {
                            var targetObject = (typeof targetObject === "object" ? targetObject : null);
                            if (targetObject !== null) {
                                if (!targetObject[Configuration.storageObject]) {
                                    Object.defineProperty(targetObject, Configuration.storageObject, {
                                        enumerable  : false,
                                        writable    : true,
                                        configurable: true,
                                        value       : {}
                                    });
                                }
                                if (!targetObject[Configuration.storageObject][Configuration.patternsList]) {
                                    targetObject[Configuration.storageObject][Configuration.patternsList] = [];
                                }
                                if (!targetObject[Configuration.currentExpansion]) {
                                    Object.defineProperty(targetObject, Configuration.currentExpansion, {
                                        enumerable  : false,
                                        writable    : true,
                                        configurable: true,
                                        value       : null
                                    });
                                }
                                return {
                                    storage : targetObject[Configuration.storageObject],
                                    list    : targetObject[Configuration.storageObject][Configuration.patternsList]
                                }
                            }
                            return null;
                        },
                        //Return path
                        makePath: function (objectStorage, path) {
                            var objectStorage   = (typeof objectStorage === "object" ? objectStorage    : null),
                                path            = (typeof path          === "string" ? path.split(".")  : null),
                                endPoint        = objectStorage,
                                previousPoint   = null,
                                endName         = null;
                            if (path !== null && objectStorage !== null) {
                                for (var index = 0, maxIndex = path.length; index < maxIndex; index += 1) {
                                    if (!endPoint[path[index]]) {
                                        endPoint[path[index]] = {};
                                    }
                                    previousPoint   = endPoint;
                                    endPoint        = endPoint[path[index]];
                                    endName         = path[index];
                                }
                                return {
                                    end     : endPoint,
                                    endName : endName,
                                    previous: previousPoint
                                }
                            }
                            return null;
                        },
                        //Swith currentExpansion 
                        switchExpansion: function (targetObject, path) {
                            var targetObject    = ( typeof targetObject === "object"||
                                                    typeof targetObject === "function"  ? targetObject  : null),
                                path            = ( typeof path         === "string"    ? path          : null),
                                objectStorage   = null,
                                endPoint        = null;
                            if (targetObject !== null && path !== null) {
                                objectStorage = Initializator.Objects.getStorage(targetObject);
                                if (objectStorage !== null) {
                                    endPoint = Initializator.Objects.makePath(objectStorage.storage, path);
                                    if (endPoint !== null) {
                                        targetObject[Configuration.currentExpansion] = endPoint.previous[endPoint.endName];
                                        return true;
                                    }
                                }
                            }
                            return null;
                        }
                    },
                    Prototypes: {
                        //Prepare prototype (for init) and validate (for value and path)
                        prepare: function (patternPrototype) {
                            var patternPrototype = (    typeof patternPrototype === "function" ||
                                                        typeof patternPrototype === "object" ? patternPrototype : null);
                            if (patternPrototype !== null) {
                                if ((!patternPrototype.value || !patternPrototype.path) && typeof patternPrototype === "function") {
                                    try{
                                        patternPrototype = patternPrototype();
                                    } catch (e) {
                                        return null;
                                    }
                                }
                                if (patternPrototype.value || patternPrototype.path) {
                                    return patternPrototype;
                                }
                            }
                            return null;
                        }
                    },
                    //Join defined prototype to target object
                    join: function (targetObject, patternPrototype) {
                        var targetObject        = ( typeof targetObject     === "object" && 
                                                    targetObject            !== null        ? targetObject      : new Object()),
                            patternPrototype    = ( typeof patternPrototype === "function" || 
                                                    typeof patternPrototype === "object"    ? patternPrototype  : null),
                            objectStorage       = null,
                            joiningPrototype    = null,
                            joinPoint           = null;
                        if (patternPrototype !== null) {
                            //Get storage of object
                            objectStorage = Initializator.Objects.getStorage(targetObject);
                            if (objectStorage !== null) {
                                //Prepare prototype
                                joiningPrototype = Initializator.Prototypes.prepare(patternPrototype);
                                if (joiningPrototype !== null) {
                                    //Check pattern in storage
                                    if (objectStorage.list.indexOf(joiningPrototype.path) !== -1) {
                                        //Do nothing, because pattern of prototype was joined before.
                                        return targetObject;
                                    }
                                    //Make join point
                                    joinPoint = Initializator.Objects.makePath(objectStorage.storage, joiningPrototype.path);
                                    if (joinPoint !== null) {
                                        //Make new expansion
                                        joinPoint.previous[joinPoint.endName] = new joiningPrototype.value();
                                        //Add link to object
                                        joinPoint.previous[joinPoint.endName].self = targetObject;
                                        //Register expansion
                                        objectStorage.list.push(joiningPrototype.path);
                                        //Switch pointer to new proto
                                        Initializator.Objects.switchExpansion(targetObject, joiningPrototype.path);
                                        //Add switcher
                                        joinPoint.previous[joinPoint.endName][Configuration.switcherName] = function () { Initializator.Objects.switchExpansion(targetObject, joiningPrototype.path); };
                                        //Return updated object
                                        return targetObject;
                                    }
                                }
                                //Do nothing, because pattern has some errors.
                                return targetObject;
                            }
                        }
                        return null;
                    }
                };
                //Patterns of prototypes by groups of subjects
                Patterns = {
                    ListOf: {
                        objects: function () {
                            var instanceNumber = 0;
                            Patterns.ListOf.objects = {};
                            Patterns.ListOf.objects.path   = "ListOf.objects";
                            //Make constructor
                            Patterns.ListOf.objects.value = function () {
                                this.constructor                                    = "objects";
                                this[Configuration.prototypeInfo]                   = {};
                                this[Configuration.prototypeInfo].patternName       = "ListOf.Objects";
                                this[Configuration.prototypeInfo].instanceNumber    = instanceNumber;
                                this.position                                       = -1;
                                instanceNumber += 1;
                            };
                            //Make prototype
                            Patterns.ListOf.objects.value.prototype = (function () {
                                return {
                                    get length() {
                                        ///     <summary>Length of list.</summary>
                                        ///     <returns type="number" mayBeNull="false">Length of list</returns>
                                        return Object.keys(this.self).length;
                                    },
                                    byIndex     : function (index) {
                                        ///     <summary>Return object by index. Warning (!) This method change current position (used by next(), previous())</summary>
                                        ///     <param name="index" type="Number">Index of item</param>
                                        ///     <returns type="Object" mayBeNull="true">Null : wrong index or error. Object with data if is OK.</returns>
                                        ///     <field name='name' static='false' type='string'>Name of property</field>
                                        ///     <field name='value' static='false' type='Object'>Value of property</field>
                                        var index           = (typeof index === "number" ? index : null),
                                            length          = this.length,
                                            sourceObject    = this.self,
                                            propertyName    = "",
                                            currentIndex    = 0;
                                        if (index !== null && index >= 0 && index < length) {
                                            for (propertyName in sourceObject) {
                                                if (sourceObject.hasOwnProperty(propertyName)) {
                                                    if (currentIndex === index) {
                                                        this.position = currentIndex;
                                                        return {
                                                            name : propertyName,
                                                            value: sourceObject[propertyName],
                                                            index: index
                                                        };
                                                    } else {
                                                        currentIndex += 1;
                                                    }
                                                }
                                            }
                                        }
                                        return null;
                                    },
                                    next        : function () {
                                        ///     <summary>Return next object</summary>
                                        ///     <returns type="Object" mayBeNull="true">Null : wrong index or error. Object with data if is OK.</returns>
                                        ///     <field name='name' static='false' type='string'>Name of property</field>
                                        ///     <field name='value' static='false' type='Object'>Value of property</field>
                                        var length          = this.length;
                                        if (length > 0) {
                                            this.position = (this.position < 0 ? 0 : this.position + 1);
                                            if (this.position < length) {
                                                return this.byIndex(this.position);
                                            }
                                        }
                                        return null; 
                                    },
                                    previous    : function () {
                                        ///     <summary>Return previous object</summary>
                                        ///     <returns type="Object" mayBeNull="true">Null : wrong index or error. Object with data if is OK.</returns>
                                        ///     <field name='name' static='false' type='string'>Name of property</field>
                                        ///     <field name='value' static='false' type='Object'>Value of property</field>
                                        var length          = this.length;
                                        if (length > 0) {
                                            if (this.position <= length && this.position > 0) {
                                                this.position -= 1;
                                                return this.byIndex(this.position);
                                            }
                                        }
                                        return null;
                                    },
                                    remove      : function (index) {
                                        ///     <summary>Remove object by index</summary>
                                        ///     <param name="index" type="Number">Index of item</param>
                                        ///     <returns type="bool" mayBeNull="false">false : fail of delete. true : item was deleted.</returns>
                                        var index           = (typeof index === "number" ? index : null),
                                            length          = this.length,
                                            sourceObject    = this.self,
                                            property        = null;
                                        if (index >= 0 && index < length) {
                                            property = this.byIndex(index);
                                            if (property !== null) {
                                                sourceObject[property.name] = null;
                                                delete sourceObject[property.name];
                                                this.position = 0;
                                                return true;
                                            }
                                        }
                                        return false;
                                    },
                                    reset       : function () {
                                        ///     <summary>Reset to start position for next(), previous()</summary>
                                        this.position = -1;
                                    }
                                }
                            }());
                            //Return inited constructor
                            return Patterns.ListOf.objects
                        }
                    }
                };
                //---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
                publicJoin = {
                    ListOf: {
                        objects: function (targetObject) { return Initializator.join(targetObject, Patterns.ListOf.objects); }
                    }
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
                    join : publicJoin
                    //---< Public end		>--[begin]---------------------------------------------------------------------------------------
                }
            },
            //Init function
            function () {
            }
        );
    }
}());