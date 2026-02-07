using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace AutoShip.Services
{
    public class BlobStorageService
    {
        private readonly BlobContainerClient _container;

        public BlobStorageService(IConfiguration config)
        {
            var connectionString = config["AzureBlobStorage:ConnectionString"];
            var containerName = config["AzureBlobStorage:ContainerName"] ?? "uploads";

            _container = new BlobContainerClient(connectionString, containerName);
        }

        public async Task<string> UploadAsync(IFormFile file, string carVin)
        {
            var blobName = $"{carVin}/{Guid.NewGuid()}_{file.FileName}";
            var blobClient = _container.GetBlobClient(blobName);

            await blobClient.UploadAsync(
                file.OpenReadStream(),
                new BlobHttpHeaders { ContentType = file.ContentType }
            );

            return blobClient.Uri.ToString();
        }
    }
}
