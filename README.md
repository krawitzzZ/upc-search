UPC ISBN Amazon Search test app
===============================

Local setup
-------------

**Installation**

- clone the repo git

        $ git clone https://github.com/krawitzzZ/upc-search.git testapp
        $ cd testapp

- install dependencies

        $ npm install

- create .env file in project root folder with your AWS credentials

        AWS_SECRET_KEY=<your AWS secret>
        AWS_ACCESS_KEY=<your AWS access key ID>
        ASSOCIATE_TAG=<your AWS associate tag>

- start the developer server

        $ npm start

- run the app

        $ react-native run-android // or
        $ react-native run-ios
