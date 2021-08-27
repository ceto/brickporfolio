import $ from 'jquery';
import 'what-input';
import 'slick-carousel';
import AOS from 'aos';
import 'jquery-inview';
import Player from '@vimeo/player';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

// Foundation JS relies on a global variable. In ES6, all imports are hoisted
// to the top of the file so if we used `import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';


$(document).foundation();

AOS.init({
    offset: 48,
    duration: 400,
    easing: "ease-in-out-sine",
    delay: 0,
    once: true,
    //anchor-placement: 'top-bottom',
    disable: "mobile"
});



var ge = 0;
var gitems = [];
$('.citem__links').each(function(index, element) {
    $(this).children().attr('data-slide', index);
    $(this).children().each( function(i, e) {
        $(this).attr('data-ge', ge++);
    });
});

/*************************
 *
 * 
 * Photoswipe
 * 
 * 
 ************************/

var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
 
    var parseThumbnailElements = function(el) {

        // var ge = 0;
        var items = [];
        $('.citem__links').each(function(index, element) {
            // $(this).children().attr('data-slide', index);
            $(this).children().each( function(i, e) {
                // $(this).attr('data-ge', ge++);
                var itemtype = $(this).attr('data-type');
                var item = {};
                var size = $(this).attr('data-size').split('x');
                switch (itemtype) {
                    case 'loop':
                        item = {
                            html: '<div class="wrapper wrapper--cvideo">' + $(this).attr('data-loopvideo') + '</div>',
                            slideno: index
                        };
                        break;
                    case 'vimeo':
                        item = {
                            html: '<div class="wrapper">' + $(this).attr('data-vimeoembed') + '</div>',
                            slideno: index
                        };
                        break;
                    default:
                        item = {
                            src: $(this).attr('href'),
                            w: parseInt(size[0], 10),
                            h: parseInt(size[1], 10),
                            slideno: index
                        };
                }

                items.push(item);
            });
        });
        return items;
    };
// End parseThumbnailElements.    

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'DIV');
        });

        if(!clickedListItem) {
            return;
        }

        
        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
            index;

        index = $(eTarget).attr('data-ge');

        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            closeEl:false,
            fullscreenEl: false,
            zoomEl: false,
            shareEl: false,
            counterEl: false,
            //arrowEl: false,


        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }
        
        /*  Extension to photoswipe. 
            Set index with item.start */
        for (var findInd = 0; findInd < items.length; findInd++) {
            if (items[findInd].start) {
                options.index = findInd;
                break;
            }   
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();


        // gallery.listen('gettingData', function(index,item) {
        //     $('.vimeoembed iframe').each( function(i,element) {
        //         var jqueryPlayer = new Player($(element));
        //         $(element).on('inview', function(event, isInView) {
        //             if (isInView) {
        //             //console.log('bejött: ' + $(element).attr('title'));
        //             jqueryPlayer.play();
        //             } else {
        //             //console.log('kiment: ' + $(element).attr('title'));
        //             jqueryPlayer.pause();
        //             }
        //         });
        //     });
            
        // });

        gallery.listen('afterChange', function()  { 
            // index - index of a slide that was loaded
            // item - slide object
            // console.log(gallery.currItem.slideno);
            $('.vimeoembed iframe').each( function(i,element) {
                var jqueryPlayer = new Player($(element));
                $(element).on('inview', function(event, isInView) {
                    if (isInView) {
                    //console.log('bejött: ' + $(element).attr('title'));
                    jqueryPlayer.play();
                    } else {
                    //console.log('kiment: ' + $(element).attr('title'));
                    jqueryPlayer.pause();
                    }
                });
            });
            $homecarousel.slick('slickGoTo', gallery.currItem.slideno);
        });

    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }

};



var slickIsChanging = false;

const $homecarousel = $('.homecarousel');
const $navcarousel = $('.navcarousel');

var bigLeft = $homecarousel.offset().left;
var ipanelPad = document.documentElement.clientWidth / 100 * 3;
var containerWidth = $homecarousel.innerWidth();
var isTrackpad = false;

$(window).bind('resize', function () {
    bigLeft = $homecarousel.offset().left;
    ipanelPad = document.documentElement.clientWidth / 100 * 3;
    containerWidth = $homecarousel.innerWidth();
});


function detectTrackPad(e) {
    isTrackpad = false;
    if (e.wheelDeltaY) {
        // console.log(e.wheelDeltaY +' | ' + (e.deltaY * -3));
        if (e.wheelDeltaY === (e.deltaY * -3)) {
            isTrackpad = true;
        }
    }
    else if (e.deltaMode === 0) {
        isTrackpad = true;
    }
    console.log(isTrackpad ? "Trackpad detected" : "Mousewheel detected");
}

