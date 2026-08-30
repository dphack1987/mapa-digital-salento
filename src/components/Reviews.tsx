// Componente de reseñas y calificaciones
import { useState } from 'react'
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  X, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import reviewsService from '../services/reviewsService'

interface ReviewsProps {
  placeId: string
  placeName: string
  placeType: string
  onClose: () => void
  language: 'es' | 'en'
}

export default function Reviews({ placeId, placeName, placeType, onClose, language }: ReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({
    userName: '',
    rating: 5,
    title: '',
    comment: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const stats = reviewsService.getPlaceStats(placeId)
  const reviews = reviewsService.getReviewsByPlace(placeId)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      reviewsService.createReview({
        placeId,
        placeName,
        placeType,
        userId: 'current-user', // En producción, esto vendría del sistema de auth
        userName: reviewData.userName,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        verified: false, // En producción, esto se verificaría
        language
      })

      setSuccess(true)
      setShowReviewForm(false)
      
      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setSuccess(false)
        setReviewData({ userName: '', rating: 5, title: '', comment: '' })
      }, 2000)

    } catch (err) {
      setError(language === 'es' ? 'Error al crear la reseña' : 'Error creating review')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkHelpful = (reviewId: string) => {
    reviewsService.markAsHelpful(reviewId)
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="stars-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
          >
            <Star size={16} />
          </button>
        ))}
      </div>
    )
  }

  const isSpanish = language === 'es'

  return (
    <div className="reviews-overlay">
      <div className="reviews-modal">
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="reviews-header">
          <h2>{isSpanish ? 'Reseñas y Calificaciones' : 'Reviews & Ratings'}</h2>
          <p>{placeName}</p>
        </div>

        <div className="reviews-stats">
          <div className="rating-summary">
            <div className="average-rating">
              <span className="rating-number">{stats.averageRating}</span>
              <div className="stars-rating-static">
                {renderStars(Math.round(stats.averageRating))}
              </div>
            </div>
            <div className="review-count">
              {stats.totalReviews} {isSpanish ? 'reseñas' : 'reviews'}
            </div>
          </div>

          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="distribution-bar">
                <span className="rating-label">{rating} ⭐</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%` }}
                  />
                </div>
                <span className="rating-count">{stats.ratingDistribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>

        {!showReviewForm ? (
          <>
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <div className="empty-reviews">
                  <MessageSquare size={32} />
                  <p>{isSpanish ? 'Aún no hay reseñas' : 'No reviews yet'}</p>
                  <span>{isSpanish ? '¡Sé el primero en opinar!' : 'Be the first to review!'}</span>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.userName}</span>
                        {review.verified && (
                          <span className="verified-badge">
                            <CheckCircle size={12} />
                            {isSpanish ? 'Verificado' : 'Verified'}
                          </span>
                        )}
                      </div>
                      <div className="review-date">
                        {review.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>

                    <h4 className="review-title">{review.title}</h4>
                    <p className="review-comment">{review.comment}</p>

                    <div className="review-footer">
                      <button 
                        className="helpful-button"
                        onClick={() => handleMarkHelpful(review.id)}
                      >
                        <ThumbsUp size={14} />
                        {review.helpful} {isSpanish ? 'útil' : 'helpful'}
                      </button>
                      <span className="review-language">{review.language.toUpperCase()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              className="write-review-button"
              onClick={() => setShowReviewForm(true)}
            >
              <MessageSquare size={16} />
              {isSpanish ? 'Escribir una reseña' : 'Write a review'}
            </button>
          </>
        ) : (
          <>
            <div className="review-form-header">
              <button 
                className="back-button"
                onClick={() => setShowReviewForm(false)}
              >
                ← {isSpanish ? 'Volver' : 'Back'}
              </button>
              <h3>{isSpanish ? 'Escribir una reseña' : 'Write a Review'}</h3>
            </div>

            {success ? (
              <div className="success-message">
                <CheckCircle size={48} />
                <h3>{isSpanish ? '¡Reseña enviada!' : 'Review submitted!'}</h3>
                <p>{isSpanish ? 'Gracias por compartir tu experiencia' : 'Thank you for sharing your experience'}</p>
              </div>
            ) : (
              <form className="review-form" onSubmit={handleSubmitReview}>
                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label>{isSpanish ? 'Tu nombre' : 'Your name'}</label>
                  <input 
                    type="text" 
                    value={reviewData.userName}
                    onChange={(e) => setReviewData({ ...reviewData, userName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{isSpanish ? 'Calificación' : 'Rating'}</label>
                  <div className="rating-input">
                    {renderStars(reviewData.rating, true, (rating) => setReviewData({ ...reviewData, rating }))}
                  </div>
                </div>

                <div className="form-group">
                  <label>{isSpanish ? 'Título' : 'Title'}</label>
                  <input 
                    type="text" 
                    value={reviewData.title}
                    onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                    placeholder={isSpanish ? 'Ej: ¡Increíble experiencia!' : 'Ex: Amazing experience!'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{isSpanish ? 'Tu reseña' : 'Your review'}</label>
                  <textarea 
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    placeholder={isSpanish ? 'Comparte tu experiencia con este lugar...' : 'Share your experience with this place...'}
                    rows={4}
                    required
                  />
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? (isSpanish ? 'Enviando...' : 'Sending...') : (isSpanish ? 'Enviar reseña' : 'Submit review')}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}