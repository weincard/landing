export interface FileUploadRequest {
  fileName: string;
  type?: string;
}

export interface PresignedUrlResponse {
  fileName: string;
  type: string;
  url: string;
}

export interface GeneratePresignedUrlsResponse {
  urls: PresignedUrlResponse[];
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

export interface UploadResult {
  fileName: string;
  publicUrl: string;
  success: boolean;
  error?: string;
}
