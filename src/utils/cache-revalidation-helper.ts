import { revalidatePath, revalidateTag } from "next/cache";

export default function cacheRevalidate({
  routesToRevalidate,
  tagsToRevalidate,
}: {
  routesToRevalidate: string[];
  tagsToRevalidate: string[];
}) {
  tagsToRevalidate.forEach((tag) => revalidateTag(tag));
  routesToRevalidate.forEach((route) => revalidatePath(route));
}
