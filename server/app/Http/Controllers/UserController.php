<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class UserController extends BaseController
{
    public function register(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        return response()->json([
            'email' => $email,
            'password' => $password
        ]);
    }
}
