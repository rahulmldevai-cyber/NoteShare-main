import { FiStar } from 'react-icons/fi';
import { useState } from 'react';

export default function StarRating({ rating = 0, onRate, size = 20, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 2, cursor: readonly ? 'default' : 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          style={{
            transition: 'all 0.15s ease',
            fill: star <= (hover || rating) ? '#FDCB6E' : 'transparent',
            color: star <= (hover || rating) ? '#FDCB6E' : 'var(--text-muted)',
            transform: star <= hover ? 'scale(1.15)' : 'scale(1)',
          }}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onRate && onRate(star)}
        />
      ))}
    </div>
  );
}
