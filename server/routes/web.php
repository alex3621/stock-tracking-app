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
$router->group(['prefix' => 'user'], function () use ($router) {
    //user can register for an account here
    $router->post('register', 'UserController@register');

    // login page
    $router->post('login', 'UserController@login');
});


$router->group(['prefix' => 'stock'], function () use ($router) {
    // TODO: Include other stock endpoints here

    // Main page when logged in, displays stocks user currently wants to keep track
    $router->post('dashboard', 'StockController@dashboard');

    // Page for managing stocks, adding and removing
    $router->post('manage', 'StockController@manage');

    // List of stocks that can be sorted 
    $router->post('stockList', 'StockController@stockList');
});
