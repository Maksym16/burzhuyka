require('dotenv').config()
const { neon } = require('@neondatabase/serverless')
const { manufacturers, products } = require('./seedData')

const sql = neon(process.env.DATABASE_URL)

async function seed() {
  console.log('Seeding manufacturers...')
  for (const m of manufacturers) {
    await sql`
      INSERT INTO manufacturers (id, label, country)
      VALUES (${m.id}, ${m.label}, ${m.country})
      ON CONFLICT (id) DO UPDATE SET label = ${m.label}, country = ${m.country}
    `
  }

  console.log('Seeding products...')
  for (const p of products) {
    await sql`
      INSERT INTO products (name, category_id, manufacturer_id, image, specs, spec_columns, description, slug)
      VALUES (${p.name}, ${p.category_id}, ${p.manufacturer_id}, ${p.image}, ${p.specs}, ${p.spec_columns ?? null}, ${p.description ?? null}, ${p.slug})
      ON CONFLICT (slug) DO UPDATE SET
        name = ${p.name}, category_id = ${p.category_id}, manufacturer_id = ${p.manufacturer_id},
        image = ${p.image}, specs = ${p.specs}, spec_columns = ${p.spec_columns ?? null}, description = ${p.description ?? null}
    `
  }

  console.log(`Done: ${manufacturers.length} manufacturers, ${products.length} products.`)
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
