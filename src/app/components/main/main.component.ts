import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  countries: any[] = [];
  regions: string[] = [];
  selectedRegion: string = '';
  filteredCountries: any[] = [];
  searchTerm: string = '';

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.fetchCountries();
  }

  fetchCountries() {
    this.countryService.getCountry().subscribe({
      next: (countries) => {
        this.countries = countries.map((country: any) => ({
          countryImg: country.flags.png,
          name: country.name.common,
          population: country.population,
          region: country.region,
          capital: country.capital,
        }));

        countries.forEach((cntr: { region: string }) => {
          if (!this.regions.includes(cntr.region)) {
            this.regions.push(cntr.region);
          }
        });

        this.filteredCountries = this.countries;
      },
    });
  }

  onSearch() {
    if (!this.searchTerm) {
      this.filterCountriesByRegion();
    } else {
      this.filteredCountries = this.countries.filter((country) =>
        this.filterBySearchTermAndRegion(country)
      );
    }
  }

  filterCountriesByRegion() {
    if (this.selectedRegion === '') {
      this.filteredCountries = this.countries;
    } else {
      this.filteredCountries = this.countries.filter(
        (country) => country.region === this.selectedRegion
      );
    }
  }

  filterBySearchTermAndRegion(country: any): boolean {
    if (this.selectedRegion === '') {
      return country.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    } else {
      return (
        country.region === this.selectedRegion &&
        country.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onRegionSelect(selectedRegion: string) {
    this.selectedRegion = selectedRegion;
    this.onSearch();
  }
}
