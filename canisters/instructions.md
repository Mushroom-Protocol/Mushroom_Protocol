# Instrucciones para Desplegar una Colección de NFT

Después de que una StartUp haya solicitado la creación de una colección de NFT para su proyecto aprobado, y esta solicitud haya sido revisada por la administración, se procederá de la siguiente manera si se decide el despliegue de dicha colección:


### Creación del Proyecto

1. En un directorio de preferencia donde se decida crear el proyecto, abra una terminal y ejecute el siguiente comando:
    ```bash
    dfx new <Nombre>
    ```

2. De las opciones que se presenten, seleccione **Motoko**.

3. Luego, seleccione **No JS template**.

4. Ingrese al directorio generado en el proceso anterior con el comando:
    ```bash
    cd Nombre
    ```

5. Ingrese al directorio `src` con el comando:
    ```bash
    cd src
    ```

6. Elimine el directorio `Nombre_backend`.

7. Vuelva un directorio hacia atrás con el comando:
    ```bash
    cd ..
    ```

8. Abra el archivo `dfx.json` con un editor de texto.

9. Borre su contenido y reemplácelo por lo siguiente:
    ```json
    {
      "canisters": {
        "Nombre_frontend": {
          "source": [
            "src/Nombre_frontend/assets"
          ],
          "type": "assets"
        }
      },
      "defaults": {
        "build": {
          "args": "",
          "packtool": ""
        }
      },
      "output_env_file": ".env",
      "version": 1
    }
    ```

10. Guarde los cambios y cierre el archivo.

### Carga y Adaptación de Imágenes al Proyecto

1. Teniendo todas las imágenes o archivos de multimedia correspondientes a los NFT de la futura colección, mueva dichos archivos hacia el directorio `src/Nombre_frontend/assets` dentro del proyecto recién creado.

2. Dentro de dicho directorio, junto con las imágenes recién movidas, cree un archivo llamado `rename_files.sh` con el siguiente contenido:
    ```bash
    #!/bin/bash
    # Función para generar nombres aleatorios con el formato correcto
    generate_name() {
        part1=$(cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 5 | head -n 4 | paste -sd '-' -)
        part2=$(cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 3 | head -n 1)
        echo "$part1-$part2"
    }
    # Archivo de salida para los nombres generados
    output_file="files_names.txt"
    > "$output_file"  # Vaciar el archivo de salida si ya existe

    # Procesar cada archivo de imagen en el directorio actual
    for file in *.{jpg,jpeg,png,gif,svg}; do
        if [[ -f $file ]]; then
            ext="${file##*.}"
            new_name=$(generate_name)
            new_file="$new_name.$ext"
            mv "$file" "$new_file"
            echo "$new_file" >> "$output_file"
        fi
    done
    ```

3. También dentro de dicha carpeta, abra una terminal y ejecute los siguientes comandos:
    ```bash
    chmod +x rename_files.sh
    ```
    Este comando hará que el archivo recién creado se pueda ejecutar.

    ```bash
    ./rename_files.sh
    ```
    Con este comando, se ejecutará el archivo y todas las imágenes contenidas en el directorio cambiarán su nombre a un formato similar a `6i44m-5a6zu-w4kbo-sxojx-2az.jpg`. Además, se generará automáticamente un archivo llamado `files_names.txt` que contendrá los nombres generados en el proceso anterior separados por saltos de línea, el cual servirá luego para desplegar la colección desde el frontend.

4. Mueva el archivo `files_names.txt` hacia un lugar donde lo pueda encontrar fácilmente y elimine el archivo `rename_files.sh`.

### Despliegue del Canister de Assets

1. Puede hacer una prueba de despliegue local previamente iniciando su réplica local con el comando:
    ```bash
    dfx start --clean --background
    ```

2. Luego, despliegue en local el canister con el comando:
    ```bash
    dfx deploy
    ```

3. Si todo va bien, al final del proceso obtendrá una URL similar a:
    ```
    http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/
    ```
    Puede ingresar a dicha URL en su navegador y, para comprobar el correcto despliegue del canister, puede agregar a la URL el nombre de alguno de los archivos, los cuales podrá encontrar en el archivo generado en el paso 3 de la sección anterior. Tras esto, podrá visualizar el correspondiente archivo de imagen en el navegador.

4. Una vez comprobado el correcto funcionamiento del proyecto, podrá desplegarlo en mainnet con el comando:
    ```bash
    dfx deploy --network ic
    ```

5. Al final del proceso, obtendrá la URL de acceso al canister que acaba de desplegar en mainnet. El `canister id` lo necesitará para vincular el contrato de la colección con este canister de assets que acaba de crear.

### Deploy de Canister de Colección desde el Frontend Principal

En el formulario deberá ingresar la siguiente información:

- **Sección Metadata dip 721:**
  - `logo: LogoResult;`
  - `name: Text;`
  - `symbol: Text;`
  - `maxLimit: Nat16;`

- **Sección Metadata Mushroom:**
  - `proyectId: Text;`
  - `canisterIdAssets: Text;`
  - `assetsNames: [Text];` // del archivo de nombres de imágenes generar un array de Strings
  - `custodian: Text;` // Principal ID autorizado a mintear

- **Fee:** // Cantidad de ciclos necesaria para el deploy del canister 721