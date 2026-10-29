# Lattely

A community ranking of specialty coffee shops in Barcelona, browsable by neighbourhood or by distance from the visitor.

## Language

### Shops

**Shop**:
A specialty coffee shop in Barcelona that can be ranked once an Admin approves it. It is live, closed (hidden but keeps its Ratings), or still a Submission.
_Avoid_: Café, coffee place, venue, listing

**Submission**:
A Shop proposed by a Member that an Admin has not yet approved or rejected.
_Avoid_: Suggestion, request

**Neighbourhood**:
A named, commonly used area of Barcelona (e.g. Gràcia, El Born) that serves as a Centre point. It is not an official district or barri.
_Avoid_: District, barri, area

### Browsing

**Centre point**:
The place distances are measured from: either a Neighbourhood or the visitor's own location. There is at most one at a time.
_Avoid_: Origin, anchor

**Radius**:
The maximum distance from the Centre point that a Shop can be and still show up. "Anywhere" means no limit, and it is only available when there is no Centre point.

**Ranking**:
The live Shops matching the current Centre point and Radius, ordered by Ranking score, with Unrated Shops last. With no Centre point, it covers all of Barcelona.

**Rank**:
A Shop's position (1, 2, 3…) within the current Ranking. It changes with the filter.

**Top three**:
The first three Shops in the current Ranking, shown as cards above the rest.
_Avoid_: Podium, featured

### Rating

**Rating**:
A Member's score of 1 to 5 whole stars for one Shop. Each Member has at most one per Shop and can change it.
_Avoid_: Review, vote

**Average rating**:
The plain mean of a Shop's Ratings. This is the score visitors see.

**Ranking score**:
The value Shops are ordered by. It is the Average rating pulled towards the Barcelona-wide average until the Shop has enough Ratings. Visitors never see it.

**Unrated Shop**:
A live Shop with no Ratings yet. It goes at the bottom of the Ranking, labelled "No ratings yet".

### People

**Visitor**:
Anyone browsing, signed in or not.

**Member**:
A signed-in Visitor, who can rate Shops and make Submissions.
_Avoid_: User, account

**Admin**:
A Member who approves or rejects Submissions and manages Shops.
