/// <reference path="vendor/jquery/jquery-3.6.0.min.js"/>
/// <reference path="vendor/pe/PE_COMMON_LIB_FEB_2022.js"/>
/// <reference path="vendor/pe/PE_DB_SCROLL_VIEW_FEB_2022.js"/>





let fn_rcString = function makeRecordTagString(record) {
    // let extmp = parseInt(record.rec_id.toString().substring(0,8), 16);
    let tagS = `
    <div id="${record.rec_id}" class="singleRecord">
        <div class="rec-header">
            <div class="rec_item rec_iid">${record.IID}</div>
            <div class="rec_item rec_user_id">${record.USER_ID}</div>
            <div class="rec_item rec_channel">${record.CHANNEL}</div>
            <div class="rec_item rec_room_name">${record.ROOM_NAME}</div>
        </div>
        <div class="rec_content rec_content">${record.CONTENT}</div>
        <div class="rec_item">${record.TS}</div>
    </div>
    `;
    // console.log(record);
    return tagS;
}
function applyFilter(rcvobject) {
    let queryParams = JSON.parse(JSON.stringify(rcvobject.dfltQueryParams));
    queryParams.filter = rcvobject.orderdQparams.filter;
    rcvobject.initNewQuery(queryParams).then(()=>{
        if(rcvobject.orderdQparams.filter.hasOwnProperty("srcmac")) {
            jQuery("#filterMacInput").val(rcvobject.orderdQparams.filter.srcmac);            
        }
        if(rcvobject.orderdQparams.filter.hasOwnProperty("dstip")) {
            jQuery("#filterdIpInput").val(rcvobject.orderdQparams.filter.dstip);
        }
        if(rcvobject.orderdQparams.filter.hasOwnProperty("natip")) {
            jQuery("#filterNtIpInput").val(rcvobject.orderdQparams.filter.natip);
        }
    });    
}

jQuery(()=>{
    let rcdvprm = {}
    // rcdvprm.apiUrl = 'http://self.okkhor.link:9928/api/GeneralQuery';
    rcdvprm.apiUrl = 'http://self.okkhor.link:9928/api/generalQuery';
    rcdvprm.cntID = "myContPanel"
    rcdvprm.domClasses = "RcVwWiget hAsPrr"
    rcdvprm.q_collection = "short_messages";
    rcdvprm.recPerSegment = 20;
    rcdvprm.livingSegments = 5;
    rcdvprm.viewFeed = 5;
    rcdvprm.recDirection = 1;
    rcdvprm.viewDirection = -1;
    
    rcdvprm.fn_rcString = fn_rcString;
    let myRceordView = new PeScrlRcVw_01(rcdvprm);
    
    function testQuery() {
        // myRceordView.queryParams.filter.srcmac = "98:de:d0:e2:a8:cf";
        // myRceordView.queryParams.filter.conntmstmp = 1637476000;
        // myRceordView.queryParams.filter.conntmstmp = {$lt: 1637476000, $gt: 1637475000};
        myRceordView.initNewQuery(myRceordView.queryParams).then(()=>{
            // console.log(myRceordView.livingRecords);
            // console.log(myRceordView.dispRecs);
        });
    }

    // Button Actions
    jQuery(document).on("click", "#bttmPanel > .rcNav", (event)=> {
        let btn = jQuery(event.currentTarget);
        let recDom = btn.closest(".singleRecord");
        let fltFld = btn.attr("data-name");
        let rec_id = recDom.attr("id");
        let thisRec = myRceordView.getRecFromDisRecId(rec_id);
        // console.clear();
        // console.log(thisRec);

        if(fltFld == "Frwd-View") {
            console.clear()
            myRceordView.forwardDispMulti().then(()=>{
                myRceordView.unlockact();
            });
        }
        if(fltFld == "Backwd-View") {
            myRceordView.backDispMulti().then(()=>{
                myRceordView.unlockact();
            });
        }        
    });
    // অটো ফরওয়ার্ড চেক করার জন্য
    //     setTimeout(()=>{
    //         setInterval(() => {
    //             myRceordView.forwardDispMulti()
    //         }, 3000);
    //    }, 60000)
});

jQuery(()=> {
   
});