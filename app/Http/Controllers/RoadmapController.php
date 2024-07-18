<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Roadmap;
use App\Models\Like;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;

class RoadmapController extends Controller
{
    public function store(Request $request)
    {
        $messages = [
            'name.required' => 'Названия обязательно для заполнения',
            'name.string' => 'Названия должно быть строкой',
            'description.required' => 'Описание обязательно для заполнения',
            'description.string' => 'Описание должно быть строкой',
            'json.required' => 'JSON обязателен для заполнения',
            'json.json' => 'JSON должен быть в формате JSON',
            'preview.required' => 'Превью отсутствует',
            'preview.base64image' => 'Превью не в формате base64',
            'tags.required' => 'Теги обязательны для заполнения',
            'tags.string' => 'Теги должны быть строкой',
        ];

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1024',
            'json' => 'required|json',
            'preview' => 'required|base64image',
            'tags' => 'required|string'
        ], $messages);

        $time = time();
        $filePathJson = '/roadmaps/jsons/roadmap_' . $time . '.json';
        $filePathPreview = '/roadmaps/previews/roadmap_' . $time . '.jpeg';
        $bin = base64_decode(str_replace('data:image/png;base64,', '', $request->preview));

        $roadmap = new Roadmap();
        $roadmap->user_id = auth()->user()->id;
        $roadmap->name = $request->name;
        $roadmap->description = $request->description;
        $roadmap->preview_path = $filePathPreview;
        $roadmap->file_path = $filePathJson;

        if ($roadmap->save()) {
            $tagsArray = explode(' ', $request->tags);
            $tagsArray = array_unique(array_map('trim', $tagsArray));
            foreach ($tagsArray as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $roadmap->tags()->attach($tag->id, ['roadmap_id' => $roadmap->id]);
            }
            file_put_contents($_SERVER["DOCUMENT_ROOT"] . $filePathJson, $request->json);
            file_put_contents($_SERVER["DOCUMENT_ROOT"] . $filePathPreview, $bin);
            return back()->with('status', ['message' => 'Дорожная карта успешно опубликована', 'time' => now(), 'type' => "success"]);
        }
        return back()->with('status', ['message' => 'Ошибка публикации', 'time' => now(), 'type' => "error"]);
    }

    public function getUserRoadmapsLikesDislikes($userId)
    {
        $roadmaps = Roadmap::where('user_id', $userId)->get();
        $likes = 0;
        $dislikes = 0;

        foreach ($roadmaps as $roadmap) {
            $likes += Like::where('entity_type', 'roadmap')
                ->where('entity_id', $roadmap->id)
                ->where('is_like', true)
                ->count();

            $dislikes += Like::where('entity_type', 'roadmap')
                ->where('entity_id', $roadmap->id)
                ->where('is_like', false)
                ->count();
        }

        return response()->json([
            'likes' => $likes,
            'dislikes' => $dislikes,
        ]);
    }
    public function get(Request $request)
    {
        $sortColumn = $request->input('sortColumn', 'updated_at');
        $sortOrder = $request->input('sortOrder', 'desc');
        $perPage = $request->input('perPage', 12);
        $roadmaps = Roadmap::with('user')->orderBy($sortColumn, $sortOrder)->paginate($perPage);

        return response()->json($roadmaps);
    }

    public function getByLikes(Request $request)
    {
        $sortOrder = $request->input('sortOrder', 'desc');
        $roadmaps = Roadmap::leftJoin('likes_counts', function ($join) {
            $join->on('roadmaps.id', '=', 'likes_counts.entity_id')
                ->where('likes_counts.entity_type', '=', 'roadmap');
        })
            ->select('roadmaps.*', DB::raw('COALESCE(SUM(likes_counts.likes_count), 0) as total_likes'))
            ->groupBy('roadmaps.id')
            ->orderBy('total_likes', $sortOrder)
            ->get();

        return response()->json($roadmaps);
    }

    public function getByTags(Request $request)
    {
        $tags = $request->input('tags');
        if (empty($tags)) {
            return $this->get($request);
        } else {
            $sortColumn = $request->input('sortColumn', 'updated_at');
            $sortOrder = $request->input('sortOrder', 'desc');
            $perPage = $request->input('perPage', 12);
            $roadmaps = Roadmap::with('user')->whereHas('tags', function ($query) use ($tags) {
                $query->whereIn('tag_id', $tags);
            })->orderBy($sortColumn, $sortOrder)->paginate($perPage);
        }

        return response()->json($roadmaps);
    }

    public function index(Request $request)
    {
        $query = Roadmap::with('user');

        if ($request->has('tags')) {
            $tags = $request->tags;
            $query->whereHas('tags', function ($query) use ($tags) {
                $query->whereIn('tag_id', $tags);
            });
        }

        $sortColumn = $request->input('sortColumn', 'updated_at');
        $sortOrder = $request->input('sortOrder', 'desc');
        $query->orderBy($sortColumn, $sortOrder);

        $perPage = $request->input('perPage', 12);
        $roadmaps = $query->paginate($perPage);

        return response()->json($roadmaps);
    }

    public function indexSortedByLikes(Request $request)
    {
        $query = Roadmap::leftJoin('likes_counts', function ($join) {
            $join->on('roadmaps.id', '=', 'likes_counts.entity_id')
                ->where('likes_counts.entity_type', '=', 'roadmap');
        })
            ->with('user')->select('roadmaps.*', DB::raw('COALESCE(SUM(likes_counts.likes_count), 0) as total_likes'))
            ->groupBy('roadmaps.id');

        if ($request->has('tags')) {
            $tags = $request->tags;
            $query->whereHas('tags', function ($query) use ($tags) {
                $query->whereIn('tag_id', $tags);
            });
        }

        $sortOrder = $request->input('sortOrder', 'desc');
        $query->orderBy('total_likes', $sortOrder);

        $perPage = $request->input('perPage', 12);
        $roadmaps = $query->paginate($perPage);

        return response()->json($roadmaps);
    }

    public function indexSortedByRating(Request $request)
    {
        $query = Roadmap::leftJoin('likes_counts', function ($join) {
            $join->on('roadmaps.id', '=', 'likes_counts.entity_id')
                ->where('likes_counts.entity_type', '=', 'roadmap');
        })
            ->with('user')->select('roadmaps.*', DB::raw('(likes_counts.likes_count / (likes_counts.likes_count + likes_counts.dislikes_count)) * 5 as rating'))
            ->orderBy('rating', 'desc');

        if ($request->has('tags')) {
            $tags = $request->tags;
            $query->whereHas('tags', function ($query) use ($tags) {
                $query->whereIn('tag_id', $tags);
            });
        }

        $perPage = $request->input('perPage', 12);
        $roadmaps = $query->paginate($perPage);

        return response()->json($roadmaps);
    }

    public function incrementViews(Request $request)
    {
        $id = $request->input('id');
        if (!$id) return response()->json(['error' => 'Не указаен id roadmap'], 400);

        $roadmap = Roadmap::findOrFail($id);

        $roadmap->timestamps = false;
        $roadmap->increment('views');
        $roadmap->timestamps = true;

        return response()->json($roadmap);
    }

    public function getRoadmapsByUser($userId)
    {
        $roadmaps = Roadmap::where('user_id', $userId)->get();
        return response()->json($roadmaps);
    }
}
