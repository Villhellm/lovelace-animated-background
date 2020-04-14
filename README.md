# Animated Lovelace Background

This module is for [Lovelace](https://www.home-assistant.io/lovelace) on [Home Assistant](https://www.home-assistant.io/)

Create animated backgrounds based on the state of one of your entities. Originally designed for changing with the weather, à la [VideoBackground-Card](https://github.com/Perdemot/Lovelace-Cards/tree/master/VideoBackground-Card), you can now choose any entity in home assistant and create an animated background for each of its states.

A big thanks to [CCH](https://github.com/maykar/compact-custom-header) and [VideoBackground-Card](https://github.com/Perdemot/Lovelace-Cards/tree/master/VideoBackground-Card) for the inspiration. All example animation files used in this repo are originally from the VideoBackground-Card repo.

Example:
![Example](https://raw.githubusercontent.com/Villhellm/README_images/master/Animation.gif)

## Installation Method 1: Manual

### Step 1

Install `animated-background` by copying `animated-background.js` from this repo to `<config directory>/www/animated-background.js` on your Home Assistant instance. This repo also includes a handful of default animation pages to use if you would like.

### Step 2

Add the custom element in the root of your `ui-lovelace.yaml`, not in a view or card.
Ex:
```yaml
resources:
  - url: /local/animated-background.js
    type: module
animated_background:
  default_url: /local/animated-background/background-animations/sunny.html
  included_users:
    - Villhellm
  entity: "weather.dark_sky"
  state_url:
    'sunny': /local/animated-background/background-animations/sunny.html
    'partlycloudy': /local/animated-background/background-animations/cloudy.html
    'cloudy': /local/animated-background/background-animations/cloudy.html
    'mostlycloudy': /local/animated-background/background-animations/mostlycloudy.html
    'clear-night': /local/animated-background/background-animations/night.html
    'fog': /local/animated-background/background-animations/fog.html
```

## Installation Method 2: HACS

### Step 1

Make sure you have [HACS](https://github.com/custom-components/hacs) installed, and proceed with the instructions for [adding a custom repository](https://custom-components.github.io/hacs/usage/settings/#add-custom-repositories)

### Step 2

Add the custom element in the root of your `ui-lovelace.yaml`, not in a view or card.
Ex:
```yaml
resources:
  - url: /community_plugin/lovelace-animated-background/animated-background.js
    type: module
animated_background:
  default_url: /community_plugin/lovelace-animated-background/background-animations/sunny.html
  included_users:
    - Villhellm
  entity: "weather.dark_sky"
  state_url:
    'sunny': /community_plugin/lovelace-animated-background/background-animations/sunny.html
    'partlycloudy': /community_plugin/lovelace-animated-background/background-animations/cloudy.html
    'cloudy': /community_plugin/lovelace-animated-background/background-animations/cloudy.html
    'mostlycloudy': /community_plugin/lovelace-animated-background/background-animations/mostlycloudy.html
    'clear-night': /community_plugin/lovelace-animated-background/background-animations/night.html
    'fog': /community_plugin/lovelace-animated-background/background-animations/fog.html
  views:
    - path: default
      config:
        default_url: /community_plugin/lovelace-animated-background/background-animations/sunny.html
        entity: "weather.home"
        state_url:
          'sunny': /community_plugin/lovelace-animated-background/background-animations/sunny.html
          'partlycloudy': /community_plugin/lovelace-animated-background/background-animations/cloudy.html
          'cloudy': /community_plugin/lovelace-animated-background/background-animations/cloudy.html
          'mostlycloudy': /community_plugin/lovelace-animated-background/background-animations/mostlycloudy.html
          'clear-night': /community_plugin/lovelace-animated-background/background-animations/night.html
          'fog': /community_plugin/lovelace-animated-background/background-animations/fog.html
      
```

# Configuration

Configuration for Animated Background goes into the root of your Lovelace config.

## Configuration Options

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| default_url | string | **Optional** | If no matching state is found, this is the fallback url
| views | list | **Optional** | Allows you to set custom configurations per view
| entity | string | **Optional** | Entity to check for state changes
| state_url | map | **Optional** | Map of states and urls. Required if `entity` is defined
| included_users | list | **Optional** | List of users that will display animated background. If this option is set any users not included in this list will be excluded.
| included_devices | list | **Optional** | List of devices that will display animated background. If this option is set any devices not included in this list will be excluded.
| excluded_users | list | **Optional** | Users to be excluded
| excluded_devices | list | **Optional** | Devices to be excluded

While all entries are optional, it is recommended to at least set `default_url` or `entity` with `state_url`. Without one of those set you would never know this plugin was installed. 

## View Configuration

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| path | string | **Required** | The path to the Lovelace view you want to configure. Whatever comes after `/lovelace/` in your view's url
| config | config | **Required** | Same options as the above configuration

[Troubleshooting](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)
