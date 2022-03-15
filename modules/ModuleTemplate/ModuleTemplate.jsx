// এইখানে মডিউলের নামে ক্লাস বানাইতে হবে
class TemPlateMod extends peUiModule {

    constructor(params) {
        super(params)
        let thisObject = this;
        // এইখানে মডিউলের নাম লেখতে হবে
        thisObject.pemodname = "TemPlateMod"
        return thisObject;
    }

    async initMod() {
        await super.initMod();
        await this.activateBtns();
        let thisObject = this;
        thisObject.jqLeftpanel = thisObject.jqDom.find('[pe-name="left-panel"]');
        thisObject.jqRightpanel = thisObject.jqDom.find('[pe-name="right-panel"]');
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
            if(btnName == "show") {
                let vals = await thisObject.getInputVals();
                let mstring = JSON.stringify(vals, null, 2);
                mstring = `<pre>${mstring}</pre>`;
                thisObject.jqRightpanel.find("*").remove();
                thisObject.jqRightpanel.append(mstring);
            }
        })
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
}