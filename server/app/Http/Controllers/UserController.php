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
            //insert initial funds   
            $user_id = DB::table('user')
                ->where('email', '=', $email)
                ->value('id');
            DB::table('funds')
                ->insert([
                    'user_id' => $user_id,
                    'amount' => 50000,
                    'base_fund' => 50000,
                ]);
        } catch (QueryException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        return response()->json([
            'email' => $email,
            'password' => $password,
            'status' => 200
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
                return response()->json(['success' => false, 'message' => 'noEmail'], 401);
            }

            if ($userObj->password != $password) {
                return response()->json(['success' => false, 'message' => 'wrongPassword'], 401);
            }

            // If we reach here, login is successful
            return response()->json([
                'success' => true,
                'user_id' => $userObj->id,
                'message' => 'Login successful'
            ], 200);
        } catch (QueryException $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 400);
        }
    }

    public function getFunds(Request $request)
    {
        $userId = $request->query('user_id');

        $funds = DB::table('funds')
            ->where('user_id', $userId)
            ->value('amount');

        return response()->json(['funds' => $funds ?? 0]);
    }

    public function getBaseFund(Request $request)
    {
        $userId = $request->query('user_id');

        $funds = DB::table('funds')
            ->where('user_id', $userId)
            ->value('base_fund');

        return response()->json(['base_fund' => $funds ?? 0]);
    }
}
