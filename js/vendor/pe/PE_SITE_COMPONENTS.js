/// <reference path="../jquery/jquery-3.6.0.js" />
/// <reference path="PE_COMMON_LIB_FEB_2022.js" />
/// <reference path="PE_UI_LIB_FEB_2022.js" />

class peNavBarS1 extends peContainerUi {
    constructor(params) {
        super(params)
        let thisObject = this;
        return this;
    }

    async makeReady() {
        super.makeReady()
        let thisObject = this;
        await this.makeRootDomReady({});
        await this.appendExtraDoms({});
        await this.makeExtendedReady({});
        return new Promise((resolve, reject)=>{
            resolve()
        })
    }

    async appendExtraDoms(params) {
        super.appendExtraDoms(params)
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, 5)
        })
    }

    async makeExtendedReady(params) {
        super.makeExtendedReady(params);        
        let thisObject = this;
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, 5)
        })
    }
}