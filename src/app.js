const Storage = require('@google-cloud/storage');


function authenticate(projectId, credentials) {
    try {
        credentials = JSON.parse(credentials)
    } catch (e) {
        throw new Error("Bad credentials");
    }
    return new Storage({
        projectId,
        credentials
    });
}

async function bucketOperations(action) {
        const s = authenticate(action.params.PROJECT, action.params.CREDENTIALS);

        let name = action.params.NAME;
        let bucket = s.bucket(name);

        
        switch (action.method.name) {
            case 'CREATE_BUCKET':
                let metadata = {};
                if (action.params.LOCATION) {
                    metadata['location'] = action.params.LOCATION;
                }
                if (action.params.CLASS) {
                    metadata[action.params.CLASS] = true;
                }
                return await s.createBucket(name, metadata)

            case 'DELETE_BUCKET':
                return await s.bucket(name).delete()

            case 'UPLOAD_FILE':
                return await bucket.upload(action.params.FILE_PATH);
            default:
                throw new Error("Unknown method");
        }

}

module.exports = {
    CREATE_BUCKET : bucketOperations,
    DELETE_BUCKET : bucketOperations,
    UPLOAD_FILE : bucketOperations
}