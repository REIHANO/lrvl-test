<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::table('users')->whereIn('role', ['kasir', 'super_admin'])->update(['role' => 'admin']);
    }

    public function down(): void
    {
        // Role normalization is intentionally not reversed.
    }
};
