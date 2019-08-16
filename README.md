# Animated Lovelace Background

This module is for [Lovelace](https://www.home-assistant.io/lovelace) on [Home Assistant](https://www.home-assistant.io/)


A big thanks to [CCH](https://github.com/maykar/compact-custom-header) and [VideoBackground-Card](https://github.com/Perdemot/Lovelace-Cards/tree/master/VideoBackground-Card) for the inspiration. All example animation files used in this repo are originally from the VideoBackground-Card repo. 

Example:
![Example](https://raw.githubusercontent.com/Villhellm/README_images/master/Animation.gif)

## Installation

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

# Configuration

Configuration for Animated Background goes into the root of your Lovelace config.

## Options

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| default_url | string | **Optional** | If no matching state is found, this is the fallback url
| entity | string | **Optional** | Entity to check for state changes
| state_url | map | **Optional** | Map of states and urls
| included_users | list | **Optional** | List of users that will display animated background. If this option is set any users not included in this list will be excluded.
| included_devices | list | **Optional** | List of devices that will display animated background. If this option is set any devices not included in this list will be excluded.
| excluded_users | list | **Optional** | Users to be excluded
| excluded_devices | list | **Optional** | Devices to be excluded

[Troubleshooting](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)
