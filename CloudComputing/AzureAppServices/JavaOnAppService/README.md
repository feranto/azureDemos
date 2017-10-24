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

## Configuración de App service#
1.  Escogemos la version de java
2.  Escogemos el contenedor tomcat
3.  Ahora procedemos a subir nuestro war 