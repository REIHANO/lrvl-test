<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $primaryKey = 'id';// menegaskan kolom mana yang menjadi primarykey
    protected $fillable = ['name'];// kolom yang harus diisi
    
    public function products()
    {
        return $this->hasMany(Product::class);//untuk menyatakan hubungan relasi bahwa satu kategori bisa memiliki banyak produk
    }
}
