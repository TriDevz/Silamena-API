# DOCS

- [Words]
    - [Get requests]
    - [Post requests]
    - [Put requests]
    - [Delete requests]
- [Examples]
    - [Get requests (examples)]
    - [Post requests (examples)]
    - [Put requests (examples)]
    - [Delete requests (examples)]


[Words]: #words
[Get requests]: #get-requests
[Post requests]: #post-requests
[Put requests]: #put-requests
[Delete requests]: #delete-requests
[Examples]: #examples
[Get requests (examples)]: #get-requests-1
[Post requests (examples)]: #post-requests-1
[Put requests (examples)]: #put-requests-1
[Delete requests (examples)]: #delete-requests-1

<br><br>

# WORDS

## Conventions
- #### Roles
>        1. Noun
>        2. Verb
>        3. Number
>        4. Conjuction
>        5. Preposition
>        6. Adverb
>        7. Auxiliary
>        8. Adjective
>        9. Pronoun
>        10. Interjection
>        11. Other
- #### English translations
>        All translations should be separated by ", " or "/" (example, dog/translation).
- #### Requests
>       The title of the request cannot contain spaces: by convention the underscores are used.
<br>

___

## Get requests
- Get all words in alphabetical order (only names)
  >GET - `/api/words/names`
    - returns
        ```json
        "names": [
            "Name 1",
            "Name 2",
            "Name 3",
        ],
        "count": 3
        ```
<br>

- Get all the silamena words that can be translated to a given english word
  >GET - `/api/words/from-english/` `{english-word}`
    - returns
        ```json
        "data": [
            {
                "name": "Name 1",
                "role": 1,
                "english": "translation",
                "etymology": "original/origin...",
                "description": "This is the name's description...",
                "synonyms": ""
            },
            {
                "name": "Name 2",
                "role": 2,
                "english": "translation",
                "etymology": "original/origin...",
                "description": "This is the name's description...",
                "synonyms": ""
            }
        ]
        ```
<br>

- Get all the silamena words that have a specific etymology
  >GET - `/api/words/from-etymology/` `{etymology}`
    - returns
        ```json
        "data": [
            {
                "name": "Name 1",
                "role": 1,
                "english": "translation",
                "etymology": "original/origin...",
                "description": "This is the name's description...",
                "synonyms": ""
            },
            {
                "name": "Name 2",
                "role": 2,
                "english": "translation",
                "etymology": "original/origin...",
                "description": "This is the name's description...",
                "synonyms": ""
            }
        ]
        ```
<br>

- Get all the silamena words that have specific tag
  >GET - `/api/words/from-tag/` `{tag}`
    - returns
        ```json
        "data": [
            {
                "name": "Name 1",
                "role": 1,
                "english": "translation",
                "etymology": "original/origin...",
                "description": "This is the name's description...",
                "synonyms": ""
            },
            {
                "name": "Name 2",
                "role": 2,
                "english": "translation",
                "etymology": "original/origin...",
                "description": "This is the name's description...",
                "synonyms": ""
            }
        ]
        ```
<br>

- Check if an english word can have a silamena translation
  >GET - `/api/words/english_exists/` `{english-word}`
    - returns
        ```json
        "exists": false
        ```
<br>

- Get all words in alphabetical order (only names and english)
  >GET - `/api/words/all-english/`
    - returns
        ```json
        "names": [
          {
            "name": "Heia",
            "english": "Hi"
          },
          {
            "name": "Ploo",
            "english": "Water, River, Sea"
          },
          {
            "name": "Dzanta",
            "english": "Hello"
          }
        ],
        "count": 3
        ```
<br>

___

## Post requests
- Add a word
  >POST - `/api/words/new`
  #### Body:
    ```json
    "name": "name (string)",
    "role": "categorization (number)",
    "english": "english-translations (string)",
    "etymology": "etymology (string)",
    "description": "description/explaination (string)",
    "synonyms": "possible synonyms of the word (string)"
    ```

<br>

- Gets an array of words relative to the array of given names
  >POST - `/api/words/data`
    - body:
        ```json
        "names": [
            "Name 1",
            "Name 2"
        ]
        ```
    - returns:
        ```json
        "data": [
            {
                "name": "Name 1",
                "role": 1,
                "english": "translation",
                "etymology": "original/origin...",
                "description": "This is the name's description...",
                "synonyms": ""
            },
            {
                "name": "Name 2",
                "role": 2,
                "english": "translation",
                "etymology": "original/origin...",
                "description": "This is the name's description...",
                "synonyms": ""
            }
        ]
        ```
<br>

___

## Put requests
- Edit a word
  >PUT - `/api/words/` `{name}`
  #### Body:
    ```json
    "name": "new-name",
    "role": "new-role",
    "english": "new-translation",
    "etymology": "new-etymology",
    "description": "new-description",
    "synonyms": "new-synonyms"
    ```

<br>

___

## Delete requests
- Delete a word
  >DELETE - `/api/words/` `{name}`
___

<br>

# EXAMPLES

## Get requests
- Get a _num_ of random examples (**num is by default 1**)
  >GET - `/api/examples/random` `{?num=num}`

    - returns
        ```json
        "examples": [
            {
                "id": 1,
                "silamena": "Random text",
                "english": "English translation"
            }
        ]
        ```

<br>

- Get a _num_ of examples that contain a given english expression (**num is by default 3**)
  >GET - `/api/examples/` `{expression}` `[?num=num]`

    - returns
        ```json
        "examples": [
            {
                "id": 1,
                "silamena": "Example 1",
                "english": "Example 1 in english"
            },
            {
                "id": 2,
                "silamena": "Example 2",
                "english": "Example 2 in english"
            },
            {
                "id": 3,
                "silamena": "Example 3",
                "english": "Example 3 in english"
            },
        ]
        ```

## Post requests
- Create an example
  >POST - `/api/examples/new`
  #### Body:
    ```json
    "silamena": "silamena example (string)",
    "english": "enslish translation (number)"
    ```

<br>

___

## Put requests
- Edit an example
  >PUT - `/api/examples/` `{id}`
  #### Body:
    ```json
    "silamena": "new-silamena-example",
    "english": "new-english-translation"
    ```

<br>

___

## Delete requests
- Delete an example
  >DELETE - `/api/examples/` `{id}`
___
