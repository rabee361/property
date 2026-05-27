<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePropertyRequest extends FormRequest
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

            'title'           => ['nullable' , 'string' , 'max:255'],
            'description'     => ['nullable' , 'string' , 'max:2000'],
            'photo'           => ['nullable' , 'image' , 'max:1024' , 'mimes:png,jpg,jpeg,webp'],
            'deed_photo'      => ['nullable' , 'image' , 'max:1024' , 'mimes:png,jpg,jpeg,webp' ],
            'price'           => ['nullable','numeric','min:100'],
            'purpose'         => ['nullable',  Rule::in(['sale','rent']) ],
            'property_type'   => ['nullable',  Rule::in(['apartment','villa','land','office','shop','architecture']) ],
            'type'            => ['nullable',  Rule::in(['apartment','villa','land','office','shop','architecture']) ],
            'address'         => ['nullable','string','max:255'],
            'number_of_rooms' => ['nullable','integer','min:0'],
            'bathrooms'       => ['nullable','integer','min:0'],
            'features'        => ['nullable' , 'string' ],
            'area_m2'         => ['nullable','integer','min:0'],

        ];
    }
}
