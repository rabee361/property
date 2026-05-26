import { Outlet } from 'react-router-dom'
import BuyerTopbar from './BuyerTopbar'

const BuyerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-neutral-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-dark/10 blur-3xl dark:bg-brand-gold/10" />
      </div>

      <div className="relative z-10">
        <BuyerTopbar />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default BuyerLayout
