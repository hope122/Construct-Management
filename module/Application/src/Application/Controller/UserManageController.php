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

class UsermanageController extends AbstractActionController
{
	public function indexAction()
    {
		$this->viewContnet['pageContent'] = 'Please Select Your Action and Try Again!';
        return new ViewModel($this->viewContnet);
    }
	
    public function newPageAction()
    {
		$VTs = new clsSystem;
		$VTs->initialization();
		try{
			//-----BI開始-----
			if(empty($_SESSION)){
	            $pagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\index\\login_page.html";
	            $pageContent = $VTs->GetHtmlContent($pagePath);
			}else{
				$indexPage = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\usermanage\\newIndex.html";
				$html = $VTs->GetHtmlContent($indexPage);
				$html = str_replace("@@userName@@",$_SESSION["userName"],$html);
				$listPage = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\usermanage\\userList.html";
				$userList = $VTs->GetHtmlContent($listPage);
				$html = str_replace("@@content@@", $userList, $html);
				
				$pageContent = $html;
			}
			//----BI結束----
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("UsermanageController", "newPageAction", $error->getMessage());
		}
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
}
