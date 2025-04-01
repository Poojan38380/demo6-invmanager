import { ProductReportDataType } from "../_actions/getProductReportData";

export default function ProductReport({
  product,
}: {
  product: ProductReportDataType;
}) {
  return <>{product.creator.username}</>;
}
