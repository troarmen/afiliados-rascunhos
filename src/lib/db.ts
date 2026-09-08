import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Infraestrutura de persistência compartilhada pelos stores.
 *
 * Com `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` definidos, o
 * banco é o Postgres do Supabase. Sem eles, cada coleção vira um JSON em
 * `.data/` para que `npm run dev` funcione sem configuração nenhuma. O modo
 * arquivo é só desenvolvimento — sem concorrência, sem backup.
 */

export const PASTA_DADOS = path.join(process.cwd(), '.data')

let cliente: SupabaseClient | null = null

export function modoPersistencia(): 'supabase' | 'arquivo' {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? 'supabase'
    : 'arquivo'
}

export function supabase(): SupabaseClient {
  if (!cliente) {
    cliente = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    )
  }
  return cliente
}

// --- Coleções em arquivo (modo desenvolvimento) ------------------------------

export async function lerColecao<T>(nome: string): Promise<T[]> {
  try {
    const bruto = await fs.readFile(path.join(PASTA_DADOS, `${nome}.json`), 'utf8')
    return JSON.parse(bruto) as T[]
  } catch {
    return []
  }
}

export async function escreverColecao<T>(nome: string, lista: T[]) {
  await fs.mkdir(PASTA_DADOS, { recursive: true })
  await fs.writeFile(path.join(PASTA_DADOS, `${nome}.json`), JSON.stringify(lista, null, 2), 'utf8')
}
