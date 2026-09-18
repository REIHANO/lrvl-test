<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::UpdateOrCreate(//untuk membuat data user baru dengan nama Admin, email dan password yang sudah di-hash menggunakan Hash::make untuk keamanan
            ['name' => 'Admin'],
            ['email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role'=> 'admin',]
             // Pastikan untuk menggunakan Hash::make untuk meng-hash password
        );

        User::UpdateOrCreate(
            ['name' => 'Customer Demo'],
            ['email' => 'customer@example.com', 'password' => Hash::make('password'), 'role' => 'customer']
        );
    }
}
