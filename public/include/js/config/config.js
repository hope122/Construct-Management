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
    "QCGetData":apurl+"/qc/getdbdata",
    "QCInsert":apurl+"/qc/dbinsert",
    "QCModify":apurl+"/qc/dbmodify",
    "QCDelete":apurl+"/qc/dbdelete",
	"SARGetworkerdata": apurl+"/sar/getworkerdata",
	"SARRecordAttendance": apurl+"/sar/recordattendance",
    "logbookGetData":apurl+"/logbook/getdbdata",
    "logbookInsert":apurl+"/logbook/dbinsert",
    "logbookModify":apurl+"/logbook/dbmodify",
    "getAcInfo": originUrl+"pageaction/acinfo",
    "socketConn": "http://211.21.170.18:7077",
	"empGetData": apurl+"/employeemanage/getdata",
	"empInsertData": apurl+"/employeemanage/insertdata", 
	"empUpdateData": apurl+"/employeemanage/updatedata",
};