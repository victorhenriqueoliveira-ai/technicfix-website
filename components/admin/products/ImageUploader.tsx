'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { getPresignedUploadUrl } from '@/actions/products'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    setError(null)
    setUploading(true)

    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.')
        setUploading(false)
        return
      }

      if (file.size > MAX_SIZE_BYTES) {
        setError('Arquivo muito grande. Tamanho máximo: 5MB por imagem.')
        setUploading(false)
        return
      }

      const result = await getPresignedUploadUrl(file.name, file.type, file.size)

      if ('error' in result) {
        setError(result.error)
        setUploading(false)
        return
      }

      const { url, key } = result

      try {
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })

        if (!uploadResponse.ok) {
          setError(`Falha ao fazer upload de "${file.name}". Tente novamente.`)
          setUploading(false)
          return
        }

        const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
        newUrls.push(publicUrl)
      } catch {
        setError(`Erro ao fazer upload de "${file.name}". Verifique sua conexão.`)
        setUploading(false)
        return
      }
    }

    onChange([...images, ...newUrls])
    setUploading(false)

    // Limpa o input para permitir re-seleção dos mesmos arquivos
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
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

      {/* Erro */}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
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
          disabled={uploading}
        />
        <label
          htmlFor="image-upload-input"
          className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ${
            uploading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {uploading ? 'Enviando...' : 'Adicionar imagens'}
        </label>
        <p className="mt-1 text-xs text-gray-500">JPEG, PNG ou WebP — máx. 5MB por arquivo</p>
      </div>
    </div>
  )
}
