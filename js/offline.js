
var isOnline = function () {
}, isOffline = function () {
	window.ons.notification.alert({
		message: _app_localization.noConnection[_app_userLang],
	});
};
if (window.addEventListener) {
	/*
		Works well in Firefox and Opera with the 
		Work Offline option in the File menu.
		Pulling the ethernet cable doesn't seem to trigger it.
		Later Google Chrome and Safari seem to trigger it well
	*/
	window.addEventListener("online", isOnline, false);
	window.addEventListener("offline", isOffline, false);
}
else {
	/*
		Works in IE with the Work Offline option in the 
		File menu and pulling the ethernet cable
	*/
	document.body.ononline = isOnline;
	document.body.onoffline = isOffline;
}

document.addEventListener("resume", function () {
	if (navigator.onLine === false) {
		window.ons.notification.alert({
			message: _app_localization.noConnection[_app_userLang],
		});
	}
}, false);