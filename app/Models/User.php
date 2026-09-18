<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected  $fillable = ['name', 'email', 'address', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];//menyembunyikan kolom password dan remember_token secara otomatis ketika data user dikonversi ke dalam bentuk Array atau JSON
    protected function casts(): array//untuk menentukan bagaimana atribut tertentu harus dikonversi ketika diakses atau disimpan ke database
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',//untuk memastikan bahwa setiap kali atribut password diisi atau diperbarui, nilainya akan secara otomatis di-hash menggunakan algoritma hashing yang aman sebelum disimpan ke database
        ];
    }
}
