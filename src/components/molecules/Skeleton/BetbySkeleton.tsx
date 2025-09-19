'use client'

// Skeleton component for reusable animated elements
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-app-neutral600 rounded ${className}`} />
)

export default function BetbySkeleton() {
  return (
    <div className='min-h-screen w-full bg-app-background-primary text-white overflow-auto scrollbar-hide'>
      {/* Desktop Layout - Hidden on mobile */}
      <div className='hidden lg:flex h-screen'>
        {/* Left Sidebar */}
        <div className='w-80 bg-app-background-primary p-4 space-y-4'>
          {/* Top Navigation Icons */}
          <div className='flex space-x-4 mb-6'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='w-10 h-10 rounded-lg' />
            ))}
          </div>

          {/* Sport Categories */}
          <div className='grid grid-cols-2 gap-3 mb-6'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='w-full h-20 rounded-lg' />
                <Skeleton className='w-16 h-4' />
                <Skeleton className='w-12 h-3' />
              </div>
            ))}
          </div>

          {/* League List */}
          <div className='space-y-3'>
            <Skeleton className='w-20 h-5' />
            {[...Array(8)].map((_, i) => (
              <div key={i} className='flex items-center justify-between py-2'>
                <div className='flex items-center space-x-3'>
                  <Skeleton className='w-6 h-6 rounded-full' />
                  <div className='space-y-1'>
                    <Skeleton className='w-32 h-4' />
                    <Skeleton className='w-24 h-3' />
                  </div>
                </div>
                <Skeleton className='w-8 h-6 rounded' />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-6 space-y-6'>
          {/* Top Navigation Tabs */}
          <div className='flex space-x-6'>
            {['HIGHLIGHTS', 'EVENT BUILDER', 'BETS FEED'].map((_, i) => (
              <Skeleton key={i} className='w-32 h-10 rounded' />
            ))}
          </div>

          {/* Promo Banner */}
          <Skeleton className='w-full h-48 rounded-xl' />

          {/* Betting Cards */}
          <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='bg-app-neutral600 rounded-lg p-4 space-y-3 h-[148px] animate-pulse'></div>
            ))}
          </div>

          {/* Tournament Section */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Skeleton className='w-6 h-6' />
              <Skeleton className='w-32 h-6' />
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
              <Skeleton className='w-full h-64 rounded-lg' />
              <div className='space-y-4'>
                <Skeleton className='w-40 h-6' />
                <div className='space-y-3'>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className='flex justify-between items-center'>
                      <div className='flex items-center space-x-3'>
                        <Skeleton className='w-6 h-4' />
                        <Skeleton className='w-24 h-4' />
                      </div>
                      <div className='flex space-x-4'>
                        <Skeleton className='w-16 h-4' />
                        <Skeleton className='w-16 h-4' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Hidden on desktop */}
      <div className='lg:hidden'>
        {/* Top Navigation */}
        <div className='flex items-center justify-between p-4 bg-app-background-secondary'>
          <div className='flex space-x-4'>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className='w-8 h-8 rounded' />
            ))}
          </div>
          <div className='flex items-center space-x-3'>
            <Skeleton className='w-8 h-8 rounded-full' />
            <Skeleton className='w-8 h-8 rounded' />
          </div>
        </div>

        {/* Tab Navigation */}

        <div className='p-4 space-y-6'>
          {/* Promo Banner */}
          <Skeleton className='w-full h-40 rounded-xl' />

          {/* Betting Cards */}
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='bg-app-neutral600 animate-pulse rounded-lg p-4 space-y-3 h-[148px]'></div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className='flex justify-center space-x-2'>
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className='w-2 h-2 rounded-full' />
            ))}
          </div>

          {/* Sports Categories Grid */}
          <div className='grid grid-cols-3 gap-3'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='w-full h-16 rounded-lg' />
                <Skeleton className='w-16 h-3 mx-auto' />
                <Skeleton className='w-12 h-3 mx-auto' />
              </div>
            ))}
          </div>

          {/* League List */}
          <div className='space-y-3'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='flex items-center space-x-3 py-2'>
                <Skeleton className='w-6 h-6 rounded-full' />
                <div className='flex-1 space-y-1'>
                  <Skeleton className='w-32 h-4' />
                  <Skeleton className='w-24 h-3' />
                </div>
              </div>
            ))}
          </div>

          {/* Tournament Section */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Skeleton className='w-6 h-6' />
              <Skeleton className='w-32 h-6' />
            </div>
            <Skeleton className='w-full h-48 rounded-lg' />
            <div className='text-center space-y-3'>
              <Skeleton className='w-48 h-6 mx-auto' />
              <Skeleton className='w-24 h-4 mx-auto' />
              <div className='flex justify-center space-x-4'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='text-center space-y-1'>
                    <Skeleton className='w-8 h-8 mx-auto' />
                    <Skeleton className='w-12 h-3 mx-auto' />
                  </div>
                ))}
              </div>
              <Skeleton className='w-40 h-10 mx-auto rounded-full' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
