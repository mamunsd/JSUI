class AppHome extends peUiModule {
    constructor(params) {
        super(params)
        let thisObject = this;
        thisObject.pemodname = "AppHome"
        thisObject.modViews = {};
        return thisObject;
    }

    async initMod() {
        await super.initMod();
        let thisObject = this;
        thisObject.cFID = `${thisObject.domID}_cF`;
        thisObject.jQcontFirst = thisObject.jqDom.find('[pe-name="contFirst"]');
        thisObject.jQcontFirst.attr("id", thisObject.cFID);
        thisObject.jQsidebar = thisObject.jqDom.find('[pe-name="side-bar"]');
        thisObject.jQlogo = thisObject.jqDom.find('[pe-name="logo-img"]');
        await this.makeExtraReady();
        await this.makeContentAccordionReady();
        setTimeout(async() => {
            thisObject.closeSideBar();
        }, 1000);
        return new Promise((resolve, reject)=>{
            setTimeout(async()=>{
                resolve();
            }, 500);           
        })
    }

    async makeExtraReady() {
        let thisObject = this;
        thisObject.jqDom.on("click", '[pe-name="logo-img"]', async()=>{
            await thisObject.toggleSidebar();
        })
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
    async toggleModeView(moduleName, cntID) {
        let thisObject = this;
        // console.clear()
        // console.log(thisObject.modViews)

        for(const key in thisObject.modViews) {
            
            if(key != moduleName) {
                // console.log(key);
                thisObject.modViews[key].hideUi();
            }         
        }

        if(thisObject.modViews.hasOwnProperty(moduleName)) {
            thisObject.modViews[moduleName].showUi();
        }else {
            let mparams = {"containerID" : cntID};
            let mycmd = `thisObject.modViews.${moduleName} = new ${moduleName}(mparams); thisObject.modViews.${moduleName}.initMod();`;
            eval(mycmd);
        }
        return new Promise((resolve, reject)=>{
            resolve()
        })
    }

    async makeContentAccordionReady() {
        let thisObject = this
        thisObject.jqDom.on("mouseup", '.acrdbtn', async(e)=>{
            let btnname = jQuery(e.currentTarget).attr("name");
            if(btnname == "contentForm") {
                this.toggleModeView("ContentForm", thisObject.cFID);
            }
            if(btnname == "ContentList") {
                this.toggleModeView("ContentList", thisObject.cFID);
            }
            this.toggleSidebar();
        })
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async openSideBar() {
        let thisObject = this;
        this.jQsidebar.removeClass("closed")
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async closeSideBar() {
        let thisObject = this;
        this.jQsidebar.addClass("closed")
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }

    async toggleSidebar() {
        let thisObject = this;
        if(thisObject.jQsidebar.hasClass("closed")) {
            this.openSideBar();
        }else {
            this.closeSideBar();
        }
        return new Promise((resolve, reject)=>{
            resolve();
        })
    }
}