
type TransactionRowSkeletonProps = {
  variant?: 'fiat' | 'crypto'
}

export default function TransactionRowSkeleton({ variant = 'fiat' }: TransactionRowSkeletonProps) {
  if (variant === 'crypto') {
    // 7-column desktop layout for CRYPTO
    return (
      <div className='p-4 rounded-[8px] transition-colors'>
        {/* Desktop (md+) */}
        <div className='hidden md:grid md:grid-cols-7 gap-4 items-start'>
          {/* time */}
          <div className='h-8 w-40 rounded bg-app-neutral600 animate-pulse' />

          {/* type */}
          <div className='h-8 w-24 rounded bg-app-neutral600 animate-pulse' />

          {/* blockchain */}
          <div className='h-8 w-40 rounded bg-app-neutral600 animate-pulse' />

          {/* token */}
          <div className='h-8 w-16 rounded bg-app-neutral600 animate-pulse' />

          {/* crypto amount */}
          <div className='h-8 w-12 rounded bg-app-neutral600 animate-pulse' />

          {/* fiat amount */}
          <div className='h-8 w-12 rounded bg-app-neutral600 animate-pulse' />

          {/* status + button area */}
          <div className='flex items-center justify-between'>
            {/* status */}
            <div className='h-8 w-20 rounded bg-app-neutral600 animate-pulse' />
            {/* button */}
            <div className='h-8 w-[90px] rounded-md bg-app-neutral600 animate-pulse' />
          </div>
        </div>

        {/* Mobile (<md) */}
        <div className='md:hidden space-y-3'>
          {/* row: time + status */}
          <div className='flex justify-between items-center'>
            <div className='h-3 w-32 rounded bg-app-neutral600 animate-pulse' />
            <div className='h-3 w-16 rounded bg-app-neutral600 animate-pulse' />
          </div>

          {/* row: "<blockchain>-<token>" | KRW | amount */}
          <div className='flex justify-between items-center'>
            <div className='h-8 w-[120px] rounded bg-app-neutral600 animate-pulse' />
            <div className='h-3 w-8 rounded bg-app-neutral600 animate-pulse' />
            <div className='h-8 w-[70px] rounded bg-app-neutral600 animate-pulse' />
          </div>

          {/* button (DETAIL) */}
          <div className='h-9 w-full rounded-md bg-app-neutral600 animate-pulse' />
        </div>
      </div>
    )
  }

  // Default: FIAT (6 columns)
  return (
    <div className='p-4 rounded-[8px] transition-colors'>
      {/* Desktop (md+) */}
      <div className='hidden md:grid md:grid-cols-6 gap-4 items-start'>
        {/* time */}
        <div className='h-8 w-40 rounded bg-app-neutral600 animate-pulse' />

        {/* type */}
        <div className='h-8 w-24 rounded bg-app-neutral600 animate-pulse' />

        {/* currency */}
        <div className='h-8 w-10 rounded bg-app-neutral600 animate-pulse' />

        {/* amount */}
        <div className='h-8 w-24 rounded bg-app-neutral600 animate-pulse' />

        {/* status */}
        <div className='h-8 w-20 rounded bg-app-neutral600 animate-pulse' />

        {/* button */}
        <div className='flex justify-end'>
          <div className='h-8 w-[120px] rounded-md bg-app-neutral600 animate-pulse' />
        </div>
      </div>

      {/* Mobile (<md) */}
      <div className='md:hidden space-y-3'>
        {/* time + status */}
        <div className='flex justify-between items-center'>
          <div className='h-3 w-32 rounded bg-app-neutral600 animate-pulse' />
          <div className='h-3 w-16 rounded bg-app-neutral600 animate-pulse' />
        </div>

        {/* type | KRW | amount */}
        <div className='flex justify-between items-center'>
          <div className='h-8 w-[100px] rounded bg-app-neutral600 animate-pulse' />
          <div className='h-3 w-8 rounded bg-app-neutral600 animate-pulse' />
          <div className='h-8 w-[70px] rounded bg-app-neutral600 animate-pulse' />
        </div>

        {/* button */}
        <div className='h-9 w-full rounded-md bg-app-neutral600 animate-pulse' />
      </div>
    </div>
  )
}
