import API_URL from '../config.js';

const getEquipmentTypes = async (auth) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/equipment-types`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
    console.log(response);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching equipment types:', error);
    return [];
  }
};

const getRoles = async (auth) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/roles`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

const getBases = async (auth) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/bases`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bases:', error);
    return null;
  }
};

const getRecentTransfers = async (baseId, assetType, startDate, endDate, auth) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/recent-transfers?base_id=${baseId}&asset_type=${assetType}&start_date=${startDate}&end_date=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recent transfers:', error);
    return null;
  }
};

const getSummary = async (baseId, assetType, startDate, endDate, auth) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/summary?base_id=${baseId}&asset_type=${assetType}&start_date=${startDate}&end_date=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    return null;
  }
};

const getRecentPurchases = async (base_id, auth) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/recent-purchases?base_id=${base_id}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recent purchases:', error);
    return null;
  }
};

export { getEquipmentTypes, getRecentTransfers, getSummary, getRecentPurchases, getBases, getRoles };