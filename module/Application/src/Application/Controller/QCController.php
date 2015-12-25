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

class QCController extends AbstractActionController
{



    //qc 照片列表主頁
    public function photolistAction()
    {
        $VTs = new clsSystem;
        $VTs->initialization();
      try{
        //-----BI開始-----  
        if(empty($_SESSION)){
            $pagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\index\\login_page.html";
            $pageContent = $VTs->GetHtmlContent($pagePath);
        }else{  
            //取得html
            $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\photolist.html";
            $html=$VTs->GetHtmlContent($mpath);
            $arrdata["userName"]=$_SESSION['userName'];
            $html=$VTs->ContentReplace($arrdata,$html);
            $pageContent=$html;
        }
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

    //qc照片列表取得內容
	   public function getphotolisthtmlAction()
    {
		$VTs = new clsSystem;
		$VTs->initialization();
      try{
		//-----BI開始-----  index QC審查首頁
        //取得html
        // $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\photolist.html";
        $trpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\phototr.html";
        // $html=$VTs->GetHtmlContent($mpath);
        $trhtml=$VTs->GetHtmlContent($trpath);
        //取得qc列表
        $data = $_POST["data"];
        $arr_list=$data["checklist"];
        $apurl=$_POST["apurl"];
        //解析列表
        $htmlstr="";
        $i=0;
        if(!empty($arr_list)){
        foreach($arr_list as $list) {
             // echo $i++;
            //判斷有imgid(照片id)才顯示  
            if(!empty($list['imgid'])){
                $trs=$trhtml;
                $arrin = array(
                "qcid" => $list['uid'],
            );

                $imginfo = $VTs->json2data($VTs->UrlDataPost($apurl."/pageaction/getqcimglist",$arrin));
                // print_r($imginfo);
                // exit;
                if($imginfo->status){
                    $trs=str_replace('@@chkdate@@',$list['datec'],$trs);
                     $trs=str_replace('@@d64@@',$imginfo->imgs->img0,$trs);
                    $info = $VTs->json2data($VTs->UrlDataGet($apurl."/qc/getdbdata?type=photoinfo&uid=".$list['dataid']));
                    $trs=str_replace('@@remark@@',$list['remark'],$trs);
                    $trs=str_replace('@@uid@@',$info->uid,$trs);
                    $trs=str_replace('@@materialname@@',$info->ma_name,$trs);
                    $trs=str_replace('@@count@@',$info->count,$trs);
                    $trs=str_replace('@@place@@',$info->place,$trs);
                    $htmlstr.=$trs;
                }
            }
   
       }
       if($htmlstr==''){
            $htmlstr='無資料';
       }
   }
      $pageContent=$htmlstr;
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



    //qc 照片列表主頁
    public function cphotolistAction()
    {
        $VTs = new clsSystem;
        $VTs->initialization();
      try{
        //-----BI開始-----  
        if(empty($_SESSION)){
            $pagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\index\\login_page.html";
            $pageContent = $VTs->GetHtmlContent($pagePath);
        }else{  
            //取得html
            $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\cphotolist.html";
            $html=$VTs->GetHtmlContent($mpath);
            $arrdata["userName"]=$_SESSION['userName'];
            $html=$VTs->ContentReplace($arrdata,$html);
            $pageContent=$html;
        }
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

    //qc照片列表取得內容
       public function getcphotolisthtmlAction()
    {
        $VTs = new clsSystem;
        $VTs->initialization();
      try{
        //-----BI開始-----  index QC審查首頁
        //取得html
        // $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\photolist.html";
        $trpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\cphototr.html";
        // $html=$VTs->GetHtmlContent($mpath);
        $trhtml=$VTs->GetHtmlContent($trpath);
        //取得qc列表
        $data = $_POST["data"];
        $arr_list=$data["checklist"];
        $apurl=$_POST["apurl"];
        //解析列表
        $htmlstr="";
        $i=0;
        if(!empty($arr_list)){
        foreach($arr_list as $list) {
             // echo $i++;
            //判斷有imgid(照片id)才顯示  
            if(!empty($list['imgid'])){
                $trs=$trhtml;
                $arrin = array(
                "qcid" => $list['uid'],
            );

                $imginfo = $VTs->json2data($VTs->UrlDataPost($apurl."/pageaction/getqcimglist",$arrin));
                // print_r($imginfo);
                // exit;
                if($imginfo->status){
                    $trs=str_replace('@@chkdate@@',$list['datec'],$trs);
                     $trs=str_replace('@@d64@@',$imginfo->imgs->img0,$trs);
                    $info = $VTs->json2data($VTs->UrlDataGet($apurl."/qc/getdbdata?type=cphotoinfo&uid=".$list['dataid']));
                    $trs=str_replace('@@remark@@',$list['remark'],$trs);
                    $trs=str_replace('@@uid@@',$info->uid,$trs);
                    $trs=str_replace('@@fl@@',$info->fl,$trs);
                    $trs=str_replace('@@typec@@',$info->typec,$trs);
                    $trs=str_replace('@@model@@',$info->model,$trs);
                    $trs=str_replace('@@area@@',$info->area,$trs);
                    $trs=str_replace('@@typed@@',$info->typed,$trs);
                    $htmlstr.=$trs;
                }
            }
   
       }
       if($htmlstr==''){
            $htmlstr='無資料';
       }
   }
      $pageContent=$htmlstr;
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
