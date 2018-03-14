# Address Book directory & food order solution

Register and find customers' phone number and addresses.
Get address, and names suggestions from [tel.search.ch](https://tel.search.ch) for an easier registration. Register the customer order and print out the order with an QRCode to load the itinerary on your Google Maps App.

Monitor your FritzBox router to get incoming/current caller number easily.


## Getting started

Copy and rename the file `config/index_default.json` into `config/index.json`.
Update the configuration parameters to your preferences.

Don't forget to configure your Google Maps API key, with  [JavaScript](https://developers.google.com/maps/documentation/javascript/), [Direction](https://developers.google.com/maps/documentation/directions/) and [Places Web Service](https://developers.google.com/places/web-service/) libraries enabled.

Copy and rename or replace the `logo_default.png` into `_logo.png` and `_logo-black.jpg` in `public/src/images/` with your logo.

Install dependencies by running `npm install` command.

Run the app `npm start` and go to http://localhost:8080 where the port is the one set in the `config/index.json` file

## CHANGELOG

### TODO
* /!\ Add login
* Refactor the Add Customer workflow
* Clear the search input after Customer insertion and Checkout completed

### 1.3.0
* Add deploy script
* Adapt a few things to work with deploy script
* Fix few styles

### 1.2.0
* Add: Discount input in order on checkout
* Add: Filter Dish and Ingredient lists when form input name is getting filled
* Refactor: Load Google API script dynamically
* Remove: Personnal config from versionning

### 1.1.1
* Fix: Undefined property on customer insert
* Remove: Windows service scripts

### 1.1.0
* Completed README
* Add: Dishes and Ingredients manage page
* Add: Windows Service install/uninstall script
* Add: Print 2 copies on checkout complete
* Change: Customer form field order (names before address)
* Change: Default font for a better rendering on Windows
* Fix: Formatting undefined phone string
* Fix: Call monitor alerts timeout

### 1.0.2
* Add: Clear search box button
* Fix suggestion not showing (with current number) when no suggestion found

### 1.0.1
* Fix: Checkout complete print style

### 1.0.0
* Initial release
