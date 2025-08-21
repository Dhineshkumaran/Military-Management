const getEquipmentTypes = async (auth) => {
  try {
    const response = await fetch('http://localhost:3000/dashboard/equipment-types', {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching equipment types:', error);
    return [];
  }
};

const getBases = async (auth) => {
  try {
    const response = await fetch(`http://localhost:3000/dashboard/bases`, {
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
    const response = await fetch(`http://localhost:3000/dashboard/recent-transfers?base_id=${baseId}&asset_type=${assetType}&start_date=${startDate}&end_date=${endDate}`, {
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
    const response = await fetch(`http://localhost:3000/dashboard/summary?base_id=${baseId}&asset_type=${assetType}&start_date=${startDate}&end_date=${endDate}`, {
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
    const response = await fetch(`http://localhost:3000/dashboard/recent-purchases?base_id=${base_id}`, {
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

export { getEquipmentTypes, getRecentTransfers, getSummary, getRecentPurchases, getBases };