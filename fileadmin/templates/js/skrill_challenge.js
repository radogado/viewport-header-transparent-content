var SkrillChallenge = function() {
    return {
        countdown: {},
        contentContainer:  '#content',
        pointsPlaceholder: '#skrill_challenge_points',
        boostPrefix:       '.animated-stepcircles .', // + {{boostIdentifier}}
        countdownPrefix:   '#skrill_challenge_countdown_',        // + days|hours|minutes|seconds
        countdownSuffix:   ' b',

        challengePeriodUrlPrefix: '/' + typoLanguage + '/the-skrill-experience/',
        challengePeriodUrlSuffix: '/',

        statusWebserviceUrl:   'https://promotion.skrill.com/2015/experience/status',
        customerWebserviceUrl: 'https://promotion.skrill.com/2015/experience/customer',
        ssoWebserviceUrl:      'https://sso.skrill.com/sso/authorized.js?callback=SkrillChallenge.nullFunction',

        initialize: function() {
            this.hidePointsPlaceholder();
            this.hideCountdown();

            var that = this;
            $.get(this.statusWebserviceUrl, function(response) {
                if (that.pointsPlaceholderExists()) {
                    that.setRemainingTime(response.secondsRemaining);
                    that.initializeCountdown();
                    that.fetchUserData();
                } else {
                    window.location.replace(that.challengePeriodUrlPrefix + response.identifier +that.challengePeriodUrlSuffix);
                }
            });
        },

        fetchUserData: function() {
            var that = this;
            if (typeof(sso_provider) !== 'undefined') {
                if (sso_provider.cust_id) {
                    $('div.se-login').hide();

                    var webServiceUrl = that.customerWebserviceUrl + '/' + sso_provider.cust_id;
                    var thot = that;
                    $.get(webServiceUrl, function(response) {
                        if (response.status === 'success') {
                            $(thot.pointsPlaceholder).text(response.points);

                            var boostLength = response.boosts.length;
                            for(var i = 0; i < response.boosts.length; i++) {
                                $(thot.boostPrefix + response.boosts[i]).addClass('boostdone');
                            }
                        }
                        thot.showPointsPlaceholder();
                    });
                }
            }
        },

        pointsPlaceholderExists: function() {
            return $(this.pointsPlaceholder).length > 0;
        },

        hidePointsPlaceholder: function() {
            if (this.pointsPlaceholderExists) {
                $(this.pointsPlaceholder).closest('.csc-default').hide();
            }
        },

        showPointsPlaceholder: function() {
            if (this.pointsPlaceholderExists) {
                $(this.pointsPlaceholder).closest('.csc-default').show();
            }
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

        makeCRCTable: function() {
            var c;
            var crcTable = [];
            for(var n =0; n < 256; n++){
                c = n;
                for(var k =0; k < 8; k++){
                    c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                }
                crcTable[n] = c;
            }
            return crcTable;
        },

        crc32: function(str) {
            var crcTable = window.crcTable || (window.crcTable = this.makeCRCTable());
            var crc = 0 ^ (-1);

            for (var i = 0; i < str.length; i++ ) {
                crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
            }

            return (crc ^ (-1)) >>> 0;
        },

        nullFunction: function(){}
    };
}();

$(document).ready(function() {
    SkrillChallenge.initialize();
});
