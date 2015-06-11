<?php
namespace Purity\Resources\Controller {
			class Storage{
				private $privatePHPPath;
				private $version_file;
				private $resources_versions;
				function __construct($privatePHPPath, $resources_versions)
				{
					$this->privatePHPPath		= $privatePHPPath;
					$this->resources_versions	= $resources_versions;
					$this->version_file			= $this->privatePHPPath.$this->resources_versions;
					//require_once(($this->privatePHPPath).'Purity.Strings.php');
				}
				private function get(){
					$resultRecords 	= array();
					if (file_exists($this->version_file) == true){
						$fileContent = file_get_contents($this->version_file);
						if ($fileContent != false){
							$records = explode(";", $fileContent);
							//echo "$fileContent:::[".$fileContent."]";
							foreach ($records as $record){
								$subRecords = explode("|", $record);
								if (count($subRecords) == 3){
									$resultRecord = array(
												"resource"	=> $subRecords[0],
												"path" 		=> $subRecords[1],
												"version" 	=> $subRecords[2]
									);
									array_push($resultRecords, $resultRecord);
								}
							}
						}
					}
					return $resultRecords;
				}
				private function set($records){
					//$stringsTools	= new \Purity\Strings\Tools("UTF-8");
					$records_string = "";
					foreach ($records as $record){
						if (array_key_exists("resource", $record) == true && array_key_exists("path", $record) == true && array_key_exists("version", $record) == true){
							$records_string = $records_string.$record["resource"]."|".$record["path"]."|".$record["version"];
							$records_string = $records_string.";";
						}
					}
					//$records_string = $stringsTools->subString($records_string, 0, ($stringsTools->length($records_string) - 1)); 	
					$result_operation = file_put_contents($this->version_file, $records_string);
					return $result_operation;
				}
				private function add($path, $name, $version, $file_path){
					$records 		= $this->get();
					$isIn			= false;
					$key			= $path.$name;
					foreach ($records as $record){
						if ($record["resource"] == $key){
							$isIn = true;
						}
					}
					if ($isIn == false){
						$record = array(
									"resource" 	=> $key,
									"path" 		=> $file_path,
									"version" 	=> $version
						);
						array_push($records, $record);
						$this->set($records);
					}
				}
				public function registration($path, $name, $version, $pathToFile){
					if (is_string($path) == true && is_string($name) == true && is_string($version) == true && is_string($pathToFile) == true){
						if (file_exists($pathToFile) == true){
							$this->add($path, $name, $version, $pathToFile);
						}
					}
				}
				public function get_list(){
					$records 			= $this->get();
					$updated_records 	= array();
					foreach ($records as $record){
						if (array_key_exists("resource", $record) == true && array_key_exists("path", $record) == true && array_key_exists("version", $record) == true){
							if (file_exists($record["path"]) == true){
								$updated_record = array(
											"resource" 	=> $record["resource"],
											"path" 		=> $record["path"],
											"version" 	=> strval(filemtime($record["path"]))
								);
								array_push($updated_records, $updated_record);
							}
						}
					}
					//$this->set($records);
					return $updated_records;
				}
			}
			class Resource{
				private $privatePHPPath;
				private $root;
				private $resources_versions;
				function __construct($privatePHPPath, $resources_versions)
				{
					$this->privatePHPPath		= $privatePHPPath;
					$this->root					= $_SERVER['DOCUMENT_ROOT'];
					$this->resources_versions	= $resources_versions;
					require_once(($this->privatePHPPath).'Purity.Strings.php');
				}
				private function path($path){
					$stringsTools 		= new \Purity\Strings\Tools("UTF-8");
					if (strpos($path, "~") !== false){
						if (strpos($this->root, "\\") !== false){
							$path = $stringsTools->replace($path, '/', '\\');
						}
						if (strpos($this->root, "/") !== false){
							$path = $stringsTools->replace($path, '\\', '/');
						}
						$path = $stringsTools->replace($path, '~', $this->root);
					}
					return $path;
				}
				public function get($path, $name)
				{
					$pathToFile 		= $this->path($path).$name;
					$BASE64Content 		= NULL;
					$stringsTools 		= new \Purity\Strings\Tools("UTF-8");
					$storage 			= new Storage($this->privatePHPPath, $this->resources_versions);
					$resourceRecord 	= NULL;
					if (file_exists($pathToFile) == true){
						if (filesize($pathToFile) > 0){
							$fileContent = file_get_contents($pathToFile);
							if ($fileContent != false){
								//$fileContent 	= $stringsTools->encode($fileContent);
								$BASE64Content 	= base64_encode($fileContent);
								$resourceRecord = array(
									"value" 	=> $BASE64Content,
									"name" 		=> $name,
									"version" 	=> strval(filemtime($pathToFile))
								);
								$storage->registration($path, $name, strval(filemtime($pathToFile)), $pathToFile);
							}
						}
					}
					return $resourceRecord;
				}
			}
			class Controller{
				private $path;
				private $name;
				private $JSIC;
				private $privatePHPPath;
				private $protocol;
				private $resources_versions;
				function __construct($privatePHPPath, $protocol, $resources_versions)
				{
					$this->privatePHPPath 		= (isset($privatePHPPath) 		== true ? $privatePHPPath 		: NULL);
					$this->protocol 			= (isset($protocol) 			== true ? $protocol 			: NULL);
					$this->resources_versions	= (isset($resources_versions)	== true ? $resources_versions	: NULL);
					$this->path 				= (isset($_POST['path']) 		== true ? $_POST['path'] 		: NULL);
					$this->name 				= (isset($_POST['name']) 		== true ? $_POST['name'] 		: NULL);
					$this->JSIC 				= (isset($_POST['JSIC']) 		== true ? $_POST['JSIC'] 		: NULL);
					$this->path 				= (is_null($this->path) 		== true ? (isset($_GET['path']) == true ? $_GET['path'] : NULL) : $this->path	);
					$this->name 				= (is_null($this->name) 		== true ? (isset($_GET['name']) == true ? $_GET['name'] : NULL) : $this->name	);
					$this->JSIC 				= (is_null($this->JSIC) 		== true ? (isset($_GET['JSIC']) == true ? $_GET['JSIC'] : NULL) : $this->JSIC	);
					$this->path 				= (is_null($this->path) 		== false ? urldecode($this->path) : NULL);
					$this->name 				= (is_null($this->name) 		== false ? urldecode($this->name) : NULL);
					$this->JSIC 				= (is_null($this->JSIC) 		== false ? urldecode($this->JSIC) : NULL);
				}
				public function get(){
					try{
						if (is_null($this->path) 			== false && is_null($this->name) 		== false &&
							is_null($this->privatePHPPath) 	== false && is_null($this->protocol)	== false){
							$resource 		= new Resource($this->privatePHPPath, $this->resources_versions);
							$requestResult 	= $resource->get($this->path, $this->name);
							if (is_null($requestResult) == false){
								require_once(($this->privatePHPPath).'Purity.JSICConvertor.php');
								$JSIC 			= new \Purity\JSICConvertor\Convertor($this->JSIC, $this->privatePHPPath);
								$requestResult 	= $JSIC->getData(json_encode($requestResult));
								header("Content-Type: application/javascript");
								echo $requestResult;
								return;
							}
							echo "Purity resources::: Cannot get resource data";
						}
					}catch(Exception $e){
						echo "Purity resources::: Some error on server side [".$e->getMessage()."]\n";
					}
				}
				public function versions(){
					$storage = new Storage($this->privatePHPPath, $this->resources_versions);
					require_once(($this->privatePHPPath).'Purity.JSICConvertor.php');
					$JSIC 			= new \Purity\JSICConvertor\Convertor($this->JSIC, $this->privatePHPPath);
					$requestResult 	=$JSIC->getData(json_encode($storage->get_list()));
					header("Content-Type: application/javascript");
					echo $requestResult;
				}
			}
		}
?>