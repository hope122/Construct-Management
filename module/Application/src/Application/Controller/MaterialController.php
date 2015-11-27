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

class MaterialController extends AbstractActionController
{

	//不執行任何動作
	public function indexAction()
    {
		$this->viewContnet['pageContent'] = 'Please Select Your Action and Try Again!';
        return new ViewModel($this->viewContnet);
    }
	//取得選單
    public function ApplicationAction()
    {
        
        //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
        try{
		//-----BI開始-----  Application材料申請頁面
        
                $apurl='http://211.21.170.18:99';
//                $apurl='http://127.0.0.1:88';
                $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\material\\application.html";
                $html=$VTs->GetHtmlContent($mpath);
                $d_type_a = $VTs->json2data($VTs->UrlDataGet($apurl."/material/getdbdata?type=su_supply"));
                $str='';
                if($d_type_a==null){
                     $html=str_replace('@@opt_supply@@','',$html);
                }else{
                    foreach($d_type_a as $opData) {
                        $str.='<option value='.$opData->uid.'>'.$opData->name.'</option>';
                        }
                    $html=str_replace('@@opt_supply@@',$str,$html);
                }
                $html=str_replace('@@userName@@',$_SESSION["userName"],$html);
            
        
                $pageContent=$html;
        //-----BI結束-----
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            $VTs->WriteLog("IndexController", "indexAction", $error->getMessage());
        }
         //關閉資料庫連線
        $VTs->DBClose();
        //釋放
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
   public function getprjuidAction()
    {
        //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
		
		//-----BI開始-----  get prjuid 傳入廠商ＩＤ 回傳品項html option內容
        try{
                $apurl='http://211.21.170.18:99';
//            $apurl='http://127.0.0.1:88';
            //    $apurl='http://211.21.170.18:99';
            // $apurl='http://127.0.0.1:88';
                //取得廠商ID
            $suid=$_GET['suid'];
            //廠商id傳入ap 取得品項陣列
            $arr_prj_material = $VTs->json2data($VTs->UrlDataGet($apurl."/material/getdbdata?type=prj_materiel&suid=".$suid));
//            print_r($arr_prj_material);
      
            //陣列組成html
            $html="<option value=0>請選擇</option>";
            if(!$arr_prj_material==null){
                foreach($arr_prj_material as $prj){
                    $html.="<option value=".$prj->uid.">".$prj->name."</option>";
                }
            }
            //印出html
            $pageContent=$html;
        //-----BI結束-----
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            $VTs->WriteLog("IndexController", "indexAction", $error->getMessage());
        }
         //關閉資料庫連線
        $VTs->DBClose();
        //釋放
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
   public function getlistAction()
    {
        //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
		
		//-----BI開始-----  get prjuid 傳入廠商ＩＤ 回傳品項html option內容
        try{
                        $apurl='http://211.21.170.18:99';
//                $apurl='http://127.0.0.1:88';

            $ls_petition= $VTs->json2data($VTs->UrlDataGet($apurl."/material/getdbdata?type=el_petition"));
                if($ls_petition==null){
                    $ls='無資料';
                }else{
                    $ls_path=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\material\\list.html";
                    $tr_path=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\material\\tr.html";
                    $ls=$VTs->GetHtmlContent($ls_path);
                    $tr=$VTs->GetHtmlContent($tr_path);
                    $trstr='';
//                    print_r($ls_petition);
                    foreach($ls_petition as  $id => $lsData) {
                        $trs=$tr;
                        $trs=str_replace('@@id@@',$id+1,$trs);
                        $trs=str_replace('@@supply@@',$lsData->su_name,$trs);
                        $trs=str_replace('@@name@@',$lsData->ma_name,$trs);
                        $trs=str_replace('@@intime@@',$lsData->date,$trs);
                        $trs=str_replace('@@place@@',$lsData->place,$trs);
                        $trs=str_replace('@@count@@',$lsData->count,$trs);
                        if($lsData->check==1){
                            $str_order='已確認';
                        }else{
                            $str_order="<input type='checkbox' class='cls_order' value=".$lsData->uid.">";
                        }
                        $trs=str_replace('@@order@@',$str_order,$trs);
                        $trs=str_replace('@@uid@@',$lsData->uid,$trs);
                        $trstr.=$trs;
                    }
                    $ls=str_replace('@@tr@@',$trstr,$ls);
                    
                }
//                $html=str_replace('@@list@@',$ls,$html);
            //印出html
            $pageContent=$ls;
        //-----BI結束-----
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            $VTs->WriteLog("IndexController", "indexAction", $error->getMessage());
        }
         //關閉資料庫連線
        $VTs->DBClose();
        //釋放
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
}
