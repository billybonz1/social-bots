<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Fauth;
use App\Models\Job;
use App\Models\FacebookFriend;

class FacebookController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:facebook');
    }
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
    public $nodeCommand = 'node /var/www/laravel-vue-admin-panel/phantomjs/f';
    public function index()
    {
      return Inertia::render('Admin/Facebook/Index', [
          '_token' => csrf_token()
      ]);
    }
    public function instruction()
    {
      return Inertia::render('Admin/Facebook/FacebookInstruction', [
          '_token' => csrf_token()
      ]);
    }
    public function createJob(){
      return Inertia::render('Admin/Facebook/CreateJob', [
        '_token' => csrf_token()
      ]);
    }
    public function checkAuth(){
      $status = false;
      if(isset(Auth::user()->fauth()->first()->id)){
        $return = shell_exec($this->nodeCommand.' checkAuth '.Auth::user()->id);
        if($return !== null && $return !== '0'){
          $status = true;
        }
      }
      echo json_encode(
        array(
          "status" => $status
        )
      );
    }

    public function saveAuth(Request $request){
      if(isset(Auth::user()->fauth()->first()->id)){
        $fauth = Fauth::where("user_id", Auth::user()->id)->first();
        $fauth->cookie = $request->cookie;
        $fauth->user_agent = $request->userAgent;
        $fauth->save();
      }else{
        $fauth = Fauth::create([
          'cookie' => $request->cookie,
          'user_agent' => $request->userAgent,
          'user_id' => Auth::user()->id
        ]);
      }

      echo json_encode($fauth);
    }

    public function getFriends(){
      $friends = Auth::user()->facebookFriends()->paginate(15);
      return response()->json($friends);
    }

    public function getJobs(){
      $jobs = Auth::user()->jobs()->orderBy('created_at', 'desc')->paginate(15);
      return response()->json($jobs);
    }

    public function getFriendsList(){
      if(isset(Auth::user()->fauth()->first()->id)){
        $return = shell_exec($this->nodeCommand.' getFriends '.Auth::user()->id);
        $friendsList = json_decode($return);
        foreach($friendsList as $friend){
            $count = FacebookFriend::where("user_id", Auth::user()->id)->where("name", $friend->name)->count();
            if($count === 0){
              FacebookFriend::create([
                'name' => $friend->name,
                'url' => $friend->link,
                'user_id' => Auth::user()->id
              ]);
            }
        }
        echo json_encode(FacebookFriend::take(20)->get());
      }
    }

    public function sendMessage(Request $request){
      $friendsIds = $request->addedFriendsIds;
      foreach($friendsIds as $id){
        $friend = FacebookFriend::where("id", $id)->first();
        Job::create([
          "action" => "sendMessage",
          "message" => $request->message,
          "status" => 0,
          "url" => $friend->url,
          "user_id" => Auth::user()->id
        ]);
      }
      return response()->json([
        "status" => true
      ]);
    }
}
