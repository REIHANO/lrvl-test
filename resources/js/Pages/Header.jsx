import { Link } from "@inertiajs/react";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 border-b border-[#e8e1d9]/70 bg-[#faf8f5]/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3 sm:max-w-3xl lg:max-w-5xl">
                <Link href="/">
                    <h1 className="text-xl font-extrabold">Nusantara Handmade</h1>
                    <p className="text-[11px] text-[#7a8494]">
                        Toko kerajinan pilihan
                    </p>
                </Link>
                <nav
                    aria-label="Akun"
                    className="flex items-center gap-3 text-xs font-semibold"
                >
                    <Link href="/login">Masuk</Link>
                    <Link
                        href="/register"
                        className="rounded-full bg-[#0e1726] px-3.5 py-2 text-white hover:bg-[#c97a32]"
                    >
                        Daftar
                    </Link>
                </nav>
            </div>
        </header>
    );
}
