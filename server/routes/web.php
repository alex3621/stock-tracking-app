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

$router->group(['prefix' => 'user'], function () use ($router) {
    $router->post('register', 'UserController@register');
    // TODO: Include other user endpoints
});


$router->group(['prefix' => 'stock'], function () use ($router) {
    // TODO: Include other stock endpoints here
});