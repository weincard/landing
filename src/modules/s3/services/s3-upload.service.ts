import type {
  FileUploadRequest,
  GeneratePresignedUrlsResponse,
  PresignedUrlResponse,
  UploadProgress,
  UploadResult,
} from "../types/s3.types";

const S3_BUCKET_BASE_URL =
  process.env.NEXT_PUBLIC_S3_BUCKET_URL ||
  "https://weincard-s3-bucket.s3.amazonaws.com";

/**
 * Generates presigned URLs for file uploads
 * @param files - Array of files to upload
 * @param token - Authentication token
 * @param apiUrl - API endpoint for generating presigned URLs
 * @returns Promise with presigned URLs
 */
export async function generatePresignedUrls(
  files: File[],
  token: string,
  apiUrl: string
): Promise<GeneratePresignedUrlsResponse> {
  const fileRequests: FileUploadRequest[] = files.map((file) => ({
    fileName: file.name,
    type: file.type,
  }));

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ files: fileRequests }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to generate presigned URLs" }));
    throw new Error(error.message || "Failed to generate presigned URLs");
  }

  return response.json();
}

/**
 * Uploads a single file to S3 using a presigned URL
 * @param file - File to upload
 * @param presignedUrl - Presigned URL for upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with upload result
 */
export async function uploadFileToS3(
  file: File,
  presignedUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

/**
 * Uploads multiple files to S3 with progress tracking
 * @param files - Array of files to upload
 * @param presignedUrls - Array of presigned URLs
 * @param onProgressUpdate - Callback for progress updates
 * @returns Promise with array of upload results
 */
export async function uploadFilesToS3(
  files: File[],
  presignedUrls: PresignedUrlResponse[],
  onProgressUpdate?: (progress: UploadProgress[]) => void
): Promise<UploadResult[]> {
  const progressMap = new Map<string, UploadProgress>();

  // Initialize progress tracking
  files.forEach((file) => {
    progressMap.set(file.name, {
      fileName: file.name,
      progress: 0,
      status: "pending",
    });
  });

  const notifyProgress = () => {
    if (onProgressUpdate) {
      onProgressUpdate(Array.from(progressMap.values()));
    }
  };

  // Upload all files in parallel
  const uploadPromises = files.map(
    async (file, index): Promise<UploadResult> => {
      const presignedUrl = presignedUrls.find(
        (url) => url.fileName === file.name
      );

      if (!presignedUrl) {
        const error = `No presigned URL found for ${file.name}`;
        progressMap.set(file.name, {
          fileName: file.name,
          progress: 0,
          status: "error",
          error,
        });
        notifyProgress();
        return {
          fileName: file.name,
          publicUrl: "",
          success: false,
          error,
        };
      }

      try {
        // Update status to uploading
        progressMap.set(file.name, {
          fileName: file.name,
          progress: 0,
          status: "uploading",
        });
        notifyProgress();

        // Upload file
        await uploadFileToS3(file, presignedUrl.url, (progress) => {
          progressMap.set(file.name, {
            fileName: file.name,
            progress,
            status: "uploading",
          });
          notifyProgress();
        });

        // Extract public URL from presigned URL (remove query parameters)
        const publicUrl = presignedUrl.url.split("?")[0];

        // Update status to completed
        progressMap.set(file.name, {
          fileName: file.name,
          progress: 100,
          status: "completed",
        });
        notifyProgress();

        return {
          fileName: file.name,
          publicUrl,
          success: true,
        };
      } catch (error: any) {
        progressMap.set(file.name, {
          fileName: file.name,
          progress: 0,
          status: "error",
          error: error.message,
        });
        notifyProgress();

        return {
          fileName: file.name,
          publicUrl: "",
          success: false,
          error: error.message,
        };
      }
    }
  );

  return Promise.all(uploadPromises);
}

/**
 * Complete workflow: Generate presigned URLs and upload files
 * @param files - Array of files to upload
 * @param token - Authentication token
 * @param apiUrl - API endpoint for generating presigned URLs
 * @param onProgressUpdate - Callback for progress updates
 * @returns Promise with array of upload results
 */
export async function uploadFilesWithPresignedUrls(
  files: File[],
  token: string,
  apiUrl: string,
  onProgressUpdate?: (progress: UploadProgress[]) => void
): Promise<UploadResult[]> {
  if (files.length === 0) {
    return [];
  }

  // Step 1: Generate presigned URLs
  const { urls } = await generatePresignedUrls(files, token, apiUrl);

  // Step 2: Upload files to S3
  const results = await uploadFilesToS3(files, urls, onProgressUpdate);

  return results;
}
