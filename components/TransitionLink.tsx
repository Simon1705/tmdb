'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function TransitionLink({ href, children, className, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsTransitioning(true);

    // Wait for fade-out animation
    setTimeout(() => {
      router.push(href);
    }, 200);
  };

  return (
    <>
      <Link href={href} onClick={handleClick} className={className} {...props}>
        {children}
      </Link>
      
      {/* Fade overlay during transition */}
      {isTransitioning && (
        <div 
          className="fixed inset-0 bg-slate-950 z-[9999] pointer-events-none animate-fade-in"
          style={{ animation: 'fade-in 0.2s ease-out' }}
        />
      )}
    </>
  );
}
