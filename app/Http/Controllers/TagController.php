<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use App\Models\Tag;

class TagController extends Controller
{
    public function getAll()
    {
        $tags = Tag::all();
        return response()->json($tags);
    }

    public function get($roadmapId)
    {
        $roadmap = Roadmap::findOrFail($roadmapId);
        $tags = $roadmap->tags()->get();
        return response()->json($tags);
    }
}