# NodeJs-Master-Assignment2


**RESTful-API App for Pizza-Delivery Company**

**Paths**: Users, Tokens, Menu, Carts, Orders

---------------------------------------
## Users

#### Supported methods : POST,GET,PUT,DELETE

1. **POST**: Add new user
Required Data: firstName, lastName, email, address, password, tosAgreement
Request:
		Url: domain/users 
		Body:
	
		{
			"firstName" : "<USER_FIRST_NAME>",
			"lastName" : "<USER_LAST_NAME>",
			"email" : "<USER_EMAIL>",
			"address" : "<USER_ADDRESS>",
			"password" : "<USER_PASSWORD>",
			"tosAgreement" : true
		}

	Response:
	Success -> 200 {}
	Failure -> 400/500 {"Error": "<ERROR_DESCRIPTION>"}

2. **GET**: Retrieve user data for specified email 
Required data: email and token.
Request:
Url: domain/users?email=<USER_EMAIL>
Header: token: <USER_TOKEN>

	Response:
	Success -> 200

		{
			"firstName": "<USER_FIRST_NAME>",
			"lastName": "<USER_LAST_NAME>",
			"email": "<USER_EMAIL>",
			"address": "<USER_ADDRESS>",
			"tosAgreement": true,
			"carts": [<CARTS_ID_LIST>],
			"orders": [<ORDERS_ID_LIST>]
		}
	Failure -> 400/403/404 {"Error": "<ERROR_DESCRIPTION>"}

3. PUT: Update user data except the email address which used as user-ID.
Required data: email and token
Optional data: firstName, lastName, address, password (at least one must be specified)

	Request:
	Url: domain/users
	Header: token: <USER_TOKEN>
	Body:

		{
			"email": "<USER_EMAIL>",
			"firstName": "<USER_FIRST_NAME>",
			"lastName": "<USER_LAST_NAME>",
			"address": "<USER_ADDRESS>",
			"password": "<USER_PASSWORD>",
			"tosAgreement": true
		}

	Response:
	Success -> 200 {}
	Failure -> 400/403/500 {"Error": "<ERROR_DESCRIPTION>"}

4. **DELETE**: Remove user and all its related data(carts,orders) from system
Required data: email and token

	Request:
	Url: domain/users?email=<USER_EMAIL>
	Header: token: <USER_TOKEN>

	Response:
	Success -> 200 {}
	Failure -> 400/403/500 {"Error": "<ERROR_DESCRIPTION>"}

---------------------------------------
## Tokens


#### Supported methods : POST,GET,PUT,DELETE
 
1. **POST**: Add new token for specified user to use it in requests for authentication
Required data: email, password

	Request:
	Url: domain/tokens
	Body:

		{
			"email": "<USER_EMAIL>",
			"address": "<USER_ADDRESS>",
		}

	Response:
	Success -> 200

		{
			"email": "<USER_EMAIL>",
			"id": "<TOKEN_ID>",
			"expires": <EXPIRE_DATE>
		} 
	Failure -> 400/500 {"Error": "<ERROR_DESCRIPTION>"}

2. **GET**: Retrieve token data for specified tokenId 
Required data: tokenId

	Request:
	Url: domain/tokens?id=<TOKEN_ID>

	Response:
	Success -> 200

		{
			"email": "<USER_EMAIL>",
			"id": "<TOKEN_ID>",
			"expires": <EXPIRE_DATE>
		} 
	Failure -> 400/404 {"Error": "<ERROR_DESCRIPTION>"}

3. **PUT**: Extend token expire time for none expired tokens
Required data: tokenId, extend(=true)

	Request:
	Url: domain/tokens
	Body:

		{
			"id": "TOKEN_ID>",
			"extend": true
		}

	Response:
	Success -> 200 {}
	Failure -> 400/500 {"Error": "<ERROR_DESCRIPTION>"}

4. **DELETE**: Remove token from system
Required data: tokenId

	Request:
	Url: domain/tokens?id=<TOKEN_ID>

	Response:
	Success -> 200 {}
	Failure -> 400/500 {"Error": "<ERROR_DESCRIPTION>"}

---------------------------------------
## Menu

#### Supported methods : GET

Note: on this application I added all menu-items in json file and users can only read it, and any modifications can done by administrator on server side.
 
