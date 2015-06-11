/*global Purity*/
/// <reference path="~/Kernel/JS/Purity.Initializer.js" />
/// <module>
///     <summary>
///         Controls vars and purity's properties which are linked to DOM's objects.
///     </summary>
/// </module>
(function () {
    "use strict";
    //Check Purity.Initializer. Purity should be inited at this moment.
	if (typeof Purity !== "undefined") {
		//Init module prototype and init function
		Purity.createModule("Environment.Overhead",
            //Check references
            {
                modules     : null,
                resources   : null
            },
            //Prototype part
            function () {
            	/// <summary>Discription of library</summary>
            	var name				= "Purity::: Controls vars and purity's properties which are linked to DOM's objects.",
                    version				= "1.0",
                    lastUpdate			= "02.06.2013",
                    author				= "Dmitry Astafyev",
            	//Declaration module's blocks
					Vars				= {},
					Properties			= {},
					Init				= {},
					publicVars			= {},
					publicProperties	= {};
            	//---< Private part		>--[begin]---------------------------------------------------------------------------------------
                //Блок работы с переменными
            	Vars = {
            	    data    : {},
            	    methods : {
            	        set     : function (group, name, value, rewrite) {
            	            var argument_name       = (typeof name      === "string"    ? name      : null  ),
                                argument_group      = (typeof group     === "string"    ? group     : null  ),
                                argument_value      = (typeof value     !== "undefined" ? true      : false ),
                                argument_rewrite    = (typeof rewrite   === "boolean"   ? rewrite   : false ),
                                data                = Vars.data;
            	            if (argument_name !== null && argument_value === true) {
            	                try{
            	                    if (argument_group !== null) {
            	                        if (typeof data[argument_group] !== "object") {
            	                            data[argument_group] = {};
            	                        }
            	                        data = data[argument_group];
            	                    }
            	                    if (typeof data[argument_name] === "undefined" || argument_rewrite === true) {
            	                        data[argument_name] = value;
            	                        return data[argument_name];
            	                    }
            	                } catch (e) {
            	                    return null;
            	                }
            	            }
            	            return null;
            	        },
            	        get     : function (group, name) {
            	            var argument_name       = (typeof name      === "string"    ? name      : null  ),
                                argument_group      = (typeof group     === "string"    ? group     : null  ),
                                data                = Vars.data;
            	            if (argument_name !== null) {
            	                if (argument_group !== null) {
            	                    if (typeof data[argument_group] !== "object") {
            	                        return null;
            	                    }
            	                    data = data[argument_group];
            	                }
            	                if (typeof data[argument_name] !== "undefined") {
            	                    return data[argument_name];
            	                }
            	            }
            	            return null;
            	        },
            	        remove  : function (group, name) {
            	            var argument_name       = (typeof name      === "string"    ? name      : null  ),
                                argument_group      = (typeof group     === "string"    ? group     : null  ),
                                data                = Vars.data;
            	            if (argument_name !== null) {
            	                if (argument_group !== null) {
            	                    if (typeof data[argument_group] !== "object") {
            	                        return null;
            	                    }
            	                    data = data[argument_group];
            	                }
            	                if (typeof data[argument_name] !== "undefined") {
            	                    data[argument_name] = null;
            	                    delete data[argument_name];
            	                    if (Object.keys(data).length === 0 && argument_group !== null) {
            	                        Vars.data[argument_group] = null;
            	                        delete Vars.data[argument_group];
            	                    }
            	                    return true;
            	                }
            	                return false;
            	            }
            	            return null;
            	        }
            	    }
            	};
            	//Блок по работе со свойствами семейства Purity
            	Properties = {
            		Config: {
            			FamilyName: "PurityProperties"
            		},
            		//Местные хелперы
            		Helpers: {
            			//Удаляет атрибут объекта
            			DeleteAttribute: function (targetObject, attributeName) {
            				try {
            					delete targetObject[attributeName];
            				} catch (e) {
            					targetObject.removeAttribute(attributeName);
            				}
            				return targetObject;
            			},
            			Clear: function (targetObject) {
            				if (Object.keys(targetObject[Properties.Config.FamilyName]).length === 0) {
            					targetObject[Properties.Config.FamilyName] = null;
            					Properties.Helpers.DeleteAttribute(targetObject, Properties.Config.FamilyName);
            				}
            			}
            		},
            		//Устанавливает свойство
            		/*
					targetObject    - объект, где будет установлено свойство
					propertyName    - имя нового свойства
					propertyValue   - значение свойства
					rewriteFlag     - НЕ обязательный параметр. Если значение false, то в случае если свойство уже установлено, оно не будет перезаписано
					*/
            		Set: function (targetObject, propertyName, propertyValue, rewriteFlag) {
            		    var rewriteFlag = (typeof rewriteFlag === "boolean" ? rewriteFlag : true);
            			if (typeof targetObject === "object" && typeof propertyName === "string" && typeof propertyValue !== "undefined") {
            				if (typeof targetObject[Properties.Config.FamilyName] !== "object") {
            					targetObject[Properties.Config.FamilyName] = {};
            				}
            				switch (rewriteFlag) {
            					case true:
            						targetObject[Properties.Config.FamilyName][propertyName] = propertyValue;
            						break;
            					case false:
            						if (typeof targetObject[Properties.Config.FamilyName][propertyName] === "undefined") {
            							targetObject[Properties.Config.FamilyName][propertyName] = propertyValue;
            						}
            						break;
            				}
            				return propertyValue;
            			}
            			return null; //свидетельствует об ошибках
            		},
            		//Возвращает значение свойства.
            		/*
					deleteFlag - если true, то свойство будет удалено сразу после прочтения
					*/
            		Get: function (targetObject, propertyName, deleteFlag) {
            			var deleteFlag		= null,
							ResultProperty	= null;
            			if (typeof targetObject === "object" && typeof propertyName === "string") {
            				if (typeof deleteFlag !== "boolean") {
            					deleteFlag = false;
            				}
            				if (typeof targetObject[Properties.Config.FamilyName] === "object") {
            					if (typeof targetObject[Properties.Config.FamilyName][propertyName] !== "undefined") {
            						ResultProperty = targetObject[Properties.Config.FamilyName][propertyName];
            						if (deleteFlag === true) {
            							targetObject[Properties.Config.FamilyName][propertyName] = null;
            							Properties.Helpers.DeleteAttribute(targetObject[Properties.Config.FamilyName], propertyName);
            							Properties.Helpers.Clear(targetObject);
            						}
            						return ResultProperty;
            					}
            				}
            			}
            			return null;//переменной не обнаружено, либо ошибки какие-то. Хотя где им тут быть то
            		},
            		//Удаляет указанное свойство
            		Remove: function (targetObject, propertyName) {
            			if (typeof targetObject === "object" && typeof propertyName === "string") {
            				if (typeof targetObject[Properties.Config.FamilyName] === "object") {
            					if (typeof targetObject[Properties.Config.FamilyName][propertyName] !== "undefined") {
            						targetObject[Properties.Config.FamilyName][propertyName] = null;
            						Properties.Helpers.DeleteAttribute(targetObject[Properties.Config.FamilyName], propertyName);
            						Properties.Helpers.Clear(targetObject);
            						return true;
            					}
            				}
            			}
            			return false;
            		}
            	};
            	//Инициализация модуля
            	//---< Private part		>--[end]---------------------------------------------------------------------------------------
                //---< Security part	>--[begin]---------------------------------------------------------------------------------------
            	publicVars          = {
            	    set: Vars.methods.set,
            	    get: Vars.methods.get,
                    del: Vars.methods.remove
            	};
            	publicProperties    = {
            		Set: Properties.Set,
            		Get: Properties.Get,
            		Del: Properties.Remove
            	};
            	//---< Security part	>--[end]---------------------------------------------------------------------------------------
            	//---< Init part	    >--[begin]---------------------------------------------------------------------------------------
            	//---< Init part	    >--[end]---------------------------------------------------------------------------------------
            	return {
            		//---< Public part		>--[begin]---------------------------------------------------------------------------------------
            		AboutModule	: {
            			getName			: function () { return name;		},
            			getVersion		: function () { return version;		},
            			getLastUpdate	: function () { return lastUpdate;	},
            			getAuthor		: function () { return author;		}
            		},
            		vars		: publicVars,
            		Properties	: publicProperties
            		//---< Public end		>--[begin]---------------------------------------------------------------------------------------
            	}
            },
            //Init function
            function () {
            }
        );
	}
}());