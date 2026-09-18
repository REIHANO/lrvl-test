import { Link, useForm } from "@inertiajs/react";
import Layout, { Card, Button } from "../Layout";
export default function Index({ categories }) {
    const f = useForm();
    return (
        <Layout title="Kategori">
            <div className="mb-4">
                <Link href="/categories/create">
                    <Button>+ Tambah Kategori</Button>
                </Link>
            </div>
            <Card>
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-3">No</th>
                            <th>Nama</th>
                            <th>Produk</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c, i) => (
                            <tr className="border-t" key={c.id}>
                                <td className="p-3">{i + 1}</td>
                                <td>{c.name}</td>
                                <td>{c.products_count} produk</td>
                                <td>
                                    <Link
                                        className="mr-3 text-indigo-600"
                                        href={`/categories/${c.id}/edit`}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="text-red-600"
                                        onClick={() =>
                                            c.products_count > 0
                                                ? alert("Kategori tidak dapat dihapus karena masih digunakan oleh produk.")
                                                : confirm("Hapus kategori ini?") &&
                                            f.delete(`/categories/${c.id}`)
                                        }
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </Layout>
    );
}
