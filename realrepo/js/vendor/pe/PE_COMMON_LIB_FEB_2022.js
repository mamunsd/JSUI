let VLRGXS = {
    "PE_URL" : new RegExp(/(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/),
    "PE_USER_NAME" : new RegExp(/^[a-zA-Z0-9]+[._]?[a-zA-Z0-9]+$/),
    "PE_NME_HUMAN" : new RegExp(/^\S[a-zA-Z\s]{2,128}$/),
    "PE_INTEGER" : new RegExp(/^\d+$/),
    "PE_FLOAT" : new RegExp(/^-?\d+\.?\d*$/),
    "PE_IP_ADDRESS" : new RegExp(/^(?:(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/),
    "PE_MAC_ADDRESS_D" : new RegExp(/((?:[a-zA-Z0-9]{2}[-]){5}[a-zA-Z0-9]{2})/),
    "PE_MAC_ADDRESS_C" : new RegExp(/((?:[a-zA-Z0-9]{2}[:]){5}[a-zA-Z0-9]{2})/),
    "PE_FQDN" : new RegExp(/(?=^.{1,253}$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$)/),
    "PE_PASS_EASY" : new RegExp(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,})\S$/),
    "PE_PASS_STRONG" : new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){10,}$/),
    "PE_EMAIL" : new RegExp(/^[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,6}?\.[a-zA-Z]{2,6}$/),
    "PE_BD_MOBILE" : new RegExp(/^(?:\+?88|0088)?01[15-9]\d{8}$/),
    "PE_BD_LANDLINE" : new RegExp(/^[0-9]{7}$/)
};
function isAndroid() {
    let userAgent = navigator.userAgent;
    if (userAgent.includes('Android')) {
        return true;
    } else {
        return false;
    }
}
/**
 * আমমরা টাইম ডেট টের একটা জেসোন বেইজড ফরমেট ব্যবাহার করি,
 * বিভিন্ন ল্যাংগুয়েজ আর সিস্টেম বিভিন্ন রকম ভাবে এইটা ব্যাবহার করার কারনে আমারা
 * জেসোন বেইজড ফর্মেটে ব্যাবহার করি
 * এখানে আমাদের তিনটা ফর্মেট আছে
 * কয়েকটা ফরমেট আছে যেমন ..
 * ডেট টাইমের ফর্মেটে কোনো টাইমজোন ইনফরমেশন নাই
 * সুতরাং বাই ডিফল্ট টাইম ইনফরমেশন টা লোকাল মেশিনের
 * এটাকে UTC এবং UTC থেকে লোকাল করার আলাদা ফাংশন আছে আমাদের এবং 
 * সেটা একচুয়ালী টাইমস্ট্যাম অর্থ EPOC / UNIX টাইমস্ট্যাম এর ইন্টিজার ভ্যালু লেভেলে হয়
 * {"hr" 12, "min" : 12, "sec" : 12, "seg": "am"} -> এইটা শুধু টাইম এর 12 আওয়ার ফর্মেট
 * {"hr" 23, "min" : 59, "sec" : 59} -> এইটা শুধু টাইম এর 24 আওয়ার ফর্মেট
 * {"dt" : 12, "mn" : 6, "yr" : 2002} -> এইটা শুধু ডেট ফর্মেট
 * {"dt" : 12, "mn" : 6, "yr" : 2002, "hr" 12, "min" : 12, "sec" : 12, "seg": "am"} -> এেইটা ডেট এবং টাইম এক সাথে ফর্মেট, এবং টাইম অংশ টা ১২ আওয়ার ফর্মেট
 */
// এইটা ফাংশন টাইমের 12 আওয়ার জেসোন ফর্মেট নিয়ে 24 আওয়ার জেসোন ফর্মেট রিটার্ন করে

