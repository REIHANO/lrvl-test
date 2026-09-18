import { Link, useForm } from "@inertiajs/react";
import { Button, Field } from "../Layout";
export default function Register() {
    const f = useForm({
        name: "",
        email: "",
        address: "",
        password: "",
        password_confirmation: "",
    });
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-5">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    f.post("/register");
                }}
                className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-extrabold">
                        Buat akun customer
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Daftar untuk mulai membeli kerajinan.
                    </p>
                </div>
                <Field
                    label="Nama lengkap"
                    value={f.data.name}
                    onChange={(e) => f.setData("name", e.target.value)}
                    error={f.errors.name}
                />
                <Field
                    label="Email"
                    type="email"
                    value={f.data.email}
                    onChange={(e) => f.setData("email", e.target.value)}
                    error={f.errors.email}
                />
                <Field
                    label="Alamat"
                    as="textarea"
                    rows="3"
                    value={f.data.address}
                    onChange={(e) => f.setData("address", e.target.value)}
                    error={f.errors.address}
                />
                <Field
                    label="Password"
                    type="password"
                    value={f.data.password}
                    onChange={(e) => f.setData("password", e.target.value)}
                    error={f.errors.password}
                />
                <Field
                    label="Konfirmasi password"
                    type="password"
                    value={f.data.password_confirmation}
                    onChange={(e) =>
                        f.setData("password_confirmation", e.target.value)
                    }
                    error={f.errors.password_confirmation}
                />
                <Button className="w-full" disabled={f.processing}>
                    {f.processing ? "Mendaftarkan…" : "Daftar sebagai customer"}
                </Button>
                <p className="mt-5 text-center text-sm text-slate-500">
                    Sudah punya akun?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-amber-700"
                    >
                        Masuk
                    </Link>
                </p>
            </form>
        </div>
    );
}
