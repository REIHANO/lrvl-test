import { Link, useForm, usePage } from "@inertiajs/react";
import Layout, { Card, Button } from "../Layout";
export default function Index({ transactions }) {
    const { auth } = usePage().props;
    const admin = auth?.user?.role === "admin";
    const f = useForm();
    const update = (id, status) =>
        f.patch(`/transactions/${id}/status`, { status });
    const pay = (id) => f.patch(`/transactions/${id}/pay`);
    return (
        <Layout
            title={admin ? "Tracking Pesanan" : "Pesanan Saya"}
            description={
                admin
                    ? "Pantau pembayaran seluruh customer."
                    : "Lihat status pesanan kerajinan Anda."
            }
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-3xl font-extrabold">
                        {transactions.total || transactions.data.length}
                    </p>
                    <p className="text-sm text-slate-500">
                        {admin ? "total pesanan customer" : "pesanan Anda"}
                    </p>
                </div>
            </div>
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="p-4">Invoice</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status pembayaran</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.data.map((t) => (
                                <tr
                                    className="border-t border-slate-100"
                                    key={t.id}
                                >
                                    <td className="p-4 font-semibold text-amber-700">
                                        <Link
                                            href={`/transactions/${t.id}`}
                                            className="hover:underline"
                                        >
                                            {t.invoice_number}
                                        </Link>
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
                                    <td>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${t.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                                        >
                                            {t.status === "paid"
                                                ? "Sudah dibayar"
                                                : "Menunggu pembayaran"}
                                        </span>
                                    </td>
                                    <td>
                                        {admin ? (
                                            t.status === "pending" ? (
                                                <Button
                                                    className="px-3 py-1.5 text-xs"
                                                    onClick={() =>
                                                        update(t.id, "paid")
                                                    }
                                                    disabled={f.processing}
                                                >
                                                    Tandai paid
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-slate-400">
                                                    Selesai
                                                </span>
                                            )
                                        ) : t.status === "pending" ? (
                                            <Button
                                                className="bg-amber-500 px-3 py-1.5 text-xs"
                                                onClick={() => pay(t.id)}
                                                disabled={f.processing}
                                            >
                                                Saya sudah bayar
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-emerald-600">
                                                Pembayaran diterima
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!transactions.data.length && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-10 text-center text-slate-500"
                                    >
                                        Belum ada pesanan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </Layout>
    );
}
