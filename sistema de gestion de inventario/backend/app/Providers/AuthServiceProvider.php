<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Laravel\Sanctum\Sanctum;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        // Definir gates para roles
        Gate::define('admin', function ($user) {
            return $user->isAdmin();
        });

        Gate::define('manager', function ($user) {
            return $user->isManager() || $user->isAdmin();
        });

        Gate::define('user', function ($user) {
            return true; // Todos los usuarios autenticados
        });
    }
}