# Linku 2.0 api

> GraphQL API to get schedules from Universidad del Norte

* `GET` [Playground](https://linku2-api.herokuapp.com/graphql)
* `POST` https://linku2-api.herokuapp.com/graphql

## How to run?

```shell
  docker-compose up
```

## Want to help?

Want to file a bug, contribute some code, or improve documentation? Excellent! Create a pr :D

## Bull dashboard

Information about the status of groups and departments scraping queues
[https://linku2-api.herokuapp.com/queues](https://linku2-api.herokuapp.com/queues)

## Get subjects example

```shell
  {
    getSubjects {
      docs {
        id
        name
        departmentName
        code
        number
        mat
      }
      pageInfo {
        totalPages
        limit
        nextPage
        prevPage
      }
    }
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
