<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'type',
        'quantity_change',
        'previous_quantity',
        'new_quantity',
        'reason',
        'reference',
        'movement_date'
    ];

    protected $casts = [
        'movement_date' => 'datetime',
        'quantity_change' => 'integer',
        'previous_quantity' => 'integer',
        'new_quantity' => 'integer'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTypeTextAttribute()
    {
        $types = [
            'entrada' => 'Entrada',
            'salida' => 'Salida',
            'ajuste' => 'Ajuste',
            'venta' => 'Venta',
            'compra' => 'Compra'
        ];
        return $types[$this->type] ?? $this->type;
    }

    public function scopeByType($query, $type)
    {
        if ($type) {
            return $query->where('type', $type);
        }
        return $query;
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        if ($startDate && $endDate) {
            return $query->whereBetween('movement_date', [$startDate, $endDate]);
        }
        return $query;
    }

    public function scopeByProduct($query, $productId)
    {
        if ($productId) {
            return $query->where('product_id', $productId);
        }
        return $query;
    }
}