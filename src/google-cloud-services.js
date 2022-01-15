const Storage = require('@google-cloud/storage');


module.exports = class GoogleCloudStorage{
    constructor(projectId, credentials){
        this.authCreds = {
            projectId : projectId,
            credentials: credentials
        }
    }

    static from({projectId, credentials}){
        return new GoogleCloudStorage(projectId, credentials)
    }

    getStorageAccess(creds) {
        return new Storage(creds)
    }

    async createBucket({bucketname, metadata}){
        const storage = this.getStorageAccess(this.authCreds)
        return await storage.createBucket(bucketname, metadata)
    }

    async deleteBucket({bucketname}){
        const storage = this.getStorageAccess(this.authCreds)
        return await storage.bucket(bucketname).delete()
    }

    async uploadFile({filePath}){
        const storage = this.getStorageAccess(this.authCreds)
        return await storage.bucket(bucketname).upload(filePath)
    }

    async createFolder({bucketname,folderName}){
        const storage = this.getStorageAccess(this.authCreds)
        return await storage.bucket(bucketname).upload("", {destination: `${folderName}/`})
    }

    async listBuckets({}){
        const storage = this.getStorageAccess(this.authCreds)
        const [buckets]= await storage.getBuckets()
        return buckets
    }

}