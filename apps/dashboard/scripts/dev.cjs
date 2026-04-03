const { spawn } = require("child_process");

process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = "1";

const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "dev", "--port", "3001"],
  {
    stdio: "inherit",
    env: process.env,
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
