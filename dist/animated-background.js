//globals
var root;
var panel_resolver;
var hui;
var lovelace;
var animatedConfig;
var viewLayout;
var haobj = null;
var view;

//reset all DOM variables
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
  if (!isNullOrUndefined(root)) {
    lovelace = root.lovelace;
    if (!isNullOrUndefined(lovelace)) {
      animatedConfig = lovelace.config.animated_background;
    }
    viewLayout = root.shadowRoot.getElementById("layout");
    view = root.shadowRoot.getElementById("view");
  }
}

//Mutation observer to set the background of views to transparent each time a new tab is selected
var viewObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      if (currentViewEnabled()) {
        renderBackgroundHTML();
        removeDefaultBackground();
      }
    }
  });
});

//Mutation observer to refresh video on HA refresh
var huiObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      renderBackgroundHTML();
    }
  });
});

//Mutation observer to reload on dashboard change
var panelObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      if (mutation.addedNodes[0].nodeName.toLowerCase() == "ha-panel-lovelace") {
        var wait = 0;
        var wait_interval = setInterval(() => {
          get_vars()
          if (!isNullOrUndefined(hui)) {
            run();
            clearInterval(wait_interval);
          }
        }, 1000 / 60);
      }

    }
  });
});

//state tracking variables
let previous_state;
let previous_entity;
let previous_url;

//main function
function run() {
  get_vars();

  console.log("Animated Background: Starting");

  //subscribe to hass object to detect state changes if animated background is enabled
  if (isNullOrUndefined(haobj)) {
    document.querySelector("home-assistant").provideHass({
      set hass(value) {
        haobj = value;
        renderBackgroundHTML();
      }
    });
  }

  viewObserver.disconnect();
  viewObserver.observe(view, {
    characterData: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true
  });

  huiObserver.disconnect();
  huiObserver.observe(hui, {
    characterData: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true
  });

  panelObserver.disconnect();
  panelObserver.observe(panel_resolver, {
    characterData: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true
  });

  if (!isNullOrUndefined(animatedConfig)) {
    if (enabled()) {
      renderBackgroundHTML();
    }
    else {
      console.log("Animated Background: Current environment is not enabled in Lovelace configuration");
    }
  }
  else {
    console.log("Animated Background: No configuration found");
  }
}

//return the currently selected lovelace view
function currentViewPath() {
  return window.location.pathname.split('/')[2];
}

//bool returns whether current configuration exists in animated_config (different from enabled in that no haobj is required and is more flexible)
function configured() {
  var temp_configured = false;
  if (!isNullOrUndefined(animatedConfig)) {
    if (!isNullOrUndefined(animatedConfig.default_url) || !isNullOrUndefined(animatedConfig.entity)) {
      temp_configured = true;
    }

    var current = currentConfig();
    if (!isNullOrUndefined(current)) {
      if (!isNullOrUndefined(current.enabled)) {
        if (current.enabled == false) {
          temp_configured = false;
        }
        else{
          temp_configured = true;
        }
      }
      else{
        temp_configured = true;
      }
    }
    else{
      temp_configured = false;
    }
  }

  return temp_configured;
}

//generic null/undefined helper function
function isNullOrUndefined(obj) {
  if (obj == null) {
    return true;
  }
  if (obj == undefined) {
    return true;
  }
  return false;
}

//logic for checking if Animated Background is enabled in configuration
function enabled() {
  if (isNullOrUndefined(animatedConfig) || isNullOrUndefined(haobj)) {
    return false;
  }

  if (!isNullOrUndefined(animatedConfig.display_user_agent)) {
    if (animatedConfig.display_user_agent == true) {
      alert(navigator.userAgent);
    }
  }

  var temp_enabled = true;

  if (!isNullOrUndefined(animatedConfig.excluded_devices)) {
    if (animatedConfig.excluded_devices.some(device_included)) {
      temp_enabled = false;
    }
  }

  if (!isNullOrUndefined(animatedConfig.excluded_users)) {
    if (animatedConfig.excluded_users.map(username => username.toLowerCase()).includes(haobj.user.name.toLowerCase())) {
      temp_enabled = false;
    }
  }

  if (!isNullOrUndefined(animatedConfig.included_users)) {
    if (animatedConfig.included_users.map(username => username.toLowerCase()).includes(haobj.user.name.toLowerCase())) {
      temp_enabled = true;
    }
    else {
      temp_enabled = false;
    }
  }

  if (!isNullOrUndefined(animatedConfig.included_devices)) {
    if (animatedConfig.included_devices.some(device_included)) {
      temp_enabled = true;
    }
    else {
      temp_enabled = false;
    }
  }
  var current = currentConfig();
  if (!isNullOrUndefined(current)) {
    if (!isNullOrUndefined(current.enabled)) {
      if (current.enabled == false) {
        temp_enabled = false;
      }
    }
  }
  else{
    temp_enabled = false;
  }

  return temp_enabled;
}

