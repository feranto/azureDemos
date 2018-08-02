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
    *  ```bash 
                RG_NAME=MlDockerTutorial  
                VM_NAME=MlUbuntuVm
        ```
*   Luego procedemos a crear un grupo de recursos
*   Una vez creado el grupo de recurso, creamos una vm ubuntu
*   Una vez creada la vm, buscamos la dirección de la IP pública y nos conectamos vía ssh
*   
### Instalación Docker ###

### Dockerfiles ###

### Imagenes ###

### Ejecución Local ###

### Guardando las imagenes en un registro ###

## Despliegue de Imagenes en AKS ##

### Creación de Cluster AKS ###

### Despliegue de imagenes en el cluster ###