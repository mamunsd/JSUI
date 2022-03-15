/// <reference path="../jquery/jquery-3.6.0.min.js"/>
/// <reference path="./PE_COMMON_LIB_FEB_2022.js"/>

class  PeScrlRcVw_01 {
    /**
     * যেসব প্যারামিটার দিতে হবে কনস্ট্রাকশনে বা ক্লাস টাকে
     * কোন কালেকশন বা টেবিলে কোয়েরী করবে, কোয়রীর প্রজেকশন মানে কি কি ফিল্ড চায়, কোয়েরির ফিল্টার মানে where cluse বা মঙ্গোতে ফিল্টার
     * @param {String} params.apiUrl কোন URL এ ডেটা কোয়েরী প্যারামিটার দিয়ে রেকর্ড পুল করবে, একটা একটা এজাক্স পোস্ট কল
     * @param {String} params.cntID ডকুমেন্টের যে ডম এ (div বা যেকোনো কিছু) এই কনট্রোলটা এটাচ হবে তার আইডি
     * @param {BigInteger} params.recPerSegment প্রতি বার রেস্ট কোয়েরী তে সার্ভার থেকে কতটা রেকর্ড আনবে , এইটা হলো একটা সেগমেন্ট
     * ডিসপ্লেতে এরকম 1 সেগমেন্ট এর ডেটা দেখা যাবে
     * @param {BigInteger} params.livingSegments এই ক্লাস বা কনট্রোল টোটাল কতো টা সেগমেন্ট রাখবে .. 
     * অর্থাৎ 5 টা সেগমেন্ট থাকলে আর 20 টা রেকর্ড পার সেগমেন্ট থাকলে টোটাল 100 টা রেকর্ড কনট্রোলের কাছে লাইভ থাকবে
     * @param {BigInteger} params.viewFeed প্রতিবার ভিউ তে কতোটা রেকর্ড যুক্ত হবে আর বাদ পড়বে স্ক্রল করার সময়
     * =====================================================================
     *
     * 
     * */    
    
    constructor (c_params) {
        let thisObject = this;
        thisObject.domID = PERandID(15);
        thisObject.c_params = c_params;
        thisObject.crtRecTgStr = thisObject.c_params.fn_rcString
        // একটিভিটি বন্ধ করার জন্য ভেরিয়েবল
        thisObject.actlock = false;
        // রেকর্ড পুল করা বন্ধ করার জন্য
        thisObject.recordPoolLock = false;
         // এই এরেটাতে যে রেকর্ড গুলা ডিসপ্লে বা ইউআইতে আছে সেই রেকর্ড গুলা থাকে
        thisObject.dispRecs = [];
        // এই এ্যারেতে সার্ভার থেকে পুল করা সব রেকর্ড থাকে
        thisObject.livingRecords = [];
        
        thisObject.orderdQparams = {};
        thisObject.orderdQparams.filter = {}

        thisObject.queryParams = {}        
        thisObject.queryParams.filter ={}
        thisObject.queryParams.qconfig = {}
        thisObject.queryParams.qconfig.sort = {_id: thisObject.c_params.recDirection * -1}
        thisObject.queryParams.qconfig.limit = thisObject.c_params.recPerSegment * thisObject.c_params.livingSegments;
        
        thisObject.dfltQueryParams = JSON.parse(JSON.stringify(thisObject.queryParams));

        thisObject.getRcordTagString = thisObject.c_params.fn_rcString;
        // console.log(thisObject.c_params.cntID);
        thisObject.jqContainer = jQuery("#"+thisObject.c_params.cntID);
        
        
        // console.log(thisObject.dfltQueryParams);
        thisObject.attachStyles().then(()=>{

            thisObject.attachDom().then((jqDomObj)=>{
                thisObject.jqDom = jqDomObj;
                thisObject.initNewQuery(thisObject.queryParams).then(()=>{
                    // console.log(`Query Initialized and total Living Records: ${thisObject.livingRecords.length}`);
                });
            });
        });        
    }

    attachStyles() {
        return new Promise((resolve, reject)=>{
            let cssText = `                /* এই স্টাইল ট্যাগ টা  PeScrlRcVw_01 ক্লাস লিব থেকে যুক্ত*/
                .uiblocker {
                    position: fixed;
                    top:0;
                    left: 0;
                    height: 100vh;
                    width: 100vw;
                    z-index: 9000;
                    background-color: rgba(0,0,200, .0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .hourGlass {
                    width: 100px;
                }
                /* PeScrlRcVw_01 এর থেকে যুক্ত স্টাইল এখানে শেষ */
            `;
            cssText = `<style>${cssText}</style>`;
            $("head").append(cssText);
            resolve(true);
        });
    }
    
    attachDom() {
        // console.log("Dom Attachement Execution Started")
        let thisObject = this;
        let domTagText = `
            <div id="${thisObject.domID}" class="${thisObject.c_params.domClasses}">
            </div>
        `;
        return new Promise((resolve, reject)=>{
            thisObject.jqContainer.append(domTagText);
            let jqDom = jQuery("#"+thisObject.domID);
            setTimeout(()=>{
                PEwinResizeManage();
            }, 500);
            resolve(jqDom);
        });
    }

    poolRecords(queryParams) {
        let thisObject = this;
        let thisQueryParams = queryParams;
        console.clear();
        console.log(queryParams);
        return new Promise((resolve, reject)=> {
            let postData = {}
            postData.q_collection = thisObject.c_params.q_collection;
            postData.filter = thisQueryParams.filter;
            postData.qconfig = thisQueryParams.qconfig;
            // postData.qconfig.sort = {_id: -1}
            // postData.filter = {srcmac: "E4:8D:8C:3A:FF:C0".toLocaleLowerCase()};
            peJqAjaxPost(thisObject.c_params.apiUrl, postData).then((rcvData)=> {
                // console.log(rcvData);
                let processed_records = []
                for(let thisItem of rcvData) {
                    thisItem.rec_id = thisItem._id;
                    processed_records.push(thisItem);
                }
                resolve(processed_records);
            });            
        });
    }

