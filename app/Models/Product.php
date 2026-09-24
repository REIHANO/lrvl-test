<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;
class Product extends Model
{
    protected $primaryKey = 'id';
    protected $fillable = ['name', 'description', 'category_id', 'price', 'rating', 'image'];
    protected $casts = ['rating' => 'float'];
    protected $appends = ['stock', 'image_url'];

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image
                ? Storage::disk(config('filesystems.default'))->url($this->image)
                : null
        );
    }
    
    protected function stock(): Attribute
    {
        return Attribute::make(
            get: function (){
                return $this->stockHistories()->sum('quantity');
            }
        );
    }

    public function category()
    {
        return $this->belongsTo(Category::class);//setiap satu data produk hanya boleh dimiliki oleh satu data kategori
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);//untuk menyatakan hubungan relasi bahwa satu produk bisa memiliki banyak transaksi
    }

    public function stockHistories()
    {
        return $this->hasMany(StockHistory::class);
    }
    
      }
