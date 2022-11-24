yummy-test
=============

**yummy-test** is a take home interview project for Yumi Engineering.

Given a database with already seeded tables and data, please create a database-backed web application server that responds to a URL and returns json. More specifically, your web server will respond to the `GET index` endpoint `/api/v1/orders` and return data according to the specification as described in `api/v1/orders_spec.rb`

Then, create a view for the user's orders that displays the key parts of an order. Your view can take any form that you'd like. Feel free to be creative!

This project is designed to be language and framework agnostic. Your web server can be written in Python with Django/Flask, Javascript with Node+Express, or something more exotic. The tests are written in rspec+Ruby, but should be very readable even if you don't know any Ruby: All they do is ping a URL and inspect the json response.

Instructions
------------

1. Read the rest of this README and review `api/v1/orders_spec.rb` to understand the endpoint requirements
2. Create your sample application, using the database dump `yummy_development`
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

In particular, if there's a (well respected) library or framework that you would like to use as part of your implementation, please use it. We're here to make working software that helps get yummy food to families, not to reimplement bcrypt.

The rspec test
--------------

After resetting the database, the [rspec test](https://github.com/helloyumi/yummy-test/blob/master/spec/api/v1/orders_spec.rb) pings `GET /api/v1/orders` with various parameters and examines the json response. The spec can be split out five sections:
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
yummy_development=# \d+ users
Table "public.users"
   Column   |            Type
------------+-----------------------------
 id         | integer
 name       | character varying
 email      | character varying
 phone      | character varying

yummy_development=# \d+ orders
Table "public.orders"
              Column               |            Type
-----------------------------------+-----------------------------
 id                                | integer
 user_id                           | integer
 delivery_date                     | timestamp without time zone

yummy_development=# \d+ order_attributes
Table "public.order_attributes"
   Column    |            Type
-------------+-----------------------------
 id          | integer
 meal_id     | integer
 order_id    | integer
 quantity    | integer

yummy_development=# \d+ meals
Table "public.meals"
   Column    |            Type
-------------+-----------------------------
 id          | integer
 name        | character varying
 description | text
 image_url   | character varying
```
