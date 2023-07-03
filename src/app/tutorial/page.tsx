"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Tutorial() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none">
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://smubia.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                By{' '}
                <Image
                  src="/smubia.png"
                  alt="Vercel Logo"
                  // className="dark:invert"
                  width={100}
                  height={24}
                  priority
                />
              </a>
            </div>
          </div>
          <text className='text-6xl'>
            Tutorial
          </text>
          <Link href="/detect">
            <text className="text-xl">
                Skip Tutorial
            </text>
          </Link>
        </main>
      );
}