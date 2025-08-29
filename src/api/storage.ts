import { storageService } from '../services/storage';

export async function handleStorageUpload(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    
    if (!file || !path) {
      return new Response('Missing file or path', { status: 400 });
    }

    const result = await storageService.uploadFile(file, path);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Storage upload error:', error);
    return new Response('Upload failed', { status: 500 });
  }
}

export async function handleStorageSignedUrl(request: Request): Promise<Response> {
  try {
    const { key, expiresIn, bucket } = await request.json();
    
    if (!key || !bucket) {
      return new Response('Missing key or bucket', { status: 400 });
    }

    const url = await storageService.getSignedUrl(key, expiresIn);
    
    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Storage signed URL error:', error);
    return new Response('Failed to get signed URL', { status: 500 });
  }
}

export async function handleStorageDelete(request: Request): Promise<Response> {
  try {
    const { key, bucket } = await request.json();
    
    if (!key || !bucket) {
      return new Response('Missing key or bucket', { status: 400 });
    }

    await storageService.deleteFile(key);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Storage delete error:', error);
    return new Response('Delete failed', { status: 500 });
  }
}

export async function handleStorageInfo(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    const bucket = url.searchParams.get('bucket');
    
    if (!key || !bucket) {
      return new Response('Missing key or bucket', { status: 400 });
    }

    const info = await storageService.getFileInfo(key);
    
    return new Response(JSON.stringify(info), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Storage info error:', error);
    return new Response('Failed to get file info', { status: 500 });
  }
}
