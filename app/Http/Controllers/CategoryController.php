<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\CategoryRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Category::class);
        $categories = Category::withCount('products')->get();
        return Inertia::render('Categories/Index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Categories/Form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        $validated = $request->validated();

        Category::create($validated);
        return redirect()->route('categories.create')->with('success', 'Category created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('Categories/Form', compact('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)//untuk menerapkan prinsip Single Responsibility. Tugas validasi aturan form dipisah ke file Request tersendiri, sehingga fungsi update di Controller bisa tetap bersih, fokus, dan hanya menerima data yang sudah dijamin aman dan lolos sensor
    {
        $validated = $request->validated();// untuk mengambil data dari form yang sudah lolos validasi
        $category->update($validated); //mengeksekusi perintah untuk memperbarui kategori yang sudah ada di database
        return redirect()->route('categories.index')->with('success', 'Category updated successfully!'); //proses mengrakkan browser agar berpindah jalur  ke route lain demi keamanan alur data aplikasi 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return redirect()->route('categories.index')
                ->with('error', 'Kategori tidak dapat dihapus karena masih digunakan oleh produk.');
        }

        $category->delete();
        return redirect()->route('categories.index')->with('success', 'Category deleted successfully!');
    }
}
