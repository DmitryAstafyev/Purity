<?php
namespace Purity\Modules {
	session_start();
		ini_set('display_errors',1);
		error_reporting(E_ALL);
		require_once('Purity.Configuration.php');
		$Configuration = new \Purity\Configuration('paths.xml');
		$Configuration = $Configuration->get();
		if (is_null($Configuration) == false){
			require_once($Configuration['paths']->privatePHP.'Purity.Modules.Resources.php');
			$PurityModules = new Controller\Controller($Configuration['paths']->PurityJS, $Configuration['paths']->privatePHP, $Configuration['urls']->PurityJS, $Configuration['urls']->protocol);
			$PurityModules->getModules();
		}else{
			echo "Purity modules::: cannot load paths file or bad file structure.";
		}
}
?>