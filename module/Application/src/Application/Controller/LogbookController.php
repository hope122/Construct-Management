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

        //取得主頁html
        $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\index.html";
        $html=$VTs->GetHtmlContent($mpath);
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

  //   //設定選項
  //      public function setcontentsAction()
  //   {
  //       //session_start();
		// $VTs = new clsSystem;
		// $VTs->initialization();
  //       try{
		// //-----BI開始-----  get prjuid 傳入廠商ＩＤ 回傳品項html option內容
  //       $apurl='http://127.0.0.1:88';
  //       //取得主頁html
  //       $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\setcontents.html";
  //       $html=$VTs->GetHtmlContent($mpath);
      
  //       //取得天氣列表
  //       $arr_weather= $VTs->json2data($VTs->UrlDataGet($apurl."/logbook/getdbdata?type=weather"));
  //       $whtml='';
  //       foreach($arr_weather as $weather){
  //           $whtml.="<option value=".$weather->uid.">".$weather->name."</option>";
  //       }
  //       $html=str_replace("@@woption@@",$whtml,$html);
        
        
  //           //印出html
  //           $pageContent=$html;
  //       //-----BI結束-----
  //       }catch(Exception $error){
  //           //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
  //           $VTs->WriteLog("IndexController", "indexAction", $error->getMessage());
  //       }
  //        //關閉資料庫連線  //       $VTs->DBClose();
  //       //釋放
		// $VTs = 

    // null;
		// $this->viewContnet['pageContent'] = $pageContent;
  //       return new ViewModel($this->viewContnet);
  //   }
    

    //施工日誌 第一項施工進度 tr1
    public function gethtmlAction()
    {
        //session_start();
        $VTs = new clsSystem;
        $VTs->initialization();
        try{
        //-----BI開始----- 
        
        //接資料
        $data= $_POST["data"];
        
        //取得html內容
        $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\html.html";
        $html=$VTs->GetHtmlContent($mpath);

        //取得基本資訊
        $diary_info=$data["diary_info"];
        $arrdata = [
            "no"=>$data["no"],
            "amweather"=>$diary_info["amweather"],
            "pmweather"=>$diary_info["pmweather"],
            "week"=>$diary_info["week"],
            "indate"=>$diary_info["date"],
        ];
        $html=$VTs->ContentReplace($arrdata,$html);

        //取得表頭項目
        $head=$data["project"];
        $aday=round((strtotime(date("Y-m-d"))-strtotime($head["start"]))/3600/24);
        $sday=$head["pday"]-$aday+$head["cday"];

        $arrdata = [
            "prjname"=>$head["prjname"],
            "supplyname"=>$head["supplyname"],
            "pday"=>$head["pday"],
            "aday"=>$aday,
            "sday"=>$sday,
            "cday"=>$head["cday"],
            "start"=>$head["start"],
            "end"=>$head["end"],
        ];
        $html=$VTs->ContentReplace($arrdata,$html);


        //-----------------------------------------------------------------------------------------------
        //取得施工進度
        // （暫無資料
        $tr1="<tr><td COLSPAN=2 ></td><td></td><td></td><td></td><td></td><td COLSPAN=2></td> </tr>";
        $arrdata["tr1"]=$tr1;
    
        //-----------------------------------------------------------------------------------------------
       
        //取得材料管理
        $trpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\tr2.html";
        $trhtml=$VTs->GetHtmlContent($trpath);
        $materielcount=$data["materielcount"];

        $strhtml2='';
        if(!empty($materielcount) ){
            foreach($materielcount as $materiel){
                $tr=$trhtml;
                $tr=str_replace("@@name@@",$materiel["name"],$tr);
                $tr=str_replace("@@unit@@",$materiel["unit"],$tr);
                $tr=str_replace("@@pcount@@",$materiel["pcount"],$tr);
                $tr=str_replace("@@incount@@",$materiel["incount"],$tr);
                $tr=str_replace("@@count@@",$materiel["count"],$tr);
                $strhtml2.=$tr;
            }     
//   
        }
        // echo $strhtml2;
        $arrdata["tr2"]=$strhtml2;


        //取得人員機具管理
        $trpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\tr3.html";
        $trhtml=$VTs->GetHtmlContent($trpath);
        $arr_workcount= $data["workcount"];
//        print_r($arr_workcount);
        $strhtml3='';
        if(!$arr_workcount==null ){
            foreach($arr_workcount as $workcount){
                $tr=$trhtml;
                $tr=str_replace("@@name@@",$workcount["name"],$tr);
                $tr=str_replace("@@count@@",$workcount["count"],$tr);
                $strhtml3.=$tr;
            }
        }
        $arrdata["tr3"]=$strhtml3;
        $html=$VTs->ContentReplace($arrdata,$html);
//         // $html=str_replace("@@tr3@@",$strhtml,$html);
//         //印出頁面

//         $str='';
//         $arrdata["tr"]=$str;
//         // $html=str_replace('@@tr@@',$str,$html);
//         $arrdata = [
//             "tr"=>$tr1,
//             "tr1"=>$str,
//             "tr2"=>$strhtml2,
//             "tr3"=>$strhtml3,
//         ];
      
        
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

    //儲存pdf
    public function savepdffileAction()
    {
        //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
        try{
		//-----BI開始-----  get prjuid 傳入廠商ＩＤ 回傳品項html option內容
        //            $apurl='http://211.21.170.18:99';
        $url=$_GET['url'];
        $filename=$_GET['name'].".pdf";
        // $url="http://127.0.0.1:168/logbook";
        // $filename="pdftest.pdf";    
        $dirPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\file_pdf\\";
        if( !is_dir($dirPath) ){ 
             $dirPath = str_replace("\\", "/", $dirPath);
            if( !is_dir($dirPath)){
                $VTs->CreateDirectory($dirPath);
            }
        }  

        $filePath = $dirPath.$filename;
        if(!is_file($filePath) ){ 
            $filePath = str_replace("\\", "/", $filePath);
            if(!is_file($filePath)){
                $VTs->Page2PDF($url,$filePath);
            }
        }
        if(isset($filePath))
        {
            // $_GET['file'] 即為傳入要下載檔名的引數
            header("Content-type:application");
            header("Content-Length: " .(string)(filesize($filePath)));
            header("Content-Disposition: attachment; filename=".$filename);
            readfile($filePath);
        }
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
