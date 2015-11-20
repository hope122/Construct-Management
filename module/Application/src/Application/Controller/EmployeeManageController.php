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
					$html = str_replace("@@content@@", $trs, $html);
				}else{
					$html = str_replace("@@content@@", $arr->msg, $html);
				}
				
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
	
	public function editPageAction(){
		$VTs = new clsSystem;
		$VTs->initialization();
		try{
			//-----BI開始-----
			if(empty($_SESSION)){
	            $pagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\index\\login_page.html";
	            $pageContent = $VTs->GetHtmlContent($pagePath);
			}else{
				if(!empty($_POST)){
					$action = $_POST["action"];
					//echo $action;
					switch($action){
						case "insertData":
							$newPagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\employeemanage\\newPage.html";
							$newPage = $VTs->GetHtmlContent($newPagePath);
							$newPage = str_replace("@@userName@@",$_SESSION["userName"],$newPage);
							
							$newPage = str_replace("@@name@@","",$newPage);
							$newPage = str_replace("@@sid@@","",$newPage);
							$newPage = str_replace("@@birthday@@","",$newPage);
							$newPage = str_replace("@@zip@@","",$newPage);
							$newPage = str_replace("@@city@@","",$newPage);
							$newPage = str_replace("@@area@@","",$newPage);
							$newPage = str_replace("@@vil@@","",$newPage);
							$newPage = str_replace("@@verge@@","",$newPage);
							$newPage = str_replace("@@road@@","",$newPage);
							$newPage = str_replace("@@addr@@","",$newPage);
							$newPage = str_replace("@@mobile@@","",$newPage);
							$newPage = str_replace("@@tel_h@@","",$newPage);
							$newPage = str_replace("@@email@@","",$newPage);
							$newPage = str_replace("@@action@@",$action,$newPage);
							
							$pageContent = $newPage;
							break;
						case "updateData":
							$uid = $_POST["uid"];
							//echo "uid: ".$uid;
							
							//$apurl = "http://211.21.170.18:99";
							$apurl = "http://127.0.0.1:99";
							$arr = $VTs->json2data($VTs->UrlDataGet($apurl."/employeemanage/getdata?uid=".$uid.""));
							if( $arr->status ){
								$editPagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\employeemanage\\newPage.html";
								$editPage = $VTs->GetHtmlContent($editPagePath);
								$editPage = str_replace("@@userName@@",$_SESSION["userName"],$editPage);
								
								$editPage = str_replace("@@name@@", $arr->dataList[0]->name, $editPage);
								$editPage = str_replace("@@sid@@", $arr->dataList[0]->sid, $editPage);
								$editPage = str_replace("@@birthday@@", $arr->dataList[0]->birthday, $editPage);
								$editPage = str_replace("@@zip@@", $arr->dataList[0]->zip, $editPage);
								$editPage = str_replace("@@city@@", $arr->dataList[0]->city, $editPage);
								$editPage = str_replace("@@area@@", $arr->dataList[0]->area, $editPage);
								$editPage = str_replace("@@vil@@", $arr->dataList[0]->vil, $editPage);
								$editPage = str_replace("@@verge@@", $arr->dataList[0]->verge, $editPage);
								$editPage = str_replace("@@road@@", $arr->dataList[0]->road, $editPage);
								$editPage = str_replace("@@addr@@", $arr->dataList[0]->addr, $editPage);
								$editPage = str_replace("@@mobile@@", $arr->dataList[0]->mobile, $editPage);
								$editPage = str_replace("@@tel_h@@", $arr->dataList[0]->tel_h, $editPage);
								$editPage = str_replace("@@email@@", $arr->dataList[0]->email, $editPage);
								$editPage = str_replace("@@action@@",$action,$editPage);
								
								$pageContent = $editPage;
							}else{
								$pageContent = "Error.";
							}
							
							
							break;
						default:
							$pageContent = "There has errors";
					}
				}
				
			}
			//----BI結束----
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("EmployeemanageController", "editPageAction", $error->getMessage());
		}
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
	}
}
