'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const form = document.getElementById('form');
const input = document.getElementById('country-input');



const htmlCountry= function(data ,className=''){
 const languages = data.languages
      ? Object.values(data.languages).join(', ')
      : 'N/A';

    // Get first available currency name
    const currencies = data.currencies
      ? Object.values(data.currencies)[0]?.name
      : 'N/A';

    const html = `
  <div class="country bg-blue-300 mt-5 px-6 py-8 rounded-2xl shadow-xl max-w-md w-full sm:w-[28rem] md:w-[30rem]">
    ${className.includes('neighbour') 
      ? '<p class=" text-blue-950 text-xl font-semibold mb-4">Neighbour Country:</p>' 
      : ''}

    <img src="${data.flags?.png}" alt="Flag of ${data.name.common}" 
         class="w-32 h-auto mx-auto mb-6 rounded-md shadow-md" />

    <div class="country__data flex flex-col gap-4  text-blue-950">
      <h3 class="country__name text-2xl font-bold text-center">${data.name?.common}</h3>
      <h4 class="country__region text-lg font-medium text-center">${data.region}</h4>

      <div class="country__row flex items-center gap-2 text-base">
        <span class="text-lg">👫</span> 
        <p class="font-medium">${(+data.population / 1_000_000).toFixed(1)} million people</p>
      </div>

      <div class="country__row flex items-center gap-2 text-base">
        <span class="text-lg">🗣️</span> 
        <p class="font-medium">${languages}</p>
      </div>

      <div class="country__row flex items-center gap-2 text-base">
        <span class="text-lg">💰</span> 
        <p class="font-medium">${currencies}</p>
      </div>

      <div class="country__row flex items-center gap-2 text-base">
        <span class="text-lg font-semibold">📏 Area:</span> 
        <p class="font-medium">${data.area.toLocaleString()} km²</p>
      </div>
    </div>
  </div>
`;


    countriesContainer.insertAdjacentHTML('beforeend', html);
}


const getCountryandNei = async function(country) {
  try {
    countriesContainer.innerHTML = ''; // Clear previous results

    // Fetch main country
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) throw new Error('Country not found');
    
    const data = await res.json();
    
    // Find exact match
    const match = data.find(
      c => c.name.common.toLowerCase() === country.toLowerCase()
    );
    
    if (!match) throw new Error('Name of country not found');
    
    htmlCountry(match);

    // Fetch neighbor if exists
    const neighbour = match.borders?.[0];
    if (!neighbour) throw new Error('No neighboring country found');
    
    const neighborRes = await fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`, {
      cache: 'no-store'
    });
    
    if (!neighborRes.ok) throw new Error('Neighbour not found');
    
    const neighborData = await neighborRes.json();
    htmlCountry(neighborData[0], 'neighbour');

  } catch (err) {
    countriesContainer.innerHTML = `<p class="text-red-600 font-bold">${err.message}</p>`;
    console.error('Error:', err);
  }
};




//control form input
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent page reload
  const countryName = input.value.trim();

  if (countryName) {
    getCountryandNei(countryName);
    input.value = ''; // Clear input
  }
});


const promisess = function(){
 
}
