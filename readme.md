# Public REST API

## REQUEST STRUCTURE

##### GET request to:

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

Earth atmospheric carbon dioxide (CO2)

```
<ROOT ENDPOINT>/co2/<QUERY>
```

Earth atmospheric methane (CH4)

```
<ROOT ENDPOINT>/ch4/<QUERY>
```

Earth atmospheric sulfur hexafluoride (SF6)

```
<ROOT ENDPOINT>/sf6/<QUERY>
```

Earth atmospheric dinitrogen oxide (N2O)

```
<ROOT ENDPOINT>/n2o/<QUERY>
```

Earth averege temperatures and temperature anomalies

```
<ROOT ENDPOINT>/temperature/<QUERY>
```

Arctica's and Antarctica's glaciers mass loss

```
<ROOT ENDPOINT>/glaciers/<QUERY>
```

Sea level trends and global ocean mass

```
<ROOT ENDPOINT>/ocean/<QUERY>
```

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

---

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
  "message": "Requested date is outside of dataset scope: 2011-01-01 - 2021-04-26"
}
```

### Error response

Response status 5xx, server-side errors

```json
{
  "status": "error",
  "err": {
    "statusCode": 500,
    "message": "Internal server error"
  }
}
```

---

## ALL AVAILABLE ENDPOINTS

#####GET requests to root endpoint:

```
https://climatemonitor.info/api/public/v1
```

##### Earth atmospheric CO2

Latest available daily CO2 reading from Mauna Loa Observatory, Hawaii:

```
/co2/latest
```

Earth daily CO2:

```
/co2/daily
```

Earth CO2 weekly average from Mauna Loa Observatory, Hawaii:

```
/co2/weekly_ml
```

Earth CO2 weekly global average:

```
/co2/weekly_gl
```

Earth CO2 monthly average from Mauna Loa Observatory, Hawaii:

```
/co2/monthly_ml
```

Earth CO2 monthly global average:

```
/co2/monthly_gl
```

Earth CO2 annual global average:

```
/co2/annual_gl
```

Earth CO2 annual average from Mauna Loa Observatory, Hawaii:

```
/co2/annual_ml
```

Annual global CO2 increase:

```
/co2/increase_gl
```

Annual CO2 increase, Mauna Loa Observatory, Hawaii:

```
/co2/increase_ml
```

Earth CO2 reading for the date:

```
/co2/for/2016-04-102
```

Earth CO2 monthly average:

```
/co2/for/2016-04
```

Earth co2 annaul average:

```
/co2/for/2016
```

##### Earth atmospheric methane (CH4)

Monthly global atmospheric CH4:

```
/ch4/monthly
```

Annual global atmospheric CH4:

```
/ch4/annual
```

Annual atmospheric CH4 growth rate:

```
/ch4/growth
```

##### Earth atmospheric sulfur hexafluoride (SF6)

Monthly global atmospheric SF6:

```
/sf6/monthly
```

Annual global atmospheric SF6:

```
/sf6/annual
```

Annual atmospheric SF6 growth rate:

```
/sf6/growth
```

##### Earth atmospheric sulfur dinitrogen oxide (N2O)

Monthly global atmospheric N2O:

```
/n2o/monthly
```

Annual global atmospheric N2O:

```
/n2o/annual
```

Annual atmospheric N2O growth rate:

```
/n2o/growth
```
