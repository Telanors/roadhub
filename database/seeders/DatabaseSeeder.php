<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TagsTableSeeder::class,
        ]);
        User::factory()->create([
            'name' => 'big_penis_sigma_1488',
            'email' => 'test@test.test',
            'password' => 'test'
        ]);
        User::factory()->create([
            'name' => 'small_penis_sigma_1488',
            'email' => 'user@user.user',
            'password' => 'user'
        ]);
        User::factory()->create([
            'name' => 'telanors',
            'email' => 'telanors@telanors.telanors',
            'password' => 'telanors'
        ]);
    }
}
