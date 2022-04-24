**Autor: Jose Antonio Trujillo Mendoza (alu0101059037@ull.edu.es)**

# Informe práctica 9:
## Aplicación de procesamiento de notas de texto.

### 1. Introducción

En esta práctica, tendremos que implementar una aplicación de procesamiento de notas de texto. En concreto, la misma permitirá añadir, modificar, eliminar, listar y leer notas de un usuario concreto. Las notas se almacenarán como ficheros JSON en el sistema de ficheros de la máquina que ejecute la aplicación. Además, solo se podrá interactuar con la aplicación desde la línea de comandos.

Debemos realizar a su vez el análisis de SonarCloud, así como el funcionamiento correcto de las GitHub Actions de tests, Coveralls y SonarCloud.

### 2. Objetivos

La realización de esta práctica tiene como objetivo aprender:

- El uso de la [API síncrona](https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_synchronous_api) proporcionada por [Node.js](https://nodejs.org/es/) para trabajar con el sistema de ficheros.
- Familiciarnos con los paquetes [yargs](https://www.npmjs.com/package/yargs) y [chalk](https://www.npmjs.com/package/chalk)
- El uso de [SonarCloud](https://sonarcloud.io/), que analiza y decora automáticamente las solicitudes de extracción en GitHub

### 3. Tareas previas

Antes de comenzar a realizar los ejercicios, deberíamos realizar las siguientes tareas:

- Aceptar la [asignación de GitHub Classroom](https://classroom.github.com/a/8yO8h5vy) asociada a esta práctica.
- Leer la documentación de [yargs](https://www.npmjs.com/package/yargs), una herramienta que permite crear una línea de comandos interactivas, analizando argumentos y generando una elegante interfaz de usuario.
- Leer la documentación sobre [chalk](https://www.npmjs.com/package/chalk), una herramienta que permite el uso de colores en los console.log().
- Iniciar sesión en [SonarCloud](https://sonarcloud.io/).

### 4. Ejercicio - Descripción de los requisitos de la aplicación de procesamiento de notas de texto

Todos el código fuente de los ejercicios realizados a continuación, deben estar alojados en ficheros independientes, dentro de una carpeta por ejercicio o modificación, debemos hacer un fichero por clase, dicho fichero tendrá como nombre el mismo que el de la clase. Utilizaremos la estructura básica del proyecto vista en clase, por lo que incluiremos todos los ejercicios en el directorio `./src` de dicho proyecto.

Para la documentación usaremos **TypeDoc** ([Instrucciones](https://drive.google.com/file/d/19LLLCuWg7u0TjjKz9q8ZhOXgbrKtPUme/view)) y para el desarrollo dirigido por pruebas emplearemos **Mocha** y **Chai** ([Instrucciones](https://drive.google.com/file/d/1-z1oNOZP70WBDyhaaUijjHvFtqd6eAmJ/view)).

Finalmente comprobaremos el cubrimiento de las pruebas mediante Coveralls, SonarCloud y las correspondientes GitHub Actions. Para las correspondientes GitHub Actions, debemos incluir los siguientes ficheros: [GitHub Action, ficheros de configuración](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216126/tree/main/.github/workflows).

### 4.1 Enunciado

Los requisitos que debe cumplir la aplicación de procesamiento de notas de texto son los siguientes:

1. La aplicación de notas deberá permitir que múltiples usuarios interactúen con ella, pero no simultáneamente.

2. Una nota estará formada, como mínimo, por un título, un cuerpo y un color (rojo, verde, azul o amarillo).

3. Cada usuario tendrá su propia lista de notas, con la que podrá llevar a cabo las siguientes operaciones:

* Añadir una nota a la lista. Antes de añadir una nota a la lista se debe comprobar si ya existe una nota con el mismo título. En caso de que así fuera, deberá mostrarse un mensaje de error por la consola. En caso contrario, se añadirá la nueva nota a la lista y se mostrará un mensaje informativo por la consola.

* Modificar una nota de la lista. Antes de modificar una nota, previamente se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Si existe, se procede a su modificación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

* Eliminar una nota de la lista. Antes de eliminar una nota, previamente se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

* Listar los títulos de las notas de la lista. Los títulos de las notas deben mostrarse por la consola con el color correspondiente de cada una de ellas. Use el paquete chalk para ello.

* Leer una nota concreta de la lista. Antes de mostrar el título y el cuerpo de la nota que se quiere leer, se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Si existe, se mostrará el título y cuerpo de la nota por la consola con el color correspondiente de la nota. Para ello, use el paquete chalk. En caso contrario, se mostrará un mensaje de error por la consola.

* Todos los mensajes informativos se mostrarán con color verde, mientras que los mensajes de error se mostrarán con color rojo. Use el paquete chalk para ello.

* Hacer persistente la lista de notas de cada usuario. Aquí es donde entra en juego el uso de la API síncrona de Node.js para trabajar con el sistema de ficheros:

  * Guardar cada nota de la lista a un fichero con formato JSON. Los ficheros JSON correspondientes a las notas de un usuario concreto deberán almacenarse en un directorio con el nombre de dicho usuario.

  * Cargar una nota desde los diferentes ficheros con formato JSON almacenados en el directorio del usuario correspondiente.

1. Un usuario solo puede interactuar con la aplicación de procesamiento de notas de texto a través de la línea de comandos. Los diferentes comandos, opciones de los mismos, así como manejadores asociados a cada uno de ellos deben gestionarse mediante el uso del paquete yargs.

### 4.2 Código note.ts

```ts
/* eslint-disable no-unused-vars */
import * as fs from 'fs';
import * as chalk from 'chalk';

/**
 * @enum colors Possible colors
 */
export enum colors {Red = "red", Green = "green", Blue = "blue", Yellow = "yellow"};

/**
 * Notes class to implement add, modify, delete, list and read functions at notes
 */
export class Notes {
    /**
     * @param notes Private attribute using the singleton pattern
     */
    private static notes: Notes;

    /**
     * Initialize attributes
     */
    private constructor() {}

    /**
     * During the first invocation of this method, the only instance of the Notes class is created
     * @returns Object Notes
     */
    public static getNotes(): Notes {
      if (!fs.existsSync(`./database`)) fs.mkdirSync(`./database`, {recursive: true});

      if (!Notes.notes) Notes.notes = new Notes();

      return Notes.notes;
    };

    /**
     * Add a user note in .json format, to our database
     * @param name Username
     * @param title Notes' title
     * @param body Body's title
     * @param color Color's note
     * @returns Informational message
     */
    addNote(name :string, title :string, body :string, color :colors): string {
      const note = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }`;

      const titleJson = title.split(' ').join('');
      // If the path user exist
      if (fs.existsSync(`./database/${name}`)) {
        // If don't exist a title path yet
        if (!fs.existsSync(`./database/${name}/${titleJson}.json`)) {
          fs.writeFileSync(`./database/${name}/${titleJson}.json`, note);
          console.log(chalk.green(`New note added! (Title ${titleJson})`));
          return `New note added!`;
        }

        // If already exist this title path
        console.log(chalk.red('Note title taken!'));
        return 'Note title taken!';
      }

      // If the path user doesn't exist
      fs.mkdirSync(`./database/${name}`, {recursive: true});
      fs.writeFileSync(`./database/${name}/${titleJson}.json`, note);
      console.log(`New note added! (Title ${titleJson})`);
      return `New note added!`;
    }

    /**
     * Modify a user note in .json format, in our database
     * @param name Username
     * @param title Notes' title
     * @param body Body's title
     * @param color Color's note
     * @returns Informational message
     */
    modifyNote(name :string, title :string, body :string, color :colors): string {
      const note = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }`;
      const titleJson = title.split(' ').join('');

      // If the path user exist
      if (fs.existsSync(`./database/${name}`)) {
        // If exist this title path
        if (fs.existsSync(`./database/${name}/${titleJson}.json`)) {
          fs.writeFileSync(`./database/${name}/${titleJson}.json`, note);
          console.log(chalk.green(`Note overwrited! (Title ${titleJson})`));
          return `Note overwrited!`;
        }

        // If doesn't exist this title path
        console.log(chalk.red('Note title doesn\'t exist!'));
        return 'Note title doesn\'t exist!';
      }

      // If the user doesn't exist
      console.log(chalk.red('Username doesn\'t exist!'));
      return 'Username doesn\'t exist!';
    };

    /**
     * Remove a user note in .json format, in our database
     * @param username Username
     * @param title Notes' title
     * @returns Informational message
     */
    removeNote(username :string, title :string) {
      const titleName = title.split(' ').join('');

      // If the path exist
      if (fs.existsSync(`./database/${username}/${titleName}.json`)) {
        fs.rmSync(`./database/${username}/${titleName}.json`);
        console.log(chalk.green('Note removed!'));
        return 'Note removed!';
      }

      // If the path doesn't exist
      console.log(chalk.red(`Path note not found. Make sure that the user and the file name are correct, do not indicate the file extension .json`));
      return `Path note not found. Make sure that the user and the file name are correct, do not indicate the file extension .json`;
    }

    /**
     * List all notes from a user
     * @param username Username
     * @returns Informational message
     */
    listNotes(username :string): string {
      let result: string = '';

      // If the path user exist
      if (fs.existsSync(`./database/${username}`)) {
        console.log('Your notes:');
        fs.readdirSync(`./database/${username}/`).forEach((note) => {
          const data = fs.readFileSync(`./database/${username}/${note}`);
          const JsonNote = JSON.parse(data.toString());
          console.log(chalk.keyword(JsonNote.color)(JsonNote.title));
          result += JsonNote.title + '\n';
        });
        return result;
      }

      // If the path user doesn't exist
      console.log(chalk.red(`That user doesn´t exist`));
      return `That user doesn´t exist`;
    }

    /**
     * Read a note from a specific path
     * @param username Username
     * @param title Notes' title
     * @returns Informational message
     */
    readNote(username :string, title :string) {
      const titleJson = title.split(' ').join('');

      // If the path exist
      if (fs.existsSync(`./database/${username}/${titleJson}.json`)) {
        const data = fs.readFileSync(`./database/${username}/${titleJson}.json`);
        const JsonNote = JSON.parse(data.toString());
        console.log(chalk.keyword(JsonNote.color)(JsonNote.title + '\n'));
        console.log(chalk.keyword(JsonNote.color)(JsonNote.body));
        return JsonNote.title + '\n' + JsonNote.body;
      }

      // If the path doesn't exist
      console.log(chalk.red('Note not found'));
      return 'Note not found';
    }
}

```
* **Clase Notes**

En este fichero hemos creado la clase Notes, la función de esta clase será realizar las funciones de la **API síncrona de Node.js**, según se indique mediante la línea de comandos. A su vez implementamos el patrón de diseño `singleton`, ya que a la hora de trabajar con un sistema de ficheros o base de datos, el patrón `singleton` es de mucha ayuda.

Cabe destacar que en todos los `console.log()`, indicamos el color mediante la herramienta `chalk`, sabemos el color según si es un mensaje de error, de información o si es una nota (que tiene que ir en el color indicado de la nota). Para ello dentro del console.log debemos escribir: `chalk.color()` donde `color` hace referencia al color que queremos usar. También se puede obtener el color a través de una variables si usamos: `chalk.keyword()`.

* **getNotes()**

Con este método cumplimos el patrón `singleton`, ya que sólo permitimos una instancia de un objeto de la clase Notes.

`existsSync()` y `mkdirSync()`, son funciones de la API de Node.js, estas funciones las importamos al principio del código, se encuentran almacenadas en `fs`. Con `fs` podremos usar todas las funciones de Node.js

* `existsSync(./database)`: Devuelve un booleano, comprobando si la ruta existe. En el código, en caso de que sea falso, se crea el directorio mediante `mkdirSync()`, en este directorio guardaremos las notas.
* `mkdirSync('./database', {recursive: true})`: Crea un directorio en la ruta especificada

Finalmente, si el objeto Notes no estaba creado, lo crea y retorna este objeto. Si ya estaba creado simplemente retorna el objeto Notes.

* **addNote()**

Nos permite agregar una nota a un usuario.

Parámetros:

* `username`: Nombre del usuario, si no se había introducido ese usuario previamente, se crea una carpeta para dicho usuario y se incluye la nota dentro de este nuevo directorio.
* `title`: Título de la nota. También lo empleamos para definir el nombre del fichero donde estará la nota, lo que quitamos los espacios y le añadimos la extensión `.json`. El fichero se crea mediante `writeFileSync`.
* `body`: Contenido de la nota. Su contenido será incluido en el fichero `writeFileSync`.
* `color`: Indica el color del texto de la nota. Esto también se especifica en el fichero mediante `writeFileSync`.

Escribimos el mensaje que se incluirá en formato json, por ello hacemos: ``` const note = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }` ```

Aparte de las funciones síncronas ya comentadas, en este método tenemos `fs.writeFileSync('./database/${name}/${titleJson}.json', note)`, que nos permite crear un fichero con un nombre específico, en una ruta determinada, cuyo contenido también se lo indicamos nostros.

Si un usuario no registrado añade una nota, primero crearemos un directorio para ese usuario y posteriormente añadiremos su nota. A su vez, si el usuario quiere añadir una nota que tiene el mismo título que otra existente, mostrará un error.

Se puede observar que la carpeta que hará de base de datos se llama `database`.

* **modifyNote()**

Nos permite modificar una nota a un usuario.

Parámetros:

* `username`: Nombre del usuario, si no se había introducido ese usuario previamente, se crea una carpeta para dicho usuario y se incluye la nota dentro de este nuevo directorio.
* `title`: Título de la nota. También lo empleamos para definir el nombre del fichero donde estará la nota, lo que quitamos los espacios y le añadimos la extensión `.json`. El fichero se crea mediante `writeFileSync`.
* `body`: Contenido de la nota. Su contenido será incluido en el fichero `writeFileSync`.
* `color`: Indica el color del texto de la nota. Esto también se especifica en el fichero mediante `writeFileSync`.

Escribimos el mensaje que se incluirá en formato json, por ello hacemos: ``` const note = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }` ```

Un usuario no puede modificar una nota que no existe, a su vez como tampoco puede acceder a un usuario que no existe.

* **removeNote()**

Elimina una nota a un usuario.

Parámetros:

* `username`: Nombre del usuario.
* `title`: Título de la nota a eliminar.

Aparte de las funciones síncronas ya comentadas, en este método tenemos ```fs.rmSync(`./database/${username}/${titleName}.json`)```, que nos permite eliminar un fichero con un nombre específico, en una ruta determinada.

Un usuario no puede eliminar una nota que no existe.

* **listNotes()**

Nos permite mostrar todas las notas de un usario.

Parámetros:

* `username`: Nombre del usuario.

Aparte de las funciones síncronas ya comentadas, en este método tenemos: 
* ```fs.readdirSync(`./database/${username}/`).forEach((note) => ...```: Nos permite recorrer el directorio de un usuario.
* ```fs.readFileSync(`./database/${username}/${note}`)```: Nos permite obtener el contenido de un fichero.

Convertimos lo obtenido mediante `fs.readFileSync()` a formato JSON para poder imprimirlo de una manera más legible mediante `JSON.parse()`.

No se pueden mostrar notas de un usuario que no existe.

* **readNote()**

Nos permite leer una nota de un usario.

Parámetros:

* `username`: Nombre del usuario.
* `title`: Título de la nota a leer.

Convertimos lo obtenido mediante `fs.readFileSync()` a formato JSON para poder imprimirlo de una manera más legible mediante `JSON.parse()`.

No se pueden mostrar la nota de un título que no existe para un usuario.

### 4.3 Código app.ts

```ts
import {Notes, colors} from './note';
import * as yargs from 'yargs';

const notes :Notes = Notes.getNotes();

/**
 * Yargs execution of the add command. The corresponding command line options must be included
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Notes\' title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Body\'s title',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color\'s note. Blue on unknown color.\nOnly red, green, blue and yellow available',
      demandOption: true,
      type: 'string',
      default: 'blue',
    },
  },
  handler(argv) {
    let addColor: colors = colors.Blue;

    if (typeof argv.user === 'string' && typeof argv.color === 'string' &&
    typeof argv.body === 'string' && typeof argv.title === 'string') {
      Object.values(colors).forEach((element) => {
        if (element === argv.color) addColor = element;
      });

      notes.addNote(argv.user, argv.title, argv.body, addColor);
    }
  },
});

/**
 * Yargs execution of the modify command. The corresponding command line options must be included
 */
yargs.command( {
  command: 'modify',
  describe: 'Modify an exist note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },

    title: {
      describe: 'Notes\' title',
      demandOption: true,
      type: 'string',
    },

    body: {
      describe: 'Body\'s title',
      demandOption: true,
      type: 'string',
    },

    color: {
      describe: 'Color\'s note. Blue on unknown color.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv: any) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
    typeof argv.color === 'string' && typeof argv.body === 'string') {
      let modifyColor: colors = colors.Blue;

      Object.values(colors).forEach((element) => {
        if (element === argv.color) modifyColor = element;
      });
      notes.modifyNote(argv.user, argv.title, argv.body, modifyColor);
    }
  },
});

/**
 * Yargs execution of the remove command. The corresponding command line options must be included
 */
yargs.command({
  command: 'remove',
  describe: 'Remove an existing note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Notes\' title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      notes.removeNote(argv.user, argv.title);
    }
  },
});

/**
 * Yargs execution of the list command. The corresponding command line options must be included
 */
yargs.command({
  command: 'list',
  describe: 'List notes from a user',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      notes.listNotes(argv.user);
    }
  },
});

/**
 * Yargs execution of the read command. The corresponding command line options must be included
 */
yargs.command({
  command: 'read',
  describe: 'read an existing note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Notes\' title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      notes.readNote(argv.user, argv.title);
    }
  },
});

/**
 * Process arguments passed from command line to application
 */
yargs.parse();

```
* **Uso de app.ts**

En este fichero empleamos el módulo `yargs`, así como los métodos de la clase que creamos previamente (Notes).

Para crear un nuevo comando mediante yargs, debemos usar el método `command`, dentro de este método podemos especificar las siguientes opciones:

* **command**: El nombre de una de las acciones que se puede realizar
* **describe**: Descripción de la acción a realizar
* **builder**: Dentro de este apartado se indicarán todas las opciones que tiene la acción, estas son:
  * **describe**: Nombre del argumento
  * **demandOption**: Indica si es un argumento obligatorio o no
  * **type**: De que tipo es el argumento recibido
  * **default**: Se especifíca un valor por defecto

* **handler(argv)**: Mediante este método obtenemos todos los argumentos, junto con sus valores, que se hayan especificado dentro de **builder**, estos se encuentran en formato **JSON**. Lo que debemos de hacer dentro de este método, es comprobar que los valores introducidos son del tipo adecuado, y cambiarlos si son necesario. Una vez comprobado esto, llamamos a la función de la clase `Notes` correspondiente, si por ejemplo estamos en el comando `add`, llamaremos al método `addNote()`, y así para todos los comandos.

Finalmente debemos llamar a `yargs.parse()`, para procesar argumentos pasados desde la línea de comandos a la aplicación

* **Ejemplos de línea de comandos**

  * **add**: 
  ```bash 
  node dist/note.js add --user="jose" --title="Red note" --body="This is a red note" --color="red"
  ```
  * **modify**:
  ```bash 
  node dist/note.js modify --user="jose" --title="Red note" --body="This is a red note overwrited" --color="red"
  ```
  * **remove**:
  ```bash 
  node dist/note.js remove --user="jose" --title="Red note"
  ```
  * **list**:
  ```bash 
  node dist/note.js list --user="jose"
  ```
  * **read**:
  ```bash 
  node dist/note.js read --user="jose" --title="Red note"
  ```

### 4.4 Tests TDD de la práctica

Para el desarrollo dirigido por pruebas de este ejercicio se realizaron una serie de expectativas para comprobar cómo responde el ejercicio, posteriormente usaremos la herramienta **Instanbull**, para ver cuánto código cubrimos con las pruebas:

```ts
import * as fs from 'fs';
import 'mocha';
import {expect} from 'chai';
import {Notes, colors} from '../src/note';

const notes = Notes.getNotes();

describe('Notes function test', () => {
  it('Exist an Notes object', () => {
    expect(notes).not.to.be.equal(null);
  });

  it('Notes.getNotes() returns the objects notes', () => {
    expect(Notes.getNotes()).to.be.equal(notes);
  });

  it('notes.addNote() on three cases: user exist, user doesn\'t exist, note title taken', () => {
    expect(notes.addNote('test', 'My test', 'This is a green test', colors.Green)).to.be.equal(`New note added!`);
    expect(notes.addNote('test', 'My test 2', 'This is a red test', colors.Red)).to.be.equal(`New note added!`);
    expect(notes.addNote('jose', 'My test', 'This is a yellow test', colors.Yellow)).to.be.equal(`New note added!`);
    expect(notes.addNote('test', 'My test', 'This is a blue test', colors.Blue)).to.be.equal('Note title taken!');
  });

  it('notes.modifyNote() on three cases: user exist, user doesn\'t exist, note doesn\'t exist', () => {
    expect(notes.modifyNote('test', 'My test', 'This is a red test overwrited', colors.Red)).to.be.equal(`Note overwrited!`);
    expect(notes.modifyNote('test', 'Fail', 'This is a green test', colors.Green)).to.be.equal('Note title doesn\'t exist!');
    expect(notes.modifyNote('Fail', 'My test', 'This is a green test', colors.Green)).to.be.equal('Username doesn\'t exist!');
  });

  it('notes.removeNote() on two cases: user exist, user doesn\'t exist, note doesn\'t exist', () => {
    expect(notes.removeNote('jose', 'My test')).to.be.equal('Note removed!');
    expect(notes.removeNote('Fail', 'Fail test')).to.be.equal(`Path note not found. Make sure that the user and the file name are correct, do not indicate the file extension .json`);
  });

  it('notes.listNotes() returns: test\nMy test\ntest\nMy test 2\n', () => {
    expect(notes.listNotes('test')).to.be.equal('My test\nMy test 2\n');
    expect(notes.listNotes('Fail')).to.be.equal(`That user doesn´t exist`);
  });

  it('notes.listNotes() on two cases: note found, note not found ', () => {
    expect(notes.readNote('test', 'My test')).to.be.equal('My test\nThis is a red test overwrited');
    expect(notes.readNote('Fail', 'Fail test')).to.be.equal('Note not found');
  });
});

fs.rmdirSync('./database', {recursive: true});

```

Como se puede observar, realizamos pruebas para las siguientes situaciones:

* Creación de objeto de la clase Notes.
* Verificar funcionamiento del singleton mediantte getNotes().
* Métodos de la clase Notes, verificando que se manejan los errores correctamente.

Finalmente borramos la carpeta de la base datos, ya que si no lo hacemos, al repetir la prueba, no cubriríamos el 100% del código.


## 6. Bibliografía

* [Guión práctica 8](https://ull-esit-inf-dsi-2021.github.io/prct08-filesystem-notes-app/)
* [Documentación del paquete yargs](https://www.npmjs.com/package/yargs)
* [Documentación del paquete chalk](https://www.npmjs.com/package/chalk)
* [Documentación de la API síncrona de Node.js](https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_synchronous_api)
* [Página SonarCloud](https://sonarcloud.io/)
