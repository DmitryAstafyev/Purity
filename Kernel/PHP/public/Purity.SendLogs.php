<?php
namespace Purity\Modules {
	session_start();
		ini_set('display_errors',1);
		error_reporting(E_ALL);
		require_once('Purity.Configuration.php');
		$Configuration = new \Purity\Configuration('paths.xml');
		$Configuration = $Configuration->get();
		if (is_null($Configuration) == false){
			require_once($Configuration['paths']->privatePHP.'Purity.Mail.php');
			$Mails = new \Purity\Mail\logsSend();
			$Mails->send();
			echo "send";
		}else{
			echo "Purity::: cannot load paths file or bad file structure.";
		}
}
?>