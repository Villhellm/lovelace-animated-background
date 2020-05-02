var root;
var panel_resolver;
var hui;
var lovelace;
var animatedConfig;
var viewLayout;
var haobj;
var view;

function get_vars() {
  root = document.querySelector("home-assistant");
  root = root && root.shadowRoot;
  root = root && root.querySelector("home-assistant-main");
  root = root && root.shadowRoot;
  root = root && root.querySelector("app-drawer-layout partial-panel-resolver");
  panel_resolver = root;
  root = (root && root.shadowRoot) || root;
  root = root && root.querySelector("ha-panel-lovelace");
  root = root && root.shadowRoot;
  root = root && root.querySelector("hui-root");
  hui = root;
  lovelace = root.lovelace;
  animatedConfig = lovelace.config.animated_background;
  viewLayout = root.shadowRoot.getElementById("layout");
  view = root.shadowRoot.getElementById("view");
  if (viewLayout != null) {
    viewLayout.style.background = 'transparent';
  }
  haobj = null;
}

var current_view_enabled = false;
//Mutation observer logic to set the background of views to transparent each time a new tab is selected
var viewObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      renderBackgroundHTML();
      if(current_view_enabled){
        removeBackground();
      }
    }
  });
});

//Mutation observer logic to refresh video on HA refresh
var huiObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      renderBackgroundHTML();
    }
  });
});

var panelObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      if (mutation.addedNodes[0].nodeName.toLowerCase() == "ha-panel-lovelace") {
        var wait = 0;
        var wait_interval = setInterval(() => {
          get_vars()
          if (hui != null) {
            run();
            clearInterval(wait_interval);
          }
        }, 1000 / 60);
      }

    }
  });
});

let previous_state;
let previous_entity;
let previous_url;

//main function
function run() {
  get_vars();

  console.log("Animated Background: Starting");
  if (animatedConfig) {

    //subscribe to hass object to detect state changes if animated background is enabled
    if (enabled(document.querySelector("home-assistant").hass)) {
      document.querySelector("home-assistant").provideHass({
        set hass(value) {
          haobj = value;
          renderBackgroundHTML();
        }
      });

      //start the observers
      viewObserver.observe(view, {
        characterData: true,
        childList: true,
        subtree: true,
        characterDataOldValue: true
      });

      huiObserver.observe(hui, {
        characterData: true,
        childList: true,
        subtree: true,
        characterDataOldValue: true
      });

      panelObserver.observe(panel_resolver, {
        characterData: true,
        childList: true,
        subtree: true,
        characterDataOldValue: true
      });

      renderBackgroundHTML();

    }
    else {
      console.log("Animated Background: Not enabled in Lovelace configuration");
    }
  }
}

//return the currently selected lovelace view
function currentView() {
  return window.location.pathname.split('/')[2];
}

//logic for checking if Animated Background is enabled in configuration
function enabled(hass) {

  if (animatedConfig.display_user_agent) {
    if (animatedConfig.display_user_agent == true) {
      alert(navigator.userAgent);
    }
  }

  var temp_enabled = true;

  if (animatedConfig.excluded_devices) {
    if (animatedConfig.excluded_devices.some(device_included)) {
      temp_enabled = false;
    }
  }

  if (animatedConfig.excluded_users) {
    if (animatedConfig.excluded_users.map(username => username.toLowerCase()).includes(hass.user.name.toLowerCase())) {
      temp_enabled = false;
    }
  }

  if (animatedConfig.included_users) {
    if (animatedConfig.included_users.map(username => username.toLowerCase()).includes(hass.user.name.toLowerCase())) {
      temp_enabled = true;
    }
    else {
      temp_enabled = false;
    }
  }

  if (animatedConfig.included_devices) {
    if (animatedConfig.included_devices.some(device_included)) {
      temp_enabled = true;
    }
    else {
      temp_enabled = false;
    }
  }

  return temp_enabled;
}

//Current known support: iphone, ipad (if set to mobile site option), windows, macintosh, android
function device_included(element, index, array) {
  return navigator.userAgent.toLowerCase().includes(element.toLowerCase());
}

//remove background for 2 seconds because race condition memes.
var memeRemover = null;
var memeCount = 0;
function removeBackground() {
  if (memeRemover == null) {
    memeRemover = setInterval(() => {
      let viewNode = root.shadowRoot.getElementById("view");
      viewNode = viewNode.querySelector('hui-view');
      if (viewNode != null) {
        viewNode.style.background = 'transparent';
      }
      memeCount++;
      if (memeCount > 20) {
        clearInterval(memeRemover);
        memeRemover = null;
        memeCount = 0;
      }
    }, 100);
  }

}

function renderBackgroundHTML() {
  current_view_enabled = false;
  var stateURL = "";
  var selectedConfig = animatedConfig;
  //check if current view has a separate config
  if (animatedConfig.views) {
    animatedConfig.views.forEach(view => {
      if (view.path == currentView()) {
        selectedConfig = view.config;
      }
    });
  }

  //rerender background if entity has changed (to avoid no background refresh if the new entity happens to have the same state)
  if (previous_entity != selectedConfig.entity) {
    previous_state = null;
  }

  //get state of config object 
  if (selectedConfig.entity) {
    current_view_enabled = true;
    var current_state = haobj.states[selectedConfig.entity].state;
    if (previous_state != current_state) {
      console.log("Animated Background: Configured entity " + selectedConfig.entity + " is now " + current_state);

      if (selectedConfig.state_url[current_state]) {
        stateURL = selectedConfig.state_url[current_state];
      }
      else {
        if (selectedConfig.default_url) {
          stateURL = selectedConfig.default_url;
        }
      }
      previous_state = current_state;
      previous_entity = selectedConfig.entity;
    }
  }
  else {
    if (selectedConfig.default_url) {
      stateURL = selectedConfig.default_url;
    }
  }

  var htmlToRender;
  if (stateURL != "") {
    current_view_enabled = true;
    var bg = hui.shadowRoot.getElementById("background-video");
    if (bg == null) {
      if (!selectedConfig.entity) {
        console.log("Animated Background: Applying default background");
      }
      htmlToRender = `<style>
      .bg-video{
          min-width: 100vw; 
          min-height: 100vh;
          
      }
      .bg-wrap{
          position: fixed;
          right: 0;
          top: 0;
          min-width: 100vw; 
          min-height: 100vh;
          z-index: -10;
      }    
    </style>
    <div id="background-video" class="bg-wrap">
     <iframe class="bg-video" frameborder="0" src="${stateURL}"/> 
    </div>`;
      viewLayout.insertAdjacentHTML("beforebegin", htmlToRender);
      previous_url = stateURL;
      removeBackground();
    }
    else {
      htmlToRender = `<iframe class="bg-video" frameborder="0" src="${stateURL}"/>`;
      if (selectedConfig.entity || (previous_url != stateURL)) {
        removeBackground();
        if (!selectedConfig.entity) {
          console.log("Animated Background: Applying default background");
        }
        bg.innerHTML = htmlToRender;
        previous_url = stateURL;
      }
    }
  }
}

run();
