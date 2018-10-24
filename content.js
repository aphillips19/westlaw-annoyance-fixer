window.addEventListener('keydown',function(event){
    if(event.shiftKey){
        chrome.runtime.sendMessage({type: 'shiftPressed'}, function(){
        });
    }  
});

window.addEventListener('keyup',function(event){
        chrome.runtime.sendMessage({type: 'keyup'}, function(){});
});