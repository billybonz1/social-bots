<?php

Route::group([
    'namespace' => 'App\Http\Controllers\Admin',
    'prefix' => 'admin',
    'middleware' => ['auth'],
], function () {
    Route::resource('user', 'UserController');
    Route::resource('role', 'RoleController');
    Route::resource('permission', 'PermissionController');
    Route::get('facebook', 'FacebookController@index')->name('facebook.index');
    Route::get('facebook/instruction', 'FacebookController@instruction')->name('facebook.instruction');
    Route::get('facebook/createJob', 'FacebookController@createJob')->name('facebook.createjob');
    Route::post('facebook/checkAuth', 'FacebookController@checkAuth')->name('facebook.checkauth');
    Route::post('facebook/saveAuth', 'FacebookController@saveAuth')->name('facebook.saveauth');
    Route::post('facebook/getFriendsList', 'FacebookController@getFriendsList')->name('facebook.getfriendslist');
    Route::post('facebook/sendMessage', 'FacebookController@sendMessage')->name('facebook.sendmessage');
    Route::get('facebook/getFriends', 'FacebookController@getFriends')->name('facebook.getfriends');
    Route::get('facebook/getJobs', 'FacebookController@getJobs')->name('facebook.getjobs');
    Route::get('edit-account-info', 'UserController@accountInfo')->name('admin.account.info');
    Route::post('edit-account-info', 'UserController@accountInfoStore')->name('admin.account.info.store');
    Route::post('change-password', 'UserController@changePasswordStore')->name('admin.account.password.store');
});
