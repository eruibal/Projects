# Proceso para respaldar laptop: migración de ADempiere a PostgreSQL en Docker

Describo en forma detallada las actividades que realicé para lograr este objetivo, que considero importante y relevante porque tiene relación con otros proyectos que llevaré a cabo más adelante.

**Escenario:** la base de datos de ADempiere vive en un PostgreSQL 15 instalado de forma nativa en la Mac. Se respalda, se restaura en un contenedor Docker de PostgreSQL y ADempiere se ejecuta en Windows apuntando a ese contenedor.

---

## 1. Crear el contenedor con PostgreSQL

```bash
docker run --name adempiere \
  -e POSTGRES_PASSWORD=<password> \
  -p 5431:5432 \
  -d postgres:15

docker ps -a
```

- `-p 5431:5432` expone el PostgreSQL del contenedor en el puerto **5431** del host (para no chocar con otra instancia local en 5432).
- Se fija la imagen `postgres:15` para que coincida con la versión de origen y el proceso sea reproducible. Sin etiqueta, Docker descarga la versión más reciente.

### Conectarse a la base de datos

**Opción A: pgAdmin.** Conectar directamente a `localhost:5431` con el usuario `postgres`.

**Opción B: consola del contenedor.**

```bash
docker exec -it adempiere psql -U postgres
```

Dentro de `psql`, crear el superusuario y la base de datos **antes de restaurar** (el respaldo trae sentencias `OWNER TO adempiere` que fallan si el rol no existe):

```sql
CREATE ROLE adempiere WITH LOGIN SUPERUSER PASSWORD '<password>';
CREATE DATABASE adempiere OWNER adempiere;
\q
```

---

## 2. Instalar ADempiere (Windows)

1. Instalar **Java JDK 17** (Oracle).
2. Descargar el ZIP de **ADempiere** y descomprimirlo en `C:\Adempiere`.
3. Descargar **Tomcat 9** e instalarlo en `C:\Tomcat`.
4. Configurar las variables de ambiente:

| Variable | Valor |
|---|---|
| `ADEMPIERE_HOME` | `C:\Adempiere` |
| `JAVA_HOME` | `C:\Program Files\Java\jdk-17` |

---

## 3. Hacer el respaldo en la Mac

> Esta es una parte importante del proceso que hay que entender: el respaldo se genera como el usuario `postgres` del sistema, y después hay que mover el archivo y darle permisos para que tu usuario pueda copiarlo.

```bash
# Entrar como el usuario postgres
sudo -u postgres -i
pwd
cd data
pwd                       # /Library/PostgreSQL/15/data

# Generar el respaldo en texto plano (SQL)
pg_dump adempiere > adempiere_pg.dmp

# Moverlo fuera del directorio de datos
mv adempiere_pg.dmp /Library/PostgreSQL/15/

exit
```

Ya con tu usuario, tomar la propiedad del archivo:

```bash
sudo chown ervidal:staff /Library/PostgreSQL/15/adempiere_pg.dmp
chmod 644 /Library/PostgreSQL/15/adempiere_pg.dmp
```

> **Nota:** en el proceso original se usó `chmod 777`. No es necesario: con el `chown` a tu usuario, `644` es suficiente y más seguro.

---

## 4. Restaurar la base de datos en el contenedor

Desde la terminal donde corre Docker:

```bash
# 1. Subir el respaldo a la carpeta /opt del contenedor
docker cp adempiere_pg.dmp adempiere:/opt

# 2. Restaurar el respaldo en la base de datos adempiere
docker exec -it adempiere bash -c "psql -U adempiere -d adempiere -f /opt/adempiere_pg.dmp"
```

> **Nota:** como `pg_dump` se ejecutó sin `-F`, el archivo es SQL en texto plano. Por eso se restaura con `psql -f` y no con `pg_restore`.

---

## 5. Ejecutar ADempiere

En una consola de Windows (`cmd`):

```bat
@set CLASSPATH=%ADEMPIERE_HOME%\lib\Adempiere.jar;%ADEMPIERE_HOME%\lib\AdempiereCLib.jar;%ADEMPIERE_HOME%\lib\CompiereJasperReqs.jar;%CLASSPATH%

java -Xms512m -Xmx1024m -DADEMPIERE_HOME=%ADEMPIERE_HOME% -classpath "%CLASSPATH%" org.adempiere.Adempiere
```

Al conectarse, ADempiere debe apuntar a `localhost`, puerto **5431**, base de datos `adempiere`, usuario `adempiere`.

---

## Cambios respecto a las notas del pizarrón

- **Nombre del archivo unificado:** en el pizarrón el respaldo se llama `respaldo-3feb.dmp` al generarlo y `Adempiere_pg.dmp` al restaurarlo. Aquí se usa `adempiere_pg.dmp` en todo el proceso.
- **Versión de imagen fijada:** `postgres:15` en lugar de `postgres`.
- **Permisos:** `chmod 644` en lugar de `chmod 777`; el `chown` se hace ya fuera de la sesión de `postgres`.
- **Contraseña:** reemplazada por `<password>`. La original aparece en la foto del pizarrón; conviene cambiarla si la imagen se comparte.
- **Creación del rol y la base:** se dejaron explícitos los comandos SQL y se aclaró que van antes de restaurar.
