This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Changes to Create React App

- Support [xo](https://github.com/xojs/xo) styling.
- [Avajs](https://github.com/avajs/ava) testing with [Enzyme](https://github.com/airbnb/enzyme) and [Enzyme React Adapter](https://www.npmjs.com/package/enzyme-adapter-react-16)
- Code coverage with [nyc](https://github.com/istanbuljs/nyc)

<br>

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Runs unit tests with nyc and ava.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

## Docker

### `build`

`docker build -t react-xo-ava-app .`

### `run`

`docker run --name react-xo-ava-app -p 8080:80 -d react-xo-ava-app`

### `stop and remove`

`docker stop react-xo-ava-app && docker rm react-xo-ava-app`

### `open with bash in container`

For troubleshooting in the container, first change the docker file's `FROM` to be<br>

`FROM openresty/openresty:centos`

<br>
then
<br>

`run --name react-xo-ava-app -p 8080:80 --rm -i -t react-xo-ava-app bash`