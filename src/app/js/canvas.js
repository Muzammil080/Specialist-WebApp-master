var mouseeventblock = false;
var participantsList = new Array();
var selfviewid;
var closeDragElementoffsetTop = 75;

function canvassetup(canvas) {
  canvas.width = document.body.clientWidth;
  canvas.height = window.innerHeight;
  canvasW = canvas.width;
  canvasH = canvas.height;
}

function showoverlay() {
  var canvas = document.getElementById("canvascontanier"),
    ctx = canvas.getContext("2d"),
    rect = {},
    dragclick = false;

  $(window).resize(function() {
    canvassetup(document.getElementById("canvascontanier"));
  });

  function init() {
    canvassetup(document.getElementById("canvascontanier"));

    var pressinterval;
    var mousepress = true;
    var clickCount = 0;
    var doubleclicked = false;

    function myStartFunction() {
      pressinterval = setInterval(function() {
        alertFunc();
      }, 200);
    }

    function alertFunc() {
      mousepress = true;
      var commandBlock = "__cmd__;zoom_in;";

      vidyoConnector
        .SendChatMessage({
          message: commandBlock
        })
        .then(function() {})
        .catch(function() {});
    }

    function myStopFunction() {
      clearInterval(pressinterval);
    }

    canvas.addEventListener("mousedown", function(event) {
      if ($("input[name=Scheme]:checked").val() == 1) {
        rect.startX = event.clientX;
        rect.startY = event.clientY;
        if (event.which == 1) {
          clickCount++;
          if (clickCount === 1) {
            singleClickTimer = setTimeout(function() {
              clickCount = 0;
              doubleclicked = false;
              mousepress = false;
            }, 300);

            myStartFunction();
          } else if (clickCount === 2) {
            doubleclicked = true;
            mousepress = false;
            clearTimeout(singleClickTimer);
            clickCount = 0;
          }
        } else if (event.which == 2) {
        } else if (event.which == 3) {
          dragclick = true;
          rect.w = 0;
          rect.h = 0;
        }
      }
      if ($("input[name=Scheme]:checked").val() == 2) {
        rect.startX = event.clientX;
        rect.startY = event.clientY;
        if (event.which == 1) {
          dragclick = true;
          rect.w = 0;
          rect.h = 0;

          clickCount++;
          if (clickCount === 1) {
            singleClickTimer = setTimeout(function() {
              clickCount = 0;
              doubleclicked = false;
            }, 500);
          } else if (clickCount === 2) {
            doubleclicked = true;

            clickCount = 0;
          }
        } else if (event.which == 2) {
        } else if (event.which == 3) {
        }
      }
    });

    canvas.addEventListener("mouseup", function(event) {
      if ($("input[name=Scheme]:checked").val() == 1) {
        revisedstartY = rect.startY - 75;
        if (event.which == 1) {
          myStopFunction();
          setTimeout(function() {
            if (!mousepress) {
              if (doubleclicked) {
              } else {
                var commandBlock =
                  "__cmd__;ptz_start;point " +
                  rect.startX +
                  " " +
                  rect.startY +
                  ";screen_width " +
                  canvas.width +
                  ";screen_height " +
                  canvas.height +
                  ";ptz_end;";
              }

              vidyoConnector
                .SendChatMessage({
                  message: commandBlock
                })
                .then(function() {})
                .catch(function() {});
            }
            if (doubleclicked) {
              var commandBlock = "__cmd__;zoom_out;";
              vidyoConnector
                .SendChatMessage({
                  message: commandBlock
                })
                .then(function() {})
                .catch(function() {});
              doubleclicked = false;
            }
          }, 300);

          mousepress = true;
        } else if (event.which == 2) {
        } else if (event.which == 3) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          dragclick = false;

          if (rect.w == 0) {
          } else {
            var commandBlock =
              "__cmd__;ptz_start;point " +
              rect.startX +
              " " +
              rect.startY +
              ";rectangle " +
              Math.abs(rect.w * 2) +
              " " +
              Math.abs(rect.h * 2) +
              ";screen_width " +
              canvas.width +
              ";screen_height " +
              canvas.height +
              ";ptz_end;";
            vidyoConnector
              .SendChatMessage({
                message: commandBlock
              })
              .then(function() {})
              .catch(function() {});
          }
        }
      } else if ($("input[name=Scheme]:checked").val() == 2) {
        if (event.which == 1) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          dragclick = false;
          revisedstartY = rect.startY - 75;
          if (rect.w == 0) {
            if (doubleclicked) {
            } else {
              var commandBlock =
                "__cmd__;ptz_start;point " +
                rect.startX +
                " " +
                rect.startY +
                ";screen_width " +
                canvas.width +
                ";screen_height " +
                canvas.height +
                ";ptz_end;";
              vidyoConnector
                .SendChatMessage({
                  message: commandBlock
                })
                .then(function() {})
                .catch(function() {});
            }
          } else {
            var commandBlock =
              "__cmd__;ptz_start;point " +
              rect.startX +
              " " +
              rect.startY +
              ";rectangle " +
              Math.abs(rect.w * 2) +
              " " +
              Math.abs(rect.h * 2) +
              ";screen_width " +
              canvas.width +
              ";screen_height " +
              canvas.height +
              ";ptz_end;";
            vidyoConnector
              .SendChatMessage({
                message: commandBlock
              })
              .then(function() {})
              .catch(function() {});
          }
        } else if (event.which == 2) {
        } else if (event.which == 3) {
          var commandBlock = "__cmd__;reset;";
          vidyoConnector
            .SendChatMessage({
              message: commandBlock
            })
            .then(function() {})
            .catch(function() {});
        }
      }
    });

    canvas.addEventListener("dblclick", function(event) {
      event.preventDefault(); //cancel system double-click event
    });

    canvas.addEventListener("mousemove", function(event) {
      if (dragclick) {
        rect.w = event.pageX - this.offsetLeft - rect.startX;

        rect.h = rect.w;
        draw();
      }

      return true;
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var x = rect.startX;
      var y = rect.startY;

      if ($("input[name=Color]:checked").val() == 1) {
        ctx.beginPath();
        ctx.arc(x, y, Math.abs(rect.w), 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#00aecd";
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#00aecd";
        ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
      } else if ($("input[name=Color]:checked").val() == 2) {
        ctx.beginPath();
        ctx.arc(x, y, Math.abs(rect.w), 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#28B463";
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#28B463";
        ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
      }
    }

    function getOS() {
      var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
        windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
        iosPlatforms = ["iPhone", "iPad", "iPod"],
        os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = "MacOS";
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = "iOS";
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = "Windows";
      } else if (/Android/.test(userAgent)) {
        os = "Android";
      } else if (!os && /Linux/.test(platform)) {
        os = "Linux";
      }

      return os;
    }

    var lasttime = 0;
    function detectMouseWheelDirection(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      var delta = null,
        direction = false;
      if (!event) {
        // if the event is not provided, we get it from the window object
        event = window.event;
      }
      if (event.wheelDelta) {
        // will work in most cases
        delta = event.wheelDelta / 60;
      } else if (event.detail) {
        // fallback for Firefox
        delta = -event.detail / 2;
      }
      if (delta !== null) {
        currenttime = Date.now();

        if (currenttime > lasttime) {
          if (getOS() === "MacOS") {
            direction = delta > 0 ? "__cmd__;zoom_out;" : "__cmd__;zoom_in;";
          } else {
            direction = delta > 0 ? "__cmd__;zoom_in;" : "__cmd__;zoom_out;";
          }
          if (!mouseeventblock) {
            vidyoConnector
              .SendChatMessage({
                message: direction
              })
              .then(function() {})
              .catch(function() {});
          }
        } else {
        }
        lasttime = Date.now() + 25;
      }

      return direction;
    }

    function handleMouseWheelDirection(direction) {}

    document.documentElement.addEventListener(
      "gesturestart",
      function(event) {
        event.preventDefault();
      },
      false
    );

    $(document).keydown(function(event) {
      if (
        event.ctrlKey == true &&
        (event.which == "61" ||
          event.which == "107" ||
          event.which == "173" ||
          event.which == "109" ||
          event.which == "187" ||
          event.which == "189")
      ) {
        event.preventDefault();
      }
    });

    var mousewheelevt = /Firefox/i.test(navigator.userAgent)
      ? "DOMMouseScroll"
      : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x

    if (document.attachEvent) {
      document.attachEvent("on" + mousewheelevt, function(event) {
        event.preventDefault();
        if ($("input[name=Scheme]:checked").val() == 1) {
        }
        if ($("input[name=Scheme]:checked").val() == 2) {
          handleMouseWheelDirection(detectMouseWheelDirection(event));
        }
      });
    } //if IE (and Opera depending on user setting)
    else if (document.addEventListener) {
      //WC3 browsers
      document.addEventListener(
        mousewheelevt,
        function(event) {
          event.preventDefault();
          if ($("input[name=Scheme]:checked").val() == 1) {
          }
          if ($("input[name=Scheme]:checked").val() == 2) {
            handleMouseWheelDirection(detectMouseWheelDirection(event));
          }
        },
        false
      );
    }
  }

  init();
}

