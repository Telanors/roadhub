<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function like(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'entity_id' => 'required|integer',
            'entity_type' => 'required|string|in:post,comment,roadmap',
            'is_like' => 'required|boolean'
        ]);

        $existingLike = Like::where('user_id', $request->user_id)
            ->where('entity_id', $request->entity_id)
            ->where('entity_type', $request->entity_type)
            ->first();

        if ($existingLike) {
            if ($existingLike->is_like == $request->is_like) {
                $existingLike->delete();
                return response()->json(['message' => 'Like/Dislike removed']);
            } else {
                $existingLike->is_like = $request->is_like;
                $existingLike->save();
                return response()->json($existingLike);
            }
        } else {
            $like = new Like();
            $like->user_id = $request->user_id;
            $like->entity_id = $request->entity_id;
            $like->entity_type = $request->entity_type;
            $like->is_like = $request->is_like;
            $like->save();
            return response()->json($like);
        }
    }

    public function getLikes($entityType, $entityId)
    {
        $likes = Like::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->get();

        return response()->json([
            'likes' => $likes->where('is_like', true)->count(),
            'dislikes' => $likes->where('is_like', false)->count()
        ]);
    }

    public function getUserReaction($entityType, $entityId)
    {
        $like = Like::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->where('user_id', Auth::id())
            ->first();

        return response()->json($like);
    }
}
