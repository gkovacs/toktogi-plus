/* Copyright 2015, Brad McDermott, All rights reserved. */
"use strict";

if (window.browser == null) {
	window.browser = chrome;
}

;(function (root, browser) {
	root.browser = browser;

	// Generic

	browser.messageCallbacks = {};

	browser.addListener = function (messageName, callback) {
		browser.messageCallbacks[messageName] = callback;
	}

	browser.sendMessage = function (data, callback) {
		browser.runtime.sendMessage(data, callback);
	}

	browser.messageListener = function (message) {
		const callback = browser.messageCallbacks[message.name];

		callback && callback(message.data);
	}


	// Inject.js

	browser.getRange = function (pageX, pageY) {
		if (document.caretPositionFromPoint) {
			return document.caretPositionFromPoint(pageX, pageY);
		} else {
			let output = document.caretRangeFromPoint(pageX, pageY);
			output.offsetNode = output.startContainer;
			output.offset = output.startOffset;
			return output;
		}
	}

	browser.getOffset = function (range) {
		return range.offset;
	}

	browser.getStartNode = function (range) {
		return range.offsetNode;
	}

	browser.initInject = function () {
		browser.runtime.onMessage.addListener(browser.messageListener);

		browser.sendMessage({ name: "injectedLoaded" });
	}

	browser.getImageUrl = function (filename) {
		return browser.extension.getURL("images/" + filename);
	}
})(window, browser);
