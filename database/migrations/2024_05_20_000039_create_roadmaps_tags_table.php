<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roadmaps_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId("roadmap_id")->constrained(table: 'roadmaps')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId("tag_id")->constrained(table: 'tags')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmaps_tags');
    }
};
