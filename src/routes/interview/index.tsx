import { createFileRoute } from '@tanstack/react-router'
import Agent from '../../components/Agent'

export const Route = createFileRoute('/interview/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><Agent /></div>
}
