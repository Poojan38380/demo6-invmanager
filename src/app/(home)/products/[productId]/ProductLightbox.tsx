"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ProductLightboxProps {
  slides: { src: string }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ProductLightbox = ({
  slides,
  initialIndex,
  isOpen,
  onClose,
}: ProductLightboxProps) => {
  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      index={initialIndex}
    />
  );
};

export default ProductLightbox;
