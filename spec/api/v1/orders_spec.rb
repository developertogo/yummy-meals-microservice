require 'byebug'
require 'faraday'
require 'json'
require 'config'

def reset_db
  puts RESET_DB_COMMAND
  system RESET_DB_COMMAND
end

def http
  connection = Faraday.new
  connection.headers['Content-Type'] = 'application/json'
  connection.headers['Accept'] = 'application/json'
  return connection
end

RSpec.describe "api/v1/orders resouces" do
  context "GET index" do
    before(:all) { reset_db }

    context 'with valid params' do
      context 'json content' do
        # Tests the structure of the returned json
        # What should be returned when hitting /api/v1/orders?user_id=#{USER_ONE_ID}
        # {
        #   "orders": [
        #     {
        #       "id": 1,
        #       "delivery_date": "2018-06-01",
        #       "meal_count": 6,
        #       "meals": [
        #         {
        #           "id": 1,
        #           "quantity": 2,
        #           "name": "Apple",
        #           "description": "Yummy apple",
        #           "image_url": "https://helloyumi.com/img/products/sku/0561.png"
        #         },
        #         {
        #           "id": 2,
        #           "quantity": 2,
        #           "name": "Japanese Sweet Potato",
        #           "description": "Yummy tummy",
        #           "image_url": "https://helloyumi.com/img/products/sku/0901.png"
        #         },
        #         {
        #           "id": 3,
        #           "quantity": 2,
        #           "name": "What A Peach",
        #           "description": "Yummy peach",
        #           "image_url": "https://helloyumi.com/img/products/sku/0478.png"
        #         },
        #       ]
        #     },
        #     {
        #       "id": 2,
        #       ...
        #     },
        #     {
        #       "id": 3,
        #       ...
        #     }
        #   ]
        # }

        context 'order json' do
          it 'includes order delivery_date' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_ONE_ID}"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            # Uncomment below to output the response json in your shell
            # puts JSON.pretty_generate(json)
            expect(json['orders'].map { |order_json| order_json['delivery_date'] }).to include('2018-06-01')
          end
        end

        context 'meals json' do
          it 'includes meal info and order specific information' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_ONE_ID}"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            june_one_order_json = json['orders'].find { |order_json| order_json['delivery_date'] == '2018-06-01'}
            meals_json = june_one_order_json['meals']
            expect(meals_json.map { |meal_json| meal_json['id'].to_i }).to match_array([1, 2, 3]) # match_array matches true for both [1,2,3] and [3,2,1]
            expect(meals_json.map { |meal_json| meal_json['name'] }).to match_array(['Apple', 'Japanese Sweet Potato', 'What A Peach'])
            expect(meals_json.map { |meal_json| meal_json['description'] }).to match_array(['Yummy apple', 'Yummy tummy', 'Yummy peach'])
            expect(meals_json.map { |meal_json| meal_json['quantity'].to_i }).to match_array([2, 2, 2])
          end

          it 'includes the calculated attribute meal_count' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_ONE_ID}"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            june_one_order_json = json['orders'].find { |order_json| order_json['delivery_date'] == '2018-06-01'}
            expect(june_one_order_json['meal_count']).to eq(6)
          end
        end
      end

      context 'sorts' do
        # User one has three orders, departing (in order of id) June 1, June 8, June 15

        context 'default sort' do
          it 'sorts by id ascending by default' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_ONE_ID}"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            expect(json['orders'].map { |order_json| order_json['id'] }).to eq([1,3,4])
          end
        end

        context 'delivery date' do
          it 'allows ascending sort' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_ONE_ID}&sort=delivery_date&direction=asc"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            expect(json['orders'].map { |order_json| order_json['id'] }).to eq([1,3,4])
          end

          it 'allows descending sort' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_ONE_ID}&sort=delivery_date&direction=desc"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            expect(json['orders'].map { |order_json| order_json['id'] }).to eq([4,3,1])
          end
        end
      end

      context 'filters' do
        # User One has three orders on 6/1/2018, 6/8/2018, and 6/15/2018

        context 'delivery date' do
          it 'filters by june first' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_ONE_ID}&delivery_date=6%2F01%2F2018"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            expect(json['orders'].map { |order_json| order_json['id'] }).to match_array([1])
          end

          it 'filters by June eighth' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_ONE_ID}&delivery_date=6%2F08%2F2018"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            expect(json['orders'].map { |order_json| order_json['id'] }).to match_array([3])
          end
        end
      end

      context 'pagination' do
        # User two has 7 orders , with ids [2, 5, 6, 7, 8, 9, 10]

        context 'with no params' do
          it 'defaults to 4 results' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_TWO_ID}"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            expect(json['orders'].map { |order_json| order_json['id'] }).to eq([2, 5, 6, 7])
          end
        end

        context 'with page params' do
          it 'allows page navigation with the default 4 per page' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_TWO_ID}&page=2"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            expect(json['orders'].map { |order_json| order_json['id'] }).to eq([8, 9, 10])
          end
        end

        context 'with explicit page and per params' do
          it 'allows custom pagination' do
            response = http.get "#{BASE_URL}/api/v1/orders?user_id=#{USER_TWO_ID}&page=2&per=2"
            expect(response.status).to eq(HTTP_SUCCESS)
            json = JSON.parse(response.body)
            expect(json['orders'].map { |order_json| order_json['id'] }).to eq([6, 7])
          end
        end
      end
    end

    context 'with invalid params' do
      context 'user_id is not provided' do
        it 'returns an errored response and a useful error message' do
          response = http.get "#{BASE_URL}/api/v1/orders"
          expect(response.status).to eq(HTTP_UNPROCESSABLE)
          json = JSON.parse(response.body)
          expect(json['errors']).to eq(['User Id is Required'])
        end
      end
    end
  end
end