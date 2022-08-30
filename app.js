const GoogleCloudStorageClient = require("@google-cloud/storage");
const kaholoPluginLibrary = require("@kaholo/plugin-library");

const {
  listBuckets: listBucketsAuto,
  listFiles: listFilesAuto,
} = require("./autocomplete");

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

function uploadFile(params) {
  const {
    projectId,
    credentials,
    bucketName,
    filePath,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient
    .bucket(bucketName)
    .upload(filePath);
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

function createFolder(params) {
  const {
    projectId,
    credentials,
    bucketName,
    folderName,
    filePath,
    fileName,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient
    .bucket(bucketName)
    .upload(filePath, {
      destination: `${folderName}/${fileName}`,
    });
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
  uploadFile,
  deleteFile,
  createFolder,
  listBuckets,
}, {
  listFilesAuto,
  listBucketsAuto,
});
