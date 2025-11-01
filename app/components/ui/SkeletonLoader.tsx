export function SkeletonEvent() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-1"></div>
    </div>
  );
}

export function SkeletonMonthView() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="py-3 text-center">
            <div className="h-4 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="min-h-[120px] border-r border-b border-gray-200 p-2">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
