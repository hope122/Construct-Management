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
	//不執行任何動作
	public function indexAction()
    {
		 //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
        try{
		//-----BI開始-----  index QC審查首頁
        //    $apurl='http://211.21.170.18:99';
        $apurl='http://127.0.0.1:88';
        $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\index.html";
        $trpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\tr.html";
        $html=$VTs->GetHtmlContent($mpath);
        $tr=$VTs->GetHtmlContent($trpath);
 
        $arr_data = $VTs->json2data($VTs->UrlDataGet($apurl."/qc/getdbdata"));
        
//        print_r($arr_data);
        $str='';
        foreach($arr_data as $index=>$data) {
            $trs=$tr;
            $trs=str_replace('@@id@@',$index+1,$trs);
            $trs=str_replace('@@chkdata@@',$data->typename,$trs);
            $trs=str_replace('@@date@@',$data->date,$trs);
            $trs=str_replace('@@datec@@',$data->datec,$trs);
            $trs=str_replace('@@isok@@',$data->isok,$trs);
            $trs=str_replace('@@img@@',$data->imgid,$trs);
            $trs=str_replace('@@remark@@',$data->remark,$trs);
            $str.=$trs;
        }
        $html=str_replace('@@tr@@',$str,$html);
        

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
	public function photolistAction()
    {
		 //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
      try{
		//-----BI開始-----  index QC審查首頁
           // $apurl='http://211.21.170.18:99';
        $apurl='http://127.0.0.1:88';
        //取得html
        $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\photolist.html";
        $trpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\phototr.html";
        $html=$VTs->GetHtmlContent($mpath);
        $trhtml=$VTs->GetHtmlContent($trpath);
        //取得qc列表
        $arr_list = $VTs->json2data($VTs->UrlDataGet($apurl."/qc/getdbdata?type=qc_checklist"));
        //解析列表
        $htmlstr="";
        foreach($arr_list as $data) {
            // echo($data->imgid);
            //判斷有imgid(照片id)才顯示  
            if(!empty($data->imgid)){
                $trs=$trhtml;
                $arrin = array(
                "qcid" => $data->uid,
            );
                // print_r($arrin);
                $imginfo = $VTs->json2data($VTs->UrlDataPost("http://211.21.170.18:99/pageaction/getqcimglist",$arrin));
                $trs=str_replace('@@d64@@',$imginfo->imgs->img0,$trs);
                $info = $VTs->json2data($VTs->UrlDataGet($apurl."/material/getdbdata?type=el_petition&uid=".$data->dataid));
                $trs=str_replace('@@materialname@@',$info[0]->ma_name,$trs);
                $trs=str_replace('@@count@@',$info[0]->count,$trs);
                $trs=str_replace('@@place@@',$info[0]->place,$trs);
                $htmlstr.=$trs;
            }
   
       }
       $title = $VTs->json2data($VTs->UrlDataGet($apurl."/qc/getdbdata?type=title"));
       $html=str_replace('@@title@@',$title[0]->name,$html);
       $html=str_replace('@@tr@@',$htmlstr,$html);
        

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

}
