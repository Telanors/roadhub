<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikeCount extends Model
{
    use HasFactory;
    protected $table = 'likes_counts';
    protected $fillable = [
        'entity_type', 
        'entity_id', 
        'likes_count', 
        'dislikes_count',
    ];
}
