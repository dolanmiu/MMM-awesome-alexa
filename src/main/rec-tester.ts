import { spawn } from "child_process";

export class RecTester {

    public test(): void {
        console.log("testing rec");
        const cmd = spawn("bash", ["test-rec.sh"]);
        cmd.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }
}
