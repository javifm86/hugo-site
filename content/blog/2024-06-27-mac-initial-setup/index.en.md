---
title: 'My initial setup for mac'
date: 2024-06-27
author: javi
type: post
img: img/apple.png
altImg: Apple logo
toc: false
tags:
  - mac
---

# My initial setup for mac

Finally, I decided to purchase a Mac, specifically the Mac Mini M2 Pro. Additionally, I will be switching to a MacBook Pro for my job. Now, it's time to set up the operating system to my liking.

## System settings

- `Mouse > Natural scrolling` to disabled
- `Keyboard` Adjust key repeat rate to fastest and delay until repeat to short.
- `Keyboard > Keyboard shortcuts > Input sources` disable both shortcuts, I don't need them and one of them collides with VSCode.
- `Keyboard > Keyboard shortcuts > Services > Text` disable `Convert text to Simplified chinese and traditional`, I want those shortcuts for something more useful for me.
- Disable ApplePressAndHoldEnabled, a setting that doesn't allow you to hold a key to repeat that character multiple times. Go to the terminal and execute this: `defaults write -g ApplePressAndHoldEnabled -bool false`. Same command with `true` to enable again.

## Finder

Finder is the file explorer for Mac. I will add some configuration for a better productivity.

- Change the view to list and add the column Date modified.
- Go to `View` and enable `Show path bar` and `Show status bar`.
- Drag and drop my most used folders to the left side for quick access, such as `Github`.
- In `View`, go to `Customize toolbar` and get rid of anything I don't use, like tags, groups, etc.
- `Finder > Settings > Advanced` and select **Current folder** for the `When performing a search` field.

## Dock settings

Right click on the dock and select Dock settings:

- Enable minimize application into icon.
- Disable Show suggested and recent apps in dock.

## Install apps

I usually install these apps:

- [Shottr](https://shottr.cc/): Free app for taking screenshots and make quick annotations.
- [Warp](https://www.warp.dev/): Improved terminal, with AI.
- [Oh My Zsh](https://ohmyz.sh/): Framework for customizing zsh terminal.
- [Macpass](https://macpassapp.org/): Password manager KeePass client for mac.
- [Colorslurp](https://colorslurp.com/): Color picker. I love holding Ctrl + click while moving for hi precision.
- [VSCode](https://code.visualstudio.com/download): My favorite text editor for development.
- [Firefox](https://www.mozilla.org/es-ES/firefox/new/), [Chrome](https://www.google.com/intl/es_es/chrome/), [Responsively](https://responsively.app/): Browsers.
- [Logi Options+](https://www.logitech.com/es-es/software/logi-options-plus.html): Software for my keyboard and mouse.
- [ChatGPT](https://openai.com/chatgpt/mac/): The AI tool.
- [HyperKey](https://hyperkey.app/): Convert the Caps Lock or any other unused key to the hyper key, a combination of these 4 keys: `⌃⌥⌘⇧`. More information below.
- [Raycast](https://www.raycast.com/): Spotlight with steroids. More information below.
- [DevToys](https://github.com/DevToys-app/DevToysMac): Swiss Army knife DevToys for macOS.
- [GIMP](https://www.gimp.org/downloads/): Open source image manipulation program.
- [Rectangle PRO](https://rectangleapp.com/pro): Windows management and my favourite feature, App layouts.

### Hyperkey

[HyperKey](https://hyperkey.app/) is a very basic application that can be a game changer for shortcuts. You can map the very unused caps lock key (or other), to trigger the combination `⌃⌥⌘⇧`. This combination is rarely used for any shortcut.

Furthermore, the caps lock key will still work as usual if you press it quickly. This is the configuration I use for Hyperkey:

![Hyperkey config](img/hyperkey.png 'Hyperkey config')

If you want to achieve the same customization or go beyond, you can use [Karabiner](https://karabiner-elements.pqrs.org/). Karabiner is a very powerful application that allows you to customize your keyboard in macOS. There are a lot of crazy combinations and things you can achieve, but for simplicity I am using Hyperkey for now.

### Raycast

[Raycast](https://www.raycast.com/) is an application that is an enhanced version of the native Spotlight. In my opinion Raycast implements some of the missing functionalities that Mac should bring out of the box, Clipboard manager, Windows management and lot of stuff that you can add in form of plugins.

First thing I do is mapping Raycast to the default shortcut for Spotlight, `Command + Space`. To do that, go to System `Preferences > Keyboard > Shortcuts > Spotlight` and disable the keyboard shortcut. Then go to Raycast settings and record the hotkey using `Command + Space` and you are good to go.

Some extensions I installed:

- Colorslurp.
- Google translate.
- Ruler.
- GIF Search.
- Lorem Ipsum.
- Change case.
- ray.so
- brew

## Shortcuts

Useful predefined shortcuts and some defined by myself to improve productivity.

### Apps management

- `⌘ + M`: Minimize
- `⌃ + ⌘ + F`: Toggle full screen
- `⌘ + W`: Close app
- `⌘ + Q`: Kill app
- `⌘ + H`: Hide app
- `⌥ + ⌘ + H`: Hide all apps except focused
- `⌥ + ⌘ + W`: Close all windows for an app
- `⌥ + ⌘ + ESC`: Force quit apps.
- `F11`: Show desktop.

### Screenshots

- `⌘ + ⌃ + 1`: Capture screen (Shottr)
- `⌘ + ⌃ + 2`: Capture area (Shottr)
- `⌘ + ⌃ + 3`: Capture screen (Native)
- `⌘ + ⌃ + 4`: Capture area (Native)
- `⌘ + ⌃ + 5`: Capture video (Native)

### Windows management

Custom shortcuts defined in Raycast:

- `⌘ + ⌥ + Left`: Move to left (Cycle)
- `⌘ + ⌥ + Right`: Move to right (Cycle)
- `⌘ + ⌥ + Up`: Move to up (Cycle) Note: Conflict with VSCode shortcut
- `⌘ + ⌥ + Down`: Move to down (Cycle) Note: Conflict with VSCode shortcut
- `⌘ + ⌥ + C`: Center (Cycle)
- `⌃ + ⌘ + ⌥ + C`: Center
- `⌘ + ⌥ + F`: Maximize
- `⌘ + ⌥ + Del`: Restore
- `⌘ + ⌥ + +`: Larger
- `⌘ + ⌥ + -`: Smaller

### Clipboard history

- `⌃ + ⌥ + V`: Clipboard history in Raycast

### Hyper key shortcuts

- `⌃ + ⌥ + ⌘ + ⇧ + F`: Firefox
- `⌃ + ⌥ + ⌘ + ⇧ + C`: Chrome
- `⌃ + ⌥ + ⌘ + ⇧ + V`: VSCode
- `⌃ + ⌥ + ⌘ + ⇧ + W`: Warp
- `⌃ + ⌥ + ⌘ + ⇧ + S`: Slack
- `⌃ + ⌥ + ⌘ + ⇧ + Enter`: Confetti (Raycast extension)
