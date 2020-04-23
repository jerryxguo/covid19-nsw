
export class Record {
  notification_date: string;
  postcode: number;
  lga_name19: string;
}

export class DisplayModel {
  date: string;
  count: number;
}

export class DataModel {
  title: string;
  field: string;
  total: number;
  data: DisplayModel[];
}
