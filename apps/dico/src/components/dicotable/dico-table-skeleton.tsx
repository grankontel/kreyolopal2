import { Skeleton } from '@/components/ui/skeleton'

export const DicoTableSkeleton = () => (
  <div className="m-4 flex flex-col space-y-2">
    <Skeleton className="h-8 w-full" />
    <div className="flex flex-row space-x-2">
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
    </div>
    <div className="flex flex-row space-x-2">
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
    </div>
    <div className="flex flex-row space-x-2">
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
      <Skeleton className="h-[25px] w-1/6" />
    </div>
  </div>
)
