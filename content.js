/*
* This file used to determine whether or not the shift key is pressed when
* the user clicks on the extension icon. It is not currently in use.
*/

window.addEventListener('keydown',function(event){
    if(event.shiftKey){
        if(chrome.runtime !== undefined) {
            chrome.runtime.sendMessage({type: 'shiftPressed'}, function(){});
        }
    }
});

window.addEventListener('keyup',function(event){
    if(chrome.runtime !== undefined) {
        chrome.runtime.sendMessage({type: 'keyup'}, function(){});
    }
});