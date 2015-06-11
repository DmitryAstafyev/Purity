<?php
namespace Purity\Strings{
	class Tools{
		private $mb_support;
		private $mb_coding;
		function __construct($coding){
			$this->mb_support 	= function_exists('mb_strlen');
			$this->mb_coding 	= (isset($coding) == false ? "UTF-8" : $coding);
		}
		public function length($targetString){
			if (is_string($targetString) == true){
				if ($this->mb_support == true){
					return mb_strlen($targetString, $this->mb_coding);
				}else{
					return strlen($targetString);
				}
			}
		}
		public function subString($targetString, $start, $length){
			if (is_string($targetString) == true && is_int($start) == true && is_int($length) == true){
				if ($this->mb_support == true){
					return mb_substr($targetString, $start, $length, $this->mb_coding);
				}else{
					return substr($targetString, $start, $length);
				}
			}
		}
		public function replace($targetString, $replacedText, $placedText){
			if (is_string($targetString) == true && is_string($replacedText) == true && is_string($placedText) == true){
				return str_replace($replacedText, $placedText, $targetString);
			}
		}
		public function encode($sourceString){
			if (is_string($sourceString) == true){
				if ($this->mb_support == true){
					return mb_convert_encoding($sourceString, $this->mb_coding);
				}else{
					return $sourceString;
				}
			}
		}
	}
}
?>