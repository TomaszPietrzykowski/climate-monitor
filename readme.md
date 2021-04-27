# Public API

## REQUEST STRUCTURE

```
<ROOT ENDPOINT>/<FACTOR>/<QUERY>
```

Examlpes:

```
https://climatemonitor.info/api/public/v1/co2/daily
https://climatemonitor.info/api/public/v1/co2/monthly
https://climatemonitor.info/api/public/v1/co2/annual
https://climatemonitor.info/api/public/v1/co2/for/2019
https://climatemonitor.info/api/public/v1/co2/for/20116-04-15
```

### ROOT ENDPOINT

```
https://climatemonitor.info/api/public/v1
```

### FACTOR

#### Availaible factors:

atmospheric CO2 .../co2/...
atmospheric CH4 .../ch4/...
atmospheric SF6 .../sf6/...
atmospheric N2O .../n2o/...
temperatures .../temp/...
glaciers .../glacier/...
ocean mass .../ocean/...

### QUERY

#### GET FULL DATASET

Depending on datasets availaible for chosen FACTOR, e.g.:

```
/daily
/monthly
/annual
/monthly_ml
/annual_gl
```

Examples:

```
https://climatemonitor.info/api/public/v1/ch4/monthly
https://climatemonitor.info/api/public/v1/sf6/annual
https://climatemonitor.info/api/public/v1/co2/monthly_ml
```

#### GET SINGLE READING

Structure:

```
/for/<DATE>
```

Depending on datasets availaible for chosen FACTOR

```
/for/YYYY-MM-DD
```

will return daily readings,

```
/for/YYY-MM
```

will return monthly average,

```
/for/YYYY
```

will return annual average.

Examlpes:

```
https://climatemonitor.info/api/public/v1/co2/for/2018-05-12
https://climatemonitor.info/api/public/v1/co2/for/2012
```

## RESPONSE STRUCTURE

Response from API is provided in JSend format with possible outcomes:
success, fail and error.

### Success response

Requested data is always provided in `data` object.

```json
{
  "status": "success",
  "data": {
    "label": "2012-09-03",
    "value": 389.43,
    "unit": "ppm"
  }
}
```

Response containing full datatset:

```json
{
  "status": "success",
  "data": {
    "title": "Annual CO2 global",
    "description": "Temporary description",
    "readings": [
      {
        "label": "1980",
        "value": 338.91
      },
      // data content (...)
      {
        "label": "2020",
        "value": 412.46
      }
    ],
    "unit": "ppm",
    "source": "www.climatemonitor.info",
    "sourceUrl": "https://climatemonitor.info",
    "lastUpdate": "2021-04-24T18:24:25.789Z"
  }
}
```

### Fail response

Response status 4xx, client-side errors, e.g. invalid request.

```json
{
    "status": "fail",
    "message": "Requested date is outside of dataset scope:
    2011-01-01 - 2021-04-26"
}
```

### Error response

Response status 5xx, server-side errors

```json
{
  "status": "error",
  "err": {
    "statusCode": 500,
    "message": "Internal server error, unable to get response from API"
  }
}
```

## ALL AVAILABLE ENDPOINTS

GET requests to root endpoint:

```
https://climatemonitor.info/api/public/v1
```

##### Earth atmospheric CO2

Earth daily co2:

```
/co2/daily
```

Earth co2 monthly average from Mauna Loa Observatory, Hawaii:

```
/co2/monthly_ml
```

Earth co2 monthly global average:

```
/co2/monthly_gl
```

Earth co2 annual global average:

```
/co2/annual_gl
```

Earth co2 annual average from Mauna Loa Observatory, Hawaii:

```
/co2/annual_ml
```

Earth co2 reading for the date:

```
/co2/for/2016-04-102
```

Earth co2 monthly average:

```
/co2/for/2016-04
```

Earth co2 annaul average:

```
/co2/for/2016
```

Latest available reading

```
/co2/latest
```
