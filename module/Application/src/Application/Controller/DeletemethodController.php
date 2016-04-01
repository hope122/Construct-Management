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

class DeletemethodController extends AbstractActionController
{
    //不執行任何動作
    public function deleteAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization();
        try{
            if(!empty($_POST["apiMethod"]) && !empty($_POST["deleteObj"])){
                $apiServer = __DIR__ . '/../../../../../public/include/apiServer.ini';

                // 取得ＡＰＩ設定檔
                $apiURLIni = $SysClass->GetINIInfo($apiServer,"",'server','',true,false);
                $apiURL = $apiURLIni["apiURL"];
                
                $sendDeleteObj = http_build_query($_POST["deleteObj"]);
                $apiMethod = $_POST["apiMethod"];
                // 刪除方法
                // EX: $apiURL 加上 'ASS/api/ctrlAdmin/Delete_AssTypeOffice?iUid=1'
                $curlCMD = "curl '".$apiURL.$apiMethod."?".$sendDeleteObj."' -X DELETE --compressed";
                $pageContent = $SysClass->cmdExecute($curlCMD);
            }else{
                $action = [];
                $action["status"] = false;
                $action["errorMsg"] = "apiMethod or deleteObj is empty";

                $pageContent = $SysClass->Data2Json($action);
            }
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            $SysClass->WriteLog("SupplyController", "editorAction", $error->getMessage());
        }
         //關閉資料庫連線
        // $SysClass->DBClose();
        //釋放
        $SysClass = null;
        $this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }

}
