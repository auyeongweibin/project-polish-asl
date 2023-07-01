"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
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
          <Link href="/detect">
            <text className="animate-pulse text-6xl font-mono
            ">
                Project Polish - ASL
            </text>
          </Link>
          <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 before:lg:h-[360px]">
          </div>
          {/* <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          </div> */}
        </main>
      );
}