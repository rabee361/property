<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as RulesPassword;

class RegisterRequest extends FormRequest
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
            'name' => ['required' , 'string' , 'min:3','max:20'],
            'email' => ['required' , 'email' , 'unique:'.User::class.',email'],
            'phone' => ['required' , 'string' ,'regex:/^(?:\+?963|00963|0)(?:9[3-6,8-9]\d{7}|1\d{7}|2\d{7}|3\d{7}|4\d{7})$/', 'unique:'.User::class.',phone'],
            'password' => ['required' , 'string' ,
                    RulesPassword::
                     min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()

        ]];


    }
}
