<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Roadmap;
use Inertia\Inertia;

class EditorController extends Controller
{
    public function index()
    {
        return Inertia::render('Editor', ['status' => session('status')]);
    }
}
