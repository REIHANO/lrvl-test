<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLoginForm(){ return Inertia::render('Auth/Login'); }
    public function showRegisterForm(){ return Inertia::render('Auth/Register'); }

    public function editProfile()
    {
        return Inertia::render('Auth/Profile', ['user' => request()->user()]);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'min:10', 'max:1000'],
        ]);
        $request->user()->update($data);
        return back()->with('success', 'Profil dan alamat berhasil diperbarui.');
    }

    public function login(LoginRequest $request)
    {
        if (Auth::attempt($request->validated())) {
            $request->session()->regenerate();
            return redirect()->intended(Auth::user()->role === 'admin' ? route('dashboard') : route('products.index'))->with('success', 'Login successful!');
        }
        return back()->withErrors(['email'=>'The provided credentials do not match our records.','password'=>'The provided password is incorrect.'])->onlyInput('email');
    }

    public function register(RegisterRequest $request)
    {
        $user = User::create([...$request->validated(), 'role'=>'customer']);
        Auth::login($user);
        $request->session()->regenerate();
        return redirect()->route('products.index')->with('success', 'Akun customer berhasil dibuat.');
    }

    public function logout(Request $request)
    {
        Auth::logout(); $request->session()->invalidate(); $request->session()->regenerateToken();
        return redirect('/')->with('success', 'Logged out successfully!');
    }
}
