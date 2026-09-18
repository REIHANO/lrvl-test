<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductService{

public function store(array $data ){
    return DB::transaction(function () use ($data){
    if(isset($data['image'])){
        $data['image'] = $data['image']->store('products', 'public');
    }

    $product = Product::create([
        'name'          => $data['name'],
        'description'   => $data['description'] ?? null,
        'price'         => $data['price'],
        'category_id'   => $data['category_id'],
        'rating'        => $data['rating'] ?? 0,
        'image'         => $data['image'] ?? null,
    ]);

    if(isset($data['initial_stock']) && (int)$data['initial_stock'] > 0){
        StockHistory::create ([
            'product_id' => $product->id,
            'quantity'   => (int)$data['initial_stock'],
            'type'       => 'in',
            'description'=> 'stok awal saat pendaftaran product',
        ]);
    }

    return $product;
    });


}

public function update(Product $product, array $data){
    if(isset($data['image'])){
        $data['image'] = $data['image']->store('products', 'public');

    }

    return $product->update([
        'name'       => $data['name'],
        'description'=> $data['description'] ?? null,
        'price'      => $data['price'],
        'category_id'=> $data['category_id'],
        'rating'     => $data['rating'] ?? 0,
        'image'      => $data['image'] ?? $product->image,
    ]);

    

}

public function delete(Product $product){
    if ($product->image) {
        Storage::disk('public')->delete($product->image);
    }
    return $product->delete();

}
}
