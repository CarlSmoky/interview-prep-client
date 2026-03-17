import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AudioLines } from 'lucide-react';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-dvh bg-custom-dark">
      <header className="flex items-center gap-2 text-white font-medium text-3xl"> <AudioLines /><span>Ace the Interview + AI</span>
      </header>
      <Outlet />
    </div>
  ),
});
