var skrill_sso_provider = "https://sso.skrill.com/sso";  
var skrill_integration_url = "https://account.skrill.com";  

var skrill_auth = function(authenticated) {
	toggle_form( authenticated );
}

function toggle_form(logged)
{
	if ( logged ) {
		if (typeof onSsoKnowUser == 'function') {
			onSsoKnowUser(sso_provider.email);
		}
	} else {
		if (typeof onSsoAnonymous == 'function') {
			onSsoAnonymous();
		}
	}
}

$(function() {
	// document ready
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	
	script.setAttribute("src", skrill_sso_provider+"/authorized.js?callback=skrill_auth");
	head.appendChild(script);
});
