const GoogleCloudStorage = require('./google-cloud-services')
const parsers = require('./parsers')

const CREATE_BUCKET = async(action, settings) => {
    const projectId = parsers.string(action.params.PROJECT) || parsers.string(settings.PROJECT)
    const credentials = parsers.json(action.params.CREDENTIALS) || parsers.json(settings.CREDENTIALS)

    const storageService = GoogleCloudStorage.from({
        projectId : projectId,
        credentials: credentials
    })

    const bucketname = parsers.string(action.params.NAME)
    const classInfo = parsers.string(action.params.CLASS)
    const location = parsers.string(action.params.LOCATION)
    const metadata = {}
    if(classInfo) metadata[classInfo] = classInfo
    if(location) metadata.location = location
    return storageService.createBucket({ bucketname: bucketname, metadata: metadata })
}

const DELETE_BUCKET = async (action, settings)=>{
    const projectId = parsers.string(action.params.PROJECT) || parsers.string(settings.PROJECT)
    const credentials = parsers.json(action.params.CREDENTIALS) || parsers.json(settings.CREDENTIALS)

    const storageService = GoogleCloudStorage.from({
        projectId : projectId,
        credentials: credentials
    })

    const bucketname = parsers.autocomplete(action.params.NAME)
    return storageService.deleteBucket({ bucketname: bucketname })
}

const UPLOAD_FILE = async(action, settings)=>{
    const projectId = parsers.string(action.params.PROJECT) || parsers.string(settings.PROJECT)
    const credentials = parsers.json(action.params.CREDENTIALS) || parsers.json(settings.CREDENTIALS)

    const storageService = GoogleCloudStorage.from({
        projectId : projectId,
        credentials: credentials
    })

    const bucketname = parsers.autocomplete(action.params.NAME)
    const filePath = parsers.string(action.params.FILE_PATH)
    return storageService.uploadFile({ bucketname: bucketname, filePath: filePath })
}

const DELETE_FILE = async(action, settings)=>{
    const projectId = parsers.string(action.params.PROJECT) || parsers.string(settings.PROJECT)
    const credentials = parsers.json(action.params.CREDENTIALS) || parsers.json(settings.CREDENTIALS)

    const storageService = GoogleCloudStorage.from({
        projectId : projectId,
        credentials: credentials
    })
    const bucketname = parsers.autocomplete(action.params.NAME)
    const fileName = parsers.autocomplete(action.params.File_NAME)
    return storageService.deleteFile({
        bucketname: bucketname,
        fileName: fileName
    })
}

const CREATE_FOLDER = async (action, settings)=>{
    const projectId = parsers.string(action.params.PROJECT) || parsers.string(settings.PROJECT)
    const credentials = parsers.json(action.params.CREDENTIALS) || parsers.json(settings.CREDENTIALS)

    const storageService = GoogleCloudStorage.from({
        projectId : projectId,
        credentials: credentials
    })

    const bucketname = parsers.autocomplete(action.params.NAME)
    const folderName = parsers.string(action.params.FOLDER_NAME)
    const filePath = parsers.string(action.params.FILE_PATH)
    const fileName = parsers.string(action.params.File_NAME)

    return storageService.createFolder({
        bucketname: bucketname,
        folderName: folderName,
        filePath: filePath,
        fileName: fileName
    })
}


module.exports = {
    CREATE_BUCKET,
    DELETE_BUCKET,
    UPLOAD_FILE,
    DELETE_FILE,
    CREATE_FOLDER,
    ...require('./autocomplete')
}