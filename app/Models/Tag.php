<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;
    protected $table = 'tags';
    protected $fillable =
    [
        'name'
    ];
    protected function casts(): array
    {
        return [
            'created_at' => 'date:d.m.Y в H:i',
            'updated_at' => 'date:d.m.Y в H:i',
        ];
    }

    public function roadmaps()
    {
        return $this->belongsToMany(Roadmap::class, 'roadmaps_tags');
    }
}
