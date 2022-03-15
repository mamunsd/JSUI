/// <reference path="./vendor/jquery/jquery-3.6.0.min.js"/>

window.modUrlPrefix = "./modules";
window.openmods = {};

var appModules = {
    "AppHome" : {},
    "ContentForm" : {},
    "ContentList" : {}
}

async function showNotification(params) {
    // let nparams = {"position" : "br", "stay" : true};
    let nparams = {"position" : "br"};
    nparams.txtMsg = params.txtMsg;
    let myNotification = new peNotification(nparams);

    await myNotification.activate();

    return new Promise((resolve, reject)=>{
        console.log("Hoise");
        resolve();
    })
}

async function loadAppModules() {
    for(mymod in appModules) {
        await peLoadModule(mymod);
    }
    return new Promise((resolve, reject)=>{
       resolve();
    })
}

jQuery(async ()=>{
    await loadAppModules();
    myAppUi = new AppHome({"containerID": "body"});
    await myAppUi.initMod();
    return new Promise((resolve, reject)=>{
        resolve();
    })
})