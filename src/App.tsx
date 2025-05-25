import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const fetchFHIR = () => {
  return [
    { mrn: 'MRN001', diagnosis: 'Hypertension', date: '2024-03-15' },
    { mrn: 'MRN002', diagnosis: 'Diabetes Type 2', date: '2024-03-14' },
    { mrn: 'MRN003', diagnosis: 'Asthma', date: '2024-03-13' },
    { mrn: 'MRN004', diagnosis: 'Chronic Kidney Disease', date: '2024-03-12' },
    { mrn: 'MRN005', diagnosis: 'Coronary Artery Disease', date: '2024-03-11' },
  ];
};

const WorkspaceLanding = ({ onCreateWorkspace, onViewWorkspaces }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Workspaces
        </h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Create, organize, and run queries across datasets with ease.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onViewWorkspaces}
            className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            View Workspaces
          </button>
          <button
            onClick={onCreateWorkspace}
            className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors duration-200"
          >
            Create Workspace
          </button>
        </div>

        <p className="text-gray-700 mb-8 leading-relaxed">
          A workspace lets you build, preview, and query custom data tables with 
          intuitive tools tailored for research and analysis.
        </p>

        <div className="text-left mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">How it works:</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-semibold rounded-full flex items-center justify-center mr-3 mt-0.5">1</span>
              <span>Create a new workspace</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-semibold rounded-full flex items-center justify-center mr-3 mt-0.5">2</span>
              <span>Pull and connect data</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-semibold rounded-full flex items-center justify-center mr-3 mt-0.5">3</span>
              <span>Select your desired fields</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-semibold rounded-full flex items-center justify-center mr-3 mt-0.5">4</span>
              <span>Run and visualize results</span>
            </li>
          </ol>
        </div>

        <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center justify-center mx-auto">
          Learn more about workspaces
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const DataGridView = ({ onBack }) => {
  const [rowData] = useState(() => fetchFHIR());
  
  const columnDefs = [
    { field: 'mrn', headerName: 'MRN', editable: true },
    { field: 'diagnosis', editable: true },
    { field: 'date', headerName: 'Encounter Date', type: 'dateColumn' }
  ];

  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className="h-screen w-full bg-white">
      <div className="p-4 border-b bg-gray-50">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          ← Back to Workspaces
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Healthcare Data Workspace</h2>
      </div>
      <div className="ag-theme-quartz h-full">
        <AgGridReact 
          rowData={rowData} 
          columnDefs={columnDefs} 
          defaultColDef={defaultColDef}
          enableRangeSelection
          rowSelection="multiple"
        />
      </div>
    </div>
  );
};

const CreateWorkspaceForm = ({ onBack, onEnter }) => {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onEnter(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Workspace</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Build your dataset by selecting relevant fields and filters below to personalize it for your study.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Name Workspace</label>
            <input
              type="text"
              placeholder="e.g. Pediatric Diabetes Study"
              value={formData.workspaceName}
              onChange={(e) => handleInputChange('workspaceName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Build Your Database</h3>
            <div className="text-gray-700 space-y-2">
              <p>Building your Database means creating all relevant information allowed by your institution. Retrieve and select data from various sources to construct relevant and personalized tables.</p>
              <p>Use the filters below to pull the most relevant data for your workspace. Build your dataset by selecting relevant fields and filters below to personalize it for your study.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Age Ranges</label>
              <input
                type="text"
                placeholder="e.g. 18-65"
                value={formData.ageRanges}
                onChange={(e) => handleInputChange('ageRanges', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Start Year</label>
              <input
                type="text"
                placeholder="e.g. 2015"
                value={formData.startYear}
                onChange={(e) => handleInputChange('startYear', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">End Year</label>
              <input
                type="text"
                placeholder="e.g. 2022"
                value={formData.endYear}
                onChange={(e) => handleInputChange('endYear', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Named Condition</label>
              <input
                type="text"
                placeholder="e.g. Diabetes"
                value={formData.namedCondition}
                onChange={(e) => handleInputChange('namedCondition', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Code Type</label>
              <select
                value={formData.conditionCodeType}
                onChange={(e) => handleInputChange('conditionCodeType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select code type</option>
                <option value="icd10">ICD-10</option>
                <option value="icd9">ICD-9</option>
                <option value="snomed">SNOMED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Codes</label>
              <input
                type="text"
                placeholder="e.g. E10, E11"
                value={formData.conditionCodes}
                onChange={(e) => handleInputChange('conditionCodes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Named Treatment</label>
              <input
                type="text"
                placeholder="e.g. Insulin"
                value={formData.namedTreatment}
                onChange={(e) => handleInputChange('namedTreatment', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Code Type</label>
              <select
                value={formData.treatmentCodeType}
                onChange={(e) => handleInputChange('treatmentCodeType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select code type</option>
                <option value="ndc">NDC</option>
                <option value="rxnorm">RxNorm</option>
                <option value="hcpcs">HCPCS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Codes</label>
              <input
                type="text"
                placeholder="e.g. A10AB01"
                value={formData.treatmentCodes}
                onChange={(e) => handleInputChange('treatmentCodes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors duration-200"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('landing');

  const handleCreateWorkspace = () => {
    setCurrentView('create');
  };

  const handleViewWorkspaces = () => {
    setCurrentView('datagrid');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleEnterWorkspace = (formData) => {
    console.log('Workspace data:', formData);
    setCurrentView('datagrid');
  };

  if (currentView === 'landing') {
    return (
      <WorkspaceLanding 
        onCreateWorkspace={handleCreateWorkspace}
        onViewWorkspaces={handleViewWorkspaces}
      />
    );
  }

  if (currentView === 'create') {
    return (
      <CreateWorkspaceForm 
        onBack={handleBackToLanding}
        onEnter={handleEnterWorkspace}
      />
    );
  }

  return (
    <DataGridView onBack={handleBackToLanding} />
  );
};

export default App;