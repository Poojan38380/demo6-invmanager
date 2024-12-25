export default function ProductSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
      <div className="aspect-square w-full bg-muted rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
        <div className="h-8 w-1/3 bg-muted rounded" />
      </div>
    </div>
  );
}
