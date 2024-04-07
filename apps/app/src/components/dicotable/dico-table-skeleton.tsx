import { Skeleton } from '@/components/ui/skeleton'

export const DicoTableSkeleton = () => (
  <div className="flex flex-col m-4 space-y-2">
    <Skeleton className="h-8 w-full" />
    <div className="space-x-2 flex flex-row">
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
    </div>
    <div className="space-x-2 flex flex-row">
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
    </div>
    <div className="space-x-2 flex flex-row">
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
      <Skeleton className="w-1/6 h-[25px]" />
    </div>
  </div>
)
