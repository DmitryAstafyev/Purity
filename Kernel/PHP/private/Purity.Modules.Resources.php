<?php
namespace Purity\Modules\Controller {
			class Resources{
				private $UrlScheme;
				private $UrlAuthority;
				private $PurityJSPath;
				private $PurityJSURL;
				private $privatePHPPath;
				function __construct($PurityJSPath, $PurityJSURL, $protocol, $privatePHPPath)
				{
					$this->PurityJSPath    				= $PurityJSPath;
					$this->PurityJSURL    				= $PurityJSURL;
					$this->UrlAuthority               	= $_SERVER['SERVER_NAME'];
					$this->UrlScheme					= $protocol;
					$this->privatePHPPath				= $privatePHPPath;
					require_once(($this->privatePHPPath).'Purity.Strings.php');
				}
				public function get($modulesNames)
				{
					$modulesContent 	= array();
					$isEmpty 			= true;
					for ($index = count($modulesNames) - 1; $index >= 0; $index--){
						$fileName 		= (strpos(strtolower($modulesNames[$index]), "purity.") != false ? $modulesNames[$index].".js" 		: "Purity.".$modulesNames[$index].".js");
						$moduleName 	= (strpos(strtolower($modulesNames[$index]), "purity.") == false ? $modulesNames[$index] 			: substr($modulesNames[$index], strlen("purity."), (strlen($modulesNames[$index]) - strlen("purity."))));
						$pathToFile 	= $this->PurityJSPath.$fileName;
						$URLToFile 		= $this->UrlScheme."://".$this->UrlAuthority.($this->PurityJSURL).$fileName;
						if (file_exists($pathToFile) == true){
							if (filesize($pathToFile) > 0){
								$fileContent = file_get_contents($pathToFile);
								if ($fileContent != false){
									//$BASE64Content = chunk_split(base64_encode($fileContent));
									$BASE64Content 	= base64_encode($fileContent);
									$moduleRecord 	= array(
										"value" 	=> $BASE64Content,
										"name" 		=> $moduleName,
										"version" 	=> strval(filemtime($pathToFile)),
										"url" 		=> $URLToFile
									);
									array_push($modulesContent, $moduleRecord);
									$isEmpty = false;
								}
							}
						}
					}
					return ($isEmpty == true ? NULL : $modulesContent);
				}
				public function getList(){
					$modulesList		= array();
					$stringsTools 		= new \Purity\Strings\Tools("UTF-8");
					if (file_exists($this->PurityJSPath) == true){
						$modulesFiles 	= scandir($this->PurityJSPath);
						foreach ($modulesFiles as $module){
							$moduleName  	= $stringsTools->replace($module, 		'Purity.', 	'');
							$moduleName  	= $stringsTools->replace($moduleName, 	'.js', 		'');
							$moduleRecord 	= array(
										"name" 		=> $moduleName,
										"version" 	=> strval(filemtime($this->PurityJSPath.$module))
							);
							array_push($modulesList, $moduleRecord);
						}
					}
					return $modulesList;
				}
			}
			class Controller{
				private $command;
				private $mode;
				private $modules;
				private $JSIC;
				private $PurityJSPath;
				private $privatePHPPath;
				private $PurityJSURL;
				private $protocol;
				function __construct($PurityJSPath, $privatePHPPath, $PurityJSURL, $protocol)
				{
					$this->PurityJSPath 	= (isset($PurityJSPath) 	== true ? $PurityJSPath 	: NULL);
					$this->privatePHPPath 	= (isset($privatePHPPath) 	== true ? $privatePHPPath 	: NULL);
					$this->PurityJSURL 		= (isset($PurityJSURL) 		== true ? $PurityJSURL 		: NULL);
					$this->protocol 		= (isset($protocol) 		== true ? $protocol 		: NULL);
					$this->command 			= (isset($_POST['command']) == true ? $_POST['command'] : NULL);
					$this->mode 			= (isset($_POST['mode']) 	== true ? $_POST['mode'] 	: "debug");
					$this->modules 			= (isset($_POST['modules']) == true ? $_POST['modules'] : NULL);
					$this->JSIC 			= (isset($_POST['JSIC']) 	== true ? $_POST['JSIC'] 	: NULL);
					$this->command 			= (is_null($this->command) 	== true ? (isset($_GET['command']) 	== true ? $_GET['command'] 	: NULL) : $this->command);
					$this->mode 			= (is_null($this->mode) 	== true ? (isset($_GET['mode']) 	== true ? $_GET['mode'] 	: NULL) : $this->mode	);
					$this->modules 			= (is_null($this->modules) 	== true ? (isset($_GET['modules']) 	== true ? $_GET['modules'] 	: NULL) : $this->modules);
					$this->JSIC 			= (is_null($this->JSIC) 	== true ? (isset($_GET['JSIC']) 	== true ? $_GET['JSIC'] 	: NULL) : $this->JSIC	);
					$this->command 			= (is_null($this->command) 	== false ? urldecode($this->command) 	: NULL);
					$this->mode 			= (is_null($this->mode) 	== false ? urldecode($this->mode) 		: NULL);
					$this->modules 			= (is_null($this->modules) 	== false ? urldecode($this->modules) 	: NULL);
					$this->JSIC 			= (is_null($this->JSIC) 	== false ? urldecode($this->JSIC) 		: NULL);
				}
				function getModules(){
					try{
						if (is_null($this->command) 		== false && 
							is_null($this->PurityJSPath) 	== false && is_null($this->privatePHPPath) 	== false && 
							is_null($this->PurityJSURL) 	== false && is_null($this->protocol) 		== false){
							$modulesNames = explode(';', $this->modules);
							if (count($modulesNames) > 0){
								switch($this->command){
									case "content":
										if (is_null($this->modules) == false){
											$resources 		= new Resources($this->PurityJSPath, $this->PurityJSURL, $this->protocol, $this->privatePHPPath);
											$requestResult 	= $resources->get($modulesNames);
											if (is_null($requestResult) == false){
												if (is_null($this->JSIC) == true){
													echo json_encode($requestResult);
												}else{
													require_once(($this->privatePHPPath).'Purity.JSICConvertor.php');
													$JSIC 			= new \Purity\JSICConvertor\Convertor($this->JSIC, $this->privatePHPPath);
													$requestResult 	= $JSIC->getData(json_encode($requestResult));
													header("Content-Type: application/javascript");
													echo $requestResult;
												}
												return;

											}else{
												echo "Purity modules::: Cannot get modules data";
												return;
											}
										}
									break;
									case "urls only":
									break;
									case "versions":
										$resources 		= new Resources($this->PurityJSPath, $this->PurityJSURL, $this->protocol, $this->privatePHPPath);
										$requestResult 	= $resources->getList();
										if (is_array($requestResult) == true){
											if (is_null($this->JSIC) == true){
												echo json_encode($requestResult);
											}else{
												require_once(($this->privatePHPPath).'Purity.JSICConvertor.php');
												$JSIC 			= new \Purity\JSICConvertor\Convertor($this->JSIC, $this->privatePHPPath);
												$requestResult 	= $JSIC->getData(json_encode($requestResult));
												header("Content-Type: application/javascript");
												echo $requestResult;
											}
											return;
										}else{
											echo "Purity modules::: Cannot get modules data";
											return;
										}
									break;
								}
								echo "Purity modules::: Incorrect command";
							}
						}
					}catch(Exception $e){
						echo "Purity modules::: Some error on server side [".$e->getMessage()."]\n";
					}
				}
			}
		}
?>