function peTime12to24(prm) {
    if(prm.hr < 13 && prm.min < 60 && prm.sec < 60) {
        if(prm.hr == 12 && prm.seg == "am") {
            prm.hr = 0
        }else if (prm.hr == 12 && prm.seg == "pm") {
            
        }else if (prm.seg == "pm") {
            prm.hr = prm.hr + 12;
        }
        return {"hr" : prm.hr, "min" : prm.min, "sec" : prm.sec}
    }else {
        return false
    }
}

// এইটা ফাংশন টাইমের 24 আওয়ার জেসোন ফর্মেট নিয়ে 12 আওয়ার জেসোন ফর্মেট রিটার্ন করে
function peTime24to12(prm) {
    if(prm.hr < 24 && prm.min < 60 && prm.sec < 60) {
        if(prm.hr < 12) {
            prm.seg = "am"
        }else if (prm.hr == 12) {
            prm.seg = "pm"
        }else {
            prm.hr = prm.hr - 12
            prm.seg = "pm"
        }
        return prm;
    }else {
        return false
    }
}
// এইটা আমাদের 24 আওয়ার ফর্মেটের টাইমের ইন্টজার ভ্যলু রিটার্ন করে অর্থাৎ মোট কত সেকেন্ড
// কোথাও ডেট টাইম ইনফরমেশন সেভ করতে হলে আমরা ইন্টডজার ভ্যালু সেভ করি
// জেসোন ফর্মেট গুলা এন্ট্রি এবং ডিসপ্লে বা ভিউ এর জন্য .. যেহেতু মানুষ ঐ ভাবে অভ্যস্ত
function peTime24ToInt(prm) {
    if(prm.hr < 24 && prm.min < 60 && prm.sec < 60) {
        return (prm.hr * 60 * 60) + (prm.min * 60) + prm.sec
    }else {
        return false;
    }
}
// এইটা টাইমের ইন্টিজার ভ্যালু থেকে 24 আওয়ার জেসোন ফর্মেট রিটার্ন করে
function peTimeIntTo24 (secs) {
    let myReport = {}
    if(secs < 86400) {
        let hrReminder = (secs % 3600)
        myReport.hr = ((secs - hrReminder) / 3600)
        myReport.sec = (hrReminder % 60)
        myReport.min = ((hrReminder - myReport.sec) / 60)
        
        return myReport
    }else {
        return false;
    }
}

// এই ফাংশন টা লোকাল মেশিনের বর্তমানের second অংশ টুকু দেয়
function peGetCurrentSecondOfTime() {
    let myT = tsToTime(Math.round(Date.now())/1000)
    return myT.split(":")[2];
}

// এই ফাংশন 24 আওয়ারের জোসোন ডেট-টহম ফর্মেট নিয়ে UTC টাইমস্ট্যাম্প দিবে
function peDMYHMStoTSutc(value) {
    var datum = new Date(Date.UTC(value.yr, value.mn - 1, value.dt, value.hr, value.min, value.sec));
    return datum.getTime() / 1000;
}
// এই ফাংশন 24 আওয়ারের জোসোন ডেট-টাইম ফর্মেট নিয়ে Local টাইমস্ট্যাম্প দিবে
function peDMYHMStoTSlcl(value) {
    var datum = new Date(value.yr, value.mn - 1, value.dt, value.hr, value.min, value.sec);
    return datum.getTime() / 1000;
}
// এই ফাংশন জেসোন ডেট ফর্মেট নিয়ে UTC টাইম স্ট্যাম্প দিবে
function peDMYtoTSutc(value) {
    value.hr = 0;
    value.min = 0;
    value.sec = 0;
    return(peDMYHMStoTSutc(value));;
}

function peTStoDT24(ts) {
    mdate = new Date(ts * 1000);
    let report = {}
    report.dt = mdate.getDate();
    report.mn = mdate.getMonth() + 1;
    report.yr = mdate.getFullYear();
    report.hr = mdate.getHours();
    report.min = mdate.getMinutes();
    report.sec = mdate.getSeconds()
    return report;
}

