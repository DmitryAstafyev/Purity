<?php
namespace Purity\Mail{
	class logsSend{
		private $email;
		private $content;
		function __construct(){
			$this->email 			= (isset($_POST['email']) 	== true 	? $_POST['email'] 			: NULL);
			$this->content 			= (isset($_POST['content'])	== true 	? $_POST['content'] 		: NULL);
			$this->email 			= (is_null($this->email) 	== true 	? (isset($_GET['email']) 	== true ? $_GET['email'] 	: NULL) : $this->email		);
			$this->content 			= (is_null($this->content) 	== true 	? (isset($_GET['content']) 	== true ? $_GET['content'] 	: NULL) : $this->content	);
			$this->email 			= (is_null($this->email) 	== false 	? urldecode($this->email) 	: NULL);
			$this->content 			= (is_null($this->content) 	== false 	? urldecode($this->content)	: NULL);
		}
		public function send(){
			if (is_null($this->content) != true && is_null($this->email) != true){
				$to      = $this->email;
				$subject = 'Purity logs';
				$message = $this->content;
				$headers = 	'From: purity.logs.records@gmail.com' . "\r\n" .
							'Reply-To: DVAstafyev@gmail.com' . "\r\n" .
							'X-Mailer: PHP/' . phpversion();
				mail($to, $subject, $message, $headers);				
			}
		}
	}
}
?>