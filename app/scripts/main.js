/*global Modernizr, skrollr*/

'use strict';

var feature = {
    addEventListener : !!window.addEventListener,
    querySelectorAll : !!document.querySelectorAll
};

var isMobile = Modernizr.mq( 'only screen and (min-device-width : 320px) and (max-device-width : 480px)' );

var since97 = {

    el: {
        sections: document.querySelectorAll( 'section' ),
        loading: document.getElementById( 'loading' )
    },

    setupScroll: function() {
        var wHeight = window.innerHeight;
        since97.step1 = wHeight*2;
        since97.step2 = since97.step1 + wHeight;
        since97.step3 = since97.step2 + wHeight/2;
        since97.step4 = since97.step3 + wHeight*2;
    },

    init: function() {
        if ( ! isMobile) {
            since97.setupScroll();
        }
    },

    launch: function() {
        if ( ! isMobile) {
            since97.skrollr = skrollr.init({
                smoothScrolling: true,
                smoothScrollingDuration: 1000,
                forceHeight: true,
                constants: {
                    step1: since97.step1,
                    step2: since97.step2,
                    step3: since97.step3,
                    step4: since97.step4
                }
            });
        } else {
            window.alert( 'Pour profiter pleinement du site, merci de vous connecter depuis un ordinateur ou une tablette' );
        }
        since97.el.loading.parentNode.removeChild( since97.el.loading );
        Array.prototype.forEach.call( since97.el.sections, function( section ) {
            if (section.classList) {
                section.classList.add( 'loaded' );
            }
            else {
                section.className += ' loaded';
            }
        });
    }

};

if ( feature.addEventListener && feature.querySelectorAll ) {

    document.addEventListener( 'DOMContentLoaded', since97.init, false );

    window.addEventListener( 'load', function() {
        setTimeout( function() {
            since97.launch();
        }, 2500 );
    }, false);

}
