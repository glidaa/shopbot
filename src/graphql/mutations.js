/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLinks = /* GraphQL */ `
  mutation CreateLinks(
    $input: CreateLinksInput!
    $condition: ModelLinksConditionInput
  ) {
    createLinks(input: $input, condition: $condition) {
      id
      title
      userId
      link
      discount
      sendAllSales
      active
      createdAt
      updatedAt
    }
  }
`;
export const updateLinks = /* GraphQL */ `
  mutation UpdateLinks(
    $input: UpdateLinksInput!
    $condition: ModelLinksConditionInput
  ) {
    updateLinks(input: $input, condition: $condition) {
      id
      title
      userId
      link
      discount
      sendAllSales
      active
      createdAt
      updatedAt
    }
  }
`;
export const deleteLinks = /* GraphQL */ `
  mutation DeleteLinks(
    $input: DeleteLinksInput!
    $condition: ModelLinksConditionInput
  ) {
    deleteLinks(input: $input, condition: $condition) {
      id
      title
      userId
      link
      discount
      sendAllSales
      active
      createdAt
      updatedAt
    }
  }
`;
