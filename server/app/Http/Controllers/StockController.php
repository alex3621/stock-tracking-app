<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Lumen\Routing\Controller as BaseController;
use GuzzleHttp\Client;


class StockController extends BaseController
{
    private static $storedData = null;

    public function fetchData()
    {
        try {
            $apiKey = env('API_KEY');
            // Testing
            $url = 'https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2023-01-09?adjusted=true&apiKey=' . $apiKey;

            if (is_null(self::$storedData)) {
                $client = new \GuzzleHttp\Client();
                // Make the API call and retrieve the stock data
                $response = $client->get($url);
                $data = json_decode($response->getBody(), true);

                // Store the data in the static variable
                self::$storedData = $data;
            }
            // delete this later
            return response()->json(['data' => self::$storedData]);
        } catch (\Exception $e) {
            // Handle the exception
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function dashboard(Request $request)
    {
    }

    public function manage(Request $request)
    {
    }

    public function stockList(Request $request)
    {
    }
}
