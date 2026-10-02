import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Layout() {
  return (
    <div className="flex h-screen max-w-full flex-col overflow-hidden bg-[#0b0e14]">
      <Navbar />
      {/* The page scrollbar. `scrollbar-gutter: stable` lives here rather than on
          <html> because <main> is the element that actually scrolls - reserving
          the gutter on a non-scrolling <html> only produced an empty white
          strip down the right edge. An explicit background means the reserved
          gutter is dark too, and the fixed width stops content shifting
          sideways when the scrollbar appears or disappears. */}
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#0b0e14] p-6 [scrollbar-gutter:stable]">
        <Outlet />
      </main>
    </div>
  );
}