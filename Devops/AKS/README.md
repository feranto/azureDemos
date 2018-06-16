# Guia Demos Azure Global Devops 

Guia para empezar con practicas Devops en Kubernetes con AKS.

# Pre-requisitos

* Ver este genial Video(Guia Ilustrada de Kubernetes para niños):

[![Guia Ilustrada de Kubernetes para niños](imagenes/deis.png)](https://youtu.be/4ht22ReBjno)

*	Instalar [git](https://git-scm.com/downloads)
*	Instalar [nodejs](https://nodejs.org/es/download/)
*	Instalar [Visual Studio Code](https://code.visualstudio.com/download)
*	Si no tienes suscripción de Azure, Activar [Visual Studio Dev Essentials](https://www.visualstudio.com/es/dev-essentials/)
*	Activar suscripción de 25 USD mensuales de Azure durante 12 meses

# Slides Presentación

*   [Slides Kubernetes en Azure](https://github.com/Azure/blackbelt-aks-hackfest/tree/master/slides)

# Tutoriales Paso a Paso

*  [Comenzando con Contenedores y Kubernetes](https://github.com/Azure/blackbelt-aks-hackfest/tree/master/labs/day1-labs
)
* [CI/CD con Aks y Vsts ](https://almvm.azurewebsites.net/labs/vstsextend/kubernetes/)


## Guia Demos(no tiene todos los comandos, solo de referencia)

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

Primero eliminamos y detenemos todos los contenedores:

```
    Deteniendo Contenedores
        docker stop $( docker ps -a -q)
        docker rm $( docker ps -a -q)
```

Luego creamos una red de docker para comiunicar los contenedores:
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

2.  Corremos el contenedor

    ```
    docker run -d --name web -e "API=http://173.18.0.11:3000/" --net my-network --ip 173.18.0.12 -p 8080:8080 rating-web
    ```

Ahora podemos navegar a <http://localhost:8080>

### App en cluster kubernetes 

#### Guardamos las imagenes en un registro
1.  Guardamos las imagenes en un registro

        ```bash
        ACR_SERVER=
        ACR_USER=
        ACR_PWD=

        docker login --username $ACR_USER --password $ACR_PWD $ACR_SERVER


        docker tag rating-db $ACR_SERVER/azureworkshop/rating-db:v1
        docker tag rating-api $ACR_SERVER/azureworkshop/rating-api:v1
        docker tag rating-web $ACR_SERVER/azureworkshop/rating-web:v1

        docker push $ACR_SERVER/azureworkshop/rating-db:v1
        docker push $ACR_SERVER/azureworkshop/rating-api:v1
        docker push $ACR_SERVER/azureworkshop/rating-web:v1
        ```

#### Creamos un cluster de kubernetes y desplegamos

1.  Ingresamos a <https://shell.azure.com>
2.  Escogemos la terminal bash
3.  Definimos algunas variables:
    ```
        NAME=globaldevops-aks-node-2
        LOCATION=eastus
        CLUSTER_NAME="${NAME//_}"
    ```

4.  Creamos un cluster de kubernetes:
    ```
    az group create -l $LOCATION -n $NAME
    az aks create -n $CLUSTER_NAME -g $NAME -c 2 -k 1.7.7 --generate-ssh-keys -l $LOCATION
    ```

5.  Obtenemos las credenciales
    ```
    az aks get-credentials -n $CLUSTER_NAME -g $NAME
    ```

6.  Vemos los nodos de nuestro cluster
    ```
    kubectl get nodes
    ```

#### Desplegamos nuestra aplicación al cluster

1.  Primero clonamos nuestro repositorio:
    ```
    git clone https://github.com/Azure/blackbelt-aks-hackfest.git
    ```

1.  Agregamos el registro de nuestras imagenes a un archivo YAML

    ```
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    vi heroes-db.yaml
    ```

Y reemplazamos la variable ```<login server>``` por el servidor de nuestro registro.

2. Reemplazamos la variable tambien en el siguiente archivo YAML:

    ```
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    vi heroes-web-api.yaml
    ```
3.  Accedemos a nuestro cluster de kubernetes

    ```
    az aks get-credentials -n $CLUSTER_NAME -g $NAME
    ```
4.  Agregamos un secreto en kubernetes, las credenciales del registro

```
# set these values to yours

ACR_SERVER=
ACR_USER=
ACR_PWD=

kubectl create secret docker-registry acr-secret --docker-server=$ACR_SERVER --docker-username=$ACR_USER --docker-password=$ACR_PWD --docker-email=superman@heroes.com
```

5.  Finalmente desplegamos nuestros archivos YAML

6.  Usamos kubectl CLI para desplegar cada app
    ```
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    kubectl apply -f heroes-db.yaml
    ```

7. Obtenemos el pod de mongo
    ```
    kubectl get pods

    NAME                                 READY     STATUS    RESTARTS   AGE
    heroes-db-deploy-2357291595-k7wjk    1/1       Running   0          3m

    MONGO_POD=heroes-db-deploy-2357291595-k7wjk
    ```

8. Importamos la data en MongoDB
    ```
    # ensure the pod name variable is set to your pod name
    # once you exec into pod, run the `import.sh` script

    kubectl exec -it $MONGO_POD bash

    root@heroes-db-deploy-2357291595-xb4xm:/# ./import.sh
    2018-01-16T21:38:44.819+0000	connected to: localhost
    2018-01-16T21:38:44.918+0000	imported 4 documents
    2018-01-16T21:38:44.927+0000	connected to: localhost
    2018-01-16T21:38:45.031+0000	imported 72 documents
    2018-01-16T21:38:45.040+0000	connected to: localhost
    2018-01-16T21:38:45.152+0000	imported 2 documents
    root@heroes-db-deploy-2357291595-xb4xm:/# exit

    # be sure to exit pod as shown above
    ```


9.  Desplegamos cada app con kubectl CLI

    ```
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    kubectl apply -f heroes-web-api.yaml
    ```

10. Validatamos

    ```
    kubectl get pods

    NAME                                 READY     STATUS    RESTARTS   AGE
    heroes-api-deploy-1140957751-2z16s   1/1       Running   0          2m
    heroes-db-deploy-2357291595-k7wjk    1/1       Running   0          3m
    heroes-web-1645635641-pfzf9          1/1       Running   0          2m
    ```

11. Chequeamos para ver los servicios desplegados
    ```
    kubectl get service

    NAME         TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
    api          LoadBalancer   10.0.20.156   52.176.104.50    3000:31416/TCP   5m
    kubernetes   ClusterIP      10.0.0.1      <none>           443/TCP          12m
    mongodb      ClusterIP      10.0.5.133    <none>           27017/TCP        5m
    web          LoadBalancer   10.0.54.206   52.165.235.114   8080:32404/TCP   5m
    ```

12. Navegamos a la IP publica para ver la app funcionando

