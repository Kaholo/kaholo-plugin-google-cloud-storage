const { dirname } = require("path");
const GoogleCloudStorageClient = require("@google-cloud/storage");
const _ = require("lodash");

const {
  walkThroughParentDirectories,
  parseCredentials,
} = require("./helpers");

function createAutocompleteFunction(fetchItems, { valuePath, idPath = "" }) {
  return async (query, params) => {
    const { projectId } = params;

    const credentials = parseCredentials(params.credentials);
    const storageClient = new GoogleCloudStorageClient({ projectId, credentials });
    const items = await fetchItems(storageClient, params);

    const mappedItems = items.map((item) => ({
      value: _.get(item, valuePath),
      id: idPath ? _.get(item, idPath) : _.get(item, valuePath),
    }));

    const lowerCaseQuery = query.toLowerCase();

    if (!query) {
      return mappedItems;
    }

    const filteredItems = mappedItems.filter((item) => (
      item.value.toLowerCase().includes(lowerCaseQuery)
      || item.id.toLowerCase().includes(lowerCaseQuery)
    ));

    return filteredItems;
  };
}

module.exports = {
  listBuckets: createAutocompleteFunction(
    (storageClient) => (
      storageClient
        .getBuckets()
        .then(([buckets]) => buckets)
    ),
    { valuePath: "name" },
  ),
  listFiles: createAutocompleteFunction(
    async (storageClient, params) => {
      const directories = new Set();
      const files = await storageClient
        .bucket(params.bucketName)
        .getFiles()
        .then(([result]) => result);

      files.forEach(({ name: fileName }) => {
        if (fileName.endsWith("/")) {
          return;
        }

        const parentDir = dirname(fileName);
        if (!directories.has(parentDir)) {
          walkThroughParentDirectories(parentDir).forEach(
            (path) => directories.add(path),
          );
        }
      });

      const directoryEntries = [...directories].map((directoryPath) => ({
        name: directoryPath,
      }));
      return [...files, ...directoryEntries];
    },
    { valuePath: "name" },
  ),
};
