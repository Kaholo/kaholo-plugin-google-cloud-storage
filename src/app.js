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

function bucketOperations(action) {
    return new Promise((resolve, reject) => {
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
                return bucket.create(metadata);
            case 'DELETE_BUCKET':
                return bucket.delete();
            case 'UPLOAD_FILE':
                return bucket.upload(action.params.FILE_PATH);
            default:
                throw new Error("Unknown method");
        }

    });
}


function main(argv) {
    if (argv.length < 3) {
        console.log('{err: "not enough parameters"}');
        // Invalid Argument
        // Either an unknown option was specified, or an option requiring a value was provided without a value.
        process.exit(9);
    }
    const action = JSON.parse(argv[2]);
    bucketOperations(action).then((res) => {
        console.log(res);
        process.exit(0); // Success
    }).catch((err) => {
        console.log("an error occured", err);
        // Uncaught Fatal Exception
        // There was an uncaught exception, and it was not handled by a domain or an 'uncaughtException' event handler.
        process.exit(1); // Failure
    });
}

main(process.argv);