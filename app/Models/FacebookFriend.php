<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class FacebookFriend extends Model
{
  protected $guarded = ['id'];
  protected $fillable = [
      'name',
      'url',
      'user_id'
  ];

  protected $table = 'facebook_friends';
}