document.addEventListener("mousewheel", detectTrackPad, false);
document.addEventListener("DOMMouseScroll", detectTrackPad, false);

// Pause all videos
// document.querySelectorAll('video').forEach(vid => vid.pause());

//Videos autostart/pause
$('video').bind('inview', function (event, visible, topOrBottomOrBoth) {
    if (visible == true) {
      this.play();
    } else {
      this.pause();
    }
});


$homecarousel
    .on("init", function (event, slick) {
        initPhotoSwipeFromDOM('.homecarousel');
        //slick slider callback must be defined before creating slick object
        mouseWheel($homecarousel);
        var elSlide = $(slick.$slides[slick.slickGetOption('initialSlide')]);
        $('.carouselstatus').html('pages 1-2 / ' + slick.$slides.length*2);
    })
    .on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        slickIsChanging = true;
        // // Pause all videos
        // document.querySelectorAll('video').forEach(vid => vid.pause());
        $('.carouselstatus').addClass('willchange');
    })
    .on('afterChange', function (event, slick, currentSlide) {
        slickIsChanging = false;
        var elSlide = $(slick.$slides[currentSlide]);
        var matrix = $(elSlide).closest('.slick-track').css('transform').replace(/[^0-9\-.,]/g, '').split(',');
        var x = parseInt(matrix[12] || matrix[4]);
      
        $('.carouselstatus').html('pages ' + (currentSlide*2+1) + '-' + (currentSlide*2+2) + ' / ' + slick.$slides.length*2);
        
        $('.carouselstatus').removeClass('willchange');
        
    })
    .slick({
        arrows: false,
        infinite: false,
        initialSlide: 0,
        centerMode: true,
        centerPadding: 0,
        slidesToShow: 1,
        variableWidth: false,
        verticalSwiping: false,
        draggable: false,
        asNavFor: '.navcarousel',
        // focusOnSelect: true,
        speed: 300,
        // cssEase: 'ease-out',
        // easing: 'ease-out',
        useCSS: false,
        // useTransform: false
        fade: true,
        cssEase: 'linear'

    });

$navcarousel.slick({
    arrows: false,
    infinite: false,
    initialSlide: $homecarousel.slick('slickGetOption', 'initialSlide'),
    centerMode: true,
    centerPadding: 0,
    slidesToShow: 11,
    variableWidth: true,
    asNavFor: '.homecarousel',
    focusOnSelect: true,
    speed: $homecarousel.slick('slickGetOption', 'speed'),
    cssEase: 'ease-out',
    // easing: 'ease-out'
});



function mouseWheel($homecarousel) {
    $homecarousel.on(
        "mousewheel DOMMouseScroll wheel MozMousePixelScroll",
        {
            $homecarousel: $homecarousel
        },
        mouseWheelHandler
    );
}



function mouseWheelHandler(event) {
    // console.log(event);
    event.preventDefault();
    // event.stopPropagation();
    var $slideContainer = $(this);

    if (!$slideContainer.hasClass('scrolling') && slickIsChanging == false) {
        $slideContainer.addClass('scrolling');
        var $homecarousel = event.data.$homecarousel;
        var delta = event.originalEvent.deltaY;
        if (delta > 0) {
            if (($homecarousel.slick('slickCurrentSlide') + 1) < $homecarousel.slick('getSlick').slideCount) {
                $homecarousel.slick('slickNext', false);
            }
        } else {
            if ($homecarousel.slick('slickCurrentSlide') > 0) { $homecarousel.slick('slickPrev', false); }
        }
    }

    if (!isTrackpad) {
        setTimeout(function () {
            $slideContainer.removeClass('scrolling');
        }, 300);
    } else {
        setTimeout(function () {
            $slideContainer.removeClass('scrolling');
        }, 1000);
    }
}


$('.slick-arrow').on('click', function (e) {
    var $this = $(this);
    e.preventDefault();
    var $slideContainer = $('.homecarousel');

    if (!$slideContainer.hasClass('scrolling') && slickIsChanging == false) {
        $slideContainer.addClass('scrolling');
        if ($this.hasClass('slick-next')) {
            if (($homecarousel.slick('slickCurrentSlide') + 1) < $homecarousel.slick('getSlick').slideCount) {
                $homecarousel.slick('slickNext', false);
            }
        } else {
            if ($homecarousel.slick('slickCurrentSlide') > 0) { $homecarousel.slick('slickPrev', false); }
        }
    }

    setTimeout(function () {
        $slideContainer.removeClass('scrolling');
    }, 300);
});


$('.js-restartslideshow').on('click', function(e) {
    $homecarousel.slick('slickGoTo', 0);
})

