<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'prix',
        'enseignant_id',
    ];

    public function enseignant()
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }
    public function favoredByUsers()
    {
        return $this->belongsToMany(User::class,'course_user')->withTimestamps();
    }
}