using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;
using Purity.Models;
using Purity.Classes;

namespace Purity.Controllers
{
    /*
     * Данный контролер отвечает за "выдачу" модулей.
     * Здесь живет только один запрос - get, доступный по адресу http://[domain]/modules/get.
     * Данный запрос возвращает данные модулей, либо сообщение об ошибке, если модуль не найден.
     */
    public class ModulesController : Controller
    {
        //Класс, отвечающий за доставку "тела" модуля
        public class getContentClass
        {
            string PhysicalApplicationPath;
            string UrlScheme;
            string UrlAuthority;
            public getContentClass(string PhysicalApplicationPath, string UrlScheme, string UrlAuthority)
            {
                this.PhysicalApplicationPath    = PhysicalApplicationPath;
                this.UrlScheme                  = UrlScheme;
                this.UrlAuthority               = UrlAuthority;
            }
            public List<Dictionary<string, string>> get(string[] modulesNames)
            {
                List<Dictionary<string, string>>    modulesContent  = new List<Dictionary<string, string>>();
                Dictionary<string, string>          moduleRecord;
                FileStream                          fileStream;
                StreamReader                        streamReader;
                FileInfo                            fileInfo;
                string                              PathToFile;
                string                              fileName;
                string                              URLToFile;
                string                              ResultString;
                string                              moduleName;
                byte[]                              bytes;
                for (int Index = modulesNames.Length - 1; Index >= 0; Index -= 1)
                {
                    fileName        = (modulesNames[Index].ToLower().IndexOf("purity.") != -1 ? modulesNames[Index] + ".js" : "Purity." + modulesNames[Index] + ".js");
                    moduleName      = (modulesNames[Index].ToLower().IndexOf("purity.") == -1 ? modulesNames[Index] :  modulesNames[Index].Substring("Purity.".Length, modulesNames[Index].Length - "Purity.".Length)); 
                    PathToFile      = this.PhysicalApplicationPath + @"Kernel\JS\" + fileName;
                    URLToFile       = UrlScheme + "://" + UrlAuthority + "/" + @"Kernel/JS/" + fileName;
                    moduleRecord    = new Dictionary<string, string>();
                    if (System.IO.File.Exists(PathToFile) == true)
                    {
                        fileInfo = new FileInfo(PathToFile);
                        if (fileInfo.Length > 0)
                        {
                            fileStream      = new FileStream(PathToFile, FileMode.Open, FileAccess.Read);
                            streamReader    = new StreamReader(fileStream);
                            ResultString    = streamReader.ReadToEnd();
                            fileStream.Close();
                            bytes           = System.Text.UTF8Encoding.UTF8.GetBytes(ResultString);
                            //Записываем данные
                            moduleRecord.Add("value",   Convert.ToBase64String(bytes));
                            moduleRecord.Add("name",    moduleName);
                            moduleRecord.Add("version", fileInfo.LastWriteTime.ToString());
                            moduleRecord.Add("url",     URLToFile);
                        }
                    }
                    if (moduleRecord.Keys.Count == 0){
                        moduleRecord.Add("value",   "null");
                        moduleRecord.Add("name",    moduleName);
                        moduleRecord.Add("version", "null");
                        moduleRecord.Add("url",     "null");
                    }
                    modulesContent.Add(moduleRecord);
                }
                return modulesContent;
            }
            public List<Dictionary<string, string>> list()
            {
                List<Dictionary<string, string>>    resourcesList  = new List<Dictionary<string, string>>();
                Dictionary<string, string>          resourceRecord;
                FileInfo                            fileInfo;
                string                              PathToDirectory = PhysicalApplicationPath + @"Kernel\JS\";
                string                              fileName;
                string                              moduleName;
                string[]                            allResources;
                if (System.IO.Directory.Exists(PathToDirectory) == true)
                {
                    allResources = System.IO.Directory.GetFiles(PathToDirectory,"*.*", SearchOption.AllDirectories);
                    for (int index = allResources.Length - 1; index >= 0; index -= 1)
                    {
                        fileInfo = new FileInfo(allResources[index]);
                        if (fileInfo.Length > 0)
                        {
                            fileName        = fileInfo.Name;
                            moduleName      = (fileName.ToLower().IndexOf("purity.") == -1 ? fileName : fileName.Substring("Purity.".Length, fileName.Length - "Purity.".Length));
                            moduleName      = (moduleName.ToLower().IndexOf(".js") == -1 ? moduleName : moduleName.Substring(0, moduleName.Length - ".js".Length));
                            resourceRecord = new Dictionary<string, string>();
                            resourceRecord.Add("version",   fileInfo.LastWriteTime.ToString());
                            resourceRecord.Add("name",      moduleName);
                            resourcesList.Add(resourceRecord);
                        }
                    }
                }
                return resourcesList;
            }
        }
        //Обработка запроса
        //[HttpGet]
        public JsonResult get(requestModulesClass requestModules)
        {
            try {
                string[]        modulesNames    = (requestModules.modules != null ? requestModules.modules.Split(';') : null);
                getContentClass getContent      = new getContentClass(  HttpContext.Request.PhysicalApplicationPath,
                                                                        HttpContext.Request.Url.Scheme,
                                                                        HttpContext.Request.Url.Authority);
                JsonResult      jsonResult;
                switch (requestModules.command)
                {
                    case "content":
                        jsonResult                  = Json(getContent.get(modulesNames), JsonRequestBehavior.AllowGet);
                        jsonResult.MaxJsonLength    = int.MaxValue;
                        if (requestModules.JSIC == null)
                        {
                            return jsonResult;
                        }
                        else
                        {
                            return Json("Purity server's script::: Incorrect request", JsonRequestBehavior.AllowGet);
                        }
                    case "urls only":

                        break;
                    case "versions":
                        jsonResult                  = Json(getContent.list(), JsonRequestBehavior.AllowGet);
                        jsonResult.MaxJsonLength    = int.MaxValue;
                        if (requestModules.JSIC == null)
                        {
                            return jsonResult;
                        }
                        else
                        {
                            return Json("Purity server's script::: Incorrect request", JsonRequestBehavior.AllowGet);
                        }
                        break;
                }
                return Json("Purity server's script::: Incorrect command", JsonRequestBehavior.AllowGet);
            }
            catch (System.Exception ex)
            {
                return Json("Purity server's script::: Some error on server side", JsonRequestBehavior.AllowGet);
            }
        }
        
