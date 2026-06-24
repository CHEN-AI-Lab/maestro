export default function InvoicesLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="border-b bg-gray-50 px-6 py-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b last:border-0 flex items-center gap-4">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-4 bg-gray-100 rounded w-16 ml-auto" />
            <div className="h-4 bg-gray-100 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
