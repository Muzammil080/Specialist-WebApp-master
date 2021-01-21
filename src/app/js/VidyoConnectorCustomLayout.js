var discnt = false;

function showStatsVidyo() {
    peerConnection.getStats(function (stats) {

    });
}

function onVidyoClientLoaded(status) {
    switch (status.state) {
        case "READY":    // The library is operating normally
            $("#connectionStatus").html("Ready to Connect");
            $("#helper").addClass("hidden");
            $("#toolbarLeft").removeClass("hidden");
            $("#toolbarCenter").removeClass("hidden");
            $("#toolbarRight").removeClass("hidden");

            // After the VidyoClient is successfully initialized a global VC object will become available
            // All of the VidyoConnector gui and logic is implemented in VidyoConnectorCustomLayout.js
            StartVidyoConnector(VC);
            break;
        case "RETRYING": // The library operating is temporarily paused
            // $("#connectionStatus").html("Temporarily unavailable retrying in " + status.nextTimeout/1000 + " seconds");
            break;
        case "FAILED":   // The library operating has stopped
            // joinViaBrowser();
            $online = $('.online'),
                $online.fadeIn();
            // ShowFailed(status);
            // $("#connectionStatus").html("Failed: " + status.description);
            break;
        case "FAILEDVERSION":   // The library operating has stopped
            UpdateHelperPaths(status);
            ShowFailedVersion(status);
            $("#connectionStatus").html("Failed: " + status.description);
            break;
        case "NOTAVAILABLE": // The library is not available
            UpdateHelperPaths(status);
            $("#connectionStatus").html(status.description);
            break;
    }
    return true; // Return true to reload the plugins if not available
}
function UpdateHelperPaths(status) {
    $("#helperPlugInDownload").attr("href", status.downloadPathPlugIn);
    $("#helperAppDownload").attr("href", status.downloadPathApp);
}
function ShowFailed(status) {
    var helperText = '';
    // Display the error
    helperText += '<h2>An error occurred, please reload</h2>';
    helperText += '<p>' + status.description + '</p>';

    $("#helperText").html(helperText);
    $("#failedText").html(helperText);
    $("#failed").removeClass("hidden");
}
function ShowFailedVersion(status) {
    var helperText = '';
    // Display the error
    helperText += '<h4>Please Download a new plugIn and restart the browser</h4>';
    helperText += '<p>' + status.description + '</p>';

    $("#helperText").html(helperText);
}

function loadVidyoClientLibrary(webrtc, plugin) {
    // If webrtc, then set webrtcLogLevel
    var webrtcLogLevel = "";
    if (webrtc) {
        // Set the WebRTC log level to either: 'info' (default), 'error', or 'none'
        webrtcLogLevel = '&webrtcLogLevel=info';
    }

    checkinternet();
    //We need to ensure we're loading the VidyoClient library and listening for the callback.
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = "vidyoscript";
    // script.src = 'https://static.vidyo.io/4.1.20.3/javascript/VidyoClient/VidyoClient.js?onload=onVidyoClientLoaded&webrtc=' + webrtc + '&plugin=' + plugin + '&useNativeWebRTC=true' + webrtcLogLevel;    
    // script.src = 'https://static.vidyo.io/4.1.24.15/javascript/VidyoClient/VidyoClient.js?onload=onVidyoClientLoaded&webrtc=' + webrtc + '&plugin=' + plugin + webrtcLogLevel;
    //  script.src = 'https://static.vidyo.io/4.1.20.3/javascript/VidyoClient/VidyoClient.js?onload=onVidyoClientLoaded&webrtc=true&plugin=false&useNativeWebRTC=false'; 
    script.src = 'https://static.vidyo.io/4.1.24.15/javascript/VidyoClient/VidyoClient.js?onload=onVidyoClientLoaded&webrtc=true&plugin=false&useTranscodingWebRTC=false';
    document.getElementsByTagName('head')[0].appendChild(script);
    document.getElementsByTagName("BODY")[0].style.overflow = "hidden";
}
function joinViaBrowser() {
    $("#helperText").html("Loading...");
    $("#helperPicker").addClass("hidden");
    loadVidyoClientLibrary(true, false);

}

function joinViaPlugIn() {
    $("#helperText").html("Don't have the PlugIn?");
    $("#helperPicker").addClass("hidden");
    $("#helperPlugIn").removeClass("hidden");
    loadVidyoClientLibrary(false, true);
}

function joinViaElectron() {
    $("#helperText").html("Electron...");
    $("#helperPicker").addClass("hidden");
    loadVidyoClientLibrary(false, true);
}

