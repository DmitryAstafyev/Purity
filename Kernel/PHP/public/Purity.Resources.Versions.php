<?php
namespace Purity\Resources {
	session_start();
		ini_set('display_errors',1);
		error_reporting(E_ALL);
		require_once('Purity.Configuration.php');
		$Configuration = new \Purity\Configuration('paths.xml');
		$Configuration = $Configuration->get();
		if (is_null($Configuration) == false){
			require_once($Configuration['paths']->privatePHP.'Purity.Resources.Controller.php');
			$Resources = new Controller\Controller(	$Configuration['paths']->privatePHP, 
													$Configuration['urls']->protocol, 
													$Configuration['cache']);
			$Resources->versions();
		}else{
			echo "Purity resources::: cannot load paths file or bad file structure.";
		}
}
?>