function peTStoDT12(ts) {
    let Fmt24 = peTStoDT24(ts)
    let timePart = {"hr" : Fmt24.hr, "min" : Fmt24.min, "sec" : Fmt24.sec}
    let Fmt12 = peTime24to12(timePart);
    Fmt12.dt = Fmt24.dt;
    Fmt12.mn = Fmt24.mn;
    Fmt12.yr = Fmt24.yr;
    return Fmt12;
}

function setLocalTzOffset() {
    let d = new Date();
    window.tZoffset = d.getTimezoneOffset() * 1000;
}

// কোনো একটা বছর লিপইয়ার কিনা সেটা চেক করে
function peIsLeapY (year) {
    if((year % 4) == 0 ) {
        return true;
    }else {
        return false;
    }
}

// কোনো ইনপুট বক্স এ বা মাস্ক বক্স এর ডেট এন্ট্রি দিলে অর্থাৎ dd-mm-yy 
// এন্ট্রি দিলে সেইটার ফেব্রুয়ারী , লিপ ইয়ার, ৩০ দিনের মাস, ৩১ দিনের মাস
// এই সব ভ্যালিড আছে কিনা তা চেক করার জন্য . এখানে একটা জেসোন দিতে হয়, যেমন
// {"dt" : 29, "mn" : 02, "yr" : 2000}
function peIsValidDMY(dmy) {
    let datePart = dmy;
    let myReport = false;
    // যদি ফেব্রুয়ারী মাস হয়
    if(datePart.mn == 2) {
        // যদি লিপ ইয়ার হয়
        if(peIsLeapY(datePart.yr)) {
            // তাইলে যদি ডেট ২৯ হয়
            if(datePart.dt <= 29) {                    
                myReport = true;
                // console.log("লিপ ইয়ার ফেব্রুয়ারী");
            }
            // অথবা যদি লিপ ইয়ার না হয় তাইলে ডেট যদি ২৯ এর চেয়ে কম হয়
        }else if(datePart.dt <= 28) {
            myReport = true;
            // console.log("নট লিপ ইয়ার ফেব্রুয়ারী");
        }
    }else if(datePart.mn == 4 || datePart.mn == 6 || datePart.mn == 9 || datePart.mn == 11) {
        if(datePart.dt <= 30) {
            myReport = true;
            // console.log("তিরিশ দিনের মাস");
        }
    }else if (datePart.mn == 1 || datePart.mn == 3 || datePart.mn == 5 || datePart.mn == 7 || datePart.mn == 8 || datePart.mn == 10 || datePart.mn == 12) {
        if(datePart.dt < 32) {
            myReport = true;
            // console.log("একত্রিশ দিনের মাস");
        }
    }
    return myReport;
}
// এই ফাংশন টা মঙ্গোডিবি আইডি থেকে টাইমস্ট্যাম্প বাহির করার জন্য
// মঙ্গো রেকর্ড এর সাথে আসা আইডি টা একটা সার্কাস .. এইটা প্লেইন পাইতে 
// item._id["$oid"] এই ভাবে লিখতে হবে এই খানে item হইলো রেকর্ড টা
function jsdMongoIdToTs(mongoid) {
    return(parseInt(mongoid.substring(0, 8), 16));
}
// এই ফাংশন লোকাল ইউনিক্স টাইম দিতে হবে এবং রেজাল্ট লোকাল টাইমে দিবে
// এটা শুধু মাত্র ডেট
function tsToDate(UNIX_timestamp) {
    if (UNIX_timestamp > 100) {
        var a = new Date(UNIX_timestamp * 1000);
        var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = date + ' ' + month + ' ' + year;
        return time;
    } else {
        return 0;
    }
}
// এই ফাংশন লোকাল ইউনিক্স টাইম দিতে হবে এবং রেজাল্ট লোকাল টাইমে দিবে
// এইটা টাইমস্ট্যাম্প থেকে শুধু মাত্র টাইম পার্ট টুকুর রিটার্ন করবে
function tsToTime(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ':' + min + ':' + sec;
    return time;
}
// এই ফাংশন লোকাল ইউনিক্স টাইম দিতে হবে এবং রেজাল্ট লোকাল টাইমে দিবে
function tsToDateTime(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}
// এই ফাংশন টা লোকাল মেশিনের লোকাল টাইমস্টাম্প দেয়
var peNowLocalTS = jsdNowLocalTs
function jsdNowLocalTs() {
    // let now = new Date();
    // return Math.round(now.getTime() / 1000);
    return Math.round(Date.now() / 1000);
}

