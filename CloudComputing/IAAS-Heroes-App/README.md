#   Heroes APP (Vue js, Express, MongoDb) on Ubuntu VM

En este tutorial desplegaremos la aplicación de Heroes app en una vm dentro de azure.

## Pre-requisitos ##

*	Instalar [git](https://git-scm.com/downloads)
*	Instalar [nodejs](https://nodejs.org/es/download/)
*	Instalar [Visual Studio Code](https://code.visualstudio.com/download)
*	Si no tienes suscripción de Azure, Activar [Visual Studio Dev Essentials](https://www.visualstudio.com/es/dev-essentials/)
*	Activar suscripción de 25 USD mensuales de Azure durante 12 meses


##  Creación de Vm ubuntu

*   Primero accedemos a la [consola web de azure](http://shell.azure.com/)

<img src="images/webshell.PNG" width="550">

*   Luego procedemos a definir algunas variables que usaremos
```bash 
    RG_NAME=iaasHeroesApp  
    VM_NAME=HeroesAppUbuntuVm
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
  --size Standard_DS4 \
  --verbose
```

*   Una vez creada la vm, buscamos la dirección de la IP pública y nos conectamos vía ssh
```bash 
PUBLIC_IP_ADDRESS=<YOUR_PUBLIC_IP_ADDRESS>
```
```bash 
ssh $PUBLIC_IP_ADDRESS
```
