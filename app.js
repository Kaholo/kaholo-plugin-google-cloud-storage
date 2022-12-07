const { stat } = require("fs/promises");
const { basename, join } = require("path");
const GoogleCloudStorageClient = require("@google-cloud/storage");
const kaholoPluginLibrary = require("@kaholo/plugin-library");

const {
  assertPathExistence,
  listDirectoryRecursively,
  parseCredentials,
} = require("./helpers");
const {
  listBuckets: listBucketsAuto,
  listFiles: listFilesAuto,
} = require("./autocomplete");

async function createBucket(params) {
  const {
    projectId,
    credentials: rawCredentials,
    bucketName,
    classInfo,
    location,
    accessControl,
  } = params;

  const credentials = parseCredentials(rawCredentials);
  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  const metadata = {};
  if (classInfo) {
    metadata[classInfo.toLowerCase()] = true;
  }
  if (location) {
    metadata.location = location;
  }

  const [bucket] = await storageClient.createBucket(bucketName, metadata);

  if (accessControl === "uniform") {
    await storageClient.bucket(bucketName).setMetadata({
      iamConfiguration: {
        uniformBucketLevelAccess: {
          enabled: true,
        },
      },
    });
  }

  return bucket;
}

async function deleteBucket(params) {
  const {
    projectId,
    credentials: rawCredentials,
    bucketName,
  } = params;

  const credentials = parseCredentials(rawCredentials);
  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient.bucket(bucketName).delete();
}

async function upload(params) {
  const {
    projectId,
    credentials: rawCredentials,
    bucketName,
    sourcePath,
    destinationPath,
  } = params;

  const credentials = parseCredentials(rawCredentials);

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
        .then(([uploadResponse]) => uploadResponse)
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
    credentials: rawCredentials,
    bucketName,
    fileName,
  } = params;

  const credentials = parseCredentials(rawCredentials);
  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient
    .bucket(bucketName)
    .deleteFiles({ prefix: fileName });
}

async function listBuckets(params) {
  const {
    projectId,
    credentials: rawCredentials,
  } = params;

  const credentials = parseCredentials(rawCredentials);
  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  const [bucketsList] = await storageClient.getBuckets();
  return bucketsList;
}

module.exports = kaholoPluginLibrary.bootstrap({
  createBucket,
  deleteBucket,
  upload,
  deleteFile,
  listBuckets,
}, {
  listBucketsAuto,
  listFilesAuto,
});
