// ==UserScript==
// @name         YouThumb! Tampermonkey version
// @namespace    www.youtube.com/watch.youthumb
// @version      0.4
// @description  Show/hide YouTube thumbnail picture by button next to like/dislike buttons.
// @author       zanygamer@gmail.com
// @match        *www.youtube.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

function cl(m){console.log(m);}
function ge(id){return document.getElementById(id);}
function qs(id){return document.querySelector(id);}
function qs(s){return document.querySelectorAll(s);}
function op(obj){var str='';for(p in obj) str+='Property name:'+p+' value:'+obj[p]+'\n';return str;}
function ol(obj) {var size = 0, key; for(key in obj) if(obj.hasOwnProperty(key)) size++; return size;}

var YouThumbExt = {
 showThumbLabelString:'',
 hideThumbLabelString:'',
 YouThumbImage:'',

 ShowHideThumbnail:function(){ // when click on buttons or thumbnail
  var node=document.getElementById('YouThumb');
  if(node == null){ // if thumb not exist
    var YouThumb = document.createElement("img"); // creating our Thumb picture that we need to show
    YouThumb.setAttribute("src", YouThumbExt.YouThumbImage);
    YouThumb.setAttribute("width", "0");
    YouThumb.setAttribute("id", "YouThumb");
    YouThumb.setAttribute("style", "position:absolute;z-index:999");
    YouThumb.addEventListener("click", function() {
    YouThumbExt.ShowHideThumbnail();return false;
    }, true);

    if(YouThumb.naturalWidth==120 && YouThumb.naturalHeight==90){ YouThumbExt.YouThumbImage = YouThumbExt.YouThumbImage.replace(/maxres/,'hq');
     YouThumb.setAttribute("src",YouThumbExt.YouThumbImage);
     ge('YouThumbImage').src=YouThumbExt.YouThumbImage;
    } //document.getElementById('YouThumbImage').src='YouThumbExt.YouThumbImage';

    dockContainer = document.getElementById("player-api");
    dockContainer.insertBefore(YouThumb, dockContainer.firstChild);

    if((document.getElementById("YouThumb").naturalWidth/document.getElementById("YouThumb").naturalHeight)>1.4) { // keep aspect ratio
     document.getElementById("YouThumb").setAttribute("width", document.getElementById("player-api").offsetWidth);
     document.getElementById("YouThumb").setAttribute("height", document.getElementById("player-api").offsetHeight-25);
     offval = 0;
    } else {
     document.getElementById("YouThumb").setAttribute("width", document.getElementById("player-api").offsetHeight+(document.getElementById("player-api").offsetHeight/3));
     document.getElementById("YouThumb").setAttribute("height", document.getElementById("player-api").offsetHeight);
     offval = (document.getElementById("player-api").offsetWidth-(document.getElementById("player-api").offsetHeight+((document.    getElementById("player-api").offsetHeight)/3)))/2;
    }

    document.getElementById("YouThumb").style.left+=offval+'px';
    document.getElementById("YouThumbButton").innerHTML = "<img src="+YouThumbExt.YouThumbImage+" width=18px height=18px /> "+YouThumbExt.hideThumbLabelString;
    document.getElementById("movie_player").style.visibility="hidden";
  } else { // if thumb exist need to remove thumb
    document.getElementById("YouThumbButton").innerHTML = "<img src="+YouThumbExt.YouThumbImage+" width=18px height=18px /> "+YouThumbExt.showThumbLabelString;
    if(node.parentNode) node.parentNode.removeChild(node);
    document.getElementById("movie_player").style.visibility="visible";
  }
 },

 getButtonPlace:function(){
  var dockContainer = document.getElementById('watch8-sentiment-actions');
  if(dockContainer==null) return false;
  dockContainer = dockContainer.getElementsByTagName('span'); // need find span to append button
  for (i=0;i<dockContainer.length;i++){ // need find span to append button
   var spanClass = dockContainer[i].getAttribute('class'); // alert(dockContainer.spanClass);           //console.log(spanClass);
   if(spanClass!=null && spanClass.match(/like-button-renderer/)){ dockContainer = dockContainer[i]; break; }
  }
  if(typeof dockContainer[0]!='undefined') return false; else return dockContainer;// console.log(333); console.log(dockContainer);
 },

 SetButton:function(){ //if(document.getElementById("YouThumbButton")!==null) return;
    var links = document.getElementsByTagName('link');
    for(var i=0;i<links.length;i++){
        if(links[i].getAttribute('itemprop') == 'thumbnailUrl' && /default/i.test(links[i].getAttribute('href'))){links = links[i].getAttribute('href'); break;}
    }
     //cl(links);  cl(typeof links);
    if(typeof links!='string'){
     for(var i=0;i<links.length;i++){
      //if(/default/i.test(links[i].getAttribute('href'))) cl(333); else cl(links[i].getAttribute('href'));
        if(links[i].getAttribute('itemprop') == 'thumbnailUrl' && /ytimg/i.test(links[i].getAttribute('href'))){links = links[i].getAttribute('href'); break;}
     }

    } else {
           var YouThumbImg = document.createElement("img"); // creating our Thumb picture that we need to show
           YouThumbImg.setAttribute("src",links);
           if((YouThumbImg.naturalWidth==120 && YouThumbImg.naturalHeight==90) || YouThumbImg.naturalWidth==0) links = links.replace(/maxres/,'hq');
    }

    /*var metas = document.getElementsByTagName('meta');
    for(var i=0;i<metas.length;i++){
      cl(metas[i].getAttribute('content')); if(metas[i].getAttribute('property') == 'og:image' && /default/i.test(metas[i].getAttribute('property'))){metas = metas[i].getAttribute('content'); break;}
    }*/
    //<meta content="https://i.ytimg.com/vd?id=_0LwQ2qESws&ats=1195000&w=960&h=720&sigh=Eoeqbwse3FEokRVaKhgh1bqwn8Y" property="og:image">
    //cl(metas);
    if(YouThumbExt.YouThumbImage!=links) YouThumbExt.YouThumbImage=links;// else return;

    var node = document.getElementById("YouThumb");
    if(node!==null){node.parentNode.removeChild(node); document.getElementById("movie_player").style.visibility="visible";}

    if(navigator.language=='ru') var YouThumbLocaleSpan=['Показать миниатюру','Скрыть миниатюру']; else var YouThumbLocaleSpan=['Show thumb','Hide thumb'];

    YouThumbExt.showThumbLabelString=YouThumbLocaleSpan[0];
    YouThumbExt.hideThumbLabelString=YouThumbLocaleSpan[1];

    var YouThumbButton = document.createElement("button"); // our thumb button creation
    YouThumbButton.setAttribute("id", "YouThumbButton");
    YouThumbButton.setAttribute("type", "button");
    YouThumbButton.setAttribute("class", "yt-uix-button yt-uix-button-hh-text");
    YouThumbButton.innerHTML = "<img id=YouThumbImage src="+YouThumbExt.YouThumbImage+" width=18px height=18px /> "+YouThumbExt.showThumbLabelString;
    YouThumbButton.addEventListener("click", function() { YouThumbExt.ShowHideThumbnail(); return false; }, true); // recomended by Mozilla instead "eval"
    var dockContainer=YouThumbExt.getButtonPlace();
    if(!dockContainer){ setTimeout(YouThumbExt.SetButton,500); return;} //if(!dockContainer) cl(typeof dockContainer);
    dockContainer.appendChild(YouThumbButton); // add button on page at like dislike bar
 }
}

var mocallback = function(mutationrecords){
 if(/watch/i.test(location.href)) setTimeout(YouThumbExt.SetButton,500);
}
mo = new MutationObserver(mocallback),
options = {'childList': true},
mo.observe(document.querySelector('head>title'),options);

if(/watch/i.test(location.href)) setTimeout(YouThumbExt.SetButton,500);