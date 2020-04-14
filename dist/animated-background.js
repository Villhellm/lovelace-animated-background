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

if (enabled(document.querySelector("home-assistant").hass)) {
  let styleBlock = root.shadowRoot.getElementById("view");
  styleBlock = styleBlock.querySelector('hui-view');
  styleBlock.style.background = 'transparent';
}


const viewLayout = root.shadowRoot.querySelector("ha-app-layout");
viewLayout.style.background = 'transparent';

//Mutation observer logic to set the background of views to transparent each time a new tab is selected
var mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.addedNodes.length > 0)
    {
        let viewNode = root.shadowRoot.getElementById("view");
        viewNode = viewNode.querySelector('hui-view');
        viewNode.style.background = 'transparent';
    }
  });
});

var huiObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.addedNodes.length > 0)
    {
      //console.log(mutation);
        renderBackgroundHTML();   
    }
  });
});

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

      mutationObserver.observe(viewLayout, {
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
    else{
      console.log("animated background is not enabled");
    }

  }
}

function currentView(){
  return window.location.pathname.replace("/lovelace/", "");
}

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

function device_included(element, index, array) {
  return navigator.userAgent.includes(element);
}

function renderBackgroundHTML(hass) {
  var stateURL = "";
  if (animatedConfig.entity) {
    var current_state = hass.states[animatedConfig.entity].state;
    if (previous_state != current_state) {
      console.log(current_state);

      if (animatedConfig.state_url[current_state]) {
        stateURL = animatedConfig.state_url[current_state];
      }
      else {
        if (animatedConfig.default_url) {
          stateURL = animatedConfig.default_url;
        }
      }
      previous_state = current_state;
    }
  }
  else {
    if (animatedConfig.default_url) {
      stateURL = animatedConfig.default_url;
    }
  }
  var htmlToRender;
  if (stateURL != "") {
    var bg = document.querySelector('[id="background-video"]');
    if (bg == null) {
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
      if (animatedConfig.entity) {
        bg.innerHTML = htmlToRender;
      }
    }
  }
}

run();
