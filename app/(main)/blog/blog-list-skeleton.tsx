import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Wir erstellen ein Array mit 3 Elementen für die 3 Cards */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="pt-0 flex flex-col h-full gap-y-3">
          {/* Image Skeleton (h-48 entspricht deinem Code) */}
          <div className="h-48 w-full">
            <Skeleton className="h-full w-full rounded-t-lg rounded-b-none" />
          </div>

          <CardContent className="flex-1 mt-6 space-y-4 gap-y-4">
            {/* Title Skeleton (h-8 für text-2xl) */}
            <Skeleton className="h-8 w-3/4" />

            {/* Body Text Skeletons (3 Zeilen für line-clamp-3) */}
            <div className="space-y-2 gap-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col pt-0">
            {/* Button Skeleton (h-10 ist Standard Button Höhe) */}
            <Skeleton className="h-10 w-full rounded-md" />

            {/* Timestamp Skeleton (h-3 für text-xs) */}
            <div className="pt-2 w-full flex justify-center">
              <Skeleton className="h-3 w-24" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
