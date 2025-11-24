import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getMimeTypeFromBase64,
  base64ToDataUrl,
  createImagePreview,
  revokeImagePreview,
} from '../image-utils'

describe('image-utils', () => {
  describe('getMimeTypeFromBase64', () => {
    it('should return jpeg mime type for jpeg signature', () => {
      const result = getMimeTypeFromBase64('/9j/4AAQSkZJRg')
      expect(result).toBe('image/jpeg')
    })

    it('should return png mime type for png signature', () => {
      const result = getMimeTypeFromBase64('iVBORw0KGgoAAAANS')
      expect(result).toBe('image/png')
    })

    it('should return gif mime type for gif signature', () => {
      const result = getMimeTypeFromBase64('R0lGODlhAQABAIAA')
      expect(result).toBe('image/gif')
    })

    it('should return webp mime type for webp signature', () => {
      const result = getMimeTypeFromBase64('UklGRiQAAABXRUJQ')
      expect(result).toBe('image/webp')
    })

    it('should return bmp mime type for bmp signature', () => {
      const result = getMimeTypeFromBase64('Qk02AAAAAAAAA')
      expect(result).toBe('image/bmp')
    })

    it('should return default mime type for unknown signature', () => {
      const result = getMimeTypeFromBase64('UNKNOWN_SIG')
      expect(result).toBe('application/octet-stream')
    })

    it('should return default mime type for empty string', () => {
      const result = getMimeTypeFromBase64('')
      expect(result).toBe('application/octet-stream')
    })

    it('should return default mime type for short string', () => {
      const result = getMimeTypeFromBase64('abc')
      expect(result).toBe('application/octet-stream')
    })
  })

  describe('base64ToDataUrl', () => {
    it('should convert jpeg base64 to data URL', () => {
      const base64 = '/9j/4AAQSkZJRg'
      const result = base64ToDataUrl(base64)
      expect(result).toBe(`data:image/jpeg;base64,${base64}`)
    })

    it('should convert png base64 to data URL', () => {
      const base64 = 'iVBORw0KGgoAAAANS'
      const result = base64ToDataUrl(base64)
      expect(result).toBe(`data:image/png;base64,${base64}`)
    })

    it('should return null for unknown signature', () => {
      const result = base64ToDataUrl('UNKNOWN_SIG')
      expect(result).toBeNull()
    })

    it('should return null for empty string', () => {
      const result = base64ToDataUrl('')
      expect(result).toBeNull()
    })
  })

  describe('createImagePreview', () => {
    beforeEach(() => {
      global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/12345')
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should create object URL from file', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const result = createImagePreview(file)

      expect(result).toBe('blob:http://localhost/12345')
      expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    })

    it('should handle different file types', () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' })
      createImagePreview(file)

      expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    })
  })

  describe('revokeImagePreview', () => {
    beforeEach(() => {
      global.URL.revokeObjectURL = vi.fn()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should revoke object URL', () => {
      const url = 'blob:http://localhost/12345'
      revokeImagePreview(url)

      expect(URL.revokeObjectURL).toHaveBeenCalledWith(url)
    })

    it('should handle multiple revocations', () => {
      const url1 = 'blob:http://localhost/12345'
      const url2 = 'blob:http://localhost/67890'

      revokeImagePreview(url1)
      revokeImagePreview(url2)

      expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(url1)
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(url2)
    })
  })
})
