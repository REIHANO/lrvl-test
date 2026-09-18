<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}
    public function index(Request $request)
    {
        abort_unless($request->user()->role === 'admin', 403);
        return Inertia::render('Dashboard/index', $this->dashboardService->summary());
    }
}
