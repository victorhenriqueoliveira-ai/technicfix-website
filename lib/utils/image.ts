/**
 * Utilitários para validação e obtenção de URLs de imagem.
 */

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
