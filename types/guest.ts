export interface NewGuest {
  fullName: string;
  email: string;
  nationalId?: string | null;
  nationality?: string | null;
  countryFlag?: string | null;
}

export interface Guest extends NewGuest {
  id: number;
}
