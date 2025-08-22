import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  X,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BASE_URL from '../config.js';

const NetMovementModal = ({ isOpen, onClose, startDate, endDate, baseId, assetType }) => {

  const [purchases, setPurchases] = useState([]);
  const [transfersIn, setTransfersIn] = useState([]);
  const [transfersOut, setTransfersOut] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(`http://localhost:3000/purchases?start_date=${startDate}&end_date=${endDate}&base_id=${baseId}&asset_type=${assetType}`);

        const response = await fetch(`${BASE_URL}/purchases?start_date=${startDate}&end_date=${endDate}&base_id=${baseId}&asset_type=${assetType}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        const data = await response.json();
        setPurchases(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching net movement data:', error);
      }

      try {
        const response = await fetch(`${BASE_URL}/transfers-in?start_date=${startDate}&end_date=${endDate}&base_id=${baseId}&asset_type=${assetType}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        const data = await response.json();
        setTransfersIn(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching net movement data:', error);
      }

      try {
        const response = await fetch(`${BASE_URL}/transfers-out?start_date=${startDate}&end_date=${endDate}&base_id=${baseId}&asset_type=${assetType}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        const data = await response.json();
        setTransfersOut(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching net movement data:', error);
      }

    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, startDate, endDate, baseId, assetType]);

  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Net Movement Breakdown</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Purchases</p>
                    <p className="text-2xl font-bold text-green-900">
                      {purchases.reduce((sum, p) => sum + (p.totalQuantity || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Transfers In</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {transfersIn.reduce((sum, t) => sum + (t.totalQuantity || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-red-100">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-700">Transfers Out</p>
                    <p className="text-2xl font-bold text-red-900">
                      {transfersOut.reduce((sum, t) => sum + (t.totalQuantity || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Purchases</h3>
                  <p className="text-sm text-gray-600">Asset acquisitions</p>
                </div>
                <div className="p-4">
                  {purchases.length > 0 ? (
                    <div className="space-y-3">
                      {purchases.map((purchase, index) => (
                        <div key={index} className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-green-900">
                              {purchase.asset_type || 'Unknown Equipment'}
                            </p>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {(purchase.quantity || 0).toLocaleString()} units
                            </span>
                          </div>
                          <p className="text-sm text-green-700">
                            {purchase?._id?.equipmentCategory || 'General'} • ${(purchase.totalCost || 0).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No purchases in this period</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Transfers In</h3>
                  <p className="text-sm text-gray-600">Assets received</p>
                </div>
                <div className="p-4">
                  {transfersIn.length > 0 ? (
                    <div className="space-y-3">
                      {transfersIn.map((transfer, index) => (
                        <div key={index} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-blue-900">
                              {transfer.asset_type || 'Unknown Equipment'}
                            </p>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {(transfer.quantity || 0).toLocaleString()} units
                            </span>
                          </div>
                          <p className="text-sm text-blue-700">
                            {transfer?._id?.equipmentCategory || 'General'} • {transfer.count || 0} transfers
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No transfers in this period</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Transfers Out</h3>
                  <p className="text-sm text-gray-600">Assets sent</p>
                </div>
                <div className="p-4">
                  {transfersOut.length > 0 ? (
                    <div className="space-y-3">
                      {transfersOut.map((transfer, index) => (
                        <div key={index} className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-red-900">
                              {transfer.asset_type || 'Unknown Equipment'}
                            </p>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {(transfer.quantity || 0).toLocaleString()} units
                            </span>
                          </div>
                          <p className="text-sm text-red-700">
                            {transfer?._id?.equipmentCategory || 'General'} • {transfer.count || 0} transfers
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No transfers out this period</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Net Movement Calculation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Purchases</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{purchases.reduce((sum, p) => sum + (p.quantity || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transfers In</p>
                  <p className="text-2xl font-bold text-blue-600">
                    +{transfersIn.reduce((sum, t) => sum + (t.quantity || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transfers Out</p>
                  <p className="text-2xl font-bold text-red-600">
                    -{transfersOut.reduce((sum, t) => sum + (t.quantity || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">Net Movement</p>
                <p className="text-3xl font-bold text-gray-800">
                  {(
                    purchases.reduce((sum, p) => sum + (p.totalQuantity || 0), 0) +
                    transfersIn.reduce((sum, t) => sum + (t.totalQuantity || 0), 0) -
                    transfersOut.reduce((sum, t) => sum + (t.totalQuantity || 0), 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetMovementModal;