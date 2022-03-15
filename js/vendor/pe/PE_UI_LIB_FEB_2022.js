/// <reference path="../jquery/jquery-3.6.0.js" />
/// <reference path="PE_COMMON_LIB_FEB_2022.js" />

String.prototype.peReplaceAt = function (index, replacement){
    return this.substring(0, index) +  replacement +  this.substring(index + 1);
}

jQuery.fn.hasAttr = function(attr) {
    let mcheck = this.attr(attr);
    if (typeof mcheck !== 'undefined' && mcheck !== false) {
        return true;
    }else {
        false;
    }
 };

 jQuery.fn.hasAttr_pe = function(attr) {
    let mcheck = this.attr(attr);
    if (typeof mcheck !== 'undefined' && mcheck !== false) {
        return true;
    }else {
        false;
    }
 };

 jQuery.fn.onChange_pe = function(cb) {
     let olval = this.val();
    this.keyup((e)=>{
        if(olval != this.val()) {
            cb();
        }
    })
    this.keydown((e)=>{
        olval = this.val();
    })
 };

var layout_location = "./"
var myStart = Date.now();
var myEnd = 0;

// এইখানে UI এলিমেন্ট গুলা ছাড়াও কিছু হেলপার আছে .. এইখানে তেমন একটা হে।পার ফাংশন
// বডির সাইজ যাতে সবসময় ভিউপোর্ট সাইজের সমান থাকে .. সে জন্য PEwinResizeManage() ফাংশন টা আছে এই ফাংশন কোনো 
// HTML ডকুমেন্ট এ কাজ করবে যদি বডিতে resize-manage ক্লাস টা থাকে; আর বডিতে যদি ঐ ক্লাস থাকে তাহলে বডির ভিতরে
// যত বক্স এ hAsPrr ক্লাস টা থাকবে সবার হাইট তার প্যারেন্ট এর হাইটে সমান করবে getParrentHeightWidht এই ফাংশন টা বডির ভিতরের
// যেকোনো বক্স কে তার প্যারেন্ট এর হাইট ওয়াইডেথ দেয় .. আর PEwinResizeManage() এই ফাংশন বডিকে রিসাইজ করে কার কার .hAsPrr ক্লাস আছে
// সেইটা খুজে বের করে প্রত্যককে যার যার নিজের প্যারেন্ট এর সামানা হাইট ওয়াইডেথ দেওয়ার জন্য প্রত্যেকের উপরে getParrentHeightWidht() ফাংশন টা
// এপ্লাই করে
function getParrentHeight(thisMe) {
    let myParent = thisMe.parent()
    let pHeight = myParent.innerHeight()
    let pwidth = myParent.innerWidth()
    // console.log(`My Name is ${thisMe.attr("data-pename")} Current Height is:${thisMe.innerHeight()} and My Parrent height is:${myParent.innerHeight()} and My Reading is:${pHeight} `)
    thisMe.innerHeight(pHeight)
    thisMe.css("max-height", pHeight+"px");
    // console.log(`After Change my Height is: ${thisMe.innerHeight()}`);
    // thisMe.innerWidth(pwidth)
}

function getParrentWidth(thisMe) {
    let myParent = thisMe.parent()
    let pHeight = myParent.innerHeight()
    let pwidth = myParent.innerWidth()
    // thisMe.innerHeight(pHeight)
    thisMe.innerWidth(pwidth)
}
// এই ফাংশন টা বডির ভিতরের সকল এলিমেন্ট এর হাইট ওয়াইডেথ তার প্যারেন্টের সমান করে
// এইটা কাজ করার জন্য বডিতে resize-manage ক্লাস টা থাকতে হবে এবং
function PEwinResizeManage() {
    // যেসব ডম এ hAsPrr ক্লাস থাকবে তারা হাইট রিসাইজ করবে তার প্যারেন্ট এর সাথে
    let psizehSeekers = jQuery("body").find(".hAsPrr");
    // যেসব ডম এ wAsPrr ক্লাস থাকবে তারা width রিসাইজ করবে তার প্যারেন্ট এর সাথে
    let psizewSeekers = jQuery("body").find(".wAsPrr");

    jQuery("body").innerHeight(window.innerHeight);
    jQuery("body").innerWidth(window.innerWidth);

    for(let mindex = 0; mindex < psizehSeekers.length; mindex++) {
        let thisJqEl = jQuery(psizehSeekers[mindex]);
        getParrentHeight(thisJqEl);
    }

    for(let mindex = 0; mindex < psizewSeekers.length; mindex++) {
        let thisJqEl = jQuery(psizewSeekers[mindex]);
        getParrentWidth(thisJqEl);
    }
}
// এইখানের থেকে লাইব্রেরী টা ইনক্লুডেড থাকলে .. জেক্যুয়েরী রেডি হওয়ার পরে রিসাইজ ম্যানেজের কাজ টা করে
// শর্ত হলো বডিতে resize-manage ক্লাস টা থাকতে হবে
jQuery(()=>{
    if(jQuery("body").hasClass("resize-manage")) {
        PEwinResizeManage();
        jQuery(window).resize(()=>{
            setTimeout(()=>{
                PEwinResizeManage();
            }, 100)
        });
    }    
});

 async function pedelay(ms) {
     return new Promise((resolve, reject)=>{
         setTimeout(()=>{
            resolve();
         }, ms)
     })
 }


function pe_attach_style(url, name) {
    return new Promise((resolve, reject)=>{
        jQuery(`[pe-nametag="${name}"]`).remove();
        PeJqAjaxGetProms(url, 30).then((data)=> {
            fulTag = `<style pe-nametag="${name}">
            ${data}
            </style>`;
            jQuery("head").append(fulTag);
            resolve();
        })
    });
}

function pe_attach_styles(name) {
    return new Promise((resolve, reject)=>{
        let murl = `./${name}.css`
        // let murl = `${layout_location}${name}/${name}.css`
        let mname = `${name}`;
        return pe_attach_style(murl, mname)
        .then(()=>{
            let murl = `./${name}_pc.css`
            // let murl = `${layout_location}${name}/${name}_pc.css`
            let mname = `${name}_pc`;
            return pe_attach_style(murl, mname)
        })
        .then(()=>{
            let murl = `./${name}_mob.css`
            // let murl = `${layout_location}${name}/${name}_mob.css`
            let mname = `${name}_mob`;
            return pe_attach_style(murl, mname)
        })
        .then(()=>{
            let murl = `./${name}_tab.css`
            // let murl = `${layout_location}${name}/${name}_tab.css`
            let mname = `${name}_tab`;
            pe_attach_style(murl, mname)
            resolve();
        })
    })    
}

function pe_process_markup(mktext, nid) {
    return new Promise((resolve, reject)=>{
        let processed = mktext.replace('data-pe-fid=""', `id="${nid}"`)
        resolve(processed)
    });
}

// সার্ভার সাইড বা url থেকে মার্কআপ / টেমপ্লেট আনার জন্য ফাংশন
function pe_get_markup(params) {
    return new Promise((resolve, reject)=>{
        let murl = ``;
        if(params.hasOwnProperty("url")) {
            murl = params.url;
        }else {
            if(params.hasOwnProperty("name")) {
                let name = params.name;
                murl = `${layout_location}${name}/${name}.html`;
            }else {
                reject
            }
        }
        PeJqAjaxGetProms(murl, 30)
        .then((data)=> {
            resolve(data);
        });
    })
}
// সার্ভার থেকে বা অন্য কোনো সোর্স থেকে ডকুমেন্ট এ javascritp কোড এড করার ফাংশন
function pe_attach_js(name) {
    url = `${layout_location}${name}/${name}.jsx`;
    return new Promise((resolve, reject)=>{
        PeJqAjaxGetProms(url, 30).then((data)=> {
            let fullTag = `<script data-pe-nametag-what="${name}">${data}</script>`;
            jQuery('body').append(fullTag);
            resolve();
        });
    })
}
// মডিউল হিসাবে ডকুমেন্ট এ প্রথমে জাভাস্ক্রিপ্ট আসবে .. তার পরে সে আসার পরে .. অন্য আর কোনো রিসোর্স আনতে হইলে আনবে
async function peLoadModule(name) {
    let jsxUrl = `${window.modUrlPrefix}/${name}/${name}.jsx`;
    // console.log(jsxUrl);

    jsxCode = await PeJqAjaxGetProms(jsxUrl, 30);
    
    let scrptag = `
                <script data-pe-modname="${name}">
                    ${jsxCode}
                </script>
                `;
    jQuery("body").append(scrptag);
    return new Promise((resolve, reject)=>{
        resolve();
    })
}


class peNotification {

    constructor(params) {
        let thisObject = this;
        thisObject.params = params;
        this.txtMsg = "No Message Provided";
        if(params.hasOwnProperty("txtMsg")) {
            thisObject.txtMsg = params.txtMsg;
        }
        this.domID = peRandID(10);
        return thisObject;
    }

    async activate() {
        let thisObject = this;
        let domTag = `
            <div id="${thisObject.domID}" class="peNotfctn onbirth">
                <title></title>
                <content>
                    ${thisObject.txtMsg};
                </content>
                <footer></footer>
            </div>
        `;
        jQuery("body").append(domTag);
        setTimeout(async()=>{
            return new Promise((resolve, reject)=>{

                thisObject.jqDom = jQuery(`#${thisObject.domID}`);
                thisObject.jqDom.click(()=>{
                    thisObject.vanish();
                })
                setTimeout(async()=>{
                    thisObject.jqDom.removeClass("onbirth");
                    if(thisObject.params.hasOwnProperty("stay")) {

                    }else {
                        setTimeout(async ()=> {
                            thisObject.vanish();
                        }, 5000);
                    }                    
                    resolve();
                }, 20)                
            })
        }, 10)        
    }

    vanish() {
        let thisObject = this;
        thisObject.jqDom.addClass("onbirth");
        setTimeout(() => {
            thisObject.jqDom.remove();
            delete thisObject.instance;
        }, 1000);
    }
}

class peContainerUi {
    constructor (params) {
        let thisObject = this;
        thisObject.params = params;
        thisObject.domID = peRandID(15);
        thisObject.cntID = undefined;
        thisObject.jqcntDom = undefined;
        thisObject.jqDom = undefined;
        thisObject.uitype = undefined;
        thisObject.label = undefined;
        return thisObject;
    }

    async makeReady() {
        let thisObject = this;
        await thisObject.makeRootDomReady()

        return new Promise((resolve, reject)=>{
            resolve()
        })
    }

    async makeRootDomReady(params) {
        let thisObject = this;

        if(thisObject.params.hasOwnProperty("markup_source") && thisObject.params.hasOwnProperty("domID")) {

            if(thisObject.params.markup_source == "capture") {
                thisObject.domID = thisObject.params.domID;
                thisObject.jqDom = jQuery(`#${thisObject.domID}`);

                if(thisObject.params.hasOwnProperty("name")) {
                    thisObject.name = thisObject.params.name;
                }

                if(thisObject.jqDom.hasAttr_pe("pe-label")) {
                    thisObject.label = thisObject.jqDom.attr("pe-label")
                }
            }
            if(thisObject.params.hasOwnProperty("cntID")) {
                thisObject.cntID = thisObject.params.cntID;
                thisObject.jqcntDom = jQuery(`#${thisObject.cntID}`);
            }
        }else {

        }

        return new Promise((resolve, reject)=>{            
            setTimeout(()=>{
                resolve();
            }, 5);            
        })
    }

    async appendExtraDoms(params) {
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, 5)
        })
    }

    async makeExtendedReady(params) {
        let thisObject = this;
        thisObject.value = {};

        return new Promise((resolve, reject)=>{
            resolve()
        })
    }

    async hideUi(params) {
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async showUi(params) {
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async destroy(params) {
        let thisObject = this;
        if(params.hasOwnProperty(cbBfr)) {
            params.cbBfr();
        }
        thisObject.jqDom.remove();
        return new Promise((resolve, reject)=>{
            if(params.hasOwnProperty(cb)) {
                params.cb();
            }
            delete thisObject.instance;
            resolve();
        })
    }
}

class peInputUi {
    constructor(params) {
        this.params = params;
        this.isvalid = false;
        return this;
    }
    async makeReady() {
        let thisObject = this;
        await this.makeRootDomReady({})
        return new Promise((resolve, reject)=>{
            resolve()
        })
    }

    async makeRootDomReady(params) {
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            if(thisObject.params.hasOwnProperty("markup_source") && thisObject.params.hasOwnProperty("domID")) {

                if(thisObject.params.markup_source == "capture") {
                    thisObject.domID = thisObject.params.domID;
                    thisObject.jqDom = jQuery(`#${thisObject.domID}`);

                    if(thisObject.params.hasOwnProperty("name")) {
                        thisObject.name = thisObject.params.name;
                    }

                    if(thisObject.jqDom.hasAttr_pe("pe-label")) {
                        thisObject.label = thisObject.jqDom.attr("pe-label")
                    }
                }
            }
            setTimeout(()=>{
                thisObject.jqDom.attr("data-value-input", "true");
                resolve();
            }, 5);            
        })
    }

    async appendExtraDoms(params) {
        let thisObject = this;
        thisObject.jqDom.append(`<div class="peToolTip"></div><div class="bottom-line"></div>`);
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, 5)
        })
    }

    async makeExtendedReady(params) {
        let thisObject = this;
        thisObject.value = {};
        thisObject.entryHelp = "";
        thisObject.jqToolTip = thisObject.jqDom.find("> .peToolTip");
        thisObject.jqLabel = thisObject.jqDom.find("> .pelabel");
        thisObject.jqInput = thisObject.jqDom.find("> input[type=text]");
        thisObject.jqInput.attr("autocorrect", "off");
        thisObject.jqInput.attr("spellcheck", "false");
        thisObject.jqInput.attr("autocomplete", "bal");
        thisObject.jqInput.attr("readonly", "true");
        thisObject.jqInput.attr("pe-focus-stop", "true");
        thisObject.jqToolTip.click(()=>{
            thisObject.hideToolTip();
        })
        if (thisObject.jqDom.hasAttr("pe-entryHelp")) {
            thisObject.entryHelp = thisObject.jqDom.attr("pe-entryHelp");
            thisObject.jqLabel.click(()=>{
                this.showToolTip(thisObject.entryHelp);
            })
        }

        thisObject.jqInput.focusin(()=>{
            thisObject.jqDom.addClass("active")
            thisObject.jqInput.removeAttr("readonly")
            
        })

        thisObject.jqInput.focusout(()=>{
            thisObject.jqDom.removeClass("active")
            thisObject.jqInput.attr("readonly", "true");
        })
        thisObject.jqInput.keydown((e)=>{
            // console.log(e.key);
            if(e.key == "F1") {
                this.showToolTip();
            }else if(e.key == "Escape") {
                this.hideToolTip();
            }
        })
    }

    focusToNext() {
        let thisObject = this;
        if(thisObject.jqInput != undefined) {
            thisObject.jqInput.blur();
        }
    }

    async cValidate(params) {
        this.isvalid = true;
        let report = this.isvalid;
        return new Promise((resolve, rejet)=>{
            resolve(report);
        })
    }

    async getVal() {
        let thisObject = this;
        let ifValid = await this.cValidate();
        if(ifValid) {
            thisObject.value = thisObject.jqInput.val();
        }
        return new Promise((resolve, reject)=>{
            if(thisObject.isvalid) {
                resolve(thisObject.value);
            }else {
                resolve(false);
            }
        })
    }

    async setVal(value) {
        let thisObject = this
        thisObject.value = value;
        thisObject.jqInput.val(value)
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    showToolTip(msg) {
        let thisObject = this;
        thisObject.jqToolTip.find("*").remove();
        thisObject.jqToolTip.append(`<p>${msg}</p>`);
        thisObject.jqToolTip.addClass("visible");
    }
    hideToolTip() {
        this.jqToolTip.removeClass("visible");
    }
}

class peDMask extends peInputUi{
    constructor(params) {
        super(params)
        this.isInptUI = true;
    }

    async makeReady() {
        await super.makeReady()
        let thisObject = this;
        await this.appendExtraDoms();
        await this.makeExtendedReady();
        return new Promise((resolve, reject)=>{
         //    এই পরের দুই লাইন কমেন্ট করে রাখা হচ্ছে
         // টু চেক দ্যাট সুপার মানে প্যারেন্ট ক্লাসের makeReady() এই
         // এক্সটেনডেড ক্লাস টা দরকারি সব প্রপার্টি পাইছে
         // এবং এইটাকে রিজলভ এ দেরি করালেও ইনহেরিটেড প্রপার্টি গুলা কাজ করে
         //    console.log("Printing Beforme Full Resolve");
         //    console.log(thisObject.jqDom);
            setTimeout(()=>{
                 resolve()
            }, 2)
        })
     }

    async appendExtraDoms(params) {
        await super.appendExtraDoms(params)
        let thisObject = this;
        if(thisObject.jqDom.hasAttr_pe("pe-label")) {
            let labelTag = `<div class="pelabel">${thisObject.label}: </div>`
            thisObject.jqDom.append(labelTag);
        }
        let extraDomTag = `
        <input id="${thisObject.domID}_tx" class="pe-Din" type="text" value="__/__/____" placeholder="DD MM YYYY" maxlength="10"/>
        `;
        thisObject.jqDom.append(extraDomTag);
        return new Promise((resolv, reject)=>{
            setTimeout(()=>{
                resolv()
            }, 10)
        })
    }

    async makeExtendedReady(params) {
        await super.makeExtendedReady(params)
        let thisObject = this;
        let myInput = thisObject.jqInput;
        myInput.focus(()=>{
            myInput.caret(0)
        })
        // এই কনট্রোলের ইনপুট বক্স এ মোট 10 টা ক্যারেকটার থাকে
        /** 
         * ডে পার্ট = 2
         * ডে মান্থ সেপারেটর = 1
         * মান্থ পার্ট = 2
         * মান্থ ইয়ার সেপারেটার = 1
         * ইয়ার পার্ট = 4
        */
         myInput.focusin(()=>{
            setTimeout(() => {
                myInput.caret(0); 
            }, 50);            
        })
        
        myInput.keydown((e)=>{
            // console.clear()
            // এই preventDefault কল করে এই কনট্রোলের সকর কিবোর্ড ইন্টারেকশন বন্ধ করা হইছে
            // এই কনট্রোলে কোন কোনো key কাজ করবে আর কোনটাতে কি হবে তার সব কিছু এইখানে
            // হ্যান্ডেল করা
            e.preventDefault();
            let mkey_code = parseInt(e.keyCode)
            let o_caretpos = parseInt(myInput.caret())
            let myKey = e.key
            // console.log(myKey)
            let old_text = myInput.val();
            // console.log(`Pressed Key Code is ${mkey_code} and My Key is ${myKey} and Caret is at ${o_caretpos}`);
           
            // এন্টার চাপ দিল যা হবে
            if(mkey_code == 13) {
                // this.getVal();
            }
            // রাইট এরো কি চাপ দিলে কারসর ডানে সরার জন্য
            if(mkey_code == 37 && o_caretpos > 0) {
                myInput.caret(o_caretpos - 1)
            }
            // লেফট এরো কি চাপ দিলে কারসর বামে সরার জন্য
            if(mkey_code == 39 && o_caretpos <= 10) {
                myInput.caret(o_caretpos + 1)        
            }
            // Backspace চাপ দিলে অক্ষর কাটার জন্য
            if(mkey_code == 8 && o_caretpos > 0) {
                if(o_caretpos > 0 && o_caretpos !== 3 && o_caretpos !== 6 && o_caretpos) {
                    // console.log("Back")
                    // console.log(o_caretpos)
                    // console.log(old_text.charAt(o_caretpos - 1))
                    let new_text = old_text.peReplaceAt(o_caretpos-1, "_")
                    myInput.val(new_text)
                    
                }else {
                    // console.log("No Cut")
                }
                myInput.caret(o_caretpos-1)
            }

            // Delete চাপ দিলে অক্ষর কাটার জন্য
            if(mkey_code == 46 && o_caretpos < 9) {
                if(o_caretpos < 9 && o_caretpos !== 2 && o_caretpos !== 5 && o_caretpos) {
                    console.log("Back")
                    console.log(o_caretpos)
                    console.log(old_text.charAt(o_caretpos))
                    let new_text = old_text.peReplaceAt(o_caretpos, "_")
                    myInput.val(new_text)                    
                }
                myInput.caret(o_caretpos)              
            }
           
            // 48 - 57 পর্যন্ত এই দশটা হলো 1,2,3 ...9, 0 ক্যারেকটার
            // এই কনট্রোল কোনো আলফা key কাজ ই করবে না এইটা এনশিউর করা হইলো 
            if(mkey_code > 47 && mkey_code < 58) {
                if(o_caretpos !== 2 && o_caretpos !== 5 && o_caretpos < 10) {
                    // console.log(`Should Get, carpos is : ${o_caretpos}`);
                    let new_text = old_text.peReplaceAt(o_caretpos, myKey)
                    
                    if(o_caretpos == 0 && myKey > 3) {

                    } else if (o_caretpos == 1 ) {
                        // console.log(`caret pos ${o_caretpos}`)
                        let datePart = new_text.substring(0, 2)
                            if(parseInt(datePart) < 32) {
                                myInput.val(new_text);
                                let n_caretpos = o_caretpos + 2;
                                if(n_caretpos < 19) {
                                    myInput.caret(n_caretpos)
                                }
                            }                        
                    } else if (o_caretpos == 3 && myKey > 1){
                    
                    }else if (o_caretpos == 4) {
                        let monthPart = new_text.substring(3, 5)
                        if(parseInt(monthPart) < 13) {
                            myInput.val(new_text);
                            let n_caretpos = o_caretpos + 2;
                            if(n_caretpos < 10) {
                                myInput.caret(n_caretpos)
                            }
                        }
                    } else if(o_caretpos == 9){
                        let datePart = parseInt(new_text.substring(0, 2))
                        let monthPart = parseInt(new_text.substring(3, 5))
                        if(Number.isInteger(datePart) && Number.isInteger(monthPart)) {
                            myInput.val(new_text);
                            let n_caretpos = o_caretpos + 2;
                            if(n_caretpos < 19) {
                                myInput.caret(n_caretpos)
                            }
                        }
                    }   else{
                        myInput.val(new_text);
                        let n_caretpos = o_caretpos + 1;
                        if(n_caretpos < 10) {
                            myInput.caret(n_caretpos)
                        }
                    }
                }
            }           
        })

        return new Promise((resolve, reject)=>{
            resolve()
        })
    }

    async validate(params) {
        let vfspr = await super.getVal();
        let thisObject = this;
        let dval = {};
        dval.dt = parseInt(vfspr.substring(0, 2));
        dval.mn = parseInt(vfspr.substring(3, 5));
        dval.yr = parseInt(vfspr.substring(6, 10));
        thisObject.value = dval;
        thisObject.isvalid = peIsValidDMY(dval);
        return new Promise((resolve, reject)=>{
            resolve(thisObject.isvalid);
        })
    }

    async getVal() {
        let thisObject = this;
        let ifValid = await this.validate({});
        return new Promise((resolve, reject)=>{
            if(ifValid != false) {
                // console.log(thisObject.value);
                resolve(thisObject.value);
            }else {
                // console.log(thisObject.isvalid);
                resolve(false)
            }
        })
    }

    async setVal(value) {
        let thisObject = this;
        let boxVal = `${value.dt}/${value.mn}/${value.yr}`;
        thisObject.jqInput.val(boxVal);
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
}

class peTMask extends peInputUi {
    constructor(params) {
        super(params)
        this.isInptUI = true;
    }

    async makeReady(params) {
       await super.makeReady(params)
       let thisObject = this;
       thisObject.value = false;
       thisObject.hmsValue = false;
       await this.appendExtraDoms({});
       await this.makeExtendedReady({});
       return new Promise((resolve, reject)=>{
        //    এই পরের দুই লাইন কমেন্ট করে রাখা হচ্ছে
        // টু চেক দ্যাট সুপার মানে প্যারেন্ট ক্লাসের makeReady() এই
        // এক্সটেনডেড ক্লাস টা দরকারি সব প্রপার্টি পাইছে
        // এবং এইটাকে রিজলভ এ দেরি করালেও ইনহেরিটেড প্রপার্টি গুলা কাজ করে
        //    console.log("Printing Beforme Full Resolve");
        //    console.log(thisObject.jqDom);
           setTimeout(()=>{
                resolve()
           }, 2)
       })
    }

    async appendExtraDoms(params) {
        await super.appendExtraDoms(params);
        let thisObject = this;
        if(thisObject.jqDom.hasAttr_pe("pe-label")) {
            let labelTag = `<div class="pelabel">${thisObject.label}: </div>`
            thisObject.jqDom.append(labelTag);
        }
        let extraDomTag = `        
        <input id="${thisObject.domID}_tx" class="pe-Tin" type="text" value="__:__:__" placeholder="HH MM SS" maxlength="8"/>
        <div class="am-pm">am</div>
        `;
        thisObject.jqDom.append(extraDomTag);
        return new Promise((resolv, reject)=>{
            setTimeout(()=>{
                resolv()
            }, 10)            
        })
    }

    async makeExtendedReady(params) {
        await super.makeExtendedReady(params);
        let thisObject = this;
        
        thisObject.ambox = thisObject.jqDom.find(".am-pm");
        let myInput = thisObject.jqInput;
        
        // এই কনট্রোলের ইনপুট বক্স এ মোট 8 টা ক্যারেকটার থাকে
        /** 
         * টাইম পার্ট এর = 6
         * টাইম পার্ট এর দুইটা সেপারেটর = 2 
        */
        myInput.focusin(()=>{
            setTimeout(() => {
                myInput.caret(0); 
            }, 50);            
        })
        thisObject.ambox.click(()=>{
            if(this.ambox.html() == "am") {
                this.ambox.html("pm");
            }else {
                this.ambox.html("am");
            }
        })

        myInput.keydown((e)=>{
            // console.clear()
            // এই preventDefault কল করে এই কনট্রোলের সকর কিবোর্ড ইন্টারেকশন বন্ধ করা হইছে
            // এই কনট্রোলে কোন কোনো key কাজ করবে আর কোনটাতে কি হবে তার সব কিছু এইখানে
            // হ্যান্ডেল করা
            e.preventDefault();
            let mkey_code = parseInt(e.keyCode)
            let o_caretpos = parseInt(myInput.caret())
            let myKey = e.key
            // console.log(myKey)
            let old_text = myInput.val();
            // console.log(`Pressed Key Code is ${mkey_code} and My Key is ${myKey} and Caret is at ${o_caretpos}`);

            if(mkey_code == 13) {
                this.focusToNext();
            }

            // ট্যাব চাপ দিলে am/ pm টগল করার জন্য
            if(mkey_code == 32) {
                let ambox = thisObject.ambox
                if(ambox.html() == "am") {
                    ambox.html("pm");
                }else {
                    ambox.html("am");
                }
            }
           
            // রাইট এরো কি চাপ দিলে কারসর ডানে সরার জন্য
            if(mkey_code == 37 && o_caretpos > 0) {
                myInput.caret(o_caretpos - 1)
            }
            // লেফট এরো কি চাপ দিলে কারসর বামে সরার জন্য
            if(mkey_code == 39 && o_caretpos <= 8) {
                myInput.caret(o_caretpos + 1)        
            }
            // Backspace চাপ দিলে অক্ষর কাটার জন্য
            if(mkey_code == 8 && o_caretpos > 0) {
                if(o_caretpos > 0 && o_caretpos !== 3 && o_caretpos !== 6) {
                    // console.log("Back")
                    // console.log(o_caretpos)
                    // console.log(old_text.charAt(o_caretpos - 1))
                    let new_text = old_text.peReplaceAt(o_caretpos-1, "_")
                    myInput.val(new_text)
                    
                }else {
                    // console.log("No Cut")
                }
                myInput.caret(o_caretpos-1)
            }

            // Delete চাপ দিলে অক্ষর কাটার জন্য
            if(mkey_code == 46 && o_caretpos < 8) {
                if(o_caretpos < 8 && o_caretpos !== 2 && o_caretpos !== 5) {
                    console.log("Back")
                    console.log(o_caretpos)
                    console.log(old_text.charAt(o_caretpos))
                    let new_text = old_text.peReplaceAt(o_caretpos, "_")
                    myInput.val(new_text)                    
                }
                myInput.caret(o_caretpos)              
            }
           
            // 48 - 57 পর্যন্ত এই দশটা হলো 1,2,3 ...9, 0 ক্যারেকটার
            // এই কনট্রোল কোনো আলফা key কাজ ই করবে না এইটা এনশিউর করা হইলো 
            if(mkey_code > 47 && mkey_code < 58) {
                if(o_caretpos !== 2 && o_caretpos !== 5 && o_caretpos < 8) {
                    o_caretpos = myInput.caret()
                    let new_text = old_text.peReplaceAt(o_caretpos, myKey)                    
                    if(o_caretpos == 0 && myKey > 1) {

                    } else if (o_caretpos == 1 ) {
                        // console.log(`caret pos ${o_caretpos}`)
                        let hourPart = new_text.substring(0, 2)
                            if(parseInt(hourPart) < 13) {
                                myInput.val(new_text);
                                let n_caretpos = o_caretpos + 2;
                                if(n_caretpos < 8) {
                                    myInput.caret(n_caretpos)
                                }
                            }                        
                    } else if (o_caretpos == 3 && myKey > 5){
                    
                    }else if (o_caretpos == 4) {
                        let hourPart = new_text.substring(0, 2);
                        let minPart = new_text.substring(3, 5);
                        if(parseInt(minPart) < 60 && hourPart < 13) {
                            let curSec = peGetCurrentSecondOfTime();
                            if(curSec.length == 1) {
                                curSec = "0" + curSec;
                            }
                            // console.log(curSec)
                            let withSec = new_text.slice(0, -3) + ":" + curSec;
                            myInput.val(withSec)
                            // myInput.val(new_text);
                            let n_caretpos = o_caretpos + 2;
                            if(n_caretpos < 8) {
                                myInput.caret(n_caretpos)
                            }
                        }
                    }else if (o_caretpos == 6 && myKey > 5) {
                        
                    }else if (o_caretpos == 7) {
                        let hourPart = new_text.substring(0, 2);
                        let minPart = new_text.substring(3, 5);
                        let secPart = new_text.substring(6, 8);
                        if(parseInt(secPart) < 60 && parseInt(minPart) < 60 && hourPart < 13) {
                            myInput.val(new_text);
                            let n_caretpos = o_caretpos + 1;
                            myInput.caret(n_caretpos)
                        }
                        // console.log(`Second is : ${secPart}`)
                    } else{
                        myInput.val(new_text);
                        let n_caretpos = o_caretpos + 1;
                        if(n_caretpos < 8) {
                            myInput.caret(n_caretpos)
                        }
                    }                    
                }
            }           
        })
        return new Promise((resolve, reject)=>{
            resolve()
        })
    }

    async validate(params) {
        let pVal = await super.getVal();
        let thisObject = this;
        let tf12 = {};
        tf12.hr = parseInt(pVal.substring(0, 2));
        tf12.min = parseInt(pVal.substring(3, 5));
        tf12.sec = parseInt(pVal.substring(6, 8));
        tf12.seg = thisObject.ambox.html();

        if(tf12.hr < 13 && tf12.min < 60 && tf12.sec < 60) {
            thisObject.isvalid = true;
            thisObject.value = tf12;
        }else {
            thisObject.isvalid = false;
        }
        return new Promise((resolve, reject)=>{
            resolve(thisObject.isvalid);
        })
    }

    async getVal() {
        let thisObject = this;
        let ifValid = await this.validate();
        return new Promise((resolve, reject)=>{
            if(ifValid != false) {
                // console.log(thisObject.value);
                resolve(thisObject.value);
            }else {
                resolve(false);
            }
        })
    }

    async setVal(value) {

        let thisObject = this;

        if(value.hasOwnProperty("hr") && value.hasOwnProperty("min") && value.hasOwnProperty("sec") && value.hasOwnProperty("seg")) {
            let boxValue = `${value.hr}:${value.min}:${value.sec}`;
            thisObject.jqInput.val(boxValue);
            thisObject.ambox.html(value.seg);
        }

        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
}

class peDTMsk extends peInputUi {

    constructor(params) {
        super(params)
        this.isInptUI = true;
    }
    async makeReady(params) {
       await super.makeReady(params)
       let thisObject = this;
       await this.appendExtraDoms({});
       await this.makeExtendedReady({});
       return new Promise((resolve, reject)=>{
        //    এই পরের দুই লাইন কমেন্ট করে রাখা হচ্ছে
        // টু চেক দ্যাট সুপার মানে প্যারেন্ট ক্লাসের makeReady() এই
        // এক্সটেনডেড ক্লাস টা দরকারি সব প্রপার্টি পাইছে
        // এবং এইটাকে রিজলভ এ দেরি করালেও ইনহেরিটেড প্রপার্টি গুলা কাজ করে
        //    console.log("Printing Beforme Full Resolve");
        //    console.log(thisObject.jqDom);
           setTimeout(()=>{
                resolve()
           }, 2)
       })
    }

    async appendExtraDoms(params) {
        await super.appendExtraDoms(params);
        let thisObject = this;
        if(thisObject.jqDom.hasAttr_pe("pe-label")) {
            let labelTag = `<div class="pelabel">${thisObject.label}: </div>`
            thisObject.jqDom.append(labelTag);
        }
        let extraDomTag = `
        <input id="${thisObject.domID}_tx" class="pe-D-T" type="text" value="__/__/____ __:__:__" placeholder="DD MM YYYY HH MM SS" maxlength="19"/>
        <div class="am-pm">am</div>
        `;
        thisObject.jqDom.append(extraDomTag);
        return new Promise((resolv, reject)=>{
            setTimeout(()=>{
                resolv()
            }, 10)            
        })
    }

    async makeExtendedReady(params) {
        await super.makeExtendedReady(params);
        let thisObject = this;
        let myInput = thisObject.jqInput;
        thisObject.ambox = thisObject.jqDom.find(".am-pm");
        myInput.focus(()=>{
            myInput.caret(0)
        })
        // এই কনট্রোলের ইনপুট বক্স এ মোট 19 টা ক্যারেকটার থাকে
        /** 
         * ডে পার্ট = 2
         * ডে মান্থ সেপারেটর = 1
         * মান্থ পার্ট = 2
         * মান্থ ইয়ার সেপারেটার = 1
         * ইয়ার পার্ট = 4
         * ডেট টাইম সেপারেটার = 1
         * টাইম পার্ট এর = 6
         * টাইম পার্ট এর দুইটা সেপারেটর = 2 
        */

         myInput.focusin(()=>{
            setTimeout(() => {
                myInput.caret(0); 
            }, 50);            
        })
        thisObject.ambox.click(()=>{
            if(this.ambox.html() == "am") {
                this.ambox.html("pm");
            }else {
                this.ambox.html("am");
            }
        })
        
        myInput.keydown((e)=>{
            // console.clear()
            // এই preventDefault কল করে এই কনট্রোলের সকর কিবোর্ড ইন্টারেকশন বন্ধ করা হইছে
            // এই কনট্রোলে কোন কোনো key কাজ করবে আর কোনটাতে কি হবে তার সব কিছু এইখানে
            // হ্যান্ডেল করা
            e.preventDefault();
            let mkey_code = parseInt(e.keyCode)
            let o_caretpos = parseInt(myInput.caret())
            let myKey = e.key
            // console.log(myKey)
            let old_text = myInput.val();
            // console.log(`Pressed Key Code is ${mkey_code} and My Key is ${myKey} and Caret is at ${o_caretpos}`);
           
            // এন্টার চাপলে কি হবে সেইটা ঠিক করা
            if(mkey_code == 13) {
                this.getVal();
            }
            // ট্যাব চাপ দিলে am/ pm টগল করার জন্য
            if(mkey_code == 32) {
                let ambox = thisObject.jqDom.find(".am-pm");
                if(ambox.html() == "am") {
                    ambox.html("pm");
                }else {
                    ambox.html("am");
                }
            }
           
            // রাইট এরো কি চাপ দিলে কারসর ডানে সরার জন্য
            if(mkey_code == 37 && o_caretpos > 0) {
                myInput.caret(o_caretpos - 1)
            }
            // লেফট এরো কি চাপ দিলে কারসর বামে সরার জন্য
            if(mkey_code == 39 && o_caretpos <= 19) {
                myInput.caret(o_caretpos + 1)        
            }
            // Backspace চাপ দিলে অক্ষর কাটার জন্য
            if(mkey_code == 8 && o_caretpos > 0) {
                if(o_caretpos > 0 && o_caretpos !== 3 && o_caretpos !== 6 && o_caretpos !== 11 && o_caretpos !== 14 && o_caretpos !== 17 ) {
                    // console.log("Back")
                    // console.log(o_caretpos)
                    // console.log(old_text.charAt(o_caretpos - 1))
                    let new_text = old_text.peReplaceAt(o_caretpos-1, "_")
                    myInput.val(new_text)
                    
                }else {
                    // console.log("No Cut")
                }
                myInput.caret(o_caretpos-1)
            }

            // Delete চাপ দিলে অক্ষর কাটার জন্য
            if(mkey_code == 46 && o_caretpos < 18) {
                if(o_caretpos < 18 && o_caretpos !== 2 && o_caretpos !== 5 && o_caretpos !== 10 && o_caretpos !== 13 && o_caretpos !== 16 ) {
                    console.log("Back")
                    console.log(o_caretpos)
                    console.log(old_text.charAt(o_caretpos))
                    let new_text = old_text.peReplaceAt(o_caretpos, "_")
                    myInput.val(new_text)                    
                }
                myInput.caret(o_caretpos)              
            }
           
            // 48 - 57 পর্যন্ত এই দশটা হলো 1,2,3 ...9, 0 ক্যারেকটার
            // এই কনট্রোল কোনো আলফা key কাজ ই করবে না এইটা এনশিউর করা হইলো 
            if(mkey_code > 47 && mkey_code < 58) {
                if(o_caretpos !== 2 && o_caretpos !== 5 && o_caretpos !== 10 && o_caretpos !== 13 && o_caretpos !== 16 && o_caretpos < 19) {
                    
                    o_caretpos = myInput.caret()
                    let new_text = old_text.peReplaceAt(o_caretpos, myKey)
                    
                    if(o_caretpos == 0 && myKey > 3) {

                    } else if (o_caretpos == 1 ) {
                        console.log(`caret pos ${o_caretpos}`)
                        let datePart = new_text.substring(0, 2)
                            if(parseInt(datePart) < 32) {
                                myInput.val(new_text);
                                let n_caretpos = o_caretpos + 2;
                                if(n_caretpos < 19) {
                                    myInput.caret(n_caretpos)
                                }
                            }                        
                    } else if (o_caretpos == 3 && myKey > 1){
                    
                    }else if (o_caretpos == 4) {
                        let monthPart = new_text.substring(3, 5)
                        if(parseInt(monthPart) < 13) {
                            myInput.val(new_text);
                            let n_caretpos = o_caretpos + 2;
                            if(n_caretpos < 19) {
                                myInput.caret(n_caretpos)
                            }
                        }
                    } else if(o_caretpos == 9){                        
                        let datePart = parseInt(new_text.substring(0, 2))
                        let monthPart = parseInt(new_text.substring(3, 5))
                        if(Number.isInteger(datePart) && Number.isInteger(monthPart)) {
                            myInput.val(new_text);
                            let n_caretpos = o_caretpos + 2;
                            if(n_caretpos < 19) {
                                myInput.caret(n_caretpos)
                            }
                        }
                    } else if (o_caretpos == 12){
                        let datePart = parseInt(new_text.substring(0, 2))
                        let monthPart = parseInt(new_text.substring(3, 5))
                        let hourPart = parseInt(new_text.substring(11,13))
                        if(hourPart < 13 && Number.isInteger(datePart) && Number.isInteger(monthPart) && monthPart < 13 && datePart < 32) {
                            myInput.val(new_text);
                            let n_caretpos = o_caretpos + 2;
                            if(n_caretpos < 19) {
                                myInput.caret(n_caretpos)
                            }
                        }
                    } else if (o_caretpos == 15) {
                        
                        let datePart = parseInt(new_text.substring(0, 2))
                        let monthPart = parseInt(new_text.substring(3, 5))
                        let hourPart = parseInt(new_text.substring(11,13))
                        let minPart = parseInt(new_text.substring(14,16))
                        if(minPart < 60 && hourPart < 13 && Number.isInteger(datePart) && Number.isInteger(monthPart) && monthPart < 13 && datePart < 32) {
                            let curSec = peGetCurrentSecondOfTime();
                            let sectwodig = "00"
                            if(curSec.length == 1) {
                                curSec = "0" + curSec;
                            }
                            console.log(curSec)
                            let withSec = new_text.slice(0, -3) + ":" + curSec;
                            myInput.val(withSec)
                            myInput.caret(16)
                        }
                    } else{
                        myInput.val(new_text);
                        let n_caretpos = o_caretpos + 1;
                        if(n_caretpos < 19) {
                            myInput.caret(n_caretpos)
                        }
                    }                    
                }
            }           
        })
        return new Promise((resolve, reject)=>{
            resolve()
        })
    }

