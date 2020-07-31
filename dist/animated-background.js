//const
const Debug_Prefix = "Animated Background DEBUG: ";
const Log_Prefix = "Animated Background: "

//globals
var Root;
var Panel_Holder;
var Hui;
var Lovelace;
var Animated_Config;
var View_Layout;
var Haobj = null;
var View;
var Debug_Mode = false;
var Loaded = false;
var View_Loaded = false;
var Meme_Remover = null;
var Meme_Count = 0;

//state tracking variables
let Previous_State;
let Previous_Entity;
let Previous_Url;
let Previous_Config;

function STATUS_MESSAGE(message, force) {
  if (!Debug_Mode) {
    console.log(Log_Prefix + message);
  }
  else {
    if (force) {
      console.log(Debug_Prefix + message);
    }
  }
}

function DEBUG_MESSAGE(message, object, only_if_view_not_loaded) {
  if (Debug_Mode) {
    if (only_if_view_not_loaded && View_Loaded) {
      return;
    }
    console.log(Debug_Prefix + message);
    if (object) {
      console.log(object);
    }
  }
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//reset all DOM variables
function getVars() {
  Root = document.querySelector("home-assistant");
  Root = Root && Root.shadowRoot;
  Root = Root && Root.querySelector("home-assistant-main");
  Root = Root && Root.shadowRoot;
  Root = Root && Root.querySelector("app-drawer-layout partial-panel-resolver");
  Root = (Root && Root.shadowRoot) || Root;
  Root = Root && Root.querySelector("ha-panel-lovelace");
  if (Root) {
    Panel_Holder = Root.shadowRoot;
  }
  Root = Root && Root.shadowRoot;
  Root = Root && Root.querySelector("hui-root");
  Hui = Root;
  if (Root) {
    Lovelace = Root.lovelace;
    if (Lovelace) {
      Animated_Config = Lovelace.config.animated_background;
    }
    View_Layout = Root.shadowRoot.getElementById("layout");
    View = Root.shadowRoot.getElementById("view");
  }
}

//Mutation observer to set the background of views to transparent each time a new tab is selected
var View_Observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      if (!currentConfig() && View_Loaded) {
        DEBUG_MESSAGE("No configuration found for this view");
      }
      View_Loaded = false;
      clearMemes();
      renderBackgroundHTML();
    }
  });
});

//Mutation observer to refresh video on HA refresh
var Hui_Observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      DEBUG_MESSAGE("Proof that this observer is not useless");
      renderBackgroundHTML();
    }
  });
});

//Mutation observer to reload on dashboard change
var Panel_Observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.removedNodes.length > 0) {
      if (mutation.removedNodes[0].nodeName.toLowerCase() == "hui-editor") {
        restart();
      }
    }
  });
});

//Current known support: iphone, ipad (if set to mobile site option), windows, macintosh, android
function deviceIncluded(element, index, array) {
  return navigator.userAgent.toLowerCase().includes(element.toLowerCase());
}

//return the currently selected lovelace view
function currentViewPath() {
  return window.location.pathname.split('/')[2];
}

