#   Heroes APP (Vue js, Express, MongoDb), on Docker Container on Ubuntu VM

En este tutorial desplegaremos la aplicación de Heroes app en contenedores, dentro de una vm y dentro de azure.

## Pre-requisitos ##

*	Instalar [git](https://git-scm.com/downloads)
*	Instalar [nodejs](https://nodejs.org/es/download/)
*	Instalar [Visual Studio Code](https://code.visualstudio.com/download)
*	Si no tienes suscripción de Azure, Activar [Visual Studio Dev Essentials](https://www.visualstudio.com/es/dev-essentials/)
*	Activar suscripción de 25 USD mensuales de Azure durante 12 meses
*   Haber ejecutado el taller de [IAAS-Heroes-App anteriormente](https://github.com/feranto/azureDemos/tree/master/CloudComputing/IAAS-Heroes-App)

## Construcción Imagenes de Contenedores

For the first container, we will be creating a Dockerfile from scratch. For the other containers, the Dockerfiles are provided.

### Contenedor Front-end
*   Traemos el codigo



* Create a Dockerfile

    * Access the jumpbox
    * In the `~/blackbelt-aks-hackfest/app/web` directory, add a file called "Dockerfile"
```
cd ~/blackbelt-aks-hackfest/app/web
```

        * If you in in a SSH session, use vi as the editor
        * In RDP, you can use Visual Studio Code

    * Add the following lines and save:

```
FROM node:9.4.0-alpine

ARG VCS_REF
ARG BUILD_DATE
ARG IMAGE_TAG_REF

ENV GIT_SHA $VCS_REF
ENV IMAGE_BUILD_DATE $BUILD_DATE
ENV IMAGE_TAG $IMAGE_TAG_REF

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN apk --no-cache add curl
EXPOSE 8080

CMD [ "npm", "run", "container" ]
```

* Create a container image for the node.js Web app

    From the terminal session: 

```
cd ~/blackbelt-aks-hackfest/app/web

docker build --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` --build-arg VCS_REF=`git rev-parse --short HEAD` --build-arg IMAGE_TAG_REF=v1 -t rating-web .
```

* Validate image was created with `docker images`

### Contenedor API

In this step, the Dockerfile has been created for you. 

* Create a container image for the node.js API app

```
cd ~/blackbelt-aks-hackfest/app/api

docker build -t rating-api .
```

* Validate image was created with `docker images`

### Contenedor MongoDB

* Create a MongoDB image with data files

```
cd ~/blackbelt-aks-hackfest/app/db

docker build -t rating-db .
```

* Validate image was created with `docker images`


## Corremos Contenedores

### Creamos la red Docker

Create a docker bridge network to allow the containers to communicate internally. 

```
docker network create --subnet=172.18.0.0/16 my-network
```

### Corremos Contenedor Mongodb

* Run mongo container

```
docker run -d --name db --net my-network --ip 172.18.0.10 -p 27017:27017 rating-db
```

* Validate by running `docker ps -a`

* Import data into database

```
docker exec -it db bash
```

    You will have a prompt inside the mongo container. From that prompt, run the import script (`./import.sh`)

```
root@61f9894538d0:/# ./import.sh
2018-01-10T19:26:07.746+0000	connected to: localhost
2018-01-10T19:26:07.761+0000	imported 4 documents
2018-01-10T19:26:07.776+0000	connected to: localhost
2018-01-10T19:26:07.787+0000	imported 72 documents
2018-01-10T19:26:07.746+0000	connected to: localhost
2018-01-10T19:26:07.761+0000	imported 2 documents
```

* Type `exit` to exit out of container

### Corremos contenedor API

* Run api app container

```
docker run -d --name api -e "MONGODB_URI=mongodb://172.18.0.10:27017/webratings" --net my-network --ip 172.18.0.11 -p 3000:3000 rating-api
```

    > Note that environment variables are used here to direct the api app to mongo.

* Validate by running `docker ps -a`

* Test api app with curl
```
curl http://localhost:3000/api/heroes
```

### Corremos Contenedor Web

* Run web app container

```
docker run -d --name web -e "API=http://172.18.0.11:3000/" --net my-network --ip 172.18.0.12 -p 8080:8080 rating-web
```

* Validate by running `docker ps -a`

* Test web app
    
    The jumpbox has a Public IP address and port 8080 is open. You can browse your running app with a link such as: http://<IP_PUBLICA>:8080 

    You can also test via curl
```
curl http://localhost:8080
```

    Para detener todos los contenedores, podemos utilizar:
    
```bash
docker stop $(docker ps -aq)
```

    Para eliminar todos los contenedores, podemos utilizar:

```bash
docker rm $(docker ps -aq)
```