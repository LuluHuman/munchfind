> [!NOTE]
>
> - This directory contains data from Grabtaxi Holdings Pte Ltd. / GrabServices Pte Ltd. i do not own or have the rights to the data.
> - Restaurants and their full menus are scraped from https://food.grab.com/sg/en/restaurants and https://food.grab.com/sg/en/restaurant/online-delivery/restaurant-id (one JSON file per restaurant under `restaurants/`, including real dish names, prices, and coordinates (geocoded via google maps api))
> - `munchfind.sqlite` is built from this raw data via `npm run db:build` ([build-db.mjs](/scripts/build-db.mjs)) — dish names, prices, and per-restaurant coordinates are all real, scraped values, not AI-generated
