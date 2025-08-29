import { env } from '../env';

export interface StorageConfig {
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
  endpoint: string;
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

export class StorageService {
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  async uploadFile(file: File, path: string): Promise<UploadResult> {
    // In production, this would use AWS SDK or similar
    // For now, we'll simulate the upload process
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    formData.append('bucket', this.config.bucket);

    try {
      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return {
        url: result.url,
        key: result.key,
        size: file.size,
      };
    } catch (error) {
      console.error('Storage upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const response = await fetch('/api/storage/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          expiresIn,
          bucket: this.config.bucket,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Storage signed URL error:', error);
      throw new Error('Failed to get signed URL');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const response = await fetch('/api/storage/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          bucket: this.config.bucket,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Storage delete error:', error);
      throw new Error('Failed to delete file');
    }
  }

  async getFileInfo(key: string): Promise<{ size: number; lastModified: Date }> {
    try {
      const response = await fetch(`/api/storage/info?key=${encodeURIComponent(key)}&bucket=${this.config.bucket}`);
      
      if (!response.ok) {
        throw new Error('Failed to get file info');
      }

      const result = await response.json();
      return {
        size: result.size,
        lastModified: new Date(result.lastModified),
      };
    } catch (error) {
      console.error('Storage file info error:', error);
      throw new Error('Failed to get file info');
    }
  }
}

// Create a default instance
export const storageService = new StorageService({
  accessKey: env.STORAGE_ACCESS_KEY || '',
  secretKey: env.STORAGE_SECRET_KEY || '',
  bucket: env.STORAGE_BUCKET || '',
  region: env.STORAGE_REGION || '',
  endpoint: env.STORAGE_ENDPOINT || '',
});
