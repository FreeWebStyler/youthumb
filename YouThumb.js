// ==UserScript==
// @name         YouThumb! YouTube thumbnails showing
// @namespace    www.youtube.com/watch.youthumb
// @version      0.9
// @license      GPLv2
// @description  Show YouTube thumbnail picture by button, near likes buttons.
// @author       zanygamer@gmail.com
// @include      *youtube.com/*
// @match        *youtube.com/*
// @grant        none
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

(function ($, undefined) {
    $(function () {

        'use strict';

        var t = { // translates
                show_thumb: { ru: "Показать миниатюру", en: "Show thumb" },
                hide_thumb: { ru: "Скрыть миниатюру", en: "Hide thumb" },
                close_thumb: { ru: "Кликните, чтобы закрыть миниатюру", en: "Click to close thumbnail" }
            },
            cl = function(m){console.log(m);},
            isset = function (e){ return typeof e == 'undefined' ? false : true;},
            trys = 0,
            setButtonInterval,
            imgSrc,
            other_imgSrc,
            LANG = navigator.language,
            $body = $('body'),
            bp_width = '32px',
            bp_height = '20px',
            width = 0,
            other_width = 0,
        endvar;

        if(LANG == 'en-US') LANG = 'en';
        if(LANG == 'ru-RU') LANG = 'ru';

        function ShowHideThumbnail(){ // when click on buttons or thumbnail
            var YouThumb = $('#YouThumb');
            var playerApi = $('#player-api');

            if(YouThumb.length === 0){
                playerApi.prepend('<img title="'+ t.close_thumb[LANG] +'" id=YouThumb src='+ imgSrc +' style=position:absolute;z-index:999>');
                YouThumb = $('#YouThumb');
                YouThumb.on('click', ShowHideThumbnail);
                
                var offval = 0;
                
                if((YouThumb[0].naturalWidth / YouThumb[0].naturalHeight) > 1.4) { // keep aspect ratio
                    YouThumb.attr('width', playerApi[0].offsetWidth);
                    YouThumb.attr('height', playerApi[0].offsetHeight); //-25                    
                } else {
                    YouThumb.attr('width',  playerApi[0].offsetHeight + (playerApi[0].offsetHeight / 3));
                    YouThumb.attr('height', playerApi[0].offsetHeight);
                    offval = (playerApi[0].offsetWidth - (playerApi[0].offsetHeight + (playerApi[0].offsetHeight / 3))) / 2;
                }

                YouThumb.css('left', parseInt(YouThumb.css('left'))+ offval +'px');
                $('#YouThumbButton').html('<img id=YouThumbImage src="'+ imgSrc +'" style="width:'+ bp_width +';height:'+ bp_height +'"/> '+ t.hide_thumb[LANG]);
                $('#movie_player').css('visibility','hidden');

            } else { // if thumb exist need to remove thumbnail

                $('#YouThumbButton').html('<img id=YouThumbImage src="'+ imgSrc +'" style="width:'+ bp_width +';height:'+ bp_height +'"/> '+t.show_thumb[LANG]);
                YouThumb.remove();
                $('#movie_player').css('visibility','visible');
            }
        }

        function getWidths(){
            
            if(width == 0){
                let YouThumbImage = $('#YouThumbImage');
                width = YouThumbImage[0].naturalWidth;
            }            
            
            if(other_width == 0){
                other_width = $('#YouThumb_other_imgSrc')[0].naturalWidth;
            }
            
            if(width != 0 && other_width != 0){
                if(other_width > width) imgSrc = other_imgSrc;
                return;
            }
  
            setTimeout(getWidths, 500);       
        }
        
        function SetButton(){ //if(document.getElementById("YouThumbButton")!==null) return;
            //let params = (new URL(document.location)).searchParams;            let v = params.get('v');
            var YouThumb = $('#YouThumb');
            var YouThumbButton = $('#YouThumbButton');
            
            if(YouThumb.length !== 0){//                YouThumb.remove();
                ShowHideThumbnail();
                $('#movie_player').css('visibility','visible');                
            }

            if(YouThumbButton.length !== 0){ clearInterval(setButtonInterval); return; }
            
            width = 0;
            other_width = 0;
            
            //if(isset(button.v)) return;
            try {
                //imgSrc = $('link[itemprop="thumbnailUrl"]')[0].href;
                //imgSrc = $('#watch7-content').find('link[itemprop="thumbnailUrl"]')[0].href;
                other_imgSrc = $('#watch7-content > link[itemprop="thumbnailUrl"]')[0].href;
                imgSrc = other_imgSrc.replace('hq', 'sd');
            }
            catch(err) {
                //alert(err.message);                cl($('link'));                var $body = $('body');                cl($body.find('link'));      cl($('link[itemprop="thumbnailUrl"]'));
                //cl(err);
                return;
            }

            clearInterval(setButtonInterval); //cl(imgSrc);  //yt-uix-button yt-uix-button-hh-text
            
            $('<span><button id=YouThumbButton class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup yt-uix-button-toggled yt-uix-post-anchor yt-uix-tooltip"><img id=YouThumbImage src="'+ imgSrc +'" style="width:'+ bp_width +';height:'+ bp_height +'"/> '+ t.show_thumb[LANG] +'</button></span>').appendTo($('.like-button-renderer')[0]);
            
            YouThumbButton = $('#YouThumbButton');
            YouThumbButton.on('click', ShowHideThumbnail);
            
            if(other_imgSrc != imgSrc) {
                $('body').append('<img id=YouThumb_other_imgSrc src="'+ other_imgSrc +'" style=position:absolute;top:-50px;left:-50px;width:1px;height:1px>');
                other_width = $('#YouThumb_other_imgSrc')[0].naturalWidth;
                getWidths();
            }

            /*<link itemprop="thumbnailUrl" href="https://i.ytimg.com/vi/8FOBxcluXdk/maxresdefault.jpg">
                 var YouThumbImg = document.createElement("img"); // creating our Thumb picture that we need to show
                  YouThumbImg.setAttribute("src",links);
                  if((YouThumbImg.naturalWidth==120 && YouThumbImg.naturalHeight==90) || YouThumbImg.naturalWidth==0) links = links.replace(/maxres/,'hq');
           if(YouThumbExt.YouThumbImage!=links) YouThumbExt.YouThumbImage=links;*/
        }

        function mocallback(mutationrecords){
            //if(/watch/i.test(location.href)) setTimeout(SetButton, 2000); // TODO launch every 200 msecs. while element link[itemprop="thumbnailUrl"] not be found, and no more than 50 times!
            if($('title').html() == title || !/watch/i.test(location.href)) return;
            setButtonInterval = setInterval(SetButton, 500); // TODO launch every 200 msecs. while element link[itemprop="thumbnailUrl"] not be found, and no more than 50 times!
        }
        
        //if(!/watch/i.test(location.href)) return;
        var title = $('title');
        //cl(title);
        //cl(title[0]);
        //cl(isset(title));
        
        if(!isset(title[0])) return;
        var title_content = title.html();
        //cl(typeof document.querySelector('title').nodeType);document.getElementById('eow-title').nodeType);
        //cl(mocallback);
        var mo = new MutationObserver(mocallback);
        var options = {'childList': true};            //mo.observe(qs('head>title'), options);
        //cl(title[0]);
        cl(title);
        mo.observe(title[0], options);            //mo.observe(document.title, options);
        //mo.observe(document.getElementById('eow-title'), options);

    });
})(window.jQuery.noConflict(true));