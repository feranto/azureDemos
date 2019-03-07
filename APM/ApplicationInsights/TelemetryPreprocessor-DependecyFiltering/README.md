# Filtrado de depedencias con Telemetry Preprocessor

En este ejemplo tenemos el siguiente escenario:

* Frontend web, SPA hosteado en azure storage con static files
* Frontend consume web services hosteados en azure functions
* Frontend consume blob storage en el cual realiza upload de imagen
* Application insights monitorea los dos anteriores como dependencias:


* Objetivo, evitar que Application insights registre como dependencia la interacción con el Blob Storage

# Escenario inicial
Primero habilitamos la detección de dependencias dentro del frontend de la siguiente manera:

[Application Insights application map](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-map) 

Como resultado tendremos las siguientes trazas:

![2 dependencias detectadas][dosDependencias]

[dosDependencias]: imagenes/conDependencia.png "2 Dependencias detectadas"


# Escenario final

Para cambiar este compartamiento aplicamos el [siguiente script](telemetryPreprocessor.js) en el frontend y obtendremos el siguiente resultado:

![Dependencia Eliminada][sinDependencia]

[sinDependencia]: imagenes/dependenciaEliminada.png  "Dependencia Eliminada"

# Conclusiones

* Implementando el objeto [TelemetryInitializer](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#addtelemetryinitializer) dentro del sdk de Application Insights, podemos procesar toda la telemetria enviada a Application Insights y decidir que queremos enviar o no. En este ejemplo detectamos todos los mensajes de tipo RemoteDependencyData, filtramos por Blob Storage y retornamos "false" para evitar el guardado de esta dependencia en Application Insights.