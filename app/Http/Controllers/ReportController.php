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

        $rows = $transactions->values()->map(fn ($transaction, $index) => sprintf(
            '<tr><td class="center">%d</td><td>%s</td><td>%s</td><td>%s</td><td class="date">%s</td><td class="currency">%.2f</td></tr>',
            $index + 1,
            e($transaction->invoice_number),
            e($transaction->customer_name ?: $transaction->customer?->name ?: 'Customer umum'),
            e($transaction->customer?->email ?: '-'),
            e($transaction->created_at?->format('d-m-Y H:i:s') ?: '-'),
            (float) $transaction->total_price,
        ))->implode('');

        $html = '<table class="report-table"><colgroup>'
            . '<col class="col-number"><col class="col-invoice"><col class="col-customer">'
            . '<col class="col-email"><col class="col-date"><col class="col-total">'
            . '</colgroup><thead><tr><th>No.</th><th>Invoice</th><th>Customer</th><th>Email</th><th>Tanggal</th><th>Total (Rp)</th></tr></thead>'
            . '<tbody>' . ($transactions->isEmpty() ? '<tr><td colspan="6" class="empty">Tidak ada transaksi pada periode ini.</td></tr>' : $rows) . '</tbody></table>';

        $styles = '<style>'
            . 'body{font-family:Arial,sans-serif;color:#1f2937}.title{font-size:16pt;font-weight:bold;margin-bottom:4px}'
            . '.period{color:#6b7280;margin-bottom:14px}.report-table{border-collapse:collapse;width:100%;table-layout:fixed}'
            . '.report-table th{background:#d97706;color:#fff;font-weight:bold;text-align:left;border:1px solid #b45309;padding:8px}'
            . '.report-table td{border:1px solid #d1d5db;padding:7px;vertical-align:top}.center{text-align:center}'
            . '.date{mso-number-format:"dd-mm-yyyy hh:mm:ss"}.currency{mso-number-format:"#,##0.00";text-align:right}'
            . '.empty{text-align:center;color:#6b7280}.col-number{width:45px}.col-invoice{width:150px}.col-customer{width:180px}'
            . '.col-email{width:220px}.col-date{width:145px}.col-total{width:125px}'
            . '</style>';

        return response("<html><head><meta charset=\"UTF-8\">{$styles}</head><body><div class=\"title\">Laporan Penjualan</div><div class=\"period\">Periode: {$from} s/d {$to}</div>{$html}</body></html>")
            ->header('Content-Type', 'application/vnd.ms-excel; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="laporan-penjualan-' . $from . '-sampai-' . $to . '.xls"');
    }
}
