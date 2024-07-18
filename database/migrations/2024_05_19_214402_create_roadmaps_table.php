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
        Schema::create('roadmaps', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('user_id')->constrained(table: 'users')->onDelete('cascade')->onUpdate('cascade');
            $table->string('name');
            $table->string('description', 1024);
            $table->string('preview_path');
            $table->string('file_path');
            $table->integer(column: 'views', unsigned: true)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmaps');
    }
};
