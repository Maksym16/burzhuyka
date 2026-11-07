import GalleryAdmin from './GalleryAdmin'
import { fetchSaunaGallery, addSaunaGalleryImage, deleteSaunaGalleryImage } from '../../api/saunaGallery'

export default function SaunaGalleryAdmin() {
  return (
    <GalleryAdmin
      title="Сауни — роботи"
      queryKey="sauna-gallery"
      fetchImages={fetchSaunaGallery}
      addImage={addSaunaGalleryImage}
      deleteImage={deleteSaunaGalleryImage}
    />
  )
}
