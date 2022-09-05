const { stat } = require("fs/promises");
const { basename, join } = require("path");
const GoogleCloudStorageClient = require("@google-cloud/storage");
const kaholoPluginLibrary = require("@kaholo/plugin-library");

const {
  listBuckets: listBucketsAuto,
  listFiles: listFilesAuto,
} = require("./autocomplete");
const {
  assertPathExistence,
  listDirectoryRecursively,
} = require("./fs-helpers");

async function createBucket(params) {
  const {
    projectId,
    credentials,
    bucketName,
    classInfo,
    location,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  const metadata = {};
  if (classInfo) {
    metadata[classInfo] = classInfo;
  }
  if (location) {
    metadata.location = location;
  }

  return storageClient.createBucket(bucketName, metadata);
}

async function deleteBucket(params) {
  const {
    projectId,
    credentials,
    bucketName,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient.bucket(bucketName).delete();
}

async function upload(params) {
  const {
    projectId,
    credentials,
    bucketName,
    sourcePath,
    destinationPath,
  } = params;

  await assertPathExistence(sourcePath);
  const pathStat = await stat(sourcePath);

  if (!pathStat.isFile() && !pathStat.isDirectory()) {
    throw new Error("Unsupported path type! Path must point to a file or a directory.");
  }

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  if (pathStat.isDirectory()) {
    const directoryFiles = await listDirectoryRecursively(sourcePath);
    const baseName = destinationPath ?? basename(sourcePath);
    const filesToUpload = directoryFiles.map((fileName) => ({
      source: join(sourcePath, fileName),
      destination: join(baseName, fileName),
    }));

    return Promise.all(filesToUpload.map(({ source, destination }) => (
      storageClient
        .bucket(bucketName)
        .upload(source, { destination })
    )));
  }

  return storageClient
    .bucket(bucketName)
    .upload(sourcePath, {
      destination: destinationPath,
    });
}

function deleteFile(params) {
  const {
    projectId,
    credentials,
    bucketName,
    fileName,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient
    .bucket(bucketName)
    .deleteFiles({ prefix: fileName });
}

function listBuckets(params) {
  const {
    projectId,
    credentials,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient.getBuckets();
}

module.exports = kaholoPluginLibrary.bootstrap({
  createBucket,
  deleteBucket,
  upload,
  deleteFile,
  listBuckets,
}, {
  listFilesAuto,
  listBucketsAuto,
});
