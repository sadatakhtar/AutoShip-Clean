using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;


namespace AutoShip.Services
{
    public class BlobStorageService
    {
        private readonly BlobContainerClient _container;
        private readonly string _containerName;

        public BlobStorageService(IConfiguration config)
        {
            var connectionString = config["AzureBlobStorage:ConnectionString"];
            _containerName = config["AzureBlobStorage:ContainerName"] ?? "uploads";

            _container = new BlobContainerClient(connectionString, _containerName);
        }

        public async Task<string> UploadAsync(IFormFile file, string carVin)
        {
            var blobName = $"{carVin}/{Guid.NewGuid()}_{file.FileName}";
            var blobClient = _container.GetBlobClient(blobName);

            await blobClient.UploadAsync(
                file.OpenReadStream(),
                new BlobHttpHeaders { ContentType = file.ContentType }
            );

            return blobName;
        }

        public async Task DeleteFileAsync(string blobName)
        {
            var blobClient = _container.GetBlobClient(blobName);
            await blobClient.DeleteIfExistsAsync();
        }

        // ----------------------------------------------------
        // NEW: Return full public blob URL
        // ----------------------------------------------------
        public string GetBlobUrl(string blobName)
        {
            // Example output:
            // https://youraccount.blob.core.windows.net/uploads/carvin/file.pdf
            return $"{_container.Uri}/{blobName}";
        }

        // ----------------------------------------------------
        // OPTIONAL: Stream file directly (if you want streaming)
        // ----------------------------------------------------
        public async Task<Stream> DownloadAsync(string blobName)
        {
            var blobClient = _container.GetBlobClient(blobName);
            var download = await blobClient.DownloadAsync();
            return download.Value.Content;
        }

       public string GetBlobSasUrl(string blobName, int expiryMinutes = 10)
        {
            var blobClient = _container.GetBlobClient(blobName);

            // Ensure the blob exists
            if (!blobClient.Exists())
                return null;

            var sasBuilder = new BlobSasBuilder
            {   
                BlobContainerName = _containerName,
                BlobName = blobName,
                Resource = "b",
                ExpiresOn = DateTime.UtcNow.AddMinutes(expiryMinutes)
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            var sasUri = blobClient.GenerateSasUri(sasBuilder);

            return sasUri.ToString();
        }


    }
}