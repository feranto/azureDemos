# azureOpenSourceDayMeanHolFrontend
Código angularjs para la solución del frontend corriendo en Azure.

# Parte II: Construir Solución Frontend con Angular-Cli

## Instalación y Creación de proyecto Angular-Cli ##
1.  Primero instalamos el modulo npm de angular cli de manera global con el siguiente comando

`npm install -g @angular/cli`

2.  Una vez instalado podemos utilizar el comando `ng` en nuestra terminal para crear un nuevo proyecto angular

`ng new appContactos`

3.  Ingresamos al nuevo directorio creado appContactos y ejecutamos el siguiente comando

`ng serve`

4. Luego podemos navegar al la página [http://localhost:4200/](http://localhost:4200/) y veremos nuestra aplicación corriendo

## Testing de Nuestro Código Angular ##

1.  Ahora que tenemos nuestro código podemos ejecutar pruebas unitarias usando el siguiente comando
`ng test`

Para una sola corrida podemos usar:

`ng test --single-run`

2.  También podemos hacer pruebas end to end utilizando los siguientes comandos:
`ng serve`
`ng e2e`

Para poder correr las pruebas end to end, se usa la herramienta protractor y para ello la app debe estar corriendo en el servidor.

3.  Y también podemos ejecutar typescript lint para verificar buenas prácticas de escritura de código typescript con el siguiente comando:
`ng lint`

## Construcción de Nuestro Código Angular ##

1.  Para poder generar codigo para distribuir lo podemos hacer de dos maneras:
    1.  Para entornos de prueba con posibilidad de debuggear, usamos el siguiente comando:
        `ng build`
        Esto generar el codigo resultante en una nueva carpeta llamada `dist`
    2.  Para entornos productivos, angular-cli puede generar un output completamente, minificado, ofuscado utilizando webpack. Para ello debemos usar el comando:
        `ng build --prod`

## Modificación de codigo para conectarse a nuestra API ##

1.  Modificar acceso CORS de nuestra API en Azure

![alt text][modificacionCors]

[modificacionCors]: https://raw.githubusercontent.com/feranto/azureOpenSourceDayMeanHol/master/imagenes/CORS.PNG "Modificación CORS"


2.  Crear un nuevo "servicio" de angular, para ello ejecutamos los siguientes comandos:
`ng generate service contactsService`

3.  Reemplazamos el codigo de contactsService por:
```javascript
import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Contact } from './app.component';

@Injectable()
export class ContactsService {

  private apiURL = 'http://ferantoapitest.azurewebsites.net';

  constructor(private http: Http) {}

  getContacts(): Promise< Contact[] > {
    const _headers = new Headers();
    _headers.append('Content-Type', 'application/json');
    _headers.append('ZUMO-API-VERSION', '2.0.0');

    return this.http.get(this.apiURL + '/contacts', {headers : _headers})
                    .toPromise()
                    .then(response => response.json() as Contact[])
                    .catch(this.handleError);
  }



  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


}

```

4.  Luego modificamos app.component.ts y agregamos el siguiente codigo:

``` javascript
import { Component } from '@angular/core';
import { ContactsService } from './contacts-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  contacts: Contact[];

  constructor(
    private contactsService: ContactsService
  ) { }

  getContacts(): void {
    this.contactsService
      .getContacts()
      .then(contacts => this.contacts = contacts);
  }


  ngOnInit(): void {
    this.getContacts();
  }

}

export class Contact {
  id: number;
  name: string;
  email: string;
}

```

5.  Ahora modificamos la vista en app.component.html
``` html
    <h1>
  {{title}}
</h1>

<ul>
  <li *ngFor="let contact of contacts" >
    <span class="badge">{{contact.id}}</span>
    <span>{{contact.name}}</span>    
  </li>
</ul>
```

6.  Ahora reemplazamos el codigo de app.module.ts
``` javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import {ContactsService} from './contacts-service.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ContactsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

``` 


## Deployar en Azure ## 

1.  Crear AppService
![alt text][]

[]: https://raw.githubusercontent.com/feranto/azureOpenSourceDayMeanHol/master/imagenes/CORS.PNG ""
2.  Crear AppService Plan
![alt text][]

[]: https://raw.githubusercontent.com/feranto/azureOpenSourceDayMeanHol/master/imagenes/CORS.PNG ""
3.  Deployar Codigo
![alt text][]

[]: https://raw.githubusercontent.com/feranto/azureOpenSourceDayMeanHol/master/imagenes/CORS.PNG ""
4.  Probar aplicación
![alt text][]

[]: https://raw.githubusercontent.com/feranto/azureOpenSourceDayMeanHol/master/imagenes/CORS.PNG ""
