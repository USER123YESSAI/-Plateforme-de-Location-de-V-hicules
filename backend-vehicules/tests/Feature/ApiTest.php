<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_login(): void
    {
        $registerResponse = $this->postJson('/api/auth/register', [
            'name'                  => 'Client Smoke Test',
            'email'                 => 'client.smoke@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'terms_accepted'        => true,
        ]);

        $registerResponse->assertStatus(201)
            ->assertJsonStructure(['message', 'user', 'token'])
            ->assertJson([
                'user' => [
                    'terms_accepted' => true,
                    'terms_version' => '1.0',
                    'terms_update_required' => false,
                ]
            ]);

        $this->assertNotNull($registerResponse->json('user.terms_accepted_at'));

        $loginResponse = $this->postJson('/api/auth/login', [
            'email'    => 'client.smoke@example.com',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type', 'expires_in', 'user']);
    }

    public function test_user_cannot_register_without_accepting_terms(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Client Unaccepted',
            'email'                 => 'unaccepted@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'terms_accepted'        => false,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['terms_accepted'], null);
    }

    public function test_authenticated_user_can_accept_new_terms_version(): void
    {
        $user = User::create([
            'name' => 'User Old Terms',
            'email' => 'oldterms@example.com',
            'password' => bcrypt('password123'),
            'role' => 'client',
            'terms_accepted' => true,
            'terms_accepted_at' => now()->subYear(),
            'terms_version' => '0.9',
        ]);

        $this->assertTrue($user->terms_update_required);

        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/auth/accept-terms', [
                'terms_accepted' => true,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Conditions d’utilisation acceptées avec succès',
                'terms_version' => '1.0',
                'user' => [
                    'terms_accepted' => true,
                    'terms_version' => '1.0',
                    'terms_update_required' => false,
                ]
            ]);

        $user->refresh();
        $this->assertEquals('1.0', $user->terms_version);
        $this->assertFalse($user->terms_update_required);
    }

    public function test_public_can_list_categories_and_vehicles(): void
    {
        Category::create([
            'name' => 'SUV Smoke',
            'description' => 'Test SUV'
        ]);

        $categoriesResponse = $this->getJson('/api/categories');
        $categoriesResponse->assertStatus(200)
            ->assertJsonStructure(['success', 'data']);

        $vehiclesResponse = $this->getJson('/api/vehicles');
        $vehiclesResponse->assertStatus(200);
    }

    public function test_client_cannot_create_category(): void
    {
        $client = User::create([
            'name' => 'Client Test',
            'role' => 'client',
            'email' => 'client2@example.com',
            'password' => bcrypt('password'),
        ]);

        $token = auth('api')->login($client);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/categories', [
                'name' => 'Catégorie Interdite',
                'description' => 'Test'
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_category(): void
    {
        $admin = User::create([
            'name' => 'Admin Test',
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $token = auth('api')->login($admin);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/categories', [
                'name' => 'Catégorie Admin',
                'description' => 'Test admin'
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'category']);
    }

    public function test_admin_can_access_revenue_report(): void
    {
        $admin = User::create([
            'name' => 'Admin Report',
            'role' => 'admin',
            'email' => 'admin.report@example.com',
            'password' => bcrypt('password'),
        ]);

        $token = auth('api')->login($admin);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/reports/revenue');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'year', 'data' => ['currency']]);
    }

    public function test_client_cannot_access_admin_vehicle_stats(): void
    {
        $client = User::create([
            'name' => 'Client Stats Block',
            'role' => 'client',
            'email' => 'client.noblock@example.com',
            'password' => bcrypt('password'),
        ]);

        $token = auth('api')->login($client);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/vehicles/stats');

        $response->assertStatus(403);
    }

    public function test_check_availability_calculates_correct_pricing(): void
    {
        $category = Category::create([
            'name' => 'Berline Test',
            'description' => 'Test'
        ]);

        $vehicle = Vehicle::create([
            'brand' => 'Peugeot',
            'model' => '508',
            'year' => 2023,
            'license_plate' => 'TEST-123',
            'category_id' => $category->id,
            'daily_rate' => 25000,
            'fuel_type' => 'essence',
            'transmission' => 'automatic',
            'seats' => 5,
            'mileage' => 10000,
            'status' => 'available'
        ]);

        $response = $this->getJson('/api/rentals/check-availability?' . http_build_query([
            'vehicle_id' => $vehicle->id,
            'start_date' => now()->addDays(1)->format('Y-m-d'),
            'end_date'   => now()->addDays(3)->format('Y-m-d'),
        ]));

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'available' => true,
                    'calculation' => [
                        'total_days' => 3,
                        'daily_rate' => 25000,
                        'subtotal' => 75000,
                        'total_amount' => 75000
                    ]
                ]
            ]);
    }
}

