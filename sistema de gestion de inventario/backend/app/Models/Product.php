<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sku',
        'name',
        'description',
        'category_id',
        'stock_quantity',
        'minimum_stock',
        'price',
        'cost_price',
        'location',
        'image_url',
        'barcode',
        'unit',
        'weight',
        'dimensions',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'minimum_stock' => 'integer',
        'weight' => 'decimal:3',
        'is_active' => 'boolean'
    ];

    protected $appends = ['stock_status', 'profit_margin'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class)->latest();
    }

    public function getStockStatusAttribute()
    {
        if ($this->stock_quantity <= 0) {
            return 'out_of_stock';
        } elseif ($this->stock_quantity <= $this->minimum_stock) {
            return 'low_stock';
        } else {
            return 'in_stock';
        }
    }

    public function getStockStatusTextAttribute()
    {
        $status = $this->stock_status;
        $texts = [
            'out_of_stock' => 'Agotado',
            'low_stock' => 'Stock Bajo',
            'in_stock' => 'Disponible'
        ];
        return $texts[$status] ?? 'Desconocido';
    }

    public function getProfitMarginAttribute()
    {
        if (!$this->cost_price || $this->cost_price == 0) {
            return 0;
        }
        return (($this->price - $this->cost_price) / $this->cost_price) * 100;
    }

    public function getTotalValueAttribute()
    {
        return $this->stock_quantity * $this->price;
    }

    public function recordStockMovement($type, $quantity, $reason = null, $userId = null, $reference = null)
    {
        return $this->stockMovements()->create([
            'user_id' => $userId ?? auth()->id(),
            'type' => $type,
            'quantity_change' => $quantity,
            'previous_quantity' => $this->getOriginal('stock_quantity'),
            'new_quantity' => $this->stock_quantity,
            'reason' => $reason,
            'reference' => $reference
        ]);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->where('stock_quantity', '<=', \DB::raw('minimum_stock'))
                    ->where('stock_quantity', '>', 0);
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('stock_quantity', '<=', 0);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
    }

    public function scopeByCategory($query, $categoryId)
    {
        if ($categoryId) {
            return $query->where('category_id', $categoryId);
        }
        return $query;
    }

    public function scopeByStockStatus($query, $status)
    {
        switch ($status) {
            case 'low':
                return $query->lowStock();
            case 'out':
                return $query->outOfStock();
            case 'in':
                return $query->where('stock_quantity', '>', \DB::raw('minimum_stock'));
            default:
                return $query;
        }
    }
}