function joinViaApp() {
    $("#helperText").html("Don't have the app?");
    $("#helperPicker").addClass("hidden");
    $("#helperApp").removeClass("hidden");
    var protocolHandlerLink = 'vidyoconnector://' + window.location.search;
    /* launch */
    $("#helperAppLoader").attr('src', protocolHandlerLink);
    loadVidyoClientLibrary(false, false);
}

function joinViaOtherApp() {
    $("#helperText").html("Don't have the app?");
    $("#helperPicker").addClass("hidden");
    $("#helperOtherApp").removeClass("hidden");
    var protocolHandlerLink = 'vidyoconnector://' + window.location.search;
    /* launch */
    $("#helperOtherAppLoader").attr('src', protocolHandlerLink);
    loadVidyoClientLibrary(false, false);
}

function loadHelperOptions() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Opera 8.0+
    var isOpera = (userAgent.indexOf("Opera") || userAgent.indexOf('OPR')) != -1;
    // Firefox
    var isFirefox = userAgent.indexOf("Firefox") != -1;
    // Chrome 1+
    var isChrome = userAgent.indexOf("Chrome") != -1;
    // Safari
    var isSafari = !isChrome && userAgent.indexOf("Safari") != -1;
    // AppleWebKit
    var isAppleWebKit = !isSafari && !isChrome && userAgent.indexOf("AppleWebKit") != -1;
    // Internet Explorer 6-11
    var isIE = (userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true);
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    // Check if Mac
    var isMac = navigator.platform.indexOf('Mac') > -1;
    // Check if Windows
    var isWin = navigator.platform.indexOf('Win') > -1;
    // Check if Linux
    var isLinux = navigator.platform.indexOf('Linux') > -1;
    // Check if Android
    var isAndroid = userAgent.indexOf("android") > -1;
    // Check if WebRTC is available
    var isWebRTCAvailable = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || (navigator.mediaDevices ? navigator.mediaDevices.getUserMedia : undefined);


    if (!isMac && !isWin && !isLinux) {
        /* Mobile App*/
        if (isAndroid) {
            $("#joinViaApp").removeClass("hidden");
        } else {
            $("#joinViaOtherApp").removeClass("hidden");
        }
        if (isWebRTCAvailable) {
            /* Supports WebRTC */
            $("#joinViaBrowser").removeClass("hidden");
        }
    } else {
        /* Desktop App */
        $("#joinViaApp").removeClass("hidden");

        if (isWebRTCAvailable) {
            /* Supports WebRTC */
            $("#joinViaBrowser").removeClass("hidden");
        }
        if (isSafari || (isAppleWebKit && isMac) || (isIE && !isEdge)) {
            /* Supports Plugins */
            $("#joinViaPlugIn").removeClass("hidden");
        }
    }
}

// Runs when the page loads
$(function () {

    // joinViaBrowser();

});
////////////////////////////////////////////////////////////////
const OPEN_REMOTE_SLOT = "-1";

function ShowRenderer(vidyoConnector, divId) {
    var rndr = document.getElementById(divId);
    vidyoConnector.ShowViewAt({ viewId: divId, x: rndr.offsetLeft, y: rndr.offsetTop, width: rndr.offsetWidth, height: rndr.offsetHeight });
    // vidyoConnector.ShowViewAt(divId, rndr.offsetLeft, rndr.offsetTop, rndr.offsetWidth, rndr.offsetHeight);
}

