using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

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
    }
}