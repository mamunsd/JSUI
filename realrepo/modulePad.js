/// <reference path="js/vendor/jquery/jquery-3.6.0.min.js"/>
/// <reference path="js/vendor/jquery/jquery.caret.js"/>
/// <reference path="js/vendor/pe/PE_COMMON_LIB_FEB_2022.js"/>
/// <reference path="js/vendor/pe/PE_UI_LIB_FEB_2022.js"/>
/// <reference path="js/vendor/pe/PE_DB_SCROLL_VIEW_MARCH_2022.js"/>
/// <reference path="js/vendor/pe/PE_SITE_COMPONENTS.js"/>

window.modUrlPrefix = "./modules";

async function showNotification(params) {
    // let nparams = {"position" : "br", "stay" : true};
    let nparams = {"position" : "br"};
    nparams.txtMsg = params.txtMsg;
    let myNotification = new peNotification(nparams);

    await myNotification.activate();

    return new Promise((resolve, reject)=>{
        resolve();
    })
}

jQuery(async()=>{
    await peLoadModule("ContentList");
    let myModParams = {"containerID" : "modBody", "medias" : ["base", "pc", "mob", "tab"]}
    let myClist = new ContentList(myModParams); 
    myClist.initMod();
    PEwinResizeManage();
    return new Promise((resolve, reject)=>{
        resolve();
    })
})
// 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