import { varejoSchema, atacadoSchema, geralSchema, leadSchema } from '@/lib/validations/lead'

// CNPJ válido para testes: 11.222.333/0001-81
const CNPJ_VALIDO = '11222333000181'
const CNPJ_VALIDO_COM_MASCARA = '11.222.333/0001-81'

describe('varejoSchema', () => {
  it('aceita payload válido com nome, e-mail e telefone', () => {
    const result = varejoSchema.safeParse({
      type: 'varejo',
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '11999999999',
    })
    expect(result.success).toBe(true)
  })

  it('aceita payload com todos os campos opcionais', () => {
    const result = varejoSchema.safeParse({
      type: 'varejo',
      name: 'Maria Souza',
      email: 'maria@example.com',
      phone: '11988887777',
      productId: 'prod-123',
      message: 'Tenho interesse no produto',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita payload sem e-mail', () => {
    const result = varejoSchema.safeParse({
      type: 'varejo',
      name: 'João Silva',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita payload com e-mail inválido', () => {
    const result = varejoSchema.safeParse({
      type: 'varejo',
      name: 'João Silva',
      email: 'email-invalido',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('inválido')
    }
  })

  it('rejeita payload com nome muito curto', () => {
    const result = varejoSchema.safeParse({
      type: 'varejo',
      name: 'J',
      email: 'joao@example.com',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita payload com telefone muito curto', () => {
    const result = varejoSchema.safeParse({
      type: 'varejo',
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '123',
    })
    expect(result.success).toBe(false)
  })
})

describe('atacadoSchema', () => {
  const payloadBase = {
    type: 'atacado' as const,
    name: 'Carlos Oliveira',
    email: 'carlos@empresa.com.br',
    phone: '11966554433',
    companyName: 'Empresa LTDA',
    cnpj: CNPJ_VALIDO,
  }

  it('aceita payload válido com CNPJ correto', () => {
    const result = atacadoSchema.safeParse(payloadBase)
    expect(result.success).toBe(true)
  })

  it('aceita CNPJ com máscara', () => {
    const result = atacadoSchema.safeParse({
      ...payloadBase,
      cnpj: CNPJ_VALIDO_COM_MASCARA,
    })
    expect(result.success).toBe(true)
  })

  it('rejeita CNPJ com menos de 14 dígitos numéricos', () => {
    const result = atacadoSchema.safeParse({
      ...payloadBase,
      cnpj: '1234567',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('14 dígitos')
    }
  })

  it('rejeita CNPJ com dígitos verificadores inválidos', () => {
    // 14 dígitos mas check digits inválidos
    const result = atacadoSchema.safeParse({
      ...payloadBase,
      cnpj: '11222333000100',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('dígitos verificadores')
    }
  })

  it('rejeita CNPJ com todos os dígitos iguais', () => {
    const result = atacadoSchema.safeParse({
      ...payloadBase,
      cnpj: '00000000000000',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita payload sem razão social', () => {
    const { companyName: _, ...rest } = payloadBase
    const result = atacadoSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejeita payload sem e-mail', () => {
    const result = atacadoSchema.safeParse({
      ...payloadBase,
      email: undefined,
    })
    expect(result.success).toBe(false)
  })
})

describe('geralSchema', () => {
  it('aceita payload válido', () => {
    const result = geralSchema.safeParse({
      type: 'geral',
      name: 'Ana Lima',
      email: 'ana@exemplo.com',
      phone: '11977776666',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita payload sem telefone', () => {
    const result = geralSchema.safeParse({
      type: 'geral',
      name: 'Ana Lima',
      email: 'ana@exemplo.com',
    })
    expect(result.success).toBe(false)
  })
})

describe('leadSchema (discriminatedUnion)', () => {
  it('seleciona schema varejo corretamente', () => {
    const result = leadSchema.safeParse({
      type: 'varejo',
      name: 'João',
      email: 'joao@test.com',
      phone: '11999999999',
    })
    expect(result.success).toBe(true)
  })

  it('seleciona schema atacado corretamente', () => {
    const result = leadSchema.safeParse({
      type: 'atacado',
      name: 'Empresa',
      email: 'empresa@test.com',
      phone: '11999999999',
      companyName: 'Empresa LTDA',
      cnpj: CNPJ_VALIDO,
    })
    expect(result.success).toBe(true)
  })

  it('seleciona schema geral corretamente', () => {
    const result = leadSchema.safeParse({
      type: 'geral',
      name: 'Usuário',
      email: 'usuario@test.com',
      phone: '11999999999',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita tipo inválido', () => {
    const result = leadSchema.safeParse({
      type: 'desconhecido',
      name: 'Teste',
      email: 'teste@test.com',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
  })
})