function showReconnectOption() {
    document.getElementById('sessionEndOption').style.display = 'block';
    document.getElementById("connecting-line-3").style.display = "block";
    document.getElementById("connecting-1").style.visibility = 'hidden';
    document.getElementById("connecting-2").style.visibility = 'hidden';
    document.getElementById("connecting-3").style.visibility = 'hidden';
    document.getElementById("connecting-text-1").style.display = 'none';
    document.getElementById("connecting-text-2").style.display = 'none';
    document.getElementById("connecting-text-3").style.display = 'none';
    document.getElementById("material-icons-4").style.color = 'red';
}
// Run StartVidyoConnector when the VidyoClient is successfully loaded
function StartVidyoConnector(VC) {

    var vidyoConnector;
    var stethoscopestatus = false;
    var cameras = {};
    var microphones = {};
    var speakers = {};
    var selectedLocalCamera = { id: 0, camera: null };
    var cameraPrivacy = false;
    var microphonePrivacy = false;
    var remoteCameras = {};
    var configParams = {};

    // rendererSlots[0] is used to render the local camera;
    // rendererSlots[1] through rendererSlots[5] are used to render up to 5 cameras from remote participants.
    var rendererSlots = ["1", OPEN_REMOTE_SLOT, OPEN_REMOTE_SLOT, OPEN_REMOTE_SLOT, OPEN_REMOTE_SLOT, OPEN_REMOTE_SLOT];



    VC.CreateVidyoConnector({
        viewId: null, // Set to null in order to create a custom layout
        viewStyle: "VIDYO_CONNECTORVIEWSTYLE_Default", // Visual style of the composited renderer
        remoteParticipants: 6,     // Maximum number of participants to render
        logFileFilter: "warning info@VidyoClient info@VidyoConnector",
        logFileName: "VidyoConnector.log",
        userData: 0,
        showViewLabel: false,
    }).then(function (vc) {



        if (vc) {

            vidyoConnector = vc;
            vidyoConnector.SetAdvancedConfiguration({ codecExcludeFilter: "VP8" });
            window.onresize = function () {
                showRenderers();
            };
            parseUrlParameters(configParams);
            registerDeviceListeners(vidyoConnector, cameras, microphones, speakers, rendererSlots, selectedLocalCamera, remoteCameras, configParams);
            handleDeviceChange(vidyoConnector, cameras, microphones, speakers);
            handleParticipantChange(vidyoConnector, rendererSlots, remoteCameras, configParams);
            joinLeave();
        } else {
            showReconnectOption();
        }


        // Populate the connectionStatus with the client version
        vidyoConnector.GetVersion().then(function (version) {
            $("#clientVersion").html("v " + version);
        }).catch(function () {
            console.error("GetVersion failed");
        });

        // If enableDebug is configured then enable debugging
        if (configParams.enableDebug === "1") {
            vidyoConnector.EnableDebug({ port: 7776, logFilter: "warning info@VidyoClient info@VidyoConnector" }).then(function () {
            }).catch(function () {
            });
        }

        // Handle camera privacy and microphone privacy initial state
        if (configParams.cameraPrivacy === "1") {
            $("#cameraButton").click();
        }
        if (configParams.microphonePrivacy === "1") {
            $("#microphoneButton").click();
        }

        // Join the conference if the autoJoin URL parameter was enabled
        if (configParams.autoJoin === "1") {
            joinLeave();
        } else {
            // Handle the join in the toolbar button being clicked by the end user.
            $("#joinLeaveButton").one("click", joinLeave);
        }
    }).catch(function (err) {
        console.error("CreateVidyoConnector Failed " + err);
    });

    // Handle the camera privacy button, toggle between show and hide.
    $("#cameraButton").click(function () {
        // CameraPrivacy button clicked
        cameraPrivacy = !cameraPrivacy;
        vidyoConnector.SetCameraPrivacy({
            privacy: cameraPrivacy
        }).then(function () {
            if (cameraPrivacy) {
                // Hide the local camera preview, which is in slot 0
                // $("#cameraButton").addClass("cameraOff").removeClass("cameraOn");
                document.getElementById("renderer0").style.display = "none";
                document.getElementById("camIcon").classList.remove("icon_vm_video");
                document.getElementById("camIcon").classList.add("icon_vm_video_disable");
                document.getElementById("cameraButton").classList.remove("light");
                document.getElementById("cameraButton").classList.add("dark");

                vidyoConnector.HideView({ viewId: "renderer0" }).then(function () {
                }).catch(function (e) {
                });
            } else {
                // Show the local camera preview, which is in slot 0
                // $("#cameraButton").addClass("cameraOn").removeClass("cameraOff");
                document.getElementById("renderer0").style.display = "block";
                document.getElementById("camIcon").classList.remove("icon_vm_video_disable");
                document.getElementById("camIcon").classList.add("icon_vm_video");
                document.getElementById("cameraButton").classList.remove("dark");
                document.getElementById("cameraButton").classList.add("light");

                vidyoConnector.AssignViewToLocalCamera({
                    viewId: "renderer0",
                    localCamera: selectedLocalCamera.camera,
                    displayCropped: configParams.localCameraDisplayCropped,
                    allowZoom: false
                }).then(function () {
                    ShowRenderer(vidyoConnector, "renderer0");
                }).catch(function (e) {
                });
            }
        }).catch(function () {
        });
    });

    // Handle the microphone mute button, toggle between mute and unmute audio.
    $("#microphoneButton").click(function () {
        // MicrophonePrivacy button clicked
        microphonePrivacy = !microphonePrivacy;
        vidyoConnector.SetMicrophonePrivacy({
            privacy: microphonePrivacy
        }).then(function () {
            if (microphonePrivacy) {
                document.getElementById("micIcon").classList.remove("icon_vm_mic");
                document.getElementById("micIcon").classList.add("icon_vm_mute");
                document.getElementById("microphoneButton").classList.remove("light");
                document.getElementById("microphoneButton").classList.add("dark");
                // $("#microphoneButton").addClass("microphoneOff").removeClass("microphoneOn");
            } else {
                // $("#microphoneButton").addClass("microphoneOn").removeClass("microphoneOff");
                document.getElementById("micIcon").classList.remove("icon_vm_mute");
                document.getElementById("micIcon").classList.add("icon_vm_mic");
                document.getElementById("microphoneButton").classList.remove("dark");
                document.getElementById("microphoneButton").classList.add("light");
            }
        }).catch(function () {
        });
    });

  
    
    function joinLeave() {

        connectToConference(vidyoConnector, rendererSlots, remoteCameras, configParams);
        $("#joinLeaveButton").one("click", joinLeave);
    }


}

