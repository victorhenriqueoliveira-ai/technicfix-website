/**
 * Utilitários para validação e obtenção de URLs de imagem.
 */

/**
 * Placeholder cinza usado como blurDataURL em <Image placeholder="blur">.
 * Exibe um fundo cinza enquanto a imagem remota carrega.
 */
export const shimmerDataURL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23e5e7eb'/%3E%3C/svg%3E"

/**
 * Verifica se uma string é uma URL válida.
 */
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Retorna a URL de imagem de um produto pelo índice, ou null se inválida.
 */
export function getProductImageSrc(images: string[], index = 0): string | null {
  return images[index] && isValidUrl(images[index]) ? images[index] : null
}
