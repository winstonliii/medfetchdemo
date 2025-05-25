
import { AgGridReact } from 'ag-grid-react';
import { Button } from './components/ui/button';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

ModuleRegistry.registerModules([AllCommunityModule]);


const App = () => {
  const cols = [
    { field: 'mrn', headerName: 'MRN', editable: true },
    { field: 'diagnosis', editable: true },
    { field: 'date', headerName: 'Encounter Date', type: 'dateColumn' }
  ];
  const rows = []; 
  return (
    <div className="ag-theme-quartz h-screen w-full">
      <AgGridReact rowData={rows} columnDefs={cols} defaultColDef={{ flex: 1, resizable: true }} />
      <div className="flex flex-col items-center justify-center min-h-svh">
      </div>
    </div>
  );
};
export default App;
