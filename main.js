document.addEventListener('DOMContentLoaded', () => {
    const continentSearchBtn = document.getElementById('continentSearchBtn');
    const countrySearchBtn = document.getElementById('countrySearchBtn');

    // Obtener la información de geolocalización desde index.php
    function getLocationData() {
        return fetch('http://98.81.246.40/php-intro-connection/index.php')
            .then(response => response.json())
            .then(data => {
                const continent = data.continent_name || "Desconocido";
                const country = data.country_name || "Desconocido";
                
                // Mostrar la información de continente y país en el HTML
                document.getElementById('countryAndContinent').innerHTML = `Continente: ${continent}, País: ${country}`;
                
                return { continent, country };
            })
            .catch(error => {
                console.error('Error al obtener la información de geolocalización:', error);
                document.getElementById('countryAndContinent').innerHTML = 'No se pudo obtener la ubicación.';
                return { continent: "Desconocido", country: "Desconocido" };
            });
    }

    // Cargar la información de ubicación al inicio
    getLocationData();

    // Función para la búsqueda por continente
    if (continentSearchBtn) {
        continentSearchBtn.addEventListener('click', () => {
            getLocationData().then(location => {
                const continent = location.continent;
                console.log(`Buscando información por continente: ${continent}`);
                fetch(`http://98.81.246.40/php-intro-connection/getRecords.php?table=city&continent=${continent}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Resultados por continente:', data);
                        displayResults(data, ['Code', 'Name', 'Continent', 'Region', 'LocalName']);
                    })
                    .catch(error => {
                        console.error('Error en la búsqueda por continente:', error);
                        alert("Hubo un problema al obtener la información del continente.");
                    });
            });
        });
    }

    // Función para la búsqueda por país
    if (countrySearchBtn) {
        countrySearchBtn.addEventListener('click', () => {
            getLocationData().then(location => {
                const country = location.country;
                console.log(`Buscando información por país: ${country}`);
                fetch(`http://98.81.246.40/php-intro-connection/getRecords.php?table=city&country=${country}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Resultados por país:', data);
                        displayResults(data);
                    })
                    .catch(error => {
                        console.error('Error en la búsqueda por país:', error);
                        alert("Hubo un problema al obtener la información del país.");
                    });
            });
        });
    }

    // Función para mostrar los resultados en la tabla
    function displayResults(data, columns = null) {
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');

        // Limpiar la tabla
        tableHeader.innerHTML = '';
        tableBody.innerHTML = '';

        if (data.length > 0) {
            // Usar solo las columnas especificadas si se proporcionaron
            const headers = columns || Object.keys(data[0]);

            // Crear encabezados de la tabla
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header.charAt(0).toUpperCase() + header.slice(1);
                tableHeader.appendChild(th);
            });

            // Crear filas de la tabla
            data.forEach(row => {
                const tr = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header];
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        } else {
            // Mostrar mensaje si no hay resultados
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = columns ? columns.length : 2;
            td.textContent = 'No se encontraron resultados.';
            td.classList.add('text-center');
            tr.appendChild(td);
            tableBody.appendChild(tr);
        }
    }
});
