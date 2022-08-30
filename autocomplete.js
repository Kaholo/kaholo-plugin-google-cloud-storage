const GoogleCloudStorageClient = require("@google-cloud/storage");
const _ = require("lodash");

function createAutocompleteFunction(fetchItems, { valuePath, idPath = "" }) {
  return async (query, params) => {
    const { projectId } = params;
    const credentials = JSON.parse(params.credentials);

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
    (storageClient, params) => (
      storageClient
        .bucket(params.bucketName)
        .getFiles()
        .then(([files]) => files)
    ),
    { valuePath: "name" },
  ),
};