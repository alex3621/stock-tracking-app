# Setup Guide

## Backend

### Install prerequisites

- Install php by calling `brew install php`

- Install and set up composer by following get started guide here "https://getcomposer.org/"

- Follow link (https://lumen.laravel.com/docs/10.x/installation?fbclid=IwAR065esbDL00DngIiUeJgo9dc0AlJUCnN9HtvXageGMsQmIREY-mVoEDByY) to install lumen framework.

- Install Postman following the link (https://www.postman.com/downloads/)

- Install MySQL using link (https://dev.mysql.com/downloads/mysql/)

  - After installing MySQL, running the command `/usr/local/mysql/bin/mysql -u root -p` should allow enter into MySQL command line.
  - In order to call mysql by running just `mysql` instead of `/usr/local/mysql/bin/mysql`, add /usr/local/mysql/bin to /etc/paths using sudo pico

- Install Sequel Pro from link (https://sequelpro.com/download?fbclid=IwAR2W22dYma-xtmFhsQ9aDGQ4HP2WPseCeGasOxAEc0-d91rOZnIbNpQqrtY) and connect to localhost

### Initialization

- Add a new database `stock_tracking_app` through Sequel Pro interface

- cd to server folder

- run `composer install` to install dependencies that were git ignored.

### Running php server

- To start a php server, run the command `php -S localhost:8000 -t public`.

### To write a migration to update the database (docs:https://laravel.com/docs/10.x/migrations#generating-migrations)

1. Run `php artisan make:migration <file name>`. This creates a migration file inside migrations

2. Fill in the up/down functions

3. To run a migration, call `php artisan migrate`. (Migrate command automatically runs all the migrate files but it saves files already migrated inside the migration inside MYSQL so they won't be executed again)

4. `php artisan migrate:rollback --step=1` will rollback the last migration that you did if needed.

### Files for API endpoints

1. app/Http/Controllers/<various controllers>
2. /routes/web.php (Define routes)
