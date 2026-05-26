<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddPropertyRequest extends FormRequest
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

            'title'           => ['required' , 'string' , 'max:255'],
            'description'     => ['required' , 'string' , 'max:2000'],
          //  'image_path'          => ['required' , 'image' , 'max:1024' , 'mimes:png,jpg,jpeg,webp'],
            'deed_photo'      => ['required' , 'image' , 'max:1024' , 'mimes:png,jpg,jpeg,webp' ],
            'price'           => ['required','numeric','min:100'],
            'purpose'         => ['required',  Rule::in(['sale','rent']) ],
            'property_type'   => ['required',  Rule::in(['apartment','villa','land','office','shop','architecture']) ],
            'status'          => ['required' , Rule::in(['pending','approved','rejected','sold', 'rented' ]) ],
            'address'         => ['required','string','max:255'],
            'number_of_rooms' => ['required','integer','min:0'],
            'features'        => ['nullable' , 'string' ],
            'area_m2'         => ['nullable','integer','min:0'],

        ];
    }
}
