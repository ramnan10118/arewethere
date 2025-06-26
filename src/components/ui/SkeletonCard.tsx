'use client'

export function SkeletonCard() {
  return (
    <div className="mb-4">
      <div className="transform scale-70 origin-top cursor-pointer">
        <div className="w-[500px] h-[500px] bg-[#2A2B3B] rounded-xl overflow-hidden">
          <div className="p-4">
            <div className="aspect-square bg-gray-700/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}