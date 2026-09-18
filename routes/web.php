<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StockHistoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');
});

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/profile', [AuthController::class, 'editProfile'])->name('profile.edit');
    Route::patch('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}', [ProductController::class, 'show'])
        ->whereNumber('product')
        ->name('products.show');
    Route::get('/checkout', fn () => redirect()->route('cart.index'))->name('checkout');
    Route::get('/checkout/{product}', [CartController::class, 'checkout'])->name('checkout.product');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::patch('/transactions/{transaction}/pay', [TransactionController::class, 'pay'])->name('transactions.pay');
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/{id}', [CartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');

    Route::middleware('role:admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('categories', CategoryController::class);
        Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
            ->whereNumber('product')
            ->name('products.edit');
        Route::put('/products/{product}', [ProductController::class, 'update'])
            ->whereNumber('product')
            ->name('products.update');
        Route::patch('/products/{product}', [ProductController::class, 'update'])
            ->whereNumber('product')
            ->name('products.update.patch');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])
            ->whereNumber('product')
            ->name('products.destroy');
        Route::get('/stock-histories', [StockHistoryController::class, 'index'])->name('stock-histories.index');
        Route::post('/stock-histories', [StockHistoryController::class, 'store'])->name('stock-histories.store');
        Route::get('/stock-adjustment/create', [StockAdjustmentController::class, 'create'])->name('stock-adjustment.create');
        Route::post('/stock-adjustment', [StockAdjustmentController::class, 'store'])->name('stock-adjustment.store');
        Route::patch('/transactions/{transaction}/status', [TransactionController::class, 'updateStatus'])->name('transactions.status');
        Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
        Route::get('/reports/sales/export', [ReportController::class, 'exportSales'])->name('reports.sales.export');
    });
});