function registerDeviceListeners(vidyoConnector, cameras, microphones, speakers, rendererSlots, selectedLocalCamera, remoteCameras, configParams) {
    // Map the "None" option (whose value is 0) in the camera, microphone, and speaker drop-down menus to null since
    // a null argument to SelectLocalCamera, SelectLocalMicrophone, and SelectLocalSpeaker releases the resource.
    cameras[0] = null;
    microphones[0] = null;
    speakers[0] = null;
    var onAddedFirst = true;
    // Handle appearance and disappearance of camera devices in the system
    vidyoConnector.RegisterLocalCameraEventListener({
        onAdded: function (localCamera) {
            // New camera is available
            $("#cameras").append("<option value='" + window.btoa(localCamera.id) + "'>" + localCamera.name + "</option>");
            cameras[window.btoa(localCamera.id)] = localCamera;
        },
        onRemoved: function (localCamera) {
            // Existing camera became unavailable
            $("#cameras option[value='" + window.btoa(localCamera.id) + "']").remove();
            delete cameras[window.btoa(localCamera.id)];

            // If the removed camera was the selected camera, then hide it
            if (selectedLocalCamera.id === localCamera.id) {
                vidyoConnector.HideView({ viewId: "renderer0" }).then(function () {
                }).catch(function (e) {
                });
            }
        },
        onSelected: function (localCamera) {
            // Camera was selected/unselected by you or automatically
            if (localCamera) {
                $("#cameras option[value='" + window.btoa(localCamera.id) + "']").prop('selected', true);
                selectedLocalCamera.id = localCamera.id;
                selectedLocalCamera.camera = localCamera;

                // Assign view to selected camera
                vidyoConnector.AssignViewToLocalCamera({
                    viewId: "renderer0",
                    localCamera: localCamera,
                    displayCropped: configParams.localCameraDisplayCropped,
                    allowZoom: false
                }).then(function () {

                    dragElement(document.getElementsByClassName('renderer0')[0]);
                    dragElement(document.getElementsByClassName('renderer1')[0]);
                    ShowRenderer(vidyoConnector, "renderer0");
                }).catch(function (e) {
                });
            } else {
                selectedLocalCamera.id = 0;
                selectedLocalCamera.camera = null;
            }
        },
        onStateUpdated: function (localCamera, state) {
            // Camera state was updated
        }
    }).then(function () {
    }).catch(function () {
    });

    // Handle appearance and disappearance of microphone devices in the system
    vidyoConnector.RegisterLocalMicrophoneEventListener({
        onAdded: function (localMicrophone) {
            // New microphone is available
            $("#microphones").append("<option value='" + window.btoa(localMicrophone.id) + "'>" + localMicrophone.name + "</option>");
            microphones[window.btoa(localMicrophone.id)] = localMicrophone;
        },
        onRemoved: function (localMicrophone) {
            // Existing microphone became unavailable
            $("#microphones option[value='" + window.btoa(localMicrophone.id) + "']").remove();
            delete microphones[window.btoa(localMicrophone.id)];
        },
        onSelected: function (localMicrophone) {
            // Microphone was selected/unselected by you or automatically
            if (localMicrophone)
                $("#microphones option[value='" + window.btoa(localMicrophone.id) + "']").prop('selected', true);
        },
        onStateUpdated: function (localMicrophone, state) {
            // Microphone state was updated
        }
    }).then(function () {
    }).catch(function () {
    });

    // Handle appearance and disappearance of speaker devices in the system
    vidyoConnector.RegisterLocalSpeakerEventListener({
        onAdded: function (localSpeaker) {
            // New speaker is available
            $("#speakers").append("<option value='" + window.btoa(localSpeaker.id) + "'>" + localSpeaker.name + "</option>");
            speakers[window.btoa(localSpeaker.id)] = localSpeaker;
        },
        onRemoved: function (localSpeaker) {
            // Existing speaker became unavailable
            $("#speakers option[value='" + window.btoa(localSpeaker.id) + "']").remove();
            delete speakers[window.btoa(localSpeaker.id)];
        },
        onSelected: function (localSpeaker) {
            // Speaker was selected/unselected by you or automatically
            if (localSpeaker)
                $("#speakers option[value='" + window.btoa(localSpeaker.id) + "']").prop('selected', true);
        },
        onStateUpdated: function (localSpeaker, state) {
            // Speaker state was updated
        }
    }).then(function () {
    }).catch(function () {
    });

    vidyoConnector.RegisterRemoteCameraEventListener({
        onAdded: function (camera, participant) {
            // Store the remote camera for this participant


            var PName;

            if (participant.name == "Kart" && onAddedFirst) {
                showoverlay();
                //  dragElement(document.getElementsByClassName('renderer1')[0]);
                onAddedFirst = false;
                //   PName = participant.name
            } else {
                //   PName = "Sp1"
            }



            remoteCameras[participant.id] = { camera: camera, isRendered: false };

            // Scan through the renderer slots and look for an open slot.
            // If an open slot is found then assign it to the remote camera.
            for (var i = 1; i < rendererSlots.length; i++) {
                if (rendererSlots[i] === OPEN_REMOTE_SLOT && participant.name == "Kart") {
                    rendererSlots[i] = participant.id;
                    remoteCameras[participant.id].isRendered = true;
                    vidyoConnector.AssignViewToRemoteCamera({
                        viewId: "renderer" + (i),
                        remoteCamera: camera,
                        displayCropped: true,
                        allowZoom: false
                    }).then(function (retValue) {
                        document.getElementById("call-connecting").style.display = "none";
                        canvassetup(document.getElementById('canvascontanier'));
                        ShowRenderer(vidyoConnector, "renderer" + (i));
                    }).catch(function () {
                        rendererSlots[i] = OPEN_REMOTE_SLOT;
                        remoteCameras[participant.id].isRendered = false;
                    });
                    break;
                }
            }
        },
        onRemoved: function (camera, participant) {
            delete remoteCameras[participant.id];


            for (var i = 1; i < rendererSlots.length; i++) {
                if (rendererSlots[i] === participant.id) {
                    rendererSlots[i] = OPEN_REMOTE_SLOT;
                    vidyoConnector.HideView({ viewId: "renderer" + (i) }).then(function () {

                        // If a remote camera is not rendered in a slot, replace it in the slot that was just cleaered
                        for (var id in remoteCameras) {
                            if (!remoteCameras[id].isRendered) {
                                rendererSlots[i] = id;
                                remoteCameras[id].isRendered = true;
                                vidyoConnector.AssignViewToRemoteCamera({
                                    viewId: "renderer" + (i),
                                    remoteCamera: remoteCameras[id].camera,
                                    displayCropped: configParams.remoteCameraDisplayCropped,
                                    allowZoom: false
                                }).then(function (retValue) {
                                    ShowRenderer(vidyoConnector, "renderer" + (i));
                                }).catch(function () {
                                    rendererSlots[i] = OPEN_REMOTE_SLOT;
                                    remoteCameras[id].isRendered = false;
                                });
                                break;
                            }
                        }
                    }).catch(function (e) {
                    });
                    break;
                }
            }
        },
        onStateUpdated: function (camera, participant, state) {
            // Camera state was updated
        }
    }).then(function () {
    }).catch(function () {
    });
}

