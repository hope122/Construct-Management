<?php		
	namespace SystemToolsService;
	
	
	class clsTools {
	#modIO
		//讀取頁面Html檔案
		public function GetHtmlContent($fPath){
			$fContent = '';
			if(file_exists($fPath)){
				$fContent = file_get_contents($fPath);
			}else{
				$fPath = str_replace("\\","/",$fPath);
				if(file_exists($fPath)){
					$fContent = file_get_contents($fPath);
				}
			}
			return $fContent;
			
		}
		
		//讀取INI檔資料 GetINIInfo(strIniFile, sSection, sKeyName, sDefaultValue = "") As String
		public function GetINIInfo($strIniFile,$sSection,$sKeyName,$sDefaultValue = "",$originDataArray = false,$process_sections = false){
            if(!file_exists($strIniFile)){
                $strIniFile = str_replace("\\","/",$strIniFile);
            }
			if($originDataArray){
				if(!$process_sections){
					return parse_ini_file($strIniFile);
				}else{
					return parse_ini_file($strIniFile,true);
				}
			}else{
				$iniContent = parse_ini_file($strIniFile,true);
				if(!empty($iniContent[$sSection])){
					foreach($iniContent[$sSection] as $i => $content){
						if($i == $sKeyName){
							return ($content)?$content:$sDefaultValue;
						}
					}
				}
			}
		}
		
		//使用cmd執行指令
		public function cmdExecute($sCommand){
			try{
				return shell_exec($sCommand);
			}catch(Exception $error){
				return false;
			}
		}
		
		//建立資料夾 CreateDirectory(sPath)
		public function CreateDirectory($sPath){
			if ( !is_dir($sPath) ){//檢查資料夾是否存在，不存在的話就創建資料夾
				try{
					mkdir($sPath);
				}catch(Exception $error){
					//創建失敗
					return false;
				}
			}
		}
		//建立檔案 CreateFile(sFileFullPath)
		public function CreateFile($sFileFullPath,$sFileContent,$writeType = "w"){
			try{
				$file = fopen($sFileFullPath,$writeType);
                fwrite($file,$sFileContent);
				fclose($file);
                return true;
			}catch(Exception $error){
				return false;
			}
		}
		//複製檔案 CopyFile(sOrgFileFullPath, sOutFileFullPath)
		public function CopyFile($sOrgFileFullPath, $sOutFileFullPath){
			try{
				copy($sOrgFileFullPath, $sOutFileFullPath);
			}catch(Exception $error){
				return false;
			}
		}
		//複製資料夾 CopyField(sOrgFieldPath, sOutFieldPath)
		public function CopyField($sOrgFieldPath, $sOutFieldPath){
			
			if(!is_dir($sOrgFieldPath)){  
				return false ;  
			} 
			
			$from_files = scandir($sOrgFieldPath);  

			//如果目的資料夾不存在，需創建
			if(!file_exists($sOutFieldPath)){  
				//若執行失敗，回傳
				if($this->CreateDirectory($sOutFieldPath)){
					return false;
				}
			}
			//開始進行複製動作，先檢查來源路徑是否不為空
			if( !empty($from_files)){  
				//確認後，開始解析
				foreach($from_files as $file){  
					if($file == '.' || $file == '..' ){  
						continue;  
					}  
					//如果來源是個資料夾，再執行一次本身
					if( is_dir($sOrgFieldPath.'/'.$file) ){
						$this->CopyField($sOrgFieldPath.'/'.$file, $sOutFieldPath.'/'.$file);  
					}else{
						//如果不是資料夾，是單一檔案，就開始複製
						copy($sOrgFieldPath.'/'.$file, $sOutFieldPath.'/'.$file);  
					}  
				}  
			}
			return true ;
		}
		
		//刪除檔案 DelFile(sFilePath)
		public function DelFile($sFilePath){
			try{
				unlink($sFilePath);
			}catch(Exception $error){
				return false;			
			}
			return true;
		}
		
		//刪除資料夾 DelField(sFieldPath)
		public function DelField($sFieldPath){
			if (!file_exists($sFieldPath)){
				return true;
			}
			if (!is_dir($sFieldPath) || is_link($sFieldPath)){
				return unlink($sFieldPath);
			}
			
			foreach (scandir($sFieldPath) as $item) {  
				if ($item == '.' || $item == '..'){
					continue;  
				}
				
				if (!$this->DelField($sFieldPath . "/" . $item)) {  
					chmod($sFieldPath . "/" . $item, 0777);  
					if (!$this->DelField($sFieldPath . "/" . $item)){
						return false;  
					}
				}  
			}
			
			try{
				rmdir($sFieldPath);
			}catch(Exception $error){
				return false;
			}
			return true;  
		}
        
		//產生ＰＤＦ檔案
        public function Page2PDF($ChangePagePagth , $saveFileName, $zoom){
            $OSCommand = 'ver';
            $OS = $this->cmdExecute($OSCommand);
            $zoomStr = '';
            if($zoom > 1 || $zoom < 1){
                $zoomStr = '--zoom '.$zoom;
            }
            $wkhtmltopdfPath = dirname(__DIR__).'\\..\\..\\';
            //return dirname(__DIR__);
            //是ＷＩＮＤＯＷＳ
            if($OS){
                //組合指令
                $wkhtmltopdfPath = $wkhtmltopdfPath.'windows_wkhtmltopdf\\wkhtmltopdf.exe';
            }else{//不是ＷＩＮＤＯＷＳ
                //MAC OSX
                $OSCommand = 'sw_vers';
                $OS = $this->cmdExecute($OSCommand);
                //是ＭＡＣ ＯＳＸ
                if($OS){
                    //組合指令
                    $wkhtmltopdfPath = str_replace("\\","/",$wkhtmltopdfPath);
                    $wkhtmltopdfPath = $wkhtmltopdfPath.'mac_wkhtmltopdf/wkhtmltopdf';
                }
            }
            
            if(file_exists($wkhtmltopdfPath)){
                if(strpos($saveFileName,".pdf") === false){
                    $saveFileName .= ".pdf";
                }
                $saveFileName = str_replace("\\","/",$saveFileName);
                $pdfCommand = $wkhtmltopdfPath.' '.$zoomStr.' '.$ChangePagePagth.' '.$saveFileName;
                try{
                    return $this->cmdExecute($pdfCommand);
                }catch(Exception $error){
                    return false;
                }
            }else{
                return $wkhtmltopdfPath.' file is not exists';
            }
        }
        
		//寫LOG檔 ThreadLog(clsName, funName, sDescribe = "", sEventDescribe = "", iErr = 0)
		public function ThreadLog($clsName, $funName, $sDescribe = "", $sEventDescribe = "", $iErr = 0){
			//創建檔案
			$this->CreateLogFileName($clsName, $funName, $sDescribe, $sEventDescribe);
		}

		//創建ＬＯＧ檔案
		private function CreateLogFileName($clsName, $funName, $sDescribe, $sEventDescribe, $sRemark = ""){
			global $callFunction;
			//依天創建Log檔案
			$creatFileName = "ststem-".$this->DateTime("CTime").".log";

			//處理序號
			$sThreadID = getmypid();
			//預備輸出內容
			$contentStr = "";

			if($sEventDescribe != ""){
				$contentStr .= ">> ".$sEventDescribe." <<"."\n";
			}

			$contentStr .= "[".$sThreadID."] ".$clsName." --> ".$funName." (".date("H:i:s")." ".$callFunction["line"].")\n";
			$contentStr .= "Desc:\n";
			$contentStr .= $sDescribe."\n";
			$contentStr .= "------------------------------------------\n";
			$filePath = dirname(__DIR__)."\\..\\..\\..\\sysLog\\";
			if(strpos($filePath,"/") >= 0){ //代表事ＭＡＣ或其他ＬＩＮＵＸ
				$filePath = str_replace("\\", "/", $filePath);
			}
			if(!file_exists($filePath)){//資料夾不存在 要創建
				$this->CreateDirectory($filePath);
			}
			//最後輸出的檔案名稱
			$filePath = $filePath.$creatFileName;
			$writeType = "a+";
			//存檔
			$this->CreateFile($filePath,$contentStr,$writeType);
		}
	#modIO結束
	
	#modDataFormate
		//日期轉換
		public function DateTime($changeType,$Date=null){
			$dateStr = "";
			$dateStyle = "";
			if($changeType != null or $changeType != ''){
				//先檢查日期是用哪種分割的
				if(strpos($Date,"/") !== false){
					$dateArr = explode("/",$Date);
					$dateStyle = "/";
				}else if(strpos($Date,"-") !== false){
					$dateArr = explode("-",$Date);
					$dateStyle = "-";
				}else{//不符合現在有的格式
                    if($changeType != "CTime" and $changeType != "CTime_Now"){
                        return false;
                    }
				}
				switch($changeType){
					//西元轉民國(年月日)
					case "ADyyyyMMdd_RCyyyMMdd":
						$dateStr = ($dateArr[0]-1911).$dateStyle.($dateArr[1]).$dateStyle.($dateArr[2]);
					break;
					//西元轉民國(年月)
					case "ADyyyyMM_RCyyyMM":
						$dateStr = ($dateArr[0]-1911).$dateStyle.($dateArr[1]);
					break;
					//民國轉西元(年月日)
					case "RCyyyMMdd_ADyyyyMMdd":
						$dateStr = ($dateArr[0]+1911).$dateStyle.($dateArr[1]).$dateStyle.($dateArr[2]);
					break;
					//日期轉時間秒數?
					case "CTime":
						$dateStr = date("Y-m-d");
					break;
					//取得現在時間秒數?
					case "CTime_Now":
						$dateStr = date("Y-m-d H:i:s");
					break;
				}
				return $dateStr;
			}
		}
				
		//資料轉換成json(encode)
		public function Data2Json($Data){
			return json_encode($Data);
		}
		
		//json轉換成資料轉(decode)
		public function Json2Data($JsonData){
			return json_decode($JsonData);
		}

		//資料內容取代
		public function ContentReplace($processData,$replaceContent){
			if(is_array($processData)){
				foreach ($processData as $key => $content) {
					$replaceContent = str_replace("@@".$key."@@", $content, $replaceContent);
				}
				return $replaceContent;
			}else{
				return false;
			}
		}
	#modDataFormate結束
		
	#DataInformationSecurity
		//資訊全重複檢查是否有遺漏的，並取代為HTML CODE
		public function replacePackage($arr){
			$tmpArr = array();
			if(!empty($arr)){
				foreach($arr as $i => $content){
					//若是多維陣列，再次處理
					if(is_array($content)){
						$arr[$i] = $this->replacePackage($content);
					}else{
						$arr[$i] = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
					}
				}
			}
			$tmpArr = $arr;
			return $tmpArr;
		}
	#DataInformationSecurity結束
		
	#modArrayDebug
		public function debug($DataArray){
			echo "<pre>";
			print_r($DataArray);
			echo "</pre>";
		}
	#modArrayDebug結束
	#modCurl取得網址相關內容
		public function UrlDataPost($url, $SendArray) {
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL,$url);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);	//quick fix for SSL
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $SendArray);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);  //skip ssl verify
															
			$response = curl_exec($ch);
			curl_close ($ch);
			
			return $response;
		}
		
		public function UrlDataGet($url) {

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			curl_setopt($ch, CURLOPT_URL, $url );
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);  //skip ssl verify
															
			$result = curl_exec($ch);
			curl_close ($ch);

			return $result;
		}
	#modCurl結束
	}
?>