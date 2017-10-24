# Creando una solución IAAS con balanceo de carga http de servidores nodejs

En este tutorial vamos a mostrarte como utilizar Application Gateway como Balanceador de carga HTTP entre dos nodos ubuntu corriendo un servidor http en nodejs.

## Pre-requisitos en Windows ##

*	Instalar [git](https://git-scm.com/download/win) para windows
*	Instalar [Visual Studio Code](https://code.visualstudio.com/download)
*   Tener una suscripción de Azure Activa

# Deployar Infraestructura a Azure#

Primero comenzamos por deployar la siguiente infraestructura en Azure:

*   Un grupo de recurso
*   Un application gateway
*   2 maquinas virtuales Ubuntu

Luego Procedemos a configuar y conectar todo

## Configuración de Servidores Ubuntu##

1.  creamos un archivo html 
    *   touch index.html
    *   vim index.html
    *   presionamos la tecla "a"
    *   En el servidor 1 agregamos el texto "hola server 1"
    *   presionamos ":" , luego grabamos con los caracteres "wq" y presionamos Enter

2.  Instalamos nodejs en cada uno con los siguientes comandos:
    * ``` sudo apt-get update ```
    * ```sudo apt-get install nodejs```
    * ```sudo apt-get install npm```
    * ```sudo apt-get remove node```
    * ```sudo ln -s /usr/bin/nodejs /usr/local/bin/node```

3.  Instalamos un servidor http
    * ```sudo npm install -g http-server```
    * arrancamos el servidor con ```http-server index.html```


4.  Realizamos paso 1-3 para el segundo servidor, colocando "hola server2"

## Configuración de Application Gateway##

1.  Primero configuramos un sondeo de estado
    *   Le definimos un nombre
    *   Protocolo escogemos http
    *   En host seleccionamos "127.0.0.1"
    *   Ruta de acceso, escribimos "/"
    
2.  Luego en las configuraciones de "backendhttpsettings" agregamos un sondeo personalizado, el que creamos en el paso anterior.

3.  Finalmente agregamos nuestros nodos ubuntu server como nodos del backend del application gateway

## Accedemos al aplicativo balanceado a través del dns del application gateway ##

1.  Localizamos el dns o IP pública del application gateway y probamos el balanceo desde nuestro navegador
