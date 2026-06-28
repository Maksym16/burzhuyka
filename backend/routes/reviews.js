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

// GET /api/reviews — public, approved only
router.get('/', async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM reviews WHERE approved = TRUE ORDER BY created_at DESC`
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/reviews/pending — protected
router.get('/pending', requireAuth, async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM reviews WHERE approved = FALSE ORDER BY created_at DESC`
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/reviews — public
router.post('/', async (req, res) => {
  const { name, rating, comment, image_url, image_public_id } = req.body
  const ratingNum = Number(rating)

  if (!name?.trim())    return res.status(400).json({ error: "Вкажіть ваше ім'я" })
  if (!comment?.trim()) return res.status(400).json({ error: 'Вкажіть текст відгуку' })
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: 'Оцінка має бути від 1 до 5' })
  }

  try {
    const rows = await sql`
      INSERT INTO reviews (name, rating, comment, image_url, image_public_id)
      VALUES (${name.trim()}, ${ratingNum}, ${comment.trim()}, ${image_url || null}, ${image_public_id || null})
      RETURNING *
    `
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/reviews/:id/approve — protected
router.patch('/:id/approve', requireAuth, async (req, res) => {
  try {
    const rows = await sql`
      UPDATE reviews SET approved = TRUE WHERE id = ${req.params.id}
      RETURNING *
    `
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/reviews/:id — protected
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT image_public_id FROM reviews WHERE id = ${req.params.id}`
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })

    const { image_public_id } = rows[0]
    if (image_public_id) {
      await cloudinary.uploader.destroy(image_public_id)
    }

    await sql`DELETE FROM reviews WHERE id = ${req.params.id}`
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
