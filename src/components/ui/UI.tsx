import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  Database,
  Globe,
  FileText,
  Trash2,
  BarChart3,
  Save,
  Download,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const DataSourceModal = ({ isOpen, onClose, onConnect }: any) => {
  const [selectedSource, setSelectedSource] = useState('');
  const [connectionDetails, setConnectionDetails] = useState({
    fhirUrl: '',
    apiEndpoint: '',
    apiKey: '',
    csvFile: null
  });

  if (!isOpen) return null;

  const handleConnect = () => {
    setTimeout(() => {
      onConnect(selectedSource, connectionDetails);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Connect Data Source</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="fhir"
                checked={selectedSource === 'fhir'}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="form-radio"
              />
              <Database className="w-4 h-4" />
              <span>FHIR Server</span>
            </label>
            {selectedSource === 'fhir' && (
              <input
                type="text"
                placeholder="FHIR Server URL"
                className="mt-2 w-full px-3 py-2 border rounded"
                value={connectionDetails.fhirUrl}
                onChange={(e) =>
                  setConnectionDetails({
                    ...connectionDetails,
                    fhirUrl: e.target.value
                  })
                }
              />
            )}
          </div>
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="api"
                checked={selectedSource === 'api'}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="form-radio"
              />
              <Globe className="w-4 h-4" />
              <span>REST API</span>
            </label>
            {selectedSource === 'api' && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="API Endpoint"
                  className="w-full px-3 py-2 border rounded"
                  value={connectionDetails.apiEndpoint}
                  onChange={(e) =>
                    setConnectionDetails({
                      ...connectionDetails,
                      apiEndpoint: e.target.value
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="API Key (optional)"
                  className="w-full px-3 py-2 border rounded"
                  value={connectionDetails.apiKey}
                  onChange={(e) =>
                    setConnectionDetails({
                      ...connectionDetails,
                      apiKey: e.target.value
                    })
                  }
                />
              </div>
            )}
          </div>
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="csv"
                checked={selectedSource === 'csv'}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="form-radio"
              />
              <FileText className="w-4 h-4" />
              <span>CSV File</span>
            </label>
            {selectedSource === 'csv' && (
              <input
                type="file"
                accept=".csv"
                className="mt-2 w-full"
                onChange={(e) =>
                  setConnectionDetails({
                    ...connectionDetails,
                    csvFile: e.target.files ? e.target.files[0] : null
                  })
                }
              />
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={!selectedSource}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export const StatisticsPanel = ({ data }: any) => {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    const ageStats = {
      min: Math.min(...data.map((d: any) => d.age)),
      max: Math.max(...data.map((d: any) => d.age)),
      avg: (data.reduce((sum: any, d: any) => sum + d.age, 0) / data.length).toFixed(1)
    };
    const genderDistribution = data.reduce((acc: any, d: any) => {
      acc[d.gender] = (acc[d.gender] || 0) + 1;
      return acc;
    }, {});
    const conditionDistribution = data.reduce((acc: any, d: any) => {
      acc[d.diagnosis] = (acc[d.diagnosis] || 0) + 1;
      return acc;
    }, {});
    const avgBMI = (
      data.reduce((sum: any, d: any) => sum + parseFloat(d.bmi), 0) / data.length
    ).toFixed(1);
    const avgSystolic = Math.round(
      data.reduce((sum: any, d: any) => sum + d.systolicBP, 0) / data.length
    );
    const avgDiastolic = Math.round(
      data.reduce((sum: any, d: any) => sum + d.diastolicBP, 0) / data.length
    );

    return {
      ageStats,
      genderDistribution,
      conditionDistribution,
      avgBMI,
      avgSystolic,
      avgDiastolic,
      totalPatients: data.length
    };
  }, [data]);

  if (!stats) return null;

  const pieData = Object.entries(stats.genderDistribution).map(([name, value]) => ({
    name,
    value
  }));
  const barData = Object.entries(stats.conditionDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Statistics & Analytics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded p-3">
          <div className="text-sm text-gray-600">Total Patients</div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalPatients}
          </div>
        </div>
        <div className="bg-green-50 rounded p-3">
          <div className="text-sm text-gray-600">Avg Age</div>
          <div className="text-2xl font-bold text-green-600">
            {stats.ageStats.avg}
          </div>
        </div>
        <div className="bg-purple-50 rounded p-3">
          <div className="text-sm text-gray-600">Avg BMI</div>
          <div className="text-2xl font-bold text-purple-600">
            {stats.avgBMI}
          </div>
        </div>
        <div className="bg-orange-50 rounded p-3">
          <div className="text-sm text-gray-600">Avg BP</div>
          <div className="text-2xl font-bold text-orange-600">
            {stats.avgSystolic}/{stats.avgDiastolic}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Gender Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent! * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Top 5 Conditions</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const WorkspaceListModal = ({
  isOpen,
  onClose,
  workspaces,
  onSelect,
  onDelete
}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Saved Workspaces</h3>
        <div className="space-y-2">
          {workspaces.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No saved workspaces
            </p>
          ) : (
            workspaces.map((ws: any) => (
              <div
                key={ws.id}
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{ws.name}</h4>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(ws.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Filters: Age {ws.filters.ageRange || 'Any'},{' '}
                    {ws.filters.gender || 'All genders'},{' '}
                    {ws.filters.condition || 'All conditions'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onSelect(ws)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDelete(ws.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const WorkspaceLanding = ({
  onViewWorkspaces,
  onCreateWorkspace
}: any) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Research Workspaces
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Create, organize, and analyze research data with powerful tools.
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

      <div className="text-left mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Features:
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <Database className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
            <span>Connect to FHIR servers, APIs, and CSV files</span>
          </li>
          <li className="flex items-start">
            <BarChart3 className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
            <span>Perform statistical analysis and visualizations</span>
          </li>
          <li className="flex items-start">
            <Save className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
            <span>Save and manage multiple workspaces</span>
          </li>
          <li className="flex items-start">
            <Download className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
            <span>Export data in Excel or CSV formats</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export const CreateWorkspaceForm = ({
  formData,
  handleInputChange,
  handleBackToLanding,
  handleSubmit
}: any) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Workspace</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Configure your research parameters and filters
        </p>
      </div>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Workspace Name
          </label>
          <input
            type="text"
            placeholder="e.g. Diabetes Research Q1 2024"
            value={formData.workspaceName}
            onChange={(e) => handleInputChange('workspaceName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Age Range
            </label>
            <input
              type="text"
              placeholder="e.g. 18-65"
              value={formData.ageRanges}
              onChange={(e) => handleInputChange('ageRanges', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="All">All</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Start Year
            </label>
            <input
              type="text"
              placeholder="e.g. 2020"
              value={formData.startYear}
              onChange={(e) => handleInputChange('startYear', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              End Year
            </label>
            <input
              type="text"
              placeholder="e.g. 2024"
              value={formData.endYear}
              onChange={(e) => handleInputChange('endYear', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Condition
            </label>
            <input
              type="text"
              placeholder="e.g. Diabetes"
              value={formData.namedCondition}
              onChange={(e) => handleInputChange('namedCondition', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Code Type
            </label>
            <select
              value={formData.conditionCodeType}
              onChange={(e) =>
                handleInputChange('conditionCodeType', e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select type</option>
              <option value="icd10">ICD-10</option>
              <option value="icd9">ICD-9</option>
              <option value="snomed">SNOMED</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Codes
            </label>
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Treatment
            </label>
            <input
              type="text"
              placeholder="e.g. Metformin"
              value={formData.namedTreatment}
              onChange={(e) => handleInputChange('namedTreatment', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Code Type
            </label>
            <select
              value={formData.treatmentCodeType}
              onChange={(e) =>
                handleInputChange('treatmentCodeType', e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select type</option>
              <option value="ndc">NDC</option>
              <option value="rxnorm">RxNorm</option>
              <option value="hcpcs">HCPCS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Codes
            </label>
            <input
              type="text"
              placeholder="e.g. 68382-023"
              value={formData.treatmentCodes}
              onChange={(e) => handleInputChange('treatmentCodes', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            type="button"
            onClick={handleBackToLanding}
            className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors duration-200"
          >
            Create Workspace
          </button>
        </div>
      </form>
    </div>
  </div>
);

export const DataGridView = ({
  activeWorkspace,
  filteredData,
  showStats,
  setShowStats,
  setShowDataSourceModal,
  handleBackToLanding,
  handleAddRow,
  handleDeleteRows,
  handleSaveWorkspace,
  handleExportExcel,
  handleExportCSV,
  onSelectionChanged,
  gridRef,
  columnDefs,
  defaultColDef
}: any) => (
  <div className="h-screen w-full bg-gray-50 flex flex-col">
    <div className="p-4 border-b bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToLanding}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {activeWorkspace?.name || 'Research Workspace'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDataSourceModal(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <Database className="w-4 h-4" />
            <span>Connect Data</span>
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{showStats ? 'Hide' : 'Show'} Stats</span>
          </button>
          <button
            onClick={handleSaveWorkspace}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Workspace</span>
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={handleAddRow}
          className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1 text-sm"
        >
          <Plus size={16} />
          <span>Add Row</span>
        </button>
        <button
          onClick={handleDeleteRows}
          disabled={filteredData.length === 0}
          className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center space-x-1 text-sm"
        >
          <Trash2 size={16} />
          <span>Delete Selected</span>
        </button>
        <button
          onClick={handleExportExcel}
          className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1 text-sm"
        >
          <Download size={16} />
          <span>Export Excel</span>
        </button>
        <button
          onClick={handleExportCSV}
          className="px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-800 flex items-center space-x-1 text-sm"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>

    <div className="flex-grow flex p-4 space-x-4 overflow-hidden">
      <div
        className={`ag-theme-alpine flex-grow h-full ${
          showStats ? 'w-2/3' : 'w-full'
        }`}
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          suppressExcelExport
          suppressCsvExport
          pagination
          paginationPageSize={50}
        />
      </div>
      {showStats && (
        <div className="w-1/3 h-full overflow-y-auto">
          <StatisticsPanel data={filteredData} />
        </div>
      )}
    </div>

    <DataSourceModal
      isOpen={false}
      onClose={() => {}}
      onConnect={() => {}}
    />
  </div>
);
