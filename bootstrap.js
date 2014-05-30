const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");


function loadIntoWindow(window) {
  if (!window) {
    return;
  }
}

function unloadFromWindow(window) {
  if (!window) {
    return;
  }
}

var windowListener = {
  onOpenWindow: function(aWindow) {
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      loadIntoWindow(domWindow);
    }, false);
  },

  onCloseWindow: function(aWindow) {
  },

  onWindowTitleChange: function(aWindow, aTitle) {
  }
};


// General export APIs

function startup(aData, aReason) {
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    loadIntoWindow(domWindow);
  }

  Services.wm.addListener(windowListener);
}

function shutdown(aData, aReason) {
  if (aReason == APP_SHUTDOWN) {
    return;
  }

  Services.wm.removeListener(windowListener);

  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(domWindow);
  }
}

function install(aData, aReason) {
}

function uninstall(aData, aReason) {
}
