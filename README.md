# Yaeb

**Yaeb** is **y**et **a**nother **e**lectron-based **b**rowser.

> **NOTE:** VERY BETA. VERY RAW. Use at own risk. This is, for now, just a toy.

The main idea is to have rather minimal stock UI, and provide everything that's
needed either out of the box with keyboard shortcuts, or available via an API
for addindg whatever customizations you like. The only UI that's visible by
default upon startup is the tabs bar.

## Features

* Tabs
* Separate profiles/persistent-sessions, just like with Chrome.
* User-defined eyboard shortcuts for everything.
* No React used anywhere. Or any other frameworks, really.

## Installation

Until a real release is ready, you'll have to clone this repo, then `npm i` and
`npm start`. If you beg me I might build a release just for you!

## Usage

These keybindings are remappable (see Keybindings section, but here are the
defaults:

* Alt+T: New tab
* Alt+Q: Close tab
* Alt+Left/Right: Move between tabs
* Alt+U: Toggle showing URL bar (no searching yet)
* Alt+Y: Set profile for new tabs
* Alt+B: Back
* Alt+N: Forward
* Alt+R: Refresh
* Alt+S: Stop
* Alt+F: Search in Page

If you start with the environment variable `DEBUG` set to anything, then these
are available:

* Ctrl+Shift+I: Open Dev Tools for the browser window (not for the pages within.)
* Ctrl+R: Reload the entire browser UI.

To run with a profile other than "default", set the `YAEB_PROFILE` environment
variable to whichever profile you want before starting the browser. The profile
for new tabs can be set with Alt+Y. You can also switch profiles
programmatically. See the API section below.

You can also Ctrl+Click to open a link in a new tab, the same as you would in
Chrome.

## Configuration

Configuration files are stored in the app data path, which varies by OS:

* Mac: `~/Library/Application Support`
* Windows: `%APPDATA%/yaeb`
* Linux, etc.: `~/.config/yaeb`

We'll call this `<configPath>` from here on.

### `<configPath>/browser.js`

This file is run inside the Electron window, after all the Yaeb scaffolding code
has run. It's running outside of all the `<webview>`s, so you can manipluate
them, their associated tabs, etc. See the API section for details.

#### Keybindings

You can set keybindings in `browser.js` by calling
`yaeb.keyBind(combo, action)`. A full list of available actions is shown in the
terminal upon starting yaeb. Key combinations use the
[Mousetrap](https://craig.is/killing/mice) syntax. For example, the following
binds Ctrl+Alt+Esc to the 'back' action.

```js
yaeb.keyBind('ctrl+alt+esc', 'back')
```

### `<configPath>/browser.css`

This css is file is loaded after the builtin css for the browser itself. This
is primarily for styling the tabs and the URL bar.

Note that tabs for particular profiles have the css class `tab profile-<name>`.

## API

There is a global `yaeb` object with the following properties.

* `profile`: The current profile. Set this to set the profile used for new tabs.
* `newTabUrl`: The new tab URL. Defaults to `http://www.google.com`.
* `views`: All of the `<webview>` DOM objects in an array, in the same order as tabs.
* `tabs`: All of the tabs as DOM objects, in an array.
* `keyBind`: Bind a key combo to an action. See Keybindings section above.
* `focused`: Index of the focused tab. Setting this will set the focus.

## Contributing

Please do! Create all the PRs and issues you want or need.

## LICENSE

MIT License. See LICENSE.txt
