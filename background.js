 // Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// test: https://1.next.westlaw.com/Document/I3a84f1d79c9d11d991d0cc6b54f12d4d/View/FullText.html

'use strict';

var shiftPressed = false;
var temp = 2;
var refreshedTabs = {};

const WRONG_URL_ERROR = "This extension only works on Westlaw sign-off redirect URL's!"
const BOWDOIN_LOGIN = "http://library.bowdoin.edu/erl/ip/westlaw.cgi"

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  switch(request.type){
      // case 'shiftPressed':
      //   shiftPressed = true;
      //     break;
      // case 'keyup':
      //   shiftPressed = false;
      //     break;
      case 'signIn':
        attemptSignOn();
        break;
      case 'refreshPage':
        attemptReturningToPage(request.data)
        break;
  }
  sendResponse();
}); 


/*
// also run if page refreshed
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if (isWestlawSignOn(tab)
        && changeInfo.url === undefined
        && changeInfo.status == "complete") {
      console.log("---");
      console.log(tabId)
      console.log(tab);
      console.log(changeInfo);
      console.log(refreshedTabs)
      console.log("---");
      // add to refreshedTabs dictionary if it's not already there.
      // if it is, don't refresh again
      if(refreshedTabs[tabId] === undefined) {
        attemptReturningToPage(tab)
        refreshedTabs[tabId] = 1
      } else {
        delete refreshedTabs[tabId]
      }
  }
});
*/
function attemptSignOn() {
  chrome.tabs.create({'url': BOWDOIN_LOGIN}, function(tab) {
    // Tab opened.
});
}

function isWestlawSignOn(tab) {
  var url = new URL(tab.url)
  if(url.hostname == "signon.thomsonreuters.com"
      && tab.title == "Westlaw Sign In | Thomson Reuters"
  ) {
    return true
  } else {
    console.log("not westlaw sign on:");
    console.log(tab);
    return false
  }
}

function attemptReturningToPage(tab) {
    console.log("Original URL: " + tab.url);
    // get the URL and the returnTo URL
    // ensure that website is a WestLaw page with a returnTo URL
    if(!isWestlawSignOn(tab)) {
      alert(WRONG_URL_ERROR)  
      return;
    }
    var url = new URL(tab.url)
    var finalUrl = ""
    var returnUrl = url.searchParams.get("returnto")
    // if there is a return URL, go there; otherwise, just login.
    if(returnUrl != "null" && returnUrl != null) {
      // decode the returnTo URL
      var decodedString = decodeURI(returnUrl);
      var decodedUrl = new URL(decodedString);
      var redirectTo = decodedUrl.searchParams.get("redirectTo")
      if(redirectTo == null || redirectTo == "null") {
        finalUrl = decodedString;
      } else {
        redirectTo = decodedUrl.protocol + "//" + decodedUrl.hostname + redirectTo;
        var decodedRedirectToUrl = new URL(decodeURI(redirectTo));
        // take out any search parameters that lead to big problems
        // i.e. "contextData"
        decodedRedirectToUrl.searchParams.delete("contextData");
        finalUrl = decodedRedirectToUrl.toString();
      }
      console.log("Final URL: " + finalUrl)
      navToPage(finalUrl)
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