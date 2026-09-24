import { Link, useForm, usePage, router } from "@inertiajs/react";
import Layout, { Card, Button, Field } from "../Layout";
export default function Index({ cart }) {
    const { auth } = usePage().props;
    const f = useForm({
        customer_name: auth?.user?.name || "",
        email: auth?.user?.email || "",
        items: cart.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
        })),
    });
    const total = cart.reduce(
        (sum, i) => sum + Number(i.price) * Number(i.quantity),
        0,
    );
    const update = (id, quantity) =>
        router.patch(`/cart/${id}`, { quantity }, { preserveScroll: true });
    const remove = (id) =>
        router.delete(`/cart/${id}`, { preserveScroll: true });
    return (
        <Layout
            title="Keranjang Belanja"
            description="Periksa kerajinan pilihan sebelum membuat pesanan."
        >
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <Card className="overflow-hidden p-0">
                    <div className="border-b border-slate-100 p-5">
                        <h3 className="font-bold">
                            Item pilihan ({cart.length})
                        </h3>
                    </div>
                    {cart.length ? (
                        cart.map((i) => (
                            <div
                                className="flex items-center gap-4 border-b border-slate-100 p-5"
                                key={i.product_id}
                            >
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-amber-50">
                                    {i.image_url ? (
                                        <img
                                            src={i.image_url}
                                            alt={i.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="grid h-full place-items-center text-2xl">
                                            ✦
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold">{i.name}</p>
                                    <p className="text-sm text-slate-500">
                                        Rp{" "}
                                        {Number(i.price).toLocaleString(
                                            "id-ID",
                                        )}
                                    </p>
                                </div>
                                <input
                                    className="w-20 rounded-xl border border-slate-300 p-2"
                                    type="number"
                                    min="1"
                                    value={i.quantity}
                                    onChange={(e) =>
                                        update(i.product_id, e.target.value)
                                    }
                                />
                                <p className="w-28 text-right font-semibold">
                                    Rp{" "}
                                    {(
                                        Number(i.price) * Number(i.quantity)
                                    ).toLocaleString("id-ID")}
                                </p>
                                <button
                                    className="text-red-600"
                                    onClick={() => remove(i.product_id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-slate-500">
                            Keranjang masih kosong.
                        </div>
                    )}
                </Card>
                <Card className="h-fit">
                    <h3 className="mb-4 text-lg font-bold">
                        Ringkasan pesanan
                    </h3>
                    <div className="mb-5 flex justify-between border-b pb-4 text-sm">
                        <span>Total</span>
                        <b>Rp {total.toLocaleString("id-ID")}</b>
                    </div>
                    {cart.length > 0 && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                f.post("/transactions");
                            }}
                        >
                            <Field
                                label="Nama customer"
                                value={f.data.customer_name}
                                onChange={(e) =>
                                    f.setData("customer_name", e.target.value)
                                }
                                error={f.errors.customer_name}
                            />
                            <Field
                                label="Email customer"
                                type="email"
                                value={f.data.email}
                                onChange={(e) =>
                                    f.setData("email", e.target.value)
                                }
                                error={f.errors.email}
                            />
                            <div className="mb-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                                <p className="font-semibold text-slate-700">Alamat pengiriman</p>
                                <p className="mt-1">{auth?.user?.address || "Alamat belum diatur."}</p>
                                <Link href="/profile" className="mt-2 inline-block text-xs font-semibold text-amber-700">Ubah alamat →</Link>
                            </div>
                            <Button className="w-full" disabled={f.processing}>
                                {f.processing
                                    ? "Memproses…"
                                    : "Checkout · Pending"}
                            </Button>
                        </form>
                    )}
                    <Link
                        href="/products"
                        className="mt-4 block text-center text-sm font-semibold text-slate-500"
                    >
                        ← Kembali ke katalog
                    </Link>
                </Card>
            </div>
        </Layout>
    );
}
