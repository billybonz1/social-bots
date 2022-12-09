<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Fauth extends Model
{
  protected $guarded = ['id'];
  protected $fillable = [
      'user_id',
      'user_agent',
      'cookie',
  ];

  protected $table = 'fauths';
}
