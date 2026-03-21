import { Gem } from 'lucide-react'

const Header = () => {
  return (
    <header className="flex items-center gap-2 text-white font-medium text-2xl lg:text-3xl p-4">
      <Gem />
      <span className="font-heading">Ace the Interview + AI</span>
    </header>
  )
}

export default Header