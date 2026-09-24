import { useForm, Link } from "@inertiajs/react";
import Layout, { Card, Button, Field } from "../Layout";
export default function Form({ product, categories }) {
    const f = useForm({
        name: product?.name || "",
        description: product?.description || "",
        category_id: product?.category_id || "",
        price: product?.price || "",
        rating: product?.rating ?? 0,
        image: null,
    });
    const edit = !!product;
    return (
        <Layout title={edit ? "Edit Produk" : "Tambah Produk"}>
            <Card>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        edit
                            ? f.put(`/products/${product.id}`)
                            : f.post("/products");
                    }}
                >
                    <Field
                        label="Nama Produk"
                        value={f.data.name}
                        onChange={(e) => f.setData("name", e.target.value)}
                        error={f.errors.name}
                    />
                    <Field
                        label="Deskripsi Produk"
                        as="textarea"
                        rows="4"
                        value={f.data.description || ""}
                        onChange={(e) => f.setData("description", e.target.value)}
                        error={f.errors.description}
                    />
                    <label className="mb-4 block text-sm font-medium">
                        Kategori
                        <select
                            className="mt-1 w-full rounded-lg border p-2"
                            value={f.data.category_id}
                            onChange={(e) =>
                                f.setData("category_id", e.target.value)
                            }
                        >
                            <option value="">Pilih kategori</option>
                            {categories.map((c) => (
                                <option value={c.id} key={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Field
                        label="Harga"
                        type="number"
                        value={f.data.price}
                        onChange={(e) => f.setData("price", e.target.value)}
                        error={f.errors.price}
                    />
                    <Field
                        label="Rating (0–5)"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={f.data.rating}
                        onChange={(e) => f.setData("rating", e.target.value)}
                        error={f.errors.rating}
                    />
                    <Field
                        label="Gambar"
                        type="file"
                        onChange={(e) => f.setData("image", e.target.files[0])}
                        error={f.errors.image}
                    />
                    {edit && product.image_url && (
                        <img
                            src={product.image_url}
                            alt={`Gambar ${product.name}`}
                            className="mb-4 h-40 w-40 rounded-xl object-cover"
                        />
                    )}
                    <Link href="/products" className="mr-3 text-slate-600">
                        Kembali
                    </Link>
                    <Button>{edit ? "Update" : "Simpan"}</Button>
                </form>
            </Card>
        </Layout>
    );
}
