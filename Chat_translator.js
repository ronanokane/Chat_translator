// ==UserScript==
// @name         Chat_translator
// @namespace    Chat_translator
// @version      v1.0
// @description  Translate web chat messagess via shortcut keys.
//		  CTRL+ALT+G (choose language to translate to) CTRL+ALT+`(translate highlighted text or input box text).
//        *NEW* Double click on input box for translation into box (if ctrl + alt + ` won' t work)
//		  Double click received message to translate.
//
// @author       Ronan O' Kane
// @include	 https://*
// @run-at document-end
// @grant        GM.xmlHttpRequest
// ==/UserScript==

let elementToAdd=document.createElement("style");
elementToAdd.innerHTML=`body {font-family: Arial, Helvetica, sans-serif;}

      /* The Modal (background) */
      .modalTranslate {
        display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 9999; /* Sit on top */
        padding-top: 100px; /* Location of the box */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
      }

      /* Modal Content */
      .modalTranslate-content {
        color: #000;
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
      }

      /* The Close Button */
      .modalTranslateClose {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
      }

      .modalTranslateClose:hover,
      .modalTranslateClose:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
      }`;

document.head.appendChild(elementToAdd);
elementToAdd=document.createElement("div");

elementToAdd.innerHTML=`<div id="myModalTranslate" class="modalTranslate">
        <div class="modalTranslate-content">
          <span class="modalTranslateClose">&times;</span>
      <span>Translate to:  </span>
      <select id='ddLangs'>
      ${Object.entries(await languages()).map((item)=>item[0]==='ru' && '<option value=\'ru\' selected=\'selected\'>russian</option>' || '<option value=\'' + item[0] + '\'>' + item[1] + '</option>').join('\n')}
            </select>
            <p>Press Ctrl+Alt+${String.fromCharCode(96)} on selected text or chat input. </p>
        </div>
      </div>`;
document.body.appendChild(elementToAdd);

const langSelect = document.getElementById("ddLangs"),
modal = document.getElementById("myModalTranslate"),
span = document.getElementsByClassName("modalTranslateClose")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = ()=> {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = event=> {
    if(event.target == modal)
        modal.style.display = "none";
};
// double click to translate entire element text, appending it as green colour. Use sparingly.
// Selection method may be better and doesn't alter page structure.
document.addEventListener('dblclick', e=> {
    const target = e.target, text = target.innerText;

        alert('got here')

    if(text.length < 2 || text.length > 400) return;
    if(target.getElementsByClassName('translated').length>0)return;
    if(target.nodeName==='INPUT'){
        transText(target.value, langSelect.value, output=>{
            target.value!==output&&changeInputValue(target.value, output, target);
            transText(output, 'en', console.log);
        });
        return;
    }

    alert('got here')

    transText(text, 'en', output=>{
        text!==output&&(target.innerHTML+=`<span class="translated" style='color:green'> [${output}] </span>`);
    });
}, false);

document.body.onkeydown=event=>{
    if (event.ctrlKey && event.altKey && event.key === "`") {
        const selection=window.getSelection().toString();

        if(selection!==""){
            transText(selection, 'en', output=>{
    	        output!==selection&&alert(output);
            });
            return;
        }
        const strLangCode = langSelect.value, toTranslateNode=document.activeElement;
        if(toTranslateNode.nodeName!=='DIV' && toTranslateNode.nodeName!=='SPAN' && toTranslateNode.nodeName!=='INPUT')return;
        if(toTranslateNode.length > 400)return;

        transText(toTranslateNode.value|| toTranslateNode.innerText, strLangCode, langIn=>{
            toTranslateNode.value ? changeInputValue(toTranslateNode.value, langIn, toTranslateNode) : toTranslateNode.innerText=langIn;
            transText(langIn, 'en', console.log);
        });
    }
    // display language selection popup
    else if (event.ctrlKey && event.altKey && event.key === "g") modal.style.display = "block";
};

// need this to change input element .value because of react
function changeInputValue(lastVal, newVal, inputNode){
    inputNode.value = newVal;
    let event = new Event('input', { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = inputNode._valueTracker;
    if (tracker) tracker.setValue(lastVal);
    inputNode.dispatchEvent(event);
}

function transText(toTranslate, langCode='ru', callback){
    var encodedText = encodeURIComponent(toTranslate);
    var url = "http://localhost:3000/" + langCode + "/" + encodedText;

    GM.xmlHttpRequest({method: 'GET',
        headers: {'Accept': 'application/json'},
        url: url,
        onload: function(res) {
            var resJson = JSON.parse(res.responseText);
	    callback(resJson.text);
        },
        onabort: function() {
	    console.log('There was an abort');
        },
   	    ontimeout: function() {
    	    console.log('It timeout');
        },
        onerror: function() {
    	    console.log('There was an error');
        }
    });
}

function languages(){
    return new Promise((resolve, reject)=>{
        GM.xmlHttpRequest({method: 'GET',
                       headers:{'Accept': 'application/json'},
                       url: "http://localhost:3000/languages",
                       onload: (res)=>resolve(JSON.parse(res.responseText)),
                       onerror: ()=>reject("Error")
        })
    })
}