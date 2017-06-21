// ==UserScript==
// @name         YouThumb! YouTube thumbnails showing
// @namespace    www.youtube.com/watch.youthumb
// @version      1.0
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
            imgBase,
            imgSrc,
            images = ['maxresdefault.jpg', 'sddefault.jpg', 'hqdefault.jpg'],
            maxCount = 25,
            count = 0,
            LANG = navigator.language,
            $body = $('body'),
            bp_width = '32px',
            bp_height = '20px',
            widthes = [0, 0, 0],
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
            count++;
            cl(count);
            //if(count > maxCount) return;
            $('body').append(
                '<img id=YouThumb_sd_imgSrc src="'+ imgBase+images[1] +'" style=position:absolute;top:-50px;left:-50px;width:1px;height:1px>'+
                '<img id=YouThumb_max_imgSrc src="'+ imgBase+images[0] +'" style=position:absolute;top:-50px;left:-50px;width:1px;height:1px>');

            widthes[2] = $('#YouThumbImage')[0].naturalWidth;
            widthes[1] = $('#YouThumb_sd_imgSrc')[0].naturalWidth;
            widthes[0] = $('#YouThumb_max_imgSrc')[0].naturalWidth;

            var maxWidth = 0;
            var maxWidthI = 2;

            var ret = 0;

            for(let i = 0; i < widthes.length; i++){
                if(widthes[i] == 0 && count < maxCount){
                        setTimeout(getWidths, 500);
                        return;
                }
                if(widthes[i] > maxWidth){ maxWidth = widthes[i]; maxWidthI = i; }
            }

            let maxSrc = imgBase+images[maxWidthI];

            if(imgSrc != maxSrc){
                imgSrc = maxSrc;
                YouThumbImage.src = imgSrc;
                return;
            }

            //setTimeout(getWidths, 500);
        }

        function SetButton(){

            cl(111);

            var YouThumb = $('#YouThumb');
            var YouThumbButton = $('#YouThumbButton');

            if(YouThumb.length !== 0){// YouThumb.remove();
                ShowHideThumbnail();
                $('#movie_player').css('visibility','visible');
            }

            if(YouThumbButton.length !== 0){ clearInterval(setButtonInterval); return; }

            try {
                imgBase = $('#watch7-content > link[itemprop="thumbnailUrl"]')[0].href;
                imgBase = imgBase.split('/');
                delete imgBase[imgBase.length-1];
                imgBase = imgBase.join('/');
            }
            catch(err) {
                //alert(err.message);                cl($('link'));                var $body = $('body');                cl($body.find('link'));      cl($('link[itemprop="thumbnailUrl"]'));
                cl(err);
                return;
            }

            clearInterval(setButtonInterval); //cl(imgSrc);  //yt-uix-button yt-uix-button-hh-text

            imgSrc = imgBase+images[2];
            //cl(imgSrc);
            $('<span><button id=YouThumbButton class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup yt-uix-button-toggled yt-uix-post-anchor yt-uix-tooltip"><img id=YouThumbImage src="'+ imgSrc +'" style="width:'+ bp_width +';height:'+ bp_height +'"/> '+ t.show_thumb[LANG] +'</button></span>').appendTo($('.like-button-renderer')[0]);

            YouThumbButton = $('#YouThumbButton');
            YouThumbButton.on('click', ShowHideThumbnail);
            cl(555);
            getWidths();
        }

        function mocallback(mutationrecords){
            if($('title').html() == title || !/watch/i.test(location.href)) return;
            count = 0;
            setButtonInterval = setInterval(SetButton, 500); // TODO launch every 200 msecs. while element link[itemprop="thumbnailUrl"] not be found, and no more than 50 times!
        }

        var title = $('title');

        if(!isset(title[0])) return;
        var title_content = title.html();
        var mo = new MutationObserver(mocallback);
        var options = {'childList': true};
        mo.observe(title[0], options); //mo.observe(document.title, options); mo.observe(qs('head>title'), options);
        //mo.observe(document.getElementById('eow-title'), options);
    });
})(window.jQuery.noConflict(true));