[![Chat on Gitter][gitter-image]][gitter-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]
[![dependencies Status][daviddm-image]][daviddm-url]
[![Build Status][travis-image]][travis-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/dolanmiu/MMM-awesome-alexa.svg)](https://greenkeeper.io/)

<p align="center">
   <img src="https://user-images.githubusercontent.com/2917613/28090232-861702b0-6683-11e7-8379-1347e01c9411.png" height="300">
<p>

# MMM-awesome-alexa

> A hands free Alexa module for the Magic Mirror, which is activated when you say 'Alexa'.
> At the moment, this only works for MacOS and Ubuntu. Raspberry Pi has experimental support, it works when I tried it, but please try yourself and let us know on Gitter!

## Installation

### Install Dependencies
#### Sox
You need to install `SoX`:

For OS X (need [homebrew](https://brew.sh/)):

```bash
$ brew install sox
```

For Linux (and thus `Raspberry Pi`):

```bash
$ sudo apt-get install sox libsox-fmt-all
```

For Windows:

[Download from SourceForge](https://sourceforge.net/projects/sox/files/latest/download)

#### Raspberry Pi Specific Dependencies
If you are using `Raspberry Pi` install the following:
```bash
$ sudo apt-get install swig3.0 python-pyaudio python3-pyaudio sox
$ pip install pyaudio
```

Then install the atlas matrix computing library:

```bash
$ sudo apt-get install libatlas-base-dev
```
   
### Install Module
Execute the following commands to install the module:
```bash
$ cd ~/MagicMirror/modules # navigate to module folder
$ git clone https://github.com/dolanmiu/MMM-awesome-alexa.git # clone this repository
$ cd MMM-awesome-alexa # go into the module directory
$ npm install
$ npm run electron-rebuild # You MAY need to run this if MagicMirror complains about Snowboy
```

### Configuring the Module
1. Go to https://magic-mirror-avs.github.io/Alexa-Web-Helper/ and generate a config for this alexa module. I have tried to make this step as simple as possible.
   
   Sometimes, this does not work, because it would be missing a `Refresh Token`, please follow this guide to manually do it with these Three ways:

   * https://github.com/dolanmiu/MMM-awesome-alexa/wiki/How-to-get-AVS-Token

   * https://github.com/dolanmiu/MMM-awesome-alexa/wiki/How-to-get-AVS-Token-2
   
   * > In the `help/bash-scripts` directory are two files: `auth_code.sh` and `auth_code2.sh`
     > Run `auth_code.sh` first then the `auth_code2.sh`. 
     > **MAKE SURE YOU ENTER YOUR DATA IN THE FILES BEFORE RUNNING!**

   The `config` should look like:

   ```json
   {
     "module": "MMM-awesome-alexa",
     "position": "bottom_bar",
     "config": {
       "wakeWord": "Alexa",
       "clientId": "YOUR_CLIENT_ID",
       "clientSecret": "YOUR_CLIENT_SECRET",
       "deviceId": "YOUR_DEVICE_ID",
       "refreshToken": "YOUR_REFRESH_TOKEN",
       "lite": false
     }
   }
   ```

2. Then, add the config from the website above and put it into the `modules` section of your `config/config.js` file.

## Usage
Boot up `Magic Mirror` and say "Alexa, what time is it?", or "Alexa, tell me a joke" 😊.

**Note:** If you are using Raspberry Pi, you most likely will experience a `snowboy` issue. Please go to the [Troubleshoot](#troubleshoot) section down below

## What to do next?
So you have got it this far and very happy with your working Alexa-enabled MagicMirror. You can then change your time/location; by default, the Alexa is based in Seattle: https://github.com/alexa/alexa-avs-sample-app/issues/222

# Features
- Wake Word support
- Custom Wake Word
- Very easy set up
- Easy config tool
- All-in-one solution.

### Coming Soon
- Visualisation

## Supported Wake Words
- Alexa
- Smart Mirror

### Coming Soon
- Computer
- Jarvis


# Troubleshoot
First check if your mic works by typing in:
```bash
rec t.wav
```

If the above command doesn't work, please fix that before continuing. [Here is a link to help you (Raspberry pi)](https://www.raspberrypi.org/forums/viewtopic.php?t=13088&p=332703)

## PM2 problems
For some reason, running MagicMirror on `PM2` with this module doesn't seem to work on Raspberry Pi. The mic does not pick up. If anyone has a solution or cause for this, it would be greatly appreciated. I would recommend to start the MagicMirror the traditional way of `npm start`.

## Snowboy problems
If you are getting an error related to `snowboy`, run this command inside the `MMM-awesome-alexa` folder:

```bash
$ npm run electron-rebuild
```

If that still doesn't work, use node `6.10.x`, there was this [issue about node `7.0.0`](https://github.com/Kitt-AI/snowboy/issues/117), and [node `8.0.0`](https://github.com/Kitt-AI/snowboy/issues/212), and re-run the above command.

### Still doesn't work
Follow `snowboy`'s official guide on how to recompile their package:
https://github.com/Kitt-AI/snowboy#compile-a-node-addon

---

Made with 💖 by Dolan

[gitter-image]: https://badges.gitter.im/dolanmiu/awesome-alexa.svg
[gitter-url]: https://gitter.im/awesome-alexa/Lobby

[gemnasium-image]: https://gemnasium.com/badges/github.com/dolanmiu/MMM-awesome-alexa.svg
[gemnasium-url]: https://gemnasium.com/github.com/dolanmiu/MMM-awesome-alexa

[travis-image]: https://travis-ci.org/dolanmiu/MMM-awesome-alexa.svg?branch=master
[travis-url]: https://travis-ci.org/dolanmiu/MMM-awesome-alexa

[daviddm-image]: https://david-dm.org/dolanmiu/MMM-awesome-alexa/status.svg
[daviddm-url]: https://david-dm.org/dolanmiu/MMM-awesome-alexa
