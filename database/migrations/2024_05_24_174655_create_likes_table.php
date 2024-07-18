<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(table: 'users')->onDelete('cascade');
            $table->string('entity_type');
            $table->foreignId('entity_id');
            $table->boolean('is_like')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'entity_type', 'entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
