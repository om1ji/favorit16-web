"use client";

import React from "react";
import { ProductImage } from "@/types/api";
import Image from "next/image";

interface ProductImageCarouselProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  productName,
}) => {
  if (!images.length) {
    return (
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400">Нет изображения</span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-image-container">
      <div className="main-image-wrapper">
        <Image
          src={images[0].image}
          alt={images[0].alt_text || productName}
          className="main-image"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
};

export default ProductImageCarousel;
