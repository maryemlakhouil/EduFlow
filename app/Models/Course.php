<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Domain;


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

    public function domains()
    {
        return $this->belongsToMany(Domain::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}