function handleDeviceChange(vidyoConnector, cameras, microphones, speakers) {
    // Hook up camera selector functions for each of the available cameras
    $("#cameras").change(function () {
        // Camera selected from the drop-down menu
        $("#cameras option:selected").each(function () {
            // Hide the view of the previously selected local camera
            vidyoConnector.HideView({ viewId: "renderer0" });

            // Select the newly selected local camera
            camera = cameras[$(this).val()];
            vidyoConnector.SelectLocalCamera({
                localCamera: camera
            }).then(function () {
            }).catch(function () {
            });
        });
    });

    // Hook up microphone selector functions for each of the available microphones
    $("#microphones").change(function () {
        // Microphone selected from the drop-down menu
        $("#microphones option:selected").each(function () {
            microphone = microphones[$(this).val()];
            vidyoConnector.SelectLocalMicrophone({
                localMicrophone: microphone
            }).then(function () {
            }).catch(function () {
            });
        });
    });

    // Hook up speaker selector functions for each of the available speakers
    $("#speakers").change(function () {
        // Speaker selected from the drop-down menu
        $("#speakers option:selected").each(function () {
            speaker = speakers[$(this).val()];
            vidyoConnector.SelectLocalSpeaker({
                localSpeaker: speaker
            }).then(function () {
            }).catch(function () {
            });
        });
    });
}

