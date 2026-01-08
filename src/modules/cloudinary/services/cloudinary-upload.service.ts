import type {
  CloudinaryUploadProgress,
  CloudinaryUploadResult,
  CloudinaryUploadOptions,
  CloudinaryResponse,
} from "../types/cloudinary.types";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

/**
 * Upload preset name for unsigned uploads.
 *
 * IMPORTANT: You need to create this upload preset in your Cloudinary dashboard:
 * 1. Go to Settings > Upload > Upload presets
 * 2. Click "Add upload preset"
 * 3. Set "Signing Mode" to "Unsigned"
 * 4. Name it "weincard_unsigned"
 * 5. Configure any default transformations if needed
 */
const CLOUDINARY_UPLOAD_PRESET = "weincard_unsigned";

/**
 * Gets the Cloudinary upload URL
 */
function getCloudinaryUploadUrl(resourceType: string = "image"): string {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
}

/**
 * Builds transformation string for Cloudinary
 */
function buildTransformation(options: CloudinaryUploadOptions): string {
  const transformations: string[] = [];

  // Quality - let Cloudinary handle compression
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  } else {
    // Default: auto quality for best compression
    transformations.push("q_auto:good");
  }

  // Format - auto for best browser support
  if (options.format) {
    transformations.push(`f_${options.format}`);
  } else {
    // Default: auto format (webp, avif based on browser support)
    transformations.push("f_auto");
  }

  // Resize if max dimensions specified
  if (options.maxWidth || options.maxHeight) {
    const width = options.maxWidth ? `w_${options.maxWidth}` : "";
    const height = options.maxHeight ? `h_${options.maxHeight}` : "";
    const dimensions = [width, height].filter(Boolean).join(",");
    if (dimensions) {
      transformations.push(`c_limit,${dimensions}`);
    }
  }

  return transformations.join("/");
}

/**
 * Uploads a single file to Cloudinary with unsigned upload
 * @param file - File to upload
 * @param options - Upload options
 * @param onProgress - Progress callback
 * @returns Upload result
 */
export async function uploadFileToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {},
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    // Add file
    formData.append("file", file);

    // Add upload preset (required for unsigned uploads)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // Add API key
    if (CLOUDINARY_API_KEY) {
      formData.append("api_key", CLOUDINARY_API_KEY);
    }

    // Add folder if specified
    if (options.folder) {
      formData.append("folder", options.folder);
    }

    // For unsigned uploads, we can't use "eager" transformations
    // We'll apply transformations to the URL after upload instead

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response: CloudinaryResponse = JSON.parse(xhr.responseText);

          // Build optimized URL with transformations applied on-demand
          const transformation = buildTransformation(options);
          const baseUrl = response.secure_url;
          const optimizedUrl = transformation
            ? baseUrl.replace("/upload/", `/upload/${transformation}/`)
            : baseUrl;

          resolve({
            fileName: file.name,
            publicUrl: response.url,
            secureUrl: optimizedUrl, // Use optimized URL
            success: true,
            publicId: response.public_id,
            format: response.format,
            width: response.width,
            height: response.height,
            bytes: response.bytes,
          });
        } catch (error) {
          resolve({
            fileName: file.name,
            publicUrl: "",
            secureUrl: "",
            success: false,
            error: "Failed to parse Cloudinary response",
          });
        }
      } else {
        let errorMessage = `Upload failed with status ${xhr.status}`;
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          errorMessage = errorResponse.error?.message || errorMessage;
        } catch {
          // Use default error message
        }
        resolve({
          fileName: file.name,
          publicUrl: "",
          secureUrl: "",
          success: false,
          error: errorMessage,
        });
      }
    });

    xhr.addEventListener("error", () => {
      resolve({
        fileName: file.name,
        publicUrl: "",
        secureUrl: "",
        success: false,
        error: "Network error during upload",
      });
    });

    xhr.addEventListener("abort", () => {
      resolve({
        fileName: file.name,
        publicUrl: "",
        secureUrl: "",
        success: false,
        error: "Upload aborted",
      });
    });

    const resourceType = options.resourceType || "image";
    xhr.open("POST", getCloudinaryUploadUrl(resourceType));
    xhr.send(formData);
  });
}

/**
 * Uploads multiple files to Cloudinary with progress tracking
 * @param files - Array of files to upload
 * @param options - Upload options
 * @param onProgressUpdate - Callback for progress updates
 * @returns Array of upload results
 */
export async function uploadFilesToCloudinary(
  files: File[],
  options: CloudinaryUploadOptions = {},
  onProgressUpdate?: (progress: CloudinaryUploadProgress[]) => void
): Promise<CloudinaryUploadResult[]> {
  const progressMap = new Map<string, CloudinaryUploadProgress>();

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

  notifyProgress();

  // Upload all files in parallel
  const uploadPromises = files.map(
    async (file): Promise<CloudinaryUploadResult> => {
      try {
        // Update status to uploading
        progressMap.set(file.name, {
          fileName: file.name,
          progress: 0,
          status: "uploading",
        });
        notifyProgress();

        const result = await uploadFileToCloudinary(
          file,
          options,
          (progress) => {
            progressMap.set(file.name, {
              fileName: file.name,
              progress,
              status: "uploading",
            });
            notifyProgress();
          }
        );

        if (result.success) {
          progressMap.set(file.name, {
            fileName: file.name,
            progress: 100,
            status: "completed",
          });
        } else {
          progressMap.set(file.name, {
            fileName: file.name,
            progress: 0,
            status: "error",
            error: result.error,
          });
        }
        notifyProgress();

        return result;
      } catch (error: any) {
        const errorMessage = error?.message || "Unknown error";
        progressMap.set(file.name, {
          fileName: file.name,
          progress: 0,
          status: "error",
          error: errorMessage,
        });
        notifyProgress();

        return {
          fileName: file.name,
          publicUrl: "",
          secureUrl: "",
          success: false,
          error: errorMessage,
        };
      }
    }
  );

  return Promise.all(uploadPromises);
}

/**
 * Default upload options with compression enabled
 */
export const defaultUploadOptions: CloudinaryUploadOptions = {
  folder: "weincard",
  quality: "auto:good",
  format: "auto",
  maxWidth: 2000,
  maxHeight: 2000,
};

/**
 * Upload options for logos (smaller, higher quality)
 */
export const logoUploadOptions: CloudinaryUploadOptions = {
  folder: "weincard/logos",
  quality: "auto:best",
  format: "auto",
  maxWidth: 500,
  maxHeight: 500,
};

/**
 * Upload options for branch images
 */
export const branchImageUploadOptions: CloudinaryUploadOptions = {
  folder: "weincard/branches",
  quality: "auto:good",
  format: "auto",
  maxWidth: 1920,
  maxHeight: 1080,
};
