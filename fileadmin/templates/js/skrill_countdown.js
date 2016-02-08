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

$(document).ready(function() {

    if (typeof time == 'number') {
	    
	    SkrillCountdown.initialize(time);
	}
	
});