    async validate(params) {
        let valFrmSuper = await super.getVal();
        let thisObject = this;

        if(valFrmSuper != false) {
            // console.clear();
            let pVal = valFrmSuper;
            let myDTVal = {};
            let format12 = {};
            let datePart = {};
            let timePart = {};
            format12.hr = parseInt(pVal.substring(11, 13));
            format12.min = parseInt(pVal.substring(14, 16));
            format12.sec = parseInt(pVal.substring(17, 19));
            format12.seg = thisObject.ambox.html();
            let format24 = peTime12to24(format12);

            if( format24 != false ) {
                // console.log("Yes")
                timePart = format24;
            }
            datePart.dt = parseInt(pVal.substring(0, 2));
            datePart.mn = parseInt(pVal.substring(3, 5));
            datePart.yr = parseInt(pVal.substring(6, 10));

            thisObject.isvalid = peIsValidDMY(datePart);

            if(thisObject.isvalid) {
                // console.log("ডেট ভ্যালিড")
                thisObject.datePart = datePart;
                if(timePart.hr < 24 && timePart.min < 60 && timePart.sec < 60) {
                    // console.log("টাইম ভ্যালিড")
                    // console.log(timePart);
                    thisObject.timePart = timePart;
                    thisObject.jqDom.removeClass("peInvalid");
                }else {
                    thisObject.timePart = false
                    thisObject.isvalid = false
                }
            }else {
                thisObject.datePart = false;
                thisObject.timePart = false;
            }            
        }else {
            thisObject.isvalid = false;
            thisObject.jqDom.addClass("peInvalid")
        }

        return new Promise((resolve, reject)=> {
            resolve(thisObject.isvalid);
        })
    }

    async getVal() {
        let thisObject = this;
        let ifValid = await this.validate();
        let combDMYHMS = {}
        let myFinalReport = {}

        if (ifValid == true) {
            combDMYHMS.dt = thisObject.datePart.dt;
            combDMYHMS.mn = thisObject.datePart.mn;
            combDMYHMS.yr = thisObject.datePart.yr;
            combDMYHMS.hr = thisObject.timePart.hr;
            combDMYHMS.min = thisObject.timePart.min;
            combDMYHMS.sec = thisObject.timePart.sec;
            // thisObject.TSvalue = peDMYHMStoTSutc(combDMYHMS);
            // myFinalReport.tsutc = peDMYHMStoTSutc(combDMYHMS);
            // myFinalReport.tslcl = peDMYHMStoTSlcl(combDMYHMS);
            // myFinalReport.datePart = thisObject.datePart;
            // myFinalReport.timePart = thisObject.timePart;
            // console.log(myFinalReport);
        }

        return new Promise((resolve, reject)=>{
            if(thisObject.isvalid == true) {
                resolve(combDMYHMS);
            }else {
                resolve(false);
            }            
        })
    }

    async setVal(value) {
        let thisObject = this;
        let fmt = {};

        if(value.dt < 10) {
            fmt.dd = "0" + value.dt.toString()
        }else {
            fmt.dd = value.dt
        }

        if(value.mn < 10) {
            fmt.mn = "0" + value.mn.toString()
        }else {
            fmt.mn = value.mn
        }

        if(value.hr < 10) {
            fmt.hr = "0" + value.hr.toString()
        }else {
            fmt.hr = value.hr
        }

        if(value.min < 10) {
            fmt.min = "0" + value.min.toString()
        }else {
            fmt.min = value.min
        }

        if(value.sec < 10) {
            fmt.sec = "0" + value.sec.toString()
        }else {
            fmt.sec = value.sec
        }

        fmt.yr = value.yr;

        let boxValue = `${fmt.dd}/${fmt.mn}/${fmt.yr} ${fmt.hr}:${fmt.min}:${fmt.sec}`
        thisObject.jqInput.val(boxValue);
        thisObject.ambox.html(value.seg);
        return new Promise((resolve, reject)=>{
            resolve()
        })
    }

}

class peInputBox extends peInputUi {
    constructor(params) {
        super(params)
        this.isInptUI = true;
    }

    async makeReady() {
        await this.makeRootDomReady({});
        await this.appendExtraDoms({})
        await this.makeExtendedReady({});
        return new Promise((resolve,reject)=>{
            resolve()
        })
    }

    async appendExtraDoms(params) {
        super.appendExtraDoms(params);
        let thisObject = this;
        let myjqdom = thisObject.jqDom;
        
        if(myjqdom.hasAttr("pe-label")) {
            let lbl = myjqdom.attr("pe-label");
            let lbltag = `
                            <div class="pelabel">${lbl}:</div>
                            <input id="${thisObject.domID}_tx" type="text" class="petext"/>
                            <div class="peicon"></div>
                            `;
            myjqdom.append(lbltag);
        }else {
            let lbl = myjqdom.attr("pe-label");
            let lbltag = `<input id="${thisObject.domID}_tx" type="text" class="petext"/>
                            <div class="peicon"></div>
                            `;
            myjqdom.append(lbltag);
        }
        
        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                resolve()
            }, 5);            
        })
    }

    async makeExtendedReady(params) {
        super.makeExtendedReady(params);
        let thisObject = this;

        thisObject.jqInput.keydown((e)=>{
            // console.log(e.key);
        })
        thisObject.jqInput.keyup(async (e)=>{
            // console.log(e.keyCode);
            if(e.keyCode == 13) {
                let isv = await thisObject.validate();
                console.clear();
                console.log(isv);
            }
        })

        thisObject.jqInput.focusout(()=>{
            
        })

        return new Promise((resolve, reject)=>{
            resolve()
        })
    }
    async validate() {
        let thisObject = this;
        let minput = thisObject.jqInput;
        let myval = minput.val();
        let isV = false;
        if(thisObject.jqDom.hasAttr_pe("pe-data-type")) {
            let mdtType = thisObject.dataType = thisObject.jqDom.attr("pe-data-type");
            isV = peIsValid(myval, mdtType);
        }else {
            isV = true;
        }

        return new Promise((resolve, reject)=>{
            if(isV == false) {
                thisObject.jqDom.addClass("invalid");
            }else {
                thisObject.jqDom.removeClass("invalid");
            }
            resolve(isV)
        })
    }
}

class peSingleSelect extends peInputUi {

    constructor(params) {
        super(params)
        this.isInptUI = true;
    }

    async makeReady() {
        await this.makeRootDomReady({});
        await this.appendExtraDoms({})
        await this.makeExtendedReady({});
        return new Promise((resolve,reject)=>{
            resolve()
        })
    }

