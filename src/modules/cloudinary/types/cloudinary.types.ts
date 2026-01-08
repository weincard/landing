export interface CloudinaryUploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

export interface CloudinaryUploadResult {
  fileName: string;
  publicUrl: string;
  secureUrl: string;
  success: boolean;
  error?: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  /**
   * Quality setting for compression (1-100)
   * Use "auto" for automatic quality optimization
   */
  quality?:
    | number
    | "auto"
    | "auto:best"
    | "auto:good"
    | "auto:eco"
    | "auto:low";
  /**
   * Format to convert to (e.g., "webp", "avif", "jpg")
   * Use "auto" for automatic format selection
   */
  format?: string | "auto";
  /**
   * Maximum width in pixels (will resize if larger)
   */
  maxWidth?: number;
  /**
   * Maximum height in pixels (will resize if larger)
   */
  maxHeight?: number;
}

export interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

export interface CloudinaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}
