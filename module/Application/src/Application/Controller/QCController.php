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
		
		//-----BI開始-----  index QC審查首頁
        //    $apurl='http://211.21.170.18:99';
        $apurl='http://127.0.0.1:88';
        $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\qc\\photolist.html";
//        $trpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\styles\\qc\\tr.html";
        $html=$VTs->GetHtmlContent($mpath);
//        $tr=$VTs->GetHtmlContent($trpath);
 
//        $arr_data = $VTs->json2data($VTs->UrlDataGet($apurl."/qc/getdbdata"));
        
//        print_r($arr_data);
//        $str='';
//        foreach($arr_data as $index=>$data) {
//            $trs=$tr;
//            $trs=str_replace('@@id@@',$index+1,$trs);
//            $trs=str_replace('@@chkdata@@',$data->typename,$trs);
//            $trs=str_replace('@@date@@',$data->date,$trs);
//            $trs=str_replace('@@datec@@',$data->datec,$trs);
//            $trs=str_replace('@@isok@@',$data->isok,$trs);
//            $trs=str_replace('@@img@@',$data->imgid,$trs);
//            $trs=str_replace('@@remark@@',$data->remark,$trs);
//            $str.=$trs;
//        }
//        $html=str_replace('@@tr@@',$str,$html);
        

                $pageContent=$html;
        //-----BI結束-----
         //關閉資料庫連線
        $VTs->DBClose();
        //釋放
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }

}
