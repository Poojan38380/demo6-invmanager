import { revalidatePath, revalidateTag } from "next/cache";

export default function cacheRevalidate({
  routesToRevalidate,
  tagsToRevalidate,
}: {
  routesToRevalidate: string[];
  tagsToRevalidate: string[];
}) {
  routesToRevalidate.forEach((route) => revalidatePath(route));
  tagsToRevalidate.forEach((tag) => revalidateTag(tag));
}
