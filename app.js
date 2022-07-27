const GoogleCloudStorageClient = require("@google-cloud/storage");
const kaholoPluginLibrary = require("@kaholo/plugin-library");

const autocomplete = require("./autocomplete");

async function createBucket(params) {
  const {
    PROJECT: projectId,
    CREDENTIALS: credentials,
    NAME: bucketName,
    CLASS: classInfo,
    LOCATION: location,
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
    PROJECT: projectId,
    CREDENTIALS: credentials,
    NAME: bucketName,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient.bucket(bucketName).delete();
}

function uploadFile(params) {
  const {
    PROJECT: projectId,
    CREDENTIALS: credentials,
    NAME: bucketName,
    FILE_PATH: filePath,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient
    .bucket(bucketName)
    .upload(filePath);
}

function deleteFile(params) {
  const {
    PROJECT: projectId,
    CREDENTIALS: credentials,
    NAME: bucketName,
    FILE_NAME: fileName,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient
    .bucket(bucketName)
    .file(fileName)
    .delete();
}

function createFolder(params) {
  const {
    PROJECT: projectId,
    CREDENTIALS: credentials,
    NAME: bucketName,
    FOLDER_NAME: folderName,
    FILE_PATH: filePath,
    FILE_NAME: fileName,
  } = params;

  const storageClient = new GoogleCloudStorageClient({ projectId, credentials });

  return storageClient
    .bucket(bucketName)
    .upload(filePath, {
      destination: `${folderName}/${fileName}`,
    });
}

module.exports = kaholoPluginLibrary.bootstrap({
  CREATE_BUCKET: createBucket,
  DELETE_BUCKET: deleteBucket,
  UPLOAD_FILE: uploadFile,
  DELETE_FILE: deleteFile,
  CREATE_FOLDER: createFolder,
}, autocomplete);