// window.onbeforeunload = function () {
//   // alert("testttt");
// };

$(document).keypress(function(event) {
  if (window.location.href.endsWith("/verification")) {
    if (event.which == "13") {
      event.preventDefault();
    }
  }
});

if (document.addEventListener) {
  document.addEventListener("webkitfullscreenchange", fullscreenhandler, false);
  document.addEventListener("mozfullscreenchange", fullscreenhandler, false);
  document.addEventListener("fullscreenchange", fullscreenhandler, false);
  document.addEventListener("MSFullscreenChange", fullscreenhandler, false);
}

$(document).on("keydown", function(ev) {
  if (ev.keyCode === 27 || ev.keyCode === 122) return false;
});

function fullscreen() {
  if (
    (document.fullScreenElement && document.fullScreenElement !== null) ||
    (!document.mozFullScreen && !document.webkitIsFullScreen)
  ) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
    }
    closeDragElementoffsetTop = 0;
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }

    closeDragElementoffsetTop = 75;
  }
}

function fullscreenhandler() {
  if (
    (document.fullScreenElement && document.fullScreenElement !== null) ||
    (!document.mozFullScreen && !document.webkitIsFullScreen)
  ) {
    document.getElementById("navbar").style.visibility = "visible";
  } else {
    document.getElementById("navbar").style.visibility = "hidden";
  }
}
