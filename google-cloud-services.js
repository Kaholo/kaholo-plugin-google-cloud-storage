const Storage = require("@google-cloud/storage");

module.exports = class GoogleCloudStorage {
  constructor(projectId, credentials) {
    this.authCreds = {
      projectId,
      credentials,
    };
  }

  static from({ projectId, credentials }) {
    return new GoogleCloudStorage(projectId, credentials);
  }

  static getStorageAccess(creds) {
    return new Storage(creds);
  }

  createBucket({ bucketname, metadata }) {
    const storage = GoogleCloudStorage.getStorageAccess(this.authCreds);
    return storage.createBucket(bucketname, metadata);
  }

  deleteBucket({ bucketname }) {
    const storage = GoogleCloudStorage.getStorageAccess(this.authCreds);
    return storage.bucket(bucketname).delete();
  }

  uploadFile({ bucketname, filePath }) {
    const storage = GoogleCloudStorage.getStorageAccess(this.authCreds);
    return storage.bucket(bucketname).upload(filePath);
  }

  deleteFile({ bucketname, fileName }) {
    const storage = GoogleCloudStorage.getStorageAccess(this.authCreds);
    return storage.bucket(bucketname).file(fileName).delete();
  }

  createFolder({
    bucketname, folderName, filePath, fileName,
  }) {
    const storage = GoogleCloudStorage.getStorageAccess(this.authCreds);
    return storage.bucket(bucketname).upload(filePath, {
      destination: `${folderName}/${fileName}`,
    });
  }

  async listBuckets() {
    const storage = GoogleCloudStorage.getStorageAccess(this.authCreds);
    const [buckets] = await storage.getBuckets();
    return buckets;
  }

  async listFiles({ bucketname }) {
    const storage = GoogleCloudStorage.getStorageAccess(this.authCreds);
    const [files] = await storage.bucket(bucketname).getFiles();
    return files;
  }
};
