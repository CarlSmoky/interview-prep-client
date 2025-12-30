import { createFileRoute } from "@tanstack/react-router";
import Map from "../components/map/index";

export const Route = createFileRoute("/")({
  component: Map,
});
