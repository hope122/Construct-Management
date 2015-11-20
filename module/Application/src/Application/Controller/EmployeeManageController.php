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
					$editPagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\employeemanage\\newPage.html";
					$editPage = $VTs->GetHtmlContent($editPagePath);
					
					$basicInfoPagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\employeemanage\\basicInfo.html";
					$basicInfoPage = $VTs->GetHtmlContent($basicInfoPagePath);
					
					$addressPagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\employeemanage\\address.html";
					$addressPage = $VTs->GetHtmlContent($addressPagePath);
					
					$communicationPagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\employeemanage\\communication.html";
					$communicationPage = $VTs->GetHtmlContent($communicationPagePath);
					
					$dataArr = ["userName"=>$_SESSION["userName"], "basicInfo"=>$basicInfoPage,
								"address"=>$addressPage, "communication"=>$communicationPage];
					$editPage = $VTs->ContentReplace($dataArr,$editPage);					
							
					//$apurl = "http://211.21.170.18:99";
					$apurl = "http://127.0.0.1:99";
					$action = $_POST["action"];
					//echo $action;
					switch($action){
						case "insertData":
							$optionData = $VTs->json2data($VTs->UrlDAtaGet($apurl."/employeemanage/getdata?type=relationOption"));
							//$VTs->debug($option);
							$selectElement = "<select><option value='0'>-請選擇-</option>";
							foreach($optionData->dataList as $data){
								$optionElement = "<option value='".$data->uid."'>".$data->relation."</option>";
								$selectElement .= $optionElement;
							}
							$selectElement .= "</select>";
							
							$dataArr = ["name"=>"", "sid"=>"", "birthday"=>"", "zip"=>"", "city"=>"", "area"=>"",
										"vil"=>"", "verge"=>"", "road"=>"", "addr"=>"", "belong"=>"",
										"relation"=>$selectElement, "relation1"=>"", "mobile"=>"", "tel_h"=>"",
										"tel_o"=>"", "tel_ext"=>"", "email"=>"", "action"=>$action];
							$editPage = $VTs->ContentReplace($dataArr,$editPage);

							$pageContent = $editPage;
							break;
						case "updateData":
							$uid = $_POST["uid"];
							//echo "uid: ".$uid;
							
							$arr = $VTs->json2data($VTs->UrlDataGet($apurl."/employeemanage/getdata?uid=".$uid.""));
							if( $arr->status ){
								//$VTs->debug($arr);
								$optionData = $VTs->json2data($VTs->UrlDAtaGet($apurl."/employeemanage/getdata?type=relationOption"));
								$selectElement = "<select><option value='0'>-請選擇-</option>";
								foreach($optionData->dataList as $data){
									if( $arr->dataList[0]->relation == $data->relation ){
										$optionElement = "<option value='".$data->uid."' selected>".$data->relation."</option>";
									}else{
										$optionElement = "<option value='".$data->uid."'>".$data->relation."</option>";
									}
									
									$selectElement .= $optionElement;
								}
								$selectElement .= "</select>";
								
								$basicDataArr = ["name"=>$arr->dataList[0]->name,
												 "sid"=>$arr->dataList[0]->sid,
												 "birthday"=>$arr->dataList[0]->birthday];
								$editPage = $VTs->ContentReplace($basicDataArr,$editPage);
								
								$addressDataArr = ["zip"=>$arr->dataList[0]->zip, 
												   "city"=>$arr->dataList[0]->city,
												   "area"=>$arr->dataList[0]->area,
												   "vil"=>$arr->dataList[0]->vil, 
												   "verge"=>$arr->dataList[0]->verge, 
												   "road"=>$arr->dataList[0]->road, 
											       "addr"=>$arr->dataList[0]->addr];
								$editPage = $VTs->ContentReplace($addressDataArr,$editPage);
								
								$communicatonDataArr = ["belong"=>$arr->dataList[0]->belong,
														"relation"=>$selectElement,
														"relation1"=>$arr->dataList[0]->relation1, 
														"mobile"=>$arr->dataList[0]->mobile, 
														"tel_h"=>$arr->dataList[0]->tel_h,
														"tel_o"=>$arr->dataList[0]->tel_o, 
														"tel_ext"=>$arr->dataList[0]->tel_ext,
														"email"=>$arr->dataList[0]->email, "action"=>$action];
								$editPage = $VTs->ContentReplace($communicatonDataArr,$editPage);

								
								$pageContent = $editPage;
							}else{
								$pageContent = "Query has error!";
							}
							
							
							break;
						default:
							$pageContent = "EditPage action has error!";
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
