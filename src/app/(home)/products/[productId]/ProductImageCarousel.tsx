"use client";

import { ProductImage } from "@prisma/client";
import { useState, useMemo } from "react";
import Image from "next/image";
import ProductLightbox from "./ProductLightbox";
import "yet-another-react-lightbox/styles.css";

const placeholderImage =
  "https://res.cloudinary.com/dxvvg9nwf/image/upload/v1733234845/zup2ich88q9k8xhoyeuj.png";

export default function ProductImageCarousel({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const slides = useMemo(
    () =>
      images.length > 0
        ? images.map((image) => ({ src: image.url }))
        : [{ src: placeholderImage }],
    [images]
  );

  const mainImageSrc =
    images.length > 0 ? images[photoIndex].url : placeholderImage;
  const mainImageAlt =
    images.length > 0 ? `${name} - ${photoIndex + 1}` : "Placeholder image";

  return (
    <div className="p-8">
      <div
        className="aspect-square relative overflow-hidden rounded-lg mb-4 cursor-pointer"
        onClick={() => images.length > 0 && setIsOpen(true)}
      >
        <Image
          src={mainImageSrc}
          alt={mainImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`aspect-square relative overflow-hidden rounded-lg cursor-pointer ${
                index === photoIndex ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setPhotoIndex(index)}
            >
              <Image
                src={image.url}
                alt={`${name} - ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, (max-width: 1200px) 10vw, 5vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <ProductLightbox
        slides={slides}
        initialIndex={photoIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
