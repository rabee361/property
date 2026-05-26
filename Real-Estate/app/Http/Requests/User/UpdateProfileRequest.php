<?php

namespace App\Http\Requests\User;

use App\Models\Profile;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
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
        $profile = $this->route('profile');

        return [
            'full_name'        => ['nullable','string','max:255'],
            'date_of_birth'    => ['nullable','date'],
            'city'             => ['nullable','string','max:100'],
            'national_number'  => [
                'nullable',
                'string',
                'size:11',
                Rule::unique((new Profile())->getTable(), 'national_number')->ignore($profile?->id),
            ],
            'id_card_photo'    => ['nullable' , 'image' ,'max:1024' , 'mimes:png,jpg,jpeg,webp'],
        ];
    }
}
