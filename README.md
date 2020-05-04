# Animated Lovelace Background

This module is for [Lovelace](https://www.home-assistant.io/lovelace) on [Home Assistant](https://www.home-assistant.io/)

Create animated backgrounds based on the state of one of your entities. Originally designed for changing with the weather, à la [VideoBackground-Card](https://github.com/Perdemot/Lovelace-Cards/tree/master/VideoBackground-Card), you can now choose any entity in home assistant and create an animated background for each of its states.

A big thanks to [Customer Header](https://github.com/maykar/custom-header) and [VideoBackground-Card](https://github.com/Perdemot/Lovelace-Cards/tree/master/VideoBackground-Card) for the inspiration. All example animation files used in this repo are originally from the VideoBackground-Card repo.

Example:
![Example](https://raw.githubusercontent.com/Villhellm/README_images/master/Animation.gif)

## Installation Method 1: Manual

### Step 1

Install `animated-background` by copying `animated-background.js` from this repo to `<config directory>/www/animated-background.js` on your Home Assistant instance. This repo also includes a handful of default animation pages to use if you would like.

### Step 2

Add the custom element in the root of your `ui-lovelace.yaml` (or Lovelace raw configuration if not in yaml mode), not in a view or card.
Ex:
```yaml
#IF YOU ARE USING HA VERSION 0.108+ THEN YOUR RESOURCES WILL BE CONFIGURED ELSEWHERE
resources:
  - url: /local/animated-background.js
    type: module
animated_background:
  default_url: /local/animated-background/background-animations/sunny.html
  included_users:
    - Villhellm
  # Dark Sky is just an example, you do not need Dark Sky for this to work
  entity: "weather.dark_sky"
  state_url:
    'sunny': /local/animated-background/background-animations/sunny.html
    'partlycloudy': /local/animated-background/background-animations/cloudy.html
    'cloudy': /local/animated-background/background-animations/cloudy.html
    'mostlycloudy': /local/animated-background/background-animations/mostlycloudy.html
    'clear-night': /local/animated-background/background-animations/night.html
    'fog': /local/animated-background/background-animations/fog.html
title: Home
views: ...
```

## Installation Method 2: HACS

### Step 1

Make sure you have [HACS](https://github.com/custom-components/hacs) installed, and proceed with the instructions for [adding a custom repository](https://custom-components.github.io/hacs/usage/settings/#add-custom-repositories)

### Step 2

Add the custom element in the root of your `ui-lovelace.yaml` (or Lovelace raw configuration if not in yaml mode), not in a view or card.
Ex:
```yaml
#IF YOU ARE USING HA VERSION 0.108+ THEN YOUR RESOURCES WILL BE CONFIGURED ELSEWHERE
resources:
  - url: /hacsfiles/lovelace-animated-background/animated-background.js
    type: module
animated_background:
  default_url: /hacsfiles/lovelace-animated-background/background-animations/sunny.html
  included_users:
    - Villhellm
  # Dark Sky is just an example, you do not need Dark Sky for this to work
  entity: "weather.dark_sky"
  state_url:
    'sunny': /hacsfiles/lovelace-animated-background/background-animations/sunny.html
    'partlycloudy': /hacsfiles/lovelace-animated-background/background-animations/cloudy.html
    'cloudy': /hacsfiles/lovelace-animated-background/background-animations/cloudy.html
    'mostlycloudy': /hacsfiles/lovelace-animated-background/background-animations/mostlycloudy.html
    'clear-night': /hacsfiles/lovelace-animated-background/background-animations/night.html
    'fog': /hacsfiles/lovelace-animated-background/background-animations/fog.html
title: Home
views: ...
```

# Configuration

Configuration for Animated Background goes into the root of your Lovelace config.

## Animated Background Configuration Options

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| default_url | string | **Optional** | If no matching state is found, this is the fallback url
| enabled | bool | **Optional** | Set to false to disable Animated Background
| display_user_agent | bool | **Optional** | If set to true you will get an alert with your current user agent. This will help determine your device to use in `excluded_devices` or `included_devices`
| views | list ([views](#view-configuration)) | **Optional** | Allows you to set custom configurations per view
| groups | list ([group](#group-configuration)) | **Optional** | Allows you to set custom configurations that can be referenced in lovelace view configurations
| entity | string | **Optional** | Entity to check for state changes
| state_url | map | **Optional** | Map of states and urls. Required if `entity` is defined
| included_users | list (string) | **Optional** | List of users that will display animated background. If this option is set any users not included in this list will be excluded.
| included_devices | list (string) | **Optional** | List of devices that will display animated background. If this option is set any devices not included in this list will be excluded. Ex:  iphone, ipad, windows, macintosh, android
| excluded_users | list (string) | **Optional** | Users to be excluded
| excluded_devices | list (string) | **Optional** | Devices to be excluded Ex:  iphone, ipad, windows, macintosh, android

While all entries are optional, it is recommended to at least set `default_url` or `entity` with `state_url`. Without one of those set you would never know this plugin was installed. 

Also note that if you make any changes to the included HTML files, i.e. inserting your own video files, make sure to move the files to a different directory so your changes are not overwritten when you update via HACS.

## Stored Config

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| default_url | string | **Optional** | If no matching state is found, this is the fallback url
| enabled | bool | **Optional** | Set to false to disable Animated Background
| entity | string | **Optional** | Entity to check for state changes
| state_url | map | **Optional** | Map of states and urls. Required if `entity` is defined

## View Configuration

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| path | string | **Required** | The path to the Lovelace view you want to configure. Whatever comes after `/lovelace/` in your view's url. Even if you are using a different dashboard than `/lovelace/`, you still just use the last part of the url.
| config | [config](#stored-config) | **Required** | Same options as the above configuration excluding the device/user options

Ex:
```yaml
#IF YOU ARE USING HA VERSION 0.108+ THEN YOUR RESOURCES WILL BE CONFIGURED ELSEWHERE
resources:
  - url: /hacsfiles/lovelace-animated-background/animated-background.js
    type: module
animated_background:
  default_url: /hacsfiles/lovelace-animated-background/background-animations/sunny.html
  included_users:
    - Villhellm
  # Dark Sky is just an example, you do not need Dark Sky for this to work
  entity: "weather.dark_sky"
  state_url:
    'sunny': /hacsfiles/lovelace-animated-background/background-animations/sunny.html
    'partlycloudy': /hacsfiles/lovelace-animated-background/background-animations/cloudy.html
    'cloudy': /hacsfiles/lovelace-animated-background/background-animations/cloudy.html
    'mostlycloudy': /hacsfiles/lovelace-animated-background/background-animations/mostlycloudy.html
    'clear-night': /hacsfiles/lovelace-animated-background/background-animations/night.html
    'fog': /hacsfiles/lovelace-animated-background/background-animations/fog.html
  views:
    - path: gaming
      config:
        default_url: /hacsfiles/lovelace-animated-background/background-animations/sunny.html
        entity: "light.game_room"
        state_url:
          'on': /hacsfiles/lovelace-animated-background/background-animations/sunny.html
          'off': /hacsfiles/lovelace-animated-background/background-animations/night.html 
title: Home
views: ...
```

## Group Configuration

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| name | string | **Required** | The name you would like to use to define your group.
| config | [config](#stored-config) | **Required** | Same options as the above configuration excluding the device/user options

## How to use groups
Groups can be used to easily reuse Animated Background configurations. After defining your `groups:` block with at least one entry, you can add a single line to any of your views to use this configuration. 

Ex:
```yaml
animated_background:
  default_url: /hacsfiles/lovelace-animated-background/background-animations/night.html
  groups:
    - name: weather
      config:
        entity: "weather.home"
        state_url:
            'sunny': /hacsfiles/lovelace-animated-background/background-animations/sunny.html
            'partlycloudy': /hacsfiles/lovelace-animated-background/background-animations/cloudy.html
            'cloudy': /hacsfiles/lovelace-animated-background/background-animations/cloudy.html
            'mostlycloudy': /hacsfiles/lovelace-animated-background/background-animations/mostlycloudy.html
            'clear-night': /hacsfiles/lovelace-animated-background/background-animations/night.html
            'fog': /hacsfiles/lovelace-animated-background/background-animations/fog.html
            'rainy': /hacsfiles/lovelace-animated-background/background-animations/rainy.html
views:
  - path: home
    title: Home
    cards:
      - entity: weather.home
        type: weather-forecast
  - path: display
    title: Display
    animated_background: weather #this is the line to add to your view to use the "weather" group configuration
    cards:
      - entity: weather.home
        type: weather-forecast
```

## Use your own mp4 video file
If you would like to use your own video file, go into the desired HTML file and find the script block. This block contains a method that will randomly select a video in the `cinemagraphs` array each time the HTML file is loaded. If you only want one video file you can remove all other options and change the url to your desired mp4.

Ex:
```html
  <script>
    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    var cinemagraphs = [
      "https://cdn.flixel.com/flixel/x9dr8caygivq5secll7i.hd.mp4", //remove or change this line
      "https://cdn.flixel.com/flixel/v26zyfd6yf0r33s46vpe.hd.mp4", //remove or change this line
      "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4", //remove or change this line
      "https://cdn.flixel.com/flixel/rosz2gi676xhkiw1ut6i.hd.mp4" //remove or change this line
    ];
    document.getElementById("cinemagraph").setAttribute("src", cinemagraphs[randomIntFromInterval(0, cinemagraphs.length - 1)]); 
  </script>
 ```


[Troubleshooting](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)
