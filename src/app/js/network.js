//JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!
var imageAddr = "https://www.google.com.pk/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"; 
var downloadSize = 13504; //bytes

function ShowProgressMessage(msg) {
    if (console) {
        if (typeof msg == "string") {
          
        } else {
            for (var i = 0; i < msg.length; i++) {
              
            }
        }
    }
    
    var oProgress = document.getElementById("progress");
    if (oProgress) {
        var actualHTML = (typeof msg == "string") ? msg : msg.join("<br />");
        oProgress.innerHTML = actualHTML;
    }
}

function InitiateSpeedDetection() {
  
    window.setTimeout(MeasureConnectionSpeed, 1);
};    


// var x = 1;
// ShowProgressMessage("Loading the image, please wait...");
// InitiateSpeedDetection();
// setInterval(function() {
//     InitiateSpeedDetection();
//     x++

   
// }, 2000);
// if (window.addEventListener) {
//     window.addEventListener('load', InitiateSpeedDetection, false);
// } else if (window.attachEvent) {
//     window.attachEvent('onload', InitiateSpeedDetection);
// }

function MeasureConnectionSpeed() {
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    }
    
    download.onerror = function (err, msg) {
        ShowProgressMessage("Invalid image, or error downloading");
    }
    
    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    
    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        ShowProgressMessage([
            "Your connection speed is:", 
            speedBps + " bps", 
            speedKbps + " kbps", 
            speedMbps + " Mbps"
        ]);
    }
}