import { Link } from "@inertiajs/react";
import Layout, { Card } from "../Layout";

const quickNavigation = [
    ["/products", "Kelola produk", "Tambah dan perbarui katalog"],
    ["/categories", "Kategori", "Atur kategori produk"],
    ["/transactions", "Pesanan", "Pantau status pesanan"],
    ["/reports/sales", "Laporan penjualan", "Lihat analisis penjualan"],
    ["/stock-histories", "Persediaan", "Kelola stok produk"],
];

export default function Index({
    summary,
    salesChart = [],
    topProducts,
    lowStock,
    recentOrders,
}) {
    return (
        <Layout
            title="Dashboard Admin"
            description="Ringkasan aktivitas Nusantara Handmade hari ini."
        >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                    [
                        "Pendapatan",
                        `Rp ${Number(summary.revenue).toLocaleString("id-ID")}`,
                        "text-emerald-600",
                    ],
                    ["Pesanan paid", summary.paidOrders, "text-slate-900"],
                    ["Menunggu bayar", summary.pendingOrders, "text-amber-600"],
                    ["Total produk", summary.products, "text-blue-600"],
                ].map(([label, value, color]) => (
                    <Card key={label}>
                        <p className="text-sm text-slate-500">{label}</p>
                        <p className={`mt-2 text-2xl font-extrabold ${color}`}>
                            {value}
                        </p>
                    </Card>
                ))}
            </div>
            <Card className="mt-6">
                <div className="mb-4">
                    <h3 className="font-bold">Navigasi cepat</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Akses fitur admin yang paling sering digunakan.
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {quickNavigation.map(([href, label, description]) => (
                        <Link
                            href={href}
                            key={href}
                            className="group rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50"
                        >
                            <span className="flex items-center justify-between text-sm font-bold text-slate-700 group-hover:text-amber-800">
                                {label}
                                <span aria-hidden="true">→</span>
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">
                                {description}
                            </span>
                        </Link>
                    ))}
                </div>
            </Card>
            <Card className="mt-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold">Pendapatan 7 hari terakhir</h3>
                        <p className="mt-1 text-xs text-slate-500">Hanya transaksi dengan status paid</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Penjualan</span>
                </div>
                <div className="flex h-52 items-end gap-2 sm:gap-4" aria-label="Grafik pendapatan tujuh hari terakhir">
                    {salesChart.map((day) => {
                        const highest = Math.max(...salesChart.map((item) => item.total), 1);
                        const height = day.total ? Math.max((day.total / highest) * 100, 8) : 3;
                        return (
                            <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={day.date}>
                                <span className="text-[10px] font-semibold text-slate-500">
                                    {day.total ? `Rp ${Number(day.total).toLocaleString("id-ID")}` : "-"}
                                </span>
                                <div className="flex h-full w-full items-end rounded-t-lg bg-slate-100">
                                    <div className="w-full rounded-t-lg bg-amber-500 transition-all" style={{ height: `${height}%` }} title={`${day.label}: Rp ${Number(day.total).toLocaleString("id-ID")}`} />
                                </div>
                                <span className="text-xs font-medium text-slate-500">{day.label}</span>
                            </div>
                        );
                    })}
                </div>
            </Card>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Card>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold">Produk terlaris</h3>
                        <Link
                            href="/reports/sales"
                            className="text-xs font-semibold text-amber-700"
                        >
                            Lihat laporan →
                        </Link>
                    </div>
                    {topProducts.map((p, i) => (
                        <div
                            className="flex justify-between border-b border-slate-100 py-3 text-sm"
                            key={p.id}
                        >
                            <span>
                                <span className="mr-2 text-slate-400">
                                    #{i + 1}
                                </span>
                                {p.name}
                            </span>
                            <b>{p.quantity} terjual</b>
                        </div>
                    ))}
                    {!topProducts.length && (
                        <p className="text-sm text-slate-500">
                            Belum ada penjualan paid.
                        </p>
                    )}
                </Card>
                <Card>
                    <h3 className="mb-4 font-bold">Stok menipis</h3>
                    {lowStock.map((p) => (
                        <div
                            className="flex justify-between border-b border-slate-100 py-3 text-sm"
                            key={p.id}
                        >
                            <span>{p.name}</span>
                            <b
                                className={
                                    p.stock <= 0
                                        ? "text-red-600"
                                        : "text-amber-600"
                                }
                            >
                                {p.stock} unit
                            </b>
                        </div>
                    ))}
                    {!lowStock.length && (
                        <p className="text-sm text-emerald-600">
                            Semua stok aman.
                        </p>
                    )}
                </Card>
            </div>
            <Card className="mt-6 overflow-hidden p-0">
                <div className="border-b border-slate-100 p-5">
                    <h3 className="font-bold">Pesanan terbaru</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-4">Invoice</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((t) => (
                                <tr
                                    className="border-t border-slate-100"
                                    key={t.id}
                                >
                                    <td className="p-4 font-semibold text-amber-700">
                                        {t.invoice_number}
                                    </td>
                                    <td>
                                        {t.customer_name ||
                                            t.customer?.name ||
                                            "Customer umum"}
                                    </td>
                                    <td>
                                        Rp{" "}
                                        {Number(t.total_price).toLocaleString(
                                            "id-ID",
                                        )}
                                    </td>
                                    <td>{t.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </Layout>
    );
}
