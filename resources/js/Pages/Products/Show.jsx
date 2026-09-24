import { Link } from "@inertiajs/react";
import Layout, { Card, Button } from "../Layout";
export default function Show({ product }) {
    const stock = Number(product.stock || 0);
    return (
        <Layout
            title="Detail Kerajinan"
            description="Informasi lengkap produk pilihan Anda."
        >
            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="flex min-h-[380px] items-center justify-center p-6">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="max-h-[420px] w-full rounded-2xl object-contain"
                        />
                    ) : (
                        <div className="grid h-72 w-full place-items-center rounded-2xl bg-amber-50 text-7xl">
                            ✦
                        </div>
                    )}
                </Card>
                <div className="py-4">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {product.category?.name || "Kerajinan"}
                    </span>
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
                        {product.name}
                    </h1>
                    <p className="mt-4 text-3xl font-bold text-amber-700">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-amber-600">
                        ★ {Number(product.rating || 0).toFixed(1)} / 5
                    </p>
                    <p className="mt-5 leading-relaxed text-slate-600">
                        {product.description || "Belum ada deskripsi produk."}
                    </p>
                    <div
                        className={`mt-5 rounded-xl p-4 text-sm font-semibold ${stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                    >
                        {stock > 0
                            ? `Stok tersedia: ${stock} unit`
                            : "Stok sedang habis"}
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                        <Link
                            href="/products"
                            className="text-sm font-semibold text-slate-500"
                        >
                            ← Kembali
                        </Link>
                        {stock > 0 && (
                            <Link href={`/cart/${product.id}`} method="post">
                                <Button>+ Tambah ke keranjang</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
