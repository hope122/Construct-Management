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
    public function reportAction(){
        //echo "targetid:".$_GET["targetid"];
        //session_start();
        $VTs = new clsSystem;
        $VTs->initialization('oldhouseDB');
        
        //-----BI開始-----  
        try{
           // $arr_data=$_POST['data'];

                $html_path=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\oldhouse\\table-2.html";
                $html=$VTs->GetHtmlContent($html_path);
                
                $no = 1;

                //檢驗基本資料
                // $strSQL = "select t2.`hname`, t2.`htel`, t2.`hmobil`,
                //                    t2.`ZipCode`, t2.`City`, t2.`Area`, t2.`Vil`, t2.`Verge`, t2.`Road`, t2.`addr`,
                //                    t3.desc 'strType', t4.desc 'scale', t5.desc 'type', t1.date, t8.name 'ename', t7.`licenseid` 'license'
                //             from qc_info as t1
                //                 left join qc_house as t2 on t2.uid = t1.`huid`
                //                 left join house_type as t3 on t3.`uid` = t1.htid
                //                 left join house_type_model AS T4 ON t4.uid = t1.`htmid1`
                //                 left join house_type_structure as t5 on t5.uid = t1.htsid
                //                 left join `eng_engineer_city` as t6 on t6.uid = t2.`ecid`
                //                 left join `eng_engineer` as t7 on t7.uid = t6.`eid`
                //                 left join `ass_common` as t8 on t8.uid = t7.`cmid`
                //             where huid = ".$_GET["targetid"]."
                //             limit 1";
                
                $strSQL = "select t2.`hname`, t2.`htel`, t2.`hmobil`,
                                   t2.`ZipCode`, t2.`City`, t2.`Area`, t2.`Vil`, t2.`Verge`, t2.`Road`, t2.`addr`,
                                   t3.desc 'strType', t1.`htmid1`, t1.`htmid2`, t5.desc 'type', t1.date, t8.name 'ename', t7.`licenseid` 'license'
                            from qc_info as t1
                                left join qc_house as t2 on t2.uid = t1.`huid`
                                    left join house_type as t3 on t3.`uid` = t1.htid
                                left join house_type_structure as t5 on t5.uid = t1.htsid
                                left join `eng_engineer_city` as t6 on t6.uid = t2.`ecid`
                                left join `eng_engineer` as t7 on t7.uid = t6.`eid`
                                    left join `ass_common` as t8 on t8.uid = t7.`cmid`
                            where huid = ".$_GET["targetid"]."
                            limit 1";
                $data = $VTs->QueryData($strSQL);
            //$VTs->Debug($data);

                #替換基本資料
                $dataArr = [
                    "owner" => $data[0]["hname"],
                    "tel" => $data[0]["htel"],
                    "mobile" => $data[0]["hmobil"],
                    "addr" => $data[0]["ZipCode"]." ".$data[0]["City"]." ".$data[0]["Area"]." ".$data[0]["Vil"]." ".$data[0]["Verge"]." ".$data[0]["Road"]." ".$data[0]["addr"],
                    "strType" => $data[0]["strType"],
                    "scale" => $data[0]["scale"],
                    "type" => $data[0]["type"],
                    "date" => $data[0]["date"],
                    "ename" => $data[0]["ename"],
                    "license" => $data[0]["license"]
                ];
                $html = $VTs->ContentReplace($dataArr,$html);
            //print_r($html);
                
                #量化資料
                $quantity_tr_path = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\oldhouse\\tr1.html";
                $quantity_tr = $VTs->GetHtmlContent($quantity_tr_path);

                $strSQL="SELECT t1.uid,
                        t10.`desc` as eng_str, t11.`desc` as problem, t1.`length`, t1.`width`, t1.`depth`, t1.`area`,
                         t1.`remark`, t13.`imgfile`, t12.unit1 level
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
                        WHERE t2.huid = ".$_GET["targetid"]." AND (t1.`length` > 0 OR t1.width > 0 OR t1.depth > 0 OR t1.`area` > 0)
                        ORDER BY t1.val DESC, t1.uid ASC";
                $data = $VTs->QueryData($strSQL);
            //$VTs->Debug($data[0]);
            //print_r(count($data));
                $quantity_html = "";

                for ($i=0; $i < count($data); $i++) {
                    //$VTs->Debug($data[$i]);
                    $tr = $quantity_tr;
                    if($data[$i]["area"] != 0){
                         $value = "面積：".$data[$i]["area"];
                    }else{
                         $value = "長：".$data[$i]["length"]." 寬：".$data[$i]["width"]." 高：".$data[$i]["depth"];
                    }

                    #讀圖檔
                    $filePath = "C:\\xampp\\htdocs\\AP-Service\\public\\old_house_img\\";
                    $filePath .= $data[$i]["imgfile"];
                    //print_r($filePath);
                    if(file_exists($filePath)){
                        $imgArr = $VTs->GetINIInfo($filePath,"","","",true);
                    //$VTs->debug($imgArr["img0"]);
                        // $img = "<img src='".$imgArr["img0"]."' width='60%' />
                        //         <img src='".$imgArr["img1"]."' width='60%' />
                        //         <img src='".$imgArr["img2"]."' width='60%' />";
                        $img = count($imgArr) . "張";
                    }else{
                        $img = "0張";
                    }

                    #替換@@
                    $dataArr = [
                        "no" => $no++,
                        "eng_str" => $data[$i]["eng_str"],
                        "problem" => $data[$i]["problem"],
                        "value" => $value,
                        "remark" => $data[$i]["remark"],
                        "photo" => $img,
                        "level" => $data[$i]["level"]
                    ];
                    $tr = $VTs->ContentReplace($dataArr,$tr);


                    $quantity_html .= $tr;
                }

                #質化資料
                $quality_tr_path = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\oldhouse\\tr2.html";
                $quality_tr = $VTs->GetHtmlContent($quality_tr_path);
                
                $strSQL = "SELECT t1.uid,
                                t10.`desc` as eng_str, t11.`desc` as problem, t1.`length`, t1.`width`, t1.`depth`, t1.`area`,
                                t1.`remark`, t13.`imgfile`, t12.unit1 level
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
                            WHERE t2.huid = ".$_GET["targetid"]." AND (t1.`length` = 0 and t1.width = 0 and t1.depth = 0 and t1.`area` = 0)
                            ORDER BY t1.val DESC, t1.uid ASC";
                $data = $VTs->QueryData($strSQL);
            //$VTs->Debug($data);

                $quality_html = "";

                for ($i=0; $i < count($data); $i++) {
                    //$VTs->Debug($data[$i]);
                    $tr = $quality_tr;

                    #讀圖檔
                    $filePath = "C:\\xampp\\htdocs\\AP-Service\\public\\old_house_img\\";
                    $filePath .= $data[$i]["imgfile"];
                    //print_r($filePath);
                    if(file_exists($filePath)){
                        $imgArr = $VTs->GetINIInfo($filePath,"","","",true);
                    //$VTs->debug($imgArr["img0"]);
                        // $img = "<img src='".$imgArr["img0"]."' width='60%' />
                        //         <img src='".$imgArr["img1"]."' width='60%' />
                        //         <img src='".$imgArr["img2"]."' width='60%' />";
                        $img = count($imgArr) . "張";
                    }else{
                        $img = "0張";
                    }

                    $dataArr = [
                        "no" => $no++,
                        "eng_str" => $data[$i]["eng_str"],
                        "problem" => $data[$i]["problem"],
                        "value" => $value,
                        "remark" => $data[$i]["remark"],
                        "photo" => $img,
                        "level" => $data[$i]["level"]
                    ];
                    $tr = $VTs->ContentReplace($dataArr,$tr);

                    $quality_html .= $tr;
                }

                $dataArr = [
                    "quantity"=> $quantity_html,
                    "quality" => $quality_html
                ];
                $html = $VTs->ContentReplace($dataArr,$html);
//print_r($html);
                
                
                //$pageContent=$VTs->Data2Json($d);
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
   

    public function ListAction(){
        $VTs = new clsSystem;
        $VTs->initialization('oldhouseDB');
        
        try{
        //-----BI開始-----
            $strSQL = "SELECT t2.`hname`, t2.`htel`, t2.`hmobil`,
                               t2.`ZipCode`, t2.`City`, t2.`Area`, t2.`Vil`, t2.`Verge`, t2.`Road`, t2.`addr`,
                               t3.desc 'strType', t4.desc 'scale', t5.desc 'type', t1.date, t8.name 'ename', t7.`licenseid` 'license'
                        FROM qc_info AS t1
                            LEFT JOIN qc_house AS t2 ON t2.uid = t1.`huid`
                            LEFT JOIN house_type AS t3 ON t3.`uid` = t1.htid
                            LEFT JOIN house_type_model AS T4 ON t4.uid = t1.`htmid1`
                            LEFT JOIN house_type_structure AS t5 ON t5.uid = t1.htsid
                            LEFT JOIN `eng_engineer_city` AS t6 ON t6.uid = t2.`ecid`
                            LEFT JOIN `eng_engineer` AS t7 ON t7.uid = t6.`eid`
                            LEFT JOIN `ass_common` AS t8 ON t8.uid = t7.`cmid`";
            $data = $VTs->QueryData($strSQL);
            //$VTs->Debug($data);

            //$Path = "D:\\php_dev\\AP-Service\\public\\old_house_pdf\\";
            $Path = "..\\old_house_pdf\\";
            $link_html = "";

            if(!empty($data)){
                foreach ($data as $key => $value) {
                    $filePath = $Path . $value["hname"]."-".$value["htel"].".pdf";
                    //$link = $value["hname"]."-".$value["htel"]."<a href = '".$filePath."'>下載PDF</a><br>";
                    $link = $value["ZipCode"].$value["City"].$value["Area"].$value["Vil"].$value["Verge"].$value["Road"].$value["addr"]."<a href = '".$filePath."'>下載PDF</a><br>";
                    $link_html .= $link;
                }
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
        $this->viewContnet['pageContent'] = $link_html;
        return new ViewModel($this->viewContnet);
    }
}
