<?php

namespace App\Services;

use App\Models\StockHistory;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Exception;

class StockHistoryService
{
    public function recordMutation(array $data)
    {


        $product = Product::findOrfail($data['product_id']);
        $quantity = (int)$data['quantity'];
        $type = $data['type'];

        if ($type === 'out') {
            $quantity = -abs($quantity);

            if ($product->stock < abs($quantity)) {
                throw new Exception("stock murni {$product->name} tidak mencukupi !!");
            }
        }else {
            $quantity = abs($quantity);
        }

        return StockHistory::create([
            'product_id' => $product->id,
            'type'       => $type,
            'quantity'   => $quantity,
            'description' => $data['description'] ?? 'pencatatan mutasi stock',
        ]);
    }

    public function getTotalStockOut()
    {
        return abs(StockHistory::where('type', 'out')->sum('quantity'));
    }

    public function getTotalStockIn()
    {
        return StockHistory::where('type', 'in')->sum('quantity');
    }
    public function getProductTotalOut($productId)
    {
        return abs(stockHistory::where('product_id', $productId)
            ->where('type', 'out')
            ->sum('quantity'));
    }
    /**
     * Mengambil sisa stok terbaru dari produk berdasarkan riwayat mutasi
     */
    public function getCurrentStock(int $productId): int
    {
        $currentStock = StockHistory::where('product_id', $productId)->sum('quantity');
        return $currentStock > 0 ? (int) $currentStock : 0;
    }
}
