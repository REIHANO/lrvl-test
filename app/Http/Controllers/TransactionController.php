<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Services\TransactionService;
use App\Models\Transaction;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Exception;
use Inertia\Inertia;
use App\Http\Requests\TransactionStatusRequest;
use App\Http\Requests\PayTransactionRequest;
use App\Services\CartService;
class TransactionController extends Controller
{
    protected TransactionService $transactionService;
    protected CartService $cartService;

    use AuthorizesRequests;

    public function __construct(TransactionService $transactionService, CartService $cartService)
    {
       $this->transactionService = $transactionService;
       $this->cartService = $cartService;
    }

    public function index(){

   $this->authorize('viewAny', Transaction::class);

   $query = Transaction::with(['transactionDetails.product', 'customer'])->latest();
   if (auth()->user()->role === 'customer') {
       $query->where('user_id', auth()->id());
   }
   $transactions = $query->paginate(10);

   return Inertia::render('Transactions/Index', compact('transactions'));

    }

    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);
        $transaction->load(['transactionDetails.product', 'customer']);

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function create(){
        $this->authorize('create', Transaction::class);
        $products = Product::all();

        return Inertia::render('Transactions/Create', compact('products'));
    }

    public function updateStatus(TransactionStatusRequest $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);
        $transaction->update(['status' => $request->validated('status')]);

        return back()->with('success', "Status {$transaction->invoice_number} diperbarui.");
    }

    public function pay(PayTransactionRequest $request, Transaction $transaction)
    {
        abort_unless(auth()->user()->role === 'customer' && $transaction->user_id === auth()->id(), 403);
        abort_if($transaction->status === 'paid', 422, 'Pesanan ini sudah dibayar.');

        $transaction->update(['status' => 'paid']);
        return redirect()->route('transactions.show', $transaction)
            ->with('success', "Pembayaran {$transaction->invoice_number} berhasil dikonfirmasi.");
    }
    
    
    
    public function store(TransactionRequest $request){

    $this->authorize('create', Transaction::class);
    
    $validated = $request->validated();

    

    try{
        $transaction = $this->transactionService->createTransaction($validated);
        $this->cartService->clear();

        return redirect()->route('transactions.show', $transaction)
        ->with('success', "transaksi dengan nomor {$transaction->invoice_number} berhasil di proses!");

    }

    catch(Exception $e){

    return redirect()->back()
    ->withInput()
    ->with('error', 'gagal memproses transaksi'. $e->getMessage());
    }

    }
}
