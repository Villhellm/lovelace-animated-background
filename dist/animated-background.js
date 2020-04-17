let root = document.querySelector("home-assistant");
root = root && root.shadowRoot;
root = root && root.querySelector("home-assistant-main");
root = root && root.shadowRoot;
root = root && root.querySelector("app-drawer-layout partial-panel-resolver");
root = (root && root.shadowRoot) || root;
root = root && root.querySelector("ha-panel-lovelace");
root = root && root.shadowRoot;
root = root && root.querySelector("hui-root");
const hui = root;
const lovelace = root.lovelace;
let animatedConfig = lovelace.config.animated_background;
const viewLayout = root.shadowRoot.querySelector("ha-app-layout");
if(viewLayout != null){
  viewLayout.style.background = 'transparent';
}
let haobj = null;

//Mutation observer logic to set the background of views to transparent each time a new tab is selected
var viewObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      renderBackgroundHTML(haobj);
      }
  });
});

//Mutation observer logic to refresh video on HA refresh
var huiObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      renderBackgroundHTML(haobj);
    }
  });
});

let previous_state;
let previous_entity;

//main function
function run() {
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

      renderBackgroundHTML();

      //render current view background transparent if it exists
      let styleBlock = root.shadowRoot.getElementById("view");
      styleBlock = styleBlock.querySelector('hui-view');
      if (styleBlock != null) {
        styleBlock.style.background = 'transparent';
      }

      //start the observers
      viewObserver.observe(viewLayout, {
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
    }
    else {
      console.log("Animated Background: Not enabled in Lovelace configuration");
    }
  }
}

//return the currently selected lovelace view
function currentView() {
  return window.location.pathname.replace("/lovelace/", "");
}

//logic for checking if Animated Background is enabled in configuration
function enabled(hass) {
  if (animatedConfig.included_users) {
    if (animatedConfig.included_users.map(username => username.toLowerCase()).includes(hass.user.name.toLowerCase())) {
      return true;
    }
    else {
      return false;
    }
  }
  if (animatedConfig.excluded_users) {
    if (animatedConfig.excluded_users.map(username => username.toLowerCase()).includes(hass.user.name.toLowerCase())) {
      return false;
    }
  }
  if (animatedConfig.included_devices) {
    if (animatedConfig.included_devices.some(device_included)) {
      return true;
    }
    else {
      return false;
    }
  }
  if (animatedConfig.excluded_devices) {
    if (animatedConfig.excluded_devices.some(device_included)) {
      return false;
    }
  }
  return true;
}

//Current known support: iphone, ipad (if set to mobile site option), windows, macintosh, android
function device_included(element, index, array) {
  return navigator.userAgent.toLowerCase().includes(element.toLowerCase());
}

function renderBackgroundHTML() {
  var stateURL = "";
  var selectedConfig = animatedConfig;
  //check if current view has a separate config
  if(animatedConfig.views){
    animatedConfig.views.forEach(view => {
      if(view.path == currentView()){
        selectedConfig = view.config;
      }
    });
  }
  
  //rerender background if entity has changed (to avoid no background refresh if the new entity happens to have the same state)
  if(previous_entity != selectedConfig.entity){
    previous_state = null;
  }

  //get state of config object 
  if (selectedConfig.entity) {
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

  //render current view background transparent
  let viewNode = root.shadowRoot.getElementById("view");
  viewNode = viewNode.querySelector('hui-view');
  if(viewNode != null){
    viewNode.style.background = 'transparent';
  }

  var htmlToRender;
  if (stateURL != "") {
    var bg = hui.shadowRoot.getElementById("background-video");
    if (bg == null) {
      if(!selectedConfig.entity){
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
    }
    else {
      htmlToRender = `<iframe class="bg-video" frameborder="0" src="${stateURL}"/>`;
      if (selectedConfig.entity) {
        bg.innerHTML = htmlToRender;
      }
    }
  }
}

run();
