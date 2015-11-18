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

class EmployeemanageController extends AbstractActionController
{
	public function indexAction()
    {
		$VTs = new clsSystem;
		$VTs->initialization();
		try{
			//-----BI開始-----
			if(empty($_SESSION)){
	            $pagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\index\\login_page.html";
	            $pageContent = $VTs->GetHtmlContent($pagePath);
			}else{
				//$apurl = "http://211.21.170.18:99";
				$apurl = "http://127.0.0.1:99";
				
				$indexPage = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\employeemanage\\index.html";
				$html = $VTs->GetHtmlContent($indexPage);
				$html = str_replace("@@userName@@",$_SESSION["userName"],$html);
				
				$arr = $VTs->json2data($VTs->UrlDataGet($apurl."/employeemanage/getdata"));
				//$VTs->debug($arr);
				
				$listPage = "";
				$trs = "";
				if($arr->status){
					foreach($arr->dataList as $data){
						$listPage = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\employeemanage\\list.html";
						$tr = $VTs->GetHtmlContent($listPage);
						$tr = str_replace("@@name@@", $data->name, $tr);
						$tr = str_replace("@@ID@@", $data->sid, $tr);
						$tr = str_replace("@@sex@@", $data->sex, $tr);
						$tr = str_replace("@@birthday@@", $data->birthday, $tr);
						
						//地址：郵遞區號/縣市/鄉鎮區市/村里/鄰/路/巷弄號
						$address = $data->zip . $data->city . $data->area . $data->vil . $data->verge . $data->road . $data->addr;
						$tr = str_replace("@@address@@", $address, $tr);
							
						$tr = str_replace("@@mobile@@", $data->mobile, $tr);
						$tr = str_replace("@@telphone@@", $data->tel_h, $tr);
						$tr = str_replace("@@email@@", $data->email, $tr);
						
						$tr = str_replace("@@uid@@", $data->uid, $tr);
						
						$trs .= $tr;
					}
				}else{
					echo "No data";
				}
				
				
				$html = str_replace("@@content@@", $trs, $html);
				
				$pageContent = $html;
			}
			//----BI結束----
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("EmployeemanageController", "newPageAction", $error->getMessage());
		}
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
}
