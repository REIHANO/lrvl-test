<?php

namespace App\Services;
use App\Models\Product;
use App\Services\StockHistoryService;

use Exception;

class CartService{

protected $stockService;

public function __construct(StockHistoryService $stockService)
{
    $this->stockService = $stockService;
}

public function getCart(): array
{
    return session()->get('cart', []);
}

public function addToCart(int $productId): Product
{
$product = Product::findOrFail($productId);
$currentStock = $this->stockService->getCurrentStock($product->id);

$cart = $this->getCart();
$currentCartQty = isset($cart[$productId]) ? $cart[$productId]['quantity'] :0;

if($currentStock <= $currentCartQty){
    throw new Exception("stok produk {$product->name} tidak mencukupi!");
}
if(isset($cart[$productId])){
    $cart[$productId]['quantity']++;
}else{
        $cart[$productId] =[
            'product_id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'image' => $product->image,
            'quantity'=> 1
        ];
}
session()->put('cart', $cart);

return $product;
}

public function removeFromCart(int $productId): void {
    $cart = $this->getCart();

    if(isset($cart[$productId])){
        unset($cart[$productId]);
        session()->put('cart', $cart);
    }
}

public function updateQuantity(int $productId, int $quantity): void
{
    $cart = $this->getCart();
    if (! isset($cart[$productId])) return;
    $product = Product::findOrFail($productId);
    $stock = $this->stockService->getCurrentStock($productId);
    if ($quantity < 1 || $quantity > $stock) {
        throw new Exception("Jumlah {$product->name} melebihi stok tersedia ({$stock}).");
    }
    $cart[$productId]['quantity'] = $quantity;
    session()->put('cart', $cart);
}

public function clear(): void
{
    session()->forget('cart');
}
}
