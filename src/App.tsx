import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ModuleRegistry,
  AllCommunityModule,
  type ColDef,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {
  WorkspaceLanding,
  WorkspaceListModal,
  CreateWorkspaceForm,
  DataGridView,
  DataSourceModal,       
  type ConnectionDetails,
} from './components/ui/UI';
import { generateMockData, type DataRow } from './utils/api';

ModuleRegistry.registerModules([AllCommunityModule]);

const App: React.FC = () => {
  type Workspace = {
    id: string;
    name: string;
    filters: {
      ageRange?: string;
      gender?: string;
      startYear?: string;
      endYear?: string;
      condition?: string;
      conditionCodeType?: string;
      treatment?: string;
      treatmentCodeType?: string;
    };
    createdAt: string;
  };

  const [currentView, setCurrentView] = useState<
    'landing' | 'create' | 'datagrid'
  >('landing');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] =
    useState<Workspace | null>(null);
  const [showDataSourceModal, setShowDataSourceModal] =
    useState(false);
  const [showWorkspaceListModal, setShowWorkspaceListModal] =
    useState(false);
  const [rowData, setRowData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);
  const [showStats, setShowStats] = useState(true);

  const [formData, setFormData] = useState({
    workspaceName: '',
    ageRanges: '',
    gender: '',
    startYear: '',
    endYear: '',
    namedCondition: '',
    conditionCodeType: '',
    conditionCodes: '',
    namedTreatment: '',
    treatmentCodeType: '',
    treatmentCodes: ''
  });

  const gridRef = useRef<AgGridReact<DataRow> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('researchWorkspaces');
    if (saved) {
      setWorkspaces(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'researchWorkspaces',
      JSON.stringify(workspaces)
    );
  }, [workspaces]);

  useEffect(() => {
    if (activeWorkspace && rowData.length > 0) {
      let filtered = [...rowData];
      const f = activeWorkspace.filters;

      if (f.ageRange && typeof f.ageRange === 'string') {
        const parts = f.ageRange.split('-');
        if (parts.length === 2) {
          const min = parseInt(parts[0], 10);
          const max = parseInt(parts[1], 10);
          if (!isNaN(min) && !isNaN(max)) {
            filtered = filtered.filter(
              (r) => r.age >= min && r.age <= max
            );
          }
        }
      }
      if (f.gender && f.gender !== 'All') {
        filtered = filtered.filter((r) => r.gender === f.gender);
      }
      if (f.condition) {
        filtered = filtered.filter((r) =>
          r.diagnosis
            .toLowerCase()
            .includes(f.condition?.toLowerCase() || '')
        );
      }
      if (f.startYear && f.endYear) {
        const start = new Date(parseInt(f.startYear, 10), 0, 1);
        const end = new Date(parseInt(f.endYear, 10), 11, 31);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          filtered = filtered.filter((r) => {
            const d = new Date(r.encounterDate);
            return d >= start && d <= end;
          });
        }
      }

      setFilteredData(filtered);
    } else if (rowData.length > 0) {
      setFilteredData([...rowData]);
    } else {
      setFilteredData([]);
    }
  }, [activeWorkspace, rowData]);

  const columnDefs: ColDef<DataRow>[] = [
    {
      field: 'id',
      headerName: 'ID',
      editable: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left'
    },
    {
      field: 'mrn',
      headerName: 'MRN',
      editable: true
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'numericColumn',
      editable: true
    },
    { field: 'gender', headerName: 'Gender', editable: true },
    { field: 'diagnosis', headerName: 'Diagnosis', editable: true },
    { field: 'treatment', headerName: 'Treatment', editable: true },
    {
      field: 'encounterDate',
      headerName: 'Encounter Date',
      editable: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: (
          filterLocalDateAtMidnight: Date,
          cellValue: string
        ) => {
          if (!cellValue) return -1;
          const [y, m, d] = cellValue.split('-').map(Number);
          const cellDate = new Date(y, m - 1, d);
          if (
            filterLocalDateAtMidnight.getTime() ===
            cellDate.getTime()
          )
            return 0;
          return cellDate < filterLocalDateAtMidnight
            ? -1
            : 1;
        }
      }
    },
    {
      field: 'labValue',
      headerName: 'Lab Value',
      type: 'numericColumn',
      editable: true
    },
    {
      field: 'systolicBP',
      headerName: 'Systolic BP',
      type: 'numericColumn',
      editable: true
    },
    {
      field: 'diastolicBP',
      headerName: 'Diastolic BP',
      type: 'numericColumn',
      editable: true
    },
    {
      field: 'bmi',
      headerName: 'BMI',
      type: 'numericColumn',
      editable: true
    }
  ];

  const defaultColDef: ColDef<DataRow> = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateWorkspace = () => setCurrentView('create');
  const handleViewWorkspaces = () =>
    setShowWorkspaceListModal(true);
  const handleBackToLanding = () => {
    setCurrentView('landing');
    setActiveWorkspace(null);
    setRowData([]);
    setFilteredData([]);
  };

  const handleEnterWorkspace = () => {
    const newWs: Workspace = {
      id: Date.now().toString(),
      name: formData.workspaceName || 'Untitled Workspace',
      filters: {
        ageRange: formData.ageRanges,
        gender: formData.gender,
        startYear: formData.startYear,
        endYear: formData.endYear,
        condition: formData.namedCondition,
        conditionCodeType: formData.conditionCodeType,
        treatment: formData.namedTreatment,
        treatmentCodeType: formData.treatmentCodeType
      },
      createdAt: new Date().toISOString()
    };
    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspace(newWs);
    setCurrentView('datagrid');
    setRowData(generateMockData(100));
  };

  const [connectedSources, setConnectedSources] = useState<
  { name: string; details: ConnectionDetails }[]
