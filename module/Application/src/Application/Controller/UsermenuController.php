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

class UsermenuController extends AbstractActionController
{
    public function indexAction(){
        $SysClass = new ctrlSystem;
        // 預設不連資料庫
        // $SysClass->initialization();
        // 連線指定資料庫
        // $SysClass->initialization("設定檔[名稱]",true); -> 即可連資料庫
        // 連線預設資料庫
        // $SysClass->initialization(null,true);
        $SysClass->initialization();
        try{
            $APIUrl = $SysClass->GetAPIUrl('rsApiURL');
            $APIUrl .= "menuAPI/userMenu";
            $SendArray = array();
            $SendArray["menuPosition"] = $_SESSION["menuPosition"];
            // print_r($SendArray);
            $data = $SysClass->UrlDataPost( $APIUrl, $SendArray);
            $pageContent = $data["result"];

            // print_r($data);
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            // $SysClass->WriteLog("MenterController", "setloginAction", $error->getMessage());
        }
        //關閉資料庫連線
        // $SysClass->DBClose();
        //釋放
        $SysClass = null;
        $this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }

}
