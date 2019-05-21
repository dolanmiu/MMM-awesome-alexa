# Installation

> `MMM-awesome-alexa` is installed with three steps. (1) Dependency installation, (2) module installation, and (3) module configuration

## Step 1. Install Dependencies

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

### Raspberry Pi Specific Dependencies

If you are using `Raspberry Pi` install the following:

```bash
$ sudo apt-get install swig3.0 python-pyaudio python3-pyaudio sox
$ pip install pyaudio
```

**Note:** You may need these to get python-pyaudio to work as mentioned [here](https://github.com/dolanmiu/MMM-awesome-alexa/issues/111#issuecomment-398080200):

```bash
$ sudo apt-get install libasound-dev portaudio19-dev libportaudio2 libportaudiocpp0 ffmpeg libav-tools
```

Then install the atlas matrix computing library:

```bash
$ sudo apt-get install libatlas-base-dev
```

## Step 2. Install Module

Execute the following commands to install the module:

Originally from: https://github.com/dolanmiu/MMM-awesome-alexa/issues/164#issuecomment-492951739

```bash
$ cd ~/MagicMirror/modules # Navigate to module folder
$ git clone https://github.com/dolanmiu/MMM-awesome-alexa.git # Clone this repository
$ cd MMM-awesome-alexa # go into the module directory
$ npm install --only=prod # Install depdendencies
$ cd node_modules
$ rm -rf snowboy # Remove the installed snowboy
$ git clone https://github.com/Kitt-AI/snowboy.git # Manually get snowboy from git
$ cd snowboy
$ rm -rf node_modules
$ npm install nan --save
$ npm install node-pre-gyp@0.12.0 --save
$ npm install
$ npm run prepublish
$ npm install --save-dev electron-rebuild
$ npm install nan
$ ./node_modules/.bin/electron-rebuild # Build snowboy to your device specifications
```

### Modifying MagicMirror / Electron

?> This is a temporary fix, and will be officially fixed in July 2019: https://github.com/MichMich/MagicMirror/pull/1683

Due to an [update](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) in [Chrome 66](https://www.chromium.org/audio-video/autoplay), it means sound cannot be played unless there is a user action. More info can be found here: https://github.com/electron/electron/issues/13525

To fix this, we must add a flag at the end of MagicMirror's `js/electron.js` file:

```js
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
```

## Step 3. Configuring the Module

1. Run:

    ```bash
    $ npm run config-helper
    ```

2. Follow the on screen instructions and give the script info it needs.

    ![CLI Token Helper](https://i.imgur.com/ol8IIcp.png)

3. Get `refresh_token` from the succesful response
4. You can continue with the tool, or fill it out manually below
5. Fill `MMM-awesome-alexa` module config with your information to your `config/config.js` file.

    ```js
    {
        module: "MMM-awesome-alexa",
        position: "bottom_bar",
        config: {
            wakeWord: "Alexa",
            clientId: "YOUR_CLIENT_ID",
            clientSecret: "YOUR_CLIENT_SECRET",
            deviceId: "YOUR_DEVICE_ID",
            refreshToken: "YOUR_REFRESH_TOKEN",
            lite: false,
            isSpeechVisualizationEnabled: false
        }
    }
    ```

6. `wakeWord` can have the following values:

| Wake Word    | Value                      |
| ------------ | -------------------------- |
| Alexa        | `wakeWord: "Alexa"`        |
| Smart Mirror | `wakeWord: "Smart Mirror"` |
| Snowboy      | `wakeWord: "Snowboy"`      |

7. Lite mode is where theres no animations, which may increase performance for Raspberry Pis.

8. To turn on visualization, set `isSpeechVisualizationEnabled` to `true`.
