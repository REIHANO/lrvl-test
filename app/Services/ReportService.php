<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function paidTransactions(array $filters = [])
    {
        $from = $filters['from'] ?? now()->startOfMonth()->toDateString();
        $to = $filters['to'] ?? now()->toDateString();

        return Transaction::query()
            ->where('status', 'paid')
            ->whereBetween('created_at', ["{$from} 00:00:00", "{$to} 23:59:59"])
            ->with('customer')
            ->latest()
            ->get();
    }

    public function sales(array $filters = []): array
    {
        $from = $filters['from'] ?? now()->startOfMonth()->toDateString();
        $to = $filters['to'] ?? now()->toDateString();

        $paid = Transaction::query()
            ->where('status', 'paid')
            ->whereBetween('created_at', ["{$from} 00:00:00", "{$to} 23:59:59"]);

        $summary = (clone $paid)->selectRaw('COUNT(*) as orders, COALESCE(SUM(total_price), 0) as revenue')->first();

        $topProducts = DB::table('transaction_details as details')
            ->join('transactions as transactions', 'transactions.id', '=', 'details.transaction_id')
            ->join('products as products', 'products.id', '=', 'details.product_id')
            ->where('transactions.status', 'paid')
            ->whereBetween('transactions.created_at', ["{$from} 00:00:00", "{$to} 23:59:59"])
            ->select('products.id', 'products.name')
            ->selectRaw('SUM(details.quantity) as quantity, SUM(details.quantity * details.price) as revenue')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('quantity')
            ->limit(5)
            ->get();

        return [
            'filters' => compact('from', 'to'),
            'summary' => [
                'orders' => (int) $summary->orders,
                'revenue' => (float) $summary->revenue,
            ],
            'topProducts' => $topProducts,
            'transactions' => (clone $paid)->with('customer')->latest()->paginate(10)->withQueryString(),
        ];
    }
}
