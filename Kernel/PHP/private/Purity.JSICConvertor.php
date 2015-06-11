<?php
namespace Purity\JSICConvertor{
	class partsRecordClass{
        public  $count       = -1;
        public  $size        = -1;   //bytes
        public  $requested   = -1;
        private $isCalculate = false;
        public function setDefault(){
            $this->count = -1;
            if ($this->size < 1024){
                $this->size = 40960;
            }
            if ($this->requested < 0)
            {
                $this->requested = 0;
            }
        }
		//Определяет количество частей
		public function getCount($bytesData)
		{
			if ($this->isCalculate == false){
				$this->setDefault();
				$dataSize    	= count($bytesData);
				if ($dataSize < $this->size){
					$this->count = 1;
				}else{
					$this->count = ceil($dataSize / $this->size);
				}
				if ($this->count <= $this->requested) {
					$this->requested = $this->count - 1;
				}
			}
			return $this->count;
		}

		//Формирует схему отправки
		public function getScheme($bytesData)
		{
			$this->getCount($bytesData);
			$resultData = "";
			$resultData = "count:".$this->count.";";
			$resultData = $resultData."size:".$this->size;
			return $resultData;
		}
		
	}
	class DataModelClass{
		public $command;
		public $storage;
		public $isValidation;
        public $parts;
		function __construct($dataDictionary){
			$this->parts = new partsRecordClass();
			if (array_key_exists('command', $dataDictionary) == true ){
				$this->isValidation = true;
				$this->command = $dataDictionary['command'];
			}else{
				$this->isValidation = false;
			}
			if (array_key_exists('parts', 	$dataDictionary) == true ){
				$paramsParats = $dataDictionary['parts'];
				if (array_key_exists('count', 		$paramsParats) == true ){ $this->parts->count 		= $paramsParats['count']; 		}
				if (array_key_exists('size', 		$paramsParats) == true ){ $this->parts->size 		= $paramsParats['size']; 		}
				if (array_key_exists('requested', 	$paramsParats) == true ){ $this->parts->requested 	= $paramsParats['requested']; 	}
			}
			if (array_key_exists('storage', 	$dataDictionary) == true ){
				$this->storage = $dataDictionary['storage'];
			}
			$this->parts->setDefault();
		}
	}
    class JSICConfigurationClass{
		public $JavaScriptPropertyPrefix = "";
	}
	class Convertor {
        private $JSICparams;
        private $JSICConfiguration;
        private $privatePHPPath;
        public  $isReady;
		function __construct($strJSICparams, $privatePHPPath){
			$this->privatePHPPath 		= $privatePHPPath;
            $this->JSICparams 			= $this->parseParams($strJSICparams);
			$this->JSICConfiguration 	= new JSICConfigurationClass();
            if ($this->JSICparams == NULL) {
            	$this->isReady = false;
            } else {
            	$this->isReady = true;
            }
			require_once(($this->privatePHPPath).'Purity.Strings.php');
		}
        private function parseParams($strJSICparams)
        {
            $paramsDictionary = array();
            //Извлекам из строки данные
            $pairs           = explode(';', $strJSICparams);
            if (count($pairs) > 0){
               //paramsDictionary = new Dictionary<string, string>();
                for ($index = 0, $maxIndex = count($pairs); $index < $maxIndex; $index++)
                {
                    $pair = explode(':', $pairs[$index]);
                    if (count($pair) == 2) { 
						$paramsDictionary[$pair[0]] = strval($pair[1]); 
					}
                }
                //Пытаемся получить данные
                $resultParams = new DataModelClass($paramsDictionary);
				if ($resultParams->isValidation == true) {
                    return $resultParams;
                }
            }
            return NULL;
        }
        public function getData($stringData)
        {
            if ($this->isReady == true) {
            	return $this->getDataProcessing($stringData);
            } else {
                return NULL;//JSIC Error::: Object isn't inited. 
            }
        }
        private function getDataProcessing($strData){
			$stringsTools 	= new \Purity\Strings\Tools("UTF-8");
            if ($this->isReady == true){
				if ($stringsTools->length($strData) > 0){
					$resultBase64String = base64_encode(utf8_encode($strData));
					$this->JSICparams->parts->getCount($resultBase64String);
					if ($this->JSICparams->parts->count != -1){
						switch($this->JSICparams->command){
							case "info":
								$resultBase64String = base64_encode(utf8_encode($this->JSICparams->parts->getScheme($resultBase64String)));
								return $this->coverJSICString($resultBase64String);
							break;
							case "get":
								if ($this->JSICparams->parts->count == 1){
									return $this->coverJSICString($resultBase64String);
								}else{
									$startPosition 		= $this->JSICparams->parts->requested * $this->JSICparams->parts->size;
									$endPosition 		= $startPosition + $this->JSICparams->parts->size;
									$endPosition 		= ($endPosition > $stringsTools->length($resultBase64String) ? $stringsTools->length($resultBase64String) : $endPosition);
									$resultBase64String = $stringsTools->subString($resultBase64String,$startPosition,$endPosition - $startPosition);
									return $this->coverJSICString($resultBase64String);
								}
							break;
						}
						return "JSIC Error::: unknown command";
					}
				}
				return "JSIC Error::: no data to send";
			}
			return "JSIC Error::: cannot parse request params";
        }
        //Оболочка для результрующей строки
        private function coverJSICString($resultBase64String)
        {
			$stringsTools 	= new \Purity\Strings\Tools("UTF-8");
            $countParts 	= ($this->JSICparams->command == "get" ? $this->JSICparams->parts->count : 1);
            return  $this->JSICConfiguration->JavaScriptPropertyPrefix. 
                    $this->JSICparams->storage. 
                    "={".
                    "size:".	$stringsTools->length($resultBase64String).",".
                    "count:".	strval($countParts).",".
                    "value:\"".	$resultBase64String."\",".
                    "number:".	strval($this->JSICparams->parts->requested).
                    "};";
        }
		
	
	}
}
?>