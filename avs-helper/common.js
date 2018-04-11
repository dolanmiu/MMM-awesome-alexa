"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function prompt(question) {
    return new Promise((resolve, reject) => {
        const stdin = process.stdin;
        const stdout = process.stdout;
        stdin.resume();
        stdout.write(question + " ");
        stdin.once("data", data => {
            resolve(data.toString().trim());
        });
    });
}
exports.prompt = prompt;
