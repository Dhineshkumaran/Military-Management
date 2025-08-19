import React, { useState, useEffect } from 'react';
import NetMovementModal from './NetMovementModal';
import { getBases, getEquipmentTypes, getRecentTransfers, getSummary, getRecentPurchases } from '../api/dashboard';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  DollarSign,
  Filter,
  X,
  ShoppingCart
} from 'lucide-react';
const Dashboard = () => {

    const [summary, setSummary] = useState({
      opening_balance: 0,
      closing_balance: 0,
      purchases: 0,
      transfers_in: 0,
      transfers_out: 0,
      assigned: 0,
      expended: 0
    });
    const [recentPurchases, setRecentPurchases] = useState([]);
    const [recentTransfers, setRecentTransfers] = useState([]);
    const [bases, setBases] = useState([]);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      baseId: 0,
      equipmentType: ''
    });

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);

        const summary = await getSummary(filters.baseId, filters.equipmentType, filters.startDate, filters.endDate);
        setSummary(summary);

        const recentTransfers = await getRecentTransfers(filters.baseId, filters.equipmentType, filters.startDate, filters.endDate);
        setRecentTransfers(recentTransfers);

        const recentPurchases = await getRecentPurchases(filters.baseId);
        setRecentPurchases(recentPurchases);

        const bases = await getBases();
        setBases(bases);

        const equipmentTypes = await getEquipmentTypes();
        setEquipmentTypes(equipmentTypes);

        setLoading(false);
      };


      fetchData();
    }, [filters]);

  const [showNetMovementModal, setShowNetMovementModal] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNetMovementClick = () => {
    setShowNetMovementModal(true);
  };

  const statsCards = [
    {
      title: 'Opening Balance',
      value: summary.opening_balance,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Closing Balance',
      value: summary.closing_balance,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Net Movement',
      value: summary.purchases + summary.transfers_in - summary.transfers_out,
      icon: TrendingUp,
      color: summary.purchases + summary.transfers_in > summary.transfers_out ? 'text-green-600' : 'text-red-600',
      bgColor: summary.purchases + summary.transfers_in > summary.transfers_out ? 'bg-green-100' : 'bg-red-100',
      clickable: true,
      onClick: handleNetMovementClick,
    },
    {
      title: 'Assigned Assets',
      value: summary.transfers_in,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Expended Assets',
      value: summary.transfers_out,
      icon: TrendingDown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Purchases',
      value: summary.purchases,
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    loading
    ? (<p>Loading!</p>) 
    :
    (<div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Overview of military asset management</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Base</label>
            <select
              value={filters.baseId}
              onChange={(e) => handleFilterChange('baseId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
            >
              <option value="">All Bases</option>
              {
                bases.map((base)=>(
                  <option value={base.base_id}>{base.base_name}</option>
                ))
              }
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment Type</label>
            <select
              value={filters.equipmentType}
              onChange={(e) => handleFilterChange('equipmentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
            >
              <option value="">All Types</option>
              {
                equipmentTypes.map((equipment)=>(
                  <option value={equipment}>{equipment}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6 ${
              stat.clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
            }`}
            onClick={stat.onClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Purchases</h3>
            <p className="text-sm text-gray-600">Latest asset acquisitions</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentPurchases.slice(0, 5).map((purchase, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                  <div>
                    <p className="font-medium text-gray-800">
                      {purchase.asset_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {purchase.base_name} • {purchase.total_quantity} units
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(purchase.latest_purchase).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transfers</h3>
            <p className="text-sm text-gray-600">Latest asset movements</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentTransfers.slice(0, 5).map((transfer, index) => (
                <div key={index} className="flex items-center justify-be    tween p-3 rounded-lg bg-blue-50">
                  <div>
                    <p className="font-medium text-gray-800">
                      {transfer.asset_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transfer.from_base_name} → {transfer.to_base_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {transfer.total_quantity} units
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(transfer.latest_transfer).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showNetMovementModal && (
        <NetMovementModal
          isOpen={showNetMovementModal}
          onClose={() => setShowNetMovementModal(false)}
          startDate={filters.startDate}
          endDate={filters.endDate}
          assetType={filters.equipmentType}
          baseId={filters.baseId}
        />
      )}
    </div>
  ));
}

export default Dashboard;