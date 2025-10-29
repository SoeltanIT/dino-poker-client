export const SkeletonDetail = () => {
  return (
    <div className='space-y-6'>
      {/* meta header block */}
      <div className='space-y-2'>
        {/* ID row */}
        <div className='h-4 w-[75%] bg-app-neutral600 rounded' />
        {/* created at row */}
        <div className='h-4 w-[50%] bg-app-neutral600 rounded' />
        {/* status row */}
        <div className='h-4 w-[40%] bg-app-neutral600 rounded' />
      </div>

      {/* divider-ish spacing */}
      <div className='space-y-6'>
        {/* Transaction No */}
        <div className='space-y-2'>
          <div className='h-4 w-[40%] bg-app-neutral600 rounded' /> {/* label */}
          <div className='h-8 w-[60%] bg-app-neutral600 rounded' /> {/* value */}
        </div>

        {/* Game Name */}
        <div className='space-y-2'>
          <div className='h-4 w-[35%] bg-app-neutral600 rounded' />
          <div className='h-8 w-[55%] bg-app-neutral600 rounded' />
        </div>

        {/* Table */}
        <div className='space-y-2'>
          <div className='h-4 w-[25%] bg-app-neutral600 rounded' />
          <div className='h-8 w-[50%] bg-app-neutral600 rounded' />
        </div>

        {/* Period */}
        <div className='space-y-2'>
          <div className='h-4 w-[20%] bg-app-neutral600 rounded' />
          <div className='h-8 w-[30%] bg-app-neutral600 rounded' />
        </div>

        {/* Bet Amount */}
        <div className='space-y-2'>
          <div className='h-4 w-[30%] bg-app-neutral600 rounded' />
          <div className='h-8 w-[40%] bg-app-neutral600 rounded' />
        </div>

        {/* Result Amount */}
        <div className='space-y-2'>
          <div className='h-4 w-[35%] bg-app-neutral600 rounded' />
          <div className='h-8 w-[45%] bg-app-neutral600 rounded' />
        </div>
      </div>
    </div>
  )
}
