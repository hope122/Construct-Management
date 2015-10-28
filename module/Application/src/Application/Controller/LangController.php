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

class LangController extends AbstractActionController
{
    public function indexAction()
    {
		$VTs = new clsSystem;
		$VTs->initialization();
		
		//-----BI開始-----
        $actArr = array();
        $actArr["msg"] = "Place Input Action";
        $actArr["status"] = false;
        $pageContent = $VTs->Data2Json($actArr);
		//----BI結束----
		
		$VTs = null;
		$this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
    
    public function pageAction()
    {
        $VTs = new clsSystem;
        $VTs->initialization();
        
        //-----BI開始-----
        $actArr = array();
        $actArr["status"] = false;
        if(!empty($_POST)){
            switch($_POST["type"]){
                //取得語言
                case "getLan":
                    //如果未設定語系，先設定
                    if(!isset($_SESSION["lang"])){
                        //先取得語系列表
                        $langListArr = $this->langList();
                        //取得伺服器本身的語言
                        $lang = strtolower(strtok(strip_tags($_SERVER['HTTP_ACCEPT_LANGUAGE']), ','));
                        $lang = str_replace("zh-","",$lang);
                        if(!empty($langListArr)){
                            if(!in_array($lang,$langListArr["list"])){
                                $lang = 'tw';
                            }
                        }else{
                            $lang = 'tw';
                        }
                        $_SESSION["lang"] = $lang;
                    }
                    $actArr["lang"] = $_SESSION["lang"];
                    $actArr["status"] = true;
                break;
                //取得語言設定檔
                case "getLanContent":
                    if(!empty($_POST["selectLang"])){
                        $langPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\language\\".$_POST["selectLang"].".ini";
                        if(!file_exists($langPath)){
                            $langPath = str_replace("\\","/",$langPath);
                        }
                        if(file_exists($langPath)){
                            $actArr["langContent"] = $VTs->GetINIInfo($langPath,"","","",true);
                            $actArr["status"] = true;
                        }else{
                            $actArr["msg"] = 'Lang File is not Find';
                        }
                    }else{
                        $actArr["msg"] = 'Lang Select is Empty';
                    }
                break;
            }
        }
        $pageContent = $VTs->Data2Json($actArr);
        //----BI結束----
        
        $VTs = null;
        $this->viewContnet['pageContent'] = $pageContent;
        return new ViewModel($this->viewContnet);
    }
    
    //取得語系列表
    private function langList(){
        $langArr = array();
        $langArr["name"] = array();
        $langArr["list"] = array();
        $langPath = dirname(__DIR__) . "\\..\\..\\..\\..\\public\\include\\language\\*.ini";
        if(!file_exists($langPath)){
            $langPath = str_replace("\\","/",$langPath);
        }
        $langIni = glob($langPath);
        if(!empty($langIni)){
            foreach($langIni as $content){
                $langArr = parse_ini_file($content,true);
                $langName = array_keys($langArr);
                $langName = $langName[0];
                if(!in_array($langName,$langArr["name"])){
                    $langArr["name"][] = $langName;
                    $langArr["list"][] = str_replace(".ini","",str_replace("./include/language/","",$content));
                }
            }
        }
        return $langArr;
    }
}
