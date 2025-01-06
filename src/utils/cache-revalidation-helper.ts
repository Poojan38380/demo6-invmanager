import { revalidatePath, revalidateTag } from "next/cache";

export default function cacheRevalidate({
  routesToRevalidate,
  tagsToRevalidate,
}: {
  routesToRevalidate: string[];
  tagsToRevalidate: string[];
}) {
  routesToRevalidate.forEach(async (route) => await revalidatePath(route));
  tagsToRevalidate.forEach(async (tag) => await revalidateTag(tag));
}
