<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'customer_address' => 'nullable|string|min:10|max:1000',
            'items'      => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',//untuk memastikan kolom product id tidak boleh kosong dan products,id wajib ada di databse
            'items.*.quantity' => 'required|integer|min:1',// quantity tidak boleh kosng dan minim quantity nya harus 1 tidak boleh 0 atau -
        ];
    }
}
