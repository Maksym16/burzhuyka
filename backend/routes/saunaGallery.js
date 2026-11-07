require('dotenv').config()
const express     = require('express')
const cloudinary  = require('cloudinary').v2
const { sql }     = require('../db')
const requireAuth = require('../middleware/auth')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const router = express.Router()

// GET /api/sauna-gallery — public
router.get('/', async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM sauna_gallery ORDER BY created_at DESC, id DESC`
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/sauna-gallery — protected
router.post('/', requireAuth, async (req, res) => {
  const { url, public_id } = req.body
  if (!url || !public_id) return res.status(400).json({ error: 'url and public_id are required' })
  try {
    const rows = await sql`
      INSERT INTO sauna_gallery (url, public_id)
      VALUES (${url}, ${public_id})
      RETURNING *
    `
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/sauna-gallery/:id — protected
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT public_id FROM sauna_gallery WHERE id = ${req.params.id}`
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })

    await cloudinary.uploader.destroy(rows[0].public_id)
    await sql`DELETE FROM sauna_gallery WHERE id = ${req.params.id}`
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
