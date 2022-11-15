const { join, dirname } = require("path");
const fs = require("fs");
const { stat, readdir } = require("fs/promises");

async function assertPathExistence(path) {
  try {
    await stat(path, fs.constants.F_OK);
  } catch {
    throw new Error(`Path ${path} does not exist`);
  }
}

async function listDirectoryRecursively(directoryPath) {
  const directoryFiles = await readdir(directoryPath);

  const recursiveDirectoryFiles = await Promise.all(directoryFiles.map(async (fileName) => {
    const filePath = join(directoryPath, fileName);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      const recursiveFiles = await listDirectoryRecursively(filePath, fileName);
      return recursiveFiles.map((recursiveFileName) => join(fileName, recursiveFileName));
    }

    return fileName;
  }));

  return recursiveDirectoryFiles.flat();
}

function walkThroughParentDirectories(path) {
  const directoryPath = dirname(path);
  if (directoryPath === "." || directoryPath === "/") {
    return [`${path}/`];
  }

  return [...walkThroughParentDirectories(directoryPath), `${path}/`];
}

function parseCredentials(jsonCredentials) {
  try {
    return JSON.parse(jsonCredentials);
  } catch (e) {
    throw new Error(`The vaulted credentials are not in a valid JSON format. Please sure you are using the JSON version of GCP credentials and that extra newline characters were not inserted during copy/paste. The detailed error message: ${e.message}`);
  }
}

module.exports = {
  assertPathExistence,
  listDirectoryRecursively,
  walkThroughParentDirectories,
  parseCredentials,
};
