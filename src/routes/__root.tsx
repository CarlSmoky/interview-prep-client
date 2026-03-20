import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Gem } from 'lucide-react';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-dvh bg-custom-dark font-body font-light">
      <header className="flex items-center gap-2 text-white font-medium text-2xl lg:text-3xl p-4">
        <Gem /><span className="font-heading">Ace the Interview + AI</span>
      </header>
      <Outlet />
      <footer className="text-center text-sm text-gray-400 py-4">
        &copy; {new Date().getFullYear()} Ace the Interview + AI. All rights reserved.
      </footer>
    </div >
  ),
});
