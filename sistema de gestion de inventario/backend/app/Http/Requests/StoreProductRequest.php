<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'sku' => 'required|string|max:100|unique:products',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'stock_quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'barcode' => 'nullable|string|max:100',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:100',
            'is_active' => 'boolean'
        ];
    }

    public function messages()
    {
        return [
            'sku.required' => 'El SKU es requerido',
            'sku.unique' => 'Este SKU ya está registrado',
            'name.required' => 'El nombre es requerido',
            'stock_quantity.required' => 'La cantidad en stock es requerida',
            'stock_quantity.min' => 'La cantidad en stock no puede ser negativa',
            'minimum_stock.required' => 'El stock mínimo es requerido',
            'minimum_stock.min' => 'El stock mínimo no puede ser negativo',
            'price.required' => 'El precio es requerido',
            'price.min' => 'El precio no puede ser negativo',
            'image.image' => 'El archivo debe ser una imagen',
            'image.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg, gif',
            'image.max' => 'La imagen no debe exceder los 2MB'
        ];
    }
}