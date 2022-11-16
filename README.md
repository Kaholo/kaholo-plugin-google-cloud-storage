# Kaholo Google Cloud Storage Plugin
This plugins extends Kaholo to be able to make use of Google Cloud Storage. Cloud Storage is a service for storing your objects in Google Cloud. An object is an immutable piece of data consisting of a file of any format. You store objects in containers called buckets.

There is a more generally applicable plugin that can also make use of Google Cloud Storage, the [Kaholo GCP CLI Plugin](https://github.com/Kaholo/kaholo-plugin-gcp-cli). If this plugin does not meet your Cloud Storage needs, the GCP CLI Plugin likely will. However to use the GCP CLI Plugin, you must enter the complete GCP CLI command correctly. It is not quite as user friendly as the Cloud Storage Plugin.

## About cloud storage objects
Cloud storage is a large, flat collection of objects (files) without any directory structure that is commonly found in filesystems. However, because it is useful and convenient to have directories and a tree view, cloud storage is often displayed as a tree structure. Consider the following directory in a filesystem:

    sourcedir
    ├── dir-a
    │   ├── file-one
    │   └── file-two
    └── dir-b
        └── file-three

When uploaded into cloud storage this filesystem is flattened into three file objects named as below. The "`/`" character is actually part of each object's name. There are no directories in cloud storage.

    sourcedir/dir-a/file-one
    sourcedir/dir-a/file-two
    sourcedir/dir-b/file-three

This can create some confusion, a few noteworthy examples:
* If you try to delete `sourcedir/dir-a`, you will get an error that this object does not exist.
* If you upload a file with a name such as `sourcedir/dir-a/file-one/`, the result may appear like a root directory (`/`) within directory `file-one`, although `file-one` is still an object (file), not a directory.
* If you delete what seems to be the last file in a directory, the directory will also disappear.
* You can upload files into non-existent paths and the path seems to be automatically created to accommodate the file.
* To delete an object, the full "path" must be used, e.g. `sourcedir/dir-b/file-three`

It is important to be aware of this, otherwise one is likely to be surprised, make mistakes, and conclude there are defects in Kaholo, GCP, or both.

## Access and Authentication
The Google Cloud Storage plugin uses a set of service account credentials for access and authentication.

When creating keys for a GCP service account, they can be downloaded in either JSON or P12 format. The JSON format is required for Kaholo plugins. Store the entire JSON document in a Kaholo Vault item. The Kaholo Vault allows them to be safely used without exposing the keys in log files, error messages, execution results, or any other output.

When pasting your GCP service account credentials into the Kaholo Vault, be careful to avoid line break issues. These happen when you cut from some text editors that use word wrap and then paste into Kaholo - newline characters get introduced. To avoid this either disable word-wrap or use another product that takes word-wrap into account when cutting/copying. If you have this issue the error when running the plugin looks something like this:

    Error: Couldn't parse provided value as object

The GCP Service Account Credentials are configured within a Kaholo Accounts. The same type of account may be used with many Google Cloud Platform (GCP) related plugins. If other GCP plugins have already been used

## Plugin Settings
Plugin Settings act as default parameter values. If configured in plugin settings, the action parameters come preconfigured upon creation using this default. Action-level parameters may still be configured individually. The plugin setting is provided only as a convenience.

* Default Project ID - this is a text string that is the ID of the GCP project

GCP resources, including Cloud Storage Buckets, are organized into projects. A project restricts the scope of actions and resources to only those that exist within the project. If all or most of your buckets exist within the same GCP project, then it will be very helpful to configure the Default Project ID in Plugin Settings.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Method: Create New Bucket
Create a new bucket on the cloud.

### Parameters:
* Project ID - The ID of the project in which the bucket will be created
* Region - The GCP geographical location in which to create the bucket. You can see list of available locations [here](https://cloud.google.com/storage/docs/locations).
* Bucket Name - The name of the bucket to create
* Storage Class - The type of storage class of the bucket to create
* Access Control - The type of access control for permissions of the bucket

## Method: Delete Bucket
Delete the specified bucket from the cloud.

### Parameters
* Project ID - The ID of the project to which the bucket belongs
* Bucket Name - The name of the bucket to delete

## Method: Upload
Upload a file or directory (recursively) to the specified bucket. If a directory is specified as the Source Path, the contents will be uploaded recursively.

### Parameters
* Project ID - The ID of the project to which the bucket belongs
* Bucket Name - The name of the bucket to which to upload
* Source Path - Path, relative or absolute, to the file or directory on the Kaholo Agent to be uploaded
* Destination Path - Destination path in the bucket, including the object's name if it is a single file

## Method: Delete Object(s)
Deletes a specific cloud storage object, selected using autocomplete. Using code layer, all objects that <em>begin with</em> the specified string are deleted. This may be used to delete many objects at once or to "recursively" delete objects that appear to be directories. To use the code layer, toggle the code switch on, and enter a string using single quotes and no wild card characters.

### Parameters
* Project ID - The ID of the project to which the bucket belongs
* Bucket Name - The name of the bucket containing the object to be deleted
* Object(s) Name - The name of the object to delete

## Method: List Buckets
List all buckets in the specified project

### Parameters
* Project ID - The ID of the project
