export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      {/* banner skeleton */}
      <div className="h-56 bg-gray-200 animate-pulse" />

      <div className="w-full px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* sidebar */}
        <div className="hidden md:block h-[500px] bg-gray-200 rounded-2xl animate-pulse" />

        {/* products */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
