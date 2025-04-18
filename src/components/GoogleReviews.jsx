import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

export default function GoogleReviews({ placeId, apiKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Primero obtenemos los detalles del lugar
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,reviews,user_ratings_total&key=${apiKey}`
        );
        const detailsData = await detailsResponse.json();

        if (detailsData.result) {
          setAverageRating(detailsData.result.rating || 0);
          setTotalReviews(detailsData.result.user_ratings_total || 0);
          setReviews(detailsData.result.reviews || []);
        }
      } catch (err) {
        setError('Error al cargar las reseñas');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (placeId && apiKey) {
      fetchReviews();
    }
  }, [placeId, apiKey]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de calificaciones */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
          <div className="flex ml-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <span className="text-gray-600">
          {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
        </span>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.time}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-2 mb-2">
              <img
                src={review.profile_photo_url}
                alt={review.author_name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">{review.author_name}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(review.time * 1000).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>

      {/* Enlace a Google Reviews */}
      <div className="text-center">
        <a
          href={`https://search.google.com/local/writereview?placeid=${placeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Escribir una reseña
        </a>
      </div>
    </div>
  );
} 