//return group config by name if it exists
function getGroupConfig(name) {
  var return_config = null;
  if (name == "none") {
    return { enabled: false, reason: "current group is set to 'none'" };
  }
  if (Animated_Config.groups) {
    Animated_Config.groups.forEach(group => {
      if (group.name) {
        if (group.name == name) {
          if (group.config) {
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
  if (current_view_path == undefined) {
    return return_config;
  }
  if (Animated_Config) {
    if (Animated_Config.entity || Animated_Config.default_url) {
      return_config = Animated_Config;
    }

    if (Animated_Config.views) {
      Animated_Config.views.forEach(view => {
        if (view.path == current_view_path) {
          if (view.config) {
            return_config = view.config;
          }
          else {
            STATUS_MESSAGE("Error, defined view has no config", true);
          }
        }
      });
    }

    var current_view_path = currentViewPath();
    var current_view_config = Lovelace.config.views[Lovelace.current_view];
    if (Lovelace && current_view_path) {
      for (var i = 0; Lovelace.config.views.length > i; i++) {
        if (Lovelace.config.views[i].path == current_view_path) {
          current_view_config = Lovelace.config.views[i];
        }
        else {
          if (i.toString() == current_view_path.toString()) {
            current_view_config = Lovelace.config.views[i];
          }
        }
      }

      if (current_view_config) {
        var potential_config = getGroupConfig(current_view_config.animated_background);
        if (potential_config) {
          return_config = potential_config;
        }
      }
    }

    if (return_config) {
      if (return_config.entity) {
        var current_state = getEntityState(return_config.entity);
        var current_url = return_config.state_url[current_state];
        if (current_url) {
          if (current_url == "none") {
            return_config = { enabled: false, reason: "current state('" + current_state + "') state_url is set to 'none'", entity: return_config.entity, default_url: return_config.default_url, state_url: return_config.state_url };
          }
        }
      }

    }
  }
  return return_config;
}

//logic for checking if enabled in configuration
function enabled() {
  var temp_enabled = false;
  if (Animated_Config) {
    if (Animated_Config.default_url || Animated_Config.entity || Animated_Config.views || Animated_Config.groups) {
      temp_enabled = true;
    }
  }

  if (temp_enabled == false) {
    return false;
  }

  var current_config = currentConfig();

  if (!Haobj) {
    return false;
  }

  if (!current_config) {
    return false;
  }

  //Root configuration exceptions
  if (Animated_Config.excluded_devices) {
    if (Animated_Config.excluded_devices.some(deviceIncluded)) {
      if (temp_enabled) {
        DEBUG_MESSAGE("Current device is excluded", null, true);
        temp_enabled = false;
      }
    }
  }

  if (Animated_Config.excluded_users) {
    if (Animated_Config.excluded_users.map(username => username.toLowerCase()).includes(Haobj.user.name.toLowerCase())) {
      if (temp_enabled) {
        DEBUG_MESSAGE("Current user: " + Haobj.user.name + " is excluded", null, true);
        temp_enabled = false;
      }
    }
  }

  if (Animated_Config.included_users) {
    if (Animated_Config.included_users.map(username => username.toLowerCase()).includes(Haobj.user.name.toLowerCase())) {
      temp_enabled = true;
    }
    else {
      if (temp_enabled) {
        DEBUG_MESSAGE("Current user: " + Haobj.user.name + " is not included", null, true);
        temp_enabled = false;
      }
    }
  }

  if (Animated_Config.included_devices) {
    if (Animated_Config.included_devices.some(deviceIncluded)) {
      temp_enabled = true;
    }
    else {
      if (temp_enabled) {
        DEBUG_MESSAGE("Current device is not included", null, true);
        temp_enabled = false;
      }
    }
  }

  //Current config overrides (only does anything if curre_config and Animated_Config are different)
  if (current_config.excluded_devices) {
    if (current_config.excluded_devices.some(deviceIncluded)) {
      if (temp_enabled) {
        DEBUG_MESSAGE("Current device is excluded", null, true);
        temp_enabled = false;
      }
    }
  }

  if (current_config.excluded_users) {
    if (current_config.excluded_users.map(username => username.toLowerCase()).includes(Haobj.user.name.toLowerCase())) {
      if (temp_enabled) {
        DEBUG_MESSAGE("Current user: " + Haobj.user.name + " is excluded", null, true);
        temp_enabled = false;
      }
    }
  }

  if (current_config.included_users) {
    if (current_config.included_users.map(username => username.toLowerCase()).includes(Haobj.user.name.toLowerCase())) {
      temp_enabled = true;
    }
    else {
      if (temp_enabled) {
        DEBUG_MESSAGE("Current user: " + Haobj.user.name + " is not included", null, true);
        temp_enabled = false;
      }
    }
  }

  if (current_config.included_devices) {
    if (current_config.included_devices.some(deviceIncluded)) {
      temp_enabled = true;
    }
    else {
      if (temp_enabled) {
        DEBUG_MESSAGE("Current device is not included", null, true);
        temp_enabled = false;
      }
    }
  }

  if (current_config.enabled == false) {
    temp_enabled = false;
  }
  if (current_config.enabled == true) {
    temp_enabled = true;
  }

  return temp_enabled;
}

//returns selected entity's current state if it is available
function getEntityState(entity) {
  var return_state = null;
  if (Haobj) {
    if (Haobj.states[entity]) {
      return_state = Haobj.states[entity].state;
    }
  }

  return return_state;
}

//main render function
function renderBackgroundHTML() {
  var current_config = currentConfig();
  var state_url = "";
  var temp_enabled = true;
  //rerender background if entity has changed (to avoid no background refresh if the new entity happens to have the same state)
  if (current_config && current_config.entity && Previous_Entity != current_config.entity) {
    Previous_State = null;
  }

  if (current_config != Previous_Config) {
    Previous_State = null;
  }

  //get state of config object
  if (current_config) {
    if (current_config.entity && current_config.state_url) {
      Previous_Entity = current_config.entity;
      var current_state = getEntityState(current_config.entity);
      if (current_config.state_url[current_state]) {
        if (Previous_State != current_state) {
          View_Loaded = false;
          DEBUG_MESSAGE("Configured entity " + current_config.entity + " is now " + current_state, true);
          if (current_config.state_url) {
            var url = current_config.state_url[current_state];
            if (Array.isArray(url)) {
              state_url = url[randomIntFromInterval(0, url.length - 1)];
            }
            else {
              state_url = current_config.state_url[current_state];
            }
          }
          Previous_State = current_state;
        }
      }
      else {
        DEBUG_MESSAGE("No state_url found for the current state '" + current_state + "'. Attempting to set default_url")
        Previous_State = current_state;
        Previous_Url = null;
        var url = current_config.default_url;
        if (url) {
          if (Array.isArray(url)) {
            state_url = url[randomIntFromInterval(0, url.length - 1)];
          }
          else {
            state_url = url;
          }
        }
        else {
          if (!current_config.reason) {
            DEBUG_MESSAGE("No default_url found, restoring lovelace theme")
          }
          temp_enabled = false;
        }
      }
    }
    else {
      var url = current_config.default_url;
      if (url) {
        if (Array.isArray(url)) {
          state_url = url[randomIntFromInterval(0, url.length - 1)];
        }
        else {
          state_url = url;
        }
      }
      else {
        if (!current_config.reason) {
          DEBUG_MESSAGE("No default_url found, restoring lovelace theme")
        }
        temp_enabled = false;
      }
    }
  }
  else {
    temp_enabled = false;
  }

  if (temp_enabled) {
    temp_enabled = enabled();
  }

  processDefaultBackground(temp_enabled);

  if (!temp_enabled || !current_config) {
    return;
  }

  Previous_Config = current_config;

  var html_to_render;
  if (state_url != "" && Hui) {
    var bg = Hui.shadowRoot.getElementById("background-iframe");
    var video_type = urlIsVideo(state_url);
    var doc_body;
    if (video_type) {
      doc_body = `<video id='cinemagraph' autoplay='' loop='' preload='' playsinline='' muted='' poster=''><source src='${state_url}' type='video/${video_type}'></video>`
    }
    else {
      doc_body = `<img src='${state_url}'>`
    }
    var source_doc = `
    <html>
    <head>
      <style type='text/css'>
        body {
          min-height: 100vh;
          min-width: 100vw;
          max-height: 100%;
          max-width: 100%;
          overflow: hidden;
          margin: 0;
          position: relative;
        }
    
        video {
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        img {
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      </style>
    </head>  
    <body id='source-body'>
    ${doc_body}
    </body>
    </html>`;
    if (!bg) {
      if (!current_config.entity) {
        STATUS_MESSAGE("Applying default background", true);
      }
      var style = document.createElement("style");
      style.innerHTML = `
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
      }`;
      var div = document.createElement("div");
      div.id = "background-video";
      div.className = "bg-wrap"
      div.innerHTML = `
     <iframe id="background-iframe" class="bg-video" frameborder="0" srcdoc="${source_doc}"/> 
    `;
      Root.shadowRoot.appendChild(style);
      Root.shadowRoot.appendChild(div)
      Previous_Url = state_url;
    }
    else {
      if (current_config.entity || (Previous_Url != state_url)) {
        if (!current_config.entity) {
          STATUS_MESSAGE("Applying default background", true);
          Previous_Entity = null;
          Previous_State = null;
        }
        bg.srcdoc = source_doc;
        Previous_Url = state_url;
      }
    }
  }
}

function urlIsVideo(url) {
  if (url.slice(url.length - 3).toLowerCase() == "mp4" || url.slice(url.length - 4).toLowerCase() == "webm") {
    return url.slice(url.length - 3).toLowerCase();
  }
  if (url.slice(url.length - 4).toLowerCase() == "webm") {
    return url.slice(url.length - 4).toLowerCase();
  }
  return false;
}

//removes lovelace theme background
function removeDefaultBackground(node, current_config) {
  var background = 'transparent';
  if (current_config.background) {
    background = current_config.background;
  }
  if (node.style.background != background || View_Layout.style.background != 'transparent') {
    node.style.background = background;
    View_Layout.style.background = 'transparent';
  }
}

//restores lovelace theme background
function restoreDefaultBackground(node) {
  View_Layout.style.background = null;
  node.style.background = null;
}

//remove background every 100 milliseconds for 2 seconds because race condition memes
function processDefaultBackground(temp_enabled) {
  if (!Meme_Remover) {
    Meme_Remover = setInterval(() => {
      getVars();
      var current_config = currentConfig();

      var view_holder;
      var view_node = null;
      var view_node_panel = null;

      if (Root) {
        view_holder = Root.shadowRoot.getElementById("view");

        if (view_holder) {
          view_node_panel = view_holder.querySelector("hui-panel-view")
          view_node = view_holder.querySelector('hui-view');
        }

        if (view_node || view_node_panel) {
          //required because ios pre 13.4 bitches out if there is nullish coalescing operator ('??')
          var iphone_bullshit_fixer = view_node;
          if (!iphone_bullshit_fixer) {
            iphone_bullshit_fixer = view_node_panel;
          }
          if (temp_enabled) {
            removeDefaultBackground(iphone_bullshit_fixer, current_config);
            DEBUG_MESSAGE("Removing view background for configuration:", currentConfig(), true);
          }
          else {
            restoreDefaultBackground(iphone_bullshit_fixer);
            if (current_config && current_config.reason) {
              DEBUG_MESSAGE("Current config is disabled because " + current_config.reason, null, true);
            }
          }
          View_Loaded = true;
        }
      }
      Meme_Count++;
      if (Meme_Count > 20) {
        clearMemes();
        Meme_Count = 0;
      }

      Loaded = true;
    }, 100);
  }
}

function clearMemes() {
  clearInterval(Meme_Remover);
  Meme_Remover = null;
}

function setDebugMode() {
  if (Animated_Config) {
    if (Animated_Config.debug) {
      Debug_Mode = Animated_Config.debug;
      if (Animated_Config.display_user_agent) {
        if (Animated_Config.display_user_agent == true) {
          alert(navigator.userAgent);
        }
      }
    }
    else {
      Debug_Mode = false;
    }
  }
  else {
    Debug_Mode = false;
  }
}

//main function
function run() {
  getVars();
  setDebugMode();
  STATUS_MESSAGE("Starting");
  DEBUG_MESSAGE("Starting, Debug mode enabled");
  if (!Loaded) {
    if (!currentConfig()) {
      if (Debug_Mode) {
        DEBUG_MESSAGE("No configuration found");
      }
      else {
        STATUS_MESSAGE("No configuration found");
      }
    }
  }

  //subscribe to hass object to detect state changes
  if (!Haobj) {
    document.querySelector("home-assistant").provideHass({
      set hass(value) {
        if (Haobj && Haobj.panelUrl != value.panelUrl) {
          restart();
        }
        Haobj = value;
        var current_config = currentConfig();
        if (Loaded) {
          if (current_config && current_config.entity) {
            var current_state = getEntityState(current_config.entity);
            if (Previous_State != current_state) {
              clearMemes();
              renderBackgroundHTML();
            }
          }

        }
        else {
          renderBackgroundHTML();
        }
      }
    });
  }
  else {
    if (!Loaded) {
      renderBackgroundHTML();
    }
  }

  if (!View) {
    restart();
    return;
  }

  View_Observer.observe(View, {
    characterData: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true
  });

  Hui_Observer.disconnect();
  Hui_Observer.observe(Hui, {
    characterData: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true
  });

  Panel_Observer.disconnect();
  Panel_Observer.observe(Panel_Holder, {
    characterData: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true
  });
}

function restart() {
  clearInterval(wait_interval);
  var wait_interval = setInterval(() => {
    getVars()
    if (Hui) {
      Previous_Entity = null;
      Previous_State = null;
      Loaded = false;
      View_Loaded = false;
      clearMemes();
      View_Observer.disconnect();
      run();
      clearInterval(wait_interval);
    }
  }, 200);
}

run();
