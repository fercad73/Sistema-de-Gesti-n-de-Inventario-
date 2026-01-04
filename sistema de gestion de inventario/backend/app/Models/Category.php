<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
        'icon'
    ];

    protected $appends = ['product_count'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function getProductCountAttribute()
    {
        return $this->products()->count();
    }

    public function scopeWithProductCount($query)
    {
        return $query->withCount('products');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
    }
}