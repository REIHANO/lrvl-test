<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Http\Requests\ProductRequest;
use Illuminate\Http\Request;
use App\Services\ProductService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected ProductService $productService;

    use AuthorizesRequests;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }
    public function index(Request $request)
    {
        $categories = Category::all();

        $query = Product::query(); //membuat query builder untuk model Product, yang akan digunakan untuk membangun query database secara dinamis berdasarkan kondisi yang diberikan oleh pengguna melalui request.  
        $query->with('category'); //untuk memuat relasi 'category' pada model Product, sehingga ketika data produk diambil dari database, informasi kategori terkait juga akan diambil dalam satu query. Hal ini membantu mengurangi jumlah query yang dieksekusi dan meningkatkan performa aplikasi.
        $query->withSum(['stockHistories as total_in' => function ($query) {
            $query->where('type', 'in');
        }], 'quantity')
            ->withSum(['stockHistories as total_out' => function ($query) {
                $query->where('type', 'out');
            }], 'quantity');

        if ($request->filled('search')) { //untuk memeriksa apakah parameter 'search' ada dalam request dan tidak kosong. Jika kondisi ini terpenuhi, maka kode di dalam blok if akan dieksekusi.
            $query->where('name', 'like', '%' . $request->search . '%'); //untuk menambahkan kondisi pencarian pada query builder, dimana nama produk harus mengandung kata kunci yang diinputkan oleh pengguna. Operator 'like' digunakan untuk mencocokkan pola dalam string, dan '%' digunakan sebagai wildcard untuk mencocokkan karakter apa pun sebelum atau sesudah kata kunci pencarian.
        }

        if ($request->filled('category_id')) { //untuk memeriksa apakah parameter 'category_id' ada dalam request dan tidak kosong. Jika kondisi ini terpenuhi, maka kode di dalam blok if akan dieksekusi.
            $query->where('category_id', $request->category_id); //untuk menambahkan kondisi filter berdasarkan kategori pada query builder, dimana 'category_id' harus sama dengan nilai yang diinputkan oleh pengguna. Hal ini memungkinkan pengguna untuk melihat produk yang hanya termasuk dalam kategori tertentu.
        }


        $products = $query->paginate(5)->appends($request->all()); //untuk mengeksekusi query yang sudah dibangun dan mengambil hasilnya dalam bentuk paginasi dengan 5 item per halaman. Metode 'appends($request->all())' digunakan untuk memastikan bahwa parameter pencarian dan filter tetap ada saat pengguna berpindah halaman dalam hasil paginasi, sehingga pengalaman pengguna tetap konsisten.

        return Inertia::render('Products/Index', compact('products', 'categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Product::class);
        return Inertia::render('Products/Form', [
            'categories' => Category::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $validated = $request->validated();
        $this->authorize('create', Product::class);
        $this->productService->store($validated);

        return redirect('/products')->with('success', 'Product created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('category')->append('stock');

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $this->authorize('update', $product);
        return Inertia::render('Products/Form', [
            'product' => $product, //untuk mmengambil data produk
            'categories' => Category::all() // digunakan untuk menampilkan data select kategori pada form edit product
        ]);
    }

    /**
     * 
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $validated = $request->validated(); // untuk mengambil data dari form yang sudah lolos validasi

        $this->productService->update($product, $validated);

        return redirect('/products')->with('success', 'Product updated successfully!'); //proses mengrakkan browser agar berpindah jalur  ke route lain demi keamanan alur data aplikasi 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $this->productService->delete($product);

        return redirect('/products')->with('success', 'Product deleted successfully!');
    }
}
