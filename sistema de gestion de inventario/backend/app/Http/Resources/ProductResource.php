<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                    'color' => $this->category->color,
                    'icon' => $this->category->icon
                ];
            }),
            'category_id' => $this->category_id,
            'stock_quantity' => $this->stock_quantity,
            'minimum_stock' => $this->minimum_stock,
            'price' => (float) $this->price,
            'cost_price' => $this->cost_price ? (float) $this->cost_price : null,
            'location' => $this->location,
            'image_url' => $this->image_url,
            'barcode' => $this->barcode,
            'unit' => $this->unit,
            'weight' => $this->weight,
            'dimensions' => $this->dimensions,
            'is_active' => $this->is_active,
            'stock_status' => $this->stock_status,
            'stock_status_text' => $this->stock_status_text,
            'profit_margin' => $this->profit_margin,
            'total_value' => $this->total_value,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'deleted_at' => $this->deleted_at ? $this->deleted_at->format('Y-m-d H:i:s') : null,
        ];
    }
}