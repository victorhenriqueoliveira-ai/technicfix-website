'use client'

import { useState } from 'react'
import Image from 'next/image'

// Para adicionar fotos reais dos trabalhos: coloque os arquivos em
// public/technocalhas/trabalhos/ com esses nomes (trabalho-1.jpg, trabalho-2.jpg...).
// Enquanto o arquivo não existir, um placeholder é exibido automaticamente.
const PHOTOS = [
  '/technocalhas/trabalhos/trabalho-1.jpg',
  '/technocalhas/trabalhos/trabalho-2.jpg',
  '/technocalhas/trabalhos/trabalho-3.jpg',
  '/technocalhas/trabalhos/trabalho-4.jpg',
  '/technocalhas/trabalhos/trabalho-5.jpg',
  '/technocalhas/trabalhos/trabalho-6.jpg',
]

export function WorkGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
      {PHOTOS.map((src, index) => (
        <GalleryTile key={src} src={src} index={index} />
      ))}
    </div>
  )
}

function GalleryTile({ src, index }: { src: string; index: number }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl bg-brand-navy/5 border-2 border-dashed border-brand-navy/15 text-brand-navy/40">
        <PhotoIcon className="h-6 w-6" />
        <span className="text-[11px] font-medium">Foto em breve</span>
      </div>
    )
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-navy/5 shadow-sm">
      <Image
        src={src}
        alt={`Trabalho realizado pela Technocalhas ${index + 1}`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  )
}
