[![Chat on Gitter][gitter-image]][gitter-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]


# MMM-awesome-alexa
> A hands free Alexa module for the Magic Mirror, which is activated when you say 'Alexa'.

## Installation

1. Execute the following commands to install the module:

```bash
$ cd ~/MagicMirror/modules # navigate to module folder
$ git clone https://github.com/dolanmiu/MMM-awesome-alexa.git # clone this repository
$ cd MMM-awesome-alexa # go into the module directory
$ npm install --unsafe-perm # install all the dependancies
$ sudo npm install --unsafe-perm # If on a mac
$ npm run build # build the project
```
2. You need to install `SoX`:

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

3. If you are using `Raspberry Pi` install the following:

   ```bash
   $ sudo apt-get install swig3.0 python-pyaudio python3-pyaudio sox
   $ pip install pyaudio
   ```

   Then install the atlas matrix computing library:

   ```bash
   $ sudo apt-get install libatlas-base-dev
   ```

3. Go to https://magic-mirror-avs.github.io/Alexa-Web-Helper/ and generate a config for this alexa module. I have tried to make this step as simple as possible.

4. Then, add the previously generated config from the website above and put it into the `modules` section of your `config/config.js` file.

5. Finally, say boot up `Magic Mirror` and say "Alexa, what time is it?" 😊

# Features
- Wake Word support
- Custom Wake Word
- Very easy set up
- Easy config tool
- All-in-one solution.

### Coming Soon
- Visualisation

## Supported Wake Words
Right Now it only supports Alexa

### Coming Soon
- Computer
- Jarvis
- Smart Mirror

[gitter-image]: https://badges.gitter.im/dolanmiu/awesome-alexa.svg
[gitter-url]: https://gitter.im/awesome-alexa/Lobby

[gemnasium-image]: https://gemnasium.com/badges/github.com/dolanmiu/MMM-awesome-alexa.svg
[gemnasium-url]: https://gemnasium.com/github.com/dolanmiu/MMM-awesome-alexa
