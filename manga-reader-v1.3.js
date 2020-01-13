//////////////////////////////////////
// Manga Reader for blogger 1.3
// Compiled Javascript (from any resource)
// License Creative Commons Attribution-Noncommercial-Share Alike 3.0 License.
// Free Copy, Free Use, Free Modification, Give proper credit
//////////////////////////////////////

var showIndex = new Boolean(true);
var indexSeparator = ' ';
var showCaption = new Boolean(true);
var preCache = new Boolean(false);
var pictureID = 'page';
var captionID = 'caption';
var indexID = 'index';
var wrapOn = new Boolean(false);
var slideMode = new Boolean(false);
var slideDelay = 10;
var clickMode = new Boolean(true);
var pageALT = new Boolean(true);

function createRequestObject() {
  FORM_DATA = new Object();
  separator = ',';
  query = '' + this.location;
  query = query.substring((query.indexOf('?')) + 1);
  if (query.length < 1) {
    return false
  }
  keypairs = new Object();
  numKP = 1;
  while (query.indexOf('&') > -1) {
    keypairs[numKP] = query.substring(0, query.indexOf('&'));
    query = query.substring((query.indexOf('&')) + 1);
    numKP++
  }
  keypairs[numKP] = query;
  for (i in keypairs) {
    keyName = keypairs[i].substring(0, keypairs[i].indexOf('='));
    keyValue = keypairs[i].substring((keypairs[i].indexOf('=')) + 1);
    while (keyValue.indexOf('+') > -1) {
      keyValue = keyValue.substring(0, keyValue.indexOf('+')) + ' ' + keyValue.substring(keyValue.indexOf('+') + 1)
    }
    keyValue = unescape(keyValue);
    if (FORM_DATA[keyName]) {
      FORM_DATA[keyName] = FORM_DATA[keyName] + separator + keyValue
    } else {
      FORM_DATA[keyName] = keyValue
    }
  }
  return FORM_DATA
}
FORM_DATA = createRequestObject();
var glbCacheTimer;
var glbSlideTimer;
var glbCurrentpage = 1;
var pages = new Array();
var captions = new Array();
var linkNames = new Array();

function getObjectByID(id) {
  if (document.all) {
    return document.all[id]
  } else {
    return document.getElementById(id)
  }
}

function showpage(index) {
  var theURL = "" + this.location;
  if (theURL.indexOf("?") > 0) {
    theURL = theURL.substring(0, theURL.indexOf("?"))
  }
  theURL += "?page=" + index;
  if (slideMode == true) {
    theURL += "&slideMode=true";
    theURL += "&slideDelay=" + slideDelay
  }
  this.location = theURL
}

function showNext() {
  if (glbCurrentpage >= pages.length) {
    if (wrapOn == true) {
      glbCurrentpage = 1;
      showpage(glbCurrentpage)
    }
  } else {
    glbCurrentpage += 1;
    showpage(glbCurrentpage)
  }
}

function showPrevious() {
  if (glbCurrentpage <= 1) {
    if (wrapOn == true) {
      glbCurrentpage = pages.length;
      showpage(glbCurrentpage)
    }
  } else {
    glbCurrentpage += -1;
    showpage(glbCurrentpage)
  }
}

function showFirst() {
  glbCurrentpage = 1;
  showpage(glbCurrentpage)
}

function showLast() {
  glbCurrentpage = pages.length;
  showpage(glbCurrentpage)
}

// TEST UPDATE FEATURE //
function checkReadMode(){
  if (FORM_DATA["scrollMode"] == "true") {
    scrollpage();
  }else{
    initpage();
  }
}

function scrollpage(){
  // alert("Scroll Page-desu!");
  var pageLocation = getObjectByID(pictureID);
  var i;

  for (let el of document.querySelectorAll('.mnga_pg')) el.style.visibility = 'hidden';
  for(i=0; i<pages.length; i++){
    pageLocation.innerHTML += '<img src=\"'+pages[i]+'\" >';
    pageLocation.innerHTML += '<br>';
  }
}
// TEST UPDATE FEATURE //

