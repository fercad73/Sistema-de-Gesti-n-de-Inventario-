<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $productId = $this->route('product') ?? $this->route('id');
        
        return [
            'sku' => 'sometimes|string|max:100|unique:products,sku,' . $productId,
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'stock_quantity' => 'sometimes|integer|min:0',
            'minimum_stock' => 'sometimes|integer|min:0',
            'price' => 'sometimes|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'barcode' => 'nullable|string|max:100',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:100',
            'is_active' => 'sometimes|boolean',
            'reason' => 'nullable|string|max:255'
        ];
    }

    public function messages()
    {
        return [
            'sku.unique' => 'Este SKU ya está registrado',
            'stock_quantity.min' => 'La cantidad en stock no puede ser negativa',
            'minimum_stock.min' => 'El stock mínimo no puede ser negativo',
            'price.min' => 'El precio no puede ser negativo',
            'image.image' => 'El archivo debe ser una imagen',
            'image.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg, gif',
            'image.max' => 'La imagen no debe exceder los 2MB'
        ];
    }
}