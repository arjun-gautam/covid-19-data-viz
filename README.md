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
![Screenshot from 2023-09-13 13-32-59](https://github.com/arjun-gautam/covid-19-data-viz/assets/10881526/1c6456a1-48bf-4f7a-a685-85b4161e6548)

Selecting interval
![Screenshot from 2023-09-13 13-33-18](https://github.com/arjun-gautam/covid-19-data-viz/assets/10881526/fbf680e4-9e8e-42fa-a7aa-ddbafd3e0150)

Drag interval across timeline
![Screenshot from 2023-09-13 13-33-26](https://github.com/arjun-gautam/covid-19-data-viz/assets/10881526/ff897fa6-682e-43bd-9e31-ac7187636436)
