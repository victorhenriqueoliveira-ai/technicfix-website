'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useUploadThing } from '@/lib/uploadthing-client'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const { startUpload, isUploading } = useUploadThing('productImage', {
    onClientUploadComplete: (res) => {
      const urls = res.map((f) => f.ufsUrl)
      onChange([...images, ...urls])
      if (inputRef.current) inputRef.current.value = ''
    },
    onUploadError: (err) => {
      alert(`Erro ao enviar imagem: ${err.message}`)
    },
  })

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    await startUpload(Array.from(files))
  }

  function handleRemove(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {/* Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3" role="list" aria-label="Imagens do produto">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200"
              role="listitem"
            >
              <Image
                src={url}
                alt={`Imagem ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-700"
                aria-label={`Remover imagem ${index + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botão de upload */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          id="image-upload-input"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isUploading}
        />
        <label
          htmlFor="image-upload-input"
          className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ${
            isUploading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isUploading ? 'Enviando...' : 'Adicionar imagens'}
        </label>
        <p className="mt-1 text-xs text-gray-500">JPEG, PNG ou WebP — máx. 4MB por arquivo, até 8 imagens</p>
      </div>
    </div>
  )
}
