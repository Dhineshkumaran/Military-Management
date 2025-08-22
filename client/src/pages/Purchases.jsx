import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Package,
  DollarSign,
  User,
  Building2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

import { getBases, getEquipmentTypes } from '../api/dashboard';
import {getPurchases, createPurchase} from '../api/purchases';
import { useAuth } from '../contexts/AuthContext';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bases, setBases] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const { auth } = useAuth();

  const [formData, setFormData] = useState({
    asset_type: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [filters, setFilters] = useState({
    base_id: 0,
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    asset_type: '',
    search: ''
  });

  useEffect(()=>{
    const fetchData = async () => {
      const bases = await getBases(auth);
      setBases(bases);
      const assetTypes = await getEquipmentTypes(auth);
      setAssetTypes(assetTypes);
    };

    fetchData();
  },[])

  useEffect(()=>{
    const fetchData = async () => {
      const purchases = await getPurchases(filters, auth);
      setPurchases(purchases);
      console.log(purchases);

    };

    fetchData();
  },[filters])

  useEffect(() => {
    let filtered = purchases;

    if (filters.base_id) {
      filtered = filtered.filter(p => p.base_id == filters.base_id);
    }
    if (filters.asset_type) {
      filtered = filtered.filter(p => p.asset_type == filters.asset_type);
    }
    if (filters.start_date) {
      filtered = filtered.filter(p => p.purchase_date >= filters.start_date);
    }
    if (filters.end_date) {
      filtered = filtered.filter(p => p.purchase_date <= filters.end_date);
    }
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.base_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.asset_type.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.created_by_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredPurchases(filtered);
  }, [filters, purchases]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      base_id: '',
      start_date: '',
      end_date: '',
      asset_type: '',
      search: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.asset_type || !formData.quantity || !formData.date) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (parseInt(formData.quantity) <= 0) {
      setMessage({ type: 'error', text: 'Quantity must be greater than 0' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const newPurchase = await createPurchase(formData, auth);
      setPurchases(prev => [newPurchase, ...prev]);
      setFormData({
        asset_type: '',
        quantity: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      setMessage({ type: 'success', text: 'Purchase recorded successfully!' });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to record purchase' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
          <p className="text-gray-600">Manage asset purchases and procurement</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-300 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Purchase
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`flex items-center p-4 rounded-lg ${
          message.type === 'error' 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          {message.type === 'error' ? (
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          ) : (
            <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
          )}
          <span className={`text-sm font-medium ${
            message.type === 'error' ? 'text-red-700' : 'text-blue-700'
          }`}>
            {message.text}
          </span>
          <button 
            onClick={() => setMessage({ type: '', text: '' })}
            className="ml-auto"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Record New Purchase</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Asset Type <span className="text-red-500">*</span>
              </label>
              <select
                name="asset_type"
                value={formData.asset_type}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
                required
              >
                <option value="">Select Asset Type</option>
                {assetTypes.map(type => (
                  <option value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
                placeholder="Enter quantity"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purchase Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Recording...
                </div>
              ) : (
                'Record Purchase'
              )}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search purchases..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
            <select
              value={filters.base_id}
              onChange={(e) => handleFilterChange('base_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
            >
              <option value="">All Bases</option>
              {bases.map(base => (
                <option key={base.base_id} value={base.base_id}>{base.base_name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
            <select
              value={filters.asset_type}
              onChange={(e) => handleFilterChange('asset_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
            >
              <option value="">All Types</option>
              {assetTypes.map(type => (
                <option value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Purchase History</h3>
          <p className="text-sm text-gray-600">
            Showing {filteredPurchases.length} of {purchases.length} purchases
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 font-semibold">
                          {purchase.asset_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-semibold">
                        {purchase.quantity.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{purchase.base_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(purchase.purchase_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{purchase.created_by_name}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No purchases found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your filters or create a new purchase</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Purchases;