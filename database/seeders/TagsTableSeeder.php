<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'AI', 'Level Design', 'UI/UX', '2D Animation', '3D Animation', 'Gameplay',
            'Sound Design', 'Music Composition', 'Storytelling', 'Character Design',
            'Environment Art', 'Shaders', 'VFX', 'Scripting', 'Networking', 'Physics',
            'Game Testing', 'Quality Assurance', 'Debugging', 'Optimization', 'Indie Games',
            'Console Development', 'PC Development', 'Mobile Games', 'VR', 'AR', 'MMO',
            'RPG', 'FPS', 'Puzzle Games', 'Simulation', 'Strategy Games', 'Multiplayer',
            'Singleplayer', 'Game Engines', 'Unity', 'Unreal Engine', 'Godot', 'Blender',
            'Maya', 'Photoshop', 'Substance Painter', 'Animation Rigging', 'Procedural Generation',
            'Particle Systems', 'Lighting', 'Texturing', 'Asset Management', 'Game Design'
        ];

        foreach ($tags as $tag) {
            DB::table('tags')->insert([
                'name' => $tag,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
