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
        loading: document.getElementById( 'loading' ),
        rsvpForm: document.getElementById( 'rsvp-form' ),
        nameField: document.getElementById( 'name' ),
        emailField: document.getElementById( 'email' ),
        adultsField: document.getElementById( 'adults' ),
        childrenField: document.getElementById( 'children' ),
        messageField: document.getElementById( 'message' ),
        attendField: document.getElementById( 'check-attend' ),
        daysField: document.getElementById( 'check-days' )
    },

    setupScroll: function() {
        var wHeight = window.innerHeight;
        since97.step1 = wHeight*2;
        since97.step2 = since97.step1 + wHeight;
        since97.step3 = since97.step2 + wHeight/2;
        since97.step4 = since97.step3 + wHeight*2;
        since97.step5 = since97.step4 + wHeight;
    },

    setupRsvp: function() {

        var button = document.getElementById( 'rsvp-btn' );

        var setButtonState = function( state ) {
            if (button.classList) {
                button.classList.add( state );
            }
            else {
                button.className += ' ' + state;
            }
            setTimeout( function() {
                if (button.classList) {
                    button.classList.remove( state );
                } else {
                    button.className.replace( new RegExp('(^| )' + state.split(' ').join('|') + '( |$)', 'gi'), ' ' );
                }
                button.removeAttribute( 'disabled' );
            }, 2500);
        };

        var inputs = since97.el.rsvpForm.querySelectorAll( 'input' );
        Array.prototype.forEach.call( inputs, function( input ) {
            input.addEventListener( 'invalid', function() {
                setButtonState( 'error' );
            }, false);
        });

        since97.el.rsvpForm.addEventListener( 'submit',  function( e ) {

            e.preventDefault();
            button.setAttribute( 'disabled', 'disabled' );

            var data = [];
            data.push( since97.el.nameField.name + '=' + encodeURIComponent( since97.el.nameField.value ) );
            data.push( since97.el.emailField.name + '=' + encodeURIComponent( since97.el.emailField.value ) );
            data.push( since97.el.adultsField.name + '=' + encodeURIComponent( since97.el.adultsField.value ) );
            data.push( since97.el.childrenField.name + '=' + encodeURIComponent( since97.el.childrenField.value ) );
            data.push( since97.el.messageField.name + '=' + encodeURIComponent( since97.el.messageField.value ) );
            if ( since97.el.attendField.checked ) {
                data.push( since97.el.attendField.name + '=' + encodeURIComponent( since97.el.attendField.value ) );
            }
            if ( since97.el.daysField.checked ) {
                data.push( since97.el.daysField.name + '=' + encodeURIComponent( since97.el.daysField.value ) );
            }

            var request = new XMLHttpRequest();
            request.open( 'POST', this.action, true );
            request.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
            request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
            request.onreadystatechange = function () {
                if ( request.readyState !== 4 || request.status !== 200 ) {
                    return;
                }
                var result = JSON.parse( request.response );
                setButtonState( result.response );
            };
            request.send( data.join( '&' ) );

        }, false );

    },

    init: function() {
        if ( ! isMobile) {
            since97.setupScroll();
            since97.setupRsvp();
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
                    step4: since97.step4,
                    step5: since97.step5
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
