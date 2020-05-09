# MAJOR BREAKING CHANGE IN v0.5.0+
YOUR ANIMATED BACKGROUND CONFIGURATION WILL NEED TO BE UPDATED, follow the new configuration guidelines below.

# Animated Lovelace Background

This module is for [Lovelace](https://www.home-assistant.io/lovelace) on [Home Assistant](https://www.home-assistant.io/)

Create animated backgrounds based on the state of one of your entities. Originally designed for changing with the weather, à la [VideoBackground-Card](https://github.com/Perdemot/Lovelace-Cards/tree/master/VideoBackground-Card), you can now choose any entity in home assistant and create an animated background for each of its states.

A big thanks to [Customer Header](https://github.com/maykar/custom-header) and [VideoBackground-Card](https://github.com/Perdemot/Lovelace-Cards/tree/master/VideoBackground-Card) for the inspiration.

Example:
![Example](https://raw.githubusercontent.com/Villhellm/README_images/master/Animation.gif)

## Installation Method 1: Manual

### Step 1

Install `animated-background` by copying `animated-background.js` from this repo to `<config directory>/www/animated-background.js` on your Home Assistant instance.

### Step 2

Add the resource to your configuration. If you are in yaml mode follow [the lovelace docs](https://www.home-assistant.io/lovelace/dashboards-and-views/#resources). If you are using the UI to manage resources then go you `<your-ha-address>/config/lovelace/resources` and add the URL `/local/animated-background.js` as a javascript module. 

### Step 3

Add the custom element in the root of your `ui-lovelace.yaml` (or Lovelace raw configuration if not in yaml mode), not in a view or card.
Ex:
```yaml
animated_background:
  default_url: "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
  included_users:
    - Villhellm
  # This entity is just an example, use whatever entity you would like
  entity: "weather.home"
  state_url:
    'sunny':
      - "https://cdn.flixel.com/flixel/hlhff0h8md4ev0kju5be.hd.mp4"
      - "https://cdn.flixel.com/flixel/zjqsoc6ecqhntpl5vacs.hd.mp4"
      - "https://cdn.flixel.com/flixel/jvw1avupguhfbo11betq.hd.mp4"
      - "https://cdn.flixel.com/flixel/8cmeusxf3pkanai43djs.hd.mp4"
      - "https://cdn.flixel.com/flixel/guwb10mfddctfvwioaex.hd.mp4"

    'partlycloudy':
      - "https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd.mp4"
      - "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd.mp4"
      - "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd.mp4"
      - "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd.mp4"
      - "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd.mp4"
      - "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd.mp4"

    'cloudy':
      - "https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd.mp4"
      - "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd.mp4"
      - "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd.mp4"
      - "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd.mp4"
      - "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd.mp4"
      - "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd.mp4"

    'mostlycloudy':
      - "https://cdn.flixel.com/flixel/e95h5cqyvhnrk4ytqt4q.hd.mp4"
      - "https://cdn.flixel.com/flixel/l2bjw34wnusyf5q2qq3p.hd.mp4"
      - "https://cdn.flixel.com/flixel/rrgta099ulami3zb9fd2.hd.mp4"

    'clear-night':
      - "https://cdn.flixel.com/flixel/x9dr8caygivq5secll7i.hd.mp4"
      - "https://cdn.flixel.com/flixel/v26zyfd6yf0r33s46vpe.hd.mp4"
      - "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
      - "https://cdn.flixel.com/flixel/rosz2gi676xhkiw1ut6i.hd.mp4"

    'fog':
      - "https://cdn.flixel.com/flixel/vwqzlk4turo2449be9uf.hd.mp4"
      - "https://cdn.flixel.com/flixel/5363uhabodwwrzgnq6vx.hd.mp4"

    'rainy': "https://cdn.flixel.com/flixel/f0w23bd0enxur5ff0bxz.hd.mp4"

title: Home
views: ...
```

## Installation Method 2: HACS

### Step 1

Make sure you have [HACS](https://github.com/custom-components/hacs) installed, find Animated Background in the plug section, and install.

### Step 2

Add the resource to your configuration. If you are in yaml mode follow [the lovelace docs](https://www.home-assistant.io/lovelace/dashboards-and-views/#resources) and add the URL `/hacsfiles/lovelace-animated-background/animated-background.js` as a module. If you are using the UI to manage resources then click the button at the top of the Animated Background HACS page to automatically add it to your resources.

### Step 3

Add the custom element in the root of your `ui-lovelace.yaml` (or Lovelace raw configuration if not in yaml mode), not in a view or card.
Ex:
```yaml
animated_background:
  default_url: "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
  included_users:
    - Villhellm
  # This entity is just an example, use whatever entity you would like
  entity: "weather.home"
  state_url:
    'sunny':
      - "https://cdn.flixel.com/flixel/hlhff0h8md4ev0kju5be.hd.mp4"
      - "https://cdn.flixel.com/flixel/zjqsoc6ecqhntpl5vacs.hd.mp4"
      - "https://cdn.flixel.com/flixel/jvw1avupguhfbo11betq.hd.mp4"
      - "https://cdn.flixel.com/flixel/8cmeusxf3pkanai43djs.hd.mp4"
      - "https://cdn.flixel.com/flixel/guwb10mfddctfvwioaex.hd.mp4"

    'partlycloudy':
      - "https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd.mp4"
      - "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd.mp4"
      - "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd.mp4"
      - "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd.mp4"
      - "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd.mp4"
      - "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd.mp4"

    'cloudy':
      - "https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd.mp4"
      - "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd.mp4"
      - "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd.mp4"
      - "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd.mp4"
      - "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd.mp4"
      - "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd.mp4"

    'mostlycloudy':
      - "https://cdn.flixel.com/flixel/e95h5cqyvhnrk4ytqt4q.hd.mp4"
      - "https://cdn.flixel.com/flixel/l2bjw34wnusyf5q2qq3p.hd.mp4"
      - "https://cdn.flixel.com/flixel/rrgta099ulami3zb9fd2.hd.mp4"

    'clear-night':
      - "https://cdn.flixel.com/flixel/x9dr8caygivq5secll7i.hd.mp4"
      - "https://cdn.flixel.com/flixel/v26zyfd6yf0r33s46vpe.hd.mp4"
      - "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
      - "https://cdn.flixel.com/flixel/rosz2gi676xhkiw1ut6i.hd.mp4"

    'fog':
      - "https://cdn.flixel.com/flixel/vwqzlk4turo2449be9uf.hd.mp4"
      - "https://cdn.flixel.com/flixel/5363uhabodwwrzgnq6vx.hd.mp4"

    'rainy': "https://cdn.flixel.com/flixel/f0w23bd0enxur5ff0bxz.hd.mp4"


title: Home
views: ...
```

# Configuration

Configuration for Animated Background goes into the root of your Lovelace config.

## Animated Background Configuration Options

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| default_url | string or list(string) | **Optional** | If no matching state is found, this is the fallback video url. You can either define a single url or an array. If an array is defined then a random video will be selected from that array.
| enabled | bool | **Optional** | Set to false to disable Animated Background
| display_user_agent | bool | **Optional** | If set to true you will get an alert with your current user agent. This will help determine your device to use in `excluded_devices` or `included_devices`
| debug | bool | **Optional** | Get more detailed log messages
| views | list ([views](#view-configuration)) | **Optional** | Allows you to set custom configurations per view
| groups | list ([group](#group-configuration)) | **Optional** | Allows you to set custom configurations that can be referenced in lovelace view configurations
| entity | string | **Optional** | Entity to check for state changes
| state_url | map | **Optional** | Map of states and video urls. Any mp4 video link will work, even relative `/local/` links. Using locally stored videos will greatly improve loading times. It is recommended to 'cinemagraphs', these videos are only a few seconds long and are meant to loop . Set to 'none' to disable background for the defined state (see example). You can either define a single url or an array. If an array is defined then a random video will be selected from that array. Required if `entity` is defined.
| included_users | list (string) | **Optional** | List of users that will display animated background. If this option is set any users not included in this list will be excluded.
| included_devices | list (string) | **Optional** | List of devices that will display animated background. If this option is set any devices not included in this list will be excluded. Ex:  iphone, ipad, windows, macintosh, android
| excluded_users | list (string) | **Optional** | Users to be excluded
| excluded_devices | list (string) | **Optional** | Devices to be excluded Ex:  iphone, ipad, windows, macintosh, android

While all entries are optional, it is recommended to at least set `default_url` or `entity` with `state_url`. Without one of those set you would never know this plugin was installed. 

## View Configuration

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| path | string | **Required** | The path to the Lovelace view you want to configure. Whatever comes after `/lovelace/` in your view's url. Even if you are using a different dashboard than `/lovelace/`, you still just use the last part of the url.
| config | [config](#stored-config) | **Required** | See [stored config](#stored-config) for requirements and options

Ex:
```yaml
animated_background:
  default_url: "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
  included_users:
    - Villhellm
  # This entity is just an example, use whatever entity you would like
  entity: "weather.home"
  state_url:
    'sunny':
      - "https://cdn.flixel.com/flixel/hlhff0h8md4ev0kju5be.hd.mp4"
      - "https://cdn.flixel.com/flixel/zjqsoc6ecqhntpl5vacs.hd.mp4"
      - "https://cdn.flixel.com/flixel/jvw1avupguhfbo11betq.hd.mp4"
      - "https://cdn.flixel.com/flixel/8cmeusxf3pkanai43djs.hd.mp4"
      - "https://cdn.flixel.com/flixel/guwb10mfddctfvwioaex.hd.mp4"

    'partlycloudy':
      - "https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd.mp4"
      - "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd.mp4"
      - "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd.mp4"
      - "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd.mp4"
      - "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd.mp4"
      - "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd.mp4"

    'cloudy':
      - "https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd.mp4"
      - "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd.mp4"
      - "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd.mp4"
      - "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd.mp4"
      - "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd.mp4"
      - "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd.mp4"

    'mostlycloudy':
      - "https://cdn.flixel.com/flixel/e95h5cqyvhnrk4ytqt4q.hd.mp4"
      - "https://cdn.flixel.com/flixel/l2bjw34wnusyf5q2qq3p.hd.mp4"
      - "https://cdn.flixel.com/flixel/rrgta099ulami3zb9fd2.hd.mp4"

    'clear-night':
      - "https://cdn.flixel.com/flixel/x9dr8caygivq5secll7i.hd.mp4"
      - "https://cdn.flixel.com/flixel/v26zyfd6yf0r33s46vpe.hd.mp4"
      - "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
      - "https://cdn.flixel.com/flixel/rosz2gi676xhkiw1ut6i.hd.mp4"

    'fog':
      - "https://cdn.flixel.com/flixel/vwqzlk4turo2449be9uf.hd.mp4"
      - "https://cdn.flixel.com/flixel/5363uhabodwwrzgnq6vx.hd.mp4"

    'rainy': "https://cdn.flixel.com/flixel/f0w23bd0enxur5ff0bxz.hd.mp4"
  views:
    - path: gaming
      config:
        default_url: "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
        entity: "light.game_room"
        state_url:
          'on':  "https://cdn.flixel.com/flixel/8cmeusxf3pkanai43djs.hd.mp4"
          'off': "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
title: Home
views: ...
```

## Group Configuration

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| name | string | **Required** | The name you would like to use to define your group.
| config | [config](#stored-config) | **Required** | See [stored config](#stored-config) for requirements and options

Groups can be used to easily reuse Animated Background configurations. After defining your `groups:` block with at least one entry, you can add a single line to any of your views to use this configuration. 

Ex:
```yaml
animated_background:
  default_url: "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
  groups:
    - name: weather
      config:
        entity: "weather.home"
        state_url:
          'sunny':
            - "https://cdn.flixel.com/flixel/hlhff0h8md4ev0kju5be.hd.mp4"
            - "https://cdn.flixel.com/flixel/zjqsoc6ecqhntpl5vacs.hd.mp4"
            - "https://cdn.flixel.com/flixel/jvw1avupguhfbo11betq.hd.mp4"
            - "https://cdn.flixel.com/flixel/8cmeusxf3pkanai43djs.hd.mp4"
            - "https://cdn.flixel.com/flixel/guwb10mfddctfvwioaex.hd.mp4"

          'partlycloudy':
            - "https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd.mp4"
            - "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd.mp4"
            - "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd.mp4"
            - "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd.mp4"
            - "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd.mp4"
            - "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd.mp4"

          'cloudy':
            - "https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd.mp4"
            - "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd.mp4"
            - "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd.mp4"
            - "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd.mp4"
            - "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd.mp4"
            - "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd.mp4"

          'mostlycloudy':
            - "https://cdn.flixel.com/flixel/e95h5cqyvhnrk4ytqt4q.hd.mp4"
            - "https://cdn.flixel.com/flixel/l2bjw34wnusyf5q2qq3p.hd.mp4"
            - "https://cdn.flixel.com/flixel/rrgta099ulami3zb9fd2.hd.mp4"

          'clear-night':
            - "https://cdn.flixel.com/flixel/x9dr8caygivq5secll7i.hd.mp4"
            - "https://cdn.flixel.com/flixel/v26zyfd6yf0r33s46vpe.hd.mp4"
            - "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
            - "https://cdn.flixel.com/flixel/rosz2gi676xhkiw1ut6i.hd.mp4"

          'fog':
            - "https://cdn.flixel.com/flixel/vwqzlk4turo2449be9uf.hd.mp4"
            - "https://cdn.flixel.com/flixel/5363uhabodwwrzgnq6vx.hd.mp4"

          'rainy': "https://cdn.flixel.com/flixel/f0w23bd0enxur5ff0bxz.hd.mp4"
views:
  - path: home
    title: Home
    cards:
      - entity: weather.home
        type: weather-forecast
  - path: display
    title: Display
    animated_background: weather #this is the line to add to your view to use the "weather" group configuration.
    #Set to 'none' if you would like to disable the background for this view
    cards:
      - entity: weather.home
        type: weather-forecast
```

## Stored Config

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| default_url | string or list(string) | **Optional** | If no matching state is found, this is the fallback video url. You can either define a single url or an array. If an array is defined then a random video will be selected from that array.
| enabled | bool | **Optional** | Set to false to disable Animated Background
| entity | string | **Optional** | Entity to check for state changes
| state_url | map | **Optional** | Map of states and video urls. Any mp4 video link will work, even relative `/local/` links. Using locally stored videos will greatly improve loading times. It is recommended to 'cinemagraphs', these videos are only a few seconds long and are meant to loop . Set to 'none' to disable background for the defined state (see example). You can either define a single url or an array. If an array is defined then a random video will be selected from that array. Required if `entity` is defined.
| included_users | list (string) | **Optional** | List of users that will display animated background. If this option is set any users not included in this list will be excluded.
| included_devices | list (string) | **Optional** | List of devices that will display animated background. If this option is set any devices not included in this list will be excluded. Ex:  iphone, ipad, windows, macintosh, android
| excluded_users | list (string) | **Optional** | Users to be excluded
| excluded_devices | list (string) | **Optional** | Devices to be excluded Ex:  iphone, ipad, windows, macintosh, android

## Example if you want a different background for night and day when a switch changes (or any combination of entities)
A few people have asked about tying this to multiple entities. The good news is this is already possible with the use of a template sensor. Here is an example of a template sensor that would allow a different background for night/day when a bedroom switch changes.

configuration.yaml
```yaml
sensor:
  - platform: template
    sensors:
      sun_bedroom:
        friendly_name: "Sun and Bedroom"
        value_template: "{{states('sun.sun') + '-' + states('switch.bedroom')}}"
        #this will return a state like 'above_horizon-on'
```

`sun.sun` has two states, `above_horizon` and `below_horizon` AKA day and night.
So now if you use `sensor.sun_bedroom` instead of just `switch.bedroom`, the beginning of the state will give you the binary state of the sun's position.
Here is an example of an Animated Background configuration that will use this sensor to give a different background based on the switch *and* whether it is day or night.

ui-lovelace.yaml (or raw configuration)
```yaml
animated_background:
  default_url: "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd.mp4"
  entity: "sensor.sun_bedroom"
  state_url:
    'above_horizon-on': "https://cdn.flixel.com/flixel/hlhff0h8md4ev0kju5be.hd.mp4"

    'below_horizon-on': "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd.mp4"

    'above_horizon-off': "https://cdn.flixel.com/flixel/zjqsoc6ecqhntpl5vacs.hd.mp4"

    'below_horizon-off': "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd.mp4"
    
```

# Warning to mobile users
While I've done my best to perfect the device/user exceptions, I am not perfect. If you are using a mobile device and using an exception to prevent Animated Background from loading, please keep an eye on the Home Assistant app data use. If you notice unusually high usage after installing the plugin open an issue immediately and I will do my best to fix it. With the way themes function after Home Assistant .108 it is possible that the background video is being loaded behind the theme background (though I am pretty sure I've caught and destroyed all the bugs in that area).

If you plan on *using* Animated Background on a mobile device, be aware that this will most likely use a lot of mobile data.

[Troubleshooting](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)
