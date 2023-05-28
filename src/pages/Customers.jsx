import React, { useState } from "react"
import {
  ColumnsDirective,
  ColumnDirective,
  Edit,
  Filter,
  Inject,
  GridComponent,
  Page,
  Selection,
  Sort,
  Toolbar,
} from "@syncfusion/ej2-react-grids"

import { Header } from "../components"
import { customersGrid } from "../data/dummy"
import {
  getData,
  addRecord,
  updateRecord,
  deleteRecord,
} from "../data/services/customer"

const Customers = () => {
  const [grid, setGrid] = useState(null)
  let data = {
    count: 0,
    result: [],
  }

  const renderComplete = () => {
    // console.log("render complete")
    if (grid && grid.dataSource.result.length === 0) {
      // console.log("initiate data")
      const state = { skip: 0, take: 10 }
      dataStateChange(state)
    }
  }

  const dataStateChange = (state) => {
    grid.dataSource = data
    console.log("data state change", state)
    getData(state).then((newData) => {
      // console.log("new data", newData)
      if (grid) {
        // console.log("updating dataSource")
        grid.dataSource = newData

        if (state?.action?.action === "edit" && (state?.action?.data?.Customer !== state?.action?.previousData?.Customer)) {
          grid.refresh()
        }
      }
    })
  }

  const dataSourceChanged = (state) => {
    const { CustomerName: oldName, CustomerEmail: oldEmail, CustomerImage:oldImage } = state.previousData || {}
    const [CustomerName, CustomerEmail, CustomerImage = null] = state.data?.Customer?.split(";") || []
    
    if (state?.action === "add") {
      addRecord({ 
        ...state, 
        data: { 
          ...state.data,
          CustomerName, 
          CustomerEmail, 
          CustomerImage, 
        }
      }).then(() => {
        // dataStateChange(state)
        state.endEdit()
      })
    } else if (state?.action === "edit") {
      updateRecord({ 
        ...state, 
        data: { 
          ...state.data,
          CustomerName: CustomerName || oldName, 
          CustomerEmail: CustomerEmail || oldEmail,
          CustomerImage: CustomerImage || oldImage, 
        }
      }).then(() => {
        // dataStateChange(state)
        state.endEdit()
      })
    } else if (state?.action?.action === "delete" || state?.action === "delete" || state?.requestType === "delete") {
      deleteRecord(state).then((newData) => {
        // dataStateChange(state)
        state.endEdit()
      })
    }
  }

  const onClickToolbar = (event) => {
    const selector = event.target
    
    // console.log('selector', selector.innerText)
    if (selector.innerText === 'Add') {
      // console.log('element', selector)
      setTimeout(() => {
        document.querySelector('input.e-field.e-input.e-defaultcell.e-control.e-textbox.e-lib[name="Customer"]')
          .placeholder = 'ex: name;email;imageUrl'
      }, 250)
    }
  }

  return (
    <div className="mt-10 pt-10 m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Customers" />
      <GridComponent
        dataSource={data}
        ref={(g) => setGrid(g)}
        editSettings={{
          allowDeleting: true,
          allowEditing: true,
          allowAdding: true,
        }}
        toolbar={["Delete", "Edit", "Add"]}
        allowPaging
        allowGrouping
        allowSorting
        toolbarClick={({ originalEvent: event }) => onClickToolbar(event)}
        dataStateChange={dataStateChange}
        dataSourceChanged={dataSourceChanged}
        dataBound={renderComplete}
        pageSettings={{ pageSize: 10 }}
        add
        width="auto"
      >
        <ColumnsDirective>
          {customersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Edit, Filter, Page, Selection, Sort, Toolbar]} />
      </GridComponent>
    </div>
  )
}

export default Customers
