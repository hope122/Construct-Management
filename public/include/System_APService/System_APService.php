<?php
	//宣告命名空間
	namespace System_APService;
	
	//先載入各物件
	$systemApPath = glob( __DIR__ ."\\*\\*\\*.php");
	
	if(!empty($systemApPath)){
		foreach($systemApPath as $systemApContent){
			include_once($systemApContent);
			//print_r($systemApContent);
		}
    }else{
        //先載入各物件
        $systemApPath = glob( __DIR__ ."/*/*/*.php");
        if(!empty($systemApPath)){
            foreach($systemApPath as $systemApContent){
                include_once($systemApContent);
                //print_r($systemApContent);
            }
        }
    }
    
    
	//載入結束
	//引用物件命名空間
	use SystemDBService\clsDB_MySQL;
	use SystemToolsService\clsTools;
	use SystemFrameService\clsFrame;
	//引用完畢
	
	class clsSystem{
		//資料庫連線參數
		public $SystemDBService;
		//相關工具
		public $SystemToolsService;
		//相關框架設定
		public $SystemFrameService;
		//ini相關設定
		public $iniSet;
		//使用者資訊
		public $userInfo;
		
		//供呼叫程式初始化設定
		public function initialization($DBSection = ''){
			@session_start();
			
			//相關工具設定
			//基礎的資安防護
			$VTs = new clsTools;
			if(!empty($_POST)){
				$_POST = $VTs->replacePackage($_POST);
			}
			
			if(!empty($_GET)){
				$_GET = $VTs->replacePackage($_GET);
			}
			//結束基礎的資安防護

			//取得資料庫設定值
			$strIniFile = __DIR__ . '\\..\\connDB.ini';
            if(!file_exists($strIniFile)){
                $strIniFile = __DIR__ . '/../connDB.ini';
            }
			$sSection = 'connDB';
            if(!$DBSection){
                $DBSection = 'defaultDB';
            }
			
			$sServer = $VTs->GetINIInfo($strIniFile,$sSection,'servername','');
			$sUser = $VTs->GetINIInfo($strIniFile,$sSection,'user','');
			$sPassWord = $VTs->GetINIInfo($strIniFile,$sSection,'password','');
            //取得資料庫
			$sDatabase = $VTs->GetINIInfo($strIniFile,$DBSection,'defaultDB','');
			
			//放到共同變數中
			$iniSet["DBSet"]["sServer"] = $sServer;
			$iniSet["DBSet"]["sUser"] = $sUser;
			$iniSet["DBSet"]["sPassWord"] = $sPassWord;
			$iniSet["DBSet"]["sDatabase"] = $sDatabase;
			
			//存到變數，以重複利用
			$this->SystemToolsService = $VTs;
			//釋放
			$VTs = null;
			//相關工具設定結束
			
			//建立資料庫連線
			$VTc = new clsDB_MySQL;
			$VTc->CreateDBConnection($sServer,$sDatabase,$sUser,$sPassWord);
			//存到變數，以重複利用
			$this->SystemDBService = $VTc;
			//釋放
			$VTs = null;
			
			//建立框架設定
			$this->SystemFrameService = new clsFrame;
		}
		
	#這裡是SystemDBService
		//資料庫連線
		public function CreateDBConnection($sServer='', $sDatabase='', $sUser='', $sPassWord=''){
			$sServer = ($sServer)?$sServer:$iniSet["DBSet"]["sServer"];
			$sDatabase = ($sDatabase)?$sDatabase:$iniSet["DBSet"]["sDatabase"];
			$sUser = ($sUser)?$sUser:$iniSet["DBSet"]["sUser"];
			$sPassWord = ($sPassWord)?$sPassWord:$iniSet["DBSet"]["sPassWord"];
			
			$conn = $this->SystemDBService->CreateDBConnection($sServer,$sDatabase,$sUser,$sPassWord);
			//回傳
			return $conn;
		}
		
		//用於單純INSERT、UPDATE、DELETE等
		//ExecuteNonQuery(sSqlText)
		public function ExecuteNonQuery($sSqlText){
			$execut = false;
			if( !empty($sSqlText) ){
				$execut = $this->SystemDBService->ExecuteNonQuery($sSqlText);
				if(!$execut){
					print_r('Error SQL: '.$sSqlText);
				}
			}
			return $execut;
		}
		
		//讀取資料 QueryData(sSqlText) as DataTable
		public function QueryData($sSqlText){
			if( !empty($sSqlText) ){
				$data = $this->SystemDBService->QueryData($sSqlText);
			}
			return $data;	
		}
		
		//建立Transcation機制 CreateMySqlTranscation
		public function Transcation(){
			$this->SystemDBService->Transcation();
		}
		
		//Commit Transction機制 CommitMySqlTranscation
		public function Commit(){
			$this->SystemDBService->Commit();
		}
		
		//Rollback Transction機制 RollbackMySqlTranscation
		public function Rollback(){
			$this->SystemDBService->Rollback();
		}
		
		//關閉資料庫連線 CloseConnection
		public function DBClose(){
			$this->SystemDBService->DBClose();
		}
	#這裡是SystemDBService 結束
		
	#這裡是	SystemToolsService
	#modIO
		//讀取頁面Html檔案
		public function GetHtmlContent($fPath){
			return $this->SystemToolsService->GetHtmlContent($fPath);
		}
		
		//讀取INI檔資料 GetINIInfo(strIniFile, sSection, sKeyName, sDefaultValue = "") As String
		public function GetINIInfo($strIniFile,$sSection,$sKeyName,$sDefaultValue = "",$originDataArray = false){
			return $this->SystemToolsService->GetINIInfo($strIniFile,$sSection,$sKeyName,$sDefaultValue,$originDataArray);
		}
		
		//使用cmd執行指令
		public function cmdExecute($sCommand){
			return $this->SystemToolsService->cmdExecute($sCommand);
		}
		
		//建立資料夾 CreateDirectory(sPath)
		public function CreateDirectory($sPath){
			$this->SystemToolsService->CreateDirectory($sPath);
		}
		
		//建立檔案 CreateFile(sFileFullPath)
		public function CreateFile($sFileFullPath){
			$this->SystemToolsService->CreateFile($sFileFullPath);
		}
		
		//複製檔案 CopyFile(sOrgFileFullPath, sOutFileFullPath)
		public function CopyFile($sOrgFileFullPath, $sOutFileFullPath){
			$this->SystemToolsService->CopyFile($sOrgFileFullPath, $sOutFileFullPath);
		}
		
		//複製資料夾 CopyField(sOrgFieldPath, sOutFieldPath)
		public function CopyField($sOrgFieldPath, $sOutFieldPath){
			$this->SystemToolsService->CopyField($sOrgFieldPath, $sOutFieldPath);
		}
		
		//刪除檔案 DelFile(sFilePath)
		public function DelFile($sFilePath){
			$this->SystemToolsService->DelFile($sFilePath);
		}
		
		//刪除資料夾 DelField(sFieldPath)
		public function DelField($sFieldPath){
			$this->SystemToolsService->DelField($sFieldPath);
		}
		
        //產生ＰＤＦ檔案
        public function Page2PDF($ChangePagePagth , $saveFileName, $zoom = 1){
            return $this->SystemToolsService->Page2PDF($ChangePagePagth , $saveFileName, $zoom);
        }
        
        
		//寫LOG檔 ThreadLog(clsName, funName, sDescribe = "", sEventDescribe = "", iErr = 0) ??放哪???
		public function ThreadLog($clsName, $funName, $sDescribe = "", $sEventDescribe = "", $iErr = 0){
			$this->SystemToolsService->ThreadLog($clsName, $funName, $sDescribe, $sEventDescribe, $iErr);
		}
	#modIO結束
		
	#modDataFormate
		//日期轉換
		public function DateTime($changeType,$Date=null){
			$dateStr = $this->SystemToolsService->DateTime($changeType,$Date);
			if(!$dateStr){
				print_r("Error Date Type: ".$changeType."; or Date: ".$Date);
				return false;
			}
			return $dateStr;
		}
		
		//資料轉換成json(encode)
		public function Data2Json($Data){
			return $this->SystemToolsService->Data2Json($Data);
		}
		
		//json轉換成資料轉(decode)
		public function Json2Data($JsonData){
			return $this->SystemToolsService->Json2Data($JsonData);
		}
	#modDataFormate結束
		
	#DataInformationSecurity
		//資訊全重複檢查是否有遺漏的，並取代為HTML CODE
		public function replacePackage($arr){
			$tmpArr = $this->SystemToolsService->replacePackage($arr);
			return $tmpArr;
		}
	#DataInformationSecurity結束
		
	#modArrayDebug
		public function debug($DataArray){
			$this->SystemToolsService->debug($DataArray);
		}
	#modArrayDebug結束
	
	#modCurl相關
		//POST
		public function UrlDataPost($url, $SendArray) {
			//回傳結果是對象URL執行結果
			return $this->SystemToolsService->UrlDataPost($url, $SendArray);
		}
		//GET
		public function UrlDataGet($url) {
			//回傳結果是對象URL執行結果
			return $this->SystemToolsService->UrlDataGet($url);
		}
	#modCurl結束
	
	#這裡是	SystemToolsService 結束
	#開始SystemFrameService
		
        //新增按鈕
        public function CreateInsertOptionBtn($listID, $actionUrl, $processFunction = '', $BtnStyleClass = ''){
            $btnStylePath = dirname(__DIR__) . "\\pageSetting\\styles\\option_btn\\Insert.html";
            $BtnContent = $this->GetHtmlContent($btnStylePath);
            
            //回傳按鈕結果
            return $this->SystemFrameService->CreateInsertOptionBtn($BtnContent, $listID, $actionUrl, $processFunction, $BtnStyleClass);
        }
        
        //編輯按鈕
        public function CreateModifyOptionBtn($DataArray, $actionUrl, $inputClass, $contentClass, $processFunction = '', $ActionID = 'uid', $BtnStyleClass = ''){
            $btnStylePath = dirname(__DIR__) . "\\pageSetting\\styles\\option_btn\\Modify.html";
            $BtnContent = $this->GetHtmlContent($btnStylePath);
            
            //回傳按鈕結果
            return $this->SystemFrameService->CreateModifyOptionBtn($BtnContent, $DataArray, $actionUrl, $inputClass, $contentClass, $processFunction, $ActionID, $BtnStyleClass);
        }
        
        //刪除按鈕
        public function CreateDeleteOptionBtn($DataArray, $actionUrl, $rowID, $processFunction='', $ActionID = 'uid', $BtnStyleClass = ''){
            $btnStylePath = dirname(__DIR__) . "\\pageSetting\\styles\\option_btn\\Delete.html";
            $BtnContent = $this->GetHtmlContent($btnStylePath);
            
            //回傳按鈕結果
            return $this->SystemFrameService->CreateDeleteOptionBtn($BtnContent, $DataArray, $actionUrl, $rowID, $processFunction, $ActionID, $BtnStyleClass);
        }
        
        //刪除按鈕
        public function CreateFinishOptionBtn($DataArray, $actionUrl, $inputClass, $contentClass, $processFunction = '', $ActionID = 'uid', $BtnStyleClass = ''){
            $btnStylePath = dirname(__DIR__) . "\\pageSetting\\styles\\option_btn\\Finish.html";
            $BtnContent = $this->GetHtmlContent($btnStylePath);
            
            //回傳按鈕結果
            return $this->SystemFrameService->CreateFinishOptionBtn($BtnContent, $DataArray, $actionUrl, $inputClass, $contentClass, $processFunction, $ActionID, $BtnStyleClass);
        }
        
	#結束SystemFrameService
	}
	
	
?>