import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BackButton from "../../../_components/sidebar/back-button";
import ReturnForm from "../_components/ReturnForm";

export default function FileNewReturnPage() {
  return (
    <Card className="border-none shadow-none bg-background">
      <CardHeader className="max-w-5xl mx-auto">
        <BackButton title="File New Return" />
      </CardHeader>
      <CardContent className="max-768:px-0">
        <ReturnForm />
      </CardContent>
    </Card>
  );
}