function jsdTsToUTCTs(unixTs) {
    let thisDate = new Date(unixTs * 1000);
    return (thisDate.getTime() + thisDate.getTimezoneOffset() * 60000) / 1000;
}

function jsdToTimestamp(year, month, day, hour, minute, second) {
    var datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    return datum.getTime() / 1000;
}

function jsdDateToTimestamp(year, month, day) {
    return jsdToTimestamp(year, month, day, 0, 0, 0);
}

// এই ফাংশন টা যেহেতু এজাক্স কল করে তাই এই ডেটা কলব্যাক ফাংশন দিয়ে ব্যাবহার করতে হবে
function jsdGetServerTime(mycallback) {
    $.post('/api/utils/getTime', {}, function(data) {
        data = JSON.parse(data);
        mycallback (data.currentTimestamp);
    });
}

function jsdStringToWordArray(mstring) {
    return mstring.split(/\s/);
}

function jsdXMLtojqDom(xmldoc) {
    let myxml = jQuery.parseXML(xmldoc),
    jqObject = jQuery(myxml);
    return jqObject;
    // $test = jqObject.find('story_1');
}

function placeLoadingPorda(configData) {
    let darken = 0.3;
    if(configData != null) {
        if (configData.hasOwnProperty('darken')) {
            darken = configData.darken;
        }
    }

    let pordatag = `
            <div id="loadingPorda" style="position: fixed; height: 100vh; width: 100vw; top:0; left: 0; z-index: 9999; display: flex; background-color: rgba(60, 70, 69, ${darken}); align-items: center; justify-content: center;">
                <div style="width: 200px; height: 200px; display: inline;">
                    <img style="width: 200px; height: 200px; margin: auto; user-select: none; "                    
                    src="public/css/loading.gif"/>
                </div>
                
            </div>
    `;

    if (configData != null) {
        if (configData.hasOwnProperty('containerId')) {
            $('#' + configData.containerId).append(pordatag);
        }else {
            $('body').append(pordatag);
        }
    } else {
        $('body').append(pordatag);
    }
}

function removeLoadingPorda() {
    $('#loadingPorda').remove();
}

function typingTimer(inputId, delay, myFunction) {
    let typingTimer; //timer identifier
    let $input = $('#' + inputId);

    //on keyup, start the countdown
    $input.on('keyup', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(myFunction, delay);
    });

    //on keydown, clear the countdown
    $input.on('keydown', function() {
        clearTimeout(typingTimer);
    });
}

function fileNameToTitle(fileName) {
    var reply = fileName.substring(0, fileName.length - 4);
    reply = reply
        .replace(/_/g, ' ')
        .replace(/\./g, ' ')
        .replace(/  +/g, ' ')
        .replace(/\-/g, ' ')
        .replace(/\s\s+/g, ' ');
    // reply = reply.replace(/:/g, " ");
    // reply = reply.replace(/./g, " ");
    return reply;
}

function jsdRandString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function peRandID(length) {
    var result           = '';
    var possiblec = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {
        result = result + possiblec.charAt(Math.floor(Math.random() * possiblec.length));
    }
    return result;
}
var PERandID = peRandID;

