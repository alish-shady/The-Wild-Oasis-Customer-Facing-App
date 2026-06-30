export interface NewGuest {
  fullName: string;
  email: string;
  nationalId?: string;
  nationality?: string;
  countryFlag?: string;
}

export interface Guest extends NewGuest {
  id: number;
}
