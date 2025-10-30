import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface RateProductProps {
  productId: string;
}

export default function RateProduct({ productId }: RateProductProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!session) {
      setError('Please sign in to rate.');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, rating }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <p>Please sign in to rate this product.</p>;
  }

  if (success) {
    return <p>Thank you for your rating!</p>;
  }

  return (
    <div>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'gray' }}
          >
            ★
          </span>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}