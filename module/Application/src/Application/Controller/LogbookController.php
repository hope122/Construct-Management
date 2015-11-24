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

class LogbookController extends AbstractActionController
{
	//不執行任何動作
	public function indexAction()
    {
		 //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
        try{
		//-----BI開始-----  index logbook施工日誌首頁
        
        //設定apurl
        $apurl='http://211.21.170.18:99';
//      $apurl='http://127.0.0.1:88';
        //取得主頁html
        $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\index.html";
        $html=$VTs->GetHtmlContent($mpath);
        //取得編號
        $no= $VTs->json2data($VTs->UrlDataGet($apurl."/logbook/getdbdata?type=getno"));
        if($no == null){
            // $html=str_replace("@@no@@",1,$html);
            $arrdata["no"]=1;
        }else{
            // $html=str_replace("@@no@@",$no[0]->no+1,$html);
            $arrdata["no"]=$no[0]->no+1;
        }
        $html=$VTs->ContentReplace($arrdata,$html);
        //取得資料資訊
        $diary_info= $VTs->json2data($VTs->UrlDataGet($apurl."/logbook/getdbdata?type=diary_info&uid=1"));
        $arrdata = [
            "amweather"=>$diary_info[0]->amweather,
            "pmweather"=>$diary_info[0]->pmweather,
            "week"=>$diary_info[0]->week,
            "indate"=>$diary_info[0]->date,
        ];
        $html=$VTs->ContentReplace($arrdata,$html);
        
        // $arrdata["amweather"]=$diary_info[0]->amweather;
        // $arrdata["pmweather"]=$diary_info[0]->pmweather;
        // $arrdata["week"]=$diary_info[0]->week;
        // $arrdata["indate"]=$diary_info[0]->date;


        //取得表頭項目
        $head= $VTs->json2data($VTs->UrlDataGet($apurl."/logbook/getdbdata?type=project&uid=1"));
//        print_r($head);
        // $arrdata["prjname"]=$head[0]->prjname;
        // $arrdata["supplyname"]=$head[0]->supplyname;
        // $arrdata["pday"]=$head[0]->pday;
        $aday=round((strtotime(date("Y-m-d"))-strtotime($head[0]->start))/3600/24);
        // $arrdata["aday"]=$aday;
        $sday=$head[0]->pday-$aday+$head[0]->cday;
        // $arrdata["sday"]=$sday;
        // $arrdata["cday"]=$head[0]->cday;
        // $arrdata["start"]=$head[0]->start;
        // $arrdata["end"]=$head[0]->end;

        $arrdata = [
            "prjname"=>$head[0]->prjname,
            "supplyname"=>$head[0]->supplyname,
            "pday"=>$head[0]->pday,
            "aday"=>$aday,
            "sday"=>$sday,
            "cday"=>$head[0]->cday,
            "start"=>$head[0]->start,
            "end"=>$head[0]->end,
        ];
        $html=$VTs->ContentReplace($arrdata,$html);
        // $html=str_replace("@@prjname@@",$head[0]->prjname,$html);
        // $html=str_replace("@@supplyname@@",$head[0]->supplyname,$html);
        // $html=str_replace("@@pday@@",$head[0]->pday,$html);
        // $aday=round((strtotime(date("Y-m-d"))-strtotime($head[0]->start))/3600/24);
        // $html=str_replace("@@aday@@",$aday,$html);
        // $sday=$head[0]->pday-$aday+$head[0]->cday;
        // $html=str_replace("@@sday@@",$sday,$html);
        // $html=str_replace("@@cday@@",$head[0]->cday,$html);
        // $html=str_replace("@@start@@",$head[0]->start,$html);
        // $html=str_replace("@@end@@",$head[0]->end,$html);
        //取得施工進度
        // （暫無資料

        $tr1="<tr><td COLSPAN=2 ></td><td></td><td></td><td></td><td></td><td COLSPAN=2></td> </tr>";
        $arrdata["tr1"]=$tr1;
        // $html=str_replace("@@tr1@@",$tr1,$html);
        //取得材料管理
        $trpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\tr2.html";
        $trhtml=$VTs->GetHtmlContent($trpath);
        $arr_materiel= $VTs->json2data($VTs->UrlDataGet($apurl."/logbook/getdbdata?type=materielcount"));
//        print_r($arr_materiel);
        $strhtml2='';
        if(!$arr_materiel==null ){
            foreach($arr_materiel as $materiel){
                $tr=$trhtml;
                $tr=str_replace("@@name@@",$materiel->name,$tr);
                $tr=str_replace("@@unit@@",$materiel->unit,$tr);
                $tr=str_replace("@@pcount@@",$materiel->pcount,$tr);
                $tr=str_replace("@@incount@@",$materiel->incount,$tr);
                $tr=str_replace("@@count@@",$materiel->count,$tr);
                $strhtml2.=$tr;
            }
        }
        $arrdata["tr2"]=$strhtml2;
        // $html=str_replace("@@tr2@@",$strhtml,$html);
        //取得人員機具管理
        $trpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\tr3.html";
        $trhtml=$VTs->GetHtmlContent($trpath);
        $arr_workcount= $VTs->json2data($VTs->UrlDataGet($apurl."/logbook/getdbdata?type=workcount"));
//        print_r($arr_workcount);
        $strhtml3='';
        if(!$arr_workcount==null ){
            foreach($arr_workcount as $workcount){
                $tr=$trhtml;
                $tr=str_replace("@@name@@",$workcount->name,$tr);
                $tr=str_replace("@@count@@",$workcount->count,$tr);
                $strhtml3.=$tr;
            }
        }
        $arrdata["tr3"]=$strhtml3;
        // $html=str_replace("@@tr3@@",$strhtml,$html);
        //印出頁面

        $str='';
        $arrdata["tr"]=$str;
        // $html=str_replace('@@tr@@',$str,$html);
        $arrdata = [
            "tr"=>$tr1,
            "tr1"=>$str,
            "tr2"=>$strhtml2,
            "tr3"=>$strhtml3,
        ];
        $pageContent=$VTs->ContentReplace($arrdata,$html);
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
       public function setcontentsAction()
    {
        //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
        try{
		//-----BI開始-----  get prjuid 傳入廠商ＩＤ 回傳品項html option內容
            $apurl='http://127.0.0.1:88';
        //取得主頁html
        $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\setcontents.html";
        $html=$VTs->GetHtmlContent($mpath);
      
        //取得天氣列表
        $arr_weather= $VTs->json2data($VTs->UrlDataGet($apurl."/logbook/getdbdata?type=weather"));
        $whtml='';
        foreach($arr_weather as $weather){
            $whtml.="<option value=".$weather->uid.">".$weather->name."</option>";
        }
        $html=str_replace("@@woption@@",$whtml,$html);
        
        
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
    
    public function savepdffileAction()
    {
        //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
        try{
		//-----BI開始-----  get prjuid 傳入廠商ＩＤ 回傳品項html option內容
        //            $apurl='http://211.21.170.18:99';
        $url=$_GET['url'];

        $filePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public";
        if( !file_exists($filePath) ){ 
            //echo "no";
             $filePath = str_replace("\\", "/", $filePath);
            if( file_exists($filePath)){
                echo 'yes';
            }else{
                echo "no file";
            }
        }  
        $filePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\logbookpdf.pdf";
        if( !file_exists($filePath) ){ 
            //echo "no";
             $filePath = str_replace("\\", "/", $filePath);
            if( file_exists($filePath)){
                echo 'yes';
            }else{
                echo "no file";
            }
        }
        
        // header('Content-type: application/pdf');
        // readfile('logbookpdf.pdf');
        // header('Content-Disposition: attachment; filename="logbookpdf.pdf"');
        // echo "<script>window.close();</script>";

      
        
            //印出html
//            $pageContent=$html;
        //-----BI結束-----
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            $VTs->WriteLog("IndexController", "indexAction", $error->getMessage());
        }
         //關閉資料庫連線
        $VTs->DBClose();
        //釋放
		$VTs = null;
    }

}
