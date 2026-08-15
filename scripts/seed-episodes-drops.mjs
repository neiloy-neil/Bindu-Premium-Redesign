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

const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
await db.connect()
console.log('✓ Connected to database')

// ── 1. Fetch existing active products ───────────────────────────────────────
const { rows: products } = await db.query(`
  SELECT id, name, slug FROM products WHERE "isActive" = true ORDER BY "createdAt" ASC LIMIT 8
`)
console.log(`✓ Found ${products.length} active products:`)
products.forEach((p, i) => console.log(`  ${i + 1}. ${p.name} (${p.slug})`))

if (products.length === 0) {
  console.log('⚠ No active products found — run the main seed first.')
  await db.end(); process.exit(0)
}

// ── 2. Set releaseAt on 2 products for DROP testing ─────────────────────────
// Drop A: opens in 3 days
// Drop B: opens in 10 days
const dropA = products[0]
const dropB = products[1] || products[0]

const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
const inTenDays   = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()

await db.query(`UPDATE products SET "releaseAt" = $1 WHERE id = $2`, [inThreeDays, dropA.id])
await db.query(`UPDATE products SET "releaseAt" = $1 WHERE id = $2`, [inTenDays,   dropB.id])
console.log(`✓ Drop A: "${dropA.name}" — opens in 3 days`)
console.log(`✓ Drop B: "${dropB.name}" — opens in 10 days`)

// ── 3. Clear existing episode test data ─────────────────────────────────────
await db.query(`DELETE FROM episode_products WHERE "episodeId" IN (SELECT id FROM episodes WHERE slug = '01-ignition')`)
await db.query(`DELETE FROM episodes WHERE slug = '01-ignition'`)
console.log('✓ Cleared old episode seed data')

// ── 4. Create Episode 01: Ignition ──────────────────────────────────────────
const episodeId = (await db.query(`SELECT gen_random_uuid() AS id`)).rows[0].id

const story = `Collection 01 started with one question: what does a final arc feel like as a graphic?

Not the climax — the moment before it. The instant a character realises there's no going back, that this fight defines everything. That weight, that silence before the explosion — that's what Ignition is.

Four designs. Four interpretations of the same feeling. The Final Hour captures the countdown. Shonen Power-Up captures the surge. Blade Line captures the edge. Otaku Pride captures what it means to carry this culture without apology.

Each piece was drawn from scratch by Bangladeshi artists who grew up on the same arcs you did. No stolen frames. No bootleg references. Everything here is original — because the culture deserves that.

100 units. No restock. When this run closes, Ignition is an archive.`

const artistNote = `I wanted the designs to feel like panels — not merch. When you look at The Final Hour, you should feel the same thing you feel in the last episode of a long run. That mix of grief and relief and pride. That's the only brief that mattered.`

await db.query(`
  INSERT INTO episodes (id, name, slug, number, tagline, story, "heroImage", "artistNote", "artistName", "isPublished", "sortOrder", "createdAt", "updatedAt")
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
`, [
  episodeId,
  'Collection 01: Ignition',
  '01-ignition',
  '01',
  'The arc begins. 100 units. No restock.',
  story,
  'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=2940&auto=format&fit=crop', // dark editorial tee photo
  artistNote,
  'Illustrated by Rafi Hasan',
  true,  // isPublished
  0,
])
console.log(`✓ Created Episode: "Collection 01: Ignition" (slug: 01-ignition)`)

// ── 5. Attach products to the episode ────────────────────────────────────────
const episodeProducts = [
  {
    product: products[2] || products[0],
    sortOrder: 0,
    editorialNote: 'The design that opened the arc. A countdown rendered as clothing — the last seconds before everything changes.',
  },
  {
    product: products[3] || products[1] || products[0],
    sortOrder: 1,
    editorialNote: 'The surge. Every protagonist has one moment where they stop calculating and just move. This is that moment on a shirt.',
  },
  {
    product: products[4] || products[2] || products[0],
    sortOrder: 2,
    editorialNote: 'Clean lines, sharp edges. The quietest design in the collection — and the one that hits hardest up close.',
  },
  {
    product: products[5] || products[0],
    sortOrder: 3,
    editorialNote: 'You grew up on this. So did we. Otaku Pride is for everyone who carried the culture before it was cool to.',
  },
]

for (const ep of episodeProducts) {
  await db.query(`
    INSERT INTO episode_products ("episodeId", "productId", "sortOrder", "editorialNote")
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("episodeId", "productId") DO UPDATE SET "sortOrder" = EXCLUDED."sortOrder", "editorialNote" = EXCLUDED."editorialNote"
  `, [episodeId, ep.product.id, ep.sortOrder, ep.editorialNote])
  console.log(`  ✓ Attached: "${ep.product.name}" (slot ${ep.sortOrder + 1})`)
}

// ── 6. Summary ───────────────────────────────────────────────────────────────
console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Seed complete

DROPS (visit /drops):
  • "${dropA.name}" → opens in 3 days
  • "${dropB.name}" → opens in 10 days
  PDP pages for both will show a locked countdown.

EPISODE (visit /episode/01-ignition):
  • Collection 01: Ignition (published)
  • ${episodeProducts.length} products attached with editorial notes
  • Hero image, story, and artist note all populated

TEST PAGES:
  /drops              → two upcoming drops with countdowns
  /episode            → episode archive with Collection 01 listed
  /episode/01-ignition → full editorial page
  /shop/<slug>        → PDP shows "Ep.01" badge + locked state on drop products
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

await db.end()
