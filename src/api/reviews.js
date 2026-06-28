import { apiFetch } from './client'

export const fetchReviews        = ()                       => apiFetch('/reviews')
export const fetchPendingReviews = ()                       => apiFetch('/reviews/pending')
export const submitReview        = (name, rating, comment, imageUrl, imagePublicId) =>
  apiFetch('/reviews', { method: 'POST', body: JSON.stringify({ name, rating, comment, image_url: imageUrl, image_public_id: imagePublicId }) })
export const approveReview       = (id)                     => apiFetch(`/reviews/${id}/approve`, { method: 'PATCH' })
export const deleteReview        = (id)                     => apiFetch(`/reviews/${id}`, { method: 'DELETE' })
