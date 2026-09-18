import { Link, useForm } from "@inertiajs/react";
import Layout, { Card, Button } from "../Layout";
export default function Sales({ filters, summary, topProducts, transactions }) {
    const f = useForm(filters);
    return (
        <Layout
            title="Laporan Penjualan"
            description="Ringkasan penjualan dari transaksi yang sudah dibayar."
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    f.get("/reports/sales");
                }}
                className="mb-6 flex flex-wrap items-end gap-3"
            >
                <label className="text-sm font-semibold">
                    Dari
                    <input
                        className="mt-1 block rounded-xl border border-slate-300 px-3 py-2 font-normal"
                        type="date"
                        value={f.data.from}
                        onChange={(e) => f.setData("from", e.target.value)}
                    />
                </label>
                <label className="text-sm font-semibold">
                    Sampai
                    <input
                        className="mt-1 block rounded-xl border border-slate-300 px-3 py-2 font-normal"
                        type="date"
                        value={f.data.to}
                        onChange={(e) => f.setData("to", e.target.value)}
                    />
                </label>
                <Button>Filter laporan</Button>
                <a
                    href={`/reports/sales/export?from=${encodeURIComponent(f.data.from || "")}&to=${encodeURIComponent(f.data.to || "")}`}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                    Export Excel
                </a>
            </form>
            <div className="mb-6 grid gap-4 md:grid-cols-2">
                <Card>
                    <p className="text-sm text-slate-500">Total pendapatan</p>
                    <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                        Rp {Number(summary.revenue).toLocaleString("id-ID")}
                    </p>
                </Card>
                <Card>
                    <p className="text-sm text-slate-500">Pesanan dibayar</p>
                    <p className="mt-2 text-3xl font-extrabold">
                        {summary.orders}
                    </p>
                </Card>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <h3 className="mb-4 font-bold">Produk terlaris</h3>
                    <div className="space-y-3">
                        {topProducts.map((p, i) => (
                            <div
                                className="flex items-center justify-between border-b border-slate-100 pb-3"
                                key={p.id}
                            >
                                <div>
                                    <span className="mr-2 text-xs text-slate-400">
                                        #{i + 1}
                                    </span>
                                    <b>{p.name}</b>
                                </div>
                                <span className="text-sm text-slate-500">
                                    {p.quantity} terjual
                                </span>
                            </div>
                        ))}
                        {!topProducts.length && (
                            <p className="text-sm text-slate-500">
                                Belum ada penjualan pada periode ini.
                            </p>
                        )}
                    </div>
                </Card>
                <Card>
                    <h3 className="mb-4 font-bold">Invoice dibayar</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-slate-500">
                                    <th className="pb-3">Invoice</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.map((t) => (
                                    <tr
                                        className="border-t border-slate-100"
                                        key={t.id}
                                    >
                                        <td className="py-3 font-semibold text-amber-700">
                                            {t.invoice_number}
                                        </td>
                                        <td>
                                            {t.customer_name ||
                                                t.customer?.name}
                                        </td>
                                        <td>
                                            Rp{" "}
                                            {Number(
                                                t.total_price,
                                            ).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <Link
                href="/products"
                className="mt-6 inline-block text-sm font-semibold text-slate-500"
            >
                ← Kembali ke katalog
            </Link>
        </Layout>
    );
}
