import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  return (
    <>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-[120px] h-[40px] rounded-full" />
          <Skeleton className="w-[120px] h-[40px] rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="w-[75px] h-[20px] rounded-full" />
          <Skeleton className="w-[75px] h-[20px] rounded-full" />
        </div>
      </div>
      <div className="">
        <Skeleton className="w-full h-[550px] " />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-[100px] h-[20px] rounded-full" />
          <Skeleton className="w-[100px] h-[20px] rounded-full" />
        </div>
      </div>
    </>
  );
}
