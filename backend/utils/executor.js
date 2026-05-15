import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const executeCode = async (code, language, input = "") => {
    const id = uuidv4();
    const folderPath = path.join(process.cwd(), "temp", id);
    await fs.mkdir(folderPath, { recursive: true });

    let fileName, dockerImage, runCommand;

    switch (language) {
        case "python":
            fileName = "solution.py";
            dockerImage = "python:3.9-slim";
            runCommand = `python3 ${fileName}`;
            break;
        case "cpp":
            fileName = "solution.cpp";
            dockerImage = "gcc:latest";
            runCommand = `g++ ${fileName} -o solution && ./solution`;
            break;
        case "java":
            fileName = "Main.java";
            dockerImage = "eclipse-temurin:17-jdk-focal";
            runCommand = `javac ${fileName} && java Main`;
            break;
        default:
            await fs.rm(folderPath, { recursive: true, force: true });
            throw new Error("Unsupported language");
    }

    await fs.writeFile(path.join(folderPath, fileName), code);
    await fs.writeFile(path.join(folderPath, "input.txt"), input || "");

    const absolutePath = path.resolve(folderPath)
        .replace(/\\/g, '/')
        .replace(/^([A-Z]):/i, (match, p1) => `/${p1.toLowerCase()}`);

    const dockerCmd = `docker run --rm \
        --network none \
        --memory "128m" \
        --cpus "0.5" \
        -v "${absolutePath}:/app" \
        -w /app \
        ${dockerImage} \
        sh -c "${runCommand} < input.txt"`;

    return new Promise((resolve) => {
        exec(dockerCmd, { timeout: 5000 }, async (error, stdout, stderr) => {
            try {
                await fs.rm(folderPath, { recursive: true, force: true });
            } catch (cleanupError) {
                console.error("Cleanup error:", cleanupError);
            }

            if (error) {
                if (error.killed) {
                    resolve({ status: "Time Limit Exceeded" });
                } else {
                    resolve({ status: "Runtime Error", error: stderr || error.message });
                }
            } else {
                resolve({ status: "Success", output: stdout.trim() });
            }
        });
    });
};