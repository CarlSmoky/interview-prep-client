import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-dvh bg-custom-dark font-body font-light">
      <Header />
      <Outlet />
      <Footer />
    </div >
  ),
});
