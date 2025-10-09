"use client"

import { useAuth } from '@/context/AuthContext';
import { Home, Power, Unplug, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

export default function Header() {
    const { user, logout, isAdmin } = useAuth();


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

            <div className='flex items-center gap-3'>
                <Link href="/pages/home" className="bg-amber-50 rounded-md p-2 text-orange-600">
                    <Home />
                </Link>
                {isAdmin && (
                    <Link href="/pages/manager" className="bg-amber-50 rounded-md p-2 text-orange-600">
                        <Users />
                    </Link>
                )}
                <span className='px-4 py-2 bg-amber-100 rounded-3xl'>{user ? user.username : ""}</span>
                <button onClick={logout} className="gap-2 flex items-center text-white bg-orange-500 rounded-full p-2">
                    <Power className="w-4 h-4" />
                </button>
            </div>

        </div>
    )
}
