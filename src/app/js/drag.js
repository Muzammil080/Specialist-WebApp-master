function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id).onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {

    document.getElementById("renderer1").classList.remove("renderer1animation");

    e = e || window.event;

    var w = window,
    d = document,
    ee = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || ee.clientWidth || g.clientWidth,
    y = w.innerHeight|| ee.clientHeight|| g.clientHeight;
    
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    
    elmnt.style.top = "calc(100vh - " + ( y - (elmnt.offsetTop - pos2) ) + "px)" ; 
    elmnt.style.left = "calc(100% - " + ( x - (elmnt.offsetLeft - pos1) ) + "px)";

   
     
  }

  function closeDragElement() {
    
   
    /* stop moving when mouse button is released:*/
    var w = window,
    d = document,
    ee = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || ee.clientWidth || g.clientWidth,
    y = w.innerHeight|| ee.clientHeight|| g.clientHeight;

    if (parseInt(( x - (elmnt.offsetLeft - pos1) )) > x ) {
      
      elmnt.style.left = "calc(100% - " + (x) +"px)";
    }
    if (parseInt(( x - (elmnt.offsetLeft - pos1) )) < 280 ) {

      if (elmnt.id == "renderer1") {
        elmnt.style.left = "calc(100% - 280px)";
      }else if(elmnt.id != "renderer1" && parseInt(( x - (elmnt.offsetLeft - pos1) )) < 200){
        elmnt.style.left = "calc(100% - 200px)";
      }
     
    }
    
    if (parseInt(( y - (elmnt.offsetTop - pos2) )) < 180 ) {
      
      if (elmnt.id == "renderer1") {
        elmnt.style.top = "calc(100vh - 180px)";
      }else if(elmnt.id != "renderer1" && parseInt(( y - (elmnt.offsetTop - pos2) )) < 150 ) {
        elmnt.style.top = "calc(100vh - 150px)";
      }
     
    }

    if (parseInt(( y - (elmnt.offsetTop - pos2) )) > (y - closeDragElementoffsetTop ) ) {
      
      elmnt.style.top = "calc(100vh - " + (y - closeDragElementoffsetTop) +"px)";
    }

    document.onmouseup = null;
    document.onmousemove = null;
    
    document.getElementById("renderer1").classList.add("renderer1animation");
  }
}


