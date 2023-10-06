<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Lumen\Routing\Controller as BaseController;

class UserController extends BaseController
{
    public function register(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        try {
            // First, check if the email already exists
            $userObj = DB::table('user')
                ->where('email', '=', $email)
                ->first();
            if ($userObj) {
                return response()->json("User $email already exists", 400);
            }

            // Insert email to user table
            DB::table('user')
                ->insert([
                    'email' => $email,
                    'password' => $password
                ]);
        } catch (QueryException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        return response()->json([
            'email' => $email,
            'password' => $password
        ]);
    }

    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        try {
            // check if email exists in the system
            $userObj = DB::table('user')
                ->where('email', '=', $email)
                ->first();
            if (!$userObj) {
                return response()->json("noEmail", 401);
            }
            if ($userObj->{'password'} != $password) {
                return response()->json("wrongPassword", 401);
            }
        } catch (QueryException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
        return response()->json("success", 200);
    }
}
