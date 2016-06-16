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
use SystemCtrl\ctrlSystem;

class MenterController extends AbstractActionController
{
    // 新版登入
    public function setlogininfoAction(){
        $SysClass = new ctrlSystem;
        // 預設不連資料庫
        $SysClass->initialization();
        // 連線指定資料庫
        // $SysClass->initialization("設定檔[名稱]",true); -> 即可連資料庫
        // 連線預設資料庫
        // $SysClass->initialization(null,true);
        try{
            //-----BI開始-----
            $action = array();
            $action["status"] = false;
            if(!empty($_POST)){
                if($_POST["status"]){
                    $APIUrl = $SysClass->GetAPIUrl('rsApiURL');
                    $APIUrl .= "verifyAPI";
                    // 進行UUID驗證
                    $sendData = array();
                    $sendData["uuid"] = $_POST["uuid"];                    
                    // 送出
                    $userPosition = $SysClass->UrlDataPost($APIUrl,$sendData);
                    $userPosition = $SysClass->Json2Data($userPosition["result"],false);

                    if($userPosition["status"]){
                        // 設置相關的帳號
                        $_SESSION["uuid"] = $userPosition["uuid"];
                        $_SESSION["menuPosition"] = $userPosition["menuPosition"];
                        $_SESSION["isAdmin"] = $userPosition["isAdmin"];
                        $_SESSION["sysList"] = $userPosition["sysList"];
                        $_SESSION["userName"] = $_POST["name"];
                        $action["msg"] = "驗證成功";
                        $action["sysList"] = $userPosition["sysList"];
                        $action["status"] = true;
                    }else{
                        // 驗證失敗，請重新登入
                        $action["msg"] = 'uuid is error, This Login is False';
                    }
                }else{
                    $action["msg"] = 'This Login is False';
                    $action["code"] = 2;
                }
            }else{
                $action["msg"] = 'This Status is False';
                $action["code"] = 1;
            }
            $pageContent = json_encode($action);
            //----BI結束----
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            // $SysClass->WriteLog("MenterController", "setloginAction", $error->getMessage());
        }
        $this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }


    // 設定系統代碼
    public function setsyscodeAction()
    {
        $SysClass = new ctrlSystem;
        // 預設不連資料庫
        $SysClass->initialization();
        // 連線指定資料庫
        // $SysClass->initialization("設定檔[名稱]",true); -> 即可連資料庫
        // 連線預設資料庫
        // $SysClass->initialization(null,true);
        try{
            //-----BI開始-----
            $action = array();
            $action["status"] = false;
            if(!empty($_POST)){
                if($_POST["sysCode"]){
                    if(in_array($_POST["sysCode"], $_SESSION["sysList"])){
                        $_SESSION["sysCode"] = $_POST["sysCode"];
                        $_SESSION["projectID"] = null;

                        $action["status"] = true;
                    }else{
                        $action["msg"] = "System Code is error";
                    }
                }
                
            }else{
                $action["msg"] = 'This Status is False';
                $action["code"] = 1;
            }
            $pageContent = json_encode($action);
            //----BI結束----
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            // $SysClass->WriteLog("MenterController", "setloginAction", $error->getMessage());
        }
        $this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
        
    }

    // 設定專案編號
    public function setprojectidAction()
    {
        $SysClass = new ctrlSystem;
        // 預設不連資料庫
        $SysClass->initialization();
        // 連線指定資料庫
        // $SysClass->initialization("設定檔[名稱]",true); -> 即可連資料庫
        // 連線預設資料庫
        // $SysClass->initialization(null,true);
        try{
            //-----BI開始-----
            $action = array();
            $action["status"] = false;
            if(!empty($_POST)){
                if($_POST["sysCode"]){
                    if(in_array($_SESSION["sysList"], $_POST["sysCode"])){
                        $_SESSION["projectID"] = $_POST["projectID"];

                        $action["status"] = true;
                        $action["projectID"] = $_SESSION["projectID"];
                    }else{
                        $action["msg"] = "System Code is error";
                    }
                }
                
            }else{
                $action["msg"] = 'This Status is False';
                $action["code"] = 1;
            }
            $pageContent = json_encode($action);
            //----BI結束----
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            // $SysClass->WriteLog("MenterController", "setloginAction", $error->getMessage());
        }
        $this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
        
    }

    public function logoutAction()
    {
		@session_start();
		@session_destroy();
		return new ViewModel();
		
    }
}