        public string getJSIC(requestModulesClass requestModules)
        {
            try
            {
                string[]        modulesNames    = (requestModules.modules != null ? requestModules.modules.Split(';') : null);
                string          JSICString      = "";
                getContentClass getContent      = new getContentClass(HttpContext.Request.PhysicalApplicationPath,
                                                                    HttpContext.Request.Url.Scheme,
                                                                    HttpContext.Request.Url.Authority);
                JsonResult      jsonResult;
                switch (requestModules.command)
                {
                    case "content":
                        jsonResult                  = Json(getContent.get(modulesNames), JsonRequestBehavior.AllowGet);
                        jsonResult.MaxJsonLength    = int.MaxValue;
                        if (requestModules.JSIC != null)
                        {
                            JSICClass JSIC = new JSICClass(requestModules.JSIC);
                            if (JSIC.isReady == true)
                            {
                                JSICString = JSIC.getData(new JavaScriptSerializer().Serialize(jsonResult.Data));
                            }
                            return JSICString;
                        }
                        else
                        {
                            return "Purity server's script::: Cannot get string";
                        }
                    case "urls only":

                        break;
                    case "versions":
                        jsonResult                  = Json(getContent.list(), JsonRequestBehavior.AllowGet);
                        jsonResult.MaxJsonLength    = int.MaxValue;
                        if (requestModules.JSIC != null)
                        {
                            JSICClass JSIC = new JSICClass(requestModules.JSIC);
                            if (JSIC.isReady == true)
                            {
                                JSICString = JSIC.getData(new JavaScriptSerializer().Serialize(jsonResult.Data));
                            }
                            return JSICString;
                        }
                        else
                        {
                            return "Purity server's script::: Cannot get string";
                        }
                        break;
                }
                return "Purity server's script::: Incorrect command";
            }
            catch (System.Exception ex)
            {
                return "Purity server's script::: Some error on server side";
            }
        }

    }
}
