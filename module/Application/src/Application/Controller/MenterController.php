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

class MenterController extends AbstractActionController
{
    public function setloginAction(){
        $VTs = new clsSystem;
        $VTs->initialization();
        //-----BI開始-----
        $pArr = array();
        $pArr["status"] = false;
        if(!empty($_POST)){
            if($_POST["status"]){
                $strSQL = "select * from acl_account_position_list where uuid = '".$_POST["uuid"]."'";
                $data = $VTs->QueryData($strSQL);
                $position = '';
                if(!empty($data)){
                    foreach($data as $content){
                        $position .= $content["position_uid"].',';
                    }
                    $position = substr($position,0,strlen($position)-1);
                }
                $_SESSION["uuid"] = $_POST["uuid"];
                $_SESSION["userName"] = $_POST["name"];
                $_SESSION["ac"] = $_POST["userAc"];
                $_SESSION["position"] = $position;
                $pArr["status"] = true;
            }else{
                $pArr["msg"] = 'This Login is False';
                $pArr["code"] = 2;
            }
        }else{
            $pArr["msg"] = 'This Status is False';
            $pArr["code"] = 1;
        }
        $pageContent = $VTs->Data2Json($pArr);
        //----BI結束----
        $VTs->DBClose();
        $VTs = null;
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
