import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Card, Button, Field, EmptyState } from "../Components/UI";
import Footer from "./Footer";
export { Card, Button, Field, EmptyState };

const navigation = [
    ["/dashboard", "Dashboard"],
    ["/products", "Katalog Kerajinan"],
    ["/categories", "Kategori"],
    ["/transactions", "Pesanan Customer"],
    ["/reports/sales", "Laporan Penjualan"],
    ["/stock-histories", "Persediaan"],
];

export default function Layout({ children, title, description }) {
    const { auth, flash = {}, cartCount = 0 } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const customer = auth?.user?.role === "customer";
    const links = customer
        ? navigation.filter(([href]) =>
              ["/products", "/transactions"].includes(href),
          )
        : navigation;
    return (
        <div className="min-h-screen bg-[#f8f7f4] text-slate-800">
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-6 shadow-xl transition-transform duration-200 lg:z-20 lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
                aria-label="Navigasi utama"
            >
                <header className="mb-10 flex items-start justify-between">
                    <div>
                    <h1 className="text-lg font-extrabold">Nusantara Handmade</h1>
                    <p className="text-xs text-slate-400">
                        Toko kerajinan pilihan
                    </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg p-2 text-xl text-slate-500 hover:bg-slate-100 lg:hidden"
                        aria-label="Tutup menu"
                    >
                        ×
                    </button>
                </header>
                <nav aria-label="Menu utama">
                    <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[.2em] text-slate-400">
                        Menu utama
                    </p>
                    <ul className="space-y-1">
                        {links.map(([href, label]) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-800"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {customer && (
                    <Link
                        href="/cart"
                        onClick={() => setMobileOpen(false)}
                        className="mt-3 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-3 text-sm font-semibold text-amber-800"
                        aria-label={`Keranjang, ${cartCount} item`}
                    >
                        <span>Keranjang</span>
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs text-slate-900">
                            {cartCount}
                        </span>
                    </Link>
                )}
                <footer className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-900 p-4 text-white">
                    <p className="text-xs text-slate-400">Akun aktif</p>
                    <p className="mt-1 truncate text-sm font-semibold">
                        {auth?.user?.name || auth?.user?.email || "Pengelola"}
                    </p>
                    <p className="mt-1 text-[11px] uppercase text-slate-400">
                        {auth?.user?.role || "user"}
                    </p>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="mt-3 text-xs text-amber-300"
                    >
                        Keluar akun →
                    </Link>
                </footer>
            </aside>
            {mobileOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Tutup navigasi"
                />
            )}
            <main className="min-h-screen lg:ml-72">
                <header className="border-b border-slate-200 bg-white/80 px-5 py-5 lg:px-10">
                    <div className="mx-auto flex max-w-7xl items-start gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="-ml-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-lg leading-none text-slate-700 shadow-sm lg:hidden"
                            aria-label="Buka menu navigasi"
                            aria-expanded={mobileOpen}
                        >
                            ☰
                        </button>
                        <div>
                        <p className="text-xs font-semibold uppercase tracking-[.2em] text-amber-600">
                            Nusantara Handmade
                        </p>
                        <h2 className="mt-1 text-2xl font-extrabold">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-1 text-sm text-slate-500">
                                {description}
                            </p>
                        )}
                        </div>
                    </div>
                </header>
                <div
                    className="mx-auto max-w-7xl p-5 lg:p-10"
                    aria-live="polite"
                >
                    {flash.success && <Alert>{flash.success}</Alert>}
                    {flash.error && <Alert type="error">{flash.error}</Alert>}
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
}
export function Alert({ children, type = "success" }) {
    return (
        <div
            role="alert"
            className={`mb-5 rounded-xl border px-4 py-3 text-sm ${type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
        >
            {children}
        </div>
    );
}
