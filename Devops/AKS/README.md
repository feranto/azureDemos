# Guia Demos Azure Global Devops 

Guia para empezar con practicas Devops en Kubernetes con AKS.

# Pre-requisitos

*	Instalar [git](https://git-scm.com/downloads)
*	Instalar [nodejs](https://nodejs.org/es/download/)
*	Instalar [Visual Studio Code](https://code.visualstudio.com/download)
*	Si no tienes suscripción de Azure, Activar [Visual Studio Dev Essentials](https://www.visualstudio.com/es/dev-essentials/)
*	Activar suscripción de 25 USD mensuales de Azure durante 12 meses

# Tutoriales Paso a Paso

*  [Comenzando con Contenedores y Kubernetes](https://github.com/Azure/blackbelt-aks-hackfest/tree/master/labs/day1-labs
)
* [CI/CD con Aks y Vsts ](https://almvm.azurewebsites.net/labs/vstsextend/kubernetes/)

Names:

globaldevops-aks-node-1
globaldevopsaksnode1
globaldevops-aks-netcore-1
globaldevopsaksnetcore1

## Demos 

### App nativa en vm 

1. Primero nos conectamos a nuestra vm

```bash ssh vm-docker-hackfest ```


#### Base de Datos
2. Verificamos que mongodb este corriendo

```bash service mongodb status ```

3. Cargamos nuestras colecciones

    ```bash
    cd ~/blackbelt-aks-hackfest/app/db

    mongoimport --host localhost:27019 --db webratings --collection heroes --file ./heroes.json --jsonArray && mongoimport --host localhost:27019 --db webratings --collection ratings --file ./ratings.json --jsonArray && mongoimport --host localhost:27019 --db webratings --collection sites --file ./sites.json --jsonArray
    ```


#### API
4.  Corremos la api node

    ```bash
    cd ~/blackbelt-aks-hackfest/app/api

    npm install && npm run localmachine &
    ```

5.  Ahora podemos navegar a <http://localhost:3000/api/heroes>


#### Front End

1.  Ahora corremos el frontend 

    ```bash
    cd ~/blackbelt-aks-hackfest/app/web

    npm install && npm run localmachine
    ```

1.  Ahora podemos navegar a <http://localhost:8080>

### App en contendores en vm 

Primero creamos una red de docker para comiunicar los contenedores:
```
docker network create --subnet=173.18.0.0/16 my-network
```

#### Base de Datos

1.  Creamos la imagen docker de la bbdd

    ```
    cd ~/blackbelt-aks-hackfest/app/db

    docker build -t rating-db .
    ```
2.  Corremos el contendor

    ```
    docker run -d --name db --net my-network --ip 173.18.0.10 -p 27017:27017 rating-db
    ```

3. Validamos que este activo `docker ps -a`

4. Importamos data a la bbdd

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

5. Escribimos `exit` para salir del contenedor

#### Api

1.  Creamos la imagen docker de la api

    ```
    cd ~/blackbelt-aks-hackfest/app/api

    docker build -t rating-api .
    ```

2.  Corremos el contenedor

    ```
    docker run -d --name api -e "MONGODB_URI=mongodb://172.18.0.10:27017/webratings" --net my-network --ip 172.18.0.11 -p 3000:3000 rating-api
    ```

#### Front End

1.  Creamos la imagen docker del frontend

    ```
    cd ~/blackbelt-aks-hackfest/app/web
    
    docker build --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` --build-arg VCS_REF=`git rev-parse --short HEAD` --build-arg IMAGE_TAG_REF=v1 -t rating-web .
    ```

### App en cluster kubernetes 

### CI/CD App en cluster kubernetes 