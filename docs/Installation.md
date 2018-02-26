# Installation

## Install Dependencies

### Sox

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

### Raspberry Pi Specific Dependencies

If you are using `Raspberry Pi` install the following:

```bash
$ sudo apt-get install swig3.0 python-pyaudio python3-pyaudio sox
$ pip install pyaudio
```

Then install the atlas matrix computing library:

```bash
$ sudo apt-get install libatlas-base-dev
```

## Install Module

Execute the following commands to install the module:

```bash
$ cd ~/MagicMirror/modules # navigate to module folder
$ git clone https://github.com/dolanmiu/MMM-awesome-alexa.git # clone this repository
$ cd MMM-awesome-alexa # go into the module directory
$ npm install --only=prod
$ npm run electron-rebuild
```

## Configuring the Module

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
