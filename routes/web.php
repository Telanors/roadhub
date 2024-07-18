<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\CatalogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'user' => auth()->user()
    ]);
})->name("home");


Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog');
Route::get('/test', [CatalogController::class, 'paginate'])->name('test');
Route::get('/catalog/{id}', [CatalogController::class, 'show'])->name('catalog.show');

Route::middleware('auth')->group(function () {
    Route::get('/editor', [EditorController::class, 'index'])->name('editor');
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';