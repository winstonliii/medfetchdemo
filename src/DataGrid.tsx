import { useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';

const fetchFHIR = () => {
  return [
    { patientId: 'P001', age: 45, diagnosis: 'Hypertension' },
    { patientId: 'P002', age: 32, diagnosis: 'Diabetes' },
    { patientId: 'P003', age: 28, diagnosis: 'Asthma' },
  ];
};

export default function DataGrid() {
  const [rowData] = useState(() => fetchFHIR());
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs = [
    { field: 'patientId', headerName: 'Patient', editable: true },
    { field: 'age', type: 'numericColumn', editable: true },
    { field: 'diagnosis', editable: true },
  ];

  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
  };

  const exportExcel = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      fileName: 'research-extract.xlsx',
    });
  }, []);

  return (
    <div className="h-[80vh] ag-theme-quartz">
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        enableRangeSelection
        clipboardDelimiter=","
        rowSelection="multiple"
      />
      <button
        onClick={exportExcel}
        className="mt-2 rounded bg-teal-500 px-3 py-1 text-white"
      >
        Export to Excel
      </button>
    </div>
  );
}
