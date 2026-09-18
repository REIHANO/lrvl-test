import { useForm, Link } from "@inertiajs/react";
import { useMemo } from "react";
import Layout, { Card, Button } from "../Layout";
export default function Create({ products }) {
    const f = useForm({ product_id: "", quantity: 1, description: "" });
    const selected = useMemo(
        () => products.find((p) => String(p.id) === String(f.data.product_id)),
        [products, f.data.product_id],
    );
    const available = Number(selected?.stock || 0);
    const submit = (e) => {
        e.preventDefault();
        if (Number(f.data.quantity) > available) {
            return;
        }
        if (confirm("Kurangi stok produk ini?")) f.post("/stock-adjustment");
    };
    return (
        <Layout
            title="Kurangi Stok"
            description="Catat kerajinan rusak, hilang, atau keluar dari persediaan."
        >
            <Card className="max-w-2xl">
                <form onSubmit={submit}>
                    <label className="mb-5 block text-sm font-semibold">
                        Pilih produk
                        <select
                            className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 font-normal"
                            value={f.data.product_id}
                            onChange={(e) => {
                                f.setData("product_id", e.target.value);
                                f.setData("quantity", 1);
                            }}
                        >
                            <option value="">Pilih kerajinan</option>
                            {products.map((p) => (
                                <option value={p.id} key={p.id}>
                                    {p.name} · stok tersedia:{" "}
                                    {Number(p.stock || 0)} unit
                                </option>
                            ))}
                        </select>
                    </label>
                    {selected && (
                        <div
                            className={`mb-5 rounded-2xl border p-4 ${available > 0 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
                        >
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Stok tersedia saat ini
                            </p>
                            <p
                                className={`mt-1 text-3xl font-extrabold ${available > 0 ? "text-emerald-700" : "text-red-700"}`}
                            >
                                {available}{" "}
                                <span className="text-sm font-medium">
                                    unit
                                </span>
                            </p>
                            {available === 0 && (
                                <p className="mt-1 text-xs text-red-600">
                                    Produk ini tidak dapat dikurangi karena stok
                                    habis.
                                </p>
                            )}
                        </div>
                    )}
                    <label className="mb-5 block text-sm font-semibold">
                        Jumlah yang dikurangi
                        <input
                            className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 font-normal"
                            type="number"
                            min="1"
                            max={available || 1}
                            value={f.data.quantity}
                            onChange={(e) =>
                                f.setData("quantity", e.target.value)
                            }
                            disabled={!selected || available === 0}
                        />
                        {selected && Number(f.data.quantity) > available && (
                            <span className="mt-1 block text-xs font-normal text-red-600">
                                Jumlah tidak boleh melebihi stok tersedia (
                                {available}).
                            </span>
                        )}
                    </label>
                    <label className="mb-5 block text-sm font-semibold">
                        Alasan / keterangan
                        <textarea
                            className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 font-normal"
                            rows="3"
                            value={f.data.description}
                            onChange={(e) =>
                                f.setData("description", e.target.value)
                            }
                        />
                    </label>
                    {(f.errors.product_id ||
                        f.errors.quantity ||
                        f.errors.description) && (
                        <p className="mb-4 text-xs text-red-600">
                            {f.errors.product_id ||
                                f.errors.quantity ||
                                f.errors.description}
                        </p>
                    )}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/stock-histories"
                            className="text-sm font-semibold text-slate-500"
                        >
                            Batal
                        </Link>
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            disabled={
                                !selected ||
                                available === 0 ||
                                Number(f.data.quantity) > available ||
                                f.processing
                            }
                        >
                            {f.processing ? "Menyimpan…" : "Kurangi stok"}
                        </Button>
                    </div>
                </form>
            </Card>
        </Layout>
    );
}
