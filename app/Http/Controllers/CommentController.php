<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\User;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'roadmap_id' => 'required|exists:roadmaps,id',
            'text' => 'required|string'
        ]);

        $comment = new Comment();
        $comment->user_id = $request->user_id;
        $comment->roadmap_id = $request->roadmap_id;
        $comment->text = $request->text;

        $comment->save();
        $comment["user"] = User::find($comment->user_id);
        return response()->json($comment);
    }

    public function get(Request $request, $roadmapId, $sortOrder)
    {
        $perPage = $request->input('perPage', 5);
        $sortOrder = $sortOrder ?? 'desc';

        $comments = Comment::with('user')
            ->where('roadmap_id', $roadmapId)
            ->orderBy('created_at', $sortOrder)
            ->paginate($perPage);

        return response()->json($comments);
    }
}
