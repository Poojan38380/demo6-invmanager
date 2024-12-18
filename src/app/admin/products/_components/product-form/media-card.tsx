import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "./image-uploader";

export default function MediaCard({
  setProductImages,
}: {
  setProductImages: (files: File[]) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>
      <CardContent>
        <section id="media" className="space-y-4">
          <ImageUploader onImagesChange={setProductImages} />
        </section>
      </CardContent>
    </Card>
  );
}
