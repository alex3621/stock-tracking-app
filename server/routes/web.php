<?php

/** @var \Laravel\Lumen\Routing\Router $router */
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

//calling API example (localhost:user/functionName)
//$router->post/get('endpoint name', 'controllerFileName@functionName')
$router->group(['prefix' => 'user', 'middleware' => 'App\Http\Middleware\CorsMiddleware'], function () use ($router) {
    //user can register for an account here
    $router->post('register', 'UserController@register');

    // login page
    $router->post('login', 'UserController@login');

    // funds 
    $router->get('funds', 'UserController@getFunds');

    //base fund for calculating asset
    $router->get('base_fund', 'UserController@getBaseFund');

    //Adds fund to user current funds
    $router->post('addFund', 'UserController@addFund');
});


$router->group(['prefix' => 'stock', 'middleware' => 'App\Http\Middleware\CorsMiddleware'], function () use ($router) {
    // TODO: Include other stock endpoints here
    $router->post('/searchStock/{symbol}', 'StockController@searchStock');

    // Page for managing stocks, buying 
    $router->post('buy', 'StockController@buy');

    // Route for selling
    $router->post('sell', 'StockController@sell');

    //testing fetchData function
    $router->post('/fetchData', 'StockController@fetchData');

    // Main page when logged in, displays stocks user currently wants to keep track
    $router->post('dashboard', 'StockController@dashboard');

    // List of stocks that can be sorted 
    $router->get('stockList', 'StockController@stockList');
});
