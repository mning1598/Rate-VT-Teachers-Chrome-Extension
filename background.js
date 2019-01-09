chrome.browserAction.onClicked.addListener(function(tab) {
  // chrome.tabs.executeScript(null, [
  // 	{file:"jquery-1.11.1.js"},
  // 	{file:"popup.js"}
  // 	]);



  chrome.browserAction.setIcon ( { path: 'icon.png' } );

  chrome.tabs.executeScript(null, {file:"jquery-3.1.1.min.js"}, function() {
  	chrome.tabs.executeScript(null, {file:"bluebird.js"}, function() {
  		chrome.tabs.executeScript(null, {file:"popup.js"});
  	});
  });
});
