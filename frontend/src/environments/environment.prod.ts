// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: "/api",
  urls:{
    "getdata":"/getdata",
    "contact":"/contact"
  },
  genres: [
    {
      "name": "state",
      "field": "state"
    },
    {
      "name": "local-government",
      "field": "lga_name19"
    },
    {
      "name": "postcode",
      "field": "postcode"
    }
  ],
  resourceId:"21304414-1ff1-4243-a5d2-f52778048b29",
  limit: 10000,
  min: 14,
  days: 21,
  max: 63,
  token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI0MzQ2NzAzOTgsImp0aSI6InVzZXIiLCJpc3MiOiJpc3N1ZXIifQ.MSys5QXzjp4_jBEMXC9uxfXAXg2qxg120Q2Zvs4BDCU",
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
