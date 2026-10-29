# The Visitor's location stays in the browser

When a Visitor uses "use my location", the URL only records `near=me`. The coordinates live in client state and travel only in the request that fetches the Ranking; they are never put in the URL, logged or stored. We rejected raw or rounded coordinates in the URL because sharing a link would share the sender's location, and keeping coordinates off the server keeps Lattely clear of GDPR obligations for location data. A shared `near=me` link opens the Ranking near the person receiving it.
