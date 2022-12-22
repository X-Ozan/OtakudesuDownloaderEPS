// ==UserScript==
// @name         OtakudesuDownloaderEPS
// @namespace    X-Ozan/OtakudesuDownloaderEPS
// @version      2.0.0
// @description  AutoDownloaderPerEPS
// @author       X-Ozan
// @grant        GM_addStyle
// @match        *://*.otakudesu.bid/episode/*
// @match        *://*.mega.nz/file/*
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.2/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==
// @require      file:///C:/Users/Administrator/Pictures/otakudesu-downloader.userscripts.js

/////////////// CHANGELOG ////////////////////////////
// V1.0.0       Auto click download button on mega.nz 1080p
// v2.0.0       Add Select Input for download quality
// v3.0.0       Add Download status and Download bar on Otakudesu      
//////////////////////////////////////////////////////


////////////// Global Function ///////////////////////
function GM_onMessage(label, callback) {
    GM_addValueChangeListener(label, function() {
        callback.apply(undefined, arguments[2]);
    });
}

function GM_sendMessage(label) {
    let values = GM_listValues();
    values.forEach(function(key){
        // console.log(key + " -> " + GM_getValue(key));
        GM_deleteValue(key);
    });
    GM_setValue(label, Array.from(arguments).slice(1));
    // console.log("sendMessage => " + Array.from(arguments).slice(1))
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
          resolve(response);
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }

////////////////////////// v3 ///////////////////////////
async function scrapeLink(){

    let tmp = {
        "Mega 480p": document.querySelector("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(3) > li:nth-child(1) > a:nth-child(6)").href,
        "Mega 720p": document.querySelector("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(3) > li:nth-child(2) > a:nth-child(6)").href,
        "Mega 1080p": document.querySelector("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(3) > li:nth-child(3) > a:nth-child(6)").href,
        "Zippy 480p": document.querySelector("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(1) > a:nth-child(2)").href,
        "Zippy 720p": document.querySelector("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(2) > a:nth-child(2)").href,
        "Zippy 1080p": document.querySelector("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(3) > a:nth-child(2)").href,
    }
    tmps = Object.keys(tmp).map((v,i)=>{
        return `<option id="${v}" value="${tmp[v]}">${v}</option>`
    })
    return tmps
}
async function check_coki_v2(){
    let cok = localStorage['otakudownloaders']
    let cok2 = localStorage['otakudownloaders_select']

    if (!cok && !cok2){
        localStorage.setItem('otakudownloaders', false)
        localStorage.setItem('otakudownloaders_select', false)
        // console.log("Coki 'otakudownloaders' created")
    }else{
        // console.log("Coki 'otakudownloaders' udah ada!")
    }
}
async function togel_view(){
    let cok = localStorage['otakudownloaders']
    let cok2 = localStorage['otakudownloaders_select']

    let links = await scrapeLink()

    if(cok == "true"){
        
        await $("#venkonten > div.venser > div.venutama > div.prevnext > div.fleft").after( $(`
    <style>
        #togel_mirror {
            padding: 6px 10px;
            background: #2a2a2a;
            width: 180px;
            font-size: 12px;
            font-family: "Droid Sans";
            border: 1px solid #444;
            color: #ccc;
            margin-right: 5px;
            border: 2px solid #0065ad
        }
    </style>
    <select name="episode" id="togel_mirror" onchange="localStorage.setItem('otakudownloaders_select', this.options[this.selectedIndex].id)">
        <option id="0" value="false">Download Mirror</option>
        ${links.map((v,i)=>{return v})}
    </select>
    `))
    $("[id='"+cok2+"']").attr('selected','selected');
    }else{
        if($("#togel_mirror")) $("#togel_mirror").remove()
    }
}
async function check_button_v2 (){
    let cok = localStorage['otakudownloaders']
    
    await $("#venkonten > div.venser > div.venutama > div.prevnext > div.flir > a:nth-child(1)").before( $('<a id="toggleDownloaders">DOWNLOADER : <b id="togelval">OFF</b></a>'))
    
    if(cok == "false"){
        $("#togelval").text("OFF")
    }else{
        $("#togelval").text("ON")
    }
    togel_view()
}
async function addAlert(text){
    $(".kategoz").empty()
    $(".kategoz").append(`<span class="lightSwitcher" id="alertDownloader"><span href="javascript:void(0);" type="checkbox">${text}</a><label data-off="OFF" data-on="ON"></label></span>`)
}
async function change_coki_v2 (){
    let cok = localStorage['otakudownloaders']
    $(".kategoz").css('text-align','center')
    if(cok == "false"){
        localStorage.setItem('otakudownloaders', true)
        $("#togelval").text("ON")
        // console.log("change coki to true")
        addAlert("Reload Page Required!")
    }else{
        localStorage.setItem('otakudownloaders', false)
        $("#togelval").text("OFF")
        // console.log("change coki to false")
        $(".kategoz").empty()
    }
    togel_view()
}
async function change_togel_v2 (){
    let cok2 = localStorage['otakudownloaders_select']
    
    if(cok2 == "false"){
        localStorage.setItem('otakudownloaders', true)
        $("#togelval").text("ON")
        // console.log("change coki to true")   
    }else{
        localStorage.setItem('otakudownloaders', false)
        $("#togelval").text("OFF")
        // console.log("change coki to false")
    }
    togel_view()
}
//////////////////////////////////////////////////
async function nextPage(){
    let c = document.querySelector("a[title='Episode Selanjutnya']")
    if(c){
        setTimeout(()=>{
            c.click()
        },5000)
    }else{
        addAlert("Udah di ujung episode tod!")
    }
}



