# kaholo-plugin-google-cloud-storage
Google Cloud Storage plugin for Kaholo.

# Authentication
This plugin requires **Service Account Credentials** as provided by GCP in order to authenticate to the Google Cloud services.

Once you have created your Google Cloud Service Account, **create and download the Key in JSON format** from the Google Cloud Platform.

The Key must be stored in the Kaholo Vault and can be used within each Method by selecting the corresponding Vault entry from the Credentials field. 
>**Entire JSON file content needs to be added in the Vault.**

You can see more information on how to create service account keys [here](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

## Method: Create New Bucket
Create a new bucket on the cloud.

### Parameters:
1. Project ID (string) **Required** - The ID of the project to create the bucket in.
2. Name (string) **Required** - The name of the bucket to create.
3. Credentials (Vault) **Required** - A Vaulted JSON document containing Google Cloud Service Account credentials as provided by GCP.
4. Storage Class (options) **Required** - The type of storage class of the bucket to create.
5. Location (string) **Optional** - The google cloud location to create the bucket in. You can see list of available locations [here](https://cloud.google.com/storage/docs/locations).

## Method: Delete Bucket
Delete the specified bucket from the cloud.

### Parameters:
1. Project ID (string) **Required** - The ID of the project that the bucket is stored in.
2. Name (string) **Required** - The name of the bucket to delete.
3. Credentials (Vault) **Required** - A Vaulted JSON document containing Google Cloud Service Account credentials as provided by GCP.

## Method: Upload File
Upload a file to the specified bucket.

### Parameters:
1. Project ID (string) **Required** - The ID of the project that the bucket is stored in.
2. Name (string) **Required** - The name of the bucket to upload to.
3. Credentials (Vault) **Required** - A Vaulted JSON document containing Google Cloud Service Account credentials as provided by GCP.
4. File Path (string) **Required** - The path to the file to upload to the bucket.
