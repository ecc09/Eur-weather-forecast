fetch('/city_coordinates.csv')  // get the csv file.
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text(); // Get the text content of the response
})
.then(data => {
    const rows = data.split('\n');
    const result = rows.map(row => row.split(',')); // split each row into column.

    // Assuming the first row contains headers
    const headers = result[0];
    const cities = result.slice(1); // Skip the header row
    const cites_dict = []; // a dict to hold information from the csv file.

    cities.forEach(city => {
        const latitude = city[0];
        const longitude = city[1];
        const cityName = city[2];
        const country = city[3];
        const text = cityName +', '+country;
 
        cites_dict.push({'value': cityName, 'text': text, 'latitude': latitude, 'longitude': longitude});
    })

    const selectElement = document.getElementById('dropdown'); // create options for the user from the dict.
    cites_dict.forEach(city => {
        const options = document.createElement('option');
        options.value = city.value;
        options.textContent = city.text;
        options.latitude = city.latitude;
        options.longitude = city.longitude;
        selectElement.appendChild(options); // Append the option to the select element.
        
    })
    selectElement.addEventListener('change',(e) => {   // Triggered when the user selects a different option from the dropdown.
        const selectedCity = e.target.value;
        const text = e.target.options[e.target.selectedIndex].text;
        const selectedCityLatitude = e.target.options[e.target.selectedIndex].latitude;
        const selectedCityLongitude = e.target.options[e.target.selectedIndex].longitude;

        const container = document.getElementById('container');  // clear previous container on each options change.
        container.innerHTML = '';
        fetch7Timer(selectedCity, text, selectedCityLatitude, selectedCityLongitude)
        
    })

   
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});


function fetch7Timer(selectedCity, text, selectedCityLatitude, selectedCityLongitude) {
    fetch('http://www.7timer.info/bin/api.pl?lon=selectedCityLongitude&lat=selectedCityLatitude&product=civillight&output=json')  // call the api based on the latitiude and longitude.
    .then(response => response.json())
    .then(data => {
        data.dataseries.forEach(elt => {
            // a function to change the numeric format to readable strings. eg 20243010 to tue, oct 30.
            function formatDate(currentdate) {   
                const year = parseInt(currentdate.slice(0, 4), 10);
                const month = parseInt(currentdate.slice(4,6), 10) - 1;
                const day = parseInt(currentdate.slice(6, 8), 10);
                
                // create a new date object
                const date = new Date(year, month, day);
                const options = {weekday:'short', month: 'short', day: 'numeric'};

                return date.toLocaleDateString('en-US', options);
            }

            const img = document.createElement('img');
            img.style.marginBottom = '10px';

            // choose image source based on the given weather.
            if (elt.weather === 'cloudy') {
                img.src = '/images/cloudy.png';
            }
            else if (elt.weather === 'clear') {
                img.src = '/images/clear.png';
            }
            else if (elt.weather === 'fog') {
                img.src = '/images/fog.png';
            }
            else if (elt.weather === 'humid') {
                img.src = '/images/humid.png';
            }
            else if (elt.weather === 'ishower') {
                img.src = '/images/ishower.png';
            }
            else if (elt.weather === 'lightrain') {
                img.src = '/images/lightrain.png';
            }
            else if (elt.weather === 'lightsnow') {
                img.src = '/images/lightsnow.png';
            }
            else if (elt.weather === 'mcloudy') {
                img.src = '/images/mcloudy.png';
            }
            else if (elt.weather === 'oshower') {
                img.src = '/images/oshower.png';
            }
            else if (elt.weather === 'pcloudy') {
                img.src = '/images/pcloudy.png';
            }
            else if (elt.weather === 'rain') {
                img.src = '/images/rain.png';
            }
            else if (elt.weather === 'rainsnow') {
                img.src = '/images/rainsnow.png';
            }
            else if (elt.weather === 'snow') {
                img.src = '/images/snow.png';
            }
            else if (elt.weather === 'tsrain') {
                img.src = '/images/tsrain.png';
            }
            else if (elt.weather === 'tstorm') {
                img.src = '/images/tstorm.png';
            }
            else if (elt.weather === 'windy') {
                img.src = '/images/windy.png';
            }

            const currentdate = elt.date.toString();   // change the currentdate to string.
            const formattedDate = formatDate(currentdate);

            const dat = document.createElement('p');  // an elt to hold the date.
            dat.textContent = formattedDate;
            dat.style.color = 'white';
            dat.style.marginTop = '10px';
            dat.style.marginBottom = '10px';

            const weather = document.createElement('p'); // holds the weather type.
            weather.textContent = elt.weather;
            weather.style.marginTop = '10px';

            const temp = document.createElement('div'); // holds the maximum and minimum temprature.
            temp.className = 'temp';
            const temp_max = document.createElement('p');
            temp_max.textContent = `H: ${elt.temp2m.max}`;
            temp_max.style.marginTop = '5px';

            const temp_min = document.createElement('p');
            temp_min.textContent = `L፡ ${elt.temp2m.min}`;
            temp_min.style.marginTop = '5px';
            temp_min.style.marginBottom = '5px';

            temp.appendChild(weather);
            temp.appendChild(temp_max);
            temp.appendChild(temp_min);

            const container = document.createElement('div'); // create a new div which will hold the date and the image.

            const nameContainer = document.createElement('div'); // a container to hold the title and the image.
            nameContainer.appendChild(dat);
            nameContainer.appendChild(img);
            nameContainer.className = 'nameContainer';

            container.appendChild(nameContainer);
            container.appendChild(temp);

            const htmlContainer = document.getElementById('container');  // get the div with the container id and append to it the new div.
            htmlContainer.appendChild(container);            

        })

    })
    .catch(error=>{
        console.error('Error Fetching data', error);
    });  
}