"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class RecTester {
    test() {
        console.log("testing rec");
        const cmd = child_process_1.spawn("bash", ["test-rec.sh"]);
        cmd.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }
}
exports.RecTester = RecTester;
