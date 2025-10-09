import { Unplug } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function Header() {
  return (
    <div className='border-gray-300 flex justify-between px-10 py-6 backdrop-blur-sm sticky top-0 z-10'>
        <div className='flex items-center gap-3'>
            <Image
                height={40}
                width={40}
                src="/favicon.png"
                alt="Logo chicken Nation"
                className="rounded-md object-cover"
            />
            <span className='font-bold text-xl text-orange-600'>Cartes de la nation</span>
        </div>

        {/* <div className='flex items-center gap-3'>
            <span>Username |</span>
            <button className="gap-2 flex items-center text-white bg-orange-500 rounded-md px-5 py-2">
                <Unplug className="w-4 h-4" />
                Déconnexion
            </button>
        </div> */}
        
    </div>
  )
}
