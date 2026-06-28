import PropTypes from 'prop-types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchReviews, fetchPendingReviews, approveReview, deleteReview } from '../../api/reviews'

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-brand-primary">
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} className={`w-4 h-4 ${n <= rating ? '' : 'text-forge-border'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}

Stars.propTypes = {
  rating: PropTypes.number.isRequired,
}

export default function ReviewsAdmin() {
  const qc = useQueryClient()

  const { data: pending = [], isLoading: pendingLoading } = useQuery({
    queryKey: ['reviews', 'pending'],
    queryFn: fetchPendingReviews,
  })

  const { data: approved = [], isLoading: approvedLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
  })

  function invalidate() {
    qc.invalidateQueries({ queryKey: ['reviews'] })
    qc.invalidateQueries({ queryKey: ['reviews', 'pending'] })
  }

  const approveMutation = useMutation({
    mutationFn: approveReview,
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: invalidate,
  })

  function handleDelete(review) {
    if (!window.confirm('Видалити відгук?')) return
    deleteMutation.mutate(review.id)
  }

  return (
    <div className="p-8 max-w-4xl space-y-12">
      {/* Pending */}
      <div>
        <h1 className="text-forge-cream text-xl font-bold uppercase tracking-wide mb-1">Очікують підтвердження</h1>
        <p className="text-forge-muted text-sm mb-6">{pending.length} відгуків</p>

        {pendingLoading && (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 bg-forge-surface animate-pulse" />
            ))}
          </div>
        )}

        {!pendingLoading && pending.length === 0 && (
          <p className="text-forge-muted text-sm py-6 text-center border border-dashed border-forge-border">
            Немає нових відгуків
          </p>
        )}

        <div className="space-y-3">
          {pending.map(r => (
            <div key={r.id} className="bg-forge-dark border border-forge-border p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {r.image_url && (
                  <img src={r.image_url} alt="" className="w-16 h-16 object-cover flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-forge-cream font-semibold text-sm">{r.name}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-forge-dim text-sm leading-relaxed">{r.comment}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => approveMutation.mutate(r.id)}
                  disabled={approveMutation.isPending}
                  className="w-9 h-9 bg-green-700 hover:bg-green-600 text-white flex items-center justify-center"
                  aria-label="Підтвердити"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(r)}
                  disabled={deleteMutation.isPending}
                  className="w-9 h-9 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                  aria-label="Відхилити"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approved */}
      <div>
        <h2 className="text-forge-cream text-xl font-bold uppercase tracking-wide mb-1">Опубліковані</h2>
        <p className="text-forge-muted text-sm mb-6">{approved.length} відгуків</p>

        {approvedLoading && (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 bg-forge-surface animate-pulse" />
            ))}
          </div>
        )}

        {!approvedLoading && approved.length === 0 && (
          <p className="text-forge-muted text-sm py-6 text-center border border-dashed border-forge-border">
            Поки немає опублікованих відгуків
          </p>
        )}

        <div className="space-y-3">
          {approved.map(r => (
            <div key={r.id} className="bg-forge-dark border border-forge-border p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {r.image_url && (
                  <img src={r.image_url} alt="" className="w-16 h-16 object-cover flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-forge-cream font-semibold text-sm">{r.name}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-forge-dim text-sm leading-relaxed">{r.comment}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(r)}
                disabled={deleteMutation.isPending}
                className="w-9 h-9 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center flex-shrink-0"
                aria-label="Видалити"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-6 0h6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