function initpage() {
  var pageLocation = getObjectByID(pictureID);
  var imgString = '';
  var newImg = new Image();
  newImg.src = pages[glbCurrentpage - 1];
  var height = newImg.height;
  var width = newImg.width;
  if (clickMode == true) {
    imgString += "<a href='javascript:void(showNext());'>"
  }
  imgString += "<img border='0' id='mainpage' src='" + pages[glbCurrentpage - 1] + "'";
  if (pageALT == true) {
    imgString += ' alt="' + captions[glbCurrentpage - 1].replace(/"/g, "'").replace(/<[^>]*>/g, "") + '"'
  }
  if (width > 850) {
    imgString += "width='900'"
  }
  imgString += ">";
  if (clickMode == true) {
    imgString += "</a>"
  }
  pageLocation.innerHTML = imgString;
  if (showCaption == true) {
    var pageCaption = getObjectByID(captionID);
    pageCaption.innerHTML = captions[glbCurrentpage - 1]
  }
  
  if (showIndex == true) {
    buildIndex()
  }
  if ((preCache == true) && (glbCurrentpage < pages.length)) {
    glbCacheTimer = setTimeout('cache(' + glbCurrentpage + ');', 500)
  }
  if (slideMode == true) {
    glbSlideTimer = setTimeout('showNext();', (slideDelay * 1000))
  }
}

function cache(pageID) {
  if (getObjectByID('mainpage').complete) {
    clearTimeout(glbCacheTimer);
    getObjectByID('cache').src = pages[pageID]
  } else {
    glbCacheTimer = setTimeout('cache(' + glbCurrentpage + ');', 500)
  }
}

function addpage(filename, caption, linkName) {
  var len = pages.length;
  pages[len] = filename;
  captions[len] = caption;
  if (typeof linkName == "undefined") {
    linkNames[len] = len + 1
  } else {
    linkNames[len] = linkName
  }
}

function buildIndex() {
  var indexString = '';
  var i;
  indexString = " <b>Page</b> <select name='index' onchange='javascript:void(showpage(this.options[this.selectedIndex].value));'>";
  for (i = 1; i < pages.length + 1; i++) {
    indexString += "<option value='" + linkNames[i - 1] + "' ";
    if (i == glbCurrentpage) {
      indexString += "selected='selected'"
    }
    indexString += '>' + linkNames[i - 1] + '</option>'
  }
  indexString += "</select> of " + pages.length;
  getObjectByID(indexID).innerHTML = indexString;
  getObjectByID("index2").innerHTML = indexString
}

function enableSlideMode(newDelay) {
  slideMode = Boolean(true);
  if (newDelay > 0) {
    slideDelay = newDelay
  }
  showpage(glbCurrentpage)
}

function disableSlideMode() {
  slideMode = Boolean(false);
  clearTimeout(glbSlideTimer);
  showpage(glbCurrentpage)
}
if (FORM_DATA["page"] > 0) {
  glbCurrentpage = Number(FORM_DATA["page"])
} else {
  glbCurrentpage = 1
}
if (FORM_DATA["slideMode"] == "true") {
  slideMode = Boolean(true);
  slideDelay = FORM_DATA["slideDelay"]
}

// TEST UPDATE FEATURE //
function enableScrollMode(){
  //alert("Test");
  var theURL = "" + this.location;
  if (theURL.indexOf("?") > 0) {
    theURL = theURL.substring(0, theURL.indexOf("?"))
  }
  theURL += "?scrollMode=true";
  this.location = theURL;
}
// TEST UPDATE FEATURE //

function omvKeyPressed(e) {
  var keyCode = 0;
  if (navigator.appName == "Microsoft Internet Explorer") {
    if (!e) {
      var e = window.event
    }
    if (e.keyCode) {
      keyCode = e.keyCode;
      if ((keyCode == 37) || (keyCode == 39)) {
        window.event.keyCode = 0
      }
    } else {
      keyCode = e.which
    }
  } else {
    if (e.which) {
      keyCode = e.which
    } else {
      keyCode = e.keyCode
    }
  }
  switch (keyCode) {
    case 37:
      showPrevious();
      return false;
    case 39:
      showNext();
      return false;
    default:
      return true
  }
}

/*START EDIT
function addImages() {
   var images = document.createElement("img");
   var Simg = 1;
   var Eimg = pages.length;
   for (var i = Simg; i <= Eimg; i++) {
    image = '<img src='" + pages[Simg - 1] + "'>';
   }
   $(".aio-mnga").html(image);
}
END EDIT*/

document.onkeydown = omvKeyPressed;
indexSeparator = '&nbsp;|&nbsp; ';
