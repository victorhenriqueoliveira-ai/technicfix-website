-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('varejo', 'atacado', 'ambos');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productType" "ProductType" NOT NULL DEFAULT 'ambos',
ADD COLUMN     "relatedProductIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "showPrice" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "buyerType" "LeadType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
