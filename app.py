from flask import Flask, jsonify, request, make_response
import numpy as np
import pandas as pd

app = Flask(__name__)

def decompose_df(df):
    col_types = df.dtypes
    headers = []
    for col_name, col_type in col_types.iteritems():
        if 'float' in col_type.name or 'int' in col_type.name:
            headers.append({'field' : col_name, 'headerName' : col_name, 'type' : 'number', 'width' : 200})
        elif 'object' in col_type.name:
            headers.append({'field' : col_name, 'headerName' : col_name, 'type' : 'string', 'width' : 200})
        else:
            headers.append({'field' : col_name, 'headerName' : col_name, 'type' : 'other', 'width' : 200})
    rows = []
    all_rows = df.values.tolist()
    for index in range(len(all_rows)):
        r = all_rows[index]
        dic = {headers[i]['field'] : r[i] for i in range(len(r))}
        dic['id'] = index
        rows.append(dic)
    return headers, rows

def table_filter(tbl, operation, column, value):
    if operation=='=':
        return tbl[tbl[column]==value]
    elif operation=='>':
        return tbl[tbl[column]>value]
    elif operation=='<':
        return tbl[tbl[column]<value]
    elif operation=='>=':
        return tbl[tbl[column]>=value]
    elif operation=='<=':
        return tbl[tbl[column]<=value]

@app.route('/get_tables', methods=['POST'])
def get_tables():
    data = request.get_json()
    df = pd.read_csv(data['name'])
    headers, rows = decompose_df(df)
    return make_response(jsonify({'headers' : headers, 'rows' : rows}), 200)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    df = pd.read_csv(data['name'])
    filtered = table_filter(df, data['ops'], data['column'], int(data['val']))
    headers, rows = decompose_df(filtered)
    return make_response(jsonify({'headers' : headers, 'rows' : rows}), 200)

@app.route('/', methods=['GET'])
def index():
    return "home"
    
if __name__ == '__main__':
    app.run()