function getParticipantName(participant, cb) {
    if (!participant) {
        cb("Undefined");
        return;
    }

    if (participant.name) {
        cb(participant.name);
        return;
    }

    participant.GetName().then(function (name) {
        cb(name);
    }).catch(function () {
        cb("GetNameFailed");
    });
}

function handleParticipantChange(vidyoConnector, rendererSlots, remoteCameras, configParams) {

    // var msgbase64=" ";
    var Start = false;

    var Sound = (function () {
        var df = document.createDocumentFragment();
        return function Sound(src) {
            var snd = new Audio(src);
            df.appendChild(snd); // keep in fragment until finished playing
            snd.addEventListener('ended', function () { df.removeChild(snd); });
            snd.crossOrigin = 'anonymous';
            snd.play();
            return snd;
        }
    }());

    // function Base64Decode(str, encoding = 'utf-8') {
    //     var bytes = base64js.toByteArray(str);
    //     return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
    // }

    vidyoConnector.RegisterMessageEventListener({

        onChatMessageReceived: function (participant, chatMessage) {

            if (chatMessage.body == "__cmd__;call_disconnectfromKart;") {
                $cartdisconect = $('.cartdisconect');
                $cartdisconect.fadeIn();
                discnt = true;

                setTimeout(function () {
                    disconnectCall();
                    $cartdisconect.fadeOut();
                    // window.location.href = '';
                }, 1000);


            } else {


            }

        }
    }).then(function () {
    }).catch(function () {
    });

    vidyoConnector.RegisterParticipantEventListener({
        onJoined: function (participant) {
            getParticipantName(participant, function (name) {
                $("#participantStatus").html("" + name + " Joined");
                if (name == 'Kart') {
                    $cartoffline = $('.cartoffline');
                    $cartoffline.fadeOut();

                    setTimeout(function () {
                        document.getElementById("call-connecting").style.display = "none";
                    }, 2000);

                }
            });
        },
        onLeft: function (participant) {
            getParticipantName(participant, function (name) {
                if (!discnt && name == 'Kart') {
                    $cartoffline = $('.cartoffline');

                    setTimeout(function () {
                        $cartoffline.fadeIn();
                    }, 3000);

                }
            });


        },
        onDynamicChanged: function (participants, cameras) {
            // Order of participants changed
        },
        onLoudestChanged: function (participant, audioOnly) {

        }
    }).then(function () {
    }).catch(function () {
    });
}

function parseUrlParameters(configParams) {
    // Fill in the form parameters from the URI
    var host = getUrlParameterByName("host");
    if (host)
        $("#host").val(host);
    var token = getUrlParameterByName("token");
    if (token)
        $("#token").val(token);
    var displayName = getUrlParameterByName("displayName");
    if (displayName)
        $("#displayName").val(displayName);
    var resourceId = getUrlParameterByName("resourceId");
    if (resourceId)
        $("#resourceId").val(resourceId);
    configParams.autoJoin = getUrlParameterByName("autoJoin");
    configParams.enableDebug = getUrlParameterByName("enableDebug");
    configParams.microphonePrivacy = getUrlParameterByName("microphonePrivacy");
    configParams.cameraPrivacy = getUrlParameterByName("cameraPrivacy");
    configParams.hideConfig = getUrlParameterByName("hideConfig");

    var displayCropped = getUrlParameterByName("localCameraDisplayCropped");
    configParams.localCameraDisplayCropped = displayCropped ? (displayCropped === "1") : true;

    displayCropped = getUrlParameterByName("remoteCameraDisplayCropped");
    configParams.remoteCameraDisplayCropped = displayCropped ? (displayCropped === "1") : true;

    // If the parameters are passed in the URI, do not display options dialog,
    // and automatically connect.
    if (host && token && displayName && resourceId) {
        $("#optionsParameters").addClass("optionsHidePermanent");
    }

    if (configParams.hideConfig == "1") {
        updateRenderers(true);
    }

    return;
}

function showRenderers() {


    ShowRenderer(vidyoConnector, "renderer0");
    ShowRenderer(vidyoConnector, "renderer1");
    ShowRenderer(vidyoConnector, "renderer2");
    ShowRenderer(vidyoConnector, "renderer3");
    ShowRenderer(vidyoConnector, "renderer4");
    ShowRenderer(vidyoConnector, "renderer5");


}

