import { useForm, Link } from "@inertiajs/react";
import Layout, { Card, Button, Field } from "../Layout";
export default function Form({ category }) {
    const f = useForm({ name: category?.name || "" });
    const edit = !!category;
    return (
        <Layout title={edit ? "Edit Kategori" : "Tambah Kategori"}>
            <Card>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        edit
                            ? f.put(`/categories/${category.id}`)
                            : f.post("/categories");
                    }}
                >
                    <Field
                        label="Nama Kategori"
                        value={f.data.name}
                        onChange={(e) => f.setData("name", e.target.value)}
                        error={f.errors.name}
                    />
                    <Link href="/categories" className="mr-3 text-slate-600">
                        Kembali
                    </Link>
                    <Button>{edit ? "Update" : "Simpan"}</Button>
                </form>
            </Card>
        </Layout>
    );
}
