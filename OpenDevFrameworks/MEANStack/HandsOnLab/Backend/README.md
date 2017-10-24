# azureOpenSourceDayMeanHolBackend
Código expressjs y nodejs para la solución del backend corriendo en Azure.

# Parte I: Construir Solución Backend en Azure

El código final github puede ser descargado [desde acá](https://github.com/feranto/azureOpenSourceDayMeanHolBackend)

## Instalamos y ejecutamos Swaggerize ##
1.	Creamos una nueva carpeta que se llame backend
2.	Instalamos  los modulos  de npm “yo” y “generator-swaggerize”
    1.	`npm install -g yo`
    2.	`npm install -g generator-swaggerize`
3.	Descargamos el archivo [api.json](https://github.com/Azure-Samples/app-service-api-node-contact-list/blob/master/start/api.json) en nuestro directorio, será nuestra definición de API
4.	Navegamos a la nueva carpeta y ejecutamos el comando “yo swaggerize”, esto inicializará el proyecto y nos hará unas cuantas preguntas:
    1.  `yo swaggerize`	    
    2.	Para como llamar el proyecto “listaContactos”, “path to swagger document” ingresa `api.json` y para “Express, Hapi o Restify” ingresa `express`
5.	Nos posicionamos en nuestra carpeta del nuevo proyecto y ejecutamos el comando:
    1.	`npm install`
6.	Luego instalamos y guardamos el modulo jsonpath
    1.	`npm install --save jsonpath`
7.	Luego instalamos y guardamos el modulo swaggerize-ui
    1.	`npm install --save swaggerize-ui`

## Luego modificamos el código generado ##
1.	Descarga el código final del repositorio publico https://github.com/feranto/azureOpenSourceDayMeanHolBackend
2.	Copia la carpeta /azureOpenSourceDayMeanHolBackend/listaContactos/lib dentro de tu carpeta listaContactos
3.	Reemplaza el código dentro de handlers/contacts.js con el siguiente código:
```javascript
'use strict';

 var repository = require('../lib/contactRepository');

 module.exports = {
     get: function contacts_get(req, res) {
         res.json(repository.all())
     }
 };
```
4.	Reemplaza el código dentro de handlers/contacts/{id}.js con el siguiente código
```javascript
'use strict';

 var repository = require('../../lib/contactRepository');

 module.exports = {
     get: function contacts_get(req, res) {
         res.json(repository.get(req.params['id']));
     }    
 };
```
5.	Reemplaza el código dentro de server.js con el siguiente codigo
```javascript
'use strict';

 var port = process.env.PORT || 8000; // first change

 var http = require('http');
 var express = require('express');
 var bodyParser = require('body-parser');
 var swaggerize = require('swaggerize-express');
 var swaggerUi = require('swaggerize-ui'); // second change
 var path = require('path');

 var app = express();

 var server = http.createServer(app);

 app.use(bodyParser.json());

 app.use(swaggerize({
     api: path.resolve('./config/swagger.json'), // third change
     handlers: path.resolve('./handlers'),
     docspath: '/swagger' // fourth change
 }));

 // change four
 app.use('/docs', swaggerUi({
   docs: '/swagger'  
 }));

 server.listen(port, function () { // fifth and final change
 });
```

## Probamos la API generada ##
1.  Finalmente podemos correrlo localmente utilizando el siguiente comando
`node server.js`

2.  Podemos navegar a [http://localhost:8000/contacts](http://localhost:8000/contacts) y veremos la salida JSON de la lista de contactos

3.  Podemos navegar a [http://localhost:8000/contacts/2](http://localhost:8000/contacts/2) y veremos la salida JSON del contacto con ID 2

4.  Podemos navegar a [http://localhost:8000/swagger](http://localhost:8000/swagger) y veremos la configuración swagger

5.  Podemos navegar a [http://localhost:8000/docs](http://localhost:8000/docs) y veremos la documentación de nuestra API

## Creamos una API APP en Azure ##

1.  Navegamos hasta el [portal de azure](ttps://portal.azure.com) 
2.  Seleccionamos Nuevo > Web + Mobile > API App.

![alt text][nuevaApiApp]

[nuevaApiApp]: https://docs.microsoft.com/en-us/azure/app-service-api/media/app-service-api-nodejs-api-app/new-api-app-portal.png "Nueva Api App"

3.  Ingresamos un nombre para la App
4.  Creamos un nuevo grupo de recurso para nuestra app con el nombre que deseemos
5.  Creamos un nuevo App Service Plan para nuestra app

![alt text][nuevaAppServicePlan]

[nuevaAppServicePlan]: https://docs.microsoft.com/en-us/azure/app-service-api/media/app-service-api-nodejs-api-app/newappserviceplan.png "Nuevo App Service Plan"

6.  Le ponemos el nombre que deseemos al app service plan
7.  En la locación del app service plan, escogemos el que está mas cercano a nosotros
8.  Hacemos click en Pricing tier > View All > F1 Free.

![alt text][precioAppServicePlan]

[precioAppServicePlan]: https://docs.microsoft.com/en-us/azure/app-service-api/media/app-service-api-nodejs-api-app/selectfreetier.png "Precio de App Service Plan"

9. Confirmamos que todo este ok y seleccionamos Crear

## Configurar Deployment usando Git ##

1.  Después de que la API app ha sido creada exitosamente, hacemos click en App Services > {tu API app} y veremos los settings de nuestra app:

![alt text][settingsApp]

[settingsApp]: https://docs.microsoft.com/en-us/azure/app-service-api/media/app-service-api-nodejs-api-app/portalapiappblade.png "Settings APP"

2.  En el panel de settings, buscamos la opción de "Deployment Options" > Choose Source > Local Git Repository, y luego presionamos Ok.

![alt text][deploymentGit]

[deploymentGit]: https://docs.microsoft.com/en-us/azure/app-service-api/media/app-service-api-nodejs-api-app/create-git-repo.png "Deployment Git"

3.  Una vez que hemos conectado nuestro repositorio Git, nos mostrará los deployments activos.

![alt text][deploymentGitActivos]

[deploymentGitActivos]: https://docs.microsoft.com/en-us/azure/app-service-api/media/app-service-api-nodejs-api-app/deployment-happening.png "Deployment Git Activos"

## Probar la API corriendo en Azure ##
1.  Copiamos la URL de de nuestra API

![alt text][urlApiNueva]

[urlApiNueva]: https://docs.microsoft.com/en-us/azure/app-service-api/media/app-service-api-nodejs-api-app/deployment-completed.png "URL API nueva"

2.  Utilizando un client REST como Postman o Fiddler intentamos acceder al endpoint de `/contacts`, la URL sería `https://{your API app name}.azurewebsites.net/listadoContactos/contacts` 

![alt text][pruebaPostMan]

[pruebaPostMan]:https://docs.microsoft.com/en-us/azure/app-service-api/media/app-service-api-nodejs-api-app/postman-hitting-api.png "pruebaPostMan"

3.  Finalmente podemos probar la documentación de nuestra API visitando `/docs`