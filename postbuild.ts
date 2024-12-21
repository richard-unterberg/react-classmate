import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @todo: this is bad
let content = fs.readFileSync(path.resolve(__dirname, "dist/index.d.ts"), "utf-8");
content = content.replace(/declare const _default:/, "declare const rc:");
content = content.replace(
  /export { type RcBaseComponent, _default as default };/,
  "export { type RcBaseComponent }; export default rc;",
);

// todo: this is a workaround for a issue in rollup-plugin-dts which export default being renamed to _default
fs.writeFileSync(path.resolve(__dirname, "dist/index.d.ts"), content, "utf-8");
console.log("Patched index.d.ts to replace _default with rc.");

// Remove the types folder
fs.rmSync(path.resolve(__dirname, "dist/types"), { recursive: true, force: true });
console.log("Removed dist/types folder.");

// Paths
const outputDir = path.resolve(__dirname, ".localPack");

function cleanLocalPack() {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });
}
function packAndExtract() {
  try {
    console.log("Creating npm package...");
    const packResult = execSync("npm pack", { stdio: "pipe" }).toString().trim();
    const tarballName = path.basename(packResult);
    const tarballPath = path.resolve(__dirname, tarballName);

    console.log(`Extracting ${tarballName} to ${outputDir}...`);
    execSync(`tar -xzf ${tarballPath} -C ${outputDir}`);

    // Remove the tarball
    fs.unlinkSync(tarballPath);

    // Move contents of "package" folder up one level
    const packageDir = path.resolve(outputDir, "package");
    if (fs.existsSync(packageDir)) {
      const files = fs.readdirSync(packageDir);
      files.forEach((file) => {
        const fromPath = path.join(packageDir, file);
        const toPath = path.join(outputDir, file);
        fs.renameSync(fromPath, toPath); // Move each file/folder to the parent directory
      });
      fs.rmdirSync(packageDir); // Remove the now-empty "package" folder
    }

    console.log(`Package extracted to ${outputDir}`);
  } catch (error) {
    console.error("Error during packing:", error);
    process.exit(1);
  }
}

// Main script
cleanLocalPack();
packAndExtract();
