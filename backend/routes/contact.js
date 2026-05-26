const express    = require('express')
const nodemailer = require('nodemailer')

const router = express.Router()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// POST /api/contact — public
router.post('/', async (req, res) => {
  const { name, phone, service, message } = req.body

  if (!name?.trim())  return res.status(400).json({ error: "Вкажіть ваше ім'я" })
  if (!phone?.trim()) return res.status(400).json({ error: 'Вкажіть номер телефону' })

  const html = `
    <table style="font-family:sans-serif;font-size:14px;color:#333;border-collapse:collapse;width:100%;max-width:520px">
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee"><strong>Ім'я:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee">${name}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee"><strong>Телефон:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee">${phone}</td></tr>
      ${service ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee"><strong>Послуга:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee">${service}</td></tr>` : ''}
      ${message ? `<tr><td style="padding:8px 0"><strong>Повідомлення:</strong></td><td style="padding:8px 0">${message}</td></tr>` : ''}
    </table>
  `

  try {
    await transporter.sendMail({
      from:    `"Буржуйка сайт" <${process.env.EMAIL_USER}>`,
      to:      'burzhuyka.montazh@gmail.com',
      subject: `Нова заявка від ${name}`,
      html,
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err.message)
    res.status(500).json({ error: 'Помилка відправки. Спробуйте ще раз.' })
  }
})

module.exports = router
