export interface Restaurant {
  type: Type;
  id: number;
  lat: number;
  lon: number;
  tags: Tags;
}

export interface Tags {
  "addr:housenumber"?: string;
  "addr:street"?: string;
  amenity: Amenity;
  branch?: string;
  brand?: string;
  "brand:wikidata"?: string;
  cuisine?: string;
  name: string;
  opening_hours?: string;
  "toilets:wheelchair"?: Delivery;
  wheelchair?: Delivery;
  "contact:email"?: string;
  "contact:facebook"?: string;
  "contact:phone"?: string;
  "contact:website"?: string;
  "diet:vegetarian"?: Delivery;
  operator?: string;
  outdoor_seating?: OutdoorSeating;
  reservation?: Delivery;
  "addr:city"?: AddrCity;
  "addr:country"?: AddrCountry;
  "addr:postcode"?: string;
  check_date?: Date;
  "check_date:opening_hours"?: Date;
  indoor_seating?: Delivery;
  email?: string;
  phone?: string;
  website?: string;
  delivery?: Delivery;
  "payment:credit_cards"?: Delivery;
  "payment:debit_cards"?: Delivery;
  takeaway?: Delivery;
  description?: string;
  level?: string;
  capacity?: string;
  smoking?: string;
  "diet:vegan"?: Delivery;
  fax?: string;
  alt_name?: string;
  "website:menu"?: string;
  toilets?: Delivery;
  "opening_hours:signed"?: Delivery;
  "opening_hours:kitchen"?: string;
}

export enum AddrCity {
  Hamburg = "Hamburg",
}

export enum AddrCountry {
  De = "DE",
}

export enum Amenity {
  Restaurant = "restaurant",
}

export enum Delivery {
  Limited = "limited",
  No = "no",
  Yes = "yes",
}

export enum OutdoorSeating {
  No = "no",
  Sidewalk = "sidewalk",
  Yes = "yes",
}

export enum Type {
  Node = "node",
}
