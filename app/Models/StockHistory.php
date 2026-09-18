<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Override;

class StockHistory extends Model
{
    protected $fillable = ['product_id', 'quantity', 'type', 'description' ];


    public function product(){

    return $this->belongsTo(Product::class);
    
    }
}
