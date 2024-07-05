import { useEffect, useState } from "react";

const fallbackImage =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const ImageWithFallback2 = ({ src, alt }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <img
      alt={alt}
      src={error ? fallbackImage : src}
      className="w-full h-full object-center object-contain"
    />
  );
};

export default ImageWithFallback2;
