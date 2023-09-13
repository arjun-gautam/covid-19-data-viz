Visualization of COVID-19 patients data in an interactive map using D3.js

## Data source
https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series

## To run
- npm install
- npm start

It will take a while to run when the dataset get larger and larger.

## Error that might occur
Error: Webpack build failing with ERR_OSSL_EVP_UNSUPPORTED
Fix: Run "export NODE_OPTIONS=--openssl-legacy-provider"

## Screenshots
Showing average by default
![1](https://github.com/arjun-gautam/covid-19-data-viz/assets/10881526/51512e90-536b-4f85-9220-4e7077123260)


Selecting interval
![2](https://github.com/arjun-gautam/covid-19-data-viz/assets/10881526/bf270135-fadc-477a-9825-80734555d2f5)


Drag interval across timeline
![Uploading 3.jpg…]()

