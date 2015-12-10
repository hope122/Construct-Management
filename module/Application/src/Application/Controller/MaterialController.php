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
         //session_start();
        $VTs = new clsSystem;
        $VTs->initialization();
        try{
        if(empty($_SESSION)){
            $pagePath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\index\\login_page.html";
            $pageContent = $VTs->GetHtmlContent($pagePath);
        }else{  
            //-----BI開始-----  材料類別頁面分流
            if(!empty($_GET['ptype'])){
                $ptype=$_GET['ptype'];
            }else{
                $ptype='list';
            }
            switch($ptype){
                case 'application':
                    $title='進料申請單';
                    break;
                case 'chkinfo':
                    $title='材料申請單明細';
                    break;
                default:
                    $title='材料進貨清單';
                    break;
            } 
            //取得主頁html
            $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\material\\index.html";
            $html=$VTs->GetHtmlContent($mpath);



            $arrdata["title"]=$title;
            $arrdata["ptype"]=$ptype;
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
	//取得選單
    public function applicationAction()
    {
        
        //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
        try{
		//-----BI開始-----  Application材料申請頁面

                $mpath=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\material\\application.html";
                $html=$VTs->GetHtmlContent($mpath);

                $data = $_POST['data'];
            
                $str='';
                 $html=str_replace('@@uuid@@',$_SESSION['uuid'],$html);
                if($data['su_supply']==null){
                     $html=str_replace('@@opt_supply@@','',$html);
                }else{
                    foreach($data['su_supply'] as $opData) {
                        $str.='<option value='.$opData['uid'].'>'.$opData['name'].'</option>';
                        }
                    $html=str_replace('@@opt_supply@@',$str,$html);
                }
                $str='';
                if($data['el_materiel']==null){
                     $html=str_replace('@@opt_supply@@','',$html);
                }else{
                    foreach($data['el_materiel'] as $opData) {
                        $str.='<option value='.$opData['uid'].'>'.$opData['name'].'</option>';
                        }
                    $html=str_replace('@@opt_prjuid@@',$str,$html);
                }

        
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
 public function listAction()
    {
        //session_start();
        $VTs = new clsSystem;
        $VTs->initialization();
        
        //-----BI開始-----  get prjuid 傳入廠商ＩＤ 回傳品項html option內容
        try{
//                         $apurl='http://211.21.170.18:99';
// //                $apurl='http://127.0.0.1:88';

            $ls_petition=$_POST['data'];

            //權限判別
            $position= $_SESSION['position'];
 
            $position='2502';
            if($position=='2502' || $position=='3502'){
                $div_hid='';
            }else{
                $div_hid='none';
            }
                $ls_path=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\material\\list.html";
                $ls=$VTs->GetHtmlContent($ls_path);
                if($ls_petition==null){
                    $tr='<div class="css_tr"><div class="css_td" style="width:15%;">無資料</div></div>';
                    $ls=str_replace('@@tr@@',$tr,$ls);
                    
                }else{
                    
                    $tr_path=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\material\\tr.html";
                    
                    $tr=$VTs->GetHtmlContent($tr_path);
                    $trstr='';
//                    print_r($ls_petition);
                    foreach($ls_petition as  $id => $lsData) {
                        $trs=$tr;
                        $trs=str_replace('@@id@@',$id+1,$trs);
                        // $trs=str_replace('@@supply@@',$lsData['su_name'],$trs);
                        // $trs=str_replace('@@no@@',"AA0000".$lsData['uid'],$trs);
                        $trs=str_replace('@@uid@@',$lsData['uid'],$trs);
                        $trs=str_replace('@@adate@@',$lsData['datep'],$trs);
                        $trs=str_replace('@@ma_name@@',$lsData['ma_name'],$trs);
                        $trs=str_replace('@@count@@',$lsData['count'],$trs);
                        $status='';
                        $color='block';


                        if ($lsData['ck2']!=-1){
                           if($lsData['ck2']==1){
                                $status='已進場';
                           }else{
                                $status='QC未通過';
                                $color='red';
                           }
                        }else{
                            if($lsData['ck1']!=-1){
                              if($lsData['ck1']==1){
                                    $status='待進場';
                               }else{
                                    $status='主任未通過';
                                    $color='red';
                               }
                            }else{
                                $status='待確認';
                                $color='#8E8E8E';
                            }
                        }
                        $trs=str_replace('@@status@@',$status,$trs);
                        $trs=str_replace('@@color@@',$color,$trs);
                        if($lsData['ck1']==1){
                            $str_order='已確認';
                        }else{
                            $str_order="<input type='checkbox' class='cls_order' value=".$lsData['uid'].">";
                        }
                        $trs=str_replace('@@order@@',$str_order,$trs);
                        // $trs=str_replace('@@uid@@',$lsData['uid'],$trs);
                        $trstr.=$trs;
                    }
                    $ls=str_replace('@@tr@@',$trstr,$ls);
                    
                }
                $ls=str_replace('@@ishid@@',$div_hid,$ls);
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
   public function getselectAction()
    {
        //session_start();
		$VTs = new clsSystem;
		$VTs->initialization();
		
        try{

            $arr_data = $_POST['data'];
            $html="<option value=0>請選擇</option>";
            if(!$arr_data==null){
                foreach($arr_data as $data){
                    $html.="<option value=".$data['uid'].">".$data['name']."</option>";
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

    public function chkinfoAction()
    {
        //session_start();
        $VTs = new clsSystem;
        $VTs->initialization();
        
        try{
            $path=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\material\\chkinfo.html";
            $data=$_POST['data'];
       
            $html=$VTs->GetHtmlContent($path);
            $arrdata['uid']=$data['uid'];
            $arrdata['no']='AA0000'.$data['uid'];
            $arrdata['cpname']=$data['cpname'];
            $arrdata['keyman']=$data['keyman'];
            $arrdata['phone']=$data['mobile'];
             $arrdata['mname']=$data['mname'];
             $arrdata['count']=$data['count'];
             $arrdata['date']=$data['date'];
             $arrdata['aname']=$data['aname'];
             $arrdata['place']=$data['place'];
             $arrdata['mplace']=$data['place_work'];
             $arrdata['aphone']=$data['amobile'];
             $arrdata['quid']=$data['quid'];
            if($data['check']){

                if(!empty($data['datein'])){

                    $arrdata['btn_check']='none';
                    $arrdata['btn_in']='none';
                }else{      
   
                    $arrdata['btn_check']='none';
                    $arrdata['btn_in']='';
                }
            }else{
                 $arrdata['btn_check']='';
                 $arrdata['btn_in']='none';
            }
            $pageContent=$html=$VTs->ContentReplace($arrdata,$html);
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
    public function getsuinfoAction()
    {
        //session_start();
        $VTs = new clsSystem;
        $VTs->initialization();
        
        try{
            $path=dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\pageSetting\\material\\info.html";
            $html=$VTs->GetHtmlContent($path);
            $arr_data = $_POST['data'];
         
            $info='';
            $i=0;
            if(!$arr_data==null){
                foreach($arr_data as $key=>$data){
                    if(!empty($data)){
                    $i++;
                    if(fmod($i,3)==1){
                        $info.="<tr width='100%'>";
                    }
                    $info.="<td width='30%'>".$key."：".$data."</td>";
                   if(fmod($i,3)==0){
                        $info.="</tr>";
                    }
                    }
                }
            }
            if(fmod($i,3)!=0){
                $info.="</tr>";
            }
            $html=str_replace('@@info@@',$info,$html);
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
   public function sendemailAction()
    {
        //session_start();
        $VTs = new clsSystem;
        $VTs->initialization();
        
        try{

            // $uid=$_POST['uid'];
            // $data = $VTs->json2data($VTs->UrlDataGet("http://211.21.170.18:99/material/getdbdata?type=chkinfo&uid=".$uid));
             $data=$_POST['data'];
             // $data={"quid":"2","check":"1","datein":null,"uid":"13","cpname":"\u53f0\u6ce5(\u6df7\u51dd\u571f)","keyman":"vick","mobile":"0955555555","mname":"280 kgf\/cm2 \u9810\u62cc\u6df7\u51dd\u571f","count":"2","date":"2015-12-30","aname":"\u5f37\u68ee\u5442","place":"1","place_work":"2","amobile":null}
            
             $str="廠商資訊"."\n";
             $str="訂單編號:".'AA0000'.$data['uid']."\n";
             $str.="公司名稱:".$data['cpname']."\n";
            $str.="品項:".$data['mname']."\n";
            $str.="數量:".$data['count']."\n";
            $str.="聯絡人:".$data['keyman']."\n";
            $str.="電話:".$data['mobile']."\n";
            $str.="===========================\n";
            $str.="申請人資訊\n";
            $str.="申請人:".$data['aname']."\n";
            $str.="電話:".$data['amobile']."\n";
            $str.="放置地點:".$data['place']."\n";
            $str.="施作部位:".$data['place_work']."\n";
            $str.="預計進場時間：".$data['date']."\n";
            // $str="正中建材公司您好,向貴公司訂購訂購水泥50包";
             print_r($str);
            $VTs->Tomail("hope080122@gmail.com","hope080122@gmail.com","訂貨",$str);
            $html='sendEmail';
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
  
}
