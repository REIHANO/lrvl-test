<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StockHistory;
use App\Services\StockHistoryService;
use App\Models\Product;
use App\Http\Requests\StockHistoryRequest;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class StockHistoryController extends Controller
{
    protected $stockService;
    
    use AuthorizesRequests;

    public function __construct(StockHistoryService $stockService)
    {
        $this->stockService = $stockService;
    }
    public function index(Request $request)
    {
        $this->authorize('viewAny', StockHistory::class);
        $historiesQuery = StockHistory::with(['product'])->latest();
        if ($request->filled('product_id')) {
            $historiesQuery->where('product_id', $request->integer('product_id'));
        }
        $histories = $historiesQuery->paginate(10)->withQueryString();
       
        $products = Product::all();
            
        $totalIn = $this->stockService->getTotalStockIn();
        $totalOut = $this->stockService->getTotalStockOut();

        return Inertia::render('StockHistories/Index', [
            'histories' => $histories,
            'totalIn' => $totalIn,
            'totalOut' => $totalOut,
            'products' => $products,
            'filters' => $request->only('product_id'),
        ]);
    }

    public function store(StockHistoryRequest $request)
    {
        $validated  = $request->validated();
        $validated['type'] = 'in';

        try {
            $this->stockService->recordMutation($validated);
            return redirect()->back()->with('success', 'stock add successfully!');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'gagal memproses stock' . $e->getMessage());
        }
    }
}
