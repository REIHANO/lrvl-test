<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockAdjustmentRequest;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Services\StockHistoryService;
use Exception;
use Inertia\Inertia;

class StockAdjustmentController extends Controller
{

    protected $stockService;

    public function __construct(StockHistoryService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function create()
    {
        $products = Product::all()->each->append('stock');
        return Inertia::render('StockAdjustment/Create', compact('products'));
    }

    public function store(StockAdjustmentRequest $request)
    {
        
        $validated = $request->validated();
        $validated['type'] = 'out';



        try {
            $this->stockService->recordMutation($validated);
            return redirect()->route('stock-histories.index')
                ->with('success', 'stock berhasil dikurangi(penyesuaian barang rusak/busuk)!!');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'gagal memproses stock' . $e->getMessage());
        }
    }
}
