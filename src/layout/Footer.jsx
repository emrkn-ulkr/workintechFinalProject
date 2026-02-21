import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
          <h3 className="font-display text-lg font-semibold text-ink-900">WT Store</h3>
          <p className="mt-3 text-sm text-ink-500">
            Built for Workintech final project using React, Redux, Router v5 and Tailwind.
          </p>
        </div>
        <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-700">Pages</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/team">Team</Link>
          </div>
        </div>
        <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-700">Account</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/orders">Previous Orders</Link>
          </div>
        </div>
        <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-700">Contact</h4>
          <div className="mt-3 space-y-2 text-sm text-ink-500">
            <p>Istanbul, Turkey</p>
            <p>support@wtstore.dev</p>
            <p>+90 555 123 45 67</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-ink-500">
        © 2026 Workintech Final Project
      </div>
    </footer>
  );
}

export default Footer;
