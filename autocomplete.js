const GoogleCloudStorageClient = require("@google-cloud/storage");
const _ = require("lodash");

function createAutocompleteFunction(fetchItems, { valuePath, idPath = "" }) {
  return async (query, params) => {
    const {
      projectId,
      credentials,
    } = params;

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
  listBucketsAuto: createAutocompleteFunction(
    (storageClient) => (
      storageClient
        .getBuckets()
        .then(([buckets]) => buckets)
    ),
    { valuePath: "name" },
  ),
  listFilesAuto: createAutocompleteFunction(
    (storageClient, params) => (
      storageClient
        .bucket(params.NAME)
        .getFiles()
        .then(([files]) => files)
    ),
    { valuePath: "name" },
  ),
};
