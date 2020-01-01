# Linku 2.0 api

> GraphQL API to get schedules from Universidad del Norte

## How to run?

### Server

```shell
  docker-compose up
```

## Want to help?

Want to file a bug, contribute some code, or improve documentation? Excellent! Create a pr :D

## Bull dashboard

Information about the status of groups and departments scraping queues
[Link](https://linku2-api.herokuapp.com/queues)

## Get groups

`GET` [Playground](https://linku2-api.herokuapp.com/graphql)
`POST` https://linku2-api.herokuapp.com/graphql

- By nrc or subject name

```shell
  query getGroups(
    $nrc: String
    $name: String
  ) {
    getGroups(
      nrc: $nrc
      name: $name
    ) {
    	nrc
      group
      subject {
        name
        departmentName
        code
        number
      }
      schedule {
        startDate
        endDate
        time {
          start
          end
        }
        day
        place
      }
      professors {
        name
        lastname
      }
      quota {
        taken
        free
      }
    }
  }
```

## Schema

```shell
scalar Date

type Query {
  getGroups(name: String): [Group!]!
  getGroup(nrc: String!) : Group
}

type Mutation {
  updateDatabase: Boolean!
}

type Group {
  id: ID!
  nrc: String!
  group: String!
  subject: Subject!
  professors: [Professor!]!
  schedule: [Schedule!]!
  quota: Quota!
}

type Subject {
  id: ID!
  name: String!
  departmentName: String!
  code: String!
  number: String!
}

type Professor {
  firstname: String!
  lastname: String!
}

type Schedule {
  startDate: String!
  endDate: String!
  time: Time!
  place: String!
  day: String!
}

type Time {
  start: String!
  end: String!
}

type Quota {
  taken: Float!
  free: Float!
}
```

## <a name="contributors"></a> Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/krthr"><img src="https://avatars.githubusercontent.com/u/18665740?s=400&v=4" width="100px;" alt="Wilson Tovar"/><br /><sub><b>Wilson Tovar</b></sub></a></td>
    <td align="center"><a href="https://github.com/sjdonado"><img src="https://avatars.githubusercontent.com/u/27580836?s=96&v=4" width="100px;" alt="Juan Rodriguez"/><br /><sub><b>Juan Rodriguez</b></sub></a></td>
  </tr>
<table>

#### Linku2.0 is an open source project that is not associated directly with Universidad del Norte.
