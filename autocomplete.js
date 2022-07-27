const GoogleCloudStorageClient = require("@google-cloud/storage");
const _ = require("lodash");

function createAutocompleteFunction(fetchItems, [valuePath, idPath = ""]) {
  return async (query, params) => {
    const {
      PROJECT: projectId,
      CREDENTIALS: credentials,
    } = params;

    const storageClient = new GoogleCloudStorageClient({ projectId, credentials });
    const items = await fetchItems(storageClient, params);

    const mappedItems = items.map((item) => ({
      value: _.get(item, valuePath),
      id: idPath ? _.get(item, idPath) : _.get(item, valuePath),
    }));

    const lowerCaseQuery = query.toLowerCase();
    const filteredItems = mappedItems.filter((item) => (
      !query
      || item.value.toLowerCase().includes(lowerCaseQuery)
      || item.query.toLowerCase().includes(lowerCaseQuery)
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
    ["name"],
  ),
  listFiles: createAutocompleteFunction(
    (storageClient, params) => (
      storageClient
        .bucket(params.NAME)
        .getFiles()
        .then(([files]) => files)
    ),
    ["name"],
  ),
};
