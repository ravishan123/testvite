interface AddressComponent {
  long_name: string;
  short_name: string;
  types: Array<string>;
}

export interface Address {
  address1?: string;
  address2?: string;
  postalCode?: string;
  state?: string;
  city?: string;
  country?: string;
}

export class GoogleAddressParser {
  private address: Address = {};

  constructor(private address_components: Array<AddressComponent>) {
    this.parseAddress();
  }

  private parseAddress() {
    if (!Array.isArray(this.address_components)) {
      throw Error('Address Components is not an array');
    }

    if (!this.address_components.length) {
      throw Error('Address Components is empty');
    }

    for (let i = 0; i < this.address_components.length; i++) {
      const component: AddressComponent = this.address_components[i];

      if (this.isStreetNumber(component)) {
        this.address.address1 = component.long_name;
      }

      if (this.isStreetName(component)) {
        if (this.address.address1) {
          this.address.address1 = `${this.address.address1}, ${component.long_name}`;
        } else {
          this.address.address1 = component.long_name;
        }
      }

      if (this.isSubCity(component)) {
        this.address.address2 = component.long_name;
      }

      if (this.isCity(component)) {
        this.address.city = component.long_name;
      }

      if (this.isCountry(component)) {
        this.address.country = component.short_name;
      }

      if (this.isState(component)) {
        this.address.state = component.long_name;
      }

      if (this.isPostalCode(component)) {
        this.address.postalCode = component.long_name;
      }
    }
  }

  private isStreetNumber(component: AddressComponent): boolean {
    return component.types.includes('street_number');
  }

  private isStreetName(component: AddressComponent): boolean {
    return component.types.includes('route');
  }

  private isCity(component: AddressComponent): boolean {
    return component.types.includes('locality') || component.types.includes('postal_town');
  }

  private isSubCity(component: AddressComponent): boolean {
    return component.types.includes('sublocality');
  }

  private isState(component: AddressComponent): boolean {
    return component.types.includes('administrative_area_level_1');
  }

  private isCountry(component: AddressComponent): boolean {
    return component.types.includes('country');
  }

  private isPostalCode(component: AddressComponent): boolean {
    return component.types.includes('postal_code');
  }

  parse(): Address {
    if (!this.address.city && this.address.address2) {
      this.address.city = this.address.address2;
      this.address.address2 = undefined;
    }

    return this.address;
  }
}
