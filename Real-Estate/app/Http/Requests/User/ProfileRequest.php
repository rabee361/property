<?php

namespace App\Http\Requests\User;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
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
            'full_name'        => ['required','string','max:255'],
            'date_of_birth'    => ['nullable','date'],
            'city'             => ['required','string','max:100'],
            'national_number'  =>['required' , 'string' , 'size:11' , 'unique:'.Profile::class , ],
            'id_card_photo'    => ['required' , 'image' ,'max:1024' , 'mimes:png,jpg,jpeg,webp'],
        ];
    }
}
