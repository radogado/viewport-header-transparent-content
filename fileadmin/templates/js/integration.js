"use strict";
/*global escape: true */

/* URI parameters */

function updateURLParameter(url, param, paramVal) {
    // return input string with updated/added URL parameter
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] !== param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function getURLParameters () { // return all URL parameters in an array

	var res = {},
		re = /[?&]([^?&]+)=([^?&]+)/g;
	location.href.replace(re, function(_,k,v) {
		res[k] = v;
	});
	return res;

}

function createCookie(name, value, days) {
	
	var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else { 
	    expires = "";
	}
  
  var dDomain = ".skrill.com";
  if (document.domain.indexOf(".neterra.skrill.net") >= 0) {
    dDomain = ".neterra.skrill.net";
  }
 
  document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/; domain=" + dDomain + ";";
  
}

// URI parameters relay. Omit links starting with "javascript", "mailto", skip parameters not listed in the array

var parameters_list = new Array ('no_cache', /* 'p', */ 'source', 'L', 'rid', /* 'l', */ 'logo', 'tab', 'alloffers', 'type', 'success', 'password_reset', 'promo_id');

function relayParameters () {

	var parameters = getURLParameters();

	for (var name in parameters) {
	
		if (parameters.hasOwnProperty(name)) {
			 
			if (name === 'promo_id') {
	
			  createCookie (name, parameters[name], 1);
	
			}
	
			if (name === 'rid') {
	
			  createCookie (name, parameters[name], 30);
	
			}
	
			if (name === 'source') {
	
			  if (location.href.indexOf('skrillit') > -1) {
	
			    createCookie ('webgains_mt_referrer', parameters[name], 30);
	
			  } else {
	
			    createCookie ('referrer', parameters[name], 30);
	
			  }
	
			}
		
		}
	
	} 

	$('a[href]').each( function () {
		
		if ($('.tab-menu').has(this).length > 0) { // Sizzle throws error on Windows
			
			return;

		}
		
		for (var name in parameters) {

			if (parameters.hasOwnProperty(name)) {
	
				if ( parameters_list.indexOf(name) === -1 ) {
					continue;
				}
				var el = this;
				if ( !el.href.indexOf('javascript') || (!el.href.indexOf('mailto') ) ) {
					
					continue;
				
				}
				var hash = el.href.split('#')[1] ? ( '#' + el.href.split('#')[1] ) : '';
				el.href = updateURLParameter( el.href.split('#')[0], name, parameters[name] ) + hash;
		
			}
			
		} 
		
	});

	$('form[method="post"]').each( function () {
		
		for (var name in parameters) {

			if (parameters.hasOwnProperty(name)) {
	
				if ( parameters_list.indexOf(name) === -1 ) {
					continue;
				}
				this.action = updateURLParameter( this.action, name, parameters[name] );
		
			}
			
		}
		
	});

}

$(document).ready(function() {

	// Relay URI parameters to links

	relayParameters();
	if ( typeof $('.section.iframe iframe')[0] != 'undefined' ) { // Relay RID etc to iframes
		
		$('.section.iframe iframe')[0].src = $('.section.iframe iframe')[0].src.split('?')[0] + '?' + location.href.split('?')[1];
	
	}

});

/* Countdown timer */

var SkrillCountdown = function() {
    return {

        countdown: {},
        contentContainer:  '#content',
        countdownPrefix:   '#skrill_countdown_',        // + days|hours|minutes|seconds
        countdownSuffix:   ' b',

        initialize: function(remaining) {

            this.hideCountdown();
            this.setRemainingTime(remaining);
            this.initializeCountdown();

        },

        countdownExists: function() {
            return $(this.countdownPrefix + 'days').length > 0;
        },

        hideCountdown: function() {
            if (this.countdownExists) {
                $(this.countdownPrefix + 'days').closest('.csc-default').hide();
            }
        },

        showCountdown: function() {
            if (this.countdownExists) {
                $(this.countdownPrefix + 'days').closest('.csc-default').show();
            }
        },

        setRemainingTime: function(secondsRemaining) {
            this.countdown.secondsRemaining = secondsRemaining;

            this.countdown.days = Math.floor(secondsRemaining / 86400);
            secondsRemaining -= this.countdown.days * 86400;
            this.countdown.hours = Math.floor(secondsRemaining / 3600) % 24;
            secondsRemaining -= this.countdown.hours * 3600;
            this.countdown.minutes = Math.floor(secondsRemaining / 60) % 60;
            secondsRemaining -= this.countdown.minutes * 60;
            this.countdown.seconds = secondsRemaining;
        },

        decrementRemainingTime: function() {
            this.setRemainingTime(this.countdown.secondsRemaining - 1);
        },

        initializeCountdown: function() {
            var that = this;
            setTimeout(function() {
                that.showCountdown();
            }, 1000);
            setInterval(function() {
                that.decrementRemainingTime();
                that.updateCountdown();
            }, 1000);
        },

        updateCountdown: function() {
            $(this.countdownPrefix + 'days' + this.countdownSuffix).text(this.leadingZero(this.countdown.days));
            $(this.countdownPrefix + 'hours' + this.countdownSuffix).text(this.leadingZero(this.countdown.hours));
            $(this.countdownPrefix + 'minutes' + this.countdownSuffix).text(this.leadingZero(this.countdown.minutes));
            $(this.countdownPrefix + 'seconds' + this.countdownSuffix).text(this.leadingZero(this.countdown.seconds));
        },

        leadingZero: function(numberToFormat) {
            return ("0" + numberToFormat).slice (-2);
        },

        nullFunction: function(){}
    };
}();

function isTouchDevice() {return !!('ontouchstart' in window) || !!('msmaxtouchpoints' in window.navigator);}

if (!isTouchDevice()) {
	
	$('body').addClass('no-touch');
	
}

$(document).ready(function() {

    if (typeof time_override == 'number') {
	    
	    SkrillCountdown.initialize(time_override);

	} else {

	    if (typeof time == 'number') {
		    
		    SkrillCountdown.initialize(time);
	
		}
	
	}
	
});

$(window).load(function() {

 // executes when complete page is fully loaded, including all frames, objects and images

});

function submitForm(a){var el;var ready_to_submit;return el=a.target,ready_to_submit=!0,$(el).find(".mandatory").each(function(){return el=this,el.querySelector("input, select, textarea")&&!el.querySelector("input, select, textarea").value||el.querySelector("input[type=checkbox]")&&!el.querySelector("input[type=checkbox]").checked||el.querySelector("input[type=email]")&&!RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.querySelector("input[type=email]").value)||el.querySelector("input[type=url]")&&!RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.querySelector("input[type=url]").value)||el.querySelector("input[type=number]")&&!RegExp(/^\d+$/).test(el.querySelector("input[type=number]").value)||el.querySelector("input[type=number][data-digits]")&&el.querySelector("input[type=number]").value.length!=el.querySelector("input[type=number]").getAttribute("data-digits")||el.querySelector("input[type=radio]")&&!el.querySelector("input[type=radio]").checked?(ready_to_submit=!1,void $(el).addClass("alert").find("input").focus()):void $(el).removeClass("alert")}),ready_to_submit};

$('#content .form-wrapper form').each(function (n) {
	
	$(this)[0].onsubmit = submitForm;
	
});
