import { StarOff } from 'lucide-react'
import React from 'react'

function BrandingTitle() {
  return (
    <div className='flex items-center justify-center gap-2'>
        <StarOff />
        <p className='font-black text-xl'>STSH</p>
    </div>
  )
}

export default BrandingTitle