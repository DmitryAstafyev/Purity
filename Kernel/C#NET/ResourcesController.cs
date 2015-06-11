using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Purity.Classes;
using System.Web.Script.Serialization;
using System.Text;
using Purity.Models;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Net.Http.Headers;

namespace Purity.Controllers
{
    public class ResourcesController : Controller
    {
        public class getStringContentClass
        {
            public class versionsClass
            {
                private Dictionary<string, string> get()
                {
                    if (VirtualResourcesVersionsStorageClass.versions != null)
                    {
                        return VirtualResourcesVersionsStorageClass.versions;
                    }
                    return new Dictionary<string, string>();
                }
                private void update(string PhysicalApplicationPath)
                {
                    FileInfo fileInfo;
                    string fileName;
                    Dictionary<string, string> cachedData = this.get();
                    for (var index = cachedData.Keys.Count - 1; index > 0; index -= 1)
                    {
                        fileName = cachedData.Keys.ElementAt(index);
                        fileName = fileName.Replace("[", "");
                        fileName = fileName.Replace("]", "");
                        fileName = (PhysicalApplicationPath + fileName).Replace('/', '\\');
                        if (System.IO.File.Exists(fileName) == true)
                        {
                            fileInfo = new FileInfo(fileName);
                            cachedData[cachedData.Keys.ElementAt(index)] = fileInfo.LastWriteTime.ToString();
                        }
                    }
                    this.set(cachedData);
                }
                private void set(Dictionary<string, string> versions)
                {
                    VirtualResourcesVersionsStorageClass.versions = versions;
                }
                public void registration(string path, string name, string version)
                {
                    Dictionary<string, string>  cachedData  = this.get();
                    string                      resourceKey = path + name;
                    if (cachedData.ContainsKey(resourceKey) == false)
                    {
                        cachedData.Add(resourceKey, version);
                        this.set(cachedData);
                    }
                    else
                    {
                        if (cachedData[resourceKey] != version)
                        {
                            cachedData[resourceKey] = version;
                            this.set(cachedData);
                        }
                    }
                }
                public List<Dictionary<string, string>> list(string PhysicalApplicationPath)
                {
                    this.update(PhysicalApplicationPath);
                    List<Dictionary<string, string>>    resultList  = new List<Dictionary<string, string>>();
                    Dictionary<string, string>          versions    = this.get();
                    Dictionary<string, string>          record;
                    for (var index = versions.Keys.Count - 1; index >= 0; index -= 1)
                    {
                        record = new Dictionary<string, string>();
                        record.Add("resource",  versions.Keys.ElementAt(index)          );
                        record.Add("version",   versions[versions.Keys.ElementAt(index)]);
                        resultList.Add(record);
                    }
                    return resultList;
                }
            }
            private string          PhysicalApplicationPath;
            private versionsClass   versions = new versionsClass();
            public getStringContentClass(string PhysicalApplicationPath)
            {
                this.PhysicalApplicationPath    = PhysicalApplicationPath;
            }
            public string get(string path, string name)
            {
                FileStream                  fileStream;
                StreamReader                streamReader;
                FileInfo                    fileInfo;
                string                      ResultString    = "";
                string                      FileName;
                string                      Extension;
                byte[]                      bytes;
                Dictionary<string, string>  resourceRecord  = new Dictionary<string,string>();
                //path = path.Replace("~", "");
                FileName = (this.PhysicalApplicationPath + path + name).Replace("~", "").Replace('/', '\\').Replace("\\\\", "\\");/*without /*/
                //FileName                                    = FileName.Replace("~","");
                if (System.IO.File.Exists(FileName) == true)
                {
                    fileInfo = new FileInfo(FileName);
                    if (fileInfo.Length > 0)
                    {
                        Extension       = fileInfo.Extension.ToLower();
                        //Тут конечно же нужно автоматическое определение текста от бинарных данных
                        if (Extension.IndexOf("png") == -1 && Extension.IndexOf("jpg") == -1 && Extension.IndexOf("gif") == -1 && Extension.IndexOf("jpeg") == -1)
                        {
                            fileStream      = new FileStream(FileName, FileMode.Open, FileAccess.Read);
                            streamReader    = new StreamReader(fileStream);
                            ResultString    = streamReader.ReadToEnd();
                            bytes           = System.Text.UTF8Encoding.UTF8.GetBytes(ResultString);
                            fileStream.Close();
                        }
                        else
                        {
                            bytes           = System.IO.File.ReadAllBytes(FileName);
                        }
                        //Записываем данные
                        resourceRecord.Add("value",     Convert.ToBase64String(bytes));
                        resourceRecord.Add("name",      name);
                        resourceRecord.Add("version",   fileInfo.LastWriteTime.ToString());
                        //Регистрируем версию
                        this.versions.registration(path, name, fileInfo.LastWriteTime.ToString());
                        return new JavaScriptSerializer().Serialize(resourceRecord);
                    }
                }
                return null;
            }
        }
        //
        // GET: /Resources/
        //JSIC (JavaScript Information Communication)
        
        [HttpGet]
        public string get(requestResourseClass requestModules)
        {
            if (requestModules.path != null && requestModules.name != null && requestModules.JSIC != null)
            {
                getStringContentClass   getStringContent    = new getStringContentClass(HttpContext.Request.PhysicalApplicationPath);
                string                  JSICString          = getStringContent.get(requestModules.path, requestModules.name);
                JSICClass               JSIC                = new JSICClass(requestModules.JSIC);
                JSICString                                  = JSIC.getData(JSICString);
                if (JSICString != null)
                {
                    return JSICString;
                }
                
            }
            return "JSIC resource request::: (path or name isn't defined in params of request) or (error or server side)";
        }
        [HttpGet]
        public string versions(requestResourseClass requestModules)
        {
            try{
                if (requestModules.JSIC != null)
                {
                    getStringContentClass.versionsClass versions = new getStringContentClass.versionsClass();
                    JsonResult  jsonResult      = Json(versions.list(HttpContext.Request.PhysicalApplicationPath), JsonRequestBehavior.AllowGet);
                    JSICClass   JSIC            = new JSICClass(requestModules.JSIC);
                    string      resultString    = JSIC.getData(new JavaScriptSerializer().Serialize(jsonResult.Data));
                    if (resultString != null)
                    {
                        return resultString;
                    }

                }
                return "JSIC resource request::: cannot get information about versions";
            }catch(Exception ex)
            {
                return "JSIC resource request::: bad request";
            }
        }

    }
}
