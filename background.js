chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({url: 'https://lgtm.in/' });
	chrome.storage.local.set({'is_login_proc': true});
});
//chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	switch (request.type) {
		case 'set_name':
			setName(request.name);
			chrome.storage.local.set({'is_login_proc': false});
			generateLgtmUrl();
			break;
		case 'generate_lgtm':
			generateLgtmUrl();
			break;
		case 'get_lgtm':
			var lgtm = getLgtm();
			callback(lgtm);
			return true;
			break;
	}
})

var name = '';
var lgtm = '';

chrome.storage.local.get(['name', 'lgtm'], function(value) {
	if (value.name) {
		name = value.name;
	}
	if (value.lgtm) {
		lgtm = value.lgtm;
	}
	if (!value.name) {
		setIcon(false);
	}
	generateLgtmUrl();
});

var setIcon = function(isOk) {
	if (isOk) {
		chrome.browserAction.setIcon({path:{
			"16":"images/icon-16.png",
			"48":"images/icon-48.png",
			"128":"images/icon-128.png",
		}});
	} else {
		chrome.browserAction.setIcon({path:{
			"16":"images/red-16.png",
			"48":"images/red-48.png",
			"128":"images/red-128.png",
		}});
	}
}

var generateLgtmUrl = function() {
	var url = '';
	var name = getName();
	if (name) {
		url = 'https://lgtm.in/g/' + name;
	} else {
		url = 'https://lgtm.in/g';
	}
	const request = new XMLHttpRequest();
	request.open('GET', url);
	request.addEventListener('load', (event) => {
		var url = event.target.responseURL;
		saveLgtm(url.split('/')[url.split('/').length - 1]);
	});
	request.send();
}

var setName = function(name) {
	this.name = name;
	chrome.storage.local.set({'name': name});
	if (name) {
		setIcon(true);
	}
}
var getName = function() {
	return this.name;
}

var saveLgtm = function(lgtm) {
	this.lgtm = lgtm;
	chrome.storage.local.set({'lgtm': lgtm});
}
var getLgtm = function() {
	return this.lgtm;
}

