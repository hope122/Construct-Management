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
				//登入者
				$dataArr = ["userName"=>$_SESSION["userName"]];
				$index = $VTs->ContentReplace($dataArr,$index);
				
				//畫面
				$editorPath = $pathString . "\\engineeringManage\\editor.html";
				$editor = $VTs->GetHtmlContent($editorPath);
				
				$dataArr = ["edit_area"=>$editor];
				$index = $VTs->ContentReplace($dataArr,$index);
				
				$pageContent = $index;
				
				// $strSQL = "SELECT * FROM el_type_unit";
	// $data = $VTs->QueryData($strSQL);
	// if(empty($data)){
		// $data = null;
	// }
	// $VTs->debug($data);
	// $pageContent = "";
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