>([]);



const handleConnectDataSource = (
  source: string,
  details: ConnectionDetails
) => {
  setConnectedSources(prev => [...prev, { name: source, details }]);

  setRowData(prev => [...prev, ...generateMockData(50)]);
};

  const handleLoadWorkspace = (ws: Workspace) => {
    setActiveWorkspace(ws);
    setCurrentView('datagrid');
    setShowWorkspaceListModal(false);
    setRowData(generateMockData(100));
  };

  const handleDeleteWorkspace = (id: string) => {
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    if (activeWorkspace?.id === id) {
      handleBackToLanding();
    }
  };

  const handleSaveWorkspace = () => {
    if (activeWorkspace) {
      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === activeWorkspace.id ? activeWorkspace : w
        )
      );
      alert('Workspace saved successfully!');
    }
  };

  const handleAddRow = () => {
    const newRow: DataRow = {
      id: `P${String(rowData.length + 1).padStart(3, '0')}`,
      mrn: `MRN${String(rowData.length + 1).padStart(3, '0')}`,
      age: 30,
      gender: 'Male',
      diagnosis: '',
      treatment: '',
      encounterDate: new Date()
        .toISOString()
        .split('T')[0],
      labValue: 0,
      systolicBP: 120,
      diastolicBP: 80,
      bmi: '25.0'
    };
    setRowData((prev) => [...prev, newRow]);
  };

  const handleDeleteRows = () => {
    if (selectedRows.length > 0) {
      const ids = selectedRows.map((r) => r.id);
      setRowData((prev) =>
        prev.filter((r) => !ids.includes(r.id))
      );
      setSelectedRows([]);
    }
  };

  const handleExportExcel = () => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsExcel({
        fileName: `${activeWorkspace?.name || 'data'}-${new Date()
          .toISOString()
          .split('T')[0]}.xlsx`
      });
    }
  };
  const handleExportCSV = () => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `${activeWorkspace?.name || 'data'}-${new Date()
          .toISOString()
          .split('T')[0]}.csv`
      });
    }
  };

  const onSelectionChanged = useCallback(() => {
    if (gridRef.current?.api) {
      const sel = gridRef.current.api.getSelectedNodes();
      setSelectedRows(sel.map((n) => n.data as DataRow));
    }
  }, []);

  if (currentView === 'landing') {
    return (
      <WorkspaceLanding
        onViewWorkspaces={handleViewWorkspaces}
        onCreateWorkspace={handleCreateWorkspace}
      />
    );
  }
  if (currentView === 'create') {
    return (
      <CreateWorkspaceForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleBackToLanding={handleBackToLanding}
        handleSubmit={handleEnterWorkspace}
      />
    );
  }
  if (currentView === 'datagrid' && activeWorkspace) {
    return (
      <>
        <DataGridView
          activeWorkspace={activeWorkspace}
          filteredData={filteredData}
          showStats={showStats}
          setShowStats={setShowStats}
          setShowDataSourceModal={setShowDataSourceModal}   
          handleBackToLanding={handleBackToLanding}
          handleAddRow={handleAddRow}
          handleDeleteRows={handleDeleteRows}
          handleSaveWorkspace={handleSaveWorkspace}
          handleExportExcel={handleExportExcel}
          handleExportCSV={handleExportCSV}
          onSelectionChanged={onSelectionChanged}
          gridRef={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
  
        <DataSourceModal
          isOpen={showDataSourceModal}
          onClose={() => setShowDataSourceModal(false)}
          onConnect={handleConnectDataSource}
        />
      </>
    );
  }

  return (
    <>
      <WorkspaceListModal
        isOpen={showWorkspaceListModal}
        onClose={() => setShowWorkspaceListModal(false)}
        workspaces={workspaces}
        onSelect={handleLoadWorkspace}
        onDelete={handleDeleteWorkspace}
      />
      <WorkspaceLanding
        onViewWorkspaces={handleViewWorkspaces}
        onCreateWorkspace={handleCreateWorkspace}
      />
    </>
  );
};

export default App;
