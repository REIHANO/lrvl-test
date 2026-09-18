<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'invoice_number', 'customer_name', 'customer_address', 'total_price', 'status'];

    protected $casts = ['total_price' => 'decimal:2'];

    public function customer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