function updateRenderers(fullscreen) {
    if (fullscreen) {
        $("#options").addClass("optionsHide");
        $("#renderer0").css({ 'position': 'absolute', 'left': 'calc(100% - 200px)', 'right': '0%', 'top': 'calc(100vh - 150px)', 'bottom': '0%', 'width': '200px', 'height': '150px', 'z-index': '5' });
        $("#renderer1").css({ 'position': 'absolute', 'left': '0%', 'right': '0%', 'top': '0px', 'bottom': '0%', 'width': '100%', 'height': '100vh', 'z-index': '2' });
        // $("#renderer2").css({'position': 'absolute', 'left': '0%', 'right':  '0%', 'top': 'calc(100vh - (155px * 1) )', 'bottom': '0%',  'width': '200px' , 'height': '150px' , 'z-index': '5'});
        // $("#renderer3").css({'position': 'absolute', 'left': '0%', 'right':  '0%', 'top': 'calc(100vh - (155px * 2) )', 'bottom': '0%',  'width': '200px' , 'height': '150px' , 'z-index': '5'});
        // $("#renderer4").css({'position': 'absolute', 'left': '0%', 'right':  '0%', 'top': 'calc(100vh - (155px * 3) )', 'bottom': '0%',  'width': '200px' , 'height': '150px' , 'z-index': '5'});
        // $("#renderer5").css({'position': 'absolute', 'left': '0%', 'right':  '0%', 'top': 'calc(100vh - (155px * 4) )', 'bottom': '0%',  'width': '200px' , 'height': '150px' , 'z-index': '5'});
    } else {
        $("#options").removeClass("optionsHide");
        $("#renderer0").css({ 'position': 'absolute', 'left': '0%', 'right': '0%', 'top': '0px', 'bottom': '0%', 'width': '100%' });
        $("#renderer1").css({ 'position': 'absolute', 'width': '0px' });
        $("#renderer2").css({ 'position': 'absolute', 'width': '0px' });
        $("#renderer3").css({ 'position': 'absolute', 'width': '0px' });
        $("#renderer4").css({ 'position': 'absolute', 'width': '0px' });
        $("#renderer5").css({ 'position': 'absolute', 'width': '0px' });
    }

    showRenderers();
}

// Attempt to connect to the conference
// We will also handle connection failures
// and network or server-initiated disconnects.
function connectToConference(vidyoConnector, rendererSlots, remoteCameras, configParams) {
    // Abort the Connect call if resourceId is invalid. It cannot contain empty spaces or "@".
    // if ( $("#resourceId").val().indexOf(" ") != -1 || $("#resourceId").val().indexOf("@") != -1) {
    //     console.error("Connect call aborted due to invalid Resource ID");
    //     connectorDisconnected(rendererSlots, remoteCameras, "Disconnected", "");
    //     $("#error").html("<h3>Failed due to invalid Resource ID" + "</h3>");
    //     return;
    // }

    // Clear messages
    $("#error").html("");
    $("#message").html("<h3 class='blink'>CONNECTING...</h3>");

    // READ STRING FROM LOCAL STORAGE
    var retrievedObject = sessionStorage.getItem('vidyo');
    //  var retrievedObject2 = localStorage.getItem('user_web');

    // CONVERT STRING TO REGULAR JS OBJECT
    var parsedObject = JSON.parse(retrievedObject);
    //  var parsedObject2 = JSON.parse(retrievedObject2);

    vidyoConnector.Connect({
        // Take input from options form
        host: parsedObject.host,
        token: parsedObject.token,
        displayName: sessionStorage.getItem('userName'),
        resourceId: parsedObject.resourceId,

        // Define handlers for connection events.
        onSuccess: function () {
            // Connected
            $("#connectionStatus").html("Connected");

            if (configParams.hideConfig != "1") {
                updateRenderers(true);
            }
            $("#message").html("");
        },
        onFailure: function (reason) {
            // Failed
            console.error("vidyoConnector.Connect : onFailure callback received");
            connectorDisconnected(rendererSlots, remoteCameras, "Failed", "");
            $("#error").html("<h3>Call Failed: " + reason + "</h3>");
        },
        onDisconnected: function (reason) {
            // Disconnected
            connectorDisconnected(rendererSlots, remoteCameras, "Disconnected", "Call Disconnected: " + reason);

            if (configParams.hideConfig != "1") {
                updateRenderers(false);
            }
        }
    }).then(function (status) {
        if (status) {
        } else {
            console.error("Connect Failed");
            connectorDisconnected(rendererSlots, remoteCameras, "Failed", "");
            $("#error").html("<h3>Call Failed" + "</h3>");
        }
    }).catch(function () {
        console.error("Connect Failed");
        connectorDisconnected(rendererSlots, remoteCameras, "Failed", "");
        $("#error").html("<h3>Call Failed" + "</h3>");
    });
}

