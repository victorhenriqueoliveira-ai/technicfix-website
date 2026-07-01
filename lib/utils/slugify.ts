/**
 * Gera um slug válido a partir de uma string, suportando caracteres PT-BR.
 * Remove acentos via normalização NFD, converte para lowercase,
 * substitui espaços por hífens e remove caracteres inválidos.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove diacríticos (acentos)
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove caracteres não alfanuméricos (exceto espaços e hífens)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Colapsa hífens consecutivos
    .replace(/^-|-$/g, '') // Remove hífens no início/fim
}
