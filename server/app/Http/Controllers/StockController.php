<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Date;

use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Lumen\Routing\Controller as BaseController;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;


class StockController extends BaseController
{

    // public function fetchData()
    // {
    //     try {
    //         $apiKey = env('API_KEY');
    //         $url = 'https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2023-01-09?adjusted=true&apiKey=' . $apiKey;

    //         if (is_null(self::$storedData)) {
    //             $client = new \GuzzleHttp\Client();
    //             $response = $client->get($url);
    //             $data = json_decode($response->getBody(), true);

    //             usort($data['results'], function ($a, $b) {
    //                 return $b['c'] - $a['c'];
    //             });

    //             $topStocks = array_slice($data['results'], 0, 50);

    //             self::$storedData = $topStocks;
    //         }

    //         return response()->json(['data' => self::$storedData]);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => $e->getMessage()], 500);
    //     }
    // }
    public function fetchData()
    {
        try {
            // Define cache key
            $cacheKey = 'polygon_data';

            // Check if data is cached
            if (Cache::has($cacheKey)) {
                // Retrieve data from cache
                $topStocks = Cache::get($cacheKey);
            } else {
                // Fetch data from Polygon API
                $apiKey = env('API_KEY');
                $url = 'https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2023-01-09?adjusted=true&apiKey=' . $apiKey;
                $client = new \GuzzleHttp\Client();
                $response = $client->get($url);
                $data = json_decode($response->getBody(), true);

                // Process data
                usort($data['results'], function ($a, $b) {
                    return $b['c'] - $a['c'];
                });
                $topStocks = array_slice($data['results'], 0, 120);

                // Cache data
                Cache::put($cacheKey, $topStocks, Date::now()->addMinutes(60)); // Cache for 60 minutes
            }

            return response()->json(['data' => $topStocks]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function dashboard(Request $request)
    {
    }

    public function buy(Request $request)
    {
        $userId = $request->input('userId');
        $symbol = $request->input('symbol');
        $quantity = $request->input('quantity');
        $price = $request->input('price');

        $totalCost = $quantity * $price;

        $userFunds = DB::table('funds')
            ->where('user_id', $userId)
            ->first();

        if (!$userFunds) {
            return response()->json(['message' => 'User funds not found'], 404);
        }

        if ($userFunds->amount < $totalCost) {
            return response()->json(['message' => 'Insufficient funds'], 400);
        }

        DB::table('funds')
            ->where('user_id', $userId)
            ->update(['amount' => $userFunds->amount - $totalCost]);

        $existingStock = DB::table('stocks')
            ->where('user_id', $userId)
            ->where('symbol', $symbol)
            ->first();

        if ($existingStock) {
            DB::table('stocks')
                ->where('user_id', $userId)
                ->where('symbol', $symbol)
                ->update(['quantity' => $existingStock->quantity + $quantity]);
        } else {
            DB::table('stocks')->insert([
                'user_id' => $userId,
                'symbol' => $symbol,
                'quantity' => $quantity
            ]);
        }

        return response()->json(['message' => 'Stock bought successfully']);
    }



    public function stockList(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['error' => 'User ID is required'], 400);
        }

        try {
            $userStocks = DB::table('stocks')
                ->where('user_id', $userId)
                ->get();
            // get the cached stokc prices
            $cacheKey = 'polygon_data';
            if (!Cache::has($cacheKey)) {
                // If cache is empty, fetch new data
                $this->fetchData();
            }
            $cachedStocks = Cache::get($cacheKey);

            // Create a lookup array for quick price access
            $stockPrices = [];
            foreach ($cachedStocks as $stock) {
                $stockPrices[$stock['T']] = $stock['c']; // Assuming 'T' is the ticker symbol and 'c' is the closing price
            }

            // Prepare the result array
            $stocks = [];

            foreach ($userStocks as $stock) {
                $currentPrice = $stockPrices[$stock->symbol] ?? 0;

                $stocks[] = [
                    'symbol' => $stock->symbol,
                    'quantity' => $stock->quantity,
                    'currentPrice' => $currentPrice,
                ];
            }

            return response()->json(['stocks' => $stocks]);
        } catch (QueryException $e) {
            return response()->json(['error' => 'Database error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}
