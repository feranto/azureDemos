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
globaldevops-aks-netcore-1

## Demos 

### App nativa en vm 

1. Primero nos conectamos a nuestra vm
``` ssh vm-docker-hackfest ```

2. Verificamos que mongodb este corriendo
``` service mongodb status ```

3. Cargamos nuestras colecciones

    ```bash
    cd ~/blackbelt-aks-hackfest/app/db

    mongoimport --host localhost:27019 --db webratings --collection heroes --file ./heroes.json --jsonArray && mongoimport --host localhost:27019 --db webratings --collection ratings --file ./ratings.json --jsonArray && mongoimport --host localhost:27019 --db webratings --collection sites --file ./sites.json --jsonArray
    ```



### App en contendores en vm 

### App en cluster kubernetes 

### CI/CD App en cluster kubernetes 