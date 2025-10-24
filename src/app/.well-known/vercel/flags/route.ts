import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    flags: [
      {
        key: 'showSports',
        description: 'Show Sports tab in header and navbar',
        origin: 'code',
        options: [
          { value: true, description: 'Sports visible' },
          { value: false, description: 'Sports hidden' }
        ]
      }
    ]
  })
}
