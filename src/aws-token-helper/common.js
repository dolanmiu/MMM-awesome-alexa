"use strict";
exports.__esModule = true;
function prompt(question) {
    return new Promise(function (resolve, reject) {
        var stdin = process.stdin;
        var stdout = process.stdout;
        stdin.resume();
        stdout.write(question + " ");
        stdin.once("data", function (data) {
            resolve(data.toString().trim());
        });
    });
}
exports.prompt = prompt;
