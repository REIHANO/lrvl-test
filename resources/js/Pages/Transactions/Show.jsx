import { Link, useForm } from "@inertiajs/react";
import Layout, { Card, Button } from "../Layout";

export default function Show({ transaction }) {
    const payment = useForm({ payment_method: transaction.payment_method || "" });
    const paid = transaction.status === "paid";

    return (
        <Layout
            title="Detail Invoice"
            description="Periksa detail pesanan dan status pembayaran Anda."
        >
            <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_320px]">
                <Card>
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Invoice</p>
                            <h1 className="mt-1 text-xl font-extrabold text-amber-700">{transaction.invoice_number}</h1>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${paid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {paid ? "Paid" : "Pending"}
                        </span>
                    </div>
                    <div className="grid gap-2 border-b border-slate-100 py-5 text-sm sm:grid-cols-2">
                        <p><span className="text-slate-500">Customer:</span> {transaction.customer_name || transaction.customer?.name}</p>
                        <p><span className="text-slate-500">Email:</span> {transaction.customer?.email || "-"}</p>
                        <p><span className="text-slate-500">Metode pembayaran:</span> {transaction.payment_method ? paymentMethods[transaction.payment_method] : "Belum dipilih"}</p>
                        <p className="sm:col-span-2"><span className="text-slate-500">Alamat pengiriman:</span> {transaction.customer_address || "-"}</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {transaction.transaction_details?.map((detail) => (
                            <div className="flex items-center justify-between gap-4 py-4 text-sm" key={detail.id}>
                                <div>
                                    <p className="font-semibold">{detail.product?.name || "Produk"}</p>
                                    <p className="text-slate-500">{detail.quantity} × Rp {Number(detail.price).toLocaleString("id-ID")}</p>
                                </div>
                                <p className="font-bold">Rp {(Number(detail.price) * detail.quantity).toLocaleString("id-ID")}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="h-fit">
                    <p className="text-sm text-slate-500">Total pembayaran</p>
                    <p className="mt-2 text-2xl font-extrabold">Rp {Number(transaction.total_price).toLocaleString("id-ID")}</p>
                    {!paid ? (
                        <form onSubmit={(event) => {
                            event.preventDefault();
                            payment.patch(`/transactions/${transaction.id}/pay`);
                        }}>
                            <label className="mt-5 block text-sm font-semibold text-slate-700">
                                Pilih metode pembayaran
                                <select
                                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal"
                                    value={payment.data.payment_method}
                                    onChange={(event) => payment.setData("payment_method", event.target.value)}
                                    required
                                >
                                    <option value="">Pilih metode</option>
                                    {Object.entries(paymentMethods).map(([value, label]) => (
                                        <option value={value} key={value}>{label}</option>
                                    ))}
                                </select>
                            </label>
                            {payment.errors.payment_method && <p className="mt-2 text-xs text-red-600">{payment.errors.payment_method}</p>}
                            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Ini adalah simulasi pembayaran. Setelah memilih metode, klik tombol konfirmasi.</p>
                            <Button
                                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                                disabled={payment.processing}
                            >
                                {payment.processing ? "Memproses…" : "Konfirmasi pembayaran"}
                            </Button>
                        </form>
                    ) : (
                        <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700">Transaksi berhasil dibayar.</p>
                    )}
                    <Link href="/transactions" className="mt-4 block text-center text-sm font-semibold text-slate-500">← Kembali ke pesanan</Link>
                </Card>
            </div>
        </Layout>
    );
}

const paymentMethods = {
    dana: "DANA",
    gopay: "GoPay",
    ovo: "OVO",
    va_bca: "Virtual Account BCA",
    va_mandiri: "Virtual Account Mandiri",
};
