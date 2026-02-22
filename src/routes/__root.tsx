import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AudioLines } from 'lucide-react';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-dvh bg-black">
      <div className="flex gap-2 text-white"> <AudioLines /><span>Ace the Interview + AI</span></div>
      <Outlet />
    </div>
  ),
});
