<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\LikeCount;
use Illuminate\Support\Facades\Log;


class Like extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'entity_type', 'entity_id', 'is_like',
    ];

    public static function boot()
    {
        parent::boot();

        static::created(function ($like) {
            $like->updateLikeCount(1);
        });

        static::deleted(function ($like) {
            $like->updateLikeCount(-1);
        });

        static::updated(function ($like) {
            if ($like->wasChanged('is_like')) {
                $like->updateLikeCount(0, true);
            }
        });
    }

    protected function updateLikeCount($increment, $isUpdated = false)
    {
        try {
            $count = LikeCount::firstOrCreate(
                ['entity_type' => $this->entity_type, 'entity_id' => $this->entity_id,],
                ['likes_count' => 0, 'dislikes_count' => 0]
            );

            if ($isUpdated) {
                if ($this->is_like) {
                    $count->increment('likes_count');
                    $count->decrement('dislikes_count');
                } else {
                    $count->decrement('likes_count');
                    $count->increment('dislikes_count');
                }
            } else {
                if ($this->is_like) {
                    $count->increment('likes_count', $increment);
                } else {
                    $count->increment('dislikes_count', $increment);
                }
            }

            $count->save();
        } catch (\Exception $e) {
            Log::error('Error updating like count: ' . $e->getMessage());
        }
    }
}
