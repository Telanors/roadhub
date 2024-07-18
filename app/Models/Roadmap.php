<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roadmap extends Model
{
    use HasFactory;
    protected $table = 'roadmaps';
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'preview_path',
        'file_path',
        'views'
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

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'roadmaps_tags');
    }
}
