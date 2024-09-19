import * as React from "react";

interface IMarketPlaceImageProps {
  images: string[];
  title: string;
}

const MarketPlaceImage: React.FC<IMarketPlaceImageProps> = ({
  images,
  title,
}) => {
  return (
    <>
      {images.length > 0 ? (
        <img
          src={images[0]} // Show the first image if available
          alt={`${title} image`}
          className="w-full h-48 object-cover" // Adjust image height and maintain aspect ratio
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
    </>
  );
};

export default MarketPlaceImage;
