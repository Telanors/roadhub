<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\LikeCountController;
use App\Http\Controllers\RoadmapController;
use App\Http\Controllers\TagController;

Route::get('/comments', [CommentController::class, 'index'])->name("comments/index");
Route::post('/comments', [CommentController::class, 'store'])->name("comments.post");
Route::get('/comments/{roadmapId}/{sortOrder}', [CommentController::class, 'get'])->name("comments.get");

Route::post('/likes', [LikeController::class, 'like'])->name('likes.like');
Route::get('/likes/{entityType}/{entityId}/user', [LikeController::class, 'getUserReaction'])->name('likes.getUserReaction');

Route::get('/likes/{entityType}/{entityId}', [LikeCountController::class, 'getCounts'])->name('likes.getLikes');
Route::get('/likes/user/{userId}/{entityType}', [LikeCountController::class, 'getUserLikesCountByEntityType'])->name('likes.getUserLikesCountByEntityType');
Route::get('/likes/users/', [LikeCountController::class, 'getUsersLikesCountByEntityType'])->name('likes.getUsersLikesCountByEntityType');

Route::get('/user/{userId}/roadmaps', [RoadmapController::class, 'getRoadmapsByUser'])->name("roadmap.getRoadmapsByUser");
Route::get('/roadmap/get', [RoadmapController::class, 'get'])->name("roadmap.get");
Route::post('/roadmap/save', [RoadmapController::class, 'store'])->name("roadmap.store");
Route::get('/roadmap/search', [RoadmapController::class, 'getByTags'])->name('roadmap.getByTags');
Route::get('/roadmap/index', [RoadmapController::class, 'index'])->name("roadmap.index");
Route::get('/roadmap/index/likes', [RoadmapController::class, 'indexSortedByLikes'])->name('roadmap.indexSortedByLikes');
Route::post('/roadmap/increment/views', [RoadmapController::class, 'incrementViews'])->name('roadmap.incrementViews');
Route::get('/user/{userId}/roadmaps/likes-dislikes', [RoadmapController::class, 'getUserRoadmapsLikesDislikes'])->name('roadmap.getAllLikesDislike');

Route::get('/roadmaps/{roadmapId}/tags', [TagController::class, 'get'])->name('roadmap.getTags');
Route::get('/tags', [TagController::class, 'getAll'])->name('tags');
