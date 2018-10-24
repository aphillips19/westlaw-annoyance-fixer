 // Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// test: https://1.next.westlaw.com/Document/I3a84f1d79c9d11d991d0cc6b54f12d4d/View/FullText.html

'use strict';

var shiftPressed = false;
var temp = 1;

const WRONG_URL_ERROR = "This extension only works on Westlaw sign-off redirect URL's!"
const BOWDOIN_LOGIN = "http://library.bowdoin.edu/erl/ip/westlaw.cgi"

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  switch(request.type){
      case 'shiftPressed':
        shiftPressed = true;
          break;
      case 'keyup':
        shiftPressed = false;
          break;
  }
  sendResponse();
}); 

// run if icon clicked
chrome.browserAction.onClicked.addListener(function(tab) {
  if(!shiftPressed) {
    attemptReturningToPage(tab);
  } else {
    shiftPressed = false;
    attemptSignOn(tab) 
  }
});

// also run if page refreshed
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if (isWestlawSignOn(tab.url) && changeInfo.url === undefined) {
      // find out why this is infinite looping so much :(
  }
});

function attemptSignOn(tab) {
  chrome.tabs.create({'url': BOWDOIN_LOGIN}, function(tab) {
    // Tab opened.
});
}

function isWestlawSignOn(urlString) {
  var url = new URL(urlString)
  if(url.hostname == "signon.thomsonreuters.com") {
    return true
  } else {
    return false
  }
}

function attemptReturningToPage(tab) {
    // get the URL and the returnTo URL
    // ensure that website is a WestLaw page with a returnTo URL
    if(!isWestlawSignOn(tab.url)) {
      alert(WRONG_URL_ERROR)  
      return;
    }
    var url = new URL(tab.url)
    var returnUrl = url.searchParams.get("returnto")
    // if there is a return URL, go there; otherwise, just login.
    if(returnUrl != "null") {
      // decode the returnTo URL
      var decoded = decodeURI(returnUrl)
      navToPage(decoded)
    } else {
      navToPage(BOWDOIN_LOGIN)
    }
}

function navToPage(url) {
  // navigate to the returnTo URL
  chrome.tabs.update(
    {url: url}, // URL to request
    function(tab) {callBack(tab, url); } // callback function
  );
};

function callBack(tab, requestedUrl) {
  // implement later: display helpful pop up reminding user
  // to try logging on.
  chrome.runtime.sendMessage(
    {type: "hint"},
    function(response) { console.log(response);}
  );

}