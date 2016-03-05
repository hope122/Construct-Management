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

class OldhouseController extends AbstractActionController
{
	//不執行任何動作
	// public function indexAction()
 //    {
	// 	 //session_start();
	// 	$VTs = new clsSystem;
	// 	$VTs->initialization();
 //        try{

 //        //-----BI開始-----  index logbook施工日誌首頁
 //        if(empty($_SESSION)){
 //            $pagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\index\\login_page.html";
 //            $pageContent = $VTs->GetHtmlContent($pagePath);
 //        }else{  
 //            //-----BI開始-----  材料類別頁面分流
 //            if(!empty($_GET['ptype'])){
 //                $ptype=$_GET['ptype'];
 //            }else{
 //                $ptype='list';
 //            }
 //            switch($ptype){
 //                case 'report':
 //                    $title='建築物施工日誌';
 //                    break;
 //                case 'setcontents':
 //                    $title='建築物施工日誌';
 //                    break;
 //                case 'laborsafety':
 //                    $title="勞安設定";
 //                    break;
 //                default:
 //                    $title='日誌清單';
 //                    break;
 //            } 
 //           //取得主頁html
 //            $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\logbook\\index.html";
 //            $html=$VTs->GetHtmlContent($mpath);



 //            $arrdata["title"]=$title;
 //            $arrdata["ptype"]=$ptype;
 //            $arrdata["userName"]=$_SESSION['userName'];
 //            $html=$VTs->ContentReplace($arrdata,$html);
 //            $pageContent=$html;
 //        }

 
 //        //-----BI結束-----

 //        }catch(Exception $error){
 //            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
 //            $VTs->WriteLog("IndexController", "indexAction", $error->getMessage());
 //        }
 //         //關閉資料庫連線
 //        $VTs->DBClose();
 //        //釋放
	// 	$VTs = null;
	// 	$this->viewContnet['pageContent'] = $pageContent;
 //        return new ViewModel($this->viewContnet);
 //    }
    public function reportAction()
    {
        //session_start();
        $VTs = new clsSystem;
        $VTs->initialization('oldhouse');
        
        //-----BI開始-----  
        try{
           // $arr_data=$_POST['data'];

                $html_path=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\oldhouse\\table-2.html";
                $html=$VTs->GetHtmlContent($html_path);
                $strSQL="SELECT t1.uid, t3.`hname` , t3.`htel` , t3.`hmobil` , t3.`ZipCode`, t3.`City`, t3.`Area`, t3.`Vil`, t3.`Verge`, t3.`Road`, t3.`addr`,
                         t4.`desc` , t5.`desc` , t6.`desc` , t2.`date` , t9.name , t8.`licenseid` ,
                        t10.`desc` as eng_str, t11.`desc` as problem, t1.`length`, t1.`width`, t1.`depth`, t1.`area`,
                         t1.`remark`, t13.`imgfile`, t12.unit1 
                        FROM qc_item AS t1
                         LEFT JOIN qc_info AS t2 ON t2.uid = t1.ifid
                         LEFT JOIN qc_house AS t3 ON t3.uid = t2.huid
                          LEFT JOIN house_type AS t4 ON t4.uid = t2.htid
                         LEFT JOIN house_type_model AS t5 ON t5.uid = t2.htmid1 OR t5.uid = t2.htmid2
                         LEFT JOIN house_type_structure AS t6 ON t6.uid = t2.htsid
                         LEFT JOIN eng_engineer_city AS t7 ON t7.uid = t3.ecid
                         LEFT JOIN eng_engineer AS t8 ON t8.uid = t7.eid
                         LEFT JOIN ass_common AS t9 ON t9.uid = t8.cmid
                         LEFT JOIN eng_str AS t10 ON t10.`uid` = t1.`strid`
                         LEFT JOIN qc_checkitem AS t11 ON t11.uid = t1.ciid
                         LEFT JOIN eng_unit AS t12 ON t12.uid = t1.val
                         LEFT JOIN img_picture AS t13 ON t13.`uid` = t1.`imgids`
                        WHERE t3.uid = 1 AND t1.`length` > 0 OR t1.width > 0 OR t1.depth > 0 OR t1.`area` > 0
                        ORDER BY t1.val DESC, t1.uid ASC;";
                $d = $VTs->QueryData($strSQL);
                $pageContent=$VTs->Data2Json($d);
            // $pageContent=$html;
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
