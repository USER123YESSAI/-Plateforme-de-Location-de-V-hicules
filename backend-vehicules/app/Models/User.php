<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; 

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 
        'email', 
        'password', 
        'phone', 
        'license_number', 
        'license_expiry', 
        'role',
        'address',
        'terms_accepted',
        'terms_accepted_at',
        'terms_version',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'license_expiry' => 'date',
        'terms_accepted' => 'boolean',
        'terms_accepted_at' => 'datetime',
    ];

    protected $appends = [
        'terms_update_required',
    ];

    /**
     * Vérifie si l'utilisateur doit accepter une nouvelle version des conditions.
     */
    public function getTermsUpdateRequiredAttribute(): bool
    {
        $currentVersion = (string) config('terms.version', '1.0');
        return !$this->terms_accepted || ((string) $this->terms_version !== $currentVersion);
    }

    // --- MÉTHODES OBLIGATOIRES POUR JWT ---

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role, 
        ];
    }

    // --- RELATIONS ---

    public function rentals() 
    { 
        return $this->hasMany(Rental::class); 
    }
}