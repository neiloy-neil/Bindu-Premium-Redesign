import pg from 'pg'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/)
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const EMAIL        = 'bindupremium.bd@gmail.com'
const PASSWORD     = 'Admin@1234'
const NAME         = 'Bindu Premium Admin'

async function setAppMetadata(userId) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ app_metadata: { role: 'ADMIN' } }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Failed to set app_metadata: ${JSON.stringify(err)}`)
  }
  console.log('✓ app_metadata.role = ADMIN set in Supabase Auth')
}

// ── 1. Create or find user in Supabase Auth ──────────────────────────────────
let userId

const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
  },
  body: JSON.stringify({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { name: NAME },
    app_metadata: { role: 'ADMIN' },
  }),
})

const createData = await createRes.json()

if (!createRes.ok) {
  if (createData?.msg?.includes('already been registered') || createData?.code === 'email_exists') {
    console.log(`ℹ ${EMAIL} already exists — fetching…`)
    const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`, {
      headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
    })
    const list = await listRes.json()
    const existing = list.users?.find(u => u.email === EMAIL)
    if (!existing) { console.error('Could not find user'); process.exit(1) }
    userId = existing.id
    await setAppMetadata(userId)
  } else {
    console.error('Supabase Auth error:', JSON.stringify(createData, null, 2))
    process.exit(1)
  }
} else {
  userId = createData.id
  console.log(`✓ Supabase Auth user created: ${EMAIL} (${userId})`)
}

// ── 2. Upsert DB row with ADMIN role ─────────────────────────────────────────
const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
await db.connect()

await db.query(`
  INSERT INTO users (id, name, email, role, "createdAt", "updatedAt")
  VALUES ($1, $2, $3, 'ADMIN', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET role = 'ADMIN', name = EXCLUDED.name, "updatedAt" = NOW()
`, [userId, NAME, EMAIL])

const { rows } = await db.query(`SELECT id, email, role FROM users WHERE id = $1`, [userId])
console.log('✓ DB user:', rows[0])
await db.end()

console.log(`\n✅ Admin account ready`)
console.log(`   Email   : ${EMAIL}`)
console.log(`   Password: ${PASSWORD}`)
console.log(`   Role    : ADMIN (DB + Supabase app_metadata)`)