//Current known support: iphone, ipad (if set to mobile site option), windows, macintosh, android
function device_included(element, index, array) {
  return navigator.userAgent.toLowerCase().includes(element.toLowerCase());
}

//remove background every 100 milliseconds for 2 seconds because race condition memes.
var memeRemover = null;
var memeCount = 0;
function removeDefaultBackground() {
  if (isNullOrUndefined(memeRemover)) {
    memeRemover = setInterval(() => {
      get_vars();
      var viewNode = null;
      var temp_configured = configured();
      var temp_enabled = enabled();
      if (!isNullOrUndefined(root)) {
        viewNode = root.shadowRoot.getElementById("view");
        viewNode = viewNode.querySelector('hui-view');
        if (!isNullOrUndefined(viewNode)) {
          if (temp_configured && temp_enabled) {
            viewNode.style.background = 'transparent';
            viewLayout.style.background = 'transparent';
          }
        }
        else {
          viewNode = root.shadowRoot.getElementById("view");
          viewNode = viewNode.querySelector("hui-panel-view");
          if (!isNullOrUndefined(viewNode)) {
            if (temp_configured && temp_enabled) {
              viewNode.style.background = 'transparent';
              viewLayout.style.background = 'transparent';
            }
          }
        }
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

function getGroupConfig(name) {
  var return_config = null;
  if (!isNullOrUndefined(animatedConfig.groups)) {
    animatedConfig.groups.forEach(group => {
      if (!isNullOrUndefined(group.name)) {
        if (group.name == name) {
          if (!isNullOrUndefined(group.config)) {
            return_config = group.config;
          }
        }
      }
    })
  }
  return return_config;
}

//return the current view configuration or null if none is found
function currentConfig() {
  var current_view_path = currentViewPath();
  var return_config = null;
  if (!isNullOrUndefined(animatedConfig)) {
    if (!isNullOrUndefined(animatedConfig.entity) || !isNullOrUndefined(animatedConfig.default_url)) {
      return_config = animatedConfig;
    }

    if (!isNullOrUndefined(animatedConfig.views)) {
      animatedConfig.views.forEach(view => {
        if (view.path == current_view_path) {
          if (!isNullOrUndefined(view.config)) {
            return_config = view.config;
          }
          else {
            console.log("Animated Background: Error, defined view has no config");
          }
        }
      });
    }

    if (!isNullOrUndefined(lovelace)) {
      lovelace.config.views.forEach(view => {
        if (view.path == currentViewPath()) {
          if (!isNullOrUndefined(view.animated_background)) {
            if(view.animated_background == "none"){
              return_config = {enabled:false};
            }
            var potential_config = getGroupConfig(view.animated_background);
            if (!isNullOrUndefined(potential_config)) {
              return_config = potential_config;
            }
          }
        }
      });
    }
  }
  return return_config;
}

//bool whether currentConfig returns a non-null value
function currentViewEnabled() {
  return !isNullOrUndefined(currentConfig());
}

//main render function
function renderBackgroundHTML() {
  if (!enabled()) {
    return;
  }

  var stateURL = "";
  var selectedConfig = currentConfig();

  //rerender background if entity has changed (to avoid no background refresh if the new entity happens to have the same state)
  if (previous_entity != selectedConfig.entity) {
    previous_state = null;
  }

  //get state of config object 
  if (!isNullOrUndefined(selectedConfig.entity)) {
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
    var bg = hui.shadowRoot.getElementById("background-video");
    if (isNullOrUndefined(bg)) {
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
      removeDefaultBackground();
    }
    else {
      htmlToRender = `<iframe class="bg-video" frameborder="0" src="${stateURL}"/>`;
      if (selectedConfig.entity || (previous_url != stateURL)) {
        removeDefaultBackground();
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
