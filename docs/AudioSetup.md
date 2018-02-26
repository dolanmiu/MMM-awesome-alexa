# Audio setup

## Why?

Before installing this module you need to make sure your speakers and microphone are working correctly.
Note that this setup was tested on Raspbian Linux distribution but it should work with many others.

## I am ready to test

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

## Audio troubleshooting

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
