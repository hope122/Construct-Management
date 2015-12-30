//var apurl=location.origin+":99";
var apurl = location.protocol+"//"+location.hostname+":99";
var originUrl = location.origin+'/';
var configObject = {
    "LoginUrl": apurl+"/login",
    "langSet": apurl+"/lang/page",
    "processLoginUrl": originUrl+"menter/setlogin",
    "getmenu": apurl+"/pageaction/getmenu",
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
	"SARReport": apurl+"/sar/report",
    "logbookGetData":apurl+"/logbook/getdbdata",
    "logbookInsert":apurl+"/logbook/dbinsert",
    "logbookModify":apurl+"/logbook/dbmodify",
    "getAcInfo": originUrl+"pageaction/acinfo",
    "socketConn": "http://211.21.170.18:7077",
	"empGetData": apurl+"/employeemanage/getdata",
	"empInsertData": apurl+"/employeemanage/insertdata", 
	"empUpdateData": apurl+"/employeemanage/updatedata",
    "ReceiptGetData": apurl+"/receipt/getdata",
    "ReceiptDetialList": originUrl+"receipt/detial",
    "ReceiptInsertData": apurl+"/receipt/insertdata",
    "GetLogo": originUrl+"pageaction/getlogo",
    "Logout": originUrl+"menter/logout",
    "getDailyContent": apurl+"/pageaction/getdailycontent",
    "getWorkProject": apurl+"/pageaction/getworkproject",
    "engGetData": apurl+"/engineeringmanage/getdata",
    "engSetView": originUrl+"engineeringmanage/setview",
    "engDeleteData": apurl+"/engineeringmanage/deletedata",
    "engInsertData": apurl+"/engineeringmanage/insertdata",
    "engUpdateData": apurl+"/engineeringmanage/updatedata",
    "chartsWS": location.origin+":8080",
    "SupplyInsert":apurl+"/supply/dbinsert",
    "SupplyModify":apurl+"/supply/dbmodify",
    "SupplyDelete":apurl+"/supply/dbdelete",
    "SupplyGetData":apurl+"/supply/getdbdata",
};