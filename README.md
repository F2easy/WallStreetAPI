# API for WallStreet APP

## BackEnd server for the WallStreet app, with auth and mongoose relationships etx.

## Enteties

-User is comprised of the following:
// this would be replaced by ERD
```js
	
User: {
  name: String,
  required: true,
  userId: int,
  required: true,
},
Password: {
  type: String,
  required: true,
},

Portfolio: [portfolioSchema],
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required:false
},
	
```

## Routes


### Auth Routes

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/`    | `users#changepw`  |
| DELETE | `/sign-out/`           | `users#signout`   |


### Stock Routes

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| GET    | `/stocks`              | `stocks#index`    |
| GET    | `/stocks/:id`          | `stocks#show`     |



### Portfolio Routes


| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/portfolio`           | `portfolio#create`|
| DELETE | `/portfolio/:id`       | `portfolio#delete`|
| PATCH  | `/portfolio/:id`       | `portfolio#edit`  |