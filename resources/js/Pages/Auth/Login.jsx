import { Link, useForm } from "@inertiajs/react";
import { Button, Field,} from "../Layout";
export default function Login() {
    const f = useForm({ email: "", password: "" });
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-5">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    f.post("/login");
                }}
                className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-extrabold">
                        Selamat datang di Nusantara Handmade
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Masuk untuk memesan kerajinan pilihan.
                    </p>
                </div>
                <Field
                    label="Email"
                    type="email"
                    value={f.data.email}
                    onChange={(e) => f.setData("email", e.target.value)}
                    error={f.errors.email}
                />
                <Field
                    label="Password"
                    type="password"
                    value={f.data.password}
                    onChange={(e) => f.setData("password", e.target.value)}
                    error={f.errors.password}
                />
                <Button className="w-full">Masuk</Button>
                <p className="mt-5 text-center text-sm text-slate-500">
                    Belum punya akun?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-amber-700"
                    >
                        Daftar
                    </Link>
                </p>
                <p className="mt-2 text-center text-sm text-slate-500">
                     <Link
                        href="/"
                        className="font-semibold text-amber-700"
                    >
                        Kembali ke beranda
                    </Link>
                </p>
            </form>
        </div>
    );
}
