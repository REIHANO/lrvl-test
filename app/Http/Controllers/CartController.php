<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class CartController extends Controller
{
    public function __construct(protected CartService $cartService) {}

    public function index()
    {
        return Inertia::render('Cart/Index', ['cart' => array_values($this->cartService->getCart())]);
    }

    public function checkout(Product $product)
    {
        $this->cartService->addToCart($product->id);
        return redirect()->route('cart.index')->with('success', "{$product->name} ditambahkan ke keranjang.");
    }

    public function add($id)
    {
        try {
            $product = $this->cartService->addToCart((int) $id);
            return back()->with('success', "{$product->name} berhasil masuk ke keranjang.");
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $this->cartService->updateQuantity((int) $id, (int) $request->input('quantity'));
            return back()->with('success', 'Jumlah produk diperbarui.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function remove($id)
    {
        $this->cartService->removeFromCart((int) $id);
        return back()->with('success', 'Produk dihapus dari keranjang.');
    }
}
