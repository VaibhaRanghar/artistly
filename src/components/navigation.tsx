"use client";

import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  SignedIn, 
  SignedOut,
  useUser
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  const navItems = [
    { href: "/", label: "Home" },
    ...(role === "ARTIST" 
      ? [{ href: "/events", label: "Find Events" }]
      : [{ href: "/artists", label: "Find Artists" }]
    )
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-white/10 bg-[#0d0d0d]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#f5e642] flex items-center justify-center border-2 border-[#f5e642] group-hover:bg-transparent transition-colors">
              <span className="text-black group-hover:text-[#f5e642] font-bold text-lg font-mono transition-colors">A</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Artistly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold tracking-wide transition-colors uppercase ${
                  isActive(item.href)
                    ? "text-[#f5e642]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <SignedIn>
              <Link
                href="/dashboard"
                className={`text-sm font-semibold tracking-wide transition-colors uppercase ${
                  pathname.startsWith("/dashboard")
                    ? "text-[#f5e642]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <div className="pl-4 border-l border-white/10">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-white/70 uppercase tracking-wide hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-bold uppercase tracking-wide bg-[#f5e642] text-black px-4 py-2 border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border border-white/20 text-white hover:border-[#f5e642] hover:text-[#f5e642] transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10"
            >
              <div className="py-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                      isActive(item.href)
                        ? "text-[#f5e642] bg-[#f5e642]/10"
                        : "text-white/70 hover:text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-sm font-bold uppercase tracking-wide text-white/70 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </SignedIn>
                <SignedOut>
                  <div className="px-4 pt-2 flex flex-col gap-2">
                    <SignInButton mode="modal">
                      <button className="w-full py-3 text-sm font-bold uppercase border border-white/20 text-white hover:border-white transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="w-full py-3 text-sm font-bold uppercase bg-[#f5e642] text-black hover:bg-[#f5e642]/80 transition-colors">
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
