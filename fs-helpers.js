const { join } = require("path");
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

module.exports = {
  assertPathExistence,
  listDirectoryRecursively,
};
