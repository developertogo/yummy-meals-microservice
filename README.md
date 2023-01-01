Yummy Meals Order Service
=========================

## Objective

### Backend

Given a database with already seeded tables and data, please create a database-backed web application server that responds to a URL and returns json. More specifically, your web server will respond to the `GET index` endpoint `/api/v1/orders` and return data according to the specification as described in `spec/api/v1/orders_spec.rb`

### Frontend
Then, create a view for the user's orders that displays the key parts of an order. Your view can take any form that you'd like. Feel free to be creative!

[For the source, see: [Yummy Meals Order List with React](https://github.com/developertogo/yummy-meals-order) repo]

### Tech Stack
This project is designed to be language and framework agnostic. Your web server can be written in Python with Django/Flask, Javascript with Node+Express, or something more exotic. The tests are written in rspec+Ruby, but should be very readable even if you don't know any Ruby: All they do is ping a URL and inspect the json response.

***

Solution
========

* The Frontend [[here](https://github.com/developertogo/yummy-meals-order)] was implemented using `React`, `TypeScript`, and [Refine](https://github.com/refinedev/refine) UI Framework.
* The Backend [[this repo](https://github.com/developertogo/yummy-meals-microservice)] was implemented using `NodeJS`, `TypeScript`, and [LoopBack 4](https://github.com/loopbackio/loopback-next) Microservice Framework.

### Usage - How to run it

1. `cd server`
2. `export PORT=`**4000**
3. `npm start`

```
# Your terminal will show:

> yummy-meals@0.0.1 prestart
> yarn run rebuild

yarn run v1.22.19
$ yarn run clean && yarn run build
$ lb-clean dist *.tsbuildinfo .eslintcache
$ lb-tsc
✨  Done in 3.92s.

> yummy-meals@0.0.1 start
> node -r source-map-support/register .

Server is running at http://[::1]:4000
Try http://[::1]:4000/ping
```

## Run unit test to verify everything is fine

![Unit Test Output](https://github.com/developertogo/yummy-meals-microservice/blob/master/assets/rspec-test-run.jpg)

## Go to http://localhost:4000/explorer to display the Swagger Restful API

![Swagger REST API Documentation](https://github.com/developertogo/yummy-meals-microservice/blob/master/assets/yummy-meal-swagger.jpg)

***

Assignment Instruction Details
------------------------------

1. Read the rest of this README and review `spec/api/v1/orders_spec.rb` to understand the endpoint requirements
2. Create your sample application, using the database dump `yummy-dump.sql`
3. Perform the following one time setup steps to get the spec runner working
    - Navigate to the project root
    - Modify `spec/config.rb` if necessary
    - Install ruby if necessary
    - Install the `bundler` gem if necessary
    - Run `bundle install`
    - Make sure your application server is running
4. Run `bundle exec rspec` until specs pass
5. Create a view to display the orders for a user
    - Each order should show:
      - the delivery date
      - the meal names
      - the meal images
      - the quantity of each meal

What we're looking for
----------------------

We'd like you to strike a balance between maintainability and speed, with a mild preference towards maintainability. (After all, we've got to read this code to judge it)

Don't worry too much about where it falls in the spectrum though; it's more important that when we talk about your code that you recognize the tradeoffs you made and what you can cut/add if asked to move in either direction.

In particular, if there's a (well respected) library or framework that you would like to use as part of your implementation, please use it. We're here to make working software that helps get `Yummy Meals` food to families, not to re-implement bcrypt.

The rspec test
--------------

After resetting the database, the `rspec test` pings `GET /api/v1/orders` with various parameters and examines the json response. The spec can be split out five sections:

- Examining the contents of the json for a single record
- Sorting
- Filtering
- Pagination
- Error Handling

The desired output as defined in the "contents of a single record" section deliberately contains some questionable implementation choices. Please accommodate the desired output and we can discuss the pros and cons of the given json structure.

The Database and Schema
-----------------------

The sample database provided consists of four tables:

- users
- orders
- order_attributes
- meals

A user has no association columns.

A meal has no association columns.

Orders have a `user_id` (belong to a user).

The order_attributes table is a join table that connects orders and meals through the ```order_id``` and ```meal_id``` columns.

```
yummy=# \d+ users
Table "public.users"
   Column   |            Type
------------+-----------------------------
 id         | integer
 name       | character varying
 email      | character varying
 phone      | character varying

yummy=# \d+ orders
Table "public.orders"
              Column               |            Type
-----------------------------------+-----------------------------
 id                                | integer
 user_id                           | integer
 delivery_date                     | timestamp without time zone

yummy=# \d+ order_attributes
Table "public.order_attributes"
   Column    |            Type
-------------+-----------------------------
 id          | integer
 meal_id     | integer
 order_id    | integer
 quantity    | integer

yummy=# \d+ meals
Table "public.meals"
   Column    |            Type
-------------+-----------------------------
 id          | integer
 name        | character varying
 description | text
 image_url   | character varying
```
