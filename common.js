var lgtmProc = function() {
	var name = $('.dropdown-toggle').text().trim();
	if (name) {
		chrome.runtime.sendMessage(
			{
				type: "set_name",
				name: name
			},
			null
		);
	}
};

var github = function() {
	$(document).on('keyup', 'textarea', function(e) {
		text = this.value
		index = this.selectionStart;
		var textBefore = text.slice(0, index);
		var textAfter = text.slice(index);
		var tag = ':lgtm:';
		var result = textBefore.match(new RegExp(tag + '$'));
		if (result) {
			chrome.runtime.sendMessage(
				{
					type: "get_lgtm",
					textarea: this
				},
				function(bindVariables, lgtm) {
					textarea = bindVariables.textarea
					textBefore = bindVariables.textBefore
					textAfter = bindVariables.textAfter
					var markdown = '[![LGTM](https://lgtm.in/p/' + lgtm + ')](https://lgtm.in/i/' + lgtm + ')'
					textBefore = textBefore.replace(tag, markdown);
					textarea.value = textBefore + textAfter;
				}.bind(null, {textarea: this, textBefore: textBefore, textAfter: textAfter})
			);

			chrome.runtime.sendMessage(
				{
					type: "generate_lgtm"
				},
				null
			);
		}
	});
}

chrome.storage.local.get(['is_login_proc', 'name'], function(value) {
	if (location.href.match('https://github.com/')) {
		github();
		return;
	}

	if (!value.is_login_proc) {
		return;
	}
	if (location.href.match('https://lgtm.in/')) {
		lgtmProc();
	}
});

