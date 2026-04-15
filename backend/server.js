require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

const authRoutes     = require('./routes/auth')
const productsRoutes = require('./routes/products')
const uploadRoute    = require('./routes/upload')

const app  = express()
const PORT = process.env.PORT || 3001

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }))
}
app.use(express.json())

app.use('/api/auth',     authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/upload',   uploadRoute)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Serve built frontend
app.use(express.static(path.join(__dirname, './dist')))

// SPA fallback — all non-API routes return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