    async appendExtraDoms(params) {
        super.appendExtraDoms(params);
        let thisObject = this;
        let myjqdom = thisObject.jqDom;
        let myLabel = thisObject.label;
        let lbl = thisObject.jqDom.attr("pe-label");    
        let txtTag = `<div class="pelabel">${lbl}:</div><input id="${thisObject.domID}_tx" type="text" class="petext"/><div class="peicon"></div>`;                
        myjqdom.prepend(txtTag);
       
        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                resolve()
            }, 5);            
        })
    }

    async makeExtendedReady(params) {
        super.makeExtendedReady(params);
        let thisObject = this;        
        thisObject.panClosed = true;
        thisObject.itemPan = thisObject.jqDom.find(".itemPan");
        thisObject.selectedVal = "";
        thisObject.selectedJqdom = undefined;
        thisObject.value = "";
        // console.log(thisObject.itemPan);
        let selectedItem = thisObject.itemPan.find(".item.selected");
        if(selectedItem.length > 0) {
            let selectedVal = jQuery(jQuery(selectedItem[0]).find(".ival")).html();
            thisObject.jqInput.val(selectedVal);
            thisObject.value = selectedVal;
        }
        // thisObject.oldval = thisObject.jqInput.val();

        thisObject.jqInput.keydown((e)=>{
            // e.preventDefault();
            let mkey_code = parseInt(e.keyCode)
            let myKey = e.key
            if( mkey_code > 96 && mkey_code < 13 ) {
                if (thisObject.panClosed != false) {
                    thisObject.showItemPan();
                }
            }
           
            thisObject.oldval = thisObject.jqInput.val();
            
            // console.log(`Key Code: ${mkey_code} and Key: ${myKey}`);
            if(mkey_code == 27) {
                this.clsItemPan();
                thisObject.jqInput.blur();
            }
            if(mkey_code == 40) {
                if(thisObject.panClosed == true) {
                    thisObject.showItemPan();
                }else {
                    this.moveSelectionDW();
                }
            }

            if(mkey_code == 38) {
                if(thisObject.panClosed == false) {
                    thisObject.moveSelectionUP()
                }                
            }
        })

        thisObject.jqInput.keyup((e)=>{
            let mkey_code = parseInt(e.keyCode)
            let myKey = e.key            
            let currval = thisObject.jqInput.val();

            if(thisObject.oldval != currval) {
                thisObject.filterList(currval);
            }

            if(mkey_code == 13) {
                if(thisObject.panClosed == false) {
                        let jqS = thisObject.itemPan.find(".preselect");
                        if(jqS.length > 0) {                          
                           jqS.removeClass("preselect");
                           jqS.addClass("selected");
                           thisObject.value = jqS.find(".ival").text();
                           console.log(thisObject.value);
                           
                           thisObject.selectedJqdom = jqS;
                           thisObject.clsItemPan();
                        }else {
                            thisObject.clsItemPan();
                        }
                        thisObject.jqInput.val(thisObject.value);
                        setTimeout(() => {
                            thisObject.jqInput.blur();
                        }, 50);
                    
                }else {
                    thisObject.jqInput.blur();
                }
            }
        })
        // টেক্সট বক্স এ ফোকাস গেলে
        thisObject.jqInput.focus(()=>{
            if(thisObject.panClosed != false) {
                thisObject.showItemPan();
            }            
        })

        // টেক্সট বক্স ফোকাস লস করলে
        thisObject.jqInput.focusout(()=>{
            thisObject.jqInput.val(thisObject.value);
        })
        
        thisObject.itemPan.on("click", ".item", (e)=>{
            let thItem = jQuery(e.currentTarget);
            let myval = thItem.find(".ival").text();
            thisObject.value = myval;
            thisObject.jqInput.val(thisObject.value);
            thItem.removeClass("preselect");
            thItem.addClass("selected");
            // console.log(thItem);
            thisObject.selectedJqdom = thItem;
            thisObject.jqInput.blur();
            setTimeout(() => {
                thisObject.clsItemPan();
            }, 50);            
        })            
        
        thisObject.itemPan.on("mouseenter", ".item", (e)=>{
            thisObject.itemPan.find(".preselect").removeClass("preselect");
            jQuery(e.currentTarget).addClass("preselect");
        });

        thisObject.jqDom.mouseleave(()=>{
            thisObject.clsItemPan();
            thisObject.jqInput.blur();
            thisObject.jqInput.val(thisObject.value);
        })

        thisObject.jqInput.click(()=>{
            if(thisObject.panClosed != false) {
                thisObject.showItemPan();
            }
            thisObject.jqInput.val("");
        })

        return new Promise((resolve, reject)=>{
            resolve()
        })        
    }

    showItemPan() {
        if(this.panClosed == true) {
            this.jqDom.addClass("pan-visble");
            this.panClosed = false;
            this.jqInput.val("");
        }        
    }

    clsItemPan() {
        if(this.panClosed == false) {
            this.jqDom.removeClass("pan-visble");
            this.panClosed = true;
            this.clearListFilter();
        }        
    }

    moveSelectionUP() {
        let thisObject = this;
        let actives = thisObject.itemPan.find(".item:not(.hidden)");
        let preselect = thisObject.itemPan.find(".item.preselect:not(.hidden)");
        if(preselect.length < 1) {
            actives.eq(0).addClass("preselect");
        }else {
            let mindex = actives.index(preselect);
            if(mindex > 0) {
                let prev = actives.eq(mindex - 1)
                let mytop = prev[0].offsetTop;
                thisObject.itemPan.scrollTop(mytop - 68);
                prev.addClass("preselect");
                thisObject.preselectVal = prev.find(".ival").text()
                preselect.removeClass("preselect");
            }
        }      
    }

    moveSelectionDW() {
        let thisObject = this;
        // console.clear();
        let actives = thisObject.itemPan.find(".item:not(.hidden)");
        let preselect = thisObject.itemPan.find(".item.preselect:not(.hidden)");
        if(preselect.length < 1) {
            actives.eq(0).addClass("preselect");
            thisObject.preselectVal = actives.eq(0).find(".ival").text();
        }else {
            let mindex = actives.index(preselect);

            if(mindex < (actives.length - 1)) {
                let mnext = actives.eq(mindex + 1)
                let mytop = mnext[0].offsetTop;
                thisObject.itemPan.scrollTop(mytop - 68);
                mnext.addClass("preselect");
                thisObject.preselectVal = mnext.find(".ival").text()
                preselect.removeClass("preselect");
            }else {
                let mnext = actives.eq(0)
                mnext.addClass("preselect");
                let mytop = mnext[0].offsetTop;
                thisObject.itemPan.scrollTop(mytop - 68);
                thisObject.preselectVal = mnext.find(".ival").text()
                preselect.removeClass("preselect");
            }
        }
    }

    async clearList() {
        let thisObject = this;
        thisObject.itemPan.find(".item").remove();
        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                resolve();
            }, 50);
        })
    }

    async filterList(val) {
        let thisObject = this;
        let mlist = thisObject.itemPan.find(".item");
        mlist.addClass("hidden");
        mlist.removeClass("preselect");
        let currval = thisObject.jqInput.val().toUpperCase();
        for(let mindex = 0; mindex < mlist.length; mindex ++) {
            let mthliobj = mlist.eq(mindex)
            let thisval = mthliobj.find(".ival").html().toUpperCase();
            if(thisval.includes(currval)) {
                mthliobj.removeClass("hidden");
            }
        }
        thisObject.itemPan.scrollTop(0);

        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async clearListFilter() {
        let thisObject = this;
        thisObject.itemPan.find(".item").removeClass("hidden selected");
        if(thisObject.selectedJqdom != undefined) {
            thisObject.selectedJqdom.addClass("selected");
        }
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async generateList(data, tgFn) {
        let thisObject = this;
        await thisObject.clearList();
        // console.log(data);
        for(let mindex = 0; mindex < data.length; mindex++) {
            let thdt = data[mindex];
            // await pedelay(10)            
            let fullTag = tgFn(thdt);
            if(fullTag != false) {
                thisObject.itemPan.append(fullTag);
            }  
        }
        // thisObject.itemPan.scrollTop(1000);
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
}

class peAccordion extends peContainerUi {

    constructor(params) {
        super(params);
        let thisObject = this;
        thisObject.state = "closed";
        
        return thisObject;
    }

    async makeReady(params) {
        await super.makeReady();

        await this.appendExtraDoms();
        await this.makeExtendedReady();
        return new Promise((resolve, reject)=> {
            resolve();
        })
    }

    async appendExtraDoms(params) {
        let thisObject = this;
        let prevHtml = thisObject.jqDom.html();
        thisObject.jqDom.html("");
        thisObject.jqDom.find("*").remove();        
        let extTag = `
                    <div class="aHead">
                        <div class="title">${thisObject.label}</div>
                        <div class="btnPanel">
                        </div>
                        <div class="ricon">&#1240</div>
                    </div>

                    <div class="aPan">
                    </div>
                    `
                    this.jqDom.append(extTag);
                    thisObject.head = thisObject.jqDom.find(".aHead");
                    thisObject.pan = thisObject.jqDom.find(".aPan");
                    thisObject.pan.append(prevHtml);
        return new Promise((resolve, reject)=> {
            resolve();
        })
    }

    async makeExtendedReady(params) {
        let thisObject = this;
        thisObject.jqDom.on("click", ".aHead", async()=>{
            // await showNotification({"txtMsg" : "একর্ডিয়ানের হেড এ ক্লীক হইছে!!"});
            await thisObject.togglePan()
            // console.log("একর্ডিয়ানের হেড এ ক্লীক হইছে!!");
            return new Promise((resolve, reject)=> {
                resolve();
            })
        });
        // await thisObject.generateList({});
        return new Promise((resolve, reject)=> {
            resolve();
        })
    }

    async openPan(params) {
        let thisObject = this;
        if(thisObject.state == "closed") {
            thisObject.jqDom.addClass("opened");
            thisObject.state = "opened";
        }
        return new Promise((resolve, reject)=> {
            resolve();
        })
    }

    async closePan(params) {
        let thisObject = this;

        if(thisObject.state == "opened") {
            thisObject.jqDom.removeClass("opened");
            thisObject.state = "closed";
        }

        return new Promise((resolve, reject)=> {
            resolve();
        })
    }

    async togglePan() {
        let thisObject = this;
        if(thisObject.state == "opened") {
            await thisObject.closePan()
        }else {
            await thisObject.openPan()
        }
        return new Promise((resolve, reject)=> {
            resolve();
        })
    }

    async generateList(params) {
        let thisObject = this;
        await this.clearList()
        if(params.hasOwnProperty("templateFn")) {
            // console.log(params.templateFn)
            if(params.hasOwnProperty("items")) {
                for(let mindex = 0; mindex < params.items.length; mindex++) {
                    let thisTag = params.templateFn(params.items[mindex]);
                    thisObject.pan.append(thisTag);
                }
            }
        }else {
            for(let mindex = 1; mindex < 20; mindex++) {
               
            }
        }
        
        return new Promise((resolve, reject)=> {
            resolve();
        })
    }

    async clearList() {
        this.pan.html("");
        this.pan.find("*").remove();
        return new Promise((resolve, reject)=> {
            resolve();
        })
    }
}

class peUiModule {

    constructor(params) {
        let thisObject = this;
        thisObject.params = params;
        thisObject.domID = undefined;
        thisObject.cntID = undefined;
        thisObject.jqcntDom = undefined;
        thisObject.jqDom = undefined;
        thisObject.inputElements = {};
        // ইনস্ট্যানশিয়েশনে দিতে হবে
        thisObject.pemodname = "";
        return thisObject
    }

    async initMod() {
        let thisObject = this;

        if(thisObject.params.hasOwnProperty("containerID")) {
            if(thisObject.params.containerID == "body") {
                thisObject.jqcntDom = jQuery("body");
                thisObject.cntID = "body";
            }else {
                thisObject.cntID = thisObject.params.containerID;
                let fullSelect = `#${thisObject.cntID}`;
                // console.log(fullSelect);
                thisObject.jqcntDom = jQuery(fullSelect);
                // console.log(thisObject.jqContainer);
            }
            if(thisObject.params.hasOwnProperty("medias")) {
                thisObject.medias = thisObject.params.medias;
            }else {
                thisObject.medias = ["base"];
            }
            // await thisObject.attachStyles(thisObject.medias);
            await thisObject.attachStyles(thisObject.medias);

            let markUp = await thisObject.loadMarkup();

            let prssd = await this.processMarkup(markUp);

            thisObject.jqcntDom.append(prssd);
            
            await pedelay(50);
            thisObject.jqDom = jQuery(`#${thisObject.domID}`);
            
            thisObject.uitype = thisObject.jqDom.attr("data-pe-uitype");
            await this.captureUiElements();
            thisObject.isShown = true;
            
            return new Promise((resolve, reject)=>{                
                PEwinResizeManage();
                resolve();
            })

        }else {
            return new Promise((resolve, reject)=>{
                PEwinResizeManage();
                resolve();
            })
            alert("No Container ID");
        }
    }

    async attachStyle(media) {
        let thisObject = this;
        let pc_style_name = thisObject.pemodname
        let mext = "";

        if(media != "base") {
            mext = `_${media}`
        }

        let docQ = jQuery(`[data-pe-modStyleName="${thisObject.pemodname}${mext}"]`).length;

        if (docQ < 1) {
            let styleurl = `${window.modUrlPrefix}/${thisObject.pemodname}/${thisObject.pemodname}${mext}.css`;
            let styleTxt = await PeJqAjaxGetProms(styleurl, 60);
            let fullTag = `<style data-pe-modStyleName="${thisObject.pemodname}${mext}">${styleTxt}</style>`;
            jQuery("head").append(fullTag);
        }

        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async attachStyles(medias = ["base"]) {
        let thisObject = this;
        
        for(let mindex = 0; mindex < medias.length; mindex ++) {
            let media = medias[mindex];
            await thisObject.attachStyle(media);
        }
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async loadMarkup() {
        let thisObject = this;
        let mrkUrl = `${window.modUrlPrefix}/${thisObject.pemodname}/${thisObject.pemodname}.html`;
        // console.log(mrkUrl);
        let markup = await PeJqAjaxGetProms(mrkUrl, 120);
        // console.log(mrkup);
        return new Promise((resolve, reject)=>{
            resolve(markup);
        });        
    }

    async processMarkup(markup) {
        let thisObject = this;
        thisObject.domID = peRandID(12);
        let fStr = `data-pe-name="${thisObject.pemodname}"`;
        // console.clear()
        // console.log(thisObject.domID);
        // console.log(fStr);
        // console.log(markup);
        const mregex = /<!--(.*?)-->/
        let cmntreplaced = markup.replace(mregex, "");
        let rplswith = `id="${thisObject.domID}" data-pe-name="${thisObject.pemodname}"`;
        let processed = cmntreplaced.replace(fStr, rplswith);
        // console.log(processed);
        
        return new Promise((resolve, reject)=>{
            resolve(processed);
        })
    }

    async captureUiElements() {
        let thisObject = this;
        let allComps = thisObject.jqDom.find('[data-pe-uitype]')
        
        for(let mindex = 0; mindex < allComps.length; mindex++) {
            let thisCompDom = allComps[mindex]
            let thisCompName = jQuery(thisCompDom).attr("data-pe-name");
            let thisCompType = jQuery(thisCompDom).attr("data-pe-uitype");
            let thisCompDomID = `${thisObject.domID}_${thisCompName}`;
            jQuery(thisCompDom).attr("id", thisCompDomID);

            let mcmd = `thisObject["${thisCompName}"] = new ${thisCompType}({"markup_source" : "capture", "domID" : "${thisCompDomID}", "name" : "${thisCompName}", "cntID" : "${thisObject.domID}"})`;
            eval(mcmd);
            await thisObject[thisCompName].makeReady();
            let rdjqdom = thisObject[thisCompName].jqDom;

            if(rdjqdom.hasAttr_pe("data-value-input")) {
                thisObject.inputElements[thisCompName] = thisObject[thisCompName];
            }
        }
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    destroy() {
        this.jqDom.remove();
        delete this.instance;
    }
    destroyUi() {
        this.jqDom.remove();
    }

    hideUi() {
        this.jqDom.addClass("hideMe");
        this.isShown = false;
    }

    showUi() {
        this.jqDom.removeClass("hideMe");
        this.isShown = true;
    }
    async getInputVals() {
        let thisObject = this;
        let valData = {};
        let ielms = thisObject.inputElements;
        for(const key in ielms) {
            let thisElm = ielms[key];
            let thisVal = await thisElm.getVal();
            valData[key] = thisVal;
        }
        return new Promise((resolve, reject)=>{
            resolve(valData);
        })
    }

    async setInputVals(vals) {
        let thisObject = this;
        for(const key in vals) {
            if(thisObject.hasOwnProperty(key)) {
                thisObject[key].setVal(vals[key]);
            }
        }
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
}