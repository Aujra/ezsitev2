import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function deleteImageFromS3(imageUrl: string) {
  try {
    // Extract key from URL
    // URL format: https://bucket-name.s3.region.amazonaws.com/product-images/filename
    const urlParts = imageUrl.split('/');
    const key = `product-images/${urlParts[urlParts.length - 1]}`;

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    return false;
  }
}
