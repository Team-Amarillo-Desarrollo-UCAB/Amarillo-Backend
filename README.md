# ¡Bienvenidos al Backend de Amarillo GoDely!

Repositorio del Backend de la aplicación GoDely del equipo Amarillo - aplicación móvil enfocada a la gestión de pedidos, catálogos de productos y combos y demás aspectos derivados.

## Arquitectura

Nuestra aplicación hace uso de patrones de diseño y arquitecturas con el fin de favorecer buenas prácticas en el proceso de desarrollo de software, entre las cuales se destacan diversos aspectos tales como el favorecer la programación en paralelo, reutilización de componentes, mejorar la mantenibilidad, código fácil de testear, entre otros. Particularmente, los detalles con respecto a la arquitectura del software, se resalta:

### Arquitectura Hexagonal

También conocida como la Arquitectura de Puertos y Adaptadores (impulsado por el Principio de Inversión de Dependencias - DIP de SOLID), según la describe el Dr. Alistair Cockburn, esta arquitectura se basa en permitir que una aplicación sea controlada por igual por usuarios, programas, pruebas automatizadas, etc. Con ello, se logra separar la lógica de dominio (business enterprise logic), lógica de aplicación o casos de uso y aspectos de infraestructura.

### Diseño Guiado por Dominio - Domain Driven Design (DDD)

De acuerdo con Paradigma Digital, Domain Driven Design (DDD) es una aproximación holística al diseño de software que pone en el centro el Domain, es decir, el dominio o problema de negocio.

### Programación Orientada a Aspectos (AOP) mediante el patrón de diseño estructural Decorador

Es un paradigma de programación enfocado en la aplicación de Cross Cutting Concerns - aspectos transversales ortogonales para ampliar la funcionalidad de los casos de uso de forma pulcra.

### Arquitectura Orientada a Eventos (Event-Driven Architecture, EDA)

Es un patrón de arquitectura software que promueve la producción, detección, consumo de, y reacción a eventos. Para este proyecto es utilizada para el manejo de operaciones asíncronas y en tiempo real, tales como el envío de notificaciones push y correos electrónicos.

## Instalación

```bash
$ npm install
```

## Uso de Docker
```bash
$ npm run docker:start 
```

### ¿Cómo correr el backend?

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### ¿Cómo correr los Test?

```bash
# unit tests
$ npm run test

# correr un archivo .spec en específico
$ npx jest --testPathPattern="create-bundle.spec.ts”
```

## Responsabilidades de cada integrante del equipo

### Jamal Mohamad

- Capa de dominio:


Implementación completa de los agregados: Category, Bundle, Discount con la aplicación de los patrones tácticos DDD pertinentes. Intervenciones en el módulo de producto

Declaración e implementación de algunos servicios de dominio correspondientes a la orden.


- Capa de aplicación:


Implementación de los casos de uso de los agregados mencionados anteriormente. Implementación de los aspectos de seguridad, auditoría, participación en el aspecto excepciones.


- Capa de infraestructura: 

	Adaptadores concretos de puertos definidos en capas inferiores tales como los repositorios, mappers, ImageUploader, modelo de auditoría, entre otros. Entidades de infraestructura de los módulos mencionados. Controladores + endpoints pertinentes de cada módulo.


	Configuraciones en el módulo de notificaciones + implementación de notificaciones referentes a varios casos de anuncios de productos, anuncios de combos, de descuentos, entre otros similares.

- Tests:

Configuraciones iniciales del apartado test. Tests unitarios de servicios de aplicación con sus correspondientes casos de prueba en creación de producto y combo


- Despliegue:

Encargado del despliegue del backend mediante una suscripción a railway.

### Luigi Bastidas

- Capa de dominio:


- Capa de aplicación:


- Capa de infraestructura

### Nadine Chancay

- Capa de dominio:


- Capa de aplicación:


- Capa de infraestructura

