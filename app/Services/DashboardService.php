<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function summary(): array
    {
        $paid = Transaction::where('status', 'paid');
        $summary = (clone $paid)->selectRaw('COUNT(*) as paid_orders, COALESCE(SUM(total_price), 0) as revenue')->first();
        $topProducts = DB::table('transaction_details as details')->join('transactions', 'transactions.id', '=', 'details.transaction_id')->join('products', 'products.id', '=', 'details.product_id')->where('transactions.status', 'paid')->select('products.id', 'products.name')->selectRaw('SUM(details.quantity) as quantity')->groupBy('products.id', 'products.name')->orderByDesc('quantity')->limit(5)->get();
        $lowStock = Product::with('category')->get()->filter(fn(Product $product) => $product->stock <= 5)->sortBy('stock')->take(5)->values();
        $sales = (clone $paid)->where('created_at', '>=', now()->subDays(6)->startOfDay())->get(['created_at', 'total_price']);
        $salesChart = collect(range(6, 0))->map(function (int $days) use ($sales) {
            $date = now()->subDays($days);
            return [
                'label' => $date->translatedFormat('D'),
                'date' => $date->toDateString(),
                'total' => (float) $sales->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])->sum('total_price'),
            ];
        })->values();

        return ['summary' => ['revenue' => (float)$summary->revenue, 'paidOrders' => (int)$summary->paid_orders, 'pendingOrders' => Transaction::where('status', 'pending')->count(), 'products' => Product::count()], 'salesChart' => $salesChart, 'topProducts' => $topProducts, 'lowStock' => $lowStock, 'recentOrders' => Transaction::with('customer')->latest()->limit(6)->get()];
    }
}
