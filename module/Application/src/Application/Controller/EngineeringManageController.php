<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use System_APService\clsSystem;

class EngineeringmanageController extends AbstractActionController
{
    public function indexAction()
    {
		$VTs = new clsSystem;
		$VTs->initialization();
		try{
			//-----BI開始-----
			$pathString = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting";
			if(empty($_SESSION)){
	            $pagePath = $pathString . "\\index\\login_page.html";
	            $pageContent = $VTs->GetHtmlContent($pagePath);
			}else{
				$pagePath = $pathString . "\\index\\after_login.html";
				$pageContent = $VTs->GetHtmlContent($pagePath);
				//一個索引與內容等同一個 >> str_replace("@@userName@@",$_SESSION["userName"],$pageContent);
				$dataArr = ["userName"=>$_SESSION["userName"]];
				//內容取代
				$pageContent = $VTs->ContentReplace($dataArr,$pageContent);				
				$pageContent = "";
				
				//test start-------------------------
						//取得目前最後編碼
						$strSQL = "SELECT code FROM ".$_POST["table"]." ORDER BY code DESC LIMIT 1";
						$data = $VTs->QueryData($strSQL);
						
						//將編碼+1	#編碼規則: AA 兩碼
						// $lastCode = chr(ord(substr($data[0]["code"],1,1))+1);
						// $code = substr($data[0]["code"],0,1).$lastCode;
						
						$code = codeAddOne($data[0]["code"], "two");
						echo $code;
				//test End---------------------------
			}
			//----BI結束----
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("IndexController", "indexAction", $error->getMessage());
		}
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
}

function codeAddOne($OriCode, $digits)
{
	$code = "";
	
	switch($digits){
		case "one":
			$code = chr(ord($data[0]["code"])+1);
			break;
		case "two":
			$lastCode = chr(ord(substr($OriCode,1,1))+1);
			$code = substr($OriCode,0,1).$lastCode;
			break;
		case "four":
		
			break;
		case "six":
		
			break;
		default:
	}
	
	return $code;
}