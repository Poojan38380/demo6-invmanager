"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploaderProps {
  onImagesChange: (images: File[]) => void;
  existingImages?: string[]; // Accept URLs of existing images
  onRemoveExistingImage?: (updatedUrls: string[]) => void; // Callback for updating parent state
}

export function ImageUploader({
  onImagesChange,
  existingImages = [],
  onRemoveExistingImage,
}: ImageUploaderProps) {
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] =
    useState<string[]>(existingImages);

  useEffect(() => {
    if (JSON.stringify(existingImageUrls) !== JSON.stringify(existingImages)) {
      setExistingImageUrls(existingImages);
    }
  }, [existingImages, existingImageUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const newImages = Array.from(e.target.files).filter((file) =>
        validImageTypes.includes(file.type)
      );

      if (newImages.length < e.target.files.length) {
        alert("Some files were not images and were skipped.");
      }

      setImages((prevImages) => {
        const updatedImages = [...prevImages, ...newImages];
        onImagesChange(updatedImages);
        return updatedImages;
      });
    }
  };

  const removeExistingImage = (index: number) => {
    const newUrls = existingImageUrls.filter((_, i) => i !== index);
    setExistingImageUrls(newUrls);
    if (onRemoveExistingImage) {
      onRemoveExistingImage(newUrls); // Notify parent component about the change
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
          </label>
        </div>
        {(images.length > 0 || existingImageUrls.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {existingImageUrls.map((url, index) => (
              <div
                key={`existing-${index}`}
                className="relative w-full aspect-square group shadow-md hover:shadow-lg rounded-lg overflow-hidden"
              >
                <Image
                  src={url}
                  alt={`Existing image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                  onClick={() => removeExistingImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {images.map((image, index) => (
              <div
                key={`uploaded-${index}`}
                className="relative w-full aspect-square group shadow-md hover:shadow-lg rounded-lg overflow-hidden"
              >
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Existing image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
