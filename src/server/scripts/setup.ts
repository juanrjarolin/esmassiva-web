import { minioClient } from "~/server/minio";

async function setup() {
  try {
    console.log("Starting setup...");
    
    // Create MinIO buckets if they don't exist
    const buckets = [
      'career-applications', // For CV uploads
      'company-assets',      // For company documents and assets
    ];

    for (const bucketName of buckets) {
      const bucketExists = await minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await minioClient.makeBucket(bucketName);
        console.log(`Created MinIO bucket: ${bucketName}`);
      } else {
        console.log(`MinIO bucket already exists: ${bucketName}`);
      }
    }

    // TODO: Add any database seeding logic here if needed
    // TODO: Add any other initialization logic here

    console.log("Setup completed successfully!");
  } catch (error) {
    console.error("Setup failed:", error);
    throw error;
  }
}

setup()
  .then(() => {
    console.log("setup.ts complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
