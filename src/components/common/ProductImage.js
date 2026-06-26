import React, { useEffect, useState } from 'react';
import { Shirt } from 'lucide-react';
import { getAssetUrl, getCategoryFallbacks } from '../../utils/images';

const ProductImage = ({
  src,
  alt = 'Product',
  category = 'other',
  name = '',
  className = '',
  imgClassName = 'w-full h-full object-cover',
  showPlaceholderIcon = true,
}) => {
  const fallbacks = getCategoryFallbacks(category);
  const primary = getAssetUrl(src);
  // Only use stock fallbacks when the product has no uploaded image.
  // If an upload URL fails (404, server restart), show placeholder — not unrelated stock photos.
  const sources = primary ? [primary] : fallbacks;

  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFailed(false);
  }, [src, category]);

  const handleError = () => {
    if (index < sources.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setFailed(true);
    }
  };

  if (failed || sources.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200 dark:from-blue-950/60 dark:via-indigo-950/40 dark:to-blue-900/30 ${className}`}>
        {showPlaceholderIcon ? (
          <div className="text-center p-4">
            <Shirt size={48} className="mx-auto text-blue-300 dark:text-blue-600 mb-2" />
            <span className="text-2xl font-display font-bold text-blue-400 dark:text-blue-600">
              {name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        ) : (
          <span className="text-4xl font-bold text-blue-300 dark:text-blue-700">
            {name?.charAt(0)?.toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      key={sources[index]}
      src={sources[index]}
      alt={alt}
      className={`${imgClassName} ${className}`}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ProductImage;
