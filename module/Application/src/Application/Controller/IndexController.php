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

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
		$VTs = new clsSystem;
		$VTs->initialization();
		
		//-----BI開始-----
		//$HeadTitle = $this->getServiceLocator()->get('ViewHelperManager')->get('HeadTitle');
        //$VTs->debug($_SESSION);
		if(empty($_SESSION)){
            $pagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\index\\login_page.html";
            $pageContent = $VTs->GetHtmlContent($pagePath);
		}else{
			$pagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\index\\after_login.html";
			$pageContent = $VTs->GetHtmlContent($pagePath);
			$pageContent = str_replace("@@userName@@",$_SESSION["userName"],$pageContent);
			//$pageContent = $VTs->CreateInsertOptionBtn('test','test/tw'). $VTs->CreateModifyOptionBtn(["uid"=>1], 'test/tw', 'inputClass', 'contentClass') . $VTs->CreateDeleteOptionBtn(["uid"=>1], 'test/tw', 'rowID') . $VTs->CreateFinishOptionBtn(["uid"=>1], 'test/tw', 'inputClass', 'contentClass') . $pageContent;
		}
		//----BI結束----
		
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
}
