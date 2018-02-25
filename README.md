[![Chat on Gitter][gitter-image]][gitter-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]
[![dependencies Status][daviddm-image]][daviddm-url]
[![Build Status][travis-image]][travis-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

<p align="center">
   <img src="https://user-images.githubusercontent.com/2917613/28090232-861702b0-6683-11e7-8379-1347e01c9411.png" height="300">
<p>

# MMM-awesome-alexa

> A hands free Alexa module for the Magic Mirror, which is activated when you say 'Alexa'.
> At the moment, this only works for MacOS and Ubuntu. Raspberry Pi has experimental support, it works when I tried it, but please try yourself and let us know on Gitter!

## Before installing

Before installing this module you need to make sure your speakers and microphone are working correctly.
Note that this setup was tested on Raspbian Linux distribution but it should work with many others.

Let's first test your speakers:

1. Make sure speakers are plugged in and they are turned on
2. Move some audio file (I used mp3 file) to your Raspberry
3. Try to play your audio file with `omxplayer -o alsa myAudioFile.mp3`
4. If you hear your audio file then speakers are working correctly and you can move to microphone testing
5. If you can't hear your audio file playing move to audio troubleshooting

Let's test your microphone next:

1. Make sure microphone is plugged in and it is not muted (some microphones has mute switch)
2. Try to record yourself with `arecord --format cd --duration 15 --channels 1 test.wav`
3. This will record you for 15 seconds so please talk continuously for 15 seconds
4. If you get error like `arecord: main:788: audio open error: No such file or directory` you know right away that your mic is not setup properly so you can move to audio troubleshooting
5. If it did record without problems play the file with `omxplayer -o alsa test.wav`
6. If you can hear yourself then everything is setup correctly!
7. If you can't hear yourself move to audio troubleshooting

### Audio troubleshooting

First thing to do is to run `alsamixer` on command line and view like this pops up:

![Imgur](https://i.imgur.com/vXZzssQ.png)

Here you can check your configured playback and capture devices. If you press F4 you can see that I don't have any default microphones setup

![Imgur](https://i.imgur.com/ZDyInq9.png)

This is because I am using USB sound card on my Raspberry. Your setup may be different of course but the process is the same.
Run `aplay -l` which lists all your sound cards and audio devices.

![Imgur](https://i.imgur.com/72GDxex.png)

Here I want to make my USB sound card as default device. As you can see the card 1 is my USB sound card.
Also run `arecord -l` to list your recording devices

![Imgur](https://i.imgur.com/frl5K6s.png)

Here is the same thing that my USB sound card is number one. Next we need to change those.

Create ALSA config file to your home directory like this `touch ~/.asoundrc`
Open that file for example with nano `nano ~/.asoundrc`
Add the following contents to it

```
pcm.!default {
    type hw
    card 1
}

ctl.!default {
    type hw
    card 1
}
```

Let's break this down:

* in `pmc` the `p` stands for playback. So were configuring playback settings inside this block
* all you need to know that we are setting default card to 1 for playback
* this number has to match your desired card that we looked up previous. For my case it is 1
* in `ctl` the `c` stands for capture. So were configuring capture settings inside this block
* same here that change the card number to right one. In my case it was 1 like we checked previously
* also note that if you want to configure some other device inside the card you can specify that too
* we did not define device number in these block so then default 0 is used
* with the above setting we are saying "by default playback uses card 1 and device 0 to play audio files"
* and also we are saying "by default use card 1 and device 0 to record audio"

More info on configuring `asoundrc` can be found [here](https://www.alsa-project.org/main/index.php/Asoundrc)

After these steps your audio setup is done! If you still have problems play around with the setting and check the documentation on [asoundrc](https://www.alsa-project.org/main/index.php/Asoundrc)

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
$ npm install --only=prod
$ npm run electron-rebuild
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
            "lite": false,
            "isSpeechVisualizationEnabled": false
        }
    }
    ```

2. Then, add the config from the website above and put it into the `modules` section of your `config/config.js` file.

3. To configure the wake word, change the `wakeWord` property in the `config`:
   Alexa: `wakeWord: "Alexa"`
   Smart Mirror: `wakeWord: "Smart Mirror"`
   Snowboy: `wakeWord: "Snowboy"`

4. To turn on visualization, set `isSpeechVisualizationEnabled` to `true`.

## Usage

Boot up `Magic Mirror` and say "Alexa, what time is it?", or "Alexa, tell me a joke" 😊.

**Note:** If you are using Raspberry Pi, you most likely will experience a `snowboy` issue. Please go to the [Troubleshoot](#troubleshoot) section down below

## What to do next?

So you have got it this far and very happy with your working Alexa-enabled MagicMirror. You can then change your time/location; by default, the Alexa is based in Seattle: https://github.com/alexa/alexa-avs-sample-app/issues/222

# Features

* Wake Word support
* Custom Wake Word
* Very easy set up
* Easy config tool
* All-in-one solution.
* Visualization

## Supported Wake Words

* Alexa
* Smart Mirror
* Snowboy

### Coming Soon

* Computer
* Jarvis

# Contribution Guide

Want to contribute? Read the guide here: https://github.com/dolanmiu/MMM-awesome-alexa/wiki/Contribution-Guide

# Troubleshoot

First check if your mic works by typing in:

```bash
rec t.wav
```

If the above command doesn't work, please fix that before continuing. [Here is a link to help you (Raspberry pi)](https://www.raspberrypi.org/forums/viewtopic.php?t=13088&p=332703)

## Snowboy problems

If you are getting an error related to `snowboy`, run this command inside the `MMM-awesome-alexa` folder:

```bash
$ npm run electron-rebuild
```

If that still doesn't work, use node `6.10.x`, and then re-run the above command. There was this [issue about node `7.0.0`](https://github.com/Kitt-AI/snowboy/issues/117), and [node `8.0.0`](https://github.com/Kitt-AI/snowboy/issues/212).

### Still doesn't work

Follow `snowboy`'s official guide on how to recompile their package:
https://github.com/Kitt-AI/snowboy#compile-a-node-addon

---

Made with 💖 by Dolan. Huge thanks to [henrikra](https://github.com/henrikra/) for his contributions to this project!

[gitter-image]: https://badges.gitter.im/dolanmiu/awesome-alexa.svg
[gitter-url]: https://gitter.im/awesome-alexa/Lobby
[gemnasium-image]: https://gemnasium.com/badges/github.com/dolanmiu/MMM-awesome-alexa.svg
[gemnasium-url]: https://gemnasium.com/github.com/dolanmiu/MMM-awesome-alexa
[travis-image]: https://travis-ci.org/dolanmiu/MMM-awesome-alexa.svg?branch=master
[travis-url]: https://travis-ci.org/dolanmiu/MMM-awesome-alexa
[daviddm-image]: https://david-dm.org/dolanmiu/MMM-awesome-alexa/status.svg
[daviddm-url]: https://david-dm.org/dolanmiu/MMM-awesome-alexa
[greenkeeper-image]: https://badges.greenkeeper.io/dolanmiu/MMM-awesome-alexa.svg
[greenkeeper-url]: https://greenkeeper.io/
