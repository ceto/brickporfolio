window.paceOptions = {
    startOnPageLoad:false
}

import Pace from 'pace-progressbar';

function remove(element) {
    element.parentNode.removeChild(element);
}

Pace.start({
    minTime: 1200,
    ghostTime: 800,
    // catchupTime: 1000,
    // ajax: false, // disabled
    // document: false, // disabled
    // eventLag: false, // disabled
    elements: false,
});
Pace.on('done', function () {

});
Pace.on('hide', function () {
    document.querySelector('.weare').style.opacity = '0';
    document.querySelector('.pace').style.opacity = '0';
});

setTimeout(function () {
    Pace.stop();
}, 3000);

setTimeout(function () {
    document.querySelector('.weare').remove(this.parentNode);    
}, 5000);