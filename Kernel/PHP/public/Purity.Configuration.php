<?php
namespace Purity {
	class Configuration{
		private $pathsFileName;
		function __construct($pathsFileName)
		{
			$this->pathsFileName = (is_string($pathsFileName) == true ? $pathsFileName : NULL);
		}
		private function readPaths(){
			if (file_exists($this->pathsFileName) == true){
				$paths = simplexml_load_file($this->pathsFileName);
				if (isset($paths->paths) == true){
					$paths = $paths->paths;
					if (isset($paths->privatePHP) == true && isset($paths->PurityJS) == true){
						$addDOCUMENT_ROOT = (isset($paths->addDOCUMENT_ROOT) == true ? $paths->addDOCUMENT_ROOT : 'yes');
						if ($addDOCUMENT_ROOT == 'yes'){
							$paths->privatePHP 	= $_SERVER['DOCUMENT_ROOT'].($paths->privatePHP);
							$paths->PurityJS 	= $_SERVER['DOCUMENT_ROOT'].($paths->PurityJS);
						}
						return $paths;
					}
				}
			}
			return NULL;
		}
		private function readURLs(){
			if (file_exists($this->pathsFileName) == true){
				$urls = simplexml_load_file($this->pathsFileName);
				if (isset($urls->urls) == true){
					$urls = $urls->urls;
					if (isset($urls->PurityJS) == true && isset($urls->protocol) == true){
						return $urls;
					}
				}
			}
			return NULL;
		}
		private function readCache(){
			if (file_exists($this->pathsFileName) == true){
				$cache = simplexml_load_file($this->pathsFileName);
				if (isset($cache->cache) == true){
					$cache = $cache->cache;
					return (isset($cache->resources_versions) == true ? $cache->resources_versions : 'versions.cache');
				}
			}
			return NULL;
		}
		public function get(){
			if (is_null($this->pathsFileName) == false){ 
				$resultData = array();
				$resultData['paths'] 	= $this->readPaths();
				$resultData['urls'] 	= $this->readURLs();
				$resultData['cache'] 	= $this->readCache();
				return $resultData;
			}
			return NULL;
		}
	}
}
?>