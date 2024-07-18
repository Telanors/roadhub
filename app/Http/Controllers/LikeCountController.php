<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\LikeCount;
use App\Models\Roadmap;
use Illuminate\Http\Request;

class LikeCountController extends Controller
{
    public function getCounts($entityType, $entityId)
    {
        $likeCount = LikeCount::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->first();

        if (!$likeCount) {
            return response()->json([
                'likes' => 0,
                'dislikes' => 0
            ]);
        }

        return response()->json([
            'likes' => $likeCount->likes_count,
            'dislikes' => $likeCount->dislikes_count
        ]);
    }

    public function getUserLikesCountByEntityType($userId, $entityType)
    {
        if ($entityType === 'roadmap') {
            $entityIds = Roadmap::where('user_id', $userId)->pluck('id');
        } elseif ($entityType === 'comment') {
            $entityIds = Comment::where('user_id', $userId)->pluck('id');
        } else {
            return response()->json(['error' => 'Неизвестный тип entity'], 400);
        }

        $likesCount = intval(LikeCount::whereIn('entity_id', $entityIds)
            ->where('entity_type', $entityType)
            ->sum('likes_count'));

        $dislikesCount = intval(LikeCount::whereIn('entity_id', $entityIds)
            ->where('entity_type', $entityType)
            ->sum('dislikes_count'));

        return response()->json([
            'total_likes' => $likesCount,
            'total_dislikes' => $dislikesCount,
        ]);
    }

    public function getUsersLikesCountByEntityType(Request $request)
    {
        $userIds = $request->input('userIds');
        $entityType = $request->input('entityType');

        if (!$userIds || !$entityType) {
            return response()->json(['error' => 'Необходимы userIds и entityType'], 400);
        }

        $results = [];

        foreach ($userIds as $userId) {
            if ($entityType === 'roadmap') {
                $entityIds = Roadmap::where('user_id', $userId)->pluck('id');
            } elseif ($entityType === 'comment') {
                $entityIds = Comment::where('user_id', $userId)->pluck('id');
            } else {
                return response()->json(['error' => 'Неизвестный тип entity'], 400);
            }

            $likesCount = intval(LikeCount::whereIn('entity_id', $entityIds)
                ->where('entity_type', $entityType)
                ->sum('likes_count'));

            $dislikesCount = intval(LikeCount::whereIn('entity_id', $entityIds)
                ->where('entity_type', $entityType)
                ->sum('dislikes_count'));

            $results[$userId] = [
                'total_likes' => $likesCount,
                'total_dislikes' => $dislikesCount,
            ];
        }

        return response()->json($results);
    }
}
