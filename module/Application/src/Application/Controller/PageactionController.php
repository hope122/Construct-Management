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

class PageactionController extends AbstractActionController
{
	//不執行任何動作
	public function indexAction()
    {
		$this->viewContnet['pageContent'] = 'Please Select Your Action and Try Again!';
        return new ViewModel($this->viewContnet);
    }
	//取得樣式選單
	public function menuprocessAction()
    {
		$VTs = new clsSystem;
		$VTs->initialization();
		try{
		//-----BI開始-----
			$action = array();
			$action["status"] = false;
	        //$action["debug"] = $_POST;
			if(!empty($_POST["menu"])){
				//取得Classroom系統權限
	            
				$data = $_POST["menu"];
				//set Options
				if(!empty($_POST["optionData"])){
					$forOptionsData = true;
				}else{
					$forOptionsData = false;
				}
				if(!$forOptionsData){
					//取得選單
					$cpPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\menu\\creatParents.html";
					$cPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\menu\\content.html";
					$oPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\menu\\otherContent.html";
	            }else{
					//取得選單
					$cpPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\setMenuOption\\creatParents.html";
					$cPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\setMenuOption\\content.html";
					$oPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\setMenuOption\\otherContent.html";

	            }
				$creatParentStyle = $VTs->GetHtmlContent($cpPath);
				$contentStyle = $VTs->GetHtmlContent($cPath);
				$otherContentStyle = $VTs->GetHtmlContent($oPath);
	            
				//$action["menu"] = $data;
				$action["menu"] = $this->CreatMenuContent($VTs,$data, $creatParentStyle, $contentStyle, $otherContentStyle);
	            //$action["menu"] = $_POST;
				$action["status"] = true;
			}else{
				$action["msg"] = 'Menu Array Error!';
			}
			$pageContent = $VTs->Data2Json($action);
		//-----BI結束-----
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("PageactionController", "menuprocessAction", $error->getMessage());
		}
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
    
    //取得帳號權限
    public function acpositionAction(){
        $VTs = new clsSystem;
        $VTs->initialization();
        try{
        //-----BI開始-----
	        $action = array();
	        $action["status"] = true;
	        if(!empty($_SESSION["position"])){
	            $action["position"] = $_SESSION["position"];
	        }else{
	            $action["position"] = 0;
	        }
	        $pageContent = $VTs->Data2Json($action);
        //-----BI結束-----
	    }catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("PageactionController", "acpositionAction", $error->getMessage());
		}
        $VTs = null;
        $this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);

    }
    
    //取得帳號資訊(須登入後才可以使用)
    public function acinfoAction(){
        $VTs = new clsSystem;
        $VTs->initialization();
        try{
        //-----BI開始-----
	        $action = array();
	        $action["status"] = false;
	        if(!empty($_SESSION["uuid"]) and !empty($_SESSION["userName"])){
	            $action["uuid"] = $_SESSION["uuid"];
	            $action["userName"] = $_SESSION["userName"];
	            $action["status"] = true;
	        }else{
	            $action["msg"] = 'Please Login Again!';
	        }
	        $pageContent = $VTs->Data2Json($action);
        //-----BI結束-----
	    }catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("PageactionController", "acinfoAction", $error->getMessage());
		}
        $VTs = null;
        $this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
        
    }
	
	//產生選單
	private function CreatMenuContent($VTs, $MenuData, $creatParentStyle, $contentStyle, $otherContentStyle){
		try{
			$tmpMenuStr = '';
			$tmpMenuArr = array();
			//先整理
			foreach($MenuData as $content){
				$tmpMenuArr[$content["parent_layer"]][$content["uid"]] = $content;
			}
			
			//放好第一層級的資料
			foreach($tmpMenuArr[0] as $content){
				
				//這代表還有第二層
				if(!empty($tmpMenuArr[$content["uid"]])){
					$tmpStyle = $creatParentStyle;
					$otherMenuContent = $this->CreatOtherMenuContent($VTs, $content["uid"], $tmpMenuArr, $creatParentStyle, $otherContentStyle);
					$tmpMenuStr .= $this->replaceMenuOptiuonChar($VTs, $tmpStyle, $content, $otherMenuContent);
				}else{
					$tmpStyle = $contentStyle;
					$tmpMenuStr .= $this->replaceMenuOptiuonChar($VTs, $tmpStyle, $content);
				}
				
			}
			
			return $tmpMenuStr;
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("PageactionController", "CreatMenuContent", $error->getMessage());
		}
	}
	
	//產生其他子層的選單選單
	private function CreatOtherMenuContent($VTs, $otherLayerDataIndex, $totalMenuData, $creatParentStyle, $otherContentStyle){
		try{
			$tmpMenuStr = '';
			foreach($totalMenuData[$otherLayerDataIndex] as $content){
				
				//這代表還有第二層
				if(!empty($totalMenuData[$content["uid"]])){
					$tmpStyle = $creatParentStyle;
					//重複建好
					$otherMenuContent = $this->CreatOtherMenuContent($VTs, $content["uid"], $totalMenuData, $creatParentStyle, $otherContentStyle);
					$tmpMenuStr .= $this->replaceMenuOptiuonChar($VTs, $tmpStyle, $content, $otherMenuContent);
				}else{
					$tmpStyle = $otherContentStyle;
					$tmpMenuStr .= $this->replaceMenuOptiuonChar($VTs, $tmpStyle, $content);
				}
				
			}
			
			return $tmpMenuStr;
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("PageactionController", "CreatOtherMenuContent", $error->getMessage());
		}
	}
	//取代選單的字
	private function replaceMenuOptiuonChar($VTs, $tmpStyle, $content, $otherMenuContent=''){
		try{
			$processData = [
				"nid"=>$content["nid"],
				"href"=>$content["href"]
			];
			
			$click_action = ($content["click_action"] != '')?$content["click_action"]:'';
			$processData["onclick"] = $click_action;
			
			if($otherMenuContent){
				$processData["sonContent"] = $otherMenuContent;
			}
			
			$class_style = ($content["class_style"])?$content["class_style"]:'';
			$processData["class"] = $class_style;

			$tmpStyle = $VTs->ContentReplace($processData,$tmpStyle);
			return $tmpStyle;
		}catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("PageactionController", "CreatOtherMenuContent", $error->getMessage());
		}
	}

	public function getlogoAction(){
		$VTs = new clsSystem;
        $VTs->initialization();
        try{
        //-----BI開始-----
	        $action = array();
	        $action["status"] = false;
	        if(!empty($_SESSION["uuid"]) and !empty($_SESSION["userName"])){
	        	$logoPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\logo\\logoContent.html";
				$logoStyle = $VTs->GetHtmlContent($logoPath);
				
	            $action["logoString"] = $logoStyle;
	            $action["status"] = true;
	        }else{
	            $action["msg"] = 'Please Login Again!';
	        }
	        $pageContent = $VTs->Data2Json($action);
        //-----BI結束-----
	    }catch(Exception $error){
			//依據Controller, Action補上對應位置, $error->getMessage()為固定部份
			$VTs->WriteLog("PageactionController", "acinfoAction", $error->getMessage());
		}
        $VTs = null;
        $this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
	}
	
}
