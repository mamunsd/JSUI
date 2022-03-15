// এইখানে মডিউলের নামে ক্লাস বানাইতে হবে
class ContentList extends peUiModule {

    constructor(params) {
        super(params)
        let thisObject = this;
        // এইখানে মডিউলের নাম লেখতে হবে
        thisObject.pemodname = "ContentList"
        return thisObject;
    }

    async initMod() {
        await super.initMod();
        await this.activateBtns();
        await this.activateGrid()
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
    async activateBtns() {
        let thisObject = this;
        thisObject.jqDom.on("mousedown", "pebtn", async(e)=>{
            let btnjq = jQuery(e.currentTarget);
            btnjq.addClass("clicked");
        })

        thisObject.jqDom.on("mouseup", "pebtn", async(e)=>{
            let btnjq = jQuery(e.currentTarget);
            btnjq.removeClass("clicked");
            let btnName = btnjq.attr("pe-name")
            switch (btnName) {
                case "aplyFilter":
                    await thisObject.applyFilter();
                    break;
                case "value":
                    await thisObject.printVals();
                    break;
                case "Forward":
                    thisObject.rcv.forwardDispMulti();
                    break;
                case "Backward":
                    thisObject.rcv.backDispMulti();
                    break;
            }
        })
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
    async activateGrid() {
        let thisObject = this;

        let fn_rcString = function makeRecordTagString(record) {
            // let extmp = parseInt(record.rec_id.toString().substring(0,8), 16);
            let tagS = `
            <div id="${record.rec_id}" class="singleRecord">
                <div class="rec-header">
                    <div class="rec_item rec_iid">${record.IID}</div>
                    <div class="rec_item rec_iid">${record.rec_id}</div>
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

        let rcdvprm = {}
        rcdvprm.apiUrl = 'http://self.okkhor.link:9928/api/generalQuery';
        rcdvprm.cntID = thisObject.domID;
        rcdvprm.domClasses = "RcVwWiget hAsPrr"
        rcdvprm.q_collection = "short_messages";
        rcdvprm.recPerSegment = 20;
        rcdvprm.livingSegments = 5;
        rcdvprm.viewFeed = 5;
        rcdvprm.recDirection = 1;
        rcdvprm.viewDirection = 1;
        
        rcdvprm.fn_rcString = fn_rcString;
        thisObject.rcv = new PeScrlRcVw_01(rcdvprm);

        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
    async printVals() {
        let thisObject = this;
        let myVal = await thisObject.getInputVals();
        console.clear();
        console.log(myVal);
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async applyFilter() {
        let thisObject = this;
        let inputvals = await thisObject.getInputVals();
        let rcvobject = thisObject.rcv;
        let queryParams = JSON.parse(JSON.stringify(rcvobject.dfltQueryParams));
        queryParams.filter = rcvobject.orderdQparams.filter;

        if(inputvals.USER_ID == "সবাই") {
            if(queryParams.filter.hasOwnProperty("USER_ID")) {
                delete queryParams.filter.USER_ID;
            }
        }else {
            queryParams.filter.USER_ID = inputvals.USER_ID
        }

        if(inputvals.ROOM_NAME == "সকল") {
            if(queryParams.filter.hasOwnProperty("ROOM_NAME")) {
                delete queryParams.filter.ROOM_NAME;
            }
        }else {
            queryParams.filter.ROOM_NAME = inputvals.ROOM_NAME
        }

        if(inputvals.CHANNEL == "সকল") {
            if(queryParams.filter.hasOwnProperty("CHANNEL")) {
                delete queryParams.filter.CHANNEL;
            }
        }else {
            queryParams.filter.CHANNEL = inputvals.CHANNEL;
        }

        rcvobject.initNewQuery(queryParams).then(()=>{
            
        });    
    }
}