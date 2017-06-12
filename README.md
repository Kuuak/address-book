# L'Escale Gourmande Address Book

Register and find customers' phone number and addresses.
Get address, and names suggestions from [tel.search.ch](https://tel.search.ch) for an easier registration. Register the customer order and print out the order with an QRCode to load the itinerary on your Google Maps App.

Monitor your FritzBox router to get incoming/current caller number easily.


## Getting started

Insert your Google Maps API key, with  [JavaScript](https://developers.google.com/maps/documentation/javascript/), [Direction](https://developers.google.com/maps/documentation/directions/) and [Places Web Service](https://developers.google.com/places/web-service/) libraries enabled, in the public/index.html file on line 9.

Install dependencies by running `npm install --only=prod` command.

Run the app `npm start` and go to http://localhost:8080

## CHANGELOG

### TODO
* Manage page for Dish and Extra
* Refactor the Add Customer workflow
* Clear the search input after Customer insertion and Checkout completed

### 1.0.2
* Add: Clear search box button
* Fix suggestion not showing (with current number) when no suggestion found

### 1.0.1
* Fix: Checkout complete print style

### 1.0.0
* Initial release
