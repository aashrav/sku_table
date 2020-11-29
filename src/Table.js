import React, { useEffect, useState } from "react";
import { DataGrid } from '@material-ui/data-grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from "@material-ui/core";
import "./App.css";

function Table(props) {
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);
  const [numeric, setNumeric] = useState([]);
  const [filter1, setFilter1] = useState("");
  const [filter2, setFilter2] = useState("");
  const [filter3, setFilter3] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch('/get_tables', {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify({name : props.name})
    }).then(response => 
      response.json().then(data => {
        setCols(data.headers);
        setRows(data.rows);
        var index;
        var numeric = []
        for (index in data.headers) {
          var col = data.headers[index];
          if (col.type === 'number') {
            var obj = {value : col.field, label : col.field};
            numeric.push(obj);
          }
        }
        setNumeric(numeric);
      }));
  };

  const operations = 
  [{value : '=', label : 'Equal to'}, 
  {value : '>', label : 'Greater than'},
  {value : '<', label : 'Less than'},
  {value : '>=', label : 'Greater than or equal to'},
  {value : '<=', label : 'Less than or equal to'}
  ]

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(filter1, filter2, filter3);
    fetch("/submit", {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify({column : filter1, ops : filter2, val : filter3, name : props.name})
    }).then(response => 
      response.json().then(data => {
        console.log(data.headers);
        console.log(data.rows);
        setCols(data.headers);
        setRows(data.rows);
        var index;
        var numeric = []
        for (index in data.headers) {
          var col = data.headers[index];
          if (col.type === 'number') {
            var obj = {value : col.field, label : col.field};
            numeric.push(obj);
          }
        }
        setNumeric(numeric);
      }));
  }

  const clear = (e) => {
    e.preventDefault();
    getData();
    setFilter1("");
    setFilter2("");
    setFilter3("");
  }

  return (
    <div className="table">
      <div className="filter_container">
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField select id="cols_filter" className="filter" value={filter1} helperText="Select filter column" onChange={ (e) =>setFilter1(e.target.value)}>
              {numeric.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                  {option.label}
              </MenuItem> ))}
          </TextField>
          <TextField select id="ops_filter" className="filter" value={filter2} helperText="Select filter operation" onChange={ (e) =>setFilter2(e.target.value)}>
              {operations.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                  {option.label}
              </MenuItem> ))}
          </TextField>
          <TextField id="val_filter" className="filter" value={filter3} helperText="Enter filter value" onChange={ (e)=>setFilter3(e.target.value)}/>
          <Button className="add_filter" type="submit">Add</Button>
          <Button className="clear_filter" onClick={clear}>Clear</Button>
        </form>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid columns={cols} rows={rows} pageSize={100}></DataGrid>
      </div>
    </div>
  );
}

export default Table;
