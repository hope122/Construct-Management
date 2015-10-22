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
	//取得選單
	public function getmenuAction()
    {
        //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
		
		//-----BI開始-----
		$action = array();
		$action["status"] = false;
		//if(!empty($_SESSION["position"])){
			//取得Classroom系統權限
			$strSQL = "select uid,nid,parent_layer,class_style,href,click_action from sys_menu ";
            if($_SESSION["position"]){
                $strSQL .= "where (".$this->PositionStr2SQLCondition($_SESSION["position"]).") or (position like ('%0%')) ";
            }else{
                $strSQL .= "where (position like ('%0%')) ";
            }
			$strSQL .= "order by sequence,uid asc";
			$data = $VTs->QueryData($strSQL);
			//取得選單
			$cpPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\menu\\creatParents.html";
			$cPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\menu\\content.html";
			$oPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\menu\\otherContent.html";
			$creatParentStyle = $VTs->GetHtmlContent($cpPath);
			$contentStyle = $VTs->GetHtmlContent($cPath);
			$otherContentStyle = $VTs->GetHtmlContent($oPath);
			//$action["menu"] = $data;
			$action["menu"] = $this->CreatMenuContent($data, $creatParentStyle, $contentStyle, $otherContentStyle);
			$action["status"] = true;
		//}else{
		//	$action["msg"] = 'Please Login and Try Again!';
		//}
		$pageContent = $VTs->Data2Json($action);
		//-----BI結束-----
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
	
	//產生權限判別式
	private function PositionStr2SQLCondition($postionStr){
		$tmpArr = explode(",",$postionStr);
		$tmpSQL = '';
		foreach($tmpArr as $content){
			$tmpSQL .= "position like ('%".$content."%') or ";
		}
		$tmpSQL = substr($tmpSQL,0,strlen($tmpSQL)-3);
		return $tmpSQL;
	}
	
	//產生選單
	private function CreatMenuContent($MenuData, $creatParentStyle, $contentStyle, $otherContentStyle){
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
				$otherMenuContent = $this->CreatOtherMenuContent($content["uid"], $tmpMenuArr, $creatParentStyle, $otherContentStyle);
				$tmpMenuStr .= $this->replaceMenuOptiuonChar($tmpStyle, $content, $otherMenuContent);
			}else{
				$tmpStyle = $contentStyle;
				$tmpMenuStr .= $this->replaceMenuOptiuonChar($tmpStyle, $content);
			}
			
		}
		
		return $tmpMenuStr;
	}
	
	//產生其他子層的選單選單
	private function CreatOtherMenuContent($otherLayerDataIndex, $totalMenuData, $creatParentStyle, $otherContentStyle){
		$tmpMenuStr = '';
		foreach($totalMenuData[$otherLayerDataIndex] as $content){
			
			//這代表還有第二層
			if(!empty($totalMenuData[$content["uid"]])){
				$tmpStyle = $creatParentStyle;
				//重複建好
				$otherMenuContent = $this->CreatOtherMenuContent($content["uid"], $totalMenuData, $creatParentStyle, $otherContentStyle);
				$tmpMenuStr .= $this->replaceMenuOptiuonChar($tmpStyle, $content, $otherMenuContent);
			}else{
				$tmpStyle = $otherContentStyle;
				$tmpMenuStr .= $this->replaceMenuOptiuonChar($tmpStyle, $content);
			}
			
		}
		
		return $tmpMenuStr;
		
	}
	//取代選單的字
	private function replaceMenuOptiuonChar($tmpStyle, $content, $otherMenuContent=''){
		
		$tmpStyle = str_replace("@@nid@@",$content["nid"],$tmpStyle);
		$tmpStyle = str_replace("@@href@@",$content["href"],$tmpStyle);
		
		if($content["click_action"] != ''){
			$tmpStyle = str_replace("@@onclick@@",'onclick = "'.$content["click_action"].'"',$tmpStyle);
		}else{
			$tmpStyle = str_replace("@@onclick@@",'',$tmpStyle);
		}
		
		if($otherMenuContent){
			$tmpStyle = str_replace("@@sonContent@@",$otherMenuContent,$tmpStyle);
		}
		
		if($content["class_style"]){
			$tmpStyle = str_replace("@@class@@",$content["class_style"],$tmpStyle);
		}else{
			$tmpStyle = str_replace("@@class@@","",$tmpStyle);
		}
		
		return $tmpStyle;
	}
	
}
