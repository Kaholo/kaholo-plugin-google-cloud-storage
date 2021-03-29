# kaholo-plugin-google-cloud-services
Google Cloud Storage plugin for Kaholo.

## Method: Create New Bucket
Create a new bucket on the cloud.

### Parameters:
1. Project ID (string) **Required** - The ID of the project to create the bucket in.
2. Name (string) **Required** - The name of the bucket to create.
3. Credentials (Vault) **Required** - Google cloud credentials to authenticate with in this specific call to the method.
4. Storage Class (string) **Required** - The type of storage class of the bucket to create.
5. Location (string) **Optional** - The google cloud location to create the bucket in. You can see list of available locations [here](https://cloud.google.com/storage/docs/locations).

## Method: Delete Bucket
Delete the specified bucket from the cloud.

### Parameters:
1. Project ID (string) **Required** - The ID of the project that the bucket is stored in.
2. Name (string) **Required** - The name of the bucket to delete.
3. Credentials (Vault) **Required** - Google cloud credentials to authenticate with in this specific call to the method.

## Method: Upload File
Upload a file to the bucket specified.

### Parameters:
1. Project ID (string) **Required** - The ID of the project that the bucket is stored in.
2. Name (string) **Required** - The name of the bucket to upload to.
3. Credentials (Vault) **Required** - Google cloud credentials to authenticate with in this specific call to the method.
4. File Path (string) **Required** - The path to the file to upload to the bucket.