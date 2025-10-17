/**
 * Image utility functions
 */

/**
 * Get MIME type from base64 string signature
 */
export function getMimeTypeFromBase64(base64String: string): string {
  if (!base64String || base64String.length < 5) {
    return 'application/octet-stream'
  }

  const signature = base64String.substring(0, 5)

  const mimeTypes: Record<string, string> = {
    '/9j/4': 'image/jpeg',
    iVBOR: 'image/png',
    R0lGO: 'image/gif',
    UklGR: 'image/webp',
    'Qk02A': 'image/bmp',
  }

  return mimeTypes[signature] || 'application/octet-stream'
}

/**
 * Convert base64 image to data URL
 */
export function base64ToDataUrl(base64String: string): string | null {
  const mimeType = getMimeTypeFromBase64(base64String)

  if (mimeType === 'application/octet-stream') {
    return null
  }

  return `data:${mimeType};base64,${base64String}`
}

/**
 * Create object URL from File
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Revoke object URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url)
}
