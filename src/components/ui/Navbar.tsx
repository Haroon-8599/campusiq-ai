"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Sparkles,
  Search,
  Scale,
  Bookmark,
  Users,
  LayoutDashboard,
  Menu,
  X,
  Compass,
  User as UserIcon,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const selectedColleges = useCompareStore((state) => state.selectedColleges);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", href: "/search", icon: Compass },
    { name: "AI Predictor", href: "/predictor", icon: Sparkles, isAI: true },
    {
      name: "Compare",
      href: "/compare",
      icon: Scale,
      count: selectedColleges.length,
    },
    { name: "Community", href: "/community", icon: Users },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto w-full max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300",
          isScrolled
            ? "bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_15px_40px_-15px_rgba(37,99,235,0.12),0_4px_16px_rgba(0,0,0,0.03)]"
            : "bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06)]"
        )}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1px] shadow-[0_4px_12px_rgba(37,99,235,0.25)] group-hover:shadow-[0_4px_18px_rgba(37,99,235,0.4)] transition-all">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-slate-900">CampusIQ</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-white tracking-wider">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "text-blue-700 bg-blue-50/80 shadow-sm border border-blue-100/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    link.isAI
                      ? "text-blue-600 animate-pulse"
                      : isActive
                      ? "text-blue-600"
                      : "text-slate-500"
                  )}
                />
                <span>{link.name}</span>

                {link.isAI && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200/60 rounded-full font-bold">
                    PRO
                  </span>
                )}

                {link.count !== undefined && link.count > 0 && (
                  <span className="ml-0.5 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center shadow-[0_2px_6px_rgba(37,99,235,0.4)]">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons: Quick Search & Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Search trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-500 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:text-slate-900 transition-all group"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span>Search colleges...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-500 border border-slate-200 font-mono shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Bookmarks link */}
          <Link
            href="/saved"
            className={cn(
              "p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-all relative",
              pathname === "/saved" && "text-blue-700 bg-blue-50 border border-blue-100"
            )}
            title="Saved Colleges"
          >
            <Bookmark className="w-4 h-4" />
          </Link>

          {/* Auth State */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {session.user.name?.[0] || "U"}
                </div>
                <span className="text-xs font-semibold text-slate-700 hidden lg:inline-block max-w-[90px] truncate">
                  {session.user.name?.split(" ")[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{session.user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Student Profile
                  </Link>
                  {(session.user as any)?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-purple-700 hover:bg-purple-50 transition-all font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin Console
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all gloss-sweep"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl p-4 shadow-2xl z-50 pointer-events-auto md:hidden animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{link.name}</span>
                  </div>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-xs font-bold text-white flex items-center justify-center">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
