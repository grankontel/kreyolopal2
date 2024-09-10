
# Dictionary structure specs

## Solution

### Entry

```json
{
"entry": "foumi",
"docType": "entry",
 "variations": [
  "foumi",
  "fonmi",
  "fòmi"
 ]
},
{
"entry": "fonmi",
"docType": "entry",
 "variations": [
  "foumi",
  "fonmi",
  "fòmi"
 ],
"aliasOf": "foumi"
},
{
"entry": "fòmi",
"docType": "entry",
 "variations": [
  "foumi",
  "fonmi",
  "fòmi"
 ],
"aliasOf": "foumi"
}
```

### Definition

```json
{
 "entry": "fonmi",
 "prefix": "",
 "suffix": "",
 "asIn": "",
 "docType": "definition",
 "definition_id": "fonmi_0",
 "kreyol": "gp",
 "rank": 0,
 "nature": [
  "nom"
 ],
 "meaning": {
  "gp": "",
  "fr": "fourmi."
 },
 "usage": [],
 "synonyms": [],
 "confer": [],
 "quotes": []
},

```

### Exemple "tren"

```json
{
 "entry": "tren",
 "docType": "entry",
 "variations": [
  "tren"
 ]
},
{
 "entry": "tren",
 "docType": "definition",
 "definition_id": "tren_0",
 "kreyol": "gp",
 "rank": 0,
 "nature": [
  "nom"
 ],
 "meaning": {
  "gp": "",
  "fr": "tracasseries."
 },
 "usage": [],
 "synonyms": [],
 "confer": [],
 "quotes": []
},
{
 "entry": "tren",
 "prefix": "chèché",
 "suffix": "",
 "asIn": "",
 "docType": "definition",
 "definition_id": "tren_1",
 "kreyol": "gp",
 "rank": 1,
 "nature": [
  "verbe"
 ],
 "meaning": {
  "gp": "",
  "fr": "chercher noises."
 },
 "usage": [
  "chaché moun tren byen, mé penga vini chigné aprésa !"
 ],
 "synonyms": [
  "dézòd"
 ],
 "confer": [],
 "quotes": []
},

```

### Exemple "doubsis"

```json
{
 "entry": "doubsis",
 "docType": "entry",
 "variations": [
  "doubsis"
 ]
},
{
 "entry": "doubsis",
 "prefix": "",
 "suffix": "",
 "asIn": "",
 "docType": "definition",
 "definition_id": "doubsis_0",
 "kreyol": "gp",
 "rank": 0,
 "nature": [
  "nom"
 ],
 "meaning": {
  "gp": "",
  "fr": "double-six (au domino)."
 },
 "usage": [],
 "synonyms": [],
 "confer": [],
 "quotes": []
},
{
 "entry": "doubsis",
 "prefix": "",
 "suffix": "",
 "asIn": "doubsis mò an men a...",
 "docType": "definition",
 "definition_id": "doubsis_1",
 "kreyol": "gp",
 "rank": 0,
 "nature": [
  "locution"
 ],
 "meaning": {
  "gp": "",
  "fr": "rater le coche."
 },
 "usage": [],
 "synonyms": [],
 "confer": [],
 "quotes": []
},


```

# Subscriptions specs #

## Customer

```json
{
  "name" :  "John Doe",
  "email" : "john.doe@gmail.com",
  "phone" : "+33123456789",
  "address" : {
    "city" : "Paris",
    "country" : "France",
    "line_1" : "1 rue de la paix",
    "line_2" : "",  
    "postal_code" : "75001",
    "state" : ""
  }
}

```

Database should be : name; email; phone; address (as json) ; stripe_customer_id

## Product

```json
{
  "name" : "My Product",
  "description" : "My Product description",
}
```

Database should be : name; description ; stripe_customer_id

```js
const stripe = require('stripe')('sk_test_xxxxxxxxxxxx');

const activeEntitlements = await stripe.entitlements.activeEntitlements.list({
  customer: 'cus_9s6XKzkNRiz8i3',
});
```

