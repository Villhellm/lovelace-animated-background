//const
const Debug_Prefix = "Animated Background DEBUG: ";
const Log_Prefix = "Animated Background: "

//globals
var Root;
var Panel_Resolver;
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
var Meme_Logged = false;

//state tracking variables
let Previous_State;
let Previous_Entity;
let Previous_Url;

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

//reset all DOM variables
function getVars() {
  Root = document.querySelector("home-assistant");
  Root = Root && Root.shadowRoot;
  Root = Root && Root.querySelector("home-assistant-main");
  Root = Root && Root.shadowRoot;
  Root = Root && Root.querySelector("app-drawer-layout partial-panel-resolver");
  Panel_Resolver = Root;
  Root = (Root && Root.shadowRoot) || Root;
  Root = Root && Root.querySelector("ha-panel-lovelace");
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
      View_Loaded = false;
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
// var Panel_Observer = new MutationObserver(function (mutations) {
//   mutations.forEach(function (mutation) {
//     if (mutation.addedNodes.length > 0) {
//       if (mutation.addedNodes[0].nodeName.toLowerCase() == "ha-panel-lovelace") {
//         var wait_interval = setInterval(() => {
//           getVars()
//           if (Hui) {
//             Previous_Entity = null;
//             Previous_State = null;
//             Loaded = false;
//             run();
//             clearInterval(wait_interval);
//           }
//         }, 1000 / 60);
//       }
//     }
//   });
// });

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
  if(current_view_path == undefined){
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
            return_config = { enabled: false, reason: "current state('" + current_state + "') state_url is set to 'none'", entity: return_config.entity };
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
  else {
    return false;
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

  if (!current_config) {
    if(Animated_Config){
      DEBUG_MESSAGE("No configuration found for this view");
    }
    return;
  }

  //rerender background if entity has changed (to avoid no background refresh if the new entity happens to have the same state)
  if (current_config.entity && Previous_Entity != current_config.entity) {
    Previous_State = null;
  }

  //get state of config object 
  if (current_config.entity) {
    var current_state = getEntityState(current_config.entity);
    if (Previous_State != current_state) {
      View_Loaded = false;
      STATUS_MESSAGE("Configured entity " + current_config.entity + " is now " + current_state, true);
      if (current_config.state_url) {
        if (current_config.state_url[current_state]) {
          state_url = current_config.state_url[current_state];
        }
        else {
          if (current_config.default_url) {
            state_url = current_config.default_url;
          }
        }
      }
      Previous_State = current_state;
      Previous_Entity = current_config.entity;
    }
  }
  else {
    if (current_config.default_url) {
      state_url = current_config.default_url;
    }
  }

  processDefaultBackground();

  var html_to_render;
  if (state_url != "" && Hui) {
    var bg = Hui.shadowRoot.getElementById("background-video");
    if (!bg) {
      if (!current_config.entity) {
        STATUS_MESSAGE("Applying default background", true);
      }
      html_to_render = `<style>
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
     <iframe class="bg-video" frameborder="0" src="${state_url}"/> 
    </div>`;
      View_Layout.insertAdjacentHTML("beforebegin", html_to_render);
      Previous_Url = state_url;
    }
    else {
      html_to_render = `<iframe class="bg-video" frameborder="0" src="${state_url}"/>`;
      if (current_config.entity || (Previous_Url != state_url)) {
        if (!current_config.entity) {
          STATUS_MESSAGE("Applying default background", true);
          Previous_Entity = null;
          Previous_State = null;
        }
        bg.innerHTML = html_to_render;
        Previous_Url = state_url;
      }
    }
  }
}

//remove background every 100 milliseconds for 2 seconds because race condition memes
function processDefaultBackground() {
  if (!Meme_Remover) {
    Meme_Logged = false;
    Meme_Remover = setInterval(() => {
      getVars();
      var current_config = currentConfig();

      var view_node = null;
      var temp_enabled = enabled();
      if (Root) {
        view_node = Root.shadowRoot.getElementById("view");
        view_node = view_node.querySelector('hui-view');
        if (view_node) {

          if (temp_enabled) {
            view_node.style.background = 'transparent';
            View_Layout.style.background = 'transparent';
            if (!Meme_Logged) {
              DEBUG_MESSAGE("Removing view background for configuration:", currentConfig());
              Meme_Logged = true;
            }
          }
          else {
            if (!Meme_Logged) {
              Meme_Logged = true;
            }
            View_Layout.style.background = null;
            view_node.style.background = null;

            if (current_config && current_config.reason) {
              DEBUG_MESSAGE("Current config is disabled because " + current_config.reason, null, true);
            }
          }
          View_Loaded = true;
        }
        else {
          view_node = Root.shadowRoot.getElementById("view");
          view_node = view_node.querySelector("hui-panel-view");
          if (view_node) {

            if (temp_enabled) {
              view_node.style.background = 'transparent';
              View_Layout.style.background = 'transparent';
              if (!Meme_Logged) {
                DEBUG_MESSAGE("Panel mode detected");
                DEBUG_MESSAGE("Removing view background for configuration:", currentConfig());
                Meme_Logged = true;
              }
            }
            else {
              if (!Meme_Logged) {
                Meme_Logged = true;
              }
              if (current_config && current_config.reason) {
                DEBUG_MESSAGE("Current config is disabled because " + current_config.reason, null, true);
              }
              View_Layout.style.background = null;
              if (view_node.style.background != "var(--lovelace-background)") {
                view_node.style.background = "var(--lovelace-background)";
              }
            }
            View_Loaded = true;
          }
        }
      }
      Meme_Count++;
      if (Meme_Count > 20) {
        clearInterval(Meme_Remover);
        Meme_Remover = null;
        Meme_Count = 0;
      }

      Loaded = true;
    }, 100);
  }
}

//main function
function run() {
  STATUS_MESSAGE("Starting", true);

  getVars();

  if (!Loaded) {
    if (Animated_Config) {
      if (Animated_Config.debug) {
        Debug_Mode = Animated_Config.debug;
        DEBUG_MESSAGE("Debug mode enabled");

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
    else{
      STATUS_MESSAGE("No configuration found for this dashboard");
    }
  }

  //subscribe to hass object to detect state changes
  if (!Haobj) {
    document.querySelector("home-assistant").provideHass({
      set hass(value) {
        if(Haobj && Haobj.panelUrl != value.panelUrl){
          var wait_interval = setInterval(() => {
            getVars()
            if (Hui) {
              Previous_Entity = null;
              Previous_State = null;
              Loaded = false;
              run();
              clearInterval(wait_interval);
            }
          }, 1000 / 60);
        }
        Haobj = value;
        var current_config = currentConfig();
        if (Loaded) {
          if (current_config && current_config.entity) {
            var current_state = getEntityState(current_config.entity);
            if (Previous_State != current_state) {
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
  else{
    if(!Loaded){
      renderBackgroundHTML();
    }
  }

  View_Observer.disconnect();
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

  // Panel_Observer.disconnect();
  // Panel_Observer.observe(Panel_Resolver, {
  //   characterData: true,
  //   childList: true,
  //   subtree: true,
  //   characterDataOldValue: true
  // });
}

run();
