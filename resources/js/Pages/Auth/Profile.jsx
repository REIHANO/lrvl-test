import { useForm } from "@inertiajs/react";
import Layout, { Card, Button, Field } from "../Layout";

export default function Profile({ user }) {
    const form = useForm({ name: user.name || "", address: user.address || "" });
    return (
        <Layout title="Profil Saya" description="Kelola data customer dan alamat pengiriman.">
            <Card className="max-w-2xl">
                <form onSubmit={(event) => { event.preventDefault(); form.patch("/profile"); }}>
                    <Field label="Nama lengkap" value={form.data.name} onChange={(event) => form.setData("name", event.target.value)} error={form.errors.name} />
                    <Field label="Email" value={user.email} disabled />
                    <Field label="Alamat pengiriman" as="textarea" rows="4" value={form.data.address} onChange={(event) => form.setData("address", event.target.value)} error={form.errors.address} />
                    <Button disabled={form.processing}>{form.processing ? "Menyimpan…" : "Simpan perubahan"}</Button>
                </form>
            </Card>
        </Layout>
    );
}
