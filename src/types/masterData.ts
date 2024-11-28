import { BaseEntity } from './common';

export interface ContactPerson {
  name: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Customer extends BaseEntity {
  type: 'shipper' | 'consignee' | 'both';
  taxId: string;
  address: Address;
  website: string;
  industry: string;
  contacts: ContactPerson[];
  creditTerms: string;
  paymentTerms: string;
  notes: string;
  lastContact?: string;
  nextFollowUp?: string;
}

// ... rest of the types remain the same