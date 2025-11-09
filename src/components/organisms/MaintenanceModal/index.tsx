import { Dialog, DialogClose, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { DialogProps } from '@radix-ui/react-dialog'
import Image from 'next/image'

interface MaintenanceModalProps extends DialogProps {
  label?: string
}

export function MaintenanceModal({ label, ...props }: MaintenanceModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent className='bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-md'>
        <DialogHeader>
          <DialogClose />
        </DialogHeader>
        <div className='flex flex-col items-center justify-center py-8 px-4'>
          <Image
            src='/images/maintenance.png'
            alt='Maintenance'
            width={192}
            height={192}
            className='w-48 h-48 object-contain mb-6'
          />
          <h2 className='text-3xl text-gray-900 text-center'>{label}</h2>
        </div>
      </DialogContent>
    </Dialog>
  )
}
