import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-cs2";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Crosshair, LogIn, Plus, User as UserIcon, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
              <Crosshair size={20} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Skin<span className="text-primary">Swap</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Marketplace
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-24 h-9 bg-muted rounded-md animate-pulse" />
          ) : user ? (
            <>
              <Button asChild variant="outline" size="sm" className="hidden sm:flex border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all">
                <Link href="/inventory" className="flex items-center gap-2">
                  <Plus size={16} className="text-primary" />
                  <span>My Inventory</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border/50 hover:border-primary/50 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {user.displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.steamId}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/profile/${user.steamId}`} className="flex items-center w-full">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile & Inventory</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer sm:hidden">
                    <Link href="/inventory" className="flex items-center w-full text-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>My Inventory</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="bg-[#171a21] hover:bg-[#2a475e] text-white border border-[#2a475e] shadow-lg shadow-black/20">
              <a href="/api/auth/steam" className="flex items-center gap-2">
                <LogIn size={16} />
                <span>Login with Steam</span>
              </a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function PageWrapper({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex-1 container mx-auto px-4 py-8 ${className}`}
      >
        {children}
      </motion.main>
    </div>
  );
}
