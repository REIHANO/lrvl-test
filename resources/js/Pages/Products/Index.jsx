import { Link, useForm, usePage } from "@inertiajs/react";
import Layout, { Card, Button } from "../Layout";
export default function Index({ products, categories }) {
    const { auth } = usePage().props;
    const admin = auth?.user?.role === "admin";
    const q = useForm({
        search: new URLSearchParams(location.search).get("search") || "",
        category_id:
            new URLSearchParams(location.search).get("category_id") || "",
    });
    const d = useForm();
    const remove = (id) => {
        if (confirm("Hapus kerajinan ini?")) d.delete(`/products/${id}`);
    };
    return (
        <Layout
            title="Katalog Kerajinan"
            description={
                admin
                    ? "Kelola karya terbaik yang tersedia di toko."
                    : "Temukan kerajinan pilihan untuk pesanan Anda."
            }
        >
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
                {admin ? (
                    <Link href="/products/create">
                        <Button>+ Tambah kerajinan</Button>
                    </Link>
                ) : (
                    <div className="text-sm text-slate-500">
                        Pilih karya yang ingin Anda pesan.
                    </div>
                )}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        q.get("/products");
                    }}
                    className="flex flex-wrap gap-2"
                >
                    <input
                        className="rounded-xl border border-slate-300 px-3 py-2"
                        placeholder="Cari nama karya…"
                        value={q.data.search}
                        onChange={(e) => q.setData("search", e.target.value)}
                    />
                    <select
                        className="rounded-xl border border-slate-300 px-3 py-2"
                        value={q.data.category_id}
                        onChange={(e) =>
                            q.setData("category_id", e.target.value)
                        }
                    >
                        <option value="">Semua kategori</option>
                        {categories.map((c) => (
                            <option value={c.id} key={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <Button>Cari</Button>
                </form>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.data.map((p) => (
                    <Card
                        className="group flex h-full flex-col overflow-hidden p-0"
                        key={p.id}
                    >
                        <Link
                            href={`/products/${p.id}`}
                            className="relative block aspect-[4/3] overflow-hidden bg-amber-50"
                        >
                            {p.image ? (
                                <img
                                    src={`/storage/${p.image}`}
                                    alt={p.name}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="grid h-full place-items-center text-6xl text-amber-900/20">
                                    ✦
                                </div>
                            )}
                            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                                {p.category?.name || "Tanpa kategori"}
                            </span>
                        </Link>
                        <div className="flex flex-1 flex-col p-4">
                            <Link
                                href={`/products/${p.id}`}
                                className="text-lg font-bold hover:text-amber-700"
                            >
                                {p.name}
                            </Link>
                            <p className="mt-2 text-xl font-extrabold text-amber-700">
                                Rp {Number(p.price).toLocaleString("id-ID")}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-sm text-amber-600">
                                <span aria-hidden="true">★</span>
                                <span className="font-semibold">{Number(p.rating || 0).toFixed(1)}</span>
                                <span className="text-xs text-slate-400">/ 5</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                                <span>Stok tersedia</span>
                                <strong className={p.stock <= 0 ? "text-red-600" : p.stock <= 5 ? "text-amber-600" : "text-emerald-600"}>
                                    {p.stock} unit
                                </strong>
                            </div>
                            <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                                <Link
                                    href={`/products/${p.id}`}
                                    className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-amber-700"
                                >
                                    Lihat detail
                                </Link>
                                {admin && (
                                    <>
                                        <Link
                                            href={`/products/${p.id}/edit`}
                                            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => remove(p.id)}
                                            className="rounded-xl border border-red-100 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            Hapus
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            {!products.data.length && (
                <Card className="mt-5 py-12 text-center text-slate-500">
                    Produk tidak ditemukan.
                </Card>
            )}
        </Layout>
    );
}