// Connector either fails to connect or a disconnect completed, update UI
// elements and clear rendererSlots and remoteCameras.
function connectorDisconnected(rendererSlots, remoteCameras, connectionStatus, message) {
    $("#connectionStatus").html(connectionStatus);
    $("#message").html(message);
    $("#participantStatus").html("");
    $("#joinLeaveButton").removeClass("callEnd").addClass("callStart");
    $('#joinLeaveButton').prop('title', 'Join Conference');

    // Clear rendererSlots and remoteCameras when not connected in case not cleared
    // in RegisterRemoteCameraEventListener onRemoved.
    for (var i = 1; i < rendererSlots.length; i++) {
        if (rendererSlots[i] != OPEN_REMOTE_SLOT) {
            rendererSlots[i] = OPEN_REMOTE_SLOT;
            vidyoConnector.HideView({ viewId: "renderer" + (i) }).then(function () {
            }).catch(function (e) {
            });
        }
    }
    remoteCameras = {};
}

// Extract the desired parameter from the browser's location bar
function getUrlParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function disconnectCallbefore() {
    //  window.location.reload();
    sessionStorage.removeItem('vidyo');
    sessionStorage.removeItem('reasonForRequest');
    sessionStorage.removeItem('facilityName');
    window.location.href = '';
    // fullscreen();

}

//added buttons on video screen 
function resetcameraButton() {
    var commandBlock = "__cmd__;reset;";
    vidyoConnector.SendChatMessage({
        message: commandBlock
    }).then(function () {
    }).catch(function () {
    });
}


function stethoscopeButton() {

    stethoscopestatus = !stethoscopestatus;
    if (stethoscopestatus) {
        document.getElementById("stethoscopeButton").classList.remove("dark");
        document.getElementById("stethoscopeButton").classList.add("light");
    } else {
        document.getElementById("stethoscopeButton").classList.remove("light");
        document.getElementById("stethoscopeButton").classList.add("dark");
    }
}

function routeToHome() {
    setTimeout(function () {
        window.location.href = '';
    }, 500);
}

function disconnectCall() {

    var commandBlock = "__cmd__;call_disconnect;";

    if (vidyoConnector) {
        vidyoConnector.HideView({ viewId: "renderer0" }).then(function () {
        }).catch(function (e) {
        });

        vidyoConnector.SendChatMessage({
            message: commandBlock
        }).then(function () {
            vidyoConnector.Disconnect().then(function () {
                routeToHome();
            }).catch(function () {
                routeToHome();
            });
        }).catch(function () {
            routeToHome();
        });

    } else {
        routeToHome();
    }


    sessionStorage.removeItem('vidyo');
    sessionStorage.removeItem('reasonForRequest');
    sessionStorage.removeItem('facilityName');

}
var microphonePrivacy = false;
function stethoscopeButtonMicrophoneToggle() {
    microphonePrivacy = !microphonePrivacy;
    vidyoConnector.SetMicrophonePrivacy({
        privacy: microphonePrivacy
    }).then(function () {
        if (microphonePrivacy) {
            document.getElementById("micIcon").classList.remove("icon_vm_mic");
            document.getElementById("micIcon").classList.add("icon_vm_mute");
            document.getElementById("microphoneButton").classList.remove("light");
            document.getElementById("microphoneButton").classList.add("dark");
            // $("#microphoneButton").addClass("microphoneOff").removeClass("microphoneOn");
        } else {
            // $("#microphoneButton").addClass("microphoneOn").removeClass("microphoneOff");
            document.getElementById("micIcon").classList.remove("icon_vm_mute");
            document.getElementById("micIcon").classList.add("icon_vm_mic");
            document.getElementById("microphoneButton").classList.remove("dark");
            document.getElementById("microphoneButton").classList.add("light");
        }
    }).catch(function () {
    });
}

function homepageredirect() {
    window.location.href = '';

}

window.addEventListener('message', function (event) {

    // IMPORTANT: Check the origin of the data! 
    if (~event.origin.indexOf('https://dev-aws.veemed.com')) {
        // The data has been sent from your site 

        // The data sent with postMessage is stored in event.data 
    } else {
        // The data hasn't been sent from your site! 
        // Be careful! Do not use it. 
        return;
    }
}); 