    blockUi() {
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            let blockingTag = `
                <div id="${thisObject.domID}_uiblk" class="uiblocker">
                    <div class="hourGlass">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve"><path style="fill:#b2f3ff" d="M128 496v-40.592a79.998 79.998 0 0 1 12.619-43.125L229.6 273.25a31.992 31.992 0 0 0 .004-34.494l-88.986-139.04A80.005 80.005 0 0 1 128 56.592V16h256v40.592a80.002 80.002 0 0 1-12.618 43.124L282.4 238.75a31.99 31.99 0 0 0-.003 34.494l88.986 139.039A80.016 80.016 0 0 1 384 455.408V496"/><path style="fill:#51dbff" d="M128 56.592a80.002 80.002 0 0 0 12.618 43.124l88.985 139.04a31.99 31.99 0 0 1-.003 34.494l-88.981 139.033A80 80 0 0 0 128 455.408V496h128V16H128v40.592z"/><path style="fill:#9e6459" d="M392 32H120c-8.837 0-16-7.163-16-16s7.163-16 16-16h272c8.837 0 16 7.163 16 16s-7.163 16-16 16zM392 512H120c-8.837 0-16-7.163-16-16s7.163-16 16-16h272c8.837 0 16 7.163 16 16s-7.163 16-16 16z"/><path style="fill:#feb" d="M357.039 437.441a55.6 55.6 0 0 0-5.875-12.223l-49.625-77.531a7.995 7.995 0 0 0-6.734-3.688h-77.609a7.993 7.993 0 0 0-6.734 3.688l-49.633 77.531a55.91 55.91 0 0 0-5.867 12.223A7.996 7.996 0 0 0 162.54 448h186.922a7.996 7.996 0 0 0 7.577-10.559zM249.266 224.949a7.994 7.994 0 0 0 13.468 0l33.688-52.637a7.986 7.986 0 0 0 .281-8.152 7.99 7.99 0 0 0-7.016-4.16h-67.375a7.991 7.991 0 0 0-7.016 4.16 7.988 7.988 0 0 0 .281 8.152l33.689 52.637z"/><path style="fill:#f7aa6b" d="M222.313 160a7.991 7.991 0 0 0-7.016 4.16 7.988 7.988 0 0 0 .281 8.152l33.688 52.637a7.995 7.995 0 0 0 6.734 3.688V160h-33.687zM256 344h-38.805a7.993 7.993 0 0 0-6.734 3.688l-49.633 77.531a55.91 55.91 0 0 0-5.867 12.223 7.996 7.996 0 0 0 7.578 10.559H256V344z"/><path style="fill:#7e5c62" d="M256 0H120c-8.836 0-16 7.163-16 16 0 8.836 7.164 16 16 16h136V0zM256 480H120c-8.836 0-16 7.163-16 16 0 8.836 7.164 16 16 16h136v-32z"/></svg>
                    </div>
                </div>
            `;
            jQuery("body").append(blockingTag);
            resolve();
        });
    }

    releaseUi() {
        let thisObject = this;
        jQuery(`#${thisObject.domID}_uiblk`).remove();
    }
    
    initNewQuery(queryParams) {
        let thisObject = this;
        thisObject.queryParams = queryParams;
        // সব লিভিং রেকর্ড খালি করে দেওয়া হলো
        thisObject.livingRecords =[];
        // ডিসপ্লের রেকর্ড এরেটাও খালি করে দেওয়া হলো
        thisObject.dispRecs =[];
        // queryParams.filter = {srcmac: "4c:5e:0c:c9:06:41".toLocaleLowerCase()};
        // queryParams.filter.conntmstmp = {$lt: 1637622237, $gt: 1637607837};
        
        thisObject.queryParams = JSON.parse(JSON.stringify(queryParams));

        return new Promise((resolve, reject)=>{
            thisObject.blockUi().then(()=>{
                thisObject.poolRecords(queryParams).then((records)=>{
                    // UI এর সকল ভিজিবল রেকর্ড খালি করে দেওয়া হলো
                    thisObject.jqDom.empty();
                    thisObject.livingRecords = records;
                    // console.log(records)
                    
                    for(let i=0; i < thisObject.c_params.recPerSegment; i++) {
                        if(thisObject.livingRecords[i]) {
                            let thisRec = thisObject.livingRecords[i];
                            let recTag = thisObject.c_params.fn_rcString(thisRec);

                            if(thisObject.c_params.viewDirection == -1) {
                                thisObject.jqDom.prepend(recTag);
                            }
                            if(thisObject.c_params.viewDirection == 1) {
                                thisObject.jqDom.append(recTag);
                            }
                            thisObject.dispRecs.push(thisRec);
                        }
                    }
                    // =====================
                    // console.clear();
                    // for(let bal of thisObject.livingRecords) {
                    //     console.log(`নম্বর: ${bal.IID} ম্যাক: ${bal.srcmac} অজবেক্ট আইডি: ${bal.rec_id}`);
                    // }
                    // =====================
                    thisObject.releaseUi();
                    resolve();
                });
            });
        });
    }

    refreshQuery() {
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            thisObject.initNewQuery(thisObject.dfltQueryParams).then(()=> {
                thisObject.orderdQparams.filter = {};
                resolve;
            });
        });
    }

    lockact() {
        let thisObject = this;
        thisObject.actlock = true;
        thisObject.blockUi();
    }

    unlockact() {
        let thisObject = this;
        thisObject.actlock = false;
        thisObject.releaseUi();
    }

    segmentUp() {
        // console.clear()
        let thisObject = this;

        return new Promise((resolve, reject)=> {
            console.log("segment will be up");
            // console.log(thisObject.queryParams)
            
            let last_rec_id = thisObject.livingRecords[thisObject.livingRecords.length - 1].rec_id;
            // console.log(last_rec_id);
            let poolParams = thisObject.queryParams;            
            poolParams.qconfig.sort = {_id: thisObject.c_params.recDirection * -1}
            if(thisObject.c_params.recDirection == -1) {
                poolParams.filter._id = {$gt: last_rec_id};
            }

            if(thisObject.c_params.recDirection == 1) {
                poolParams.filter._id = {$lt: last_rec_id};
            }
            
            poolParams.qconfig.limit = thisObject.c_params.recPerSegment;
            if(thisObject.recordPoolLock == false) {
                thisObject.recordPoolLock == true;
                // console.log(poolParams);
                thisObject.poolRecords(poolParams).then((neRecords)=> {
                    
                    for(let i = 0; i < neRecords.length ; i++) {
                        thisObject.livingRecords.shift();
                    }
    
                    for(let record of neRecords) {
                        // console.log(`নম্বর: ${record.IID} ম্যাক: ${record.srcmac} অজবেক্ট আইডি: ${record.rec_id}`);
                        thisObject.livingRecords.push(record);
                    }
                    // for(let record of thisObject.livingRecords) {
                    //     console.log(`নম্বর: ${record.IID} ম্যাক: ${record.srcmac} অজবেক্ট আইডি: ${record.rec_id}`);
                    // }
                    thisObject.recordPoolLock = false;
                    resolve();
                });
            }else {
                resolve();
            }
        });
    }

    segmentDown() {
        // console.clear()
        let thisObject = this;

        return new Promise((resolve, reject)=> {
            thisObject.blockUi();
            // console.log("segment will be Down");
            let first_rec_id = thisObject.livingRecords[0].rec_id;
            // console.log(first_rec_id);
            let poolParams = thisObject.queryParams;
            poolParams.qconfig.sort = {_id: thisObject.c_params.recDirection * 1}

            if(thisObject.c_params.recDirection == -1) {
                poolParams.filter._id = {$lt: first_rec_id};
            }

            if(thisObject.c_params.recDirection == 1) {
                poolParams.filter._id = {$gt: first_rec_id};
            }
            
            poolParams.qconfig.limit = thisObject.c_params.recPerSegment;

            if(thisObject.recordPoolLock == false) {
                thisObject.recordPoolLock == true;
                thisObject.poolRecords(poolParams).then((neRecords)=> {

                    for(let i = 0; i < neRecords.length ; i++) {
                        thisObject.livingRecords.pop();
                    }

                    for(let record of neRecords) {
                        // console.log(`নম্বর: ${record.IID} ম্যাক: ${record.srcmac} অজবেক্ট আইডি: ${record.rec_id}`);
                        thisObject.livingRecords.unshift(record);
                    }
                    // for(let record of thisObject.livingRecords) {
                    //     console.log(`নম্বর: ${record.IID} ম্যাক: ${record.srcmac} অজবেক্ট আইডি: ${record.rec_id}`);
                    // }
                    thisObject.recordPoolLock = false;
                    thisObject.releaseUi();
                    resolve(neRecords);
                });
            }else {
                resolve;
            }
        });
    }

    forwardDispMulti() {
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            if(thisObject.actlock == false) {
                thisObject.lockact();

                // Index of First Displayed Record in Main Living Record
                // এই ভেরিয়েবলে থাকবে -> এখনে প্রথম যে রেকর্ড টা ডিসপ্লেতে আছে লিভিং রেকর্ড এরেতে তার পজিশন কত
                let indexOfFirstRec = 0;
                // Index of Last Displayed Record in Main Living Record
                // এই ভেরিয়েবলে থাকবে -> এখনে প্রথম যে রেকর্ড টা ডিসপ্লেতে আছে লিভিং রেকর্ড এরেতে তার পজিশন কত
                let indexOfLastRec = 0;

                for(let lc = 0; lc < thisObject.c_params.viewFeed; lc++) {
                    // ডিসপ্লের প্রথম রেকর্ড এর রেকর্ড আইডি
                    let dispFirstRecId = thisObject.dispRecs[0].rec_id;
                    // ডিসপ্লের লাস্ট রেকর্ড এর রেকর্ড আইডি
                    let dispLastRecId = thisObject.dispRecs[thisObject.dispRecs.length - 1].rec_id;
                    // ডিসপ্লের প্রথম রেকর্ড এর ডম আইডি, ডিসপ্লেতে রেকর্ড ডম তৈরীর সময় ই এর রেকর্ড আইডি দিয়ে প্রতিটা
                    // রেকর্ড ডম তৈরী হয়
                    let firstRecDom = jQuery(`#${thisObject.domID} > #${dispFirstRecId}`);
                    
                    // Index of Last Displayed Record in Main Living Record
                    // ডিসপ্লের শেষ রেকর্ড এর পজিশ ইন Living রেকর্ড
                    indexOfLastRec = thisObject.livingRecords.findIndex((element)=>{
                        return element.rec_id === dispLastRecId;
                    });

                    // Index of First Displayed Record in Main Living Record
                    // এইটা হলো ডিসপ্লের প্রথম রেকর্ড যেটা আছে সেটার Lviving Record এ পজিশন বা ইনডেক্স
                    // বের করা হচ্ছে
                    indexOfFirstRec = thisObject.livingRecords.findIndex((element)=>{
                        return element.rec_id === dispFirstRecId;
                    });
                    // console.log(indexOfFirstRec);
                    // লিভিং রেকর্ড কে প্রয়োজন অনুযায়ি ডেটাবেইজ থেকে পরিবর্তন করে secmentup আর segmentdown
                    // আর এই ফাংশন টা একটা করেই লিভিং রেকর্ড থেকে ডিসপ্লেতে রেকর্ড ফরওয়ার্ড বা ব্যাকওয়ার্ড করে
                    // সুতরাং ডিসপ্লের শেষ রেকর্ড টা কখনো লিভিং রেকর্ড এর শেষ রকর্ড হতে পারে
                    // তাই চেক করা হচ্ছে যে ডিসপ্লের লাস্ট রেকর্ড এর লিভিং রেকর্ড এর ইনডেক্ট টাই শেষ না
                    if(indexOfLastRec < (thisObject.livingRecords.length - 1)) {
                        let nextIndex = indexOfLastRec + 1;
                        let nextRecord = thisObject.livingRecords[nextIndex];
                        let nextRecString = thisObject.crtRecTgStr(nextRecord);
                        // ডিসপ্লের বর্তমা প্রথম রের্ড এর ডম টা রিমুভ করা হচ্ছে
                        firstRecDom.remove();
                        // ডিসপ্লেইং রেকর্ড এর এরের প্রথম এলিমেন্ট টা ও সরানো হলো
                        thisObject.dispRecs.shift();

                        if(thisObject.c_params.viewDirection == -1) {
                            thisObject.jqDom.prepend(nextRecString);
                        }

                        if(thisObject.c_params.viewDirection == 1) {
                            thisObject.jqDom.append(nextRecString);
                        }
                        // লিভিং রেকর্ড থেকে পাওয়া পরবর্তি রেকর্ড টা
                        // ডিসপ্লে রেকর্ড এরেতে পুশ করা হলো অর্থাৎ শেষ যুক্ত করা হলো
                        thisObject.dispRecs.push(nextRecord);
                    }
                }
                setTimeout(()=>{
                    if(indexOfLastRec > thisObject.c_params.recPerSegment * 2) {
                        thisObject.segmentUp();
                    }

                    if(thisObject.c_params.viewDirection == -1 ) {
                        
                    }
                    if(thisObject.c_params.viewDirection == 1) {
                    
                    }
                    thisObject.unlockact();
                    resolve();
                }, 50);
            }else {
                resolve();
            }
        });
    }

    backDispMulti() {
        let thisObject = this;
        return new Promise((resolve, reject)=> {
            if(thisObject.actlock == false) {
                thisObject.lockact();

                // Index of First Displayed Record in Main Living Record
                let indexOfFirstRec = 0;
                // Index of Last Displayed Record in Main Living Record
                let indexOfLastRec = 0;

                for(let lc = 0; lc < thisObject.c_params.viewFeed; lc++) {
                    // ডিসপ্লের প্রথম রেকর্ড এর রেকর্ড আইডি
                    let dispFirstRecId = thisObject.dispRecs[0].rec_id;
                    // ডিসপ্লের শেস রেকর্ড এর রেকর্ড আইডি
                    let dispLastRecId = thisObject.dispRecs[thisObject.dispRecs.length - 1].rec_id;
                    // লাস্ট রেকর্ড এর জেক্যুয়েরী ডম
                    let LastRecDom = jQuery(`#${thisObject.domID} > #${dispLastRecId}`);
                    
                    // Index of Last Displayed Record in Main Living Record
                    indexOfLastRec = thisObject.livingRecords.findIndex((element)=>{
                        return element.rec_id === dispLastRecId;
                    });
        
                    // Index of First Displayed Record in Main Living Record
                    indexOfFirstRec = thisObject.livingRecords.findIndex((element)=>{
                        return element.rec_id === dispFirstRecId;
                    });
        
                    if(indexOfFirstRec > 0) {
                        let nextIndex = indexOfFirstRec - 1;
                        let nextRecord = thisObject.livingRecords[nextIndex];
                        let nextRecString = thisObject.crtRecTgStr(nextRecord);
                        LastRecDom.remove();
                        thisObject.dispRecs.pop();
        
                        if(thisObject.c_params.viewDirection == -1) {
                            thisObject.jqDom.append(nextRecString);
                        }
        
                        if(thisObject.c_params.viewDirection == 1) {
                            thisObject.jqDom.prepend(nextRecString);
                        }
        
                        thisObject.dispRecs.unshift(nextRecord);
                    }
                }
                setTimeout(()=>{
                    // console.log(indexOfFirstRec);
                    if(indexOfFirstRec < thisObject.c_params.recPerSegment * 2) {
                        thisObject.segmentDown().then((neRecords)=>{
                            if(neRecords.length > 0) {
                                if(indexOfFirstRec == 0) {
                                    console.log(`Display Was At 0 Pos but more ${neRecords.length} has been pooled`);
                                    thisObject.dispRecs =[];
                                    thisObject.jqDom.empty();

                                    for(let i=0; i < thisObject.c_params.recPerSegment; i++) {
                                        if(thisObject.livingRecords[i]) {
                                            let thisRec = thisObject.livingRecords[i];
                                            let recTag = thisObject.c_params.fn_rcString(thisRec);
                
                                            if(thisObject.c_params.viewDirection == -1) {
                                                thisObject.jqDom.prepend(recTag);
                                            }
                                            if(thisObject.c_params.viewDirection == 1) {
                                                thisObject.jqDom.append(recTag);
                                            }
                                            thisObject.dispRecs.push(thisRec);
                                        }
                                    }
                                }                                
                            }
                        });
                    }
                    if(thisObject.c_params.viewDirection == -1 ) {
                        
                    }
                    if(thisObject.c_params.viewDirection == 1) {
                        
                    }
                    thisObject.unlockact();
                    resolve();
                }, 50);

            }else {
                resolve();
            }
        });
    }
    // বাইরে থেকে এসাইন করতে হবে এই ফাংশন, যেহেতু টেমপ্লেটিং লাগবে
    crtRecTgStr(record) {
    }
    getRecFromDisRecId(prec_id) {
        let thisObject = this;
        let indexOfRec = thisObject.dispRecs.findIndex((element)=>{
            return element.rec_id === prec_id;
        });
        return thisObject.dispRecs[indexOfRec];
    }
}