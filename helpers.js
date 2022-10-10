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

module.exports = {
  assertPathExistence,
  listDirectoryRecursively,
  walkThroughParentDirectories,
};
