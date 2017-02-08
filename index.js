const record = require('node-record-lpcm16');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;
const avs = new AVS({
    debug: true,
    clientId: 'amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e',
    deviceId: 'magic_mirror_alexa',
    deviceSerialNumber: 123,
    redirectUri: `https://${window.location.host}/authresponse`
});

const models = new Models();

models.add({
    file: 'resources/snowboy.umdl',
    sensitivity: '0.5',
    hotwords: 'snowboy'
});

const detector = new Detector({
    resource: "resources/common.res",
    models: models,
    audioGain: 2.0
});

detector.on('silence', function () {
    console.log('silence');
});

detector.on('sound', function () {
    console.log('sound');
});

detector.on('error', function () {
    console.log('error');
});

detector.on('hotword', function (index, hotword) {
    console.log('hotword', index, hotword);
});

const mic = record.start({
    threshold: 0,
    verbose: true
});

mic.pipe(detector);