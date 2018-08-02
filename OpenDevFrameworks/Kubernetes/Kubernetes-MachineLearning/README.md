# Orquestando webservices de machine learning en python con Kubernetes

## Pre-requisitos ##

* Ver este genial Video(Guia Ilustrada de Kubernetes para niños):

[![Guia Ilustrada de Kubernetes para niños](imagenes/deis.png)](https://youtu.be/4ht22ReBjno)

*	Instalar [git](https://git-scm.com/downloads)
*	Instalar [nodejs](https://nodejs.org/es/download/)
*	Instalar [Visual Studio Code](https://code.visualstudio.com/download)
*	Si no tienes suscripción de Azure, Activar [Visual Studio Dev Essentials](https://www.visualstudio.com/es/dev-essentials/)
*	Activar suscripción de 25 USD mensuales de Azure durante 12 meses


## Creación de Imagenes Docker##
### Creación de vm Linux ###

*   Primero accedemos a la [consola web de azure](http://shell.azure.com/)
*   Luego procedemos a definir algunas variables que usaremos
```bash 
    RG_NAME=MlDockerTutorial  
    VM_NAME=MlUbuntuVm
    REGION=eastus
```
*   Luego procedemos a crear un grupo de recursos
```bash 
az group create --name $RG_NAME --location $REGION
```
*   Una vez creado el grupo de recurso, creamos una vm ubuntu
```bash 
az vm create --resource-group $RG_NAME \
  --name $VM_NAME \
  --image UbuntuLTS \
  --generate-ssh-keys \
  --verbose
```
*   Una vez creada la vm, buscamos la dirección de la IP pública y nos conectamos vía ssh
```bash 
PUBLIC_IP_ADDRESS=<YOUR_PUBLIC_IP_ADDRESS>
```
```bash 
ssh $PUBLIC_IP_ADDRESS
```
### Instalación Docker ###
#### Configuración repositorio Docker
*   Actualización de indices de paquetes apt
```bash 
sudo apt-get update
```
*   instalacion de paquetes apt 
```bash 
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
```
*   agregamos la llave oficial GPG de docker
```bash 
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
*   seteamos el repositorio estable de docker
```bash 
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```
####   Instalando Docker CE en ubuntu
*   Actualización de indices de paquetes apt
```bash 
sudo apt-get update
```
*   Instalacion de paquete más reciente
```bash 
sudo apt-get install docker-ce
```
*   Verificación de que docker esta funcionando
```bash 
sudo docker run hello-world
```

#### Administrar docker como usuario no-root
*   Creación grupo docker
```bash 
sudo groupadd docker
```
*   Agregamos nuestro usuario al grupo
```bash 
sudo usermod -aG docker $USER
```
*   Hacemos log out y volvemos a loguearnos
```bash 
exit
```
```bash 
ssh <PUBLIC_IP_ADDRESS>
```

*   Verificamos que podamos correr docker sin usuario root
```bash 
docker run hello-world
```

*   [Comandos Básicos Docker](https://github.com/feranto/azureDemos/tree/master/OpenDevFrameworks/Docker/docker-101#comandos-básicos-de-docker)

### Dockerfiles ###

*   [Como se estructura un Dockerfile](https://github.com/feranto/azureDemos/tree/master/OpenDevFrameworks/Docker/docker-101#definiendo-nuestro-contenedor-con-dockerfile)


### Imágenes ###

### Ejecución en vm ###

*   Primero descargamos el dockerfile ya creado a nuestra vm con el siguiente comando
```bash 
curl https://gist.githubusercontent.com/ramnov/a43998f73d9254fafec45e0eb8d10c36/raw/9f99d9d719f3a52818d3339519069ede5876b441/py-manualtransmission-dockerfile > Dockerfile
```
*   Ejecutamos el siguiente comando para crear la imagen
  ```bash 
docker build -f py-manualtransmission-dockerfile -t pymanualtransmission .
```
*   Verificamos que la imagen este en nuestro entorno local
```bash 
docker images
```
*   Ejecutamos la imagen localmente
```bash 
docker run --name pymanualtransmission-container -dit pymanualtransmission
```
*   Verificamos el status del contenedor
```bash 
docker logs pymanualtransmission-container
```
*   Obtenemos la dirección ip interna del contenedor
```bash 
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' pymanualtransmission-container
'172.17.0.3'
```
*   Ejecutamos los siguientes comandos para obtener el archivo swagger
```bash 
apt-get -y install jq

curl -s --header "Content-Type: application/json" --request POST --data '{"username":"admin","password":"Microsoft@2018"}' http://172.17.0.3:12800/login | jq -r '.access_token'
<access token>

curl -s --header "Content-Type: application/json" --header "Authorization: Bearer <access token>" --request POST --data '{"hp":120,"wt":2.8}' http://172.17.0.3:12800/api/ManualTransmissionService/1.0.0 
{"success":true,"errorMessage":"","outputParameters":{"answer":0.64181252840938208},"outputFiles":{},"consoleOutput":"","changedFiles":[]}

curl -s --header "Authorization: Bearer <access token>" --request GET http://172.17.0.3:12800/api/ManualTransmissionService/1.0.0/swagger.json -o swagger.json
```

### Guardando las imagenes en un registro ###

## Despliegue de Imagenes en AKS ##

### Creación de Cluster AKS ###

### Despliegue de imagenes en el cluster ###