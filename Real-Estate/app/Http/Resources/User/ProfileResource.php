<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'full_name'       => $this->full_name,
            'national_number' => $this->national_number,
            'date_of_birth'   => $this->date_of_birth,
            'id_card_photo'   => $this->id_card_photo,
            'city'            => $this->city,
            'is_verified'     => $this->is_verified,
        ];
    }
}
