<h1 align="center"><b>Enfercuidarte-BackEnd</b></h1>

Enfercuidarte-BackEnd es el servicio de gestion del cronograma de empleados de la compañia enfercuidarte, una empresa de enfermeros en casa.

## Comenzando

Para probar el funcionamiento de nuestro proyecto, podemos realizar la descarga del repositorio ubicado en Github.

- Estando ubicados en el GitHub seleccionaremos la opción **Code** el cual se encuentra en un recuadro de color verde, el siguiente paso sera seleccionar la opción **Download ZIP** y este iniciara con la descarga del archivo.

- al descargar el archivo se debe descomprimir y luego de esto habriremos una terminal y nos dirigiremos al directorio de nuestro proyecto.

## Configurando el proyecto

para poder ejecutar la aplicacion se requiere de una configuracion para ello crearemos dos archivos en la ruta raiz del proyecto en el que declararemos unas variables de entorno para que la aplicacion funcione las cuales son

### .env

- APPLICATION_PORT = el puerto en el que queremos que se ejecute nuestra aplicacion
- DATABASE_HOST = el host de nuestra base de datos mysql
- DATABASE_USER = el usuario de nuestra base de datos
- DATABASE_PASSWORD = la contraseña del usuario de nuestra base de datos
- DATABASE_PORT = el puerto en el que corre nuestra base de datos
- DATABASE_NAME = el nombre de nuestra base de datos
- API_KEY = es la clave que se debe especificar al hacer peticiones al servidor

### .env.db

- MYSQL_ROOT_PASSWORD = es la contraseña de la cuenta raiz del servidor MySQL
- MYSQL_DATABASE = el nombre de la base de datos que se creara en el servidor MySQL en la cueta raiz

## Ejecucion con docker compose

para iniciar una ejecucion automatizada en contenedores de docker ejecutaremos el siguiente comando y esta correra en el puerto 3050.

```
docker compose up
```

## Ejecucion manual

si queremos hacer una ejecucion manual primero ejecutaremos el siguiente comando para instalar las dependencias de la aplicacion.

```
npm install
```

con estoy ya estaran las librerias necesarias para el funcionamiento de la app, ahora procederemos a iniciarlo, existen dos comandos para iniciarlo.

### modo desarrollo.

```
npm run dev
```

### modo produccion.

```
npm run start
```

## Haciendo peticiones

un ejemplo de la estructura de los endpoints de Enfercuidarte-BackEnd seria

```
http://localhost:3050/clients/?api_key=mi-secret-key
```

## Autores

**Francisco Parra**

- [Linkedin](https://www.linkedin.com/in/francisco-fernando-parra-penagos-645b98254/)
- [Twitter](https://twitter.com/francisco_1164)

**Alvaro Castillo Chicaiza**

- [Instagram](https://www.instagram.com/castillo_alvaro/)

**Nicolas Mera Gomez**

- [Facebook](https://www.facebook.com/nicolas.mera.102)