async function downloader(q){
    let a = $("[id='"+q+"']")
    
    if(a && a.attr("value") !== "false"){
        let linksf = await makeGetRequest(a.attr("value"))
        GM_sendMessage(linksf.finalUrl, null) // reset
        GM_openInTab (linksf.finalUrl)
        console.log("[LISTENING] => ", linksf.finalUrl)
        GM_onMessage(linksf.finalUrl, function(src, message) {
            if(src){
                let data = JSON.parse(src)
                // console.log(data)
                // console.log('[onMessage]', src, '=>', message)
                if(data.status == "finish"){
                    nextPage()
                    $("#statusDownloader").text("Finish")
                    addAlert("Tunggu 5 detik ajg buat eps selanjutnya!")
                    console.log("---NEXT PAGE---")
                    GM_sendMessage(src, null) // reset
                }else if(data.status == "downloading"){
                    // console.log($("#myBar"))
                    if($("#myBar")) $("#myBar").css("width",data.data+"%")
                }else if(data.status == "start"){
                    let asw = `<style>
                    #myProgress {
                      width: 100%;
                      background-color: grey;
                    }
                    
                    #myBar {
                      width: 1%;
                      height: 30px;
                      background-color: #007cba;
                    }
                    </style>
                    <div style="text-align:center;font-size: large;">Status : <span id="statusDownloader">Downloading</span></div>
                    <div id="progressDownload">
                        <div id="myBar" style="width: 0%"></div>
                    </div>
                    `
                    $(".venutama").prepend(asw)
                }
            }
        })
    }else{
        console.log("EL not Found!")
    }
}
otakudesu = async ()=>{
    var reqDown = false
    $("#selectcog").remove()
    
    await check_coki_v2()
    await check_button_v2()

    let cok = localStorage['otakudownloaders']
    let cok2 = localStorage['otakudownloaders_select']

    if(cok == "true" && cok2 !== "false"){
        console.log("[START] => "+window.location.href)
        await downloader(cok2)
    }
    ///////////////////////////////////////////////////////

    var myToggle = document.querySelector("#toggleDownloaders")
    if (myToggle) {
        myToggle.addEventListener ("click", change_coki_v2 , false);
    }
    
}
////////////////////// MEGA DOWNLOADER ////////////////////////

async function mega_downloader (){
    let a = await waitForElm("#startholder > div.bottom-page.download.scroll-block.selectable-txt > div.download-content.download.download-page > section > div.download.main-pad > div > div.download.info-block > div.file-details-wrapper > div.links-container > div.merge-mega-button.download.js-download > button")
    if(a){
        a.click()
        console.log("Listening.....")
        GM_sendMessage(window.location.href, JSON.stringify({status:"start",data:""}), window.location.href); 
    }
}
function presentDownload(){
    // let targ = $("#startholder > div.bottom-page.download.scroll-block.selectable-txt > div.download-content.download.download-page.video.download-complete > section > div.download.main-pad > div > div.download.info-block > div.progress-container.download.in-progress > div:nth-child(2) > div > div")
    let targ = $("div.download.info-block > div.progress-container.download.in-progress > div:nth-child(2) > div > div")
    return targ.width() / targ.parent().width() * 100
}
////////////////////// ZIPPY DOWNLOADER ///////////////////////
async function zippy_downlader (lt){
    let z = await waitForElm("#lrbox")
    if(z){
        if($("#lrbox").text().search('File does not exist on this server') < 0){
            dlbut = $("#dlbutton").attr("href")
            let link = lt.split("/v/")[0]
            window.location = link+dlbut;
        }
    }
}
////////////////////// MAIN CODE //////////////////////////////


(async ()=>{
    let ltarget = location.href
    
    if(ltarget.search('mega') >= 0){
        
        mega_downloader()
        let cc = setInterval(async ()=>{
            let pp = presentDownload()
            GM_sendMessage(window.location.href, JSON.stringify({status:"downloading",data:pp}), window.location.href); 
            // GM_sendMessage(window.location.href, `Download`);
            // console.log(pp)
            let donePP = document.querySelector("span.download.complete-block > span")
            // console.log(donePP)       
            if(donePP && pp == 100){
                GM_sendMessage(window.location.href, JSON.stringify({status:"finish",data:"Download Success"}), window.location.href); 
                // console.log('SELESAI') 
                clearInterval(cc)
                setTimeout(()=>{
                    window.close()
                },5000)
            }
        },1000)
        
    }else if(ltarget.search('otakudesu') >= 0){
        otakudesu()
        let values = GM_listValues();
        // console.log(values)
        
    }else if(ltarget.search('zippyshare.com/v/') >= 0){
        zippy_downlader(ltarget)
    }
})()