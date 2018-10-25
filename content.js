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