function jsdRanNum(myrange) {
    return Math.floor(Math.random() * myrange); 
}

function jsdRandMAC() {
    let ranmac = "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
        return "0123456789abcdef".charAt(Math.floor(Math.random() * 16));
    });
    return ranmac;
}

function peIsValid(value, peDataType) {
    let frpt = false;
    let rgmatch = false;

    if(VLRGXS.hasOwnProperty(peDataType)) {
        let myRx = VLRGXS[peDataType];
        report = value.match(myRx);
        if(report != null) {
            rgmatch = true;
        }
    }
    frpt = true;
    if(frpt == true && rgmatch == true) {
        return true;
    }else {
        return false;
    }

}

function ijValidCIDRv4(value) {
    var result = {};
    let rejex =
        '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\\/([0-9]|[1-2][0-9]|3[0-2]))$';
    if (value.match(rejex) == null) {
        result.result = false;
        result.message = 'নেটওয়ার্ক এড্রেস এমন হয় না';
    } else {
        result.result = true;
    }
    return result;
}

function checkLoginState() {
    let result = {};
    if (sessionStorage.getItem('identityData') === null) {
        result.report = false;
        return result;
    } else {
        result.report = true;
        return result;
    }
}

function JWTtoPayload(JWT) {
    var playload = JSON.parse(atob(JWT.split('.')[1]));
    return playload;
}

function getIdentityData() {
    if (sessionStorage.getItem('identityData') === null) {
        return null;
    } else {
        let identityData = sessionStorage.getItem('identityData');
        return JSON.parse(identityData);
    }
}

function appendApiKey(data) {
    if (sessionStorage.getItem('identityData') === null) {
        return data;
    } else {
        let identityData = sessionStorage.getItem('identityData');
        let apiKey = JSON.parse(identityData).jwt;
        data.apiKey = apiKey;
        return data;
    }
}

function formDataWithKey(formData) {
    if (sessionStorage.getItem('identityData') === null) {
        return data;
    } else {
        let identityData = sessionStorage.getItem('identityData');
        let apiKey = JSON.parse(identityData).jwt;
        formData.append('apiKey', apiKey);
        return formData;
    }
}

function jsdutoa(data) {
    return btoa(unescape(encodeURIComponent(data)));
}

function jsdatou(b64) {
    return decodeURIComponent(escape(atob(b64)));
}

function jsdutob(data) {
    let mya = jsdutoa(data)
    return atob(mya);
}
function jsdbtou(data) {
    let mya = btoa(data);
    return(jsdatou(mya));
}

// এগুলা নতুন করে করা কুড়ি সালের আগস্ট

function jsdVjsAjaxPost(url, queryJson, callBack) {
    return new Promise((resolve, reject)=> {
        fetch(url, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryJson)
        }).then((res)=> {
            return res.json();
        }).then((data)=> {
            if (typeof callBack === "undefined") {
                resolve(data);
            }else {
                callBack(data);
                resolve;
            }
        });
    });
}

function peJqAjaxPost(prmUrl, prmData) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: prmUrl,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(prmData),
        success: function (rcvData) {
          resolve(rcvData)
        },
        error: function (error) {
          reject(error)
        },
        timeout: 300000
      });
    });
}

function PeJqAjaxPostProms(myurl, postData, myTimeout) {
    return new Promise((resolve, reject)=>{
        jQuery.ajax({
            url: myurl,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function (rcvData) {
                resolve(rcvData);
            },
            error: function (myerr) {
                reject(myerr)
            },
            timeout: myTimeout * 1000
        });
    });
}

function PeJqAjaxGetProms(myurl, myTimeout) {
    return new Promise((resolve, reject)=>{
        jQuery.ajax({
            url: myurl,
            type: 'GET',
            success: function (rcvData) {
                resolve(rcvData);
            },
            error: function (myerr) {
                reject(myerr)
            },
            timeout: myTimeout * 1000
        });
    });
}