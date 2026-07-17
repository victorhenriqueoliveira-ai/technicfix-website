import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@/auth'

const f = createUploadthing()

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: '4MB', maxFileCount: 8 } })
    .middleware(async () => {
      const session = await auth()
      if (!session) throw new Error('Não autorizado')
      return { userId: session.user?.email }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
