# react-xo-ava-app

react-xo-ava-app web app template

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)


## Development

first things first...
```shell
$ npm i
```

### Available commands

run dev server
```shell
$ npm start
```


run tests
```shell
$ npm test
```

run linter
```shell
$ npm run lint
```

create build
```shell
$ npm run build
```

## Docker

### commands

build
```shell
$ docker build -t react-xo-ava-app .
```

run
```shell
$ docker run --name react-xo-ava-app -p 8080:80 -d react-xo-ava-app
```

stop and remove
```shell
$ docker stop react-xo-ava-app && docker rm react-xo-ava-app
```

> open with bash in container

For troubleshooting in the container, first change the docker file's `FROM` to be<br>

`FROM openresty/openresty:centos`

stop and remove
```shell
$ run --name react-xo-ava-app -p 8080:80 --rm -i -t react-xo-ava-app bash
```
