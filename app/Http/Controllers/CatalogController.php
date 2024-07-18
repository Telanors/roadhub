<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Roadmap;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {

        $tags = $request->input('tags', []);
        if (is_string($tags)) {
            $tags = explode(',', $tags);

            $cleanArray = array_map(function ($value) {
                return preg_replace('/\D/', '', $value);
            },  $tags);

            $tags = array_map('intval', $cleanArray);
        }
        $user = auth()->user();
        return Inertia::render('Catalog', ['user' => $user, 'tags' => $tags]);
    }


    public function show($id)
    {
        $roadmap = Roadmap::with("user")->findOrFail($id);

        $user = auth()->user();
        return Inertia::render('Detail', ['user' => $user, 'roadmap' => $roadmap]);
    }
}
