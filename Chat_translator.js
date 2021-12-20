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
      <select id='ddLangs'><option value='af'>afrikaans</option>
            <option value='sq'>albanian</option>
            <option value='am'>amharic</option>
            <option value='ar'>arabic</option>
            <option value='hy'>armenian</option>
            <option value='az'>azerbaijani</option>
            <option value='eu'>basque</option>
            <option value='be'>belarusian</option>
            <option value='bn'>bengali</option>
            <option value='bs'>bosnian</option>
            <option value='bg'>bulgarian</option>
            <option value='ca'>catalan</option>
            <option value='ceb'>cebuano</option>
            <option value='ny'>chichewa</option>
            <option value='zh-cn'>chinese (simplified)</option>
            <option value='zh-tw'>chinese (traditional)</option>
            <option value='co'>corsican</option>
            <option value='hr'>croatian</option>
            <option value='cs'>czech</option>
            <option value='da'>danish</option>
            <option value='nl'>dutch</option>
            <option value='en'>english</option>
            <option value='eo'>esperanto</option>
            <option value='et'>estonian</option>
            <option value='tl'>filipino</option>
            <option value='fi'>finnish</option>
            <option value='fr'>french</option>
            <option value='fy'>frisian</option>
            <option value='gl'>galician</option>
            <option value='ka'>georgian</option>
            <option value='de'>german</option>
            <option value='el'>greek</option>
            <option value='gu'>gujarati</option>
            <option value='ht'>haitian creole</option>
            <option value='ha'>hausa</option>
            <option value='haw'>hawaiian</option>
            <option value='iw'>hebrew</option>
            <option value='hi'>hindi</option>
            <option value='hmn'>hmong</option>
            <option value='hu'>hungarian</option>
            <option value='is'>icelandic</option>
            <option value='ig'>igbo</option>
            <option value='id'>indonesian</option>
            <option value='ga'>irish</option>
            <option value='it'>italian</option>
            <option value='ja'>japanese</option>
            <option value='jw'>javanese</option>
            <option value='kn'>kannada</option>
            <option value='kk'>kazakh</option>
            <option value='km'>khmer</option>
            <option value='ko'>korean</option>
            <option value='ku'>kurdish (kurmanji)</option>
            <option value='ky'>kyrgyz</option>
            <option value='lo'>lao</option>
            <option value='la'>latin</option>
            <option value='lv'>latvian</option>
            <option value='lt'>lithuanian</option>
            <option value='lb'>luxembourgish</option>
            <option value='mk'>macedonian</option>
            <option value='mg'>malagasy</option>
            <option value='ms'>malay</option>
            <option value='ml'>malayalam</option>
            <option value='mt'>maltese</option>
            <option value='mi'>maori</option>
            <option value='mr'>marathi</option>
            <option value='mn'>mongolian</option>
            <option value='my'>myanmar (burmese)</option>
            <option value='ne'>nepali</option>
            <option value='no'>norwegian</option>
            <option value='ps'>pashto</option>
            <option value='fa'>persian</option>
            <option value='pl'>polish</option>
            <option value='pt'>portuguese</option>
            <option value='pa'>punjabi</option>
            <option value='ro'>romanian</option>
            <option value='ru' selected='selected'>russian</option>
            <option value='sm'>samoan</option>
            <option value='gd'>scots gaelic</option>
            <option value='sr'>serbian</option>
            <option value='st'>sesotho</option>
            <option value='sn'>shona</option>
            <option value='sd'>sindhi</option>
            <option value='si'>sinhala</option>
            <option value='sk'>slovak</option>
            <option value='sl'>slovenian</option>
            <option value='so'>somali</option>
            <option value='es'>spanish</option>
            <option value='su'>sundanese</option>
            <option value='sw'>swahili</option>
            <option value='sv'>swedish</option>
            <option value='tg'>tajik</option>
            <option value='ta'>tamil</option>
            <option value='te'>telugu</option>
            <option value='th'>thai</option>
            <option value='tr'>turkish</option>
            <option value='uk'>ukrainian</option>
            <option value='ur'>urdu</option>
            <option value='uz'>uzbek</option>
            <option value='vi'>vietnamese</option>
            <option value='cy'>welsh</option>
            <option value='xh'>xhosa</option>
            <option value='yi'>yiddish</option>
            <option value='yo'>yoruba</option>
            <option value='zu'>zulu</option>
            <option value='fil'>Filipino</option>
            <option value='he'>Hebrew</option>
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

    if(target.nodeName==='INPUT'){
        transText(target.value, langSelect.value, output=>{
         target.value!==output&&(target.value=output);
        });
        return;
    }

	if(target.nodeName!=='DIV' && target.nodeName!=='SPAN')
		return;
	if(text.includes("[") || text.length > 400)
		return;

	transText(text, 'en', output=>{
        text!==output&&(target.innerHTML=`${text}<span style='color:green'> [${output}] </span>`);
	});
}, false);
       
document.body.onkeydown=event=>{
    if (event.ctrlKey  &&  event.altKey  &&  event.key === "`") {
	const selection=window.getSelection();

	if(selection!=""){
	    transText(selection, 'en', output=>{
    	        if(output!=selection)
	            alert(output);
            });
            return;
        }
        const strLangCode = langSelect.value, toTranslateNode=document.activeElement;
        transText(toTranslateNode.value|| toTranslateNode.innerText, strLangCode, langIn=>{
            toTranslateNode.value ? toTranslateNode.value=langIn : toTranslateNode.innerText=langIn;
            transText(langIn, 'en', console.log); 
  	});
    }
    // display language selection popup
    else if (event.ctrlKey  &&  event.altKey  &&  event.key === "g")
        modal.style.display = "block";      
};

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
