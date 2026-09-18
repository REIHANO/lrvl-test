export default function Footer() {
    return (
        <footer className="border-t border-[#e8e1d9] bg-[#faf8f5] px-5 py-8 text-center">
            <h2 className="font-bold">Nusantara Handmade</h2>
            <p className="mt-1 text-xs text-[#7a8494]">
                Toko kerajinan pilihan nusantara
            </p>
            <nav
                aria-label="Footer"
                className="mt-4 flex justify-center gap-4 text-xs font-medium"
            >
                <a href="#katalog">Katalog</a>
                <a href="#cerita">Cerita</a>
                <a href="mailto:halo@ruangkarya.test">Kontak</a>
            </nav>
            <p className="mt-5 text-[10px] text-[#7a8494]">
                © Nusantara Handmade 2026.
            </p>
        </footer>
    );
}
