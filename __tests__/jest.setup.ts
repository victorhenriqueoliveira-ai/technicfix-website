/**
 * Setup global para testes Jest.
 * Define variáveis de ambiente mínimas para que lib/env.ts seja carregado
 * sem erros em todos os testes que importam módulos de servidor.
 * Valores fictícios — testes que precisam de valores específicos devem
 * usar jest.mock('@/lib/env', ...) para sobrescrever.
 */
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb'
process.env.RESEND_API_KEY = 'resend_test_key'
process.env.UPLOADTHING_TOKEN = 'uploadthing_test_token'
process.env.AUTH_SECRET = 'auth_secret_test_value'
process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '11999999999'
process.env.NEXT_PUBLIC_SITE_URL = 'https://technicfix.com.br'
