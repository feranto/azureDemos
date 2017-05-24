# Solución Simple de Marketing en Azure
En este tutorial aprenderemos a implementar una solución de CMS Wordpress agregandole componentes como de CDN y Redis Cache.

El diagrama de arquitectura es el siguiente:

<img src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/diagrama.PNG" data-canonical-src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/diagrama.PNG" width="649" height="338" alt="Diagrama de Arquitectura de Solución" />

Los componentes dentro de Azure que utilizaremos para esta solución son los siguientes:

* Wordpress - Azure App Service
* Cuenta de Storage
* CDN de Microsoft
* Redis de Microsoft

# Pasos para implementarlo
## Creación de Wordpress dentro de Azure
1.  Ingresamos al Portal de azure https://portal.azure.com
<img src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/portal.PNG" data-canonical-src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/diagrama.PNG" width="649" height="338" alt="Portal de Azure" />
2.  Creamos un nuevo grupo de recurso
<img src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionGrupoRecurso.png" data-canonical-src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionGrupoRecurso.png" width="649" height="338" alt="Creacion grupo de recursos" />
3.  Dentro del grupo de recurso creamos un nuevo Wordpress

<img src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress1.png" data-canonical-src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress1.png" width="649" height="338" alt="Creacion grupo de recursos" />

<img src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress2.png" data-canonical-src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress2.png" width="649" height="338" alt="Creacion grupo de recursos" />

Al seleccionar la base de datos seleccionamos Azure MySQL
    <img src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress3.png" data-canonical-src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress3.png" width="649" height="338" alt="Creacion grupo de recursos" />

Esperamos la implementación del Wordpress
    <img src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress4.png" data-canonical-src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress4.png" width="649" height="338" alt="Creacion grupo de recursos" />


4.  Una vez está el deployment listo procedemos a finalizar la instalación del Wordpress

En el portal de Azure abrimos el nuevo Wordpress

 <img src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress5.png" data-canonical-src="https://raw.githubusercontent.com/feranto/azureDemos/master/solucionSimpleMarketing/imagenes/creacionWordpress5.png" width="649" height="338" alt="Creacion grupo de recursos" />

    2.  Abrimos la URL nueva
    3.  Creamos el titulo del wordpress, elegimos un nombre de usuario y contraseña. Muy importante, debemos guardar estos valores para más adelante.
    4.  Luego wordpress nos mostrará una confirmación de instalación exitosa
    5.  Luego ingresamos al dashboard de wordpress con nuestro usuario y contraseña y hemos completado este paso!
## Creación de Cuenta de Storage
1.  Paso 1
2.  Paso 2
## Creación de Redis 
1.  Paso 1
2.  Paso 2
## Creación de CDN
1.  Paso 1
2.  Paso 2
## Configuración de CDN con Wordpress
1.  Paso 1
2.  Paso 2
## Configuración de Redis con Wordpress
1.  Paso 1
2.  Paso 2
