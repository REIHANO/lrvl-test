<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    public function sales(Request $request)
    {
        abort_unless($request->user()->role === 'admin', 403);
        return Inertia::render('Reports/Sales', $this->reportService->sales($request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ])));
    }

    public function exportSales(Request $request)
    {
        abort_unless($request->user()->role === 'admin', 403);
        $filters = $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ]);
        $transactions = $this->reportService->paidTransactions($filters);
        $from = $filters['from'] ?? now()->startOfMonth()->toDateString();
        $to = $filters['to'] ?? now()->toDateString();

        $rows = $transactions->map(fn ($transaction) => sprintf(
            '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%.2f</td></tr>',
            e($transaction->invoice_number),
            e($transaction->customer_name ?: $transaction->customer?->name ?: 'Customer umum'),
            e($transaction->customer?->email ?: '-'),
            e($transaction->created_at?->format('Y-m-d H:i:s')), 
            $transaction->total_price,
        ))->implode('');

        $html = '<table><thead><tr><th>Invoice</th><th>Customer</th><th>Email</th><th>Tanggal</th><th>Total</th></tr></thead><tbody>' . $rows . '</tbody></table>';

        return response("<html><head><meta charset=\"UTF-8\"></head><body><h2>Laporan Penjualan {$from} s/d {$to}</h2>{$html}</body></html>")
            ->header('Content-Type', 'application/vnd.ms-excel; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="laporan-penjualan-' . $from . '-sampai-' . $to . '.xls"');
    }
}
