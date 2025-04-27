document
  .getElementById('country_form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const countryName = document
      .getElementById('country_input')
      .value
      .trim();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (!countryName) {
      resultDiv.innerHTML = '<p>Please enter a country name.</p>';
      return;
    }

    let data1, country, region, regionCountries;

    let response1;
    try {
      response1 = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
    } catch (error) {
      console.error('Fetch error (country):', error.message);
      resultDiv.innerHTML = `<p>Error fetching country: ${error.message}</p>`;
      return;
    }

    if (!response1.ok) {
      resultDiv.innerHTML = '<p>Country not found.</p>';
      return;
    }

    try {
      data1 = await response1.json();
    } catch (error) {
      console.error('Error (country):', error.message);
      resultDiv.innerHTML = `<p>Error parsing country data.</p>`;
      return;
    }

    country = data1[0];
    region = country.region;

    let response2;
    try {
      response2 = await fetch(
        `https://restcountries.com/v3.1/region/${region}`
      );
    } catch (error) {
      console.error('Fetch error (region):', error.message);
      resultDiv.innerHTML =
       `<p>Error fetching region countries: ${error.message}</p>`;
      return;
    }

    try {
      regionCountries = await response2.json();
    } catch (error) {
      console.error('Error:', error.message);
      resultDiv.innerHTML = `<p>${error.message}</p>`;
      return;
    }

    const details = `
      <h2>Country: ${country.name.common}</h2>
      <ul>
        <li>Capital: ${country.capital?.[0] || 'N/A'}</li>
        <li>Region: ${region}</li>
        <li>Population: ${country.population.toLocaleString()}</li>
        <li>Area: ${country.area.toLocaleString()} km²</li>
        <li>Subregion: ${country.subregion || 'N/A'}</li>
      </ul>
    `;

    const otherCountries = regionCountries
      .filter((c) => c.name.common !== country.name.common)
      .map((c) => `<li>${c.name.common}</li>`)
      .join('');

    resultDiv.innerHTML = `
      ${details}
      <h3>Other countries in the region (${region}):</h3>
      <ul>${otherCountries}</ul>
    `;
  });