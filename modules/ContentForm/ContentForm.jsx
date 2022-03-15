// এইখানে মডিউলের নামে ক্লাস বানাইতে হবে
class ContentForm extends peUiModule {

    constructor(params) {
        super(params)
        let thisObject = this;
        // এইখানে মডিউলের নাম লেখতে হবে
        thisObject.pemodname = "ContentForm"
        return thisObject;
    }

    async initMod() {
        await super.initMod();
        await this.activateBtns();
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
                case "save" :
                    await thisObject.saveData();
                    break
                case "open" :
                    break
                case "new" :
                    break
            }
        })
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async saveData() {
        let thisObject = this;
        let myVal = await thisObject.getInputVals();
        console.clear();
        console.log(myVal);
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
}