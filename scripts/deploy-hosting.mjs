import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const firebaseRcPath = path.join(rootDir, ".firebaserc");
const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, "utf8"));
const projectId = firebaseRc?.projects?.default;

if (!projectId) {
  console.error("Project Firebase default tidak ditemukan di .firebaserc.");
  process.exit(1);
}

const rawArgs = process.argv.slice(2);
const mode = rawArgs.includes("--live") ? "live" : "preview";
const openAfterDeploy = rawArgs.includes("--open");
const skipBuild = rawArgs.includes("--skip-build");
const channel = readOption(rawArgs, "--channel") ?? "presentasi";
const expires = readOption(rawArgs, "--expires") ?? "7d";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

if (!skipBuild) {
  runCommand(npmCommand, ["run", "build"], {
    description: "Build production",
    inheritOutput: true,
  });
}

const firebaseArgs = [
  "--yes",
  "firebase-tools",
];

if (mode === "live") {
  firebaseArgs.push("deploy", "--only", "hosting", "--project", projectId);
} else {
  firebaseArgs.push(
    "hosting:channel:deploy",
    channel,
    "--expires",
    expires,
    "--project",
    projectId,
    "--json",
  );
}

if (openAfterDeploy) {
  firebaseArgs.push("--open");
}

const deployResult = runCommand(npxCommand, firebaseArgs, {
  description: mode === "live" ? "Deploy live Hosting" : "Deploy preview Hosting",
  inheritOutput: false,
});

process.stdout.write(deployResult.stdout);
process.stderr.write(deployResult.stderr);

const cleanedOutput = stripAnsi(`${deployResult.stdout}\n${deployResult.stderr}`);

if (deployResult.status !== 0) {
  if (deployResult.stderr.includes("firebase login")) {
    console.error("\nLogin dulu dengan: npm run hosting:login");
  }
  process.exit(deployResult.status ?? 1);
}

const url =
  extractJsonUrl(cleanedOutput) ??
  extractLabeledUrl(cleanedOutput, "Channel URL") ??
  extractLabeledUrl(cleanedOutput, "Hosting URL") ??
  extractFirstUrl(cleanedOutput);
console.log("");
if (mode === "live") {
  console.log("Deploy live berhasil.");
} else {
  console.log(`Deploy preview channel '${channel}' berhasil.`);
}
if (url) {
  console.log(`URL: ${url}`);
}

function readOption(args, key) {
  const index = args.indexOf(key);
  if (index === -1) {
    return null;
  }
  return args[index + 1] ?? null;
}

function runCommand(command, args, options) {
  const { description, inheritOutput } = options;
  console.log(`\n==> ${description}`);
  console.log(`${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: inheritOutput ? "inherit" : "pipe",
    encoding: "utf8",
  });

  if (inheritOutput) {
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
    return { stdout: "", stderr: "", status: result.status ?? 0 };
  }

  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    status: result.status ?? 0,
  };
}

function extractFirstUrl(output) {
  const match = output.match(/https:\/\/[^\s]+/);
  return match?.[0] ?? null;
}

function extractLabeledUrl(output, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = output.match(new RegExp(`${escapedLabel}[^\\n]*?(https:\\/\\/[^\\s]+)`));
  return match?.[1] ?? null;
}

function stripAnsi(output) {
  return output.replace(/\u001b\[[0-9;]*m/g, "");
}

function extractJsonUrl(output) {
  try {
    const parsed = JSON.parse(output);
    if (parsed?.status !== "success") {
      return null;
    }

    const result = parsed?.result;
    if (!result || typeof result !== "object") {
      return null;
    }

    for (const value of Object.values(result)) {
      if (value && typeof value === "object" && "url" in value && typeof value.url === "string") {
        return value.url;
      }
    }
  } catch {
    return null;
  }

  return null;
}
