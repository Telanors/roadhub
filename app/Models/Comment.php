<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $table = 'comments';
    protected $fillable = [
        'user_id',
        'roadmap_id',
        'text',
    ];
    protected function casts(): array
    {
        return [
            'created_at' => 'date:d.m.Y в H:i',
            'updated_at' => 'date:d.m.Y в H:i',
        ];
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
