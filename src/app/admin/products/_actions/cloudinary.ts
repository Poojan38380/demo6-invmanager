export const uploadImagesToCloudinary = async (files: File[]) => {
  const imageUrls: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.CLOUDINARY_UPLOAD_PRESET || ""
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    imageUrls.push(data.secure_url);
  }

  return imageUrls;
};
