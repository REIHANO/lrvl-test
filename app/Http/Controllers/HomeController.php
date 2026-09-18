<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;

class HomeController extends Controller
{
    public function index()
    {
        if (! Schema::hasTable('products')) {
            return Inertia::render('Home/Index', ['products' => [], 'categories' => [], 'articles' => $this->articles()]);
        }
        return Inertia::render('Home/Index', [
            'products' => Product::with('category')->latest()->limit(8)->get(),
            'categories' => Category::orderBy('name')->get(),
            'articles' => $this->articles(),
        ]);
    }

    private function articles(): array
    {
        return [
                ['title' => 'Cerita di balik setiap karya', 'text' => 'Mengenal proses dan tangan kreatif di balik produk pilihan Nusantara Handmade.'],
                ['title' => 'Memilih hadiah yang bermakna', 'text' => 'Ide kerajinan personal untuk momen spesial bersama orang terdekat.'],
                ['title' => 'Rawat karya favoritmu', 'text' => 'Tips sederhana agar kerajinan tetap indah dan tahan lama.'],
        ];
    }
}
