import { Detector, Models } from "snowboy";
import * as fs from "fs";
import * as record from "node-record-lpcm16";
var Timer = require('timer-machine')
//import {VADWrapper} from  "../renderer/vad-wrapper";
export class AlexaDetector extends Detector {

    recording : any;
    silenceCounter = new Timer();

    constructor(models: Models, cwd: string, hotWordDetectedCallback: () => void = () => {return; }) {

        super({
            resource: cwd + "/resources/common.res",
            models: models,
            audioGain: 2.0,
        });

        this.on("silence", () => {
            console.log("silence");
            //If recording started
            if(this.recording != null) {
              //Silence counter havent been started before
              if(this.silenceCounter.isStarted() == false){
                  this.silenceCounter.start();
              }

              //console.log(this.silenceCounter.timeFromStart());
              //User have been silence for 1.6 seconds
              if(this.silenceCounter.timeFromStart() >  1600){
                  this.stopRecord();
                  this.recording = null;     
                  }
              }
        });

        this.on("sound", () => {
            this.silenceCounter.stop();
            //console.log("sound");


        });

        this.on("error", () => {
            // console.log("error");
        });

        this.on("hotword", (index, hotword) => {
            // console.log("hotword", index, hotword);
            hotWordDetectedCallback();
            console.log('detected hotword, recording audio');
            this.recordMode();

        });
    }

    public recordMode() :void {
        const date = new Date();
        const out = fs.createWriteStream("modules/MMM-awesome-alexa/temp/"+date.getTime+'.wav');
        this.recording = record.start({
            threshold: 0,
            verbose: true,
        });
        this.recording.pipe(out);
        console.log("recording");
    }

    public stopRecord() :void {
        record.stop();
    }
}
