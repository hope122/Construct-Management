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

class SARController extends AbstractActionController
{
	//不執行任何動作
	public function indexAction()
    {
		$this->viewContnet['pageContent'] = 'Please Select Your Action and Try Again!';
        return new ViewModel($this->viewContnet);
    }
	
	//人員出勤表單
	public function SARFormAction()
	{
		//session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
		
		//-----BI開始-----  
			$mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\sar\\index.html";
			$html=$VTs->GetHtmlContent($mpath);
			
			$pageContent = $html;
        //-----BI結束-----
        
		//關閉資料庫連線
        $VTs->DBClose();
        
		//釋放
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
		
        return new ViewModel($this->viewContnet);
	}


}
