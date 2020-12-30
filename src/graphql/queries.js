/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLinks = /* GraphQL */ `
  query GetLinks($id: ID!) {
    getLinks(id: $id) {
      id
      userId
      link
      discount
      sendAllSales
      createdAt
      updatedAt
    }
  }
`;
export const listLinkss = /* GraphQL */ `
  query ListLinkss(
    $filter: ModelLinksFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLinkss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        link
        discount
        sendAllSales
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
