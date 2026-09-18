<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\StockHistory;
use App\Models\Product;
use App\Services\StockHistoryService;
use Illuminate\Support\Facades\DB;
use Exception;

class TransactionService
{

    protected $stockService;

    public function __construct(StockHistoryService $stockService)
    {
        $this->stockService = $stockService;
    }
    public function createTransaction(array $data)
    {

        return DB::transaction(function () use ($data) {

            $transaction = transaction::create([
                'user_id' => auth()->id(),
                'invoice_number' => 'INV' . time() . rand(10, 99),
                'customer_name' => $data['customer_name'] ?? auth()->user()?->name,
                'customer_address' => $data['customer_address'] ?? auth()->user()?->address,
                'status' => 'pending',
                'total_price'    => 0,
            ]);

            $grandTotal = 0;

            foreach ($data['items'] as $item) {

                $product = Product::find($item['product_id']);

                

                if ($product->stock < $item['quantity']) {
                    throw new Exception("stock product '{$product->name}'tidak mencukupi");
                }

                $subTotalPerItem = $product->price * $item['quantity'];

                $grandTotal += $subTotalPerItem;

                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id'     => $product->id,
                    'quantity'       => $item['quantity'],
                    'price'          => $product->price,
                ]);

                

                $this->stockService->recordMutation([
                    'product_id' => $product->id,
                    'type'       => 'out',
                    'quantity'   => $item['quantity'],
                    'description' => "potong stock otomatis (transaksi'$transaction->invoice_number')",
                ]);
            }
            $transaction->update([
                'total_price' => $grandTotal
            ]);
            return $transaction;
        });
    }
}
