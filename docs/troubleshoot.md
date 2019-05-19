# Troubleshoot

> First, run `MagicMirror` with `npm start dev`, this will give logs. If you can't find your issue here. Please open an issue on GitHub with appropriate logs (if any).

## Mic does not work

First check if your mic works by typing in:

```bash
rec t.wav
```

If the above command doesn't work, please fix that before continuing. [Here is a link to help you (Raspberry pi)](https://www.raspberrypi.org/forums/viewtopic.php?t=13088&p=332703)

## Play() failed

You get the folliwing error:

> play() failed because the user didn't interact with the document first.

Make sure you follow the install instructions properly and add the snippet of code in MagicMirror.

More information of why this happens here: https://github.com/electron/electron/issues/13525

## Snowboy issues

Please make sure you followed the install instructions correctly and that building `snowboy` using `electron-rebuild` suceeded.

Please raise an issue on the `MMM-awesome-alexa` GitHub, and also `snowboy`'s GitHub as this library is out my control, and out of scope of this module: https://github.com/Kitt-AI/snowboy/issues
