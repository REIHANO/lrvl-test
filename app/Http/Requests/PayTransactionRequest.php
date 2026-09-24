<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayTransactionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'in:dana,gopay,ovo,va_bca,va_mandiri'],
        ];
    }
}
