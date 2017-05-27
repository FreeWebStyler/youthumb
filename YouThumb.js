// ==UserScript==
// @name         YouThumb! YouTube thumbnails showing
// @namespace    www.youtube.com/watch.youthumb
// @version      0.7
// @license      GPLv2
// @description  Show YouTube thumbnail picture by button, near likes buttons.
// @author       zanygamer@gmail.com
// @include      *www.youtube.com/*
// @match        *www.youtube.com/*
// @grant        none
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

(function ($, undefined) {
  $(function () {

    var t = { // translates
        show_thumb: { ru: "Показать миниатюру", en: "Show thumb" },
        hide_thumb: { ru: "Скрыть миниатюру", en: "Hide thumb" },
		close_thumb: { ru: "Кликните, чтобы закрыть миниатюру", en: "Click to close thumbnail" }
    };

    function cl(m){console.log(m);}

    var imgSrc,
        LANG = navigator.language,
        $body = $('body'),
    endvar;
    if(LANG == 'en-US') LANG = 'en';
    if(LANG == 'ru-RU') LANG = 'ru';
      
    function ShowHideThumbnail(){ // when click on buttons or thumbnail

        var YouThumb = $('#YouThumb');
        var playerApi = $('#player-api');

        if(YouThumb.length === 0){

            playerApi.prepend('<img title="'+t.close_thumb[LANG]+'" id=YouThumb src='+imgSrc+' style=position:absolute;z-index:999>');
            YouThumb = $('#YouThumb');
            YouThumb.on('click', ShowHideThumbnail);

            if( (YouThumb[0].naturalWidth / YouThumb[0].naturalHeight) > 1.4) { // keep aspect ratio
                YouThumb.attr('width', playerApi[0].offsetWidth);
                YouThumb.attr('height', playerApi[0].offsetHeight); //-25
                 offval = 0;
            } else {
                YouThumb.attr('width',  playerApi[0].offsetHeight + (playerApi[0].offsetHeight / 3));
                YouThumb.attr('height', playerApi[0].offsetHeight);
                offval = (playerApi[0].offsetWidth - (playerApi[0].offsetHeight + (playerApi[0].offsetHeight / 3))) / 2;
            }

            YouThumb.css('left', parseInt(YouThumb.css('left'))+offval+'px');
            $('#YouThumbButton').html('<img id=YouThumbImage src='+imgSrc+' width=18px height=18px /> '+t.hide_thumb[LANG]);
            $('#movie_player').css('visibility','hidden');

        } else { // if thumb exist need to remove thumbnail

            $('#YouThumbButton').html('<img id=YouThumbImage src='+imgSrc+' width=18px height=18px /> '+t.show_thumb[LANG]);
            YouThumb.remove();
            $('#movie_player').css('visibility','visible');
        }
    }

    function SetButton(){ //if(document.getElementById("YouThumbButton")!==null) return;

        var YouThumb = $('#YouThumb');
        if(YouThumb.length !== 0){
            YouThumb.remove();
            $('#movie_player').css('visibility','visible');
        }
        
        if($('#YouThumbButton').length !== 0) return;

        try {
            imgSrc = $('link[itemprop="thumbnailUrl"]')[0].href;
        }
        catch(err) {
            //alert(err.message);
            cl($('link'));
            var $body = $('body');
            cl($body.find('link'));
            cl($('link[itemprop="thumbnailUrl"]'));
        }
        
        //yt-uix-button yt-uix-button-hh-text
        $("<span><button id=YouThumbButton class='yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup  yt-uix-button-toggled yt-uix-post-anchor yt-uix-tooltip'><img id=YouThumbImage src="+imgSrc+" width=18px height=18px /> "+t.show_thumb[LANG]+"</button></span>").appendTo($('.like-button-renderer')[0]);

        $('#YouThumbButton').on('click', ShowHideThumbnail);

        /*<link itemprop="thumbnailUrl" href="https://i.ytimg.com/vi/8FOBxcluXdk/maxresdefault.jpg">
             var YouThumbImg = document.createElement("img"); // creating our Thumb picture that we need to show
              YouThumbImg.setAttribute("src",links);
              if((YouThumbImg.naturalWidth==120 && YouThumbImg.naturalHeight==90) || YouThumbImg.naturalWidth==0) links = links.replace(/maxres/,'hq');
       if(YouThumbExt.YouThumbImage!=links) YouThumbExt.YouThumbImage=links;*/
    }

    var mocallback = function(mutationrecords){
        if(/watch/i.test(location.href)) setTimeout(SetButton, 1000); // TODO launch every 200 msecs. while element link[itemprop="thumbnailUrl"] not be found, and no more than 50 times!
    };
    
        //cl(typeof document.querySelector('title').nodeType);

        //cl(document.getElementById('eow-title').nodeType);
        mo = new MutationObserver(mocallback);
        options = {'childList': true};
        //mo.observe(qs('head>title'), options);
        mo.observe($('title')[0], options);
        //mo.observe(document.title, options);
        //mo.observe(document.getElementById('eow-title'), options);
  });

})(window.jQuery.noConflict(true));