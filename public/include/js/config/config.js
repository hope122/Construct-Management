
//var apurl="http://211.21.170.18:99";
//var apurl="http://127.0.0.1:88";
var apurl="http://211.21.170.18:99";
//var apurl="http://127.0.0.1:88";
var originUrl = location.origin+'/';
var configObject = {
    "LoginUrl": "http://211.21.170.18:99/login",
    "langSet":"http://211.21.170.18:99/lang/page",
    "processLoginUrl": originUrl+"menter/setlogin",
    "getmenu": "http://211.21.170.18:99/pageaction/getmenu",
    "menuProcess": originUrl+"pageaction/menuprocess",
    "getPosition": originUrl+"pageaction/acposition",
    "MaterialInsert":apurl+"/material/dbinsert",
    "MaterialModify":apurl+"/material/dbmodify",
    "MaterialDelete":apurl+"/material/dbdelete",
    "MaterialGetData":apurl+"/material/getdbdata",
    "QCInsert":apurl+"/qc/dbinsert",
    "QCModify":apurl+"/qc/dbmodify",
    "QCDelete":apurl+"/qc/dbdelete",
	"getPosition": originUrl+"pageaction/acposition",
	"SARGetworkerdata": apurl+"/sar/getworkerdata",
	"SARRecordAttendance": apurl+"/sar/recordattendance",
	"getPosition": "pageaction/acposition",
	"SARGetworkerdata": apurl+"/sar/getworkerdata",
	"SARRecordAttendance": apurl+"/sar/recordattendance",
    "logbookGetData":apurl+"/logbook/getdbdata",
    "logbookInsert":apurl+"/logbook/dbinsert",
    "logbookModify":apurl+"/logbook/dbmodify",
    "getPosition": originUrl+"pageaction/acposition",
    "getAcInfo": originUrl+"pageaction/acinfo",
    "socketConn": "http://211.21.170.18:7077",
    "getPosition": "pageaction/acposition",
};
