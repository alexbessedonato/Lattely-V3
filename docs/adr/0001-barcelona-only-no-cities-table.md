# Barcelona only, no cities table

Lattely launches in Barcelona alone, and the data model has no City concept: Shops and Neighbourhoods are implicitly in Barcelona, and routes are unprefixed. We considered adding a `cities` table up front, but chose to keep the MVP simpler and accept that a second city will need a data migration (a new table, a foreign key on Shops and Neighbourhoods, and city-scoped routes).
