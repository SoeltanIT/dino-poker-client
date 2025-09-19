import QRCode from 'react-qr-code'
import { forwardRef } from 'react'

interface QRProps {
  value: string
  size?: number
  fgColor?: string
  bgColor?: string
}

const MyQRCode = forwardRef<HTMLDivElement, QRProps>(
  ({ value, size = 256, fgColor = '#000', bgColor = '#fff' }, ref) => {
    return (
      <div ref={ref} className='inline-block p-4 rounded-md' style={{ backgroundColor: bgColor }}>
        <QRCode value={value} size={size} fgColor={fgColor} bgColor={bgColor} />
      </div>
    )
  }
)

MyQRCode.displayName = 'MyQRCode'

export default MyQRCode
