import { Link, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Index({ products = [], categories = [], articles = [] }) {
    const { auth } = usePage().props;
    const loggedIn = Boolean(auth?.user);
    const [categoryId, setCategoryId] = useState("");
    const [search, setSearch] = useState("");
    const [loginPrompt, setLoginPrompt] = useState("");
    const featureImage = products.find((product) => product.image_url)?.image_url;
    const visible = useMemo(
        () =>
            products.filter((product) => {
                const matchesName = product.name
                    ?.toLowerCase()
                    .includes(search.trim().toLowerCase());
                const matchesCategory =
                    !categoryId || String(product.category_id) === String(categoryId);

                return matchesName && matchesCategory;
            }),
        [products, search, categoryId],
    );
    return (
        <div
            id="top"
            className="min-h-screen overflow-x-hidden bg-[#faf8f5] pb-28 text-[#0e1726]"
        >
            <Header />
            <main className="mx-auto max-w-md sm:max-w-3xl lg:max-w-5xl">
                <section className="relative isolate border-b border-[#e8e1d9]/50 px-5 pb-10 pt-8 sm:py-14">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-6 z-0 h-48 w-48 rounded-full bg-[#c97a32]/5 blur-2xl"
                    />
                    <div className="relative z-10">
                        <span className="inline-block rounded-sm bg-[#c97a32]/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-[#c97a32]">
                            Karya yang punya cerita
                        </span>
                        <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                            Temukan sesuatu yang dibuat dengan hati.
                        </h2>
                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#7a8494] sm:text-base">
                            Koleksi kerajinan unik untuk mempercantik ruang dan
                            memberi makna pada setiap hadiah.
                        </p>
                        <a
                            href="#katalog"
                            className="mt-7 inline-flex rounded-lg bg-[#0e1726] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#c97a32]"
                        >
                            Jelajahi karya →
                        </a>
                    </div>
                    <dl className="relative z-10 mt-8 grid grid-cols-3 border-t border-[#e8e1d9]/60 pt-5 text-center text-xs">
                        <div>
                            <dt className="text-[#7a8494]">Karya</dt>
                            <dd className="text-lg font-bold">100%</dd>
                        </div>
                        <div className="border-x border-[#e8e1d9]/70">
                            <dt className="text-[#7a8494]">Pengrajin lokal</dt>
                            <dd className="text-lg font-bold">42+</dd>
                        </div>
                        <div>
                            <dt className="text-[#7a8494]">Dampak</dt>
                            <dd className="text-lg font-bold">Etis</dd>
                        </div>
                    </dl>
                </section>
                <section className="px-5 py-6">
                    <article
                        className="relative isolate overflow-hidden rounded-2xl bg-[#0e1726] bg-cover bg-center p-5 text-white sm:p-7"
                        style={
                            featureImage
                                ? { backgroundImage: `url(${featureImage})` }
                                : undefined
                        }
                    >
                        <div
                            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0e1726]/95 via-[#0e1726]/80 to-[#0e1726]/45"
                            aria-hidden="true"
                        />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 sm:text-xs">
                            ● Sorotan komunitas
                        </p>
                        <h3 className="mt-2 max-w-2xl text-lg font-bold sm:text-2xl">
                            Dari sanggar desa ke ruang estetika Anda
                        </h3>
                        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-200 sm:text-sm">
                            Setiap ukiran, tenun, dan keramik mendukung
                            keberlanjutan hidup para perajin lokal Nusantara.
                        </p>
                    </article>
                </section>
                <section id="katalog" className="px-5 py-4">
                    <header className="mb-4">
                        <h2 className="text-2xl font-bold">Katalog produk</h2>
                        <p className="mt-1 text-xs text-[#7a8494]">
                            Kurasi karya tangan terbaik nusantara
                        </p>
                    </header>
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row">
                        <label className="sr-only" htmlFor="product-search">
                            Cari produk
                        </label>
                        <input
                            id="product-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nama produk..."
                            className="w-full rounded-xl border border-[#e8e1d9] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#c97a32] sm:max-w-xs"
                        />
                    </div>
                    <nav
                        aria-label="Filter kategori"
                        className="no-scrollbar flex gap-2 overflow-x-auto pb-4"
                    >
                        <button
                            type="button"
                            onClick={() => setCategoryId("")}
                            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${!categoryId ? "bg-[#0e1726] text-white" : "border border-[#e8e1d9] bg-[#f3efea]"}`}
                        >
                            Semua karya
                        </button>
                        {categories.map((categoryOption) => (
                            <button
                                type="button"
                                key={categoryOption.id}
                                onClick={() => setCategoryId(categoryOption.id)}
                                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${String(categoryId) === String(categoryOption.id) ? "bg-[#0e1726] text-white" : "border border-[#e8e1d9] bg-[#f3efea]"}`}
                            >
                                {categoryOption.name}
                            </button>
                        ))}
                    </nav>
                    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                        {visible.map((p) => (
                            <article
                                className="flex flex-col justify-between rounded-2xl border border-[#e8e1d9] bg-white p-3 shadow-sm"
                                key={p.id}
                            >
                                <div>
                                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f3efea]">
                                        {p.image_url ? (
                                            <img
                                                src={p.image_url}
                                                alt={p.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-5xl text-[#0e1726]/20">
                                                ✦
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-3 text-xs font-bold leading-snug">
                                        {p.name}
                                    </h3>
                                    <p className="mt-1 text-[11px] text-[#7a8494]">
                                        {p.category?.name || "Kerajinan lokal"}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between text-[11px]">
                                        <span className="font-semibold text-amber-600">★ {Number(p.rating || 0).toFixed(1)}</span>
                                        <span className={Number(p.stock || 0) > 0 ? "text-emerald-600" : "text-red-600"}>
                                            Stok: {Number(p.stock || 0)}
                                        </span>
                                    </div>
                                    {loggedIn ? (
                                        <Link
                                            href={`/products/${p.id}`}
                                            className="mt-2 inline-block text-[11px] font-bold text-[#c97a32] hover:underline"
                                        >
                                            Lihat detail →
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setLoginPrompt("detail")}
                                            className="mt-2 text-[11px] font-bold text-[#c97a32] hover:underline"
                                        >
                                            Lihat detail →
                                        </button>
                                    )}
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t border-[#e8e1d9] pt-2.5">
                                    <span className="text-xs font-extrabold">
                                        Rp{" "}
                                        {Number(p.price).toLocaleString(
                                            "id-ID",
                                        )}
                                    </span>
                                    {loggedIn ? (
                                        <Link
                                            href={`/checkout/${p.id}`}
                                            className="grid h-8 w-8 place-items-center rounded-full bg-[#0e1726] text-lg text-white hover:bg-[#c97a32]"
                                            aria-label={`Checkout ${p.name}`}
                                        >
                                            +
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setLoginPrompt("checkout")}
                                            className="grid h-8 w-8 place-items-center rounded-full bg-[#0e1726] text-lg text-white hover:bg-[#c97a32]"
                                            aria-label={`Login untuk checkout ${p.name}`}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                        {!visible.length && (
                            <p className="col-span-full py-10 text-center text-sm text-[#7a8494]">
                                Belum ada produk pada kategori ini.
                            </p>
                        )}
                    </div>
                </section>
                <section
                    id="cerita"
                    className="mt-4 border-t border-[#e8e1d9] bg-[#f3efea]/70 px-5 py-8"
                >
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#c97a32]">
                        Prinsip kami
                    </p>
                    <h2 className="mt-1 text-xl font-bold">
                        Dibuat oleh tangan Nusantara
                    </h2>
                    <div className="mt-5 space-y-3">
                        {[
                            [
                                "Autentik & dikerjakan manual",
                                "Setiap goresan ukir dan rajutan menyimpan karakter unik.",
                            ],
                            [
                                "Berdampak ke pengrajin lokal",
                                "Penghasilan yang adil untuk menjaga seni warisan tradisi.",
                            ],
                            [
                                "Kemasan ramah lingkungan",
                                "Dikemas aman dengan bahan daur ulang tanpa plastik berlebih.",
                            ],
                        ].map(([title, text]) => (
                            <article
                                className="rounded-xl border border-[#e8e1d9] bg-white p-3.5"
                                key={title}
                            >
                                <h3 className="text-xs font-bold">{title}</h3>
                                <p className="mt-1 text-[11px] leading-relaxed text-[#7a8494]">
                                    {text}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
                <section className="px-5 py-8">
                    <h2 className="text-base font-bold">
                        Cerita dari Nusantara Handmade
                    </h2>
                    <div className="mt-4 space-y-3">
                        {articles.map((a) => (
                            <article
                                className="rounded-xl border border-[#e8e1d9] bg-white p-4"
                                key={a.title}
                            >
                                <h3 className="text-sm font-bold">{a.title}</h3>
                                <p className="mt-1 text-xs leading-relaxed text-[#7a8494]">
                                    {a.text}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
            {loginPrompt && (
                <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/50 px-5" role="dialog" aria-modal="true" aria-labelledby="login-required-title">
                    <form className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onSubmit={(event) => event.preventDefault()}>
                        <h2 id="login-required-title" className="text-xl font-extrabold">Login diperlukan</h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            {loginPrompt === "checkout"
                                ? "Anda wajib login untuk memasukkan produk ke keranjang dan melanjutkan checkout."
                                : "Anda wajib login untuk melihat detail produk dan melanjutkan pesanan."}
                        </p>
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button type="button" onClick={() => setLoginPrompt(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">Batal</button>
                            <Link href="/login" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700">Ke halaman login</Link>
                        </div>
                    </form>
                </div>
            )}
            <nav
                aria-label="Navigasi mobile"
                className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e8e1d9] bg-white/95 shadow-[0_-4px_20px_rgba(14,23,38,.05)] backdrop-blur-lg md:hidden"
            >
                <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2 text-[10px] font-semibold">
                    <a
                        href="#top"
                        className="flex flex-col items-center gap-0.5 text-[#0e1726]"
                    >
                        ⌂<span>Beranda</span>
                    </a>
                    <a
                        href="#katalog"
                        className="flex flex-col items-center gap-0.5 text-[#7a8494]"
                    >
                        ⌕<span>Jelajah</span>
                    </a>
                    <Link
                        href="/login"
                        className="flex flex-col items-center gap-0.5 text-[#7a8494]"
                    >
                        ♙<span>Akun</span>
                    </Link>
                    <Link
                        href="/login"
                        className="flex flex-col items-center gap-0.5 text-[#7a8494]"
                    >
                        🛒<span>Keranjang</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