1. **GET**: Retrieve all menu-items
Required data: token

	Request:
	Url: domain/menu
	Header: token: <USER_TOKEN>

	Response:
	Success -> 200

		{
			"email": "<USER_EMAIL>",
			"id": "<TOKEN_ID>",
			"expires": <EXPIRE_DATE>
		} 
	Failure -> 400/404 {"Error": "<ERROR_DESCRIPTION>"}

---------------------------------------
## Carts

#### Supported methods : POST,GET,PUT,DELETE
 
1. **POST**: Add new cart
Required data: array object of menu-items (each item contain itemId, size, price, quantity) and token

	Request:
	Url: domain/carts
	Header: token: <USER_TOKEN>
	Body:

		[
			{
				"itemId": <MENU_ITEM_ID>,
				"size": "<MENU_ITEM_SIZE>",
				"price": <MENU_ITEM_PRICE>,
				"quantity": <MENU_ITEM_QTY>
			},
			{
				"itemId": <MENU_ITEM_ID>,
				"size": "<MENU_ITEM_SIZE>",
				"price": <MENU_ITEM_PRICE>,
				"quantity": <MENU_ITEM_QTY>
			},
			...,
			...
		]

	Response:
	Success -> 200
	 
		{
			"cartId": "CART_ID>"
		}
	Failure -> 400/403/500 {"Error": "<ERROR_DESCRIPTION>"}

2. **GET**: Retrieve cart data for specified cartId
Required data: cartId and token

	Request:
	Url: domain/carts?id=<CART_ID>
	Header: token: <USER_TOKEN>

	Response:
	Success -> 200

		{
			"id": "<CART_ID>",
			"useremail": "<USER_EMAIL>",
			"cartItems": [<CARTS_ITEMS_LIST>]
		}
	Failure -> 400/403/404 {"Error": "<ERROR_DESCRIPTION>"}

3. **PUT**: Update existing cart items and add new cart items
Required data: cartId and token
Optional data: array object of menu-items (each item contain itemId, size, price, quantity) (at least one must be specified)

	Request:
	Url: domain/carts
	Header: token: <USER_TOKEN>
	Body:

		{
			"id": "<CART_ID>",
			"cartItems": [<CARTS_ITEMS_LIST>]
		}

	Response:
	Success -> 200
	 
		{
			"cartId": "<CART_ID>"
		}
	Failure -> 400/403/500 {"Error": "<ERROR_DESCRIPTION>"}

4. **DELETE**: Remove cart and all its related data(cartID at userData.carts[]) from system
Required data: cartId and token

	Request:
	Url: domain/carts?id=<CART_ID>
	Header: token: <USER_TOKEN>

	Response:
	Success -> 200 {}
	Failure -> 400/403/500 {"Error": "<ERROR_DESCRIPTION>"}

	Also we can use DELETE method to only delete one cart-item from specified cart by passing both cartId and cart-item-id as the following:
	Request:
	Url: domain/carts?id=<CART_ID>&itemid=<CART_ITEM_ID>
	Header: token: <USER_TOKEN>

	Response:
	Success -> 200 {}
	Failure -> 400/403/500 {"Error": "<ERROR_DESCRIPTION>"}

---------------------------------------
## Orders

#### Supported methods : POST,GET
 
1. **POST**: Add new order and use stripe-apis to accept payment and after that send email notification(using mailgun-apis) to user with order receipt
Required data: cartId and token

	Request:
	Url: domain/orders
	Header: token: <USER_TOKEN>
	Body:

		{
			"cartId": "<CART_ID>"
		}

	Response:
	Success -> 200 

		{
			"orderId": "ORDER_ID>"
		}
	Failure -> 400/403/500 {"Error": "<ERROR_DESCRIPTION>"}

2. GET: Retrieve order data for specified orderId
Required data: orderIdId and token
	
	Request:
	Url: domain/orders?id=<ORDER_ID>
	Header: token: <USER_TOKEN>

	Response:
	Success -> 200

		{
			"id": "<CART_ID>",
			"useremail": "<USER_EMAIL>",
			"orderItems": [<ORDERS_ITEMS_LIST>],
			"price": <ORDER_PRICE>,
			"date": <ORDER_DATE>,
			"paymentStatus": "<ORDER_STATUS>"		
		}


	Failure -> 400/403/404 {"Error": "<ERROR_DESCRIPTION>"}

----------------------------

## Background-Workers:

The app contain one background worker run once per day to remove expired token to clean the system.


