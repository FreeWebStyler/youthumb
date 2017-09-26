// ==UserScript==
// @name         YouThumb! YouTube thumbnails showing
// @namespace    www.youtube.com/watch.youthumb
// @version      1.6.3
// @license      GPLv2
// @description  Show YouTube thumbnail picture by button, near likes buttons.
// @author       FreeStyler
// @supportURL   zanygamer@gmail.com
// @updateURL    https://openuserjs.org/meta/FreeStyler/YouThumb.user.js
// @include      *youtube.com/*
// @match        *youtube.com/*
// @grant        none
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

/*

    #Changes:

    Fix widthes


    #Videos for testing

        https://www.youtube.com/watch?v=9f8LjrVgR3k - all resolutions with shrink
        https://www.youtube.com/watch?v=y0OzPjlJHzM - only hqdefautl
        https://www.youtube.com/watch?v=ZckOGWOYfFA - WO maxres
        https://www.youtube.com/watch?v=8Zy9InnJ4-Y&index=11&list=PLzPivwyXljVV100GMKcQAekdThrN2z6DQ - Jump over playlist

        https://www.youtube.com/watch?v=oJtV-vVkQYI - from this to this https://www.youtube.com/watch?v=Gug8WIu5cPE
        https://www.youtube.com/watch?v=bwy2HnmQoFo&t=250s

    #TODO

        Show thumbs not only on watch page
*/

(function ($, undefined) {
    $(function () {

        'use strict';

        var t = { // translates
            show_thumb: { ru: "Показать миниатюру", en: "Show thumb" },
            hide_thumb: { ru: "Скрыть миниатюру", en: "Hide thumb" },
            show_hide_thumb: { ru: "Показать / скрыть миниатюру", en: "Show / hide thumb" },
            close_thumb: { ru: "Кликните, чтобы закрыть миниатюру", en: "Click to close thumbnail" }
            },
            cl = function(m){console.log(m);},
            isset = function (e){ return typeof e == 'undefined' ? false : true;},
            trys = 0,
            imgBase,
            defaultImgSrc = 0,
            imgSrc = null,
            images = ['maxresdefault.jpg', 'sddefault.jpg', 'hqdefault.jpg'],
            maxCount = 25,
            count = 0,
            LANG = navigator.language,
            $body = $('body'),
            bp_width = '32px',
            bp_height = '20px',
            widthes = [0, 0, 0],
            setImagesInterval,
            last_location = null,
            thumb_display = false,
            last_src = null,
        endvar;

        if(LANG == 'en-US') LANG = 'en';
        if(LANG == 'ru-RU') LANG = 'ru';

        function setThumbnail(event){
            /*
                    background-size: contain;
                    background-image: url(https://i.ytimg.com/vi/9f8LjrVgR3k/maxresdefault.jpg);
            */
            //cl('setThumbnail');
            thumb_display = true;
            last_src = imgSrc;

            var playerApi = $('#player-container');
            var width  = playerApi[0].offsetWidth;
            var height = playerApi[0].offsetHeight;
            //$('#player-container').css({backgroundImage: 'url('+ imgSrc +')', backgroundSize: 'cover'});

            var $YouThumb = $('<img title="'+ t.close_thumb[LANG] +'" id=YouThumb src='+ imgSrc +' style=position:absolute;z-index:999>');
            $YouThumb.on('click', removeThumbnail);
            playerApi.prepend($YouThumb);

            //cl($YouThumb[0].naturalWidth);            cl($YouThumb[0].naturalHeight);
            var offval = 0;
            var aspect = $YouThumb[0].naturalWidth / $YouThumb[0].naturalHeight;
            //cl(aspect);
            if(aspect < 1.4) { // try keep aspect ratio
                //cl(1.4);
                $YouThumb.css({width: width, height: height});
            } else {
                var nwidth = height + (height / 3);
                offval = (nwidth - (height + (height / 3))) / 2;
                if(offval !== 0) $YouThumb.css({width: nwidth, height: height}); else $YouThumb.css({width: width, height: height});
            }

            $YouThumb.css('left', parseInt($YouThumb.css('left'))+ offval +'px');
            $('#YouThumbStatus').html(t.hide_thumb[LANG]);
            $('#movie_player').css('visibility','hidden');
        }

        function removeThumbnail(){
            thumb_display = false;
            var $YouThumb = $('#YouThumb');
            $('#YouThumbStatus').html(t.show_thumb[LANG]);
            $YouThumb.remove();
            $('#movie_player').css('visibility','visible');
        }

        function setRemoveThumbnail(event){ // when click on buttons or thumbnail

            var span = event.target.nodeName == 'SPAN' ? true : false;
            imgSrc = span ? defaultImgSrc : event.target.src;
            if(span && defaultImgSrc === null) cl('defaultImgSrc!!!'); //!defaultImgSrc

            if(thumb_display){
                removeThumbnail(event);
                if(!span && imgSrc !== last_src) setThumbnail(event);
            } else {
                removeThumbnail(event); setThumbnail(event);
            }
        }

        function getWidths_setButton(){
            //cl('getWidths_setButton');
            count++;
            for(let i = 0; i < images.length; i++){
            let $img = $('#YouThumb_'+ images[i].replace('.',''));
                if(!$img.length && count < maxCount){
                    setTimeout(getWidths_setButton, 500);
                }
                else widthes[i] = $img[0].naturalWidth;
            }

            let to_insert = '';
            for(let i = 0; i < widthes.length; i++){
                if(widthes[i] === 0 && count < maxCount){ setTimeout(getWidths_setButton, 500); return;}
                if(widthes[i] > 120){
                    if(!defaultImgSrc) defaultImgSrc = imgBase + images[i];
                    to_insert+= ' <img class=YouThumbButtonImage src="'+ imgBase + images[i] +'" style="vertical-align:middle;cursor:pointer;width:'+ bp_width +';height:'+ bp_height +'"/>';
                }
            }
            if($('#YouThumbButton').length) return;
            $('<div id=YouThumbButton style=line-height:40px><span style=vertical-align:middle;cursor:pointer id=YouThumbStatus>'+ t.show_thumb[LANG] +' </span></div>').appendTo($('.style-scope.ytd-menu-renderer.force-icon-button.style-default').parent());
            $('#YouThumbButton').append(to_insert);

            $('body').on('click', '#YouThumb', removeThumbnail); //player-container
        }

        function setImages(){

            var $YouThumb = $('#YouThumb');
            var $YouThumbButton = $('#YouThumbButton');

            try {
                imgBase = location.href.split('?v=')[1];
                if(imgBase.indexOf('&') !== -1) imgBase = imgBase.split('&')[0];
                imgBase = 'https://i.ytimg.com/vi/' + imgBase + '/';
            }
            catch(err) {
                cl('err');
                cl(err);
                return;
            }

            clearInterval(setImagesInterval);

            var images_to_insert = '';
            for(let i = 0; i < images.length; i++){
                images_to_insert+=
                '<img class=YouThumb_preload_images id=YouThumb_'+ images[i].replace('.','') +' src="'+ imgBase + images[i] +'" data-tooltip-text="'+ t.show_hide_thumb[LANG] +'" style=position:absolute;top:-50px;left:-50px;width:1px;height:1px>';
            }
            $('body').append(images_to_insert);
            getWidths_setButton();
        }

        function mocallback(mutationrecords){
            if($('title').html() == title || !/watch/i.test(location.href)) return;
            var current_location = location.href +'';
            if(last_location != current_location) last_location = current_location; else return;
            if(last_location !== null) {
                removeThumbnail(event);
                $('#YouThumbButton').remove();
                $('.YouThumb_preload_images').remove();
            }
            count = 0;
            defaultImgSrc = 0;
            setImagesInterval = setInterval(setImages, 1000); // TODO launch every 200 msecs. while not success, and no more than 50 times!
        }

        var title = $('title');

        if(!isset(title[0])) return;
        var title_content = title.html();
        var mo = new MutationObserver(mocallback);
        var options = {'childList': true};
        mo.observe(title[0], options); //mo.observe(document.title, options); mo.observe(qs('head>title'), options);
        //mo.observe(document.getElementById('eow-title'), options);

        $('body').on('click', '.YouThumbButtonImage', setRemoveThumbnail);
        $('body').on('click', '#YouThumbStatus', setRemoveThumbnail);

    });
})(window.jQuery.noConflict(true));