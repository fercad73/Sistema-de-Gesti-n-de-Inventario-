<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario administrador
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@inventario.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Usuario estándar
        User::create([
            'name' => 'Usuario Normal',
            'email' => 'usuario@inventario.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Gerente
        User::create([
            'name' => 'Gerente',
            'email' => 'gerente@inventario.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
        ]);

        // Crear 10 usuarios adicionales
        User::factory(10)->create();
    }
}