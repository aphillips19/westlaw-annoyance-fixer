'use strict';

function click(e) {
  var temp = null
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.runtime.sendMessage(
      {
        type: e.target.id,
        data: tabs[0]
      },
      function(){
        window.close();
      }
    );
  });
}

function goToPage(input) {
  chrome.runtime.sendMessage(
    {
      type: "goToPage",
      data: input
    },
    function(){
      window.close();
    }
  )
}

document.addEventListener('DOMContentLoaded', documentEvents  , false);

function myAction(input) { 
    console.log("input value is : " + input.value);
    alert("The entered data is : " + input.value);
    // do processing with data
    // you need to right click the extension icon and choose "inspect popup"
    // to view the messages appearing on the console.
}

function documentEvents() {    

  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }

  // Listen for refresh button
  // document.getElementById('refreshPage').addEventListener('click', returnToPage);
  
  // Listen for text input
  // document.getElementById('ok_btn').addEventListener('click', 
  //   function() { myAction(document.getElementById('urlTextBox'));
  // });
}