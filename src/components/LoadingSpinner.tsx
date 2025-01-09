export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-200 animate-pulse"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full animate-spin">
          <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-600"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
} 