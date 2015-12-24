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
				$indexPath = $pathString . "\\engineeringManage\\index.html";
				$index = $VTs->GetHtmlContent($indexPath);

				$dataArr = [ "userName"=>$_SESSION["userName"] ];
				$index = $VTs->ContentReplace($dataArr, $index);

				$pageContent = $index;
			}
			//----BI結束----
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("EngineeringmanageController", "indexAction", $error->getMessage());
		}
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }

    public function setViewAction()
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
				$sType = isset($_POST["type"]) ? $_POST["type"] : "";
				$pageContent = getPageContent($sType, $pathString);
			}
			//----BI結束----
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("EngineeringmanageController", "setView", $error->getMessage());
		}
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
}

function getPageContent($sType, $pathString)
{
	$VTs = new clsSystem;
	$VTs->initialization();

	if($sType!=null || $sType!=""){
		switch($sType){
			case "engineering":
				$contentPath = $pathString . "\\engineeringManage\\engineering.html";
				$pageContent = $VTs->GetHtmlContent($contentPath);
				break;
			case "space":
				$contentPath = $pathString . "\\engineeringManage\\space.html";
				$pageContent = $VTs->GetHtmlContent($contentPath);
				break;
			default:
		}
	}

	$VTs = null;
	
	return $pageContent;
}