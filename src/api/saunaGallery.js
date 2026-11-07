import { apiFetch } from './client'

export const fetchSaunaGallery       = ()               => apiFetch('/sauna-gallery')
export const addSaunaGalleryImage    = (url, public_id) => apiFetch('/sauna-gallery', { method: 'POST', body: JSON.stringify({ url, public_id }) })
export const deleteSaunaGalleryImage = (id)             => apiFetch(`/sauna-gallery/${id}`, { method: 'DELETE' })
