export default function ProductSkeleton() {
  return (
    <div className="flex items-center justify-between space-x-4 bg-white p-4 rounded-lg shadow-sm animate-pulse">
      <div className="flex-grow space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"></div>
    </div>
  );
} 