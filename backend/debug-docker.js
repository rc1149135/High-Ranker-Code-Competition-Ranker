import { exec } from "child_process";
// Test a simple hello world in python via docker
exec("docker run --rm python:3.9-slim echo 'Docker is working'", (err, stdout, stderr) => {
    if (err) console.error("❌ Docker Error:", err.message);
    else console.log("✅ Success:", stdout);
});