let root = document.querySelector("home-assistant");
root = root && root.shadowRoot;
root = root && root.querySelector("home-assistant-main");
root = root && root.shadowRoot;
root = root && root.querySelector("app-drawer-layout partial-panel-resolver");
root = (root && root.shadowRoot) || root;
root = root && root.querySelector("ha-panel-lovelace");
root = root && root.shadowRoot;
root = root && root.querySelector("hui-root");
const lovelace = root.lovelace;
root = root.shadowRoot;


const header = root.querySelector("app-header");
let animatedConfig = lovelace.config.animated_background;
const viewLayout = root.querySelector("ha-app-layout");

let previous_state;
function run() {
  console.log("animated background starting");
  if (animatedConfig) {
    if (enabled(document.querySelector("home-assistant").hass)) {
      document.querySelector("home-assistant").provideHass({
        set hass(value) {
          renderBackgroundHTML(value);
        }
      });
    }

  }
}

function enabled(hass) {
  if(animatedConfig.included_users){
    if (animatedConfig.included_users.includes(hass.user.name)) {
      return true;
    }
    else{
      return false;
    }
  }
  if (animatedConfig.excluded_users) {
    if (animatedConfig.excluded_users.includes(hass.user.name)) {
      return false;
    }
  }
  if(animatedConfig.included_devices){
    if (animatedConfig.included_devices.some(device_included)) {
      return true;
    }
    else{
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

function device_included(element, index, array) {
  return navigator.userAgent.includes(element);
}

function renderBackgroundHTML(hass) {
  var current_state = hass.states[animatedConfig.entity].state;
  if (previous_state != current_state) {
    console.log(current_state);

    var stateURL;
    if (animatedConfig.state_url[current_state]) {
      stateURL = animatedConfig.state_url[current_state];
    }
    else {
      stateURL = animatedConfig.default_url;
    }

    var htmlToRender = `<div id="background-video"><style>
    .bg-video{
        min-width: 100vw; 
        min-height: 100vh;
        
    }
    
    .bg-wrap{
        position: absolute;
        right: 0;
        bottom: 0;
        min-width: 100vw; 
        min-height: 100vh;
        z-index: -1;
    }
    
  </style>
  <div class="bg-wrap">
   <iframe class="bg-video" frameborder="0" src="${stateURL}"/> 
  </div></div>`;
    var bg = viewLayout.querySelector('[id="background-video"]');
    if (bg == null) {
      viewLayout.insertAdjacentHTML("beforeend", htmlToRender);

    }
    else {
      bg.innerHTML = htmlToRender;
    }
    previous_state = current_state;
  }
}

run();