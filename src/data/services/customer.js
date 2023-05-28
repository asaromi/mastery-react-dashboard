import { customersData } from "../dummy"

let customers = [...customersData]
/**
 * sort: [{ direction: "Ascending", field: "CustomerID" }]
 */
const renderData = ({ action, sort, skip, take }) => {
  // console.log("sorting?", sort)
  if (sort) customers.sort(sortData(...sort))

  return {
    actionArgs: action,
    count: customersData.length,
    json: skip ? customers.slice(skip - take, skip) : [],
    result: customers.slice(skip, skip + take),
  }
}

const sortData =
  (field, direction = "Ascending") =>
  (a, b) => {
    let compare = 0
    if (direction === "Ascending") {
      compare =
        typeof a[field] === "string"
          ? a[field].localeCompare(b[field])
          : a[field] - b[field]
    } else {
      compare =
        typeof b[field] === "string"
          ? b[field].localeCompare(a[field])
          : b[field] - a[field]
    }

    return compare
  }

export const getData = async ({ skip, take, action }) => {
  let sort
  if (action?.requestType === "sorting") {
    sort = [action.columnName || "CustomerID", action.direction || "Ascending"]
  }

  return renderData({ action, sort, skip, take })
}

export const addRecord = async ({ data }) => {
  customers.push(data)
}

export const updateRecord = async ({ primaryKeyValue: [customerId], data }) => {
  const index = customers.findIndex(
    (item) => item.CustomerID === customerId
  )
  customers[index] = data
}

export const deleteRecord = async ({ data }) => {
  const deletedIds = data?.map((item) => item.CustomerID) || []
  const newData = customers.filter((item) => !deletedIds.includes(item.CustomerID))
  
  